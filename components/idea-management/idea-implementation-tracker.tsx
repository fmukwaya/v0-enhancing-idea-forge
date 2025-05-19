"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, AlertTriangle, ArrowRight, BarChart2, Calendar, Users } from "lucide-react"

interface MilestoneProps {
  title: string
  date: string
  status: "completed" | "in-progress" | "pending" | "at-risk"
  owner: string
  description: string
}

const Milestone = ({ title, date, status, owner, description }: MilestoneProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-gray-400" />
      case "at-risk":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
    }
  }

  const getStatusClass = () => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "at-risk":
        return "bg-amber-100 text-amber-800 border-amber-200"
    }
  }

  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg mb-3 hover:shadow-md transition-shadow">
      <div className="mt-1">{getStatusIcon()}</div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="font-medium text-lg">{title}</h4>
          <Badge variant="outline" className={getStatusClass()}>
            {status.replace("-", " ")}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{owner}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface IdeaImplementationTrackerProps {
  ideaId: string
  ideaTitle: string
  progress: number
  startDate: string
  targetDate: string
  status: "on-track" | "at-risk" | "delayed" | "completed"
  milestones: MilestoneProps[]
}

export function IdeaImplementationTracker({
  ideaId,
  ideaTitle,
  progress,
  startDate,
  targetDate,
  status,
  milestones,
}: IdeaImplementationTrackerProps) {
  const [activeTab, setActiveTab] = useState("milestones")

  const getStatusBadge = () => {
    switch (status) {
      case "on-track":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200">On Track</Badge>
        )
      case "at-risk":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200">At Risk</Badge>
      case "delayed":
        return <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200">Delayed</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200">Completed</Badge>
    }
  }

  return (
    <Card className="w-full overflow-hidden border-quantum-600/20 bg-gradient-to-br from-white to-quantum-50/30 dark:from-quantum-950 dark:to-quantum-900">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-quantum tracking-tight">{ideaTitle}</CardTitle>
            <CardDescription className="text-quantum-700 dark:text-quantum-300">
              Implementation Tracking
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
        <div className="mt-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Implementation Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-quantum-100 dark:bg-quantum-800">
            <div
              className="h-full bg-gradient-to-r from-quantum-400 to-quantum-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </Progress>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Started: {startDate}</span>
            <span>Target: {targetDate}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-quantum-100/50 dark:bg-quantum-800/50">
            <TabsTrigger value="milestones" className="flex-1">
              Milestones
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex-1">
              Resources
            </TabsTrigger>
            <TabsTrigger value="dependencies" className="flex-1">
              Dependencies
            </TabsTrigger>
          </TabsList>
          <TabsContent value="milestones" className="mt-4 space-y-1">
            {milestones.map((milestone, index) => (
              <Milestone key={index} {...milestone} />
            ))}
          </TabsContent>
          <TabsContent value="resources" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-quantum-600" />
                  <div>
                    <p className="font-medium">Development Team</p>
                    <p className="text-sm text-muted-foreground">3 engineers assigned</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <BarChart2 className="h-5 w-5 text-quantum-600" />
                  <div>
                    <p className="font-medium">Budget Allocation</p>
                    <p className="text-sm text-muted-foreground">$12,500 allocated</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="dependencies" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full" />
                  <div>
                    <p className="font-medium">API Integration</p>
                    <p className="text-sm text-muted-foreground">Completed on May 10, 2025</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                  Resolved
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-amber-500 rounded-full" />
                  <div>
                    <p className="font-medium">Security Approval</p>
                    <p className="text-sm text-muted-foreground">Pending review</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                  Pending
                </Badge>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-3">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-quantum-200 dark:border-quantum-700 hover:bg-quantum-100 dark:hover:bg-quantum-800"
        >
          View Full Implementation Plan
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
