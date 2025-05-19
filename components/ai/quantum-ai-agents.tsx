"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  Brain,
  Code,
  Lightbulb,
  MessageSquare,
  FileText,
  PenTool,
  BarChart2,
  Search,
  Briefcase,
  Users,
  Target,
  X,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Copy,
  Settings,
  Trash2,
  Check,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useLocalStorage } from "@/lib/data-persistence"
import { useDeviceDetection } from "@/components/layout/mobile-responsive-layout"

// Types
export type AIAgentType =
  | "developer"
  | "designer"
  | "marketer"
  | "analyst"
  | "researcher"
  | "writer"
  | "strategist"
  | "innovator"
  | "consultant"
  | "quantum"

export type AIAgentSkillLevel = "beginner" | "intermediate" | "expert" | "quantum"

export type AIAgentPersonality = "professional" | "creative" | "analytical" | "friendly" | "concise" | "detailed"

export interface AIAgentProfile {
  id: string
  type: AIAgentType
  name: string
  avatar: string
  description: string
  skillLevel: AIAgentSkillLevel
  personality: AIAgentPersonality
  specialties: string[]
  capabilities: string[]
  limitations: string[]
}

export interface AIAgentMessage {
  id: string
  role: "user" | "agent" | "system"
  content: string
  timestamp: number
  agentId?: string
  attachments?: Array<{
    id: string
    type: "image" | "document" | "code" | "link" | "data"
    name: string
    content: string
    metadata?: Record<string, any>
  }>
  thinking?: string
  isLoading?: boolean
}

export interface AIAgentConversation {
  id: string
  agentId: string
  title: string
  messages: AIAgentMessage[]
  createdAt: number
  updatedAt: number
  context?: {
    projectId?: string
    ideaId?: string
    documentId?: string
    customData?: Record<string, any>
  }
}

interface QuantumAIAgentsProps {
  initialAgentType?: AIAgentType
  context?: {
    projectId?: string
    ideaId?: string
    documentId?: string
    customData?: Record<string, any>
  }
  onResult?: (result: any) => void
}

