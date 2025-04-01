import { getUserId } from '@/lib/actions/user.action'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { postId, scheduledAt } = await req.json()

    if (!process.env.CRON_SERVER_URL || !process.env.CRON_API_KEY) {
      throw new Error('Cron server configuration missing');
    }

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('X-API-Key', process.env.CRON_API_KEY);

    const response = await fetch(`${process.env.CRON_SERVER_URL}/schedule`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ postId, scheduledAt })
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

export async function GET() {
  try {
    const userId = await getUserId()
    const calendar = await prisma.contentCalendar.findFirst({
      where: { userId },
      include: {
        posts: {
          where: { platform: 'twitter' },
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
