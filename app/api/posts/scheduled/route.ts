import { getUserId } from '@/lib/actions/user.action'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { TwitterApi } from 'twitter-api-v2'

export async function POST(req: Request) {
  try {
    const { postId, scheduledAt } = await req.json()

    if (!process.env.CRON_SERVER_URL || !process.env.CRON_API_KEY) {
      throw new Error('Cron server configuration missing');
    }

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-API-Key', process.env.CRON_API_KEY);

    // Get the post to include mediaIds in the request
    const post = await prisma.scheduledPost.findUnique({
      where: { id: postId },
      select: { mediaIds: true }
    });

    console.log(post)

    const response = await fetch(`${process.env.CRON_SERVER_URL}/schedule`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        postId, 
        scheduledAt,
        mediaIds: post?.mediaIds || []
      })
    });
    
    if (!response.ok) throw new Error('Failed to schedule post');
    
    return NextResponse.json(await response.json());
  } catch (error) {
    console.error('Error scheduling post:', error);
    return NextResponse.json(
      { error: 'Failed to schedule post' },
      { status: 500 }
    )
  }
}

  // New endpoint to process published posts
  export async function PUT() {
    try {
      console.log('Checking for published posts to process...');
      const now = new Date();
      const publishedPosts = await prisma.scheduledPost.findMany({
        where: { 
          status: 'published',
          postedAt: null // Only posts that haven't been processed yet
        },
        include: {
          account: true
        }
      });

      console.log(`Found ${publishedPosts.length} published posts to process`);
      const results = [];
      const twitterApi = new TwitterApi({
        appKey: process.env.TWITTER_APP_KEY!,
        appSecret: process.env.TWITTER_APP_SECRET!,
      });

      for (const post of publishedPosts) {
        console.log(`Processing post ${post.id} for account ${post.account?.id}`);
      try {
        if (!post.account) {
          throw new Error('No linked account found');
        }

        // Verify Twitter credentials and permissions
        if (!process.env.TWITTER_APP_KEY || !process.env.TWITTER_APP_SECRET) {
          throw new Error('Twitter API credentials not configured');
        }
        if (!post.account.accessToken || !post.account.accessTokenSecret) {
          throw new Error('Twitter account not properly connected');
        }

        console.log('Initializing Twitter client for account:', post.account.id);
        const userClient = new TwitterApi({
          appKey: process.env.TWITTER_APP_KEY,
          appSecret: process.env.TWITTER_APP_SECRET,
          accessToken: post.account.accessToken,
          accessSecret: post.account.accessTokenSecret,
        });

        // Verify client can make API calls
        try {
          const accountInfo = await userClient.v2.me();
          console.log('Twitter account verified:', accountInfo.data.username);
        } catch (err) {
          console.error('Twitter API verification failed:', err);
          throw new Error('Failed to verify Twitter account permissions');
        }

        // Validate post content
        if (!post.content || post.content.length > 280) {
          throw new Error(`Invalid post content: ${post.content ? 'Exceeds 280 characters' : 'Empty content'}`);
        }

        const tweetParams: any = { 
          text: post.content,
          // Add additional validation if needed
        };

        if (post.mediaIds && post.mediaIds.length > 0) {
          if (post.mediaIds.length > 4) {
            throw new Error('Maximum 4 media attachments allowed');
          }
          tweetParams.media = { media_ids: post.mediaIds };
        }

        console.log('Posting to Twitter with params:', tweetParams);
        const tweetResponse = await userClient.v2.tweet(tweetParams);
        console.log('Twitter API response:', tweetResponse);

        // Update post with posted time
        await prisma.scheduledPost.update({
          where: { id: post.id },
          data: { 
            postedAt: new Date(),
            status: 'completed'
          }
        });

        results.push({
          postId: post.id,
          success: true,
          tweetId: tweetResponse.data.id
        });
      } catch (error) {
        console.error(`Failed to post ${post.id}:`, error);
        await prisma.scheduledPost.update({
          where: { id: post.id },
          data: { status: 'failed' }
        });
        results.push({
          postId: post.id,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error processing published posts:', error);
    return NextResponse.json(
      { error: 'Failed to process published posts' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const userId = await getUserId()
    const calendar = await prisma.contentCalendar.findFirst({
      where: { userId },
      include: {
        posts: {
          where: { 
            platform: 'twitter',
            account: {
              active: true
            }
          },
          orderBy: { scheduledAt: 'asc' }
        }
      }
    })

    if (!calendar) {
      return NextResponse.json([], { status: 200 })
    }

    return NextResponse.json(calendar.posts, { status: 200 })
  } catch (error) {
    console.error('Error fetching scheduled posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scheduled posts' },
      { status: 500 }
    )
  }
}
