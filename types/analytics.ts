import { SocialPlatform } from "./social"

// src/types/analytics.ts
export interface TrendAnalysis {
  id: string
  keywords: string[]
  insights: TrendInsights
  createdAt: Date
}

export interface TrendInsights {
  hashtags: string[]
  contentIdeas: string[]
  optimalTimes: OptimalPostTime[]
  sentimentAnalysis: SentimentScore
}

export interface OptimalPostTime {
  platform: SocialPlatform
  bestDays: number[] // 0-6 (Sunday-Saturday)
  bestHours: number[] // 0-23
}

export interface PostAnalytics {
  impressions?: number
  engagements?: number
  clicks?: number
  reach?: number
  engagementRate?: number
}

export interface SentimentScore {
  positive: number
  neutral: number
  negative: number
  compound: number
}