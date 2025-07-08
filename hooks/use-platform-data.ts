"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { PlatformStats, Project, Activity } from "@/types/api"
import { upworkAPI } from "@/services/upwork-api"
import { fiverrAPI } from "@/services/fiverr-api"
import { truelancerAPI } from "@/services/truelancer-api"
import { internshalaAPI } from "@/services/internshala-api"

interface PlatformData {
  stats: PlatformStats | null
  projects: Project[]
  activities: Activity[]
  loading: boolean
  error: string | null
}

export function usePlatformData() {
  const [upworkData, setUpworkData] = useState<PlatformData>({
    stats: null,
    projects: [],
    activities: [],
    loading: true,
    error: null,
  })

  const [fiverrData, setFiverrData] = useState<PlatformData>({
    stats: null,
    projects: [],
    activities: [],
    loading: true,
    error: null,
  })

  const [truelancerData, setTruelancerData] = useState<PlatformData>({
    stats: null,
    projects: [],
    activities: [],
    loading: true,
    error: null,
  })

  const [internshalaData, setInternshalaData] = useState<PlatformData>({
    stats: null,
    projects: [],
    activities: [],
    loading: true,
    error: null,
  })

  const fetchPlatformData = async (
    api: any,
    setter: React.Dispatch<React.SetStateAction<PlatformData>>,
    platformName: string,
  ) => {
    try {
      setter((prev) => ({ ...prev, loading: true, error: null }))

      const [statsRes, projectsRes, activitiesRes] = await Promise.all([
        api.getStats(),
        api.getProjects(),
        api.getActivities(),
      ])

      if (!statsRes.success) {
        throw new Error(statsRes.error || `Failed to fetch ${platformName} stats`)
      }

      setter({
        stats: statsRes.data,
        projects: projectsRes.success ? projectsRes.data : [],
        activities: activitiesRes.success ? activitiesRes.data : [],
        loading: false,
        error: null,
      })
    } catch (error) {
      setter((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : `Failed to fetch ${platformName} data`,
      }))
    }
  }

  useEffect(() => {
    // Fetch data from all platforms
    fetchPlatformData(upworkAPI, setUpworkData, "Upwork")
    fetchPlatformData(fiverrAPI, setFiverrData, "Fiverr")
    fetchPlatformData(truelancerAPI, setTruelancerData, "Truelancer")
    fetchPlatformData(internshalaAPI, setInternshalaData, "Internshala")
  }, [])

  const refetchAll = () => {
    fetchPlatformData(upworkAPI, setUpworkData, "Upwork")
    fetchPlatformData(fiverrAPI, setFiverrData, "Fiverr")
    fetchPlatformData(truelancerAPI, setTruelancerData, "Truelancer")
    fetchPlatformData(internshalaAPI, setInternshalaData, "Internshala")
  }

  return {
    upwork: upworkData,
    fiverr: fiverrData,
    truelancer: truelancerData,
    internshala: internshalaData,
    refetchAll,
    isLoading: upworkData.loading || fiverrData.loading || truelancerData.loading || internshalaData.loading,
  }
}