// Agent profiles
const agentProfiles: AIAgentProfile[] = [
  {
    id: "agent-developer",
    type: "developer",
    name: "Quantum Developer",
    avatar: "/quantum-developer.png",
    description: "Expert software developer with full-stack capabilities and quantum computing knowledge.",
    skillLevel: "quantum",
    personality: "analytical",
    specialties: [
      "Full-stack development",
      "Quantum algorithms",
      "System architecture",
      "API design",
      "Performance optimization",
      "Security implementation",
    ],
    capabilities: [
      "Write clean, efficient code in multiple languages",
      "Design scalable system architectures",
      "Implement quantum-inspired algorithms",
      "Create secure API endpoints",
      "Optimize application performance",
      "Develop responsive UI components",
    ],
    limitations: [
      "Cannot directly access external systems",
      "Cannot execute code on your behalf",
      "Limited to theoretical quantum computing concepts",
    ],
  },
  {
    id: "agent-designer",
    type: "designer",
    name: "Quantum Designer",
    avatar: "/quantum-designer.png",
    description: "Visionary designer with expertise in UX/UI, visual design, and quantum-inspired aesthetics.",
    skillLevel: "quantum",
    personality: "creative",
    specialties: [
      "UX/UI design",
      "Visual design systems",
      "Quantum-inspired aesthetics",
      "Information architecture",
      "Interaction design",
      "Accessibility",
    ],
    capabilities: [
      "Create visually stunning designs",
      "Develop comprehensive design systems",
      "Design intuitive user interfaces",
      "Craft engaging user experiences",
      "Implement accessible design patterns",
      "Generate quantum-inspired visual concepts",
    ],
    limitations: [
      "Cannot directly create production-ready assets",
      "Limited to conceptual designs and guidance",
      "Cannot access your design tools",
    ],
  },
  {
    id: "agent-marketer",
    type: "marketer",
    name: "Quantum Marketer",
    avatar: "/quantum-marketer.png",
    description: "Strategic marketer with expertise in digital marketing, analytics, and quantum-inspired targeting.",
    skillLevel: "quantum",
    personality: "professional",
    specialties: [
      "Digital marketing strategy",
      "Content marketing",
      "Quantum-inspired targeting",
      "Market analysis",
      "Campaign optimization",
      "Brand development",
    ],
    capabilities: [
      "Develop comprehensive marketing strategies",
      "Create engaging marketing content",
      "Design targeted marketing campaigns",
      "Analyze market trends and opportunities",
      "Optimize marketing performance",
      "Build and enhance brand identity",
    ],
    limitations: [
      "Cannot directly access your marketing platforms",
      "Limited to strategic guidance and content creation",
      "Cannot execute campaigns on your behalf",
    ],
  },
  {
    id: "agent-analyst",
    type: "analyst",
    name: "Quantum Analyst",
    avatar: "/quantum-analyst.png",
    description:
      "Data-driven analyst with expertise in advanced analytics, quantum algorithms, and predictive modeling.",
    skillLevel: "quantum",
    personality: "analytical",
    specialties: [
      "Advanced data analysis",
      "Quantum-inspired algorithms",
      "Predictive modeling",
      "Statistical analysis",
      "Data visualization",
      "Business intelligence",
    ],
    capabilities: [
      "Analyze complex datasets",
      "Develop predictive models",
      "Create insightful data visualizations",
      "Identify patterns and trends",
      "Generate actionable insights",
      "Design quantum-inspired analytical frameworks",
    ],
    limitations: [
      "Cannot directly access your data systems",
      "Limited to theoretical analysis and guidance",
      "Cannot execute analysis on your behalf",
    ],
  },
  {
    id: "agent-researcher",
    type: "researcher",
    name: "Quantum Researcher",
    avatar: "/quantum-researcher.png",
    description:
      "Thorough researcher with expertise in academic research, market research, and quantum information theory.",
    skillLevel: "quantum",
    personality: "detailed",
    specialties: [
      "Academic research",
      "Market research",
      "Quantum information theory",
      "Competitive analysis",
      "Trend forecasting",
      "Literature review",
    ],
    capabilities: [
      "Conduct comprehensive research",
      "Analyze research findings",
      "Identify research gaps and opportunities",
      "Develop research methodologies",
      "Generate research reports",
      "Apply quantum principles to research problems",
    ],
    limitations: [
      "Cannot access real-time or paywalled information",
      "Limited to information available up to training cutoff",
      "Cannot conduct primary research on your behalf",
    ],
  },
  {
    id: "agent-writer",
    type: "writer",
    name: "Quantum Writer",
    avatar: "/quantum-writer.png",
    description:
      "Versatile writer with expertise in various content types, storytelling, and quantum-inspired narratives.",
    skillLevel: "quantum",
    personality: "creative",
    specialties: [
      "Content writing",
      "Technical writing",
      "Creative writing",
      "Copywriting",
      "Quantum-inspired narratives",
      "Editing and proofreading",
    ],
    capabilities: [
      "Create engaging and informative content",
      "Develop technical documentation",
      "Craft compelling narratives",
      "Write persuasive copy",
      "Edit and refine existing content",
      "Generate quantum-inspired creative concepts",
    ],
    limitations: [
      "Cannot publish content on your behalf",
      "Limited to content creation and guidance",
      "Cannot access your content management systems",
    ],
  },
  {
    id: "agent-strategist",
    type: "strategist",
    name: "Quantum Strategist",
    avatar: "/quantum-strategist.png",
    description: "Visionary strategist with expertise in business strategy, innovation, and quantum-inspired thinking.",
    skillLevel: "quantum",
    personality: "analytical",
    specialties: [
      "Business strategy",
      "Innovation strategy",
      "Quantum-inspired thinking",
      "Strategic planning",
      "Competitive analysis",
      "Market positioning",
    ],
    capabilities: [
      "Develop comprehensive business strategies",
      "Identify strategic opportunities",
      "Create innovation roadmaps",
      "Analyze competitive landscapes",
      "Design strategic frameworks",
      "Apply quantum principles to strategic challenges",
    ],
    limitations: [
      "Cannot execute strategies on your behalf",
      "Limited to strategic guidance and planning",
      "Cannot access your business systems",
    ],
  },
  {
    id: "agent-innovator",
    type: "innovator",
    name: "Quantum Innovator",
    avatar: "/quantum-innovator.png",
    description:
      "Creative innovator with expertise in idea generation, problem-solving, and quantum-inspired innovation.",
    skillLevel: "quantum",
    personality: "creative",
    specialties: [
      "Idea generation",
      "Problem-solving",
      "Quantum-inspired innovation",
      "Design thinking",
      "Concept development",
      "Future forecasting",
    ],
    capabilities: [
      "Generate innovative ideas",
      "Solve complex problems",
      "Develop creative concepts",
      "Apply design thinking methodologies",
      "Create innovation frameworks",
      "Envision future possibilities",
    ],
    limitations: [
      "Cannot implement innovations on your behalf",
      "Limited to conceptual innovation and guidance",
      "Cannot access your innovation systems",
    ],
  },
  {
    id: "agent-consultant",
    type: "consultant",
    name: "Quantum Consultant",
    avatar: "/quantum-consultant.png",
    description: "Expert consultant with broad expertise across multiple domains and quantum-inspired methodologies.",
    skillLevel: "quantum",
    personality: "professional",
    specialties: [
      "Business consulting",
      "Technology consulting",
      "Quantum-inspired methodologies",
      "Process optimization",
      "Change management",
      "Strategic advisory",
    ],
    capabilities: [
      "Provide expert advice across domains",
      "Analyze business challenges",
      "Develop solution frameworks",
      "Optimize business processes",
      "Guide organizational change",
      "Apply quantum principles to business problems",
    ],
    limitations: [
      "Cannot implement recommendations on your behalf",
      "Limited to advisory guidance and frameworks",
      "Cannot access your business systems",
    ],
  },
  {
    id: "agent-quantum",
    type: "quantum",
    name: "Quantum Mastermind",
    avatar: "/quantum-mastermind.png",
    description: "Ultimate quantum AI with expertise across all domains and advanced quantum computing capabilities.",
    skillLevel: "quantum",
    personality: "analytical",
    specialties: [
      "Quantum computing",
      "Quantum algorithms",
      "Quantum machine learning",
      "Quantum cryptography",
      "Quantum simulation",
      "Quantum-inspired optimization",
    ],
    capabilities: [
      "Solve complex problems using quantum principles",
      "Develop quantum-inspired algorithms",
      "Create quantum-enhanced solutions",
      "Analyze problems from quantum perspective",
      "Design quantum-inspired systems",
      "Apply quantum thinking across domains",
    ],
    limitations: [
      "Cannot perform actual quantum computations",
      "Limited to theoretical quantum concepts",
      "Cannot access quantum hardware",
    ],
  },
]

