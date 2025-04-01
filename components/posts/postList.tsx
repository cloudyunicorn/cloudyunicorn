import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
interface ScheduledPost {
  id: string
  content: string
  scheduledAt: string
  status: string
}

const PostList = () => {
  const [posts, setPosts] = useState<ScheduledPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchScheduledPosts = async () => {
      try {
        const response = await fetch('/api/posts/scheduled')
        if (!response.ok) {
          throw new Error('Failed to fetch scheduled posts')
        }
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error('Error fetching scheduled posts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchScheduledPosts()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (posts.length === 0) {
    return <div className="text-center text-gray-500 py-4">No scheduled posts</div>
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Scheduled Posts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{post.content}</p>
                  <p className="text-sm text-gray-500">
                    Scheduled for: {format(new Date(post.scheduledAt), 'PPpp')}
                  </p>
                </div>
                <Badge variant={post.status === 'scheduled' ? 'default' : 'secondary'}>
                  {post.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}

export default PostList
