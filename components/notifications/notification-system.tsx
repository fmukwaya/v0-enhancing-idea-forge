"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell,
  X,
  Check,
  Info,
  AlertTriangle,
  MessageSquare,
  FileText,
  Calendar,
  Settings,
  Filter,
  CheckCircle,
  Clock,
  RefreshCw,
  Zap,
  Lightbulb,
  Users,
  Briefcase,
  BarChart2,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState, useRef, useEffect } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useRealTimeUpdates } from "@/hooks/use-real-time-updates"
import type { RealTimeUpdate } from "@/types/real-time-update"

// Types
export type NotificationType =
  | "idea_created"
  | "idea_updated"
  | "idea_approved"
  | "idea_rejected"
  | "comment_added"
  | "mention"
  | "project_milestone"
  | "task_assigned"
  | "task_completed"
  | "deadline_approaching"
  | "system_update"
  | "ai_insight"
  | "collaboration_request"
  | "cost_alert"
  | "customer_update"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: number
  isRead: boolean
  priority: "low" | "medium" | "high" | "urgent"
  source: {
    id: string
    type: "idea" | "project" | "user" | "system" | "ai" | "customer"
    name: string
    avatar?: string
  }
  actions?: Array<{
    label: string
    action: string
    icon?: React.ReactNode
  }>
  metadata?: Record<string, any>
}

interface NotificationSystemProps {
  initialExpanded?: boolean
  position?: "top-right" | "bottom-right" | "bottom-left" | "top-left"
  maxNotifications?: number
}

// Helper function to format relative time
function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 7) {
    return new Date(timestamp).toLocaleDateString()
  } else if (days > 0) {
    return `${days}d ago`
  } else if (hours > 0) {
    return `${hours}h ago`
  } else if (minutes > 0) {
    return `${minutes}m ago`
  } else {
    return "Just now"
  }
}

// Helper function to get notification icon
function getNotificationIcon(type: NotificationType, priority: Notification["priority"]) {
  const priorityColor =
    priority === "urgent"
      ? "text-red-500"
      : priority === "high"
        ? "text-amber-500"
        : priority === "medium"
          ? "text-blue-500"
          : "text-gray-500"

  switch (type) {
    case "idea_created":
    case "idea_updated":
      return <Lightbulb className={`h-5 w-5 ${priorityColor}`} />
    case "idea_approved":
      return <CheckCircle className={`h-5 w-5 ${priorityColor}`} />
    case "idea_rejected":
      return <X className={`h-5 w-5 ${priorityColor}`} />
    case "comment_added":
    case "mention":
      return <MessageSquare className={`h-5 w-5 ${priorityColor}`} />
    case "project_milestone":
      return <Bell className={`h-5 w-5 ${priorityColor}`} /> // Placeholder for Flag icon
    case "task_assigned":
    case "task_completed":
      return <CheckCircle className={`h-5 w-5 ${priorityColor}`} />
    case "deadline_approaching":
      return <Clock className={`h-5 w-5 ${priorityColor}`} />
    case "system_update":
      return <RefreshCw className={`h-5 w-5 ${priorityColor}`} />
    case "ai_insight":
      return <Zap className={`h-5 w-5 ${priorityColor}`} />
    case "collaboration_request":
      return <Users className={`h-5 w-5 ${priorityColor}`} />
    case "cost_alert":
      return <AlertTriangle className={`h-5 w-5 ${priorityColor}`} />
    case "customer_update":
      return <Briefcase className={`h-5 w-5 ${priorityColor}`} />
    default:
      return <Info className={`h-5 w-5 ${priorityColor}`} />
  }
}

