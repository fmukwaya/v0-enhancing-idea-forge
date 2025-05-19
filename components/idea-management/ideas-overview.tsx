"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Lightbulb,
  Search,
  Filter,
  ArrowUpDown,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  MessageSquare,
  ThumbsUp,
  Zap,
  Sparkles,
  Brain,
  RefreshCw,
  Layers,
  Briefcase,
  Tag,
  Calendar,
  Eye,
  Target,
  Shield,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRealTimeUpdates, type RealTimeUpdate } from "@/lib/real-time-service"
import { useUser } from "@/hooks/use-user" // Import the useUser hook

// Types for ideas
interface IdeaTag {
  id: string
  name: string
  color?: string
}

interface IdeaCollaborator {
  id: string
  name: string
  avatar?: string
  role?: string
}

interface IdeaVote {
  id: string
  type: "up" | "down"
  userId: string
  userName: string
  timestamp: number
}

interface IdeaComment {
  id: string
  text: string
  userId: string
  userName: string
  userAvatar?: string
  timestamp: number
  replies?: IdeaComment[]
}

interface IdeaDocument {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedBy: string
  uploadedAt: number
}

interface IdeaActivity {
  id: string
  type: "create" | "update" | "comment" | "vote" | "approval" | "rejection" | "document" | "convert"
  userId: string
  userName: string
  userAvatar?: string
  timestamp: number
  details?: string
}

interface IdeaApproval {
  id: string
  status: "pending" | "approved" | "rejected" | "reviewing"
  approverId: string
  approverName: string
  approverAvatar?: string
  timestamp: number
  feedback?: string
}

interface Idea {
  id: string
  title: string
  description: string
  category: string
  subcategory?: string
  status: "draft" | "pending" | "approved" | "rejected" | "in-review" | "in-progress" | "completed"
  createdBy: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: number
  updatedAt: number
  tags: IdeaTag[]
  feasibilityScore: number
  impactScore: number
  timeframe: string
  isConfidential: boolean
  collaborators: IdeaCollaborator[]
  votes: IdeaVote[]
  comments: IdeaComment[]
  documents: IdeaDocument[]
  activities: IdeaActivity[]
  approvals: IdeaApproval[]
  isStarred?: boolean
  isNew?: boolean
}

