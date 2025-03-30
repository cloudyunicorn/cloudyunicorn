import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { TwitterApi } from 'twitter-api-v2';
import prisma from '@/lib/prisma';
import { getUserId } from '@/lib/actions/user.action';

export async function GET(req: Request) {
  let urlObj: URL;
  if (req.url.includes('oauth_token') && req.url.includes('oauth_verifier')) {
    urlObj = new URL(req.url);
  } else {
    // If not found, try the referer header.
    const referer = req.headers.get('referer');
    if (!referer) {
      return NextResponse.json({ error: 'No referer header' }, { status: 400 });
    }
    urlObj = new URL(referer);
  }
  const oauth_token = urlObj.searchParams.get('oauth_token');
  const oauth_verifier = urlObj.searchParams.get('oauth_verifier');

  console.log('Callback params:', { oauth_token, oauth_verifier });

  if (!oauth_token || !oauth_verifier) {
    return NextResponse.json(
      { error: 'Missing oauth parameters' },
      { status: 400 }
    );
  }

  // Retrieve the request token secret from cookies.
  const cookieStore = await cookies();
  const oauth_token_secret = cookieStore.get(
    'twitter_oauth_token_secret'
  )?.value;
  console.log('Retrieved oauth_token_secret from cookie:', oauth_token_secret);
  if (!oauth_token_secret) {
    return NextResponse.json(
      { error: 'Missing stored oauth token secret' },
      { status: 400 }
    );
  }

  // Exchange the request token for an access token and secret.
  const client = new TwitterApi({
    appKey: process.env.TWITTER_APP_KEY!,
    appSecret: process.env.TWITTER_APP_SECRET!,
    accessToken: oauth_token,
    accessSecret: oauth_token_secret,
  });
  // let loginResult;
  // try {
  //   loginResult = await client.login(oauth_verifier);
  // } catch (error) {
  //   console.error('Twitter login exchange error:', error);
  //   return NextResponse.json(
  //     { error: 'Failed to exchange tokens' },
  //     { status: 500 }
  //   );
  // }

  // Exchange the request token for access tokens using the object-based parameter.
  const loginResult = await client.login(oauth_verifier);

  const { accessToken, accessSecret } = loginResult;

  console.log('Login result:', loginResult);

  // Get the currently authenticated user ID from your app.
  const appUserId = await getUserId();
  if (!appUserId) {
    return NextResponse.json(
      { error: 'User not authenticated' },
      { status: 401 }
    );
  }

  // Upsert Twitter tokens into the SocialAccount table.
  try {
    await prisma.socialAccount.upsert({
      where: { userId_platform: { userId: appUserId, platform: 'twitter' } },
      update: { accessToken, accessTokenSecret: accessSecret },
      create: {
        userId: appUserId,
        platform: 'twitter',
        accessToken,
        accessTokenSecret: accessSecret,
      },
    });
  } catch (err: any) {
    console.error('Error saving Twitter connection:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  // Remove the oauth token secret cookie
  const response = NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
  );
  response.cookies.delete('twitter_oauth_token_secret');
  return response;
}
