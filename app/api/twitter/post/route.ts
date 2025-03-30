// app/api/twitter/post/route.ts
import { getSocialAccountTokens } from "@/lib/actions/social.action";
import { getUserId } from "@/lib/actions/user.action";
import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

export async function POST(req: Request) {
  try {
    const { tweet } = await req.json();
    if (!tweet) {
      return NextResponse.json({ error: "Tweet content is required" }, { status: 400 });
    }

    // Retrieve the current user's id (from your server action)
    const userId = await getUserId();

    // Retrieve the social account tokens for Twitter
    const tokens = await getSocialAccountTokens(userId, "twitter");

    // Create a Twitter client using the OAuth 1.0a credentials
    const twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_APP_KEY!,
      appSecret: process.env.TWITTER_APP_SECRET!,
      accessToken: tokens.accessToken,
      accessSecret: tokens.accessTokenSecret!,
    });

    // Post the tweet (using Twitter API v1.1 for user-context actions)
    const tweetResponse = await twitterClient.v2.tweet(tweet);
    return NextResponse.json({ message: "Tweet posted successfully", tweet: tweetResponse });
  } catch (err: any) {
    console.error("Error posting tweet:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