// Mock data for ideas
const mockIdeas: Idea[] = [
  {
    id: "idea-1",
    title: "Quantum Interface Redesign",
    description:
      "Redesign our interface using quantum principles to create a more intuitive and responsive user experience. This will involve implementing non-linear navigation patterns and entangled state management.",
    category: "Product",
    subcategory: "User Experience",
    status: "approved",
    createdBy: {
      id: "user-1",
      name: "Alex Johnson",
      avatar: "/person-with-glasses.png",
    },
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    tags: [
      { id: "tag-1", name: "UX", color: "blue" },
      { id: "tag-2", name: "Quantum", color: "purple" },
      { id: "tag-3", name: "Design", color: "green" },
    ],
    feasibilityScore: 85,
    impactScore: 90,
    timeframe: "medium",
    isConfidential: false,
    collaborators: [
      { id: "user-2", name: "Sarah Wilson", avatar: "/short-haired-person.png", role: "Product Designer" },
      { id: "user-3", name: "James Smith", avatar: "/person-dark-hair.png", role: "Developer" },
    ],
    votes: [
      {
        id: "vote-1",
        type: "up",
        userId: "user-2",
        userName: "Sarah Wilson",
        timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
      },
      {
        id: "vote-2",
        type: "up",
        userId: "user-3",
        userName: "James Smith",
        timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
      },
      {
        id: "vote-3",
        type: "up",
        userId: "user-4",
        userName: "Maria Garcia",
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
      },
    ],
    comments: [
      {
        id: "comment-1",
        text: "I love this idea! The quantum approach could really set our product apart.",
        userId: "user-2",
        userName: "Sarah Wilson",
        userAvatar: "/short-haired-person.png",
        timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000,
        replies: [
          {
            id: "comment-2",
            text: "Agreed! I think we should prioritize this for Q3.",
            userId: "user-3",
            userName: "James Smith",
            userAvatar: "/person-dark-hair.png",
            timestamp: Date.now() - 5.5 * 24 * 60 * 60 * 1000,
          },
        ],
      },
    ],
    documents: [
      {
        id: "doc-1",
        name: "Quantum UI Principles.pdf",
        type: "pdf",
        size: 2500000,
        url: "#",
        uploadedBy: "Alex Johnson",
        uploadedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
      },
      {
        id: "doc-2",
        name: "Interface Mockups.fig",
        type: "figma",
        size: 15000000,
        url: "#",
        uploadedBy: "Sarah Wilson",
        uploadedAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
      },
    ],
    activities: [
      {
        id: "activity-1",
        type: "create",
        userId: "user-1",
        userName: "Alex Johnson",
        userAvatar: "/person-with-glasses.png",
        timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
        details: "Created the idea",
      },
      {
        id: "activity-2",
        type: "comment",
        userId: "user-2",
        userName: "Sarah Wilson",
        userAvatar: "/short-haired-person.png",
        timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000,
        details: "Added a comment",
      },
      {
        id: "activity-3",
        type: "document",
        userId: "user-2",
        userName: "Sarah Wilson",
        userAvatar: "/short-haired-person.png",
        timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
        details: "Uploaded Interface Mockups.fig",
      },
      {
        id: "activity-4",
        type: "approval",
        userId: "user-4",
        userName: "David Brown",
        userAvatar: "/person-with-glasses.png",
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
        details: "Approved the idea",
      },
    ],
    approvals: [
      {
        id: "approval-1",
        status: "approved",
        approverId: "user-4",
        approverName: "David Brown",
        approverAvatar: "/person-with-glasses.png",
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
        feedback: "Great idea with solid implementation plan. Approved for development.",
      },
    ],
    isStarred: true,
  },
  {
    id: "idea-2",
    title: "AI-Powered Customer Insights",
    description:
      "Implement an AI system that analyzes customer interactions across all touchpoints to provide deeper insights and predict future needs. This will help us proactively address customer requirements.",
    category: "Technology",
    subcategory: "Artificial Intelligence",
    status: "in-review",
    createdBy: {
      id: "user-3",
      name: "James Smith",
      avatar: "/person-dark-hair.png",
    },
    createdAt: Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    tags: [
      { id: "tag-4", name: "AI", color: "red" },
      { id: "tag-5", name: "Customer Experience", color: "orange" },
      { id: "tag-6", name: "Analytics", color: "blue" },
    ],
    feasibilityScore: 75,
    impactScore: 95,
    timeframe: "long",
    isConfidential: true,
    collaborators: [
      { id: "user-5", name: "Maria Garcia", avatar: "/curly-haired-person.png", role: "Data Scientist" },
      { id: "user-4", name: "David Brown", avatar: "/person-with-glasses.png", role: "Product Manager" },
    ],
    votes: [
      {
        id: "vote-4",
        type: "up",
        userId: "user-1",
        userName: "Alex Johnson",
        timestamp: Date.now() - 13 * 24 * 60 * 60 * 1000,
      },
      {
        id: "vote-5",
        type: "up",
        userId: "user-4",
        userName: "David Brown",
        timestamp: Date.now() - 12 * 24 * 60 * 60 * 1000,
      },
      {
        id: "vote-6",
        type: "down",
        userId: "user-6",
        userName: "Robert Lee",
        timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000,
      },
    ],
    comments: [
      {
        id: "comment-3",
        text: "This could revolutionize how we understand customer needs. I'm excited to see the implementation.",
        userId: "user-4",
        userName: "David Brown",
        userAvatar: "/person-with-glasses.png",
        timestamp: Date.now() - 13 * 24 * 60 * 60 * 1000,
      },
      {
        id: "comment-4",
        text: "I have concerns about the data privacy implications. We should ensure we're compliant with regulations.",
        userId: "user-6",
        userName: "Robert Lee",
        userAvatar: "/person-with-beard.png",
        timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000,
      },
    ],
    documents: [
      {
        id: "doc-3",
        name: "AI Implementation Plan.docx",
        type: "docx",
        size: 1800000,
        url: "#",
        uploadedBy: "James Smith",
        uploadedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
      },
    ],
    activities: [
      {
        id: "activity-5",
        type: "create",
        userId: "user-3",
        userName: "James Smith",
        userAvatar: "/person-dark-hair.png",
        timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
        details: "Created the idea",
      },
      {
        id: "activity-6",
        type: "vote",
        userId: "user-1",
        userName: "Alex Johnson",
        userAvatar: "/person-with-glasses.png",
        timestamp: Date.now() - 13 * 24 * 60 * 60 * 1000,
        details: "Upvoted the idea",
      },
      {
        id: "activity-7",
        type: "update",
        userId: "user-3",
        userName: "James Smith",
        userAvatar: "/person-dark-hair.png",
        timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
        details: "Updated the implementation details",
      },
    ],
    approvals: [
      {
        id: "approval-2",
        status: "reviewing",
        approverId: "user-7",
        approverName: "Jennifer Lopez",
        approverAvatar: "/short-haired-person.png",
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
      },
    ],
  },
  {
    id: "idea-3",
    title: "Biometric Authentication System",
    description:
      "Develop a multi-factor biometric authentication system that combines facial recognition, fingerprint scanning, and behavioral patterns for enhanced security across all our platforms.",
    category: "Security",
    subcategory: "Authentication",
    status: "pending",
    createdBy: {
      id: "user-5",
      name: "Maria Garcia",
      avatar: "/curly-haired-person.png",
    },
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    tags: [
      { id: "tag-7", name: "Security", color: "red" },
      { id: "tag-8", name: "Biometrics", color: "purple" },
      { id: "tag-9", name: "Authentication", color: "gray" },
    ],
    feasibilityScore: 70,
    impactScore: 85,
    timeframe: "medium",
    isConfidential: true,
    collaborators: [
      { id: "user-3", name: "James Smith", avatar: "/person-dark-hair.png", role: "Developer" },
      { id: "user-6", name: "Robert Lee", avatar: "/person-with-beard.png", role: "Security Specialist" },
    ],
    votes: [
      {
        id: "vote-7",
        type: "up",
        userId: "user-3",
        userName: "James Smith",
        timestamp: Date.now() - 1.5 * 24 * 60 * 60 * 1000,
      },
      {
        id: "vote-8",
        type: "up",
        userId: "user-6",
        userName: "Robert Lee",
        timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
      },
    ],
    comments: [
      {
        id: "comment-5",
        text: "This is a critical security enhancement. I'd like to be involved in the implementation.",
        userId: "user-6",
        userName: "Robert Lee",
        userAvatar: "/person-with-beard.png",
        timestamp: Date.now() - 1.5 * 24 * 60 * 60 * 1000,
      },
    ],
    documents: [
      {
        id: "doc-4",
        name: "Biometric Security Proposal.pdf",
        type: "pdf",
        size: 3500000,
        url: "#",
        uploadedBy: "Maria Garcia",
        uploadedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      },
    ],
    activities: [
      {
        id: "activity-8",
        type: "create",
        userId: "user-5",
        userName: "Maria Garcia",
        userAvatar: "/curly-haired-person.png",
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
        details: "Created the idea",
      },
      {
        id: "activity-9",
        type: "comment",
        userId: "user-6",
        userName: "Robert Lee",
        userAvatar: "/person-with-beard.png",
        timestamp: Date.now() - 1.5 * 24 * 60 * 60 * 1000,
        details: "Added a comment",
      },
    ],
    approvals: [
      {
        id: "approval-3",
        status: "pending",
        approverId: "user-4",
        approverName: "David Brown",
        approverAvatar: "/person-with-glasses.png",
        timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
      },
    ],
    isNew: true,
  },
  {
    id: "idea-4",
    title: "Quantum-Inspired Optimization Algorithm",
    description:
      "Develop a quantum-inspired algorithm for optimizing resource allocation and scheduling across our infrastructure, potentially reducing operational costs by 30% while improving performance.",
    category: "Technology",
    subcategory: "Quantum Computing",
    status: "draft",
    createdBy: {
      id: "user-1",
      name: "Alex Johnson",
      avatar: "/person-with-glasses.png",
    },
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    updatedAt: Date.now() - 0.5 * 24 * 60 * 60 * 1000, // 12 hours ago
    tags: [
      { id: "tag-10", name: "Quantum", color: "purple" },
      { id: "tag-11", name: "Optimization", color: "green" },
      { id: "tag-12", name: "Infrastructure", color: "blue" },
    ],
    feasibilityScore: 60,
    impactScore: 95,
    timeframe: "long",
    isConfidential: false,
    collaborators: [{ id: "user-5", name: "Maria Garcia", avatar: "/curly-haired-person.png", role: "Data Scientist" }],
    votes: [],
    comments: [],
    documents: [
      {
        id: "doc-5",
        name: "Quantum Algorithm Research.pdf",
        type: "pdf",
        size: 5200000,
        url: "#",
        uploadedBy: "Alex Johnson",
        uploadedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
      },
    ],
    activities: [
      {
        id: "activity-10",
        type: "create",
        userId: "user-1",
        userName: "Alex Johnson",
        userAvatar: "/person-with-glasses.png",
        timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
        details: "Created the idea",
      },
      {
        id: "activity-11",
        type: "update",
        userId: "user-1",
        userName: "Alex Johnson",
        userAvatar: "/person-with-glasses.png",
        timestamp: Date.now() - 0.5 * 24 * 60 * 60 * 1000,
        details: "Updated the description and impact assessment",
      },
    ],
    approvals: [],
    isNew: true,
  },
]