// Mock data for initial notifications
const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    type: "idea_approved",
    title: "Idea Approved",
    message: "Your idea 'Quantum Interface Redesign' has been approved by the review committee.",
    timestamp: Date.now() - 30 * 60 * 1000, // 30 minutes ago
    isRead: false,
    priority: "high",
    source: {
      id: "user-4",
      type: "user",
      name: "David Brown",
      avatar: "/person-with-glasses.png",
    },
    actions: [
      {
        label: "View Idea",
        action: "view_idea",
        icon: <Eye />,
      },
      {
        label: "Convert to Project",
        action: "convert_to_project",
        icon: <Briefcase />,
      },
    ],
    metadata: {
      ideaId: "idea-1",
      approvalId: "approval-1",
    },
  },
  {
    id: "notif-2",
    type: "comment_added",
    title: "New Comment",
    message: "Sarah Wilson commented on your idea 'AI-Powered Customer Insights'.",
    timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    isRead: true,
    priority: "medium",
    source: {
      id: "user-2",
      type: "user",
      name: "Sarah Wilson",
      avatar: "/short-haired-person.png",
    },
    actions: [
      {
        label: "View Comment",
        action: "view_comment",
        icon: <MessageSquare />,
      },
      {
        label: "Reply",
        action: "reply",
        icon: <MessageSquare />,
      },
    ],
    metadata: {
      ideaId: "idea-2",
      commentId: "comment-3",
    },
  },
  {
    id: "notif-3",
    type: "deadline_approaching",
    title: "Deadline Approaching",
    message: "The 'Design Phase' milestone for 'Quantum Interface Redesign' is due in 2 days.",
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000, // 1 day ago
    isRead: false,
    priority: "urgent",
    source: {
      id: "project-1",
      type: "project",
      name: "Quantum Interface Redesign",
    },
    actions: [
      {
        label: "View Project",
        action: "view_project",
        icon: <Briefcase />,
      },
      {
        label: "Update Timeline",
        action: "update_timeline",
        icon: <Calendar />,
      },
    ],
    metadata: {
      projectId: "project-1",
      milestoneId: "milestone-2",
    },
  },
  {
    id: "notif-4",
    type: "ai_insight",
    title: "AI Insight Available",
    message: "Quantum AI has generated new insights for your 'Biometric Authentication System' idea.",
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    isRead: true,
    priority: "medium",
    source: {
      id: "ai-1",
      type: "ai",
      name: "Quantum AI",
      avatar: "/quantum-ai-assistant.png",
    },
    actions: [
      {
        label: "View Insights",
        action: "view_insights",
        icon: <Zap />,
      },
    ],
    metadata: {
      ideaId: "idea-3",
      insightId: "insight-1",
    },
  },
  {
    id: "notif-5",
    type: "cost_alert",
    title: "Budget Alert",
    message: "The 'Development Phase' of 'AI-Powered Customer Insights' is approaching its budget limit.",
    timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
    isRead: true,
    priority: "high",
    source: {
      id: "system-1",
      type: "system",
      name: "Cost Calculator",
    },
    actions: [
      {
        label: "View Budget",
        action: "view_budget",
        icon: <BarChart2 />,
      },
      {
        label: "Adjust Allocation",
        action: "adjust_allocation",
        icon: <Settings />,
      },
    ],
    metadata: {
      projectId: "project-2",
      phaseId: "phase-3",
    },
  },
]

