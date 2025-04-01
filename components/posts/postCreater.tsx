import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface PostCreatorProps {
  onPostCreated: () => void
}

const PostCreator = ({ onPostCreated }: PostCreatorProps) => {
  const [content, setContent] = useState('')
  const [isScheduled, setIsScheduled] = useState(false)
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState('12:00')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      let scheduledAt = null
      if (isScheduled && date) {
        const [hours, minutes] = time.split(':').map(Number)
        const scheduledDate = new Date(date)
        scheduledDate.setHours(hours, minutes)
        scheduledAt = scheduledDate.toISOString()
      }

      const response = await fetch('/api/twitter/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tweet: content,
          scheduledAt
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to post tweet')
      }

      setContent('')
      setDate(undefined)
      setIsScheduled(false)
      onPostCreated()
    } catch (error) {
      console.error('Error posting tweet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="tweet-content">Tweet Content</Label>
        <Input
          id="tweet-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="schedule-toggle" 
          checked={isScheduled} 
          onCheckedChange={setIsScheduled} 
        />
        <Label htmlFor="schedule-toggle">Schedule Post</Label>
      </div>

      {isScheduled && (
        <div className="flex space-x-2">
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

      <Button 
        onClick={handleSubmit}
        disabled={!content || isLoading}
        className="w-full"
      >
        {isLoading ? 'Posting...' : isScheduled ? 'Schedule Tweet' : 'Post Now'}
      </Button>
    </div>
  )
}

export default PostCreator