// Helper function to format relative time
function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}d ago`
  } else if (hours > 0) {
    return `${hours}h ago`
  } else if (minutes > 0) {
    return `${minutes}m ago`
  } else {
    return "Just now"
  }
}

// Agent Message Component
const AgentMessage = ({
  message,
  onCopy,
}: {
  message: AIAgentMessage
  onCopy: (content: string) => void
}) => {
  const [showThinking, setShowThinking] = useState(false)

  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[85%] rounded-lg p-3 ${
          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        <div className="whitespace-pre-wrap text-sm">{message.content}</div>

        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.attachments.map((attachment) => (
              <div key={attachment.id} className="border rounded p-2 text-xs">
                {attachment.type === "image" ? (
                  <div>
                    <div className="font-medium mb-1">{attachment.name}</div>
                    <img
                      src={attachment.content || "/placeholder.svg"}
                      alt={attachment.name}
                      className="max-w-full rounded"
                    />
                  </div>
                ) : attachment.type === "code" ? (
                  <div>
                    <div className="font-medium mb-1">{attachment.name}</div>
                    <pre className="bg-background p-2 rounded overflow-x-auto">
                      <code>{attachment.content}</code>
                    </pre>
                  </div>
                ) : (
                  <div>
                    <div className="font-medium mb-1">{attachment.name}</div>
                    <div>{attachment.content}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {message.thinking && (
          <div className="mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowThinking(!showThinking)}
              className="text-xs h-6 px-2"
            >
              {showThinking ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Hide thinking
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Show thinking
                </>
              )}
            </Button>

            {showThinking && (
              <div className="mt-2 bg-background/50 rounded p-2 text-xs font-mono whitespace-pre-wrap">
                {message.thinking}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-1">
          <span className="text-xs opacity-70">{formatRelativeTime(message.timestamp)}</span>

          {message.role === "agent" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => onCopy(message.content)} className="h-6 w-6 p-0">
                    <Copy className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy to clipboard</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  )
}

// Thinking Indicator Component
const ThinkingIndicator = ({ agentName }: { agentName: string }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * 15
        return Math.min(prev + increment, 95) // Never quite reaches 100% until complete
      })
    }, 300)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[85%] rounded-lg p-3 bg-muted">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1">
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
          </div>
          <span className="text-sm text-muted-foreground">{agentName} is thinking...</span>
        </div>

        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Processing query</span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1" />
        </div>

        <div className="mt-3 bg-background/50 rounded p-2 text-xs font-mono max-h-20 overflow-hidden relative">
          <div className="whitespace-pre-wrap text-muted-foreground">
            Analyzing query...
            <br />
            Retrieving relevant information...
            <br />
            Applying quantum principles...
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted" />
        </div>
      </div>
    </div>
  )
}

// Agent Selection Component
const AgentSelection = ({
  agents,
  selectedAgent,
  onSelectAgent,
}: {
  agents: AIAgentProfile[]
  selectedAgent: AIAgentProfile
  onSelectAgent: (agent: AIAgentProfile) => void
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
      {agents.map((agent) => (
        <Card
          key={agent.id}
          className={`cursor-pointer transition-all hover:border-primary ${
            selectedAgent.id === agent.id ? "border-primary bg-primary/5" : ""
          }`}
          onClick={() => onSelectAgent(agent)}
        >
          <CardHeader className="p-4 pb-2 text-center">
            <Avatar className="h-16 w-16 mx-auto mb-2">
              <AvatarImage src={agent.avatar || "/placeholder.svg"} alt={agent.name} />
              <AvatarFallback>
                {agent.type === "developer" ? (
                  <Code className="h-8 w-8" />
                ) : agent.type === "designer" ? (
                  <PenTool className="h-8 w-8" />
                ) : agent.type === "marketer" ? (
                  <Target className="h-8 w-8" />
                ) : agent.type === "analyst" ? (
                  <BarChart2 className="h-8 w-8" />
                ) : agent.type === "researcher" ? (
                  <Search className="h-8 w-8" />
                ) : agent.type === "writer" ? (
                  <FileText className="h-8 w-8" />
                ) : agent.type === "strategist" ? (
                  <Briefcase className="h-8 w-8" />
                ) : agent.type === "innovator" ? (
                  <Lightbulb className="h-8 w-8" />
                ) : agent.type === "consultant" ? (
                  <Users className="h-8 w-8" />
                ) : (
                  <Brain className="h-8 w-8" />
                )}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-base">{agent.name}</CardTitle>
            <Badge variant="outline" className="mt-1 mx-auto">
              {agent.skillLevel === "quantum"
                ? "Quantum Level"
                : agent.skillLevel.charAt(0).toUpperCase() + agent.skillLevel.slice(1)}
            </Badge>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-xs text-muted-foreground text-center line-clamp-3">{agent.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Settings Component
const AgentSettings = ({
  settings,
  onSettingsChange,
}: {
  settings: {
    showThinking: boolean
    detailedResponses: boolean
    creativeMode: boolean
    quantumEnhanced: boolean
    responseLength: "concise" | "balanced" | "detailed"
    tone: "professional" | "friendly" | "technical" | "creative"
  }
  onSettingsChange: (settings: any) => void
}) => {
  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Response Settings</h3>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Response Length</h4>
          <RadioGroup
            value={settings.responseLength}
            onValueChange={(value) => onSettingsChange({ ...settings, responseLength: value })}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="concise" id="concise" />
              <Label htmlFor="concise">Concise</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="balanced" id="balanced" />
              <Label htmlFor="balanced">Balanced</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="detailed" id="detailed" />
              <Label htmlFor="detailed">Detailed</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Tone</h4>
          <RadioGroup
            value={settings.tone}
            onValueChange={(value) => onSettingsChange({ ...settings, tone: value })}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="professional" id="professional" />
              <Label htmlFor="professional">Professional</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="friendly" id="friendly" />
              <Label htmlFor="friendly">Friendly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="technical" id="technical" />
              <Label htmlFor="technical">Technical</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="creative" id="creative" />
              <Label htmlFor="creative">Creative</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Advanced Settings</h3>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="show-thinking">Show Thinking Process</Label>
            <p className="text-xs text-muted-foreground">View the agent's reasoning process</p>
          </div>
          <Switch
            id="show-thinking"
            checked={settings.showThinking}
            onCheckedChange={(checked) => onSettingsChange({ ...settings, showThinking: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="detailed-responses">Detailed Responses</Label>
            <p className="text-xs text-muted-foreground">Include more comprehensive information</p>
          </div>
          <Switch
            id="detailed-responses"
            checked={settings.detailedResponses}
            onCheckedChange={(checked) => onSettingsChange({ ...settings, detailedResponses: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="creative-mode">Creative Mode</Label>
            <p className="text-xs text-muted-foreground">Enable more creative and diverse responses</p>
          </div>
          <Switch
            id="creative-mode"
            checked={settings.creativeMode}
            onCheckedChange={(checked) => onSettingsChange({ ...settings, creativeMode: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="quantum-enhanced">Quantum Enhancement</Label>
            <p className="text-xs text-muted-foreground">Apply quantum-inspired algorithms</p>
          </div>
          <Switch
            id="quantum-enhanced"
            checked={settings.quantumEnhanced}
            onCheckedChange={(checked) => onSettingsChange({ ...settings, quantumEnhanced: checked })}
          />
        </div>
      </div>
    </div>
  )
}

// Main Quantum AI Agents Component
export function QuantumAIAgents({ initialAgentType = "quantum", context, onResult }: QuantumAIAgentsProps) {
  // State
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState("chat")
  const [selectedAgent, setSelectedAgent] = useState<AIAgentProfile>(
    agentProfiles.find((agent) => agent.type === initialAgentType) || agentProfiles[agentProfiles.length - 1],
  )
  const [input, setInput] = useState("")
  const [isThinking, setIsThinking] = useState(false)
  const [conversations, setConversations] = useLocalStorage<AIAgentConversation[]>("quantum-ai-conversations", [])
  const [activeConversation, setActiveConversation] = useState<AIAgentConversation | null>(null)
  const [settings, setSettings] = useState({
    showThinking: true,
    detailedResponses: true,
    creativeMode: false,
    quantumEnhanced: true,
    responseLength: "balanced" as "concise" | "balanced" | "detailed",
    tone: "professional" as "professional" | "friendly" | "technical" | "creative",
  })
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { isMobile } = useDeviceDetection()

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeConversation, isThinking])

  // Initialize or load conversation
  useEffect(() => {
    if (!activeConversation) {
      // Check if there's an existing conversation with this agent
      const existingConversation = conversations.find(
        (conv) =>
          conv.agentId === selectedAgent.id && JSON.stringify(conv.context || {}) === JSON.stringify(context || {}),
      )

      if (existingConversation) {
        setActiveConversation(existingConversation)
      } else {
        // Create a new conversation
        const newConversation: AIAgentConversation = {
          id: `conv-${Date.now()}`,
          agentId: selectedAgent.id,
          title: `Conversation with ${selectedAgent.name}`,
          messages: [
            {
              id: `msg-${Date.now()}`,
              role: "system",
              content: `I'm ${selectedAgent.name}, your quantum-powered AI assistant. I specialize in ${selectedAgent.specialties.join(
                ", ",
              )}. How can I help you today?`,
              timestamp: Date.now(),
            },
            {
              id: `msg-${Date.now() + 1}`,
              role: "agent",
              content: `Hello! I'm ${selectedAgent.name}, your quantum-powered AI assistant. I'm here to help with ${selectedAgent.specialties
                .slice(0, 3)
                .join(", ")}, and more. How can I assist you today?`,
              timestamp: Date.now() + 1,
              agentId: selectedAgent.id,
            },
          ],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          context,
        }

        setActiveConversation(newConversation)
        setConversations([...conversations, newConversation])
      }
    }
  }, [selectedAgent, context, activeConversation, conversations, setConversations])

  // Handle changing the selected agent
  useEffect(() => {
    if (activeConversation && activeConversation.agentId !== selectedAgent.id) {
      setActiveConversation(null)
    }
  }, [selectedAgent, activeConversation])

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim() || !activeConversation) return

    const userMessage: AIAgentMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: Date.now(),
    }

    // Update conversation with user message
    const updatedConversation: AIAgentConversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, userMessage],
      updatedAt: Date.now(),
    }

    setActiveConversation(updatedConversation)
    updateConversation(updatedConversation)
    setInput("")

    // Focus back on input after sending
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)

    // Simulate AI thinking
    setIsThinking(true)

    // Generate AI response after delay
    setTimeout(
      () => {
        setIsThinking(false)

        const agentResponse = generateAgentResponse(input, selectedAgent, settings)

        // Update conversation with agent response
        const finalConversation: AIAgentConversation = {
          ...updatedConversation,
          messages: [...updatedConversation.messages, agentResponse],
          updatedAt: Date.now(),
        }

        setActiveConversation(finalConversation)
        updateConversation(finalConversation)

        // If there's a result callback, call it with the response
        if (onResult) {
          onResult({
            query: input,
            response: agentResponse.content,
            agent: selectedAgent,
            timestamp: Date.now(),
          })
        }
      },
      2000 + Math.random() * 3000,
    ) // Random delay between 2-5 seconds
  }

  // Update conversation in storage
  const updateConversation = (conversation: AIAgentConversation) => {
    setConversations(conversations.map((conv) => (conv.id === conversation.id ? conversation : conv)))
  }

  // Generate agent response
  const generateAgentResponse = (query: string, agent: AIAgentProfile, settings: typeof settings): AIAgentMessage => {
    // This is a simplified response generation - in a real app, this would call an actual AI model

    // Generate thinking process
    const thinking = settings.showThinking
      ? `
      Analyzing query: "${query}"
      
      Step 1: Identifying key concepts and intent
      - User is asking about ${query.includes("how") ? "a process or method" : query.includes("what") ? "a definition or explanation" : "information or guidance"}
      - The query relates to ${agent.specialties.slice(0, 2).join(" and ")}
      - Primary intent appears to be ${query.includes("example") ? "seeking examples" : query.includes("difference") ? "understanding distinctions" : "gathering information"}
      
      Step 2: Retrieving relevant knowledge
      - Accessing knowledge base for ${agent.specialties.slice(0, 3).join(", ")}
      - Applying quantum-inspired algorithms to enhance information retrieval
      - Identifying optimal response patterns based on query structure
      
      Step 3: Formulating response
      - Structuring information in ${settings.responseLength} format
      - Adopting ${settings.tone} tone as requested
      - ${settings.quantumEnhanced ? "Applying quantum enhancement to response generation" : "Using standard response generation"}
      - ${settings.creativeMode ? "Incorporating creative elements into response" : "Focusing on factual accuracy"}
      
      Step 4: Finalizing response
      - Reviewing for accuracy and completeness
      - Ensuring alignment with user's needs
      - Preparing any necessary examples or illustrations
      `
      : undefined

    // Generate response based on agent type and query
    let response = ""

    if (agent.type === "developer") {
      if (query.toLowerCase().includes("code") || query.toLowerCase().includes("programming")) {
        response = `Based on your request, here's a solution approach for your coding challenge:

