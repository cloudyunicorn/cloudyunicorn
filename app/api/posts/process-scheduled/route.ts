import { NextResponse } from 'next/server'
import { TwitterApi } from 'twitter-api-v2'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // Get all scheduled posts that are due
    const now = new Date()
    const duePosts = await prisma.scheduledPost.findMany({
      where: {
        scheduledAt: {
          lte: now
        },
        status: 'scheduled'
      },
      include: {
        account: true
      }
    })

    // Process each due post
    for (const post of duePosts) {
      try {
        const twitterClient = new TwitterApi({
          appKey: process.env.TWITTER_APP_KEY!,
          appSecret: process.env.TWITTER_APP_SECRET!,
          accessToken: post.account.accessToken,
          accessSecret: post.account.accessTokenSecret!
        })

        // Post to Twitter
        const tweetResponse = await twitterClient.v2.tweet(post.content)
        
        // Update post status
        await prisma.scheduledPost.update({
          where: { id: post.id },
          data: { 
            status: 'posted',
            postedAt: new Date() 
          }
        })

      } catch (error) {
        console.error(`Error posting scheduled tweet ${post.id}:`, error)
        // Mark as failed if error occurs
        await prisma.scheduledPost.update({
          where: { id: post.id },
          data: { status: 'failed' }
        })
      }
    }

    return NextResponse.json({ 
      message: `Processed ${duePosts.length} scheduled posts` 
    })
  } catch (error) {
    console.error('Error processing scheduled posts:', error)
    return NextResponse.json(
      { error: 'Failed to process scheduled posts' },
      { status: 500 }
    )
  }
}
