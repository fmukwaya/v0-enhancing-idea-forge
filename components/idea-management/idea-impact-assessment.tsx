"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, LineChart, Line } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Share2, TrendingUp, Users, Clock, DollarSign, Lightbulb } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface MetricCardProps {
  title: string
  value: string
  change: string
  isPositive: boolean
  icon: React.ReactNode
}

const MetricCard = ({ title, value, change, isPositive, icon }: MetricCardProps) => {
  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg bg-white dark:bg-quantum-900">
      <div className="p-2 rounded-md bg-quantum-100 dark:bg-quantum-800 text-quantum-700 dark:text-quantum-300">
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
        <div className="flex items-center gap-1 mt-1">
          <TrendingUp className={`h-3.5 w-3.5 ${isPositive ? "text-emerald-500" : "text-red-500"}`} />
          <span className={`text-xs font-medium ${isPositive ? "text-emerald-500" : "text-red-500"}`}>{change}</span>
        </div>
      </div>
    </div>
  )
}

const impactData = [
  { month: "Jan", revenue: 12000, cost: 5000, satisfaction: 85 },
  { month: "Feb", revenue: 15000, cost: 5200, satisfaction: 87 },
  { month: "Mar", revenue: 18000, cost: 5400, satisfaction: 90 },
  { month: "Apr", revenue: 22000, cost: 5600, satisfaction: 92 },
  { month: "May", revenue: 26000, cost: 5800, satisfaction: 94 },
  { month: "Jun", revenue: 32000, cost: 6000, satisfaction: 95 },
]

const feedbackData = [
  { category: "Usability", positive: 85, negative: 15 },
  { category: "Performance", positive: 92, negative: 8 },
  { category: "Features", positive: 78, negative: 22 },
  { category: "Design", positive: 88, negative: 12 },
  { category: "Value", positive: 80, negative: 20 },
]

interface IdeaImpactAssessmentProps {
  ideaId: string
  ideaTitle: string
  implementationDate: string
  impactScore: number
  roi: string
  feasibilityScore: number
  successRate: number
}