// Helper function to format date
function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

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

// Helper function to get status badge
function getStatusBadge(status: Idea["status"]) {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900">
          <CheckCircle className="h-3.5 w-3.5 mr-1" />
          Approved
        </Badge>
      )
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900">
          <XCircle className="h-3.5 w-3.5 mr-1" />
          Rejected
        </Badge>
      )
    case "in-review":
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900">
          <Clock className="h-3.5 w-3.5 mr-1" />
          In Review
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900">
          <AlertTriangle className="h-3.5 w-3.5 mr-1" />
          Pending Approval
        </Badge>
      )
    case "in-progress":
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900">
          <RefreshCw className="h-3.5 w-3.5 mr-1" />
          In Progress
        </Badge>
      )
    case "completed":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900">
          <CheckCircle className="h-3.5 w-3.5 mr-1" />
          Completed
        </Badge>
      )
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
          <FileText className="h-3.5 w-3.5 mr-1" />
          Draft
        </Badge>
      )
  }
}

// Helper function to get category badge
function getCategoryBadge(category: string, subcategory?: string) {
  let color = ""
  let icon = null

  switch (category.toLowerCase()) {
    case "product":
      color = "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900"
      icon = <Layers className="h-3.5 w-3.5 mr-1" />
      break
    case "technology":
      color =
        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900"
      icon = <Zap className="h-3.5 w-3.5 mr-1" />
      break
    case "process":
      color =
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900"
      icon = <RefreshCw className="h-3.5 w-3.5 mr-1" />
      break
    case "marketing":
      color =
        "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-900"
      icon = <Target className="h-3.5 w-3.5 mr-1" />
      break
    case "security":
      color = "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900"
      icon = <Shield className="h-3.5 w-3.5 mr-1" />
      break
    default:
      color = "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
      icon = <Tag className="h-3.5 w-3.5 mr-1" />
  }

  return (
    <Badge variant="outline" className={color}>
      {icon}
      {subcategory ? `${category}: ${subcategory}` : category}
    </Badge>
  )
}

