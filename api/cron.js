// Vercel Cron Job endpoint
import { PrismaClient } from '@prisma/client'
import { TwitterApi } from 'twitter-api-v2'

const prisma = new PrismaClient()

export default async (req, res) => {
  try {
    // Get due posts
    const now = new Date()
    const duePosts = await prisma.scheduledPost.findMany({
      where: {
        scheduledAt: { lte: now },
        status: 'scheduled'
      },
      include: { account: true }
    })

    // Process each post
    for (const post of duePosts) {
      try {
        const twitterClient = new TwitterApi({
          appKey: process.env.TWITTER_APP_KEY,
          appSecret: process.env.TWITTER_APP_SECRET,
          accessToken: post.account.accessToken,
          accessSecret: post.account.accessTokenSecret
        })

        await twitterClient.v2.tweet(post.content)
        
        await prisma.scheduledPost.update({
          where: { id: post.id },
          data: { 
            status: 'posted',
            postedAt: new Date() 
          }
        })
      } catch (error) {
        console.error(`Failed to post ${post.id}:`, error)
        await prisma.scheduledPost.update({
          where: { id: post.id },
          data: { status: 'failed' }
        })
      }
    }

    res.status(200).json({ 
      message: `Processed ${duePosts.length} scheduled posts` 
    })
  } catch (error) {
    console.error('Cron job failed:', error)
    res.status(500).json({ error: error.message })
  }
}
