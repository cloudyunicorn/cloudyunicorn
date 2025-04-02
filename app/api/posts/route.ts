import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.scheduledPost.findMany({
      orderBy: { scheduledAt: 'asc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { content, mediaUrl, scheduledAt, platform, accountId, calendarId } = await req.json();

    const isImmediatePost = new Date(scheduledAt) <= new Date();
    const newPost = await prisma.scheduledPost.create({
      data: {
        content,
        mediaUrl,
        scheduledAt: new Date(scheduledAt),
        postedAt: isImmediatePost ? new Date() : null,
        status: isImmediatePost ? 'published' : 'scheduled',
        platform,
        accountId,
        calendarId,
      },
    });

    return NextResponse.json(newPost);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
