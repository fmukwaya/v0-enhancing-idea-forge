"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowRight, Lightbulb, TrendingUp, Users, Zap, Star, Sparkles } from "lucide-react"

interface IdeaCardProps {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  score: number
  creator: {
    name: string
    avatar: string
  }
  matchReason: string
  matchScore: number
}

const IdeaCard = ({
  id,
  title,
  description,
  category,
  tags,
  score,
  creator,
  matchReason,
  matchScore,
}: IdeaCardProps) => {
  return (
    <Card className="w-full overflow-hidden border-quantum-200 dark:border-quantum-800 hover:border-quantum-400 dark:hover:border-quantum-600 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            <CardDescription className="line-clamp-2">{description}</CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 bg-quantum-100 dark:bg-quantum-800 px-2 py-1 rounded-full">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-medium">{score}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Idea Score</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="bg-quantum-100/50 dark:bg-quantum-800/50">
            {category}
          </Badge>
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-transparent">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={creator.avatar || "/placeholder.svg"} alt={creator.name} />
              <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{creator.name}</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <Zap
                    className={`h-4 w-4 ${matchScore >= 90 ? "text-amber-500" : matchScore >= 70 ? "text-emerald-500" : "text-blue-500"}`}
                  />
                  <span className="text-sm font-medium">{matchScore}% match</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{matchReason}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-quantum-600 dark:text-quantum-400 hover:text-quantum-800 dark:hover:text-quantum-200"
        >
          View Idea
          <ArrowRight className="ml-auto h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

interface IdeaRecommendationEngineProps {
  userId: string
  userRole: string
  userInterests: string[]
}

export function IdeaRecommendationEngine({ userId, userRole, userInterests }: IdeaRecommendationEngineProps) {
  const [activeTab, setActiveTab] = useState("personalized")

  // Mock data for recommendations
  const personalizedIdeas = [
    {
      id: "idea-1",
      title: "AI-Powered Customer Insights Dashboard",
      description:
        "Create a dashboard that uses AI to analyze customer feedback and provide actionable insights for product improvements.",
      category: "Product",
      tags: ["AI", "Analytics", "Customer Experience"],
      score: 92,
      creator: {
        name: "Maria Garcia",
        avatar: "/person-with-glasses.png",
      },
      matchReason: "Based on your interest in AI and analytics",
      matchScore: 95,
    },
    {
      id: "idea-2",
      title: "Quantum-Inspired Project Planning Tool",
      description:
        "Develop a project planning tool that uses quantum computing principles to optimize resource allocation and scheduling.",
      category: "Technology",
      tags: ["Quantum", "Project Management", "Optimization"],
      score: 88,
      creator: {
        name: "James Smith",
        avatar: "/curly-haired-person.png",
      },
      matchReason: "Matches your work on quantum interfaces",
      matchScore: 90,
    },
    {
      id: "idea-3",
      title: "Biometric Authentication for Internal Tools",
      description:
        "Implement biometric authentication for all internal tools to enhance security while improving user experience.",
      category: "Security",
      tags: ["Biometrics", "Authentication", "UX"],
      score: 85,
      creator: {
        name: "Sarah Wilson",
        avatar: "/person-dark-hair.png",
      },
      matchReason: "Aligns with your security enhancement initiatives",
      matchScore: 82,
    },
  ]

  const trendingIdeas = [
    {
      id: "idea-4",
      title: "Cross-Dimensional Data Visualization",
      description:
        "Create a visualization tool that can represent data across multiple dimensions, making complex relationships more intuitive.",
      category: "Data",
      tags: ["Visualization", "Multi-dimensional", "Analytics"],
      score: 94,
      creator: {
        name: "Alex Johnson",
        avatar: "/short-haired-person.png",
      },
      matchReason: "Trending in your organization",
      matchScore: 75,
    },
    {
      id: "idea-5",
      title: "Synesthetic User Interface Framework",
      description:
        "Develop a UI framework that engages multiple senses to create more immersive and accessible user experiences.",
      category: "Design",
      tags: ["Synesthesia", "Accessibility", "UX"],
      score: 91,
      creator: {
        name: "Lisa Miller",
        avatar: "/person-with-glasses.png",
      },
      matchReason: "Popular among designers",
      matchScore: 80,
    },
    {
      id: "idea-6",
      title: "Temporal Intelligence for Decision Making",
      description:
        "Implement a system that uses temporal patterns to provide context-aware recommendations for decision making.",
      category: "AI",
      tags: ["Temporal", "Decision Support", "Intelligence"],
      score: 89,
      creator: {
        name: "David Brown",
        avatar: "/curly-haired-person.png",
      },
      matchReason: "Gaining traction across departments",
      matchScore: 70,
    },
  ]

  const collaborativeIdeas = [
    {
      id: "idea-7",
      title: "Quantum Communication Protocol",
      description:
        "Design a secure communication protocol based on quantum entanglement principles for ultra-secure data transmission.",
      category: "Communication",
      tags: ["Quantum", "Security", "Protocol"],
      score: 90,
      creator: {
        name: "James Smith",
        avatar: "/curly-haired-person.png",
      },
      matchReason: "Collaboration opportunity with your team",
      matchScore: 88,
    },
    {
      id: "idea-8",
      title: "Cognitive Load Optimization System",
      description:
        "Create a system that monitors and optimizes cognitive load during complex tasks to improve productivity and reduce errors.",
      category: "Productivity",
      tags: ["Cognitive", "Optimization", "Productivity"],
      score: 87,
      creator: {
        name: "Sarah Wilson",
        avatar: "/person-dark-hair.png",
      },
      matchReason: "Complements your current projects",
      matchScore: 85,
    },
    {
      id: "idea-9",
      title: "N-Dimensional Workspace Interface",
      description:
        "Develop an interface that allows users to organize and navigate information in n-dimensional conceptual spaces.",
      category: "Interface",
      tags: ["Dimensional", "Navigation", "Organization"],
      score: 86,
      creator: {
        name: "Alex Johnson",
        avatar: "/short-haired-person.png",
      },
      matchReason: "Builds on your dimensional transcendence work",
      matchScore: 92,
    },
  ]

  return (
    <Card className="w-full overflow-hidden border-quantum-600/20 bg-gradient-to-br from-white to-quantum-50/30 dark:from-quantum-950 dark:to-quantum-900">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-quantum tracking-tight flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-quantum-600" />
              Idea Recommendations
            </CardTitle>
            <CardDescription className="text-quantum-700 dark:text-quantum-300">
              Discover ideas that align with your interests and projects
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-quantum-100/50 dark:bg-quantum-800/50">
            <TabsTrigger value="personalized" className="flex-1 flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              <span>For You</span>
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex-1 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>Trending</span>
            </TabsTrigger>
            <TabsTrigger value="collaborative" className="flex-1 flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Collaboration</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="personalized" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {personalizedIdeas.map((idea) => (
                <IdeaCard key={idea.id} {...idea} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="trending" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingIdeas.map((idea) => (
                <IdeaCard key={idea.id} {...idea} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="collaborative" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collaborativeIdeas.map((idea) => (
                <IdeaCard key={idea.id} {...idea} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-3">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-quantum-200 dark:border-quantum-700 hover:bg-quantum-100 dark:hover:bg-quantum-800"
        >
          View All Recommendations
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
