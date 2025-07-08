import type { PlatformStats, Project, Activity, ApiResponse } from "@/types/api"

class UpworkAPI {
  private baseUrl = "https://www.upwork.com/freelancers/~01c3b9cc8603f4177d"

  async getStats(): Promise<ApiResponse<PlatformStats>> {
    try {
      // Return zero data for manual entry
      await new Promise((resolve) => setTimeout(resolve, 500))

      const emptyStats: PlatformStats = {
        earnings: {
          total: 0,
          thisMonth: 0,
          lastMonth: 0,
          trend: 0,
        },
        projects: {
          total: 0,
          active: 0,
          completed: 0,
          pending: 0,
        },
        rating: {
          average: 0,
          totalReviews: 0,
        },
        completionRate: 0,
      }

      return { data: emptyStats, success: true }
    } catch (error) {
      return {
        data: {} as PlatformStats,
        success: false,
        error: "Ready for manual data entry",
      }
    }
  }

  async getProjects(): Promise<ApiResponse<Project[]>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return { data: [], success: true }
  }

  async getActivities(): Promise<ApiResponse<Activity[]>> {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return { data: [], success: true }
  }

  getProfileUrl(): string {
    return this.baseUrl
  }
}

export const upworkAPI = new UpworkAPI()