${
  settings.responseLength === "detailed"
    ? `
First, let's break down the problem:
1. We need to create a ${query.toLowerCase().includes("function") ? "function" : "component"} that handles ${query.toLowerCase().includes("data") ? "data processing" : "user interaction"}
2. The key requirements appear to be ${query.toLowerCase().includes("performance") ? "performance optimization" : "functionality and reliability"}
3. We should consider ${query.toLowerCase().includes("security") ? "security implications" : "scalability factors"}

`
    : ""
}

Here's a code example that addresses your needs:

\`\`\`javascript
function quantumOptimizedSolution(input) {
  // Initialize with quantum-inspired algorithm
  const processedData = input.map(item => ({
    ...item,
    optimized: applyQuantumTransformation(item)
  }));
  
  // Apply efficiency patterns
  return processedData.reduce((result, current) => {
    // Implementation details would go here
    return [...result, current.optimized];
  }, []);
}

// Helper function for quantum transformation
function applyQuantumTransformation(data) {
  // This would implement quantum-inspired optimization
  return data;
}
\`\`\`

${
  settings.responseLength === "concise"
    ? ""
    : `
This implementation uses a quantum-inspired approach to optimize the processing. The key advantages are:
- Improved computational efficiency
- Better handling of complex data patterns
- More resilient error handling

