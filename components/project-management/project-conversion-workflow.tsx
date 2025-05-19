"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2,
  Circle,
  Clock,
  Users,
  Calendar,
  FileText,
  Layers,
  Zap,
  Target,
  Sparkles,
  Lightbulb,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface ProjectConversionProps {
  ideaId: string
  ideaTitle: string
  ideaDescription: string
  ideaCategories: string[]
  ideaCreator: {
    name: string
    avatar: string
    role: string
  }
}

export function ProjectConversionWorkflow({
  ideaId = "idea-123",
  ideaTitle = "AI-Powered Customer Insights Platform",
  ideaDescription = "Create a platform that uses AI to analyze customer feedback across multiple channels and generate actionable insights for product teams.",
  ideaCategories = ["AI/ML", "Customer Experience", "Product Development"],
  ideaCreator = {
    name: "Alex Morgan",
    avatar: "/abstract-am.png",
    role: "Product Strategist",
  },
}: ProjectConversionProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [conversionProgress, setConversionProgress] = useState(0)
  const [projectData, setProjectData] = useState({
    name: ideaTitle,
    description: ideaDescription,
    timeline: {
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      milestones: [
        { title: "Research & Planning", duration: 14, complete: false },
        { title: "Design & Architecture", duration: 21, complete: false },
        { title: "Development Phase 1", duration: 30, complete: false },
        { title: "Testing & Refinement", duration: 14, complete: false },
        { title: "Launch Preparation", duration: 7, complete: false },
        { title: "Deployment & Review", duration: 4, complete: false },
      ],
    },
    team: [],
    resources: {
      budget: 0,
      technologies: [],
      infrastructure: [],
    },
    objectives: {
      primary: "",
      secondary: [],
      metrics: [],
    },
    risks: [],
  })

  const steps = [
    { id: "basics", title: "Project Basics", icon: FileText },
    { id: "team", title: "Team Assembly", icon: Users },
    { id: "timeline", title: "Timeline Planning", icon: Calendar },
    { id: "resources", title: "Resource Allocation", icon: Layers },
    { id: "objectives", title: "Objectives & KPIs", icon: Target },
    { id: "review", title: "Final Review", icon: CheckCircle2 },
  ]

  // Simulated team members for selection
  const availableTeamMembers = [
    { id: "tm1", name: "Jordan Lee", role: "Project Manager", avatar: "/stylized-jl-logo.png" },
    { id: "tm2", name: "Taylor Kim", role: "Lead Developer", avatar: "/abstract-geometric-TK.png" },
    { id: "tm3", name: "Morgan Chen", role: "UX Designer", avatar: "/microphone-concert-stage.png" },
    { id: "tm4", name: "Casey Wong", role: "Data Scientist", avatar: "/abstract-cw.png" },
    { id: "tm5", name: "Riley Singh", role: "QA Engineer", avatar: "/abstract-rs.png" },
    { id: "tm6", name: "Jamie Patel", role: "Business Analyst", avatar: "/stylized-jp-letters.png" },
  ]

  // Simulated technology options
  const availableTechnologies = [
    { id: "tech1", name: "React", category: "Frontend" },
    { id: "tech2", name: "Node.js", category: "Backend" },
    { id: "tech3", name: "TensorFlow", category: "AI/ML" },
    { id: "tech4", name: "PostgreSQL", category: "Database" },
    { id: "tech5", name: "AWS", category: "Infrastructure" },
    { id: "tech6", name: "Docker", category: "DevOps" },
  ]

  // Update progress when step changes
  useEffect(() => {
    setConversionProgress(Math.round(((currentStep + 1) / steps.length) * 100))
  }, [currentStep, steps.length])

  // Simulated AI recommendations based on current step
  const getAIRecommendations = () => {
    const recommendations = [
      {
        step: "basics",
        title: "Project Scope Optimization",
        description:
          "Based on similar successful projects, consider narrowing the initial scope to focus on a specific customer feedback channel first, then expand in phases.",
        confidence: 89,
      },
      {
        step: "team",
        title: "Team Composition Insight",
        description:
          "Projects of this nature benefit from having a dedicated UX researcher. Consider adding this role to capture more nuanced customer insights.",
        confidence: 92,
      },
      {
        step: "timeline",
        title: "Timeline Risk Assessment",
        description:
          "The development phase may require additional time due to the complexity of AI model training. Consider adding a 20% buffer to this phase.",
        confidence: 85,
      },
      {
        step: "resources",
        title: "Technology Stack Recommendation",
        description:
          "For this type of project, a combination of TensorFlow for ML models and a scalable cloud infrastructure like AWS would be optimal.",
        confidence: 94,
      },
      {
        step: "objectives",
        title: "KPI Framework Suggestion",
        description:
          "Include both technical metrics (model accuracy, processing time) and business metrics (insight implementation rate, product improvement velocity).",
        confidence: 88,
      },
      {
        step: "review",
        title: "Launch Strategy Optimization",
        description:
          "Consider a phased rollout approach, starting with your most engaged customer segment to gather initial feedback before full deployment.",
        confidence: 91,
      },
    ]

    return recommendations.filter((rec) => rec.step === steps[currentStep].id)
  }

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCreateProject = () => {
    // Simulate project creation
    console.log("Creating project with data:", projectData)
    // Here you would typically make an API call to create the project

    // Show success animation
    setConversionProgress(100)
  }

  const handleAddTeamMember = (memberId: string) => {
    const member = availableTeamMembers.find((m) => m.id === memberId)
    if (member && !projectData.team.some((m) => m.id === memberId)) {
      setProjectData({
        ...projectData,
        team: [...projectData.team, member],
      })
    }
  }

  const handleRemoveTeamMember = (memberId: string) => {
    setProjectData({
      ...projectData,
      team: projectData.team.filter((m) => m.id !== memberId),
    })
  }

  const handleAddTechnology = (techId: string) => {
    const tech = availableTechnologies.find((t) => t.id === techId)
    if (tech && !projectData.resources.technologies.some((t) => t.id === techId)) {
      setProjectData({
        ...projectData,
        resources: {
          ...projectData.resources,
          technologies: [...projectData.resources.technologies, tech],
        },
      })
    }
  }

  const handleRemoveTechnology = (techId: string) => {
    setProjectData({
      ...projectData,
      resources: {
        ...projectData.resources,
        technologies: projectData.resources.technologies.filter((t) => t.id !== techId),
      },
    })
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <span>Idea to Project Conversion</span>
            </CardTitle>
            <CardDescription className="mt-1">
              Transform your idea into a structured project with defined resources, timeline, and objectives
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary">
              <Lightbulb className="h-3 w-3 mr-1" />
              Idea ID: {ideaId}
            </Badge>
            <Badge variant="outline" className="bg-secondary/10 text-secondary">
              <Clock className="h-3 w-3 mr-1" />
              Conversion in Progress
            </Badge>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Conversion Progress</span>
            <span>{conversionProgress}%</span>
          </div>
          <Progress value={conversionProgress} className="h-2" />
        </div>

        {/* Steps indicator */}
        <div className="flex justify-between mt-6 px-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${
                    index < currentStep
                      ? "bg-primary text-primary-foreground"
                      : index === currentStep
                        ? "bg-primary/20 text-primary border-2 border-primary"
                        : "bg-muted text-muted-foreground"
                  }
                  transition-all duration-300
                `}
              >
                {index < currentStep ? <CheckCircle2 className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
              </div>
              <span
                className={`text-xs mt-1 text-center ${index === currentStep ? "font-medium text-primary" : "text-muted-foreground"}`}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div
                  className="hidden sm:block absolute left-0 right-0 h-0.5 bg-muted"
                  style={{
                    width: `${100 / (steps.length - 1)}%`,
                    left: `${(index * 100) / (steps.length - 1) + 50 / (steps.length - 1)}%`,
                    top: "1.25rem",
                    transform: "translateY(-50%)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Step 1: Project Basics */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        value={projectData.name}
                        onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-description">Project Description</Label>
                      <Textarea
                        id="project-description"
                        value={projectData.description}
                        onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                        rows={4}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Original Idea Categories</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {ideaCategories.map((category) => (
                            <Badge key={category} variant="secondary">
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>Idea Creator</Label>
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar>
                            <AvatarImage src={ideaCreator.avatar || "/placeholder.svg"} alt={ideaCreator.name} />
                            <AvatarFallback>
                              {ideaCreator.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{ideaCreator.name}</div>
                            <div className="text-sm text-muted-foreground">{ideaCreator.role}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Card className="bg-primary/5 border border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-1">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span>AI Recommendations</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {getAIRecommendations().map((rec, index) => (
                          <div key={index} className="space-y-1">
                            <div className="font-medium text-sm">{rec.title}</div>
                            <div className="text-xs text-muted-foreground">{rec.description}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="text-xs text-primary">Confidence:</div>
                              <Progress value={rec.confidence} className="h-1 flex-1" />
                              <div className="text-xs">{rec.confidence}%</div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Team Assembly */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <Label>Selected Team Members</Label>
                      <div className="mt-2 space-y-2">
                        {projectData.team.length === 0 ? (
                          <div className="text-sm text-muted-foreground italic">No team members selected yet</div>
                        ) : (
                          projectData.team.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                            >
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                  <AvatarFallback>
                                    {member.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-sm">{member.name}</div>
                                  <div className="text-xs text-muted-foreground">{member.role}</div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveTeamMember(member.id)}
                                className="h-8 w-8 p-0"
                              >
                                <span className="sr-only">Remove</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                >
                                  <path d="M18 6 6 18"></path>
                                  <path d="m6 6 12 12"></path>
                                </svg>
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="add-team-member">Add Team Member</Label>
                      <Select onValueChange={handleAddTeamMember}>
                        <SelectTrigger id="add-team-member" className="mt-1">
                          <SelectValue placeholder="Select team member" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTeamMembers
                            .filter((m) => !projectData.team.some((tm) => tm.id === m.id))
                            .map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                    <AvatarFallback>
                                      {member.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span>
                                    {member.name} - {member.role}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Team Composition Analysis</Label>
                      <Card className="mt-2 bg-muted/30">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm font-medium">Role Coverage</div>
                              <div className="mt-2 space-y-2">
                                {[
                                  "Project Management",
                                  "Development",
                                  "Design",
                                  "Data Science",
                                  "QA",
                                  "Business Analysis",
                                ].map((role) => {
                                  const hasRole = projectData.team.some((m) =>
                                    m.role.toLowerCase().includes(role.toLowerCase().split(" ")[0]),
                                  )
                                  return (
                                    <div key={role} className="flex items-center gap-2">
                                      <div
                                        className={`h-3 w-3 rounded-full ${hasRole ? "bg-green-500" : "bg-muted"}`}
                                      />
                                      <span className="text-xs">{role}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium">Team Size</div>
                              <div className="mt-2">
                                <div className="text-2xl font-bold">{projectData.team.length}</div>
                                <div className="text-xs text-muted-foreground">
                                  {projectData.team.length < 3
                                    ? "Small Team"
                                    : projectData.team.length < 6
                                      ? "Medium Team"
                                      : "Large Team"}
                                </div>
                              </div>

                              <div className="mt-4 text-sm font-medium">Recommended Size</div>
                              <div className="text-xs text-muted-foreground">4-6 members for this project type</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <Card className="bg-primary/5 border border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-1">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span>AI Recommendations</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {getAIRecommendations().map((rec, index) => (
                          <div key={index} className="space-y-1">
                            <div className="font-medium text-sm">{rec.title}</div>
                            <div className="text-xs text-muted-foreground">{rec.description}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="text-xs text-primary">Confidence:</div>
                              <Progress value={rec.confidence} className="h-1 flex-1" />
                              <div className="text-xs">{rec.confidence}%</div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="mt-4 bg-muted/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Team Insights</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <div className="text-xs font-medium">Skills Coverage</div>
                          <Progress value={projectData.team.length * 16} className="h-1 mt-1" />
                        </div>
                        <div>
                          <div className="text-xs font-medium">Experience Level</div>
                          <Progress value={70} className="h-1 mt-1" />
                        </div>
                        <div>
                          <div className="text-xs font-medium">Collaboration History</div>
                          <Progress value={projectData.team.length > 2 ? 65 : 30} className="h-1 mt-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Timeline Planning */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input
                          id="start-date"
                          type="date"
                          value={projectData.timeline.startDate}
                          onChange={(e) =>
                            setProjectData({
                              ...projectData,
                              timeline: { ...projectData.timeline, startDate: e.target.value },
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="end-date">Target End Date</Label>
                        <Input
                          id="end-date"
                          type="date"
                          value={projectData.timeline.endDate}
                          onChange={(e) =>
                            setProjectData({
                              ...projectData,
                              timeline: { ...projectData.timeline, endDate: e.target.value },
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Milestones</Label>
                      <div className="mt-2 space-y-3">
                        {projectData.timeline.milestones.map((milestone, index) => (
                          <div key={index} className="p-3 rounded-md bg-muted/50">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{milestone.title}</div>
                              <Badge variant="outline">{milestone.duration} days</Badge>
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <div className="text-xs text-muted-foreground">Completion Status:</div>
                              <div className="flex-1">
                                <Progress value={milestone.complete ? 100 : 0} className="h-1" />
                              </div>
                              <Switch
                                checked={milestone.complete}
                                onCheckedChange={(checked) => {
                                  const newMilestones = [...projectData.timeline.milestones]
                                  newMilestones[index].complete = checked
                                  setProjectData({
                                    ...projectData,
                                    timeline: { ...projectData.timeline, milestones: newMilestones },
                                  })
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Timeline Visualization</Label>
                      <div className="mt-2 p-4 rounded-md bg-muted/30 overflow-x-auto">
                        <div className="min-w-[600px]">
                          <div className="flex justify-between mb-2">
                            {Array.from({ length: 5 }, (_, i) => (
                              <div key={i} className="text-xs text-muted-foreground">
                                Week {i + 1}
                              </div>
                            ))}
                          </div>

                          <div className="h-8 w-full bg-muted rounded-md relative">
                            {projectData.timeline.milestones.map((milestone, index) => {
                              // Calculate position and width based on duration
                              const totalDuration = projectData.timeline.milestones.reduce(
                                (acc, m) => acc + m.duration,
                                0,
                              )
                              const previousDuration = projectData.timeline.milestones
                                .slice(0, index)
                                .reduce((acc, m) => acc + m.duration, 0)

                              const left = (previousDuration / totalDuration) * 100
                              const width = (milestone.duration / totalDuration) * 100

                              return (
                                <div
                                  key={index}
                                  className={`absolute h-full rounded-md flex items-center justify-center text-xs font-medium ${
                                    milestone.complete
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-primary/20 text-primary"
                                  }`}
                                  style={{
                                    left: `${left}%`,
                                    width: `${width}%`,
                                  }}
                                >
                                  {milestone.title}
                                </div>
                              )
                            })}
                          </div>

                          <div className="mt-4 space-y-2">
                            {projectData.timeline.milestones.map((milestone, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div
                                  className={`h-3 w-3 rounded-full ${
                                    milestone.complete ? "bg-primary" : "bg-primary/20"
                                  }`}
                                />
                                <div className="text-xs">{milestone.title}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Card className="bg-primary/5 border border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-1">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span>AI Recommendations</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {getAIRecommendations().map((rec, index) => (
                          <div key={index} className="space-y-1">
                            <div className="font-medium text-sm">{rec.title}</div>
                            <div className="text-xs text-muted-foreground">{rec.description}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="text-xs text-primary">Confidence:</div>
                              <Progress value={rec.confidence} className="h-1 flex-1" />
                              <div className="text-xs">{rec.confidence}%</div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="mt-4 bg-muted/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Timeline Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <div className="text-xs font-medium">Total Duration</div>
                          <div className="text-sm mt-1">
                            {projectData.timeline.milestones.reduce((acc, m) => acc + m.duration, 0)} days
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium">Critical Path</div>
                          <div className="text-sm mt-1">Development Phase 1 → Testing & Refinement</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium">Risk Assessment</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                              Medium Risk
                            </Badge>
                            <div className="text-xs text-muted-foreground">Timeline buffer recommended</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Resource Allocation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <Label htmlFor="budget">Budget Allocation (USD)</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="budget"
                          type="number"
                          value={projectData.resources.budget}
                          onChange={(e) =>
                            setProjectData({
                              ...projectData,
                              resources: {
                                ...projectData.resources,
                                budget: Number.parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          onClick={() =>
                            setProjectData({
                              ...projectData,
                              resources: {
                                ...projectData.resources,
                                budget: 50000,
                              },
                            })
                          }
                        >
                          Suggest
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Technology Stack</Label>
                      <div className="mt-2 space-y-2">
                        {projectData.resources.technologies.length === 0 ? (
                          <div className="text-sm text-muted-foreground italic">No technologies selected yet</div>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {projectData.resources.technologies.map((tech) => (
                              <Badge key={tech.id} className="flex items-center gap-1 px-3 py-1">
                                {tech.name}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveTechnology(tech.id)}
                                  className="h-4 w-4 p-0 ml-1"
                                >
                                  <span className="sr-only">Remove</span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-3 w-3"
                                  >
                                    <path d="M18 6 6 18"></path>
                                    <path d="m6 6 12 12"></path>
                                  </svg>
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-2">
                        <Label htmlFor="add-technology">Add Technology</Label>
                        <Select onValueChange={handleAddTechnology}>
                          <SelectTrigger id="add-technology" className="mt-1">
                            <SelectValue placeholder="Select technology" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTechnologies
                              .filter((t) => !projectData.resources.technologies.some((pt) => pt.id === t.id))
                              .map((tech) => (
                                <SelectItem key={tech.id} value={tech.id}>
                                  <div className="flex items-center gap-2">
                                    <span>{tech.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {tech.category}
                                    </Badge>
                                  </div>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Resource Distribution</Label>
                      <Card className="mt-2 bg-muted/30">
                        <CardContent className="p-4">
                          <div className="space-y-4">
                            <div>
                              <div className="text-sm font-medium mb-2">Budget Allocation</div>
                              <div className="space-y-2">
                                {[
                                  { category: "Development", percentage: 45 },
                                  { category: "Design", percentage: 15 },
                                  { category: "Testing", percentage: 15 },
                                  { category: "Infrastructure", percentage: 20 },
                                  { category: "Contingency", percentage: 5 },
                                ].map((item) => (
                                  <div key={item.category}>
                                    <div className="flex justify-between text-xs">
                                      <span>{item.category}</span>
                                      <span>
                                        $
                                        {Math.round(
                                          (projectData.resources.budget * item.percentage) / 100,
                                        ).toLocaleString()}
                                      </span>
                                    </div>
                                    <Progress value={item.percentage} className="h-1 mt-1" />
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <div className="text-sm font-medium mb-2">Technology Stack Coverage</div>
                              <div className="grid grid-cols-2 gap-2">
                                {["Frontend", "Backend", "Database", "AI/ML", "DevOps", "Infrastructure"].map(
                                  (category) => {
                                    const hasTech = projectData.resources.technologies.some(
                                      (t) => t.category === category,
                                    )
                                    return (
                                      <div key={category} className="flex items-center gap-2">
                                        <div
                                          className={`h-3 w-3 rounded-full ${hasTech ? "bg-green-500" : "bg-muted"}`}
                                        />
                                        <span className="text-xs">{category}</span>
                                      </div>
                                    )
                                  },
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <Card className="bg-primary/5 border border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-1">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span>AI Recommendations</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {getAIRecommendations().map((rec, index) => (
                          <div key={index} className="space-y-1">
                            <div className="font-medium text-sm">{rec.title}</div>
                            <div className="text-xs text-muted-foreground">{rec.description}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="text-xs text-primary">Confidence:</div>
                              <Progress value={rec.confidence} className="h-1 flex-1" />
                              <div className="text-xs">{rec.confidence}%</div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="mt-4 bg-muted/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Resource Insights</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <div className="text-xs font-medium">Budget Efficiency</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={projectData.resources.budget > 30000 ? 85 : 60} className="h-1 flex-1" />
                            <div className="text-xs">{projectData.resources.budget > 30000 ? "Optimal" : "Low"}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium">Technology Compatibility</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress
                              value={
                                projectData.resources.technologies.length >= 4
                                  ? 90
                                  : projectData.resources.technologies.length >= 2
                                    ? 60
                                    : 30
                              }
                              className="h-1 flex-1"
                            />
                            <div className="text-xs">
                              {projectData.resources.technologies.length >= 4
                                ? "High"
                                : projectData.resources.technologies.length >= 2
                                  ? "Medium"
                                  : "Low"}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium">Scaling Potential</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress
                              value={
                                projectData.resources.technologies.some((t) => t.category === "Infrastructure")
                                  ? 85
                                  : 50
                              }
                              className="h-1 flex-1"
                            />
                            <div className="text-xs">
                              {projectData.resources.technologies.some((t) => t.category === "Infrastructure")
                                ? "High"
                                : "Medium"}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Objectives & KPIs */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <Label htmlFor="primary-objective">Primary Objective</Label>
                      <Textarea
                        id="primary-objective"
                        value={projectData.objectives.primary}
                        onChange={(e) =>
                          setProjectData({
                            ...projectData,
                            objectives: { ...projectData.objectives, primary: e.target.value },
                          })
                        }
                        placeholder="Define the main objective of this project"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Secondary Objectives</Label>
                      <div className="mt-2 space-y-2">
                        {projectData.objectives.secondary.map((objective, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={objective}
                              onChange={(e) => {
                                const newSecondary = [...projectData.objectives.secondary]
                                newSecondary[index] = e.target.value
                                setProjectData({
                                  ...projectData,
                                  objectives: { ...projectData.objectives, secondary: newSecondary },
                                })
                              }}
                              className="flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newSecondary = [...projectData.objectives.secondary]
                                newSecondary.splice(index, 1)
                                setProjectData({
                                  ...projectData,
                                  objectives: { ...projectData.objectives, secondary: newSecondary },
                                })
                              }}
                              className="h-10 w-10"
                            >
                              <span className="sr-only">Remove</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                              </svg>
                            </Button>
                          </div>
                        ))}

                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            setProjectData({
                              ...projectData,
                              objectives: {
                                ...projectData.objectives,
                                secondary: [...projectData.objectives.secondary, ""],
                              },
                            })
                          }
                        >
                          Add Secondary Objective
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Key Performance Indicators (KPIs)</Label>
                      <div className="mt-2 space-y-2">
                        {projectData.objectives.metrics.map((metric, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={metric}
                              onChange={(e) => {
                                const newMetrics = [...projectData.objectives.metrics]
                                newMetrics[index] = e.target.value
                                setProjectData({
                                  ...projectData,
                                  objectives: { ...projectData.objectives, metrics: newMetrics },
                                })
                              }}
                              className="flex-1"
                              placeholder="e.g., Increase user engagement by 20%"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newMetrics = [...projectData.objectives.metrics]
                                newMetrics.splice(index, 1)
                                setProjectData({
                                  ...projectData,
                                  objectives: { ...projectData.objectives, metrics: newMetrics },
                                })
                              }}
                              className="h-10 w-10"
                            >
                              <span className="sr-only">Remove</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                              </svg>
                            </Button>
                          </div>
                        ))}

                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() =>
                            setProjectData({
                              ...projectData,
                              objectives: {
                                ...projectData.objectives,
                                metrics: [...projectData.objectives.metrics, ""],
                              },
                            })
                          }
                        >
                          Add KPI
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Suggested KPIs</Label>
                      <Card className="mt-2 bg-muted/30">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            {[
                              "Achieve 90% customer satisfaction rating for the AI insights",
                              "Reduce time to generate actionable insights by 50%",
                              "Increase product improvement implementation rate by 30%",
                              "Process feedback from at least 5 different channels",
                              "Achieve 95% accuracy in sentiment analysis",
                            ].map((suggestion, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
                              >
                                <div className="text-sm">{suggestion}</div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (!projectData.objectives.metrics.includes(suggestion)) {
                                      setProjectData({
                                        ...projectData,
                                        objectives: {
                                          ...projectData.objectives,
                                          metrics: [...projectData.objectives.metrics, suggestion],
                                        },
                                      })
                                    }
                                  }}
                                  className="h-8"
                                >
                                  Add
                                </Button>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <Card className="bg-primary/5 border border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-1">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span>AI Recommendations</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {getAIRecommendations().map((rec, index) => (
                          <div key={index} className="space-y-1">
                            <div className="font-medium text-sm">{rec.title}</div>
                            <div className="text-xs text-muted-foreground">{rec.description}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="text-xs text-primary">Confidence:</div>
                              <Progress value={rec.confidence} className="h-1 flex-1" />
                              <div className="text-xs">{rec.confidence}%</div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="mt-4 bg-muted/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Objectives Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <div className="text-xs font-medium">Objective Clarity</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress
                              value={
                                projectData.objectives.primary.length > 20
                                  ? projectData.objectives.primary.length > 50
                                    ? 90
                                    : 60
                                  : 30
                              }
                              className="h-1 flex-1"
                            />
                            <div className="text-xs">
                              {projectData.objectives.primary.length > 20
                                ? projectData.objectives.primary.length > 50
                                  ? "High"
                                  : "Medium"
                                : "Low"}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium">KPI Measurability</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress
                              value={
                                projectData.objectives.metrics.length >= 3
                                  ? 85
                                  : projectData.objectives.metrics.length >= 1
                                    ? 50
                                    : 20
                              }
                              className="h-1 flex-1"
                            />
                            <div className="text-xs">
                              {projectData.objectives.metrics.length >= 3
                                ? "High"
                                : projectData.objectives.metrics.length >= 1
                                  ? "Medium"
                                  : "Low"}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium">Alignment with Idea</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={85} className="h-1 flex-1" />
                            <div className="text-xs">High</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Final Review */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <Card className="bg-muted/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium">Project Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 space-y-4">
                        <div>
                          <div className="font-medium">Project Name</div>
                          <div className="text-sm mt-1">{projectData.name}</div>
                        </div>

                        <div>
                          <div className="font-medium">Description</div>
                          <div className="text-sm mt-1">{projectData.description}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="font-medium">Timeline</div>
                            <div className="text-sm mt-1">
                              {projectData.timeline.startDate} to {projectData.timeline.endDate}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {projectData.timeline.milestones.reduce((acc, m) => acc + m.duration, 0)} days total
                            </div>
                          </div>

                          <div>
                            <div className="font-medium">Budget</div>
                            <div className="text-sm mt-1">${projectData.resources.budget.toLocaleString()}</div>
                          </div>
                        </div>

                        <div>
                          <div className="font-medium">Team ({projectData.team.length})</div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {projectData.team.map((member) => (
                              <div key={member.id} className="flex items-center gap-1">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                  <AvatarFallback>
                                    {member.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{member.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="font-medium">Technology Stack</div>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {projectData.resources.technologies.map((tech) => (
                              <Badge key={tech.id} variant="outline">
                                {tech.name}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="font-medium">Primary Objective</div>
                          <div className="text-sm mt-1">{projectData.objectives.primary || "Not defined"}</div>
                        </div>

                        {projectData.objectives.metrics.length > 0 && (
                          <div>
                            <div className="font-medium">Key Performance Indicators</div>
                            <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                              {projectData.objectives.metrics.map((metric, index) => (
                                <li key={index}>{metric}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Checklist</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          {[
                            {
                              item: "Project basics defined",
                              complete: projectData.name.length > 0 && projectData.description.length > 0,
                            },
                            { item: "Team assembled", complete: projectData.team.length > 0 },
                            { item: "Timeline planned", complete: projectData.timeline.milestones.length > 0 },
                            {
                              item: "Resources allocated",
                              complete:
                                projectData.resources.budget > 0 && projectData.resources.technologies.length > 0,
                            },
                            {
                              item: "Objectives defined",
                              complete:
                                projectData.objectives.primary.length > 0 || projectData.objectives.metrics.length > 0,
                            },
                          ].map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div
                                className={`h-5 w-5 rounded-full flex items-center justify-center ${
                                  item.complete
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {item.complete ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                              </div>
                              <span className="text-sm">{item.item}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card className="bg-primary/5 border border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-1">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span>AI Recommendations</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {getAIRecommendations().map((rec, index) => (
                          <div key={index} className="space-y-1">
                            <div className="font-medium text-sm">{rec.title}</div>
                            <div className="text-xs text-muted-foreground">{rec.description}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="text-xs text-primary">Confidence:</div>
                              <Progress value={rec.confidence} className="h-1 flex-1" />
                              <div className="text-xs">{rec.confidence}%</div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="mt-4 bg-muted/30">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Project Health Score</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-center">
                          <div className="relative h-32 w-32">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-3xl font-bold">
                                {Math.min(
                                  Math.round(
                                    (((projectData.name.length > 0 ? 1 : 0) +
                                      (projectData.description.length > 20 ? 1 : 0) +
                                      (projectData.team.length > 2 ? 1 : 0) +
                                      (projectData.resources.budget > 0 ? 1 : 0) +
                                      (projectData.resources.technologies.length > 2 ? 1 : 0) +
                                      (projectData.objectives.primary.length > 0 ? 1 : 0) +
                                      (projectData.objectives.metrics.length > 2 ? 1 : 0)) /
                                      7) *
                                      100,
                                  ),
                                  100,
                                )}
                                %
                              </div>
                            </div>
                            <svg className="h-full w-full" viewBox="0 0 100 100">
                              <circle
                                className="text-muted stroke-current"
                                strokeWidth="10"
                                fill="transparent"
                                r="40"
                                cx="50"
                                cy="50"
                              />
                              <circle
                                className="text-primary stroke-current"
                                strokeWidth="10"
                                strokeLinecap="round"
                                fill="transparent"
                                r="40"
                                cx="50"
                                cy="50"
                                strokeDasharray={`${Math.min(
                                  Math.round(
                                    (((projectData.name.length > 0 ? 1 : 0) +
                                      (projectData.description.length > 20 ? 1 : 0) +
                                      (projectData.team.length > 2 ? 1 : 0) +
                                      (projectData.resources.budget > 0 ? 1 : 0) +
                                      (projectData.resources.technologies.length > 2 ? 1 : 0) +
                                      (projectData.objectives.primary.length > 0 ? 1 : 0) +
                                      (projectData.objectives.metrics.length > 2 ? 1 : 0)) /
                                      7) *
                                      251.2,
                                  ),
                                  251.2,
                                )} 251.2`}
                                strokeDashoffset="0"
                                transform="rotate(-90 50 50)"
                              />
                            </svg>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs font-medium">Readiness Assessment</div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`
                              ${
                                projectData.team.length > 0 &&
                                projectData.resources.budget > 0 &&
                                projectData.objectives.primary.length > 0
                                  ? "bg-green-500/10 text-green-500 border-green-500/20"
                                  : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                              }
                            `}
                            >
                              {projectData.team.length > 0 &&
                              projectData.resources.budget > 0 &&
                              projectData.objectives.primary.length > 0
                                ? "Ready to Launch"
                                : "Needs Attention"}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handlePreviousStep}>
                    Back
                  </Button>
                  <Button onClick={handleCreateProject} className="bg-gradient-to-r from-primary to-primary/80">
                    Create Project
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {currentStep < steps.length - 1 && (
          <div className="flex justify-end gap-2 mt-6">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePreviousStep}>
                Previous
              </Button>
            )}
            <Button onClick={handleNextStep}>Next</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
