import { getUserId } from '@/lib/actions/user.action'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

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
