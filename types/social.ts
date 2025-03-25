import { PostAnalytics } from "./analytics"

// src/types/social.ts
export type SocialPlatform = 'twitter' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok'

export interface SocialAccount {
  id: string
  platform: SocialPlatform
  accessToken: string
  username?: string
  userId: string
  lastSynced?: Date
}

export interface ScheduledPost {
  id: string
  content: string
  mediaUrls?: string[]
  scheduledAt: Date
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  platform: SocialPlatform
  accountId: string
  calendarId?: string
  analytics?: PostAnalytics
}

export interface ContentCalendar {
  id: string
  name: string
  userId: string
  posts: ScheduledPost[]
  colorScheme?: string
}