export function IdeaImpactAssessment({
  ideaId,
  ideaTitle,
  implementationDate,
  impactScore,
  roi,
  feasibilityScore = 85,
  successRate = 78,
}: IdeaImpactAssessmentProps) {
  const [activeTab, setActiveTab] = useState("metrics")

  const getImpactScoreBadge = () => {
    if (impactScore >= 90) {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200">Exceptional</Badge>
      )
    } else if (impactScore >= 75) {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">High</Badge>
    } else if (impactScore >= 60) {
      return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">Moderate</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200">Low</Badge>
    }
  }

  const getFeasibilityBadge = () => {
    if (feasibilityScore >= 90) {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200">
          Highly Feasible
        </Badge>
      )
    } else if (feasibilityScore >= 75) {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">Feasible</Badge>
    } else if (feasibilityScore >= 60) {
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">Moderately Feasible</Badge>
      )
    } else {
      return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200">Challenging</Badge>
    }
  }

  const getSuccessRateBadge = () => {
    if (successRate >= 90) {
      return (
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200">High Success</Badge>
      )
    } else if (successRate >= 75) {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">Good Success</Badge>
    } else if (successRate >= 60) {
      return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">Moderate Success</Badge>
    } else {
      return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200">Risky</Badge>
    }
  }

  return (
    <Card className="w-full overflow-hidden border-quantum-600/20 bg-gradient-to-br from-white to-quantum-50/30 dark:from-quantum-950 dark:to-quantum-900">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-quantum tracking-tight">{ideaTitle}</CardTitle>
            <CardDescription className="text-quantum-700 dark:text-quantum-300">
              Implemented on {implementationDate}
            </CardDescription>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Impact Score:</span>
              {getImpactScoreBadge()}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Feasibility:</span>
              {getFeasibilityBadge()}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Success Rate:</span>
              {getSuccessRateBadge()}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-quantum-100/50 dark:bg-quantum-800/50">
            <TabsTrigger value="metrics" className="flex-1">
              Key Metrics
            </TabsTrigger>
            <TabsTrigger value="financial" className="flex-1">
              Financial Impact
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex-1">
              User Feedback
            </TabsTrigger>
          </TabsList>
          <TabsContent value="metrics" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <MetricCard
                title="User Adoption"
                value="94%"
                change="+12% since launch"
                isPositive={true}
                icon={<Users className="h-5 w-5" />}
              />
              <MetricCard
                title="Time Saved"
                value="1,240 hrs"
                change="+18% efficiency"
                isPositive={true}
                icon={<Clock className="h-5 w-5" />}
              />
              <MetricCard
                title="ROI"
                value={roi}
                change="+24% vs projection"
                isPositive={true}
                icon={<DollarSign className="h-5 w-5" />}
              />
              <MetricCard
                title="Innovation Score"
                value={`${impactScore}/100`}
                change="+8 points"
                isPositive={true}
                icon={<Lightbulb className="h-5 w-5" />}
              />
            </div>
            <div className="h-64 mt-6">
              <p className="text-sm font-medium mb-2">Trend Over Time</p>
              <ChartContainer
                config={{
                  satisfaction: {
                    label: "User Satisfaction",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={impactData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="satisfaction"
                      stroke="var(--color-satisfaction)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
          <TabsContent value="financial" className="mt-4">
            <div className="h-64 mb-6">
              <p className="text-sm font-medium mb-2">Revenue vs. Cost</p>
              <ChartContainer
                config={{
                  revenue: {
                    label: "Revenue",
                    color: "hsl(var(--chart-1))",
                  },
                  cost: {
                    label: "Cost",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={impactData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="revenue" fill="var(--color-revenue)" />
                    <Bar dataKey="cost" fill="var(--color-cost)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg bg-white dark:bg-quantum-900">
                <p className="text-sm text-muted-foreground">Total Revenue Generated</p>
                <p className="text-2xl font-semibold">$125,000</p>
              </div>
              <div className="p-4 border rounded-lg bg-white dark:bg-quantum-900">
                <p className="text-sm text-muted-foreground">Implementation Cost</p>
                <p className="text-2xl font-semibold">$33,000</p>
              </div>
              <div className="p-4 border rounded-lg bg-white dark:bg-quantum-900">
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p className="text-2xl font-semibold text-emerald-600">$92,000</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="feedback" className="mt-4">
            <div className="h-64 mb-6">
              <p className="text-sm font-medium mb-2">User Feedback by Category</p>
              <ChartContainer
                config={{
                  positive: {
                    label: "Positive",
                    color: "hsl(var(--chart-1))",
                  },
                  negative: {
                    label: "Negative",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={feedbackData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="positive" fill="var(--color-positive)" />
                    <Bar dataKey="negative" fill="var(--color-negative)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg bg-white dark:bg-quantum-900">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                  <p className="font-medium">Sarah Johnson, Product Manager</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  "This idea has transformed our workflow efficiency by at least 30%. The team is much more productive
                  now."
                </p>
              </div>
              <div className="p-3 border rounded-lg bg-white dark:bg-quantum-900">
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                  <p className="font-medium">Michael Chen, Developer</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  "The implementation was smooth and the results have exceeded our expectations. Great innovation!"
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-3 flex justify-between">
        <Button
          variant="outline"
          className="flex items-center gap-2 border-quantum-200 dark:border-quantum-700 hover:bg-quantum-100 dark:hover:bg-quantum-800"
        >
          <Download className="h-4 w-4" />
          Export Report
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-quantum-200 dark:border-quantum-700 hover:bg-quantum-100 dark:hover:bg-quantum-800"
        >
          <Share2 className="h-4 w-4" />
          Share Results
        </Button>
      </CardFooter>
    </Card>
  )
}
