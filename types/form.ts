import { SocialPlatform } from "./social"

// src/types/forms.ts
export interface SchedulePostForm {
  content: string
  platforms: SocialPlatform[]
  scheduleAt: Date
  media?: File[]
  repeat?: {
    frequency: 'daily' | 'weekly' | 'monthly'
    endDate?: Date
  }
}

export interface TrendAnalysisForm {
  keywords: string[]
  platforms: SocialPlatform[]
  timeRange: '24h' | '7d' | '30d'
}