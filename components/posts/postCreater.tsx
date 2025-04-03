import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Image, Smile, MapPin, X } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from "../ui/input"
import { RiFileGifFill } from "react-icons/ri"
import { CgPoll } from "react-icons/cg"
import { Card } from "../ui/card"

interface PostCreatorProps {
  onPostCreated: () => void
}

interface MediaFile {
  file: File
  preview: string
}

const MAX_CHARS = 280
const MAX_MEDIA = 4 // Twitter allows max 4 media per tweet

const PostCreator = ({ onPostCreated }: PostCreatorProps) => {
  const [content, setContent] = useState('')
  const [isScheduled, setIsScheduled] = useState(false)
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState('12:00')
  const [isLoading, setIsLoading] = useState(false)
  const [media, setMedia] = useState<MediaFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const charsLeft = MAX_CHARS - content.length
  const isOverLimit = charsLeft < 0

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, MAX_MEDIA - media.length)
      const newMedia = files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }))
      setMedia(prev => [...prev, ...newMedia])
    }
  }

  const removeMedia = (index: number) => {
    setMedia(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (isOverLimit) return
    setIsLoading(true)
    try {
      let scheduledAt = null
      if (isScheduled && date) {
        const [hours, minutes] = time.split(':').map(Number)
        const scheduledDate = new Date(date)
        scheduledDate.setHours(hours, minutes)
        scheduledAt = scheduledDate.toISOString()
      }

      const formData = new FormData()
      formData.append('content', content)
      if (scheduledAt) {
        formData.append('scheduledAt', scheduledAt)
      }
      media.forEach((item, index) => {
        formData.append(`media`, item.file)
      })

      const response = await fetch('/api/twitter/post', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to post tweet')
      }

      setContent('')
      setDate(undefined)
      setIsScheduled(false)
      setMedia([]) // Clear media previews
      onPostCreated()
    } catch (error) {
      console.error('Error posting tweet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-4 border-b">
      <div className="flex space-x-3">
        <Avatar>
          <AvatarImage src="/default-profile.png" />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening?"
            className="text-xl border-0 shadow-none resize-none focus-visible:ring-0 min-h-[100px]"
            rows={3}
          />

          <div className="flex items-center justify-between">
          <div className="flex space-x-1 text-blue-500">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="h-4 w-4" />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleMediaChange}
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <RiFileGifFill className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <CgPoll className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Smile className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MapPin className="h-4 w-4" />
              </Button>
          </div>

          {media.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {media.map((item, index) => (
                <div key={index} className="relative">
                  <img 
                    src={item.preview} 
                    alt="Preview" 
                    className="h-24 w-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="absolute top-1 right-1 bg-gray-800 rounded-full p-1"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

            <div className="flex items-center space-x-3">
              {content.length > 0 && (
                <span className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
                  {charsLeft}
                </span>
              )}

              <div className="flex items-center space-x-2">
                <Switch 
                  id="schedule-toggle" 
                  checked={isScheduled} 
                  onCheckedChange={setIsScheduled} 
                />
                <Label htmlFor="schedule-toggle">Schedule</Label>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={!content || isLoading || isOverLimit}
                className="rounded-full px-4 font-bold bg-blue-500 hover:bg-blue-600"
              >
                {isLoading ? 'Posting...' : isScheduled ? 'Schedule' : 'Tweet'}
              </Button>
            </div>
          </div>

          {isScheduled && (
            <div className="flex space-x-2 pt-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>

              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-32"
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default PostCreator
