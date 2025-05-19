"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Award,
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  CheckCircle,
  XCircle,
  Star,
  AlertTriangle,
} from "lucide-react"

// Sample data for top contributors
const topContributorsData = [
  {
    name: "Alex Morgan",
    avatar: "/abstract-am.png",
    role: "Product Strategist",
    contributions: 37,
    category: "Strategy",
  },
  {
    name: "Jordan Taylor",
    avatar: "/abstract-geometric-jt.png",
    role: "UX Designer",
    contributions: 29,
    category: "Design",
  },
  {
    name: "Sam Wilson",
    avatar: "/stylized-sw.png",
    role: "Lead Developer",
    contributions: 24,
    category: "Development",
  },
]

// Sample data for company skills
const companySkillsData = {
  leadingSkills: [
    { name: "Product Strategy", score: 92, projects: 18 },
    { name: "UX/UI Design", score: 88, projects: 24 },
    { name: "Frontend Development", score: 85, projects: 31 },
  ],
  missingSkills: [
    { name: "Data Science", score: 42, projects: 5 },
    { name: "DevOps", score: 48, projects: 7 },
    { name: "Blockchain Development", score: 35, projects: 3 },
  ],
}

// Sample data for company strengths
const companyStrengthsData = {
  strengths: [
    { name: "User-Centered Design", successRate: 94, satisfactionRate: 92, projects: 17 },
    { name: "Rapid Prototyping", successRate: 91, satisfactionRate: 89, projects: 23 },
    { name: "Agile Implementation", successRate: 88, satisfactionRate: 86, projects: 29 },
  ],
  weaknesses: [
    { name: "Project Estimation", failureRate: 28, dissatisfactionRate: 32, projects: 7 },
    { name: "Technical Documentation", failureRate: 24, dissatisfactionRate: 27, projects: 9 },
    { name: "Cross-Team Coordination", failureRate: 21, dissatisfactionRate: 25, projects: 11 },
  ],
}

// Sample data for project success metrics
const projectSuccessData = [
  { name: "Q1", completed: 12, partial: 3, failed: 1 },
  { name: "Q2", completed: 15, partial: 2, failed: 1 },
  { name: "Q3", completed: 18, partial: 4, failed: 2 },
  { name: "Q4", completed: 21, partial: 3, failed: 1 },
]

// Sample data for customer satisfaction
const satisfactionData = [
  { name: "Very Satisfied", value: 62 },
  { name: "Satisfied", value: 28 },
  { name: "Neutral", value: 7 },
  { name: "Dissatisfied", value: 3 },
]

const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f87171"]

