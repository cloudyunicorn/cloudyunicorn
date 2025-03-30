import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

export async function GET() {
  const callbackUrl = process.env.NEXT_PUBLIC_APP_URL + "/auth/twitter/callback";
  const client = new TwitterApi({
    appKey: process.env.TWITTER_APP_KEY!,
    appSecret: process.env.TWITTER_APP_SECRET!,
  });

  
  const authLink = await client.generateAuthLink(callbackUrl);
  
  // Create a response object with the authLink data
  const response = NextResponse.json({ authUrl: authLink.url, oauth_token: authLink.oauth_token });
  
  // Set the oauth_token_secret in an HTTP-only cookie for later use.
  // This API is available in Next.js 13.4+; if you see an error here,
  // update Next.js or use the cookies() helper from "next/headers".
  response.cookies.set("twitter_oauth_token_secret", authLink.oauth_token_secret, {
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  
  return response;
}
