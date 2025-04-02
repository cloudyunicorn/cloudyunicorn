import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface PostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  posts: {
    id: string
    content: string
    scheduledAt: Date
    postedAt?: Date
    platform: string
    status: string
  }[]
}

export function PostDialog({ open, onOpenChange, posts }: PostDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {posts.length === 1 
              ? `Post Details (${posts[0].platform})` 
              : `${posts.length} Posts`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="space-y-2">
              <div className="flex items-center gap-2">
                {post.platform === "twitter" ? (
                  <X className="h-4 w-4 text-blue-500" />
                ) : (
                  <CalendarIcon className="h-4 w-4 text-[#0A66C2]" />
                )}
                <Badge variant={post.postedAt ? "default" : "secondary"}>
                  {post.postedAt ? "Posted" : post.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {post.postedAt 
                    ? `Posted at: ${format(new Date(post.postedAt), "PPpp")}`
                    : `Scheduled for: ${format(new Date(post.scheduledAt), "PPpp")}`}
                </span>
              </div>

              <div className="rounded-lg border p-4">
                <p className="whitespace-pre-line">{post.content}</p>
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