export function EnhancedProjectAnalytics() {
  const [activeTab, setActiveTab] = useState("contributors")

  return (
    <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Project Analytics</CardTitle>
        <CardDescription>
          Comprehensive analytics on project performance, team contributions, and company capabilities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-muted/50 mb-6">
            <TabsTrigger value="contributors" className="flex-1">
              Top Contributors
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex-1">
              Company Skills
            </TabsTrigger>
            <TabsTrigger value="strengths" className="flex-1">
              Strengths & Weaknesses
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex-1">
              Project Performance
            </TabsTrigger>
          </TabsList>

          {/* Top Contributors Tab */}
          <TabsContent value="contributors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topContributorsData.map((contributor, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="pb-2 pt-4">
                    <div className="flex justify-between items-start">
                      <Badge className="mb-2">{`#${index + 1}`}</Badge>
                      <Badge variant="outline">{contributor.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-20 w-20 mb-4">
                        <AvatarImage src={contributor.avatar || "/placeholder.svg"} alt={contributor.name} />
                        <AvatarFallback>
                          {contributor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-lg font-semibold">{contributor.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{contributor.role}</p>
                      <div className="flex items-center gap-1 mb-4">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{contributor.contributions} Contributions</span>
                      </div>

                      <div className="w-full space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Impact Score</span>
                          <span className="font-medium">{90 - index * 5}%</span>
                        </div>
                        <Progress value={90 - index * 5} className="h-2" />

                        <div className="flex justify-between text-sm">
                          <span>Collaboration</span>
                          <span className="font-medium">{85 - index * 3}%</span>
                        </div>
                        <Progress value={85 - index * 3} className="h-2" />

                        <div className="flex justify-between text-sm">
                          <span>Innovation</span>
                          <span className="font-medium">{88 - index * 4}%</span>
                        </div>
                        <Progress value={88 - index * 4} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Contribution Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      strategy: {
                        label: "Strategy",
                        color: "hsl(var(--chart-1))",
                      },
                      design: {
                        label: "Design",
                        color: "hsl(var(--chart-2))",
                      },
                      development: {
                        label: "Development",
                        color: "hsl(var(--chart-3))",
                      },
                      research: {
                        label: "Research",
                        color: "hsl(var(--chart-4))",
                      },
                      management: {
                        label: "Management",
                        color: "hsl(var(--chart-5))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { month: "Jan", strategy: 12, design: 18, development: 24, research: 8, management: 10 },
                          { month: "Feb", strategy: 15, design: 20, development: 28, research: 10, management: 12 },
                          { month: "Mar", strategy: 18, design: 24, development: 32, research: 12, management: 15 },
                          { month: "Apr", strategy: 22, design: 28, development: 38, research: 15, management: 18 },
                          { month: "May", strategy: 26, design: 32, development: 42, research: 18, management: 22 },
                          { month: "Jun", strategy: 30, design: 36, development: 48, research: 22, management: 26 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="strategy" fill="var(--color-strategy)" />
                        <Bar dataKey="design" fill="var(--color-design)" />
                        <Bar dataKey="development" fill="var(--color-development)" />
                        <Bar dataKey="research" fill="var(--color-research)" />
                        <Bar dataKey="management" fill="var(--color-management)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Company Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    Top 3 Leading Skills
                  </CardTitle>
                  <CardDescription>Skills with highest success rates across projects</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {companySkillsData.leadingSkills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <h3 className="font-medium">{skill.name}</h3>
                        </div>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          {skill.score}%
                        </Badge>
                      </div>
                      <Progress value={skill.score} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Applied in {skill.projects} projects</span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-emerald-500" />+{Math.floor(skill.score / 10)}% growth
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-500" />
                    Top 3 Missing Skills
                  </CardTitle>
                  <CardDescription>Skills that need development or acquisition</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {companySkillsData.missingSkills.map((skill, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <h3 className="font-medium">{skill.name}</h3>
                        </div>
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {skill.score}%
                        </Badge>
                      </div>
                      <Progress value={skill.score} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Used in only {skill.projects} projects</span>
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-amber-500" />
                          High demand in market
                        </span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Skills Gap Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer
                    config={{
                      current: {
                        label: "Current Capability",
                        color: "hsl(var(--chart-1))",
                      },
                      required: {
                        label: "Market Requirement",
                        color: "hsl(var(--chart-2))",
                      },
                      gap: {
                        label: "Skills Gap",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { skill: "Product Strategy", current: 92, required: 85, gap: 0 },
                          { skill: "UX/UI Design", current: 88, required: 90, gap: 2 },
                          { skill: "Frontend Dev", current: 85, required: 80, gap: 0 },
                          { skill: "Backend Dev", current: 75, required: 85, gap: 10 },
                          { skill: "DevOps", current: 48, required: 75, gap: 27 },
                          { skill: "Data Science", current: 42, required: 80, gap: 38 },
                          { skill: "Blockchain", current: 35, required: 65, gap: 30 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="skill" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="current" fill="var(--color-current)" />
                        <Bar dataKey="required" fill="var(--color-required)" />
                        <Bar dataKey="gap" fill="var(--color-gap)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="text-sm font-medium">Skill Acquisition Recommendation</h3>
                      <p className="text-xs text-muted-foreground">Hire 2 Data Scientists</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="text-sm font-medium">Training Recommendation</h3>
                      <p className="text-xs text-muted-foreground">DevOps certification for 3 developers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Award className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="text-sm font-medium">Partnership Recommendation</h3>
                      <p className="text-xs text-muted-foreground">Blockchain development partnership</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Strengths & Weaknesses Tab */}
          <TabsContent value="strengths" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    Top 3 Company Strengths
                  </CardTitle>
                  <CardDescription>Based on successful projects and customer satisfaction</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {companyStrengthsData.strengths.map((strength, index) => (
                    <div key={index} className="p-3 rounded-lg border bg-muted/30">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <h3 className="font-medium">{strength.name}</h3>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
                          {strength.projects} Projects
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Success Rate</span>
                            <span className="font-medium">{strength.successRate}%</span>
                          </div>
                          <Progress value={strength.successRate} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Satisfaction</span>
                            <span className="font-medium">{strength.satisfactionRate}%</span>
                          </div>
                          <Progress value={strength.satisfactionRate} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    Top 3 Areas of Weakness
                  </CardTitle>
                  <CardDescription>Based on unsuccessful projects and customer dissatisfaction</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {companyStrengthsData.weaknesses.map((weakness, index) => (
                    <div key={index} className="p-3 rounded-lg border bg-muted/30">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <h3 className="font-medium">{weakness.name}</h3>
                        </div>
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          {weakness.projects} Projects
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Failure Rate</span>
                            <span className="font-medium">{weakness.failureRate}%</span>
                          </div>
                          <Progress value={weakness.failureRate} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Dissatisfaction</span>
                            <span className="font-medium">{weakness.dissatisfactionRate}%</span>
                          </div>
                          <Progress value={weakness.dissatisfactionRate} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Improvement Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                        1
                      </div>
                      Project Estimation Improvement
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Implement a data-driven estimation framework based on historical project data and team velocity
                      metrics.
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="outline">High Impact</Badge>
                      <Badge variant="outline">Medium Effort</Badge>
                      <Badge variant="outline">3-Month Timeline</Badge>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border bg-muted/30">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      Technical Documentation Standards
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Develop and implement standardized documentation templates and processes with automated quality
                      checks.
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="outline">Medium Impact</Badge>
                      <Badge variant="outline">Low Effort</Badge>
                      <Badge variant="outline">1-Month Timeline</Badge>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border bg-muted/30">
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                        3
                      </div>
                      Cross-Team Coordination Framework
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Implement structured cross-functional team meetings and collaborative planning sessions with clear
                      accountability.
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="outline">High Impact</Badge>
                      <Badge variant="outline">Medium Effort</Badge>
                      <Badge variant="outline">2-Month Timeline</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Project Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Project Success Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartContainer
                      config={{
                        completed: {
                          label: "Completed",
                          color: "hsl(var(--chart-1))",
                        },
                        partial: {
                          label: "Partial",
                          color: "hsl(var(--chart-2))",
                        },
                        failed: {
                          label: "Failed",
                          color: "hsl(var(--chart-3))",
                        },
                      }}
                      className="h-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={projectSuccessData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar dataKey="completed" fill="var(--color-completed)" />
                          <Bar dataKey="partial" fill="var(--color-partial)" />
                          <Bar dataKey="failed" fill="var(--color-failed)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Customer Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={satisfactionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {satisfactionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <CheckCircle className="h-8 w-8 text-emerald-500 mb-2" />
                    <h3 className="font-medium">Project Success Rate</h3>
                    <p className="text-2xl font-bold">87%</p>
                    <p className="text-xs text-muted-foreground">+5% from previous year</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <Star className="h-8 w-8 text-amber-500 mb-2" />
                    <h3 className="font-medium">Average Satisfaction</h3>
                    <p className="text-2xl font-bold">4.6/5.0</p>
                    <p className="text-xs text-muted-foreground">Based on 142 client reviews</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center">
                    <Users className="h-8 w-8 text-blue-500 mb-2" />
                    <h3 className="font-medium">Client Retention</h3>
                    <p className="text-2xl font-bold">93%</p>
                    <p className="text-xs text-muted-foreground">+3% from previous year</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>On-Time Delivery</span>
                      <span className="font-medium">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                    <div className="flex justify-end text-xs text-emerald-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +7% improvement
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Budget Adherence</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                    <div className="flex justify-end text-xs text-emerald-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +4% improvement
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Quality Metrics</span>
                      <span className="font-medium">91%</span>
                    </div>
                    <Progress value={91} className="h-2" />
                    <div className="flex justify-end text-xs text-emerald-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +2% improvement
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Team Velocity</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <div className="flex justify-end text-xs text-emerald-600 mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +9% improvement
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
