// app/api/twitter/post/route.ts
import { getSocialAccountTokens } from "@/lib/actions/social.action";
import { getUserId } from "@/lib/actions/user.action";
import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { content, scheduledAt } = await req.json();
    if (!content) {
      return NextResponse.json({ error: "Tweet content is required" }, { status: 400 });
    }

    const userId = await getUserId();
    // Get social account to get both tokens and ID
    const socialAccount = await prisma.socialAccount.findUnique({
      where: { userId_platform: { userId, platform: "twitter" } }
    });

    if (!socialAccount) {
      return NextResponse.json({ error: "Twitter account not connected" }, { status: 400 });
    }

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
    const twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_APP_KEY!,
      appSecret: process.env.TWITTER_APP_SECRET!,
      accessToken: socialAccount.accessToken,
      accessSecret: socialAccount.accessTokenSecret!,
    });

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
        scheduledAt: new Date(),
        postedAt: new Date(),
        platform: "twitter",
        calendarId: calendar.id,
        accountId: socialAccount.id,
        status: "published"
      }
    });

    const tweetResponse = await twitterClient.v2.tweet(content);
    return NextResponse.json({ 
      message: "Tweet posted successfully",
      post,
      tweet: tweetResponse 
    });
  } catch (err: any) {
    console.error("Error posting tweet:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
