import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";
import prisma from "@/lib/prisma";
import { getUserId } from "@/lib/actions/user.action";

export async function GET(req: Request) {
  try {
    // Get the currently authenticated user's ID
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }
    
    // Retrieve Twitter tokens from the SocialAccount table
    const socialAccount = await prisma.socialAccount.findUnique({
      where: { userId_platform: { userId, platform: "twitter" } },
    });
    
    if (!socialAccount || !socialAccount.accessToken || !socialAccount.accessTokenSecret) {
      return NextResponse.json({ error: "Twitter account not connected" }, { status: 404 });
    }
    
    // Initialize Twitter client using OAuth 1.0a user context
    const twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_APP_KEY!,
      appSecret: process.env.TWITTER_APP_SECRET!,
      accessToken: socialAccount.accessToken,
      accessSecret: socialAccount.accessTokenSecret,
    });
    
    // Fetch user profile information; include email if permitted
    const profileData = await twitterClient.v1.verifyCredentials({ include_email: true });
    
    return NextResponse.json(profileData, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching Twitter profile:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