// Notification Item Component
const NotificationItem = ({
  notification,
  onRead,
  onAction,
  onDelete,
}: {
  notification: Notification
  onRead: (id: string) => void
  onAction: (id: string, action: string) => void
  onDelete: (id: string) => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className={`p-4 border-b last:border-b-0 ${notification.isRead ? "bg-background" : "bg-muted/30"}`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            {notification.source.avatar ? (
              <Avatar>
                <AvatarImage src={notification.source.avatar || "/placeholder.svg"} alt={notification.source.name} />
                <AvatarFallback>{notification.source.name.charAt(0)}</AvatarFallback>
              </Avatar>
            ) : (
              getNotificationIcon(notification.type, notification.priority)
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-medium line-clamp-1">{notification.title}</h4>
            <div className="flex items-center gap-1">
              {notification.priority === "urgent" && (
                <Badge variant="destructive" className="text-[10px] h-5 px-1">
                  Urgent
                </Badge>
              )}
              {notification.priority === "high" && (
                <Badge variant="outline" className="bg-amber-100 text-amber-800 text-[10px] h-5 px-1">
                  High
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">{formatRelativeTime(notification.timestamp)}</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
          {notification.actions && notification.actions.length > 0 && (
            <div className="flex gap-2 mt-2">
              {notification.actions.map((action) => (
                <Button
                  key={action.action}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => onAction(notification.id, action.action)}
                >
                  {action.icon && <span className="h-3.5 w-3.5 mr-1">{action.icon}</span>}
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          {!notification.isRead && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onRead(notification.id)}>
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Mark as read</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(notification.id)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete notification</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.div>
  )
}

// Toast Notification Component
const ToastNotification = ({
  notification,
  onClose,
  onAction,
}: {
  notification: Notification
  onClose: () => void
  onAction: (id: string, action: string) => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="max-w-md w-full"
    >
      <Card className="border-quantum-200 dark:border-quantum-700 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-quantum-100 dark:bg-quantum-800">
              {getNotificationIcon(notification.type, notification.priority)}
            </div>
            <div className="flex-1">
              <h4 className="font-medium">{notification.title}</h4>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(notification.timestamp)}</p>
              {notification.actions && notification.actions.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {notification.actions.slice(0, 2).map((action) => (
                    <Button
                      key={action.action}
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => onAction(notification.id, action.action)}
                    >
                      {action.icon && <span className="h-3.5 w-3.5 mr-1">{action.icon}</span>}
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Main Notification System Component
export function NotificationSystem({
  initialExpanded = false,
  position = "bottom-right",
  maxNotifications = 5,
}: NotificationSystemProps) {
  // State
  const [isExpanded, setIsExpanded] = useState(initialExpanded)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [toastNotification, setToastNotification] = useState<Notification | null>(null)
  const [settings, setSettings] = useState({
    showToasts: true,
    soundEnabled: true,
    desktopNotifications: false,
    groupSimilar: true,
    filterPriority: "all" as "all" | "urgent" | "high" | "medium" | "low",
  })

  // Use local storage for notifications
  const [notifications, setNotifications] = useLocalStorage<Notification[]>(
    "ideaforge-notifications",
    mockNotifications,
  )
  const { lastUpdate } = useRealTimeUpdates()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio
  useEffect(() => {
    if (typeof Audio !== "undefined") {
      try {
        // Always use new operator with Audio constructor
        audioRef.current = new Audio("/notification-sound.mp3")
      } catch (error) {
        console.error("Error creating Audio instance:", error)
      }
    }
    return () => {
      if (audioRef.current) {
        audioRef.current = null
      }
    }
  }, [])

  // Handle real-time updates
  useEffect(() => {
    if (lastUpdate && (lastUpdate.type === "idea" || lastUpdate.type === "comment" || lastUpdate.type === "approval")) {
      const newNotification = convertUpdateToNotification(lastUpdate)

      // Add notification
      setNotifications((prev) => [newNotification, ...prev])

      // Show toast if enabled
      if (settings.showToasts) {
        setToastNotification(newNotification)

        // Auto-dismiss toast after 5 seconds
        const timer = setTimeout(() => {
          setToastNotification(null)
        }, 5000)

        return () => clearTimeout(timer)
      }

      // Play sound if enabled
      if (settings.soundEnabled && audioRef.current) {
        audioRef.current.play().catch((e) => console.error("Error playing notification sound:", e))
      }

      // Show desktop notification if enabled
      if (settings.desktopNotifications && "Notification" in window) {
        if (Notification.permission === "granted") {
          try {
            // Always use new operator with Notification
            new Notification(newNotification.title, {
              body: newNotification.message,
              icon: "/logo.png",
            })
          } catch (error) {
            console.error("Error showing desktop notification:", error)
          }
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission()
        }
      }
    }
  }, [lastUpdate, settings, setNotifications])

  // Convert real-time update to notification
  const convertUpdateToNotification = (update: RealTimeUpdate): Notification => {
    let type: NotificationType = "system_update"
    let title = "Update"
    let message = "Something happened in the system"
    let priority: Notification["priority"] = "medium"
    let source = {
      id: "system-1",
      type: "system" as const,
      name: "System",
    }
    let actions: Notification["actions"] = []

    switch (update.type) {
      case "idea":
        if (update.action === "create") {
          type = "idea_created"
          title = "New Idea Created"
          message = `A new idea "${update.data.title}" was created`
          priority = "medium"
          source = {
            id: update.data.createdBy?.id || "user-1",
            type: "user",
            name: update.data.createdBy?.name || "User",
            avatar: update.data.createdBy?.avatar,
          }
          actions = [
            {
              label: "View Idea",
              action: "view_idea",
              icon: <Eye />,
            },
          ]
        } else if (update.action === "update") {
          type = "idea_updated"
          title = "Idea Updated"
          message = `The idea "${update.data.title}" was updated by ${update.data.updatedBy}`
          priority = "low"
          source = {
            id: "user-1",
            type: "user",
            name: update.data.updatedBy || "User",
          }
          actions = [
            {
              label: "View Changes",
              action: "view_idea",
              icon: <Eye />,
            },
          ]
        }
        break
      case "comment":
        type = "comment_added"
        title = "New Comment"
        message = `${update.data.author} commented on an idea`
        priority = "medium"
        source = {
          id: "user-1",
          type: "user",
          name: update.data.author || "User",
        }
        actions = [
          {
            label: "View Comment",
            action: "view_comment",
            icon: <MessageSquare />,
          },
          {
            label: "Reply",
            action: "reply",
            icon: <MessageSquare />,
          },
        ]
        break
      case "approval":
        if (update.action === "approve") {
          type = "idea_approved"
          title = "Idea Approved"
          message = `${update.data.approver} approved an idea with feedback: ${update.data.feedback}`
          priority = "high"
          source = {
            id: "user-1",
            type: "user",
            name: update.data.approver || "User",
          }
          actions = [
            {
              label: "View Idea",
              action: "view_idea",
              icon: <Eye />,
            },
            {
              label: "Convert to Project",
              action: "convert_to_project",
              icon: <Briefcase />,
            },
          ]
        } else if (update.action === "reject") {
          type = "idea_rejected"
          title = "Idea Rejected"
          message = `${update.data.approver} rejected an idea with feedback: ${update.data.feedback}`
          priority = "high"
          source = {
            id: "user-1",
            type: "user",
            name: update.data.approver || "User",
          }
          actions = [
            {
              label: "View Feedback",
              action: "view_idea",
              icon: <Eye />,
            },
            {
              label: "Revise Idea",
              action: "edit_idea",
              icon: <FileText />,
            },
          ]
        }
        break
    }

    return {
      id: `notif-${Date.now()}`,
      type,
      title,
      message,
      timestamp: Date.now(),
      isRead: false,
      priority,
      source,
      actions,
      metadata: {
        updateId: update.id,
        ...update.data,
      },
    }
  }

  // Filter notifications based on active tab and settings
  const filteredNotifications = notifications.filter((notification) => {
    // Filter by tab
    if (activeTab === "unread" && notification.isRead) {
      return false
    }

    if (activeTab === "urgent" && notification.priority !== "urgent" && notification.priority !== "high") {
      return false
    }

    // Filter by priority setting
    if (settings.filterPriority !== "all" && notification.priority !== settings.filterPriority) {
      return false
    }

    return true
  })

  // Handle marking notification as read
  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  // Handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, isRead: true })))
  }

  // Handle notification action
  const handleNotificationAction = (id: string, action: string) => {
    console.log(`Notification ${id} action: ${action}`)
    // In a real app, this would trigger the appropriate action
    // For now, just mark as read
    handleMarkAsRead(id)

    // Close toast if this was a toast action
    if (toastNotification && toastNotification.id === id) {
      setToastNotification(null)
    }
  }

  // Handle deleting a notification
  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  // Handle clearing all notifications
  const handleClearAll = () => {
    setNotifications([])
  }

  // Handle requesting desktop notification permission
  const handleRequestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setSettings({ ...settings, desktopNotifications: true })
        }
      })
    }
  }

  // Get unread count
  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  // Position classes
  const positionClasses = {
    "top-right": "top-4 right-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-left": "top-4 left-4",
  }

  // If minimized, show only the bell icon with unread count
  if (isMinimized) {
    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed ${positionClasses[position]} z-50`}
        >
          <Button
            onClick={() => setIsMinimized(false)}
            className="rounded-full h-12 w-12 bg-primary shadow-lg flex items-center justify-center relative"
          >
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </motion.div>

        {/* Toast notifications */}
        <AnimatePresence>
          {toastNotification && settings.showToasts && (
            <div className={`fixed ${positionClasses[position]} z-40 mb-16`}>
              <ToastNotification
                notification={toastNotification}
                onClose={() => setToastNotification(null)}
                onAction={handleNotificationAction}
              />
            </div>
          )}
        </AnimatePresence>
      </>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed ${positionClasses[position]} z-50 ${isExpanded ? "w-[420px]" : "w-[380px]"}`}
      >
        <Card className="shadow-lg border-0 flex flex-col bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
          <CardHeader className="px-4 py-2 flex flex-row items-center justify-between space-y-0 border-b">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bell className="h-5 w-5 text-primary" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <CardTitle className="text-md font-medium">Notifications</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)} className="h-8 w-8">
                {isExpanded ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-minimize-2"
                  >
                    <polyline points="4 14 10 14 10 20"></polyline>
                    <polyline points="20 10 14 10 14 4"></polyline>
                    <line x1="14" x2="21" y1="10" y2="3"></line>
                    <line x1="3" x2="10" y1="21" y2="14"></line>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-maximize-2"
                  >
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <polyline points="9 21 3 21 3 15"></polyline>
                    <line x1="21" x2="14" y1="3" y2="10"></line>
                    <line x1="3" x2="10" y1="21" y2="14"></line>
                  </svg>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsMinimized(true)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <TabsList className="bg-transparent p-0">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary/10 rounded-md text-xs px-3">
                  All
                </TabsTrigger>
                <TabsTrigger value="unread" className="data-[state=active]:bg-primary/10 rounded-md text-xs px-3">
                  Unread
                  {unreadCount > 0 && (
                    <Badge variant="outline" className="ml-1 bg-primary/10 text-primary text-[10px] h-4 px-1">
                      {unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="urgent" className="data-[state=active]:bg-primary/10 rounded-md text-xs px-3">
                  Urgent
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filter by priority</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSettings({ ...settings, filterPriority: "all" })}>
                      All priorities
                      {settings.filterPriority === "all" && <Bell className="h-4 w-4 ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSettings({ ...settings, filterPriority: "urgent" })}>
                      Urgent only
                      {settings.filterPriority === "urgent" && <Bell className="h-4 w-4 ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSettings({ ...settings, filterPriority: "high" })}>
                      High priority
                      {settings.filterPriority === "high" && <Bell className="h-4 w-4 ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSettings({ ...settings, filterPriority: "medium" })}>
                      Medium priority
                      {settings.filterPriority === "medium" && <Bell className="h-4 w-4 ml-auto" />}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSettings({ ...settings, filterPriority: "low" })}>
                      Low priority
                      {settings.filterPriority === "low" && <Bell className="h-4 w-4 ml-auto" />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Notification Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="show-toasts" className="text-sm">
                          Show toast notifications
                        </Label>
                        <Switch
                          id="show-toasts"
                          checked={settings.showToasts}
                          onCheckedChange={(checked) => setSettings({ ...settings, showToasts: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="sound-enabled" className="text-sm">
                          Sound notifications
                        </Label>
                        <Switch
                          id="sound-enabled"
                          checked={settings.soundEnabled}
                          onCheckedChange={(checked) => setSettings({ ...settings, soundEnabled: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="desktop-notifications" className="text-sm">
                          Desktop notifications
                        </Label>
                        <Switch
                          id="desktop-notifications"
                          checked={settings.desktopNotifications}
                          onCheckedChange={(checked) => {
                            if (checked && "Notification" in window && Notification.permission !== "granted") {
                              handleRequestNotificationPermission()
                            } else {
                              setSettings({ ...settings, desktopNotifications: checked })
                            }
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="group-similar" className="text-sm">
                          Group similar notifications
                        </Label>
                        <Switch
                          id="group-similar"
                          checked={settings.groupSimilar}
                          onCheckedChange={(checked) => setSettings({ ...settings, groupSimilar: checked })}
                        />
                      </div>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <TabsContent value={activeTab} className="flex-1 p-0 m-0">
              <ScrollArea className="h-[400px]">
                {filteredNotifications.length > 0 ? (
                  <AnimatePresence initial={false}>
                    {filteredNotifications.slice(0, isExpanded ? undefined : maxNotifications).map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onRead={handleMarkAsRead}
                        onAction={handleNotificationAction}
                        onDelete={handleDeleteNotification}
                      />
                    ))}
                  </AnimatePresence>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-8">
                    <Bell className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-sm text-muted-foreground">
                      {activeTab === "unread"
                        ? "No unread notifications"
                        : activeTab === "urgent"
                          ? "No urgent notifications"
                          : "No notifications"}
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <CardFooter className="px-4 py-2 border-t flex justify-between">
            <Button variant="ghost" size="sm" className="text-xs" onClick={handleMarkAllAsRead}>
              <Check className="h-3.5 w-3.5 mr-1" />
              Mark all as read
            </Button>
            <Button variant="ghost" size="sm" className="text-xs" onClick={handleClearAll}>
              <X className="h-3.5 w-3.5 mr-1" />
              Clear all
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Toast notifications */}
      <AnimatePresence>
        {toastNotification && settings.showToasts && (
          <div className={`fixed ${positionClasses[position]} z-40 mb-16`}>
            <ToastNotification
              notification={toastNotification}
              onClose={() => setToastNotification(null)}
              onAction={handleNotificationAction}
            />
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

// Export a hook for using notifications in other components
export function useNotifications() {
  const [notifications, setNotifications] = useLocalStorage<Notification[]>("ideaforge-notifications", [])

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "isRead">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: Date.now(),
      isRead: false,
    }

    setNotifications((prev) => [newNotification, ...prev])
    return newNotification.id
  }

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return {
    notifications,
    addNotification,
    markAsRead,
    deleteNotification,
    clearAll,
    unreadCount: notifications.filter((notification) => !notification.isRead).length,
  }
}
