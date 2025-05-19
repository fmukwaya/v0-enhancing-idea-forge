"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { IdeasOverview } from "@/components/idea-management/ideas-overview"
import { IdeaCreationForm } from "@/components/idea-management/idea-creation-form"
import { IdeaApprovalRequest } from "@/components/idea-management/idea-approval-request"
import { CompetitionAnalysis } from "@/components/idea-management/competition-analysis"
import { MarketResearch } from "@/components/idea-management/market-research"
import { IdeaAnalyticsDashboard } from "@/components/idea-management/idea-analytics-dashboard"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Lightbulb, Plus, Sparkles, Brain, Target, BarChart2, FileText } from "lucide-react"
import { EnhancedProjectAnalytics } from "@/components/analytics/enhanced-project-analytics"
import { useUser } from "@/hooks/use-user" // Import the useUser hook
import { useRouter } from "next/navigation"

const Page = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const { hasPermission } = useUser() // Use the useUser hook
  const router = useRouter()

  // Mock data for the components
  const mockMilestones = [
    {
      title: "Research Phase",
      date: "May 5, 2025",
      status: "completed" as const,
      owner: "Research Team",
      description: "Conduct market research and feasibility analysis",
    },
    {
      title: "Design Phase",
      date: "May 20, 2025",
      status: "in-progress" as const,
      owner: "Design Team",
      description: "Create wireframes and prototypes",
    },
    {
      title: "Development Phase",
      date: "June 15, 2025",
      status: "pending" as const,
      owner: "Development Team",
      description: "Implement core functionality",
    },
    {
      title: "Testing Phase",
      date: "July 1, 2025",
      status: "pending" as const,
      owner: "QA Team",
      description: "Conduct thorough testing and bug fixes",
    },
  ]

  const mockApprovers = [
    {
      name: "Sarah Wilson",
      role: "Product Director",
      avatar: "/short-haired-person.png",
      status: "approved" as const,
      feedback: "This is a great idea that aligns with our strategic goals. I fully support moving forward with it.",
      date: "May 10, 2025",
    },
    {
      name: "James Smith",
      role: "CTO",
      avatar: "/person-dark-hair.png",
      status: "reviewing" as const,
    },
  ]

  return (
    <DashboardLayout>
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold font-quantum tracking-tight flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-quantum-600" />
              IdeaForge Dashboard
            </h1>
            <p className="text-muted-foreground">Your quantum-powered innovation management platform</p>
          </div>
          <div className="flex items-center gap-2">
            {hasPermission("create") && (
              <Button className="bg-quantum-600 hover:bg-quantum-700" onClick={() => router.push("/create")}>
                <Plus className="h-4 w-4 mr-2" />
                New Idea
              </Button>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-quantum-100/50 dark:bg-quantum-800/50">
            <TabsTrigger value="overview" className="flex-1 flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              <span>Ideas Overview</span>
            </TabsTrigger>
            {hasPermission("create") && (
              <TabsTrigger value="create" className="flex-1 flex items-center gap-1">
                <Plus className="h-4 w-4" />
                <span>Create Idea</span>
              </TabsTrigger>
            )}
            {hasPermission("approve") && (
              <TabsTrigger value="approval" className="flex-1 flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Request Approval</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="market" className="flex-1 flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>Market Research</span>
            </TabsTrigger>
            <TabsTrigger value="competition" className="flex-1 flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              <span>Competition</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 flex items-center gap-1">
              <Brain className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <IdeasOverview />
          </TabsContent>

          {hasPermission("create") && (
            <TabsContent value="create" className="mt-6">
              <IdeaCreationForm onSubmit={(values) => console.log("Form submitted:", values)} />
            </TabsContent>
          )}

          {hasPermission("approve") && (
            <TabsContent value="approval" className="mt-6">
              <IdeaApprovalRequest
                ideaId="idea-1"
                ideaTitle="Quantum Interface Redesign"
                ideaDescription="Redesign our interface using quantum principles to create a more intuitive and responsive user experience. This will involve implementing non-linear navigation patterns and entangled state management."
                category="Product"
                createdBy={{
                  name: "Alex Johnson",
                  avatar: "/person-with-glasses.png",
                }}
                createdAt="May 5, 2025"
                status="pending"
                approvers={mockApprovers}
                onSubmit={(ideaId, approvers, message) =>
                  console.log("Approval requested:", { ideaId, approvers, message })
                }
              />
            </TabsContent>
          )}

          <TabsContent value="market" className="mt-6">
            <MarketResearch
              ideaId="idea-1"
              ideaTitle="Quantum Interface Redesign"
              ideaCategory="Product"
              onResearchComplete={(results) => console.log("Research completed:", results)}
            />
          </TabsContent>

          <TabsContent value="competition" className="mt-6">
            <CompetitionAnalysis
              ideaId="idea-1"
              ideaTitle="Quantum Interface Redesign"
              onAnalysisComplete={(results) => console.log("Analysis completed:", results)}
            />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="space-y-6">
              <EnhancedProjectAnalytics />
              <IdeaAnalyticsDashboard
                timeRange="30d"
                onTimeRangeChange={(range) => console.log("Time range changed:", range)}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

export default Page
