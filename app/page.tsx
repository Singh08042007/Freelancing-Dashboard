"use client"

import { useState } from "react"
import {
  Bell,
  Calendar,
  DollarSign,
  Star,
  Users,
  Briefcase,
  Clock,
  Award,
  Target,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Plus,
  Edit,
  TrendingUp,
  CheckCircle,
  MessageSquare,
  Zap,
  Shield,
  Globe,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { usePlatformData } from "@/hooks/use-platform-data"
import { upworkAPI } from "@/services/upwork-api"
import { fiverrAPI } from "@/services/fiverr-api"
import { truelancerAPI } from "@/services/truelancer-api"
import { internshalaAPI } from "@/services/internshala-api"
import { ContactForm } from "@/components/contact-form"

const platformConfig = {
  upwork: {
    name: "Upwork",
    color: "#14a800",
    api: upworkAPI,
    icon: "💼",
    description: "Global freelancing platform",
  },
  fiverr: {
    name: "Fiverr",
    color: "#1dbf73",
    api: fiverrAPI,
    icon: "🎯",
    description: "Creative services marketplace",
  },
  truelancer: {
    name: "Truelancer",
    color: "#ff6b35",
    api: truelancerAPI,
    icon: "🚀",
    description: "Indian freelancing hub",
  },
  internshala: {
    name: "Internshala",
    color: "#00a5ec",
    api: internshalaAPI,
    icon: "🎓",
    description: "Student & professional platform",
  },
}

const professionalHighlights = [
  {
    icon: <Shield className="h-5 w-5 text-blue-500" />,
    title: "Verified Professional",
    description: "Trusted across multiple platforms",
  },
  {
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    title: "Quick Turnaround",
    description: "Fast delivery guaranteed",
  },
  {
    icon: <Globe className="h-5 w-5 text-green-500" />,
    title: "Global Experience",
    description: "Serving clients worldwide",
  },
]

export default function FreelancingDashboard() {
  const { upwork, fiverr, truelancer, internshala, refetchAll, isLoading } = usePlatformData()
  const [selectedTimeframe, setSelectedTimeframe] = useState("6months")
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)

  // Calculate totals from API data
  const calculateTotals = () => {
    const platforms = [upwork, fiverr, truelancer, internshala]
    const validStats = platforms.filter((p) => p.stats).map((p) => p.stats!)

    if (validStats.length === 0) return { totalEarnings: 0, totalProjects: 0, avgRating: 0, avgCompletion: 0 }

    const totalEarnings = validStats.reduce((sum, stats) => sum + stats.earnings.total, 0)
    const totalProjects = validStats.reduce((sum, stats) => sum + stats.projects.total, 0)
    const avgRating =
      validStats.length > 0 ? validStats.reduce((sum, stats) => sum + stats.rating.average, 0) / validStats.length : 0
    const avgCompletion =
      validStats.length > 0 ? validStats.reduce((sum, stats) => sum + stats.completionRate, 0) / validStats.length : 0

    return { totalEarnings, totalProjects, avgRating, avgCompletion }
  }

  const { totalEarnings, totalProjects, avgRating, avgCompletion } = calculateTotals()

  // Combine all activities
  const allActivities = [
    ...upwork.activities,
    ...fiverr.activities,
    ...truelancer.activities,
    ...internshala.activities,
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // Generate empty earnings chart data
  const generateEarningsData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    return months.map((month) => ({
      month,
      upwork: 0,
      fiverr: 0,
      truelancer: 0,
      internshala: 0,
    }))
  }

  const earningsData = generateEarningsData()

  // Generate empty project status data
  const projectStatusData = [
    { name: "Completed", value: 0, color: "#10b981" },
    { name: "Active", value: 0, color: "#f59e0b" },
    { name: "Pending", value: 0, color: "#ef4444" },
    { name: "Under Review", value: 0, color: "#8b5cf6" },
  ]

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  const PlatformCard = ({
    name,
    data,
    color,
    api,
    icon,
    description,
  }: {
    name: string
    data: any
    color: string
    api: any
    icon: string
    description: string
  }) => {
    const handleCardClick = () => {
      window.open(api.getProfileUrl(), "_blank", "noopener,noreferrer")
    }

    if (data.loading) {
      return (
        <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-3 rounded-full" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-2 w-full" />
          </CardContent>
        </Card>
      )
    }

    if (data.error) {
      return (
        <Card
          className="border-2 border-dashed border-primary/30 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-primary/50 bg-gradient-to-br from-background to-muted/20"
          onClick={handleCardClick}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span className="text-xl">{icon}</span>
              <div>
                <div>{name}</div>
                <div className="text-xs text-muted-foreground font-normal">{description}</div>
              </div>
            </CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary/10 to-primary/20 flex items-center justify-center">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Ready to Showcase</h3>
              <p className="text-xs text-muted-foreground mb-3">Click to visit platform & start earning</p>
              <Badge variant="outline" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                Growth Opportunity
              </Badge>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (!data.stats) return null

    const hasData = data.stats.earnings.total > 0 || data.stats.projects.total > 0

    return (
      <Card
        className={`cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 ${
          hasData
            ? "bg-gradient-to-br from-background to-muted/20 hover:border-primary/50"
            : "border-2 border-dashed border-primary/30 hover:border-primary/50 bg-gradient-to-br from-background to-muted/20"
        }`}
        onClick={handleCardClick}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <div>
              <div>{name}</div>
              <div className="text-xs text-muted-foreground font-normal">{description}</div>
            </div>
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <ExternalLink className="h-3 w-3 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {!hasData ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-primary/10 to-primary/20 flex items-center justify-center">
                <Edit className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-sm mb-1">No earnings yet</h3>
              <p className="text-xs text-muted-foreground mb-2">Building success story...</p>
              <Badge variant="secondary" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active Profile
              </Badge>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Earnings</span>
                <span className="font-semibold text-green-600">${data.stats.earnings.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Projects</span>
                <span className="font-semibold">{data.stats.projects.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Rating</span>
                <div className="flex items-center">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-semibold">
                    {data.stats.rating.average > 0 ? data.stats.rating.average.toFixed(1) : "No reviews yet"}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                  <span className="text-sm font-semibold">{data.stats.completionRate}%</span>
                </div>
                <Progress value={data.stats.completionRate} className="h-2" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                  <AvatarImage src="/images/profile.jpg" alt="Deepinder Singh - Professional Freelancer" />
                  <AvatarFallback className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold">
                    DS
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Deepinder Singh
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  Professional Freelancer • Available for Projects
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={refetchAll} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Last 30 days
              </Button>
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Professional Highlights */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {professionalHighlights.map((highlight, index) => (
              <Card key={index} className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
                <CardContent className="flex items-center gap-3 p-4">
                  {highlight.icon}
                  <div>
                    <h3 className="font-semibold text-sm">{highlight.title}</h3>
                    <p className="text-xs text-muted-foreground">{highlight.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Welcome Message */}
        <Alert className="mb-8 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
          <AlertCircle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-foreground">
            <strong>🚀 Building Success Across Platforms!</strong> This dashboard tracks my freelancing journey across
            multiple platforms. Click any platform card to view my profile and discuss your project needs.
          </AlertDescription>
        </Alert>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalEarnings > 0 ? `$${totalEarnings.toLocaleString()}` : "Building Portfolio"}
              </div>
              <p className="text-xs opacity-80">
                {totalEarnings === 0 ? "Ready to start earning" : "Across all platforms"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects Completed</CardTitle>
              <Briefcase className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProjects > 0 ? totalProjects : "Starting Journey"}</div>
              <p className="text-xs opacity-80">
                {totalProjects === 0 ? "First project coming soon" : "Successfully delivered"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Client Rating</CardTitle>
              <Star className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgRating > 0 ? avgRating.toFixed(1) : "No reviews yet"}</div>
              <p className="text-xs opacity-80">{avgRating === 0 ? "Building reputation" : "Excellent feedback"}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Target className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {avgCompletion > 0 ? Math.round(avgCompletion) + "%" : "100% Committed"}
              </div>
              <p className="text-xs opacity-80">{avgCompletion === 0 ? "Quality guaranteed" : "Project completion"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Platform Overview - Clickable Cards */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Platform Presence
            </h2>
            <Badge
              variant="secondary"
              className="text-xs flex items-center gap-1 cursor-pointer hover:bg-secondary/80 transition-colors bg-gradient-to-r from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30"
              onClick={() => setIsContactFormOpen(true)}
            >
              <MessageSquare className="h-3 w-3" />
              Click to get in touch
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mb-6">
            Active across multiple platforms to serve diverse client needs. Click any card to view my profile and start
            a conversation about your project.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <PlatformCard
            name={platformConfig.upwork.name}
            data={upwork}
            color={platformConfig.upwork.color}
            api={platformConfig.upwork.api}
            icon={platformConfig.upwork.icon}
            description={platformConfig.upwork.description}
          />
          <PlatformCard
            name={platformConfig.fiverr.name}
            data={fiverr}
            color={platformConfig.fiverr.color}
            api={platformConfig.fiverr.api}
            icon={platformConfig.fiverr.icon}
            description={platformConfig.fiverr.description}
          />
          <PlatformCard
            name={platformConfig.truelancer.name}
            data={truelancer}
            color={platformConfig.truelancer.color}
            api={platformConfig.truelancer.api}
            icon={platformConfig.truelancer.icon}
            description={platformConfig.truelancer.description}
          />
          <PlatformCard
            name={platformConfig.internshala.name}
            data={internshala}
            color={platformConfig.internshala.color}
            api={platformConfig.internshala.api}
            icon={platformConfig.internshala.icon}
            description={platformConfig.internshala.description}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Earnings Trend */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Earnings Growth
              </CardTitle>
              <CardDescription>
                {totalEarnings === 0
                  ? "Track your earnings growth across all platforms"
                  : "Monthly earnings across all platforms"}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <ChartContainer
                config={{
                  upwork: { label: "Upwork", color: platformConfig.upwork.color },
                  fiverr: { label: "Fiverr", color: platformConfig.fiverr.color },
                  truelancer: { label: "Truelancer", color: platformConfig.truelancer.color },
                  internshala: { label: "Internshala", color: platformConfig.internshala.color },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="upwork" stroke={platformConfig.upwork.color} strokeWidth={2} />
                    <Line type="monotone" dataKey="fiverr" stroke={platformConfig.fiverr.color} strokeWidth={2} />
                    <Line
                      type="monotone"
                      dataKey="truelancer"
                      stroke={platformConfig.truelancer.color}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="internshala"
                      stroke={platformConfig.internshala.color}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
              {totalEarnings === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/90 rounded-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary/10 to-primary/20 flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Growth Tracking Ready</h3>
                    <p className="text-sm text-muted-foreground">Your earnings journey will be visualized here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Project Status */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Project Portfolio
              </CardTitle>
              <CardDescription>
                {totalProjects === 0
                  ? "Project distribution will be shown as you complete work"
                  : "Current project distribution"}
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <ChartContainer
                config={{
                  completed: { label: "Completed", color: "#10b981" },
                  active: { label: "Active", color: "#f59e0b" },
                  pending: { label: "Pending", color: "#ef4444" },
                  underReview: { label: "Under Review", color: "#8b5cf6" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => (totalProjects > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : "")}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              {totalProjects === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/90 rounded-lg">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary/10 to-primary/20 flex items-center justify-center">
                      <Briefcase className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Portfolio Building</h3>
                    <p className="text-sm text-muted-foreground">Project distribution will appear here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Activity Timeline
            </CardTitle>
            <CardDescription>
              {allActivities.length === 0
                ? "Your professional activities and milestones will be tracked here"
                : "Latest updates from all platforms"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {allActivities.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary/10 to-primary/20 flex items-center justify-center">
                  <MessageSquare className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Activity Feed Coming Soon</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Your professional journey, client interactions, and project milestones will be displayed here as you
                  build your freelancing career.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  {Object.entries(platformConfig).map(([key, config]) => (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(config.api.getProfileUrl(), "_blank")}
                      className="hover:scale-105 transition-transform"
                    >
                      <span className="mr-2">{config.icon}</span>
                      Visit {config.name}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {allActivities.slice(0, 10).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {activity.type === "proposal" && <Briefcase className="h-4 w-4 text-blue-500" />}
                      {activity.type === "completion" && <Award className="h-4 w-4 text-green-500" />}
                      {activity.type === "feedback" && <Star className="h-4 w-4 text-yellow-500" />}
                      {activity.type === "message" && <Users className="h-4 w-4 text-purple-500" />}
                      {activity.type === "payment" && <DollarSign className="h-4 w-4 text-green-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium truncate">{activity.description}</p>
                        <Badge variant="outline" className="ml-2">
                          {activity.platform}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                    {activity.amount && <div className="text-sm font-semibold text-green-600">+${activity.amount}</div>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <ContactForm isOpen={isContactFormOpen} onClose={() => setIsContactFormOpen(false)} />
      </main>
    </div>
  )
}