// IdeaCard component
interface IdeaCardProps {
  idea: Idea
  onStar: (id: string) => void
  onConvertToProject: (id: string) => void
  onViewDetails: (id: string) => void
}

const IdeaCard = ({ idea, onStar, onConvertToProject, onViewDetails }: IdeaCardProps) => {
  const router = useRouter()
  const { hasPermission } = useUser()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {idea.isNew && (
        <div className="absolute -top-2 -right-2 z-10">
          <Badge className="bg-quantum-600 text-white">New</Badge>
        </div>
      )}
      <Card className="h-full overflow-hidden hover:border-quantum-400 dark:hover:border-quantum-600 transition-colors">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                {getStatusBadge(idea.status)}
                {idea.isConfidential && (
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900"
                  >
                    Confidential
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg font-medium line-clamp-1">{idea.title}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-quantum-600 dark:hover:text-quantum-400"
              onClick={() => onStar(idea.id)}
            >
              {idea.isStarred ? (
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
              ) : (
                <Star className="h-5 w-5" />
              )}
              <span className="sr-only">Star idea</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-2">{idea.description}</p>

            <div className="flex flex-wrap gap-2">
              {getCategoryBadge(idea.category, idea.subcategory)}
              {idea.tags.slice(0, 2).map((tag) => (
                <Badge key={tag.id} variant="outline" className="bg-quantum-50 dark:bg-quantum-900">
                  {tag.name}
                </Badge>
              ))}
              {idea.tags.length > 2 && (
                <Badge variant="outline" className="bg-quantum-50 dark:bg-quantum-900">
                  +{idea.tags.length - 2} more
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={idea.createdBy.avatar || "/placeholder.svg"} alt={idea.createdBy.name} />
                  <AvatarFallback>{idea.createdBy.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{idea.createdBy.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">{formatRelativeTime(idea.createdAt)}</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Impact</span>
                <span className="font-medium">{idea.impactScore}%</span>
              </div>
              <Progress value={idea.impactScore} className="h-1" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                  <span>{idea.votes.filter((v) => v.type === "up").length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span>{idea.comments.length}</span>
                </div>
                {idea.collaborators.length > 0 && (
                  <div className="flex -space-x-2">
                    {idea.collaborators.slice(0, 3).map((collaborator) => (
                      <Avatar key={collaborator.id} className="h-6 w-6 border-2 border-background">
                        <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                        <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ))}
                    {idea.collaborators.length > 3 && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                        +{idea.collaborators.length - 3}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-quantum-200 dark:border-quantum-700 hover:bg-quantum-100 dark:hover:bg-quantum-800"
            onClick={() => onViewDetails(idea.id)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          {hasPermission("convert") && (
            <Button
              size="sm"
              className="flex-1 bg-quantum-600 hover:bg-quantum-700"
              onClick={() => onConvertToProject(idea.id)}
            >
              <Briefcase className="h-4 w-4 mr-2" />
              Convert
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

// Simple notification component for real-time updates
const SimpleNotification = ({ update, onClose }: { update: RealTimeUpdate; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-md z-50"
    >
      <div className="flex items-center justify-between">
        <div className="font-medium">
          {update.type.charAt(0).toUpperCase() + update.type.slice(1)} {update.action}
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onClose}>
          <XCircle className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-sm text-muted-foreground mt-1">
        {update.type === "idea" && update.data.title
          ? `Idea "${update.data.title}" was ${update.action}ed`
          : update.type === "comment"
            ? `New comment from ${update.data.author}`
            : update.type === "approval"
              ? `Idea was ${update.action}ed by ${update.data.approver}`
              : `Update received: ${update.type} ${update.action}`}
      </div>
    </motion.div>
  )
}

// Main component
export function IdeasOverview() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [ideas, setIdeas] = useState<Idea[]>(mockIdeas)
  const [notification, setNotification] = useState<RealTimeUpdate | null>(null)
  const { isConnected, lastUpdate, addComment, addVote } = useRealTimeUpdates()
  const { hasPermission, user } = useUser()
  const router = useRouter()

  // Handle real-time updates
  useEffect(() => {
    if (lastUpdate) {
      setNotification(lastUpdate)

      // Auto-dismiss notification after 5 seconds
      const timer = setTimeout(() => {
        setNotification(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [lastUpdate])

  // Filter and sort ideas
  const filteredIdeas = ideas.filter((idea) => {
    // Search term filter
    if (
      searchTerm &&
      !idea.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !idea.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false
    }

    // Tab filter
    if (activeTab === "starred" && !idea.isStarred) {
      return false
    }

    if (activeTab === "draft" && idea.status !== "draft") {
      return false
    }

    if (activeTab === "pending" && idea.status !== "pending" && idea.status !== "in-review") {
      return false
    }

    if (activeTab === "approved" && idea.status !== "approved") {
      return false
    }

    // Category filter
    if (filterCategory !== "all" && idea.category.toLowerCase() !== filterCategory.toLowerCase()) {
      return false
    }

    // Status filter
    if (filterStatus !== "all" && idea.status !== filterStatus) {
      return false
    }

    return true
  })

  // Sort ideas
  const sortedIdeas = [...filteredIdeas].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return b.createdAt - a.createdAt
      case "oldest":
        return a.createdAt - b.createdAt
      case "impact":
        return b.impactScore - a.impactScore
      case "feasibility":
        return b.feasibilityScore - a.feasibilityScore
      case "votes":
        return b.votes.filter((v) => v.type === "up").length - a.votes.filter((v) => v.type === "up").length
      case "comments":
        return b.comments.length - a.comments.length
      default:
        return 0
    }
  })

  // Handle starring an idea
  const handleStar = (id: string) => {
    setIdeas(ideas.map((idea) => (idea.id === id ? { ...idea, isStarred: !idea.isStarred } : idea)))
  }

  // Handle converting an idea to a project
  const handleConvertToProject = (id: string) => {
    console.log(`Converting idea ${id} to project`)
    // In a real app, this would open a modal or navigate to a conversion page
  }

  // Handle viewing idea details
  const handleViewDetails = (id: string) => {
    router.push(`/ideas/${id}`)
  }

  // Handle adding a comment
  const handleAddComment = (ideaId: string, text: string) => {
    if (!user) {
      console.warn("User not authenticated. Cannot add comment.")
      return
    }

    if (!text.trim()) return

    const newComment = {
      id: `comment-${Date.now()}`,
      text: text,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      timestamp: Date.now(),
      replies: [],
    }

    setIdeas((prev) =>
      prev.map((idea) => (idea.id === ideaId ? { ...idea, comments: [...idea.comments, newComment] } : idea)),
    )

    addComment(ideaId, newComment)
  }

  // Handle voting on an idea
  const handleVote = (ideaId: string, voteType: "up" | "down") => {
    if (!user) {
      console.warn("User not authenticated. Cannot vote.")
      return
    }

    const existingVote = ideas.find((idea) => idea.id === ideaId)?.votes.find((vote) => vote.userId === user.id)

    if (existingVote) {
      console.warn("User has already voted on this idea.")
      return
    }

    const newVote = {
      id: `vote-${Date.now()}`,
      type: voteType,
      userId: user.id,
      userName: user.name,
      timestamp: Date.now(),
    }

    setIdeas((prev) => prev.map((idea) => (idea.id === ideaId ? { ...idea, votes: [...idea.votes, newVote] } : idea)))

    addVote(ideaId, newVote)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-quantum tracking-tight flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-quantum-600" />
            Ideas Hub
          </h1>
          <p className="text-muted-foreground">Explore, collaborate, and transform innovative ideas into reality</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              // In a real app, this would open a filter modal or panel
              console.log("Opening advanced filters")
            }}
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ideas..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="process">Process</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="security">Security</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <span>Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSortBy("newest")}>
                <Calendar className="h-4 w-4 mr-2" />
                Newest first
                {sortBy === "newest" && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-quantum-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                <Calendar className="h-4 w-4 mr-2" />
                Oldest first
                {sortBy === "oldest" && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-quantum-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("impact")}>
                <Target className="h-4 w-4 mr-2" />
                Impact score
                {sortBy === "impact" && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-quantum-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("feasibility")}>
                <Shield className="h-4 w-4 mr-2" />
                Feasibility score
                {sortBy === "feasibility" && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-quantum-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("votes")}>
                <ThumbsUp className="h-4 w-4 mr-2" />
                Most votes
                {sortBy === "votes" && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-quantum-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("comments")}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Most comments
                {sortBy === "comments" && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-quantum-600" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-quantum-100/50 dark:bg-quantum-800/50">
          <TabsTrigger value="all" className="flex-1 flex items-center gap-1">
            <Lightbulb className="h-4 w-4" />
            <span>All Ideas</span>
            <Badge variant="outline" className="ml-1 bg-quantum-50 dark:bg-quantum-900">
              {ideas.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="starred" className="flex-1 flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>Starred</span>
            <Badge variant="outline" className="ml-1 bg-quantum-50 dark:bg-quantum-900">
              {ideas.filter((idea) => idea.isStarred).length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="draft" className="flex-1 flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Drafts</span>
            <Badge variant="outline" className="ml-1 bg-quantum-50 dark:bg-quantum-900">
              {ideas.filter((idea) => idea.status === "draft").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex-1 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Pending</span>
            <Badge variant="outline" className="ml-1 bg-quantum-50 dark:bg-quantum-900">
              {ideas.filter((idea) => idea.status === "pending" || idea.status === "in-review").length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex-1 flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            <span>Approved</span>
            <Badge variant="outline" className="ml-1 bg-quantum-50 dark:bg-quantum-900">
              {ideas.filter((idea) => idea.status === "approved").length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {sortedIdeas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  onStar={handleStar}
                  onConvertToProject={handleConvertToProject}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg">
              <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No ideas found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchTerm ? "Try a different search term or clear filters" : "No ideas match your current filters"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between p-4 border rounded-lg bg-quantum-50 dark:bg-quantum-900">
        <div className="flex items-center gap-3">
          <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-red-500"}`} />
          <span className="text-sm">{isConnected ? "Real-time updates active" : "Real-time updates disconnected"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-quantum-200 dark:border-quantum-700 hover:bg-quantum-100 dark:hover:bg-quantum-800"
            onClick={() => {
              // In a real app, this would trigger a refresh of the data
              console.log("Refreshing ideas")
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-quantum-200 dark:border-quantum-700 hover:bg-quantum-100 dark:hover:bg-quantum-800"
          >
            <Brain className="h-4 w-4 mr-2" />
            AI Recommendations
          </Button>
        </div>
      </div>

      {/* Use a simple notification component instead of the problematic one */}
      <AnimatePresence>
        {notification && <SimpleNotification update={notification} onClose={() => setNotification(null)} />}
      </AnimatePresence>
    </div>
  )
}
