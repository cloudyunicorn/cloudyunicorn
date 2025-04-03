import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '../ui/spinner';
import { useData } from '@/context/DataContext';
import Image from 'next/image';

interface ScheduledPost {
  id: string;
  content: string;
  scheduledAt: string;
  postedAt?: string;
  status: string;
  mediaIds?: string[];
  mediaUrl?: string;
  accountId?: string;
}

const PostList = () => {
  const { scheduledPosts, twitterStatus } = useData();
  const isLoading = twitterStatus === null;
  const hasNoTwitter = twitterStatus === false;
  
  const posts = [...scheduledPosts].sort(
    (a: ScheduledPost, b: ScheduledPost) =>
      new Date(b.scheduledAt).getTime() -
      new Date(a.scheduledAt).getTime()
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-4 py-4">
        <Spinner />
        <div>Loading Posts...</div>
      </div>
    );
  }

  if (hasNoTwitter) {
    return (
      <div className="text-center text-gray-500 py-4">
        Connect Twitter account to view posts
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">No scheduled posts</div>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Twitter Posts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {posts.map((post: ScheduledPost) => (
          <Card key={post.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{post.content}</p>
                  {post.mediaUrl && (
                    <div className="mt-2">
                      <div className="relative h-48 w-full">
                        <Image
                          src={post.mediaUrl}
                          alt="Post media"
                          fill
                          className="rounded-md object-cover"
                          unoptimized
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    {post.postedAt
                      ? `Posted at: ${format(new Date(post.postedAt), 'PPpp')}`
                      : `Scheduled for: ${format(new Date(post.scheduledAt), 'PPpp')}`}
                  </p>
                </div>
                <Badge
                  variant={
                    post.postedAt
                      ? 'default'
                      : post.status === 'scheduled'
                        ? 'default'
                        : 'secondary'
                  }
                >
                  {post.postedAt ? 'Posted' : post.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default PostList;
