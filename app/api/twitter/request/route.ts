import { NextResponse } from "next/server";
import { TwitterApi } from "twitter-api-v2";

export async function GET() {
  // Validate environment variables
  if (!process.env.TWITTER_APP_KEY || !process.env.TWITTER_APP_SECRET) {
    console.error('Missing Twitter API credentials');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    console.error('Missing NEXT_PUBLIC_APP_URL');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  // Construct callback URL
  const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/twitter/callback`;

  let client;
  try {
    client = new TwitterApi({
      appKey: process.env.TWITTER_APP_KEY,
      appSecret: process.env.TWITTER_APP_SECRET
    });
  } catch (err) {
    console.error('Error initializing Twitter client:', err);
    return NextResponse.json(
      { error: 'Failed to initialize Twitter API client' },
      { status: 500 }
    );
  }

  let authLink;
  try {
    authLink = await client.generateAuthLink(callbackUrl);
    if (!authLink?.url || !authLink?.oauth_token || !authLink?.oauth_token_secret) {
      throw new Error('Invalid auth link response from Twitter');
    }
  } catch (err) {
    console.error('Error generating Twitter auth link:', err);
    return NextResponse.json(
      { error: 'Failed to generate Twitter authentication link' },
      { status: 500 }
    );
  }
  
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
