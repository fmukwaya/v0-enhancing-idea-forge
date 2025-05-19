"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
} from "recharts"
import {
  BarChart2,
  TrendingUp,
  PieChartIcon,
  Calendar,
  Download,
  RefreshCw,
  Lightbulb,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  ThumbsUp,
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Mock data for charts
const ideaCreationData = [
  { month: "Jan", count: 12 },
  { month: "Feb", count: 19 },
  { month: "Mar", count: 15 },
  { month: "Apr", count: 22 },
  { month: "May", count: 28 },
  { month: "Jun", count: 35 },
]

const ideaCategoryData = [
  { name: "Product", value: 35 },
  { name: "Technology", value: 25 },
  { name: "Process", value: 20 },
  { name: "Marketing", value: 15 },
  { name: "Other", value: 5 },
]

const ideaStatusData = [
  { name: "New", value: 30 },
  { name: "Under Review", value: 15 },
  { name: "Approved", value: 20 },
  { name: "In Progress", value: 25 },
  { name: "Implemented", value: 10 },
]

const implementationTimeData = [
  { category: "Product", time: 45 },
  { category: "Technology", time: 60 },
  { category: "Process", time: 30 },
  { category: "Marketing", time: 25 },
  { category: "Other", time: 35 },
]

const engagementData = [
  { month: "Jan", votes: 45, comments: 22 },
  { month: "Feb", votes: 52, comments: 28 },
  { month: "Mar", votes: 48, comments: 30 },
  { month: "Apr", votes: 70, comments: 40 },
  { month: "May", votes: 90, comments: 55 },
  { month: "Jun", votes: 120, comments: 70 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

interface MetricCardProps {
  title: string
  value: string | number
  change?: string
  isPositive?: boolean
  icon: React.ReactNode
}

const MetricCard = ({ title, value, change, isPositive, icon }: MetricCardProps) => {
  return (
    <Card className="border-quantum-200 dark:border-quantum-800">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
            {change && (
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className={`h-3.5 w-3.5 ${isPositive ? "text-emerald-500" : "text-red-500"}`} />
                <span className={`text-xs font-medium ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
                  {change}
                </span>
              </div>
            )}
          </div>
          <div className="p-3 rounded-full bg-quantum-100 dark:bg-quantum-800 text-quantum-600 dark:text-quantum-300">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface IdeaAnalyticsDashboardProps {
  timeRange?: "7d" | "30d" | "90d" | "1y" | "all"
  onTimeRangeChange?: (range: string) => void
  onExport?: (format: string) => void
  onRefresh?: () => void
}

export function IdeaAnalyticsDashboard({
  timeRange = "30d",
  onTimeRangeChange,
  onExport,
  onRefresh,
}: IdeaAnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange)

  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRange(value)
    if (onTimeRangeChange) {
      onTimeRangeChange(value)
    }
  }

  const handleExport = (format: string) => {
    if (onExport) {
      onExport(format)
    }
  }

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh()
    }
  }

  return (
    <Card className="w-full overflow-hidden border-quantum-600/20 bg-gradient-to-br from-white to-quantum-50/30 dark:from-quantum-950 dark:to-quantum-900">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-quantum tracking-tight flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-quantum-600" />
              Idea Analytics Dashboard
            </CardTitle>
            <CardDescription className="text-quantum-700 dark:text-quantum-300">
              Track and analyze idea performance and engagement metrics
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={selectedTimeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-[130px] bg-white dark:bg-quantum-900">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Time Range</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="border-quantum-200 dark:border-quantum-700 hover:bg-quantum-100 dark:hover:bg-quantum-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("pdf")}
              className="border-quantum-200 dark:border-quantum-700 hover:bg-quantum-100 dark:hover:bg-quantum-800"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-quantum-100/50 dark:bg-quantum-800/50">
            <TabsTrigger value="overview" className="flex-1 flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="creation" className="flex-1 flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              <span>Creation</span>
            </TabsTrigger>
            <TabsTrigger value="engagement" className="flex-1 flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Engagement</span>
            </TabsTrigger>
            <TabsTrigger value="implementation" className="flex-1 flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span>Implementation</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MetricCard
                title="Total Ideas"
                value="248"
                change="+12% vs. previous period"
                isPositive={true}
                icon={<Lightbulb className="h-5 w-5" />}
              />
              <MetricCard
                title="Implementation Rate"
                value="32%"
                change="+5% vs. previous period"
                isPositive={true}
                icon={<CheckCircle className="h-5 w-5" />}
              />
              <MetricCard
                title="Avg. Time to Implement"
                value="42 days"
                change="-8 days vs. previous period"
                isPositive={true}
                icon={<Clock className="h-5 w-5" />}
              />
              <MetricCard
                title="Active Contributors"
                value="78"
                change="+15% vs. previous period"
                isPositive={true}
                icon={<Users className="h-5 w-5" />}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="border-quantum-200 dark:border-quantum-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Ideas by Category</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ideaCategoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {ideaCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-quantum-200 dark:border-quantum-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Ideas by Status</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ideaStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {ideaStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="border-quantum-200 dark:border-quantum-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Idea Creation Trend</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      count: {
                        label: "Ideas Created",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={ideaCreationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="var(--color-count)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="creation" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MetricCard
                title="New Ideas (This Period)"
                value="42"
                change="+18% vs. previous period"
                isPositive={true}
                icon={<Lightbulb className="h-5 w-5" />}
              />
              <MetricCard
                title="Avg. Quality Score"
                value="78/100"
                change="+5 points vs. previous period"
                isPositive={true}
                icon={<BarChart2 className="h-5 w-5" />}
              />
              <MetricCard title="Top Category" value="Technology" icon={<PieChartIcon className="h-5 w-5" />} />
              <MetricCard
                title="Unique Contributors"
                value="28"
                change="+7 vs. previous period"
                isPositive={true}
                icon={<Users className="h-5 w-5" />}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="border-quantum-200 dark:border-quantum-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Idea Creation Over Time</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        count: {
                          label: "Ideas Created",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={ideaCreationData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="var(--color-count)"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-quantum-200 dark:border-quantum-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Ideas by Category</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ideaCategoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {ideaCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="border-quantum-200 dark:border-quantum-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Top Idea Contributors</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-quantum-900">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/person-with-glasses.png" alt="Alex Johnson" />
                        <AvatarFallback>AJ</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Alex Johnson</p>
                        <p className="text-sm text-muted-foreground">Product Manager</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Lightbulb className="h-4 w-4 text-quantum-600" />
                        <span className="font-medium">24 ideas</span>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900">
                        Top Contributor
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-quantum-900">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/curly-haired-person.png" alt="Maria Garcia" />
                        <AvatarFallback>MG</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">Maria Garcia</p>
                        <p className="text-sm text-muted-foreground">UX Designer</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Lightbulb className="h-4 w-4 text-quantum-600" />
                        <span className="font-medium">18 ideas</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-quantum-900">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/person-dark-hair.png" alt="James Smith" />
                        <AvatarFallback>JS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">James Smith</p>
                        <p className="text-sm text-muted-foreground">Software Engineer</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Lightbulb className="h-4 w-4 text-quantum-600" />
                        <span className="font-medium">15 ideas</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="engagement" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MetricCard
                title="Total Votes"
                value="1,248"
                change="+22% vs. previous period"
                isPositive={true}
                icon={<ThumbsUp className="h-5 w-5" />}
              />
              <MetricCard
                title="Total Comments"
                value="586"
                change="+15% vs. previous period"
                isPositive={true}
                icon={<MessageSquare className="h-5 w-5" />}
              />
              <MetricCard
                title="Avg. Votes per Idea"
                value="5.2"
                change="+0.8 vs. previous period"
                isPositive={true}
                icon={<BarChart2 className="h-5 w-5" />}
              />
              <MetricCard title="Most Engaged Category" value="Technology" icon={<Users className="h-5 w-5" />} />
            </div>
            <Card className="border-quantum-200 dark:border-quantum-800 mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Engagement Over Time</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      votes: {
                        label: "Votes",
                        color: "hsl(var(--chart-1))",
                      },
                      comments: {
                        label: "Comments",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={engagementData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="votes"
                          stroke="var(--color-votes)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="comments"
                          stroke="var(--color-comments)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-quantum-200 dark:border-quantum-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Most Engaged Ideas</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-quantum-900">
                      <div>
                        <p className="font-medium">Quantum-Inspired Project Planning Tool</p>
                        <p className="text-sm text-muted-foreground">Technology</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4 text-quantum-600" />
                          <span className="font-medium">48</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4 text-quantum-600" />
                          <span className="font-medium">32</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-quantum-900">
                      <div>
                        <p className="font-medium">AI-Powered Customer Insights Dashboard</p>
                        <p className="text-sm text-muted-foreground">Product</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4 text-quantum-600" />
                          <span className="font-medium">42</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4 text-quantum-600" />
                          <span className="font-medium">28</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-quantum-900">
                      <div>
                        <p className="font-medium">Biometric Authentication for Internal Tools</p>
                        <p className="text-sm text-muted-foreground">Security</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4 text-quantum-600" />
                          <span className="font-medium">38</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4 text-quantum-600" />
                          <span className="font-medium">24</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-quantum-200 dark:border-quantum-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Top Engagers</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-quantum-900">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/short-haired-person.png" alt="Sarah Wilson" />
                          <AvatarFallback>SW</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Sarah Wilson</p>
                          <p className="text-sm text-muted-foreground">Product Owner</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4 text-quantum-600" />
                          <span className="font-medium">86 votes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4 text-quantum-600" />
                          <span className="font-medium">42 comments</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-quantum-900">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/person-dark-hair.png" alt="James Smith" />
                          <AvatarFallback>JS</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">James Smith</p>
                          <p className="text-sm text-muted-foreground">Software Engineer</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4 text-quantum-600" />
                          <span className="font-medium">72 votes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4 text-quantum-600" />
                          <span className="font-medium">38 comments</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-quantum-900">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/person-with-glasses.png" alt="Alex Johnson" />
                          <AvatarFallback>AJ</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Alex Johnson</p>
                          <p className="text-sm text-muted-foreground">Product Manager</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4 text-quantum-600" />
                          <span className="font-medium">68 votes</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4 text-quantum-600" />
                          <span className="font-medium">35 comments</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="implementation" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <MetricCard
                title="Implementation Rate"
                value="32%"
                change="+5% vs. previous period"
                isPositive={true}
                icon={<CheckCircle className="h-5 w-5" />}
              />
              <MetricCard
                title="Avg. Time to Implement"
                value="42 days"
                change="-8 days vs. previous period"
                isPositive={true}
                icon={<Clock className="h-5 w-5" />}
              />
              <MetricCard title="Ideas in Progress" value="28" icon={<TrendingUp className="h-5 w-5" />} />
              <MetricCard
                title="Implementation Blockers"
                value="12"
                change="+3 vs. previous period"
                isPositive={false}
                icon={<AlertTriangle className="h-5 w-5" />}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="border-quantum-200 dark:border-quantum-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Implementation Time by Category</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        time: {
                          label: "Days to Implement",
                          color: "hsl(var(--chart-1))",
                        },
                      }}
                      className="h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={implementationTimeData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="time" fill="var(--color-time)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-quantum-200 dark:border-quantum-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Ideas by Status</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ideaStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {ideaStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="border-quantum-200 dark:border-quantum-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recently Implemented Ideas</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-quantum-900">
                    <div>
                      <p className="font-medium">Cross-Dimensional Data Visualization</p>
                      <p className="text-sm text-muted-foreground">Implemented on May 15, 2025</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-quantum-600" />
                        <span className="font-medium">35 days</span>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900">
                        Implemented
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-quantum-900">
                    <div>
                      <p className="font-medium">Cognitive Load Optimization System</p>
                      <p className="text-sm text-muted-foreground">Implemented on May 10, 2025</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-quantum-600" />
                        <span className="font-medium">42 days</span>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900">
                        Implemented
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-quantum-900">
                    <div>
                      <p className="font-medium">Temporal Intelligence for Decision Making</p>
                      <p className="text-sm text-muted-foreground">Implemented on May 5, 2025</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-quantum-600" />
                        <span className="font-medium">38 days</span>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900">
                        Implemented
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
