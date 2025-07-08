export interface PlatformStats {
  earnings: {
    total: number
    thisMonth: number
    lastMonth: number
    trend: number
  }
  projects: {
    total: number
    active: number
    completed: number
    pending: number
  }
  rating: {
    average: number
    totalReviews: number
  }
  completionRate: number
}

export interface Project {
  id: string
  title: string
  status: "active" | "completed" | "pending" | "under_review"
  client: string
  budget: number
  deadline: string
  platform: string
}

export interface Activity {
  id: string
  platform: string
  type: "proposal" | "completion" | "feedback" | "message" | "payment"
  description: string
  timestamp: string
  amount?: number
}

export interface EarningsData {
  month: string
  amount: number
  platform: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
}
