// app/api/twitter/post/route.ts
import { getSocialAccountTokens } from "@/lib/actions/social.action";
import { getUserId } from "@/lib/actions/user.action";
import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type');
    let content: string;
    let scheduledAt: string | null = null;
    let mediaFiles: File[] = [];
    let mediaIds: string[] = [];
    let accountId: string | null = null;

    if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData();
      content = formData.get('content') as string;
      scheduledAt = formData.get('scheduledAt') as string | null;
      mediaFiles = formData.getAll('media') as File[];
    } else {
      const json = await req.json();
      content = json.content;
      mediaIds = json.mediaIds || [];
      accountId = json.accountId;
    }
    
    if (!content) {
      return NextResponse.json({ error: "Tweet content is required" }, { status: 400 });
    }

    // Resolve social account first
    let socialAccount;
    if (accountId) {
      // Cron server request - use provided accountId
      socialAccount = await prisma.socialAccount.findUnique({
        where: { id: accountId },
        include: { user: true }
      });
      if (!socialAccount) {
        return NextResponse.json({ error: "Twitter account not found" }, { status: 400 });
      }
    } else {
      // Frontend request - validate current user
      const userId = await getUserId();
      socialAccount = await prisma.socialAccount.findUnique({
        where: { userId_platform: { userId, platform: "twitter" } }
      });
      if (!socialAccount) {
        return NextResponse.json({ error: "Twitter account not connected" }, { status: 400 });
      }
    }

    // Upload media files if any
    if (mediaFiles.length > 0) {
      mediaIds = [];

      const twitterClient = new TwitterApi({
        appKey: process.env.TWITTER_APP_KEY!,
        appSecret: process.env.TWITTER_APP_SECRET!,
        accessToken: socialAccount.accessToken,
        accessSecret: socialAccount.accessTokenSecret!,
      });

      // Upload each media file
      for (const file of mediaFiles) {
        const buffer = await file.arrayBuffer();
        const mediaId = await twitterClient.v1.uploadMedia(Buffer.from(buffer), {
          mimeType: file.type
        });
        mediaIds.push(mediaId);
      }
    }

    const userId = socialAccount.userId;

    const twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_APP_KEY!,
      appSecret: process.env.TWITTER_APP_SECRET!,
      accessToken: socialAccount.accessToken,
      accessSecret: socialAccount.accessTokenSecret!,
    });

    // If scheduled for future, create scheduled post
    if (scheduledAt) {
      const scheduledDate = new Date(scheduledAt);
      const now = new Date();
      if (scheduledDate <= now) {
        return NextResponse.json({ 
          error: "Scheduled time must be in the future (including current time)" 
        }, { status: 400 });
      }

      // Get or create user's default calendar
      let calendar = await prisma.contentCalendar.findFirst({
        where: { userId }
      });

      if (!calendar) {
        calendar = await prisma.contentCalendar.create({
          data: {
            name: "My Content Calendar",
            userId
          }
        });
      }

      const scheduledPost = await prisma.scheduledPost.create({
        data: {
          content,
          mediaIds: mediaIds, // Always store mediaIds array (empty if no media)
          mediaUrl: null,
          scheduledAt: scheduledDate,
          platform: "twitter",
          calendarId: calendar.id,
          accountId: socialAccount.id,
          status: "scheduled"
        }
      });

      return NextResponse.json({ 
        message: "Tweet scheduled successfully",
        post: scheduledPost 
      });
    }

    // Immediate posting
    const tweetParams: any = { text: content };
    if (mediaIds.length > 0) {
      tweetParams.media = { 
        media_ids: mediaIds.slice(0, 4) as [string] | [string, string] | [string, string, string] | [string, string, string, string]
      };
    }

    // For immediate posts, save to database first
    let calendar = await prisma.contentCalendar.findFirst({
      where: { userId }
    });

    if (!calendar) {
      calendar = await prisma.contentCalendar.create({
        data: {
          name: "My Content Calendar",
          userId
        }
      });
    }

    const post = await prisma.scheduledPost.create({
      data: {
        content,
        mediaIds: mediaIds.length > 0 ? mediaIds : undefined,
        scheduledAt: new Date(),
        platform: "twitter",
        calendarId: calendar.id,
        accountId: socialAccount.id,
        status: "published"
      }
    });

    const tweetResponse = await twitterClient.v2.tweet(tweetParams);

    // Get media URL from tweet response
    let mediaUrl = null;
    if (mediaIds.length > 0) {
      try {
        const tweetDetails = await twitterClient.v2.singleTweet(
          tweetResponse.data.id,
          { 
            "expansions": "attachments.media_keys",
            "media.fields": "url,preview_image_url" 
          }
        );
        
        if (tweetDetails.includes?.media?.[0]?.url) {
          mediaUrl = tweetDetails.includes.media[0].url;
          await prisma.scheduledPost.update({
            where: { id: post.id },
            data: { 
              postedAt: new Date(),
              mediaUrl 
            }
          });
        }
      } catch (err) {
        console.error("Error fetching tweet details:", err);
      }
    }

    return NextResponse.json({ 
      message: "Tweet posted successfully",
      post: {
        ...post,
        postedAt: new Date(),
        mediaUrl
      },
      tweet: tweetResponse 
    });
  } catch (err: any) {
    console.error("Error posting tweet:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
