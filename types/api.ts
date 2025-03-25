// src/types/api.ts
export interface ApiResponse<T> {
  data?: T
  error?: ApiError
  success: boolean
}

export interface ApiError {
  code: string
  message: string
  details?: any
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}