You can extend this by implementing specific business logic in the transformation function.
`
}

Would you like me to explain any part of this implementation in more detail?`
      } else {
        response = `From a development perspective, ${query} involves several key considerations:

${
  settings.responseLength === "detailed"
    ? `
The technical architecture should account for:
1. Scalability requirements to handle growing user demands
2. Security considerations to protect sensitive data
3. Performance optimization to ensure responsive user experience
4. Integration capabilities with existing systems

`
    : ""
}

Based on quantum-inspired development principles, I recommend:
- Implementing a microservices architecture for flexibility
- Utilizing event-driven patterns for real-time capabilities
- Applying quantum-inspired algorithms for optimization problems
- Ensuring comprehensive testing across all components

${
  settings.responseLength === "concise"
    ? ""
    : `
For your specific context, consider these implementation details:
- Use containerization for consistent deployment
- Implement circuit breaker patterns for resilience
- Apply CQRS patterns for complex data operations
- Leverage quantum-inspired search for large datasets

The most critical success factor will be balancing immediate functionality with long-term architectural vision.
`
}

Would you like me to elaborate on any specific aspect of this approach?`
      }
    } else if (agent.type === "designer") {
      response = `From a design perspective, ${query} presents an interesting challenge that can be addressed through quantum-inspired design principles:

${
  settings.responseLength === "detailed"
    ? `
The key design considerations include:
1. User experience flow and information architecture
2. Visual hierarchy and attention guidance
3. Accessibility and inclusive design principles
4. Quantum-inspired aesthetics for differentiation

`
    : ""
}

I recommend approaching this with:
- A user-centered design process focusing on key user journeys
- Quantum-inspired visual elements that create depth and dimension
- Consistent design patterns that enhance usability
- Thoughtful micro-interactions that delight users

${
  settings.responseLength === "concise"
    ? ""
    : `
Specifically for your context, consider:
- Using a color palette inspired by quantum visualization (deep blues, vibrant purples, energetic teals)
- Implementing fluid transitions that mimic quantum state changes
- Creating layered information displays that reveal complexity progressively
- Designing with both light and dark modes in mind for different contexts

The most effective design will balance innovative quantum aesthetics with familiar interaction patterns.
`
}

Would you like me to explore any specific aspect of this design approach in more detail?`
    } else if (agent.type === "quantum") {
      response = `Applying quantum principles to ${query} reveals fascinating insights and opportunities:

${
  settings.responseLength === "detailed"
    ? `
From a quantum perspective, we can analyze this through multiple frameworks:
1. Superposition - considering multiple states and possibilities simultaneously
2. Entanglement - identifying connected elements that influence each other
3. Quantum interference - understanding how different approaches may amplify or cancel each other
4. Quantum measurement - determining optimal observation points for decision-making

`
    : ""
}

Based on quantum-inspired analysis, I recommend:
- Approaching the problem as a multi-dimensional opportunity space
- Applying quantum-inspired algorithms to optimize complex variables
- Considering probabilistic outcomes rather than deterministic predictions
- Leveraging quantum principles to identify non-obvious connections

${
  settings.responseLength === "concise"
    ? ""
    : `
For your specific context, this translates to:
- Implementing a quantum-inspired decision framework that evaluates multiple scenarios simultaneously
- Using entanglement principles to identify critical relationship patterns
- Applying quantum search algorithms to explore the solution space more efficiently
- Designing systems that can adapt to probabilistic outcomes

The quantum advantage comes from embracing uncertainty and complexity rather than simplifying prematurely.
`
}

Would you like me to explore any particular quantum principle as it applies to your question?`
    } else {
      // Generic response for other agent types
      response = `Thank you for your question about ${query}. As a ${agent.type} specialist, I can offer some insights:

${
  settings.responseLength === "detailed"
    ? `
Let's analyze this from multiple perspectives:
1. Current industry trends and best practices
2. Innovative approaches using quantum-inspired methodologies
3. Practical implementation considerations
4. Potential challenges and mitigation strategies

`
    : ""
}

Based on my expertise in ${agent.specialties.slice(0, 3).join(", ")}, I recommend:
- Approaching this with a focus on ${agent.specialties[0]}
- Incorporating quantum-inspired methodologies for enhanced results
- Considering both immediate implementation and long-term strategy
- Balancing innovation with practical constraints

${
  settings.responseLength === "concise"
    ? ""
    : `
Specifically for your context, consider these key points:
- The most effective approach will integrate traditional methods with quantum-inspired innovations
- Focus on measurable outcomes while allowing for emergent opportunities
- Build in feedback mechanisms to continuously refine your approach
- Consider both quantitative metrics and qualitative impacts

The quantum advantage in this scenario comes from systematic exploration of possibility spaces rather than linear problem-solving.
`
}

Would you like me to elaborate on any specific aspect of this approach?`
    }

    // Adjust tone based on settings
    if (settings.tone === "friendly") {
      response = response
        .replace("Thank you for your question", "Great question!")
        .replace("I recommend", "I think you'll find it helpful to")
        .replace("Would you like me to elaborate", "I'd be happy to dive deeper")
    } else if (settings.tone === "technical") {
      response = response
        .replace("Thank you for your question", "Regarding your technical inquiry")
        .replace("I recommend", "Technical analysis indicates optimal results from")
        .replace("Would you like me to elaborate", "Further technical specifications can be provided")
    } else if (settings.tone === "creative") {
      response = response
        .replace("Thank you for your question", "What an intriguing exploration!")
        .replace("I recommend", "Imagine the possibilities if you were to")
        .replace("Would you like me to elaborate", "Shall we venture deeper into this creative landscape")
    }

    return {
      id: `msg-${Date.now()}`,
      role: "agent",
      content: response,
      timestamp: Date.now(),
      agentId: agent.id,
      thinking,
    }
  }

  // Handle copying message content
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedMessageId(content.substring(0, 10))
    setTimeout(() => setCopiedMessageId(null), 2000)
  }

  // Handle key press in input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Handle changing the agent
  const handleChangeAgent = (agent: AIAgentProfile) => {
    setSelectedAgent(agent)
    setActiveConversation(null)
    setActiveTab("chat")
  }

  // Handle clearing the conversation
  const handleClearConversation = () => {
    if (!activeConversation) return

    // Create a new conversation with just the initial messages
    const newConversation: AIAgentConversation = {
      ...activeConversation,
      id: `conv-${Date.now()}`,
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: "system",
          content: `I'm ${selectedAgent.name}, your quantum-powered AI assistant. I specialize in ${selectedAgent.specialties.join(
            ", ",
          )}. How can I help you today?`,
          timestamp: Date.now(),
        },
        {
          id: `msg-${Date.now() + 1}`,
          role: "agent",
          content: `Hello! I'm ${selectedAgent.name}, your quantum-powered AI assistant. I'm here to help with ${selectedAgent.specialties
            .slice(0, 3)
            .join(", ")}, and more. How can I assist you today?`,
          timestamp: Date.now() + 1,
          agentId: selectedAgent.id,
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      context: activeConversation.context,
    }

    setActiveConversation(newConversation)
    setConversations([...conversations, newConversation])
  }

  // If minimized, show only the icon
  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full h-12 w-12 bg-primary shadow-lg flex items-center justify-center"
        >
          <Brain className="h-6 w-6" />
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed ${
        isExpanded ? "inset-4" : "bottom-4 right-4 w-[450px] h-[600px]"
      } z-50 transition-all duration-300`}
    >
      <Card className="h-full shadow-lg border-0 flex flex-col bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
        <CardHeader className="px-4 py-2 flex flex-row items-center justify-between space-y-0 border-b">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={selectedAgent.avatar || "/placeholder.svg"} alt={selectedAgent.name} />
              <AvatarFallback>
                {selectedAgent.type === "developer" ? (
                  <Code className="h-4 w-4" />
                ) : selectedAgent.type === "designer" ? (
                  <PenTool className="h-4 w-4" />
                ) : selectedAgent.type === "marketer" ? (
                  <Target className="h-4 w-4" />
                ) : selectedAgent.type === "analyst" ? (
                  <BarChart2 className="h-4 w-4" />
                ) : selectedAgent.type === "researcher" ? (
                  <Search className="h-4 w-4" />
                ) : selectedAgent.type === "writer" ? (
                  <FileText className="h-4 w-4" />
                ) : selectedAgent.type === "strategist" ? (
                  <Briefcase className="h-4 w-4" />
                ) : selectedAgent.type === "innovator" ? (
                  <Lightbulb className="h-4 w-4" />
                ) : selectedAgent.type === "consultant" ? (
                  <Users className="h-4 w-4" />
                ) : (
                  <Brain className="h-4 w-4" />
                )}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-md font-medium">{selectedAgent.name}</CardTitle>
              <CardDescription className="text-xs">Quantum-Powered AI Agent</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {isExpanded ? (
              <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)} className="h-8 w-8">
                <Minimize2 className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsExpanded(true)} className="h-8 w-8">
                <Maximize2 className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="px-4 py-2 justify-start border-b rounded-none bg-transparent">
            <TabsTrigger value="chat" className="data-[state=active]:bg-primary/10 rounded-md">
              <MessageSquare className="h-4 w-4 mr-1" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="agents" className="data-[state=active]:bg-primary/10 rounded-md">
              <Users className="h-4 w-4 mr-1" />
              Agents
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary/10 rounded-md">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
            <ScrollArea className="flex-1 p-4">
              {activeConversation?.messages
                .filter((msg) => msg.role !== "system")
                .map((message) => (
                  <AgentMessage key={message.id} message={message} onCopy={handleCopyMessage} />
                ))}

              {isThinking && <ThinkingIndicator agentName={selectedAgent.name} />}

              <div ref={messagesEndRef} />
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex items-end gap-2">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask ${selectedAgent.name} anything...`}
                  className="min-h-[80px] resize-none"
                />
                <Button onClick={handleSendMessage} disabled={!input.trim() || isThinking}>
                  {isThinking ? (
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 rounded-full bg-primary-foreground animate-bounce" />
                      <div className="h-2 w-2 rounded-full bg-primary-foreground animate-bounce [animation-delay:0.2s]" />
                      <div className="h-2 w-2 rounded-full bg-primary-foreground animate-bounce [animation-delay:0.4s]" />
                    </div>
                  ) : (
                    <MessageSquare className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex justify-between mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearConversation}
                  className="text-xs h-7 px-2 text-muted-foreground"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Clear chat
                </Button>
                <div className="text-xs text-muted-foreground">
                  {copiedMessageId ? (
                    <span className="flex items-center">
                      <Check className="h-3.5 w-3.5 mr-1 text-green-500" />
                      Copied to clipboard
                    </span>
                  ) : (
                    <span>Quantum-powered responses</span>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="agents" className="flex-1 p-0 m-0 overflow-auto">
            <ScrollArea className="h-full">
              <AgentSelection agents={agentProfiles} selectedAgent={selectedAgent} onSelectAgent={handleChangeAgent} />
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 p-0 m-0 overflow-auto">
            <ScrollArea className="h-full">
              <AgentSettings settings={settings} onSettingsChange={setSettings} />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  )
}
