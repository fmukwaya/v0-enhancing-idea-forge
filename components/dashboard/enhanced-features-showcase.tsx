"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Sparkles, Users, Zap, MessageSquare, Lightbulb, FileText } from "lucide-react"
import { CollaborativeEditing } from "@/components/collaboration/collaborative-editing"
import { EnhancedRecommendations } from "@/components/ai/enhanced-recommendations"
import { AIConversation } from "@/components/ai/ai-conversation"
import { ProjectConversionWorkflow } from "@/components/project-management/project-conversion-workflow"

export function EnhancedFeaturesShowcase() {
  const [showAIChat, setShowAIChat] = useState(false)
  const [activeTab, setActiveTab] = useState("collaborative-editing")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-quantum tracking-tight flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-quantum-600" />
            Enhanced Features
          </h1>
          <p className="text-muted-foreground">
            Explore the new quantum-inspired features to supercharge your idea development
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setShowAIChat(!showAIChat)}>
            <MessageSquare className="h-4 w-4" />
            <span>{showAIChat ? "Hide AI Chat" : "Show AI Chat"}</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-quantum-100/50 dark:bg-quantum-800/50">
          <TabsTrigger value="collaborative-editing" className="flex-1 flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Collaborative Editing</span>
          </TabsTrigger>
          <TabsTrigger value="ai-recommendations" className="flex-1 flex items-center gap-1">
            <Brain className="h-4 w-4" />
            <span>AI Recommendations</span>
          </TabsTrigger>
          <TabsTrigger value="project-conversion" className="flex-1 flex items-center gap-1">
            <Zap className="h-4 w-4" />
            <span>Project Conversion</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collaborative-editing" className="mt-6">
          <CollaborativeEditing />
        </TabsContent>

        <TabsContent value="ai-recommendations" className="mt-6">
          <EnhancedRecommendations />
        </TabsContent>

        <TabsContent value="project-conversion" className="mt-6">
          <ProjectConversionWorkflow />
        </TabsContent>
      </Tabs>

      {showAIChat && <AIConversation />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-quantum-600" />
              Collaborative Editing
            </CardTitle>
            <CardDescription>Real-time collaboration with team members on ideas and projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="font-medium text-sm">Key Features</div>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-1.5 w-1.5 rounded-full p-0" />
                    Real-time cursor tracking and presence
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-1.5 w-1.5 rounded-full p-0" />
                    Threaded comments and discussions
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-1.5 w-1.5 rounded-full p-0" />
                    Version history and change tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-1.5 w-1.5 rounded-full p-0" />
                    AI-powered suggestions and improvements
                  </li>
                </ul>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setActiveTab("collaborative-editing")}>
                Explore Feature
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-quantum-600" />
              Enhanced AI Recommendations
            </CardTitle>
            <CardDescription>Quantum-inspired insights and strategic recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="font-medium text-sm">Key Features</div>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-1.5 w-1.5 rounded-full p-0" />
                    Strategic, technical, and market insights
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-1.5 w-1.5 rounded-full p-0" />
                    Impact and effort analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-1.5 w-1.5 rounded-full p-0" />
                    Detailed recommendations with sources
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-1.5 w-1.5 rounded-full p-0" />
                    One-click application to ideas
                  </li>
                </ul>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setActiveTab("ai-recommendations")}>
                Explore Feature
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-quantum-600" />
              Project Conversion
            </CardTitle>
            <CardDescription>Transform ideas into structured projects with guided workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="font-medium text-sm">Key Features</div>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-1.5 w-1.5 rounded-full p-0" />
                    Step-by-step conversion process
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-1.5 w-1.5 rounded-full p-0" />
                    Team assembly and resource allocation
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-1.5 w-1.5 rounded-full p-0" />
                    Timeline planning with milestones
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-1.5 w-1.5 rounded-full p-0" />
                    AI-assisted objective setting and KPIs
                  </li>
                </ul>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setActiveTab("project-conversion")}>
                Explore Feature
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-quantum-600" />
            AI Conversation
          </CardTitle>
          <CardDescription>Context-aware AI assistant with web search capabilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="font-medium text-sm">Key Features</div>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-1.5 w-1.5 rounded-full p-0" />
                    Context-aware conversations
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-1.5 w-1.5 rounded-full p-0" />
                    Web search integration
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-1.5 w-1.5 rounded-full p-0" />
                    Transparent AI thinking process
                  </li>
                  <li className="flex items-center gap-2">
                    <Badge variant="outline" className="h-1.5 w-1.5 rounded-full p-0" />
                    Source citation and references
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <div className="font-medium text-sm">Use Cases</div>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    <Lightbulb className="h-3.5 w-3.5 text-quantum-600" />
                    Brainstorming new ideas and approaches
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-quantum-600" />
                    Researching market trends and competitors
                  </li>
                  <li className="flex items-center gap-2">
                    <Brain className="h-3.5 w-3.5 text-quantum-600" />
                    Technical architecture planning
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-quantum-600" />
                    Feature prioritization and roadmapping
                  </li>
                </ul>
              </div>

              <div className="flex flex-col justify-between h-full">
                <div className="text-sm text-muted-foreground">
                  The AI Conversation feature provides a floating chat interface that can be accessed from anywhere in
                  the application, maintaining context across different views.
                </div>
                <Button className="mt-4 w-full bg-quantum-600 hover:bg-quantum-700" onClick={() => setShowAIChat(true)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Open AI Chat
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
