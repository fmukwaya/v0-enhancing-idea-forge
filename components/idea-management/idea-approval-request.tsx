"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Users,
  FileText,
  Send,
  MessageSquare,
  BarChart2,
  Lightbulb,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { motion } from "framer-motion"

interface ApproverCardProps {
  name: string
  role: string
  avatar: string
  status: "pending" | "approved" | "rejected" | "reviewing"
  feedback?: string
  date?: string
}

const ApproverCard = ({ name, role, avatar, status, feedback, date }: ApproverCardProps) => {
  const getStatusIcon = () => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "reviewing":
        return <Clock className="h-5 w-5 text-amber-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "approved":
        return "Approved"
      case "rejected":
        return "Rejected"
      case "reviewing":
        return "Reviewing"
      default:
        return "Pending"
    }
  }

  const getStatusClass = () => {
    switch (status) {
      case "approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900"
      case "reviewing":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    }
  }

  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg bg-white dark:bg-quantum-900">
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium">{name}</h4>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
          <Badge variant="outline" className={getStatusClass()}>
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </div>
          </Badge>
        </div>
        {feedback && (
          <div className="mt-3 p-3 bg-muted rounded-md">
            <p className="text-sm">{feedback}</p>
          </div>
        )}
        {date && <p className="mt-2 text-xs text-muted-foreground">{date}</p>}
      </div>
    </div>
  )
}

interface IdeaApprovalRequestProps {
  ideaId: string
  ideaTitle: string
  ideaDescription: string
  category: string
  createdBy: {
    name: string
    avatar: string
  }
  createdAt: string
  status: "draft" | "pending" | "approved" | "rejected" | "in-review"
  approvers: ApproverCardProps[]
  onSubmit?: (ideaId: string, approvers: string[], message: string) => void
}

export function IdeaApprovalRequest({
  ideaId,
  ideaTitle,
  ideaDescription,
  category,
  createdBy,
  createdAt,
  status,
  approvers,
  onSubmit,
}: IdeaApprovalRequestProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedApprovers, setSelectedApprovers] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getStatusBadge = () => {
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
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
            <FileText className="h-3.5 w-3.5 mr-1" />
            Draft
          </Badge>
        )
    }
  }

  const getApprovalProgress = () => {
    const approved = approvers.filter((approver) => approver.status === "approved").length
    return (approved / approvers.length) * 100
  }

  const handleSubmit = async () => {
    if (selectedApprovers.length === 0) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (onSubmit) {
      onSubmit(ideaId, selectedApprovers, message)
    }

    setIsSubmitting(false)
  }

  const toggleApprover = (name: string) => {
    if (selectedApprovers.includes(name)) {
      setSelectedApprovers(selectedApprovers.filter((a) => a !== name))
    } else {
      setSelectedApprovers([...selectedApprovers, name])
    }
  }

  const potentialApprovers = [
    { name: "Sarah Wilson", role: "Product Director", avatar: "/short-haired-person.png" },
    { name: "James Smith", role: "CTO", avatar: "/person-dark-hair.png" },
    { name: "Maria Garcia", role: "Innovation Lead", avatar: "/curly-haired-person.png" },
    { name: "David Brown", role: "Engineering Manager", avatar: "/person-with-glasses.png" },
  ]

  return (
    <Card className="w-full overflow-hidden border-quantum-600/20 bg-gradient-to-br from-white to-quantum-50/30 dark:from-quantum-950 dark:to-quantum-900">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-quantum tracking-tight flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-quantum-600" />
              Approval Request
            </CardTitle>
            <CardDescription className="text-quantum-700 dark:text-quantum-300">
              Request approval for "{ideaTitle}"
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="pb-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-quantum-100/50 dark:bg-quantum-800/50">
            <TabsTrigger value="overview" className="flex-1 flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              <span>Idea Overview</span>
            </TabsTrigger>
            <TabsTrigger value="approvers" className="flex-1 flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Approvers</span>
            </TabsTrigger>
            <TabsTrigger value="request" className="flex-1 flex items-center gap-1">
              <Send className="h-4 w-4" />
              <span>Submit Request</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="flex items-start gap-4 p-4 border rounded-lg bg-white dark:bg-quantum-900">
              <div className="p-2 rounded-md bg-quantum-100 dark:bg-quantum-800 text-quantum-700 dark:text-quantum-300">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium">{ideaTitle}</h3>
                <div className="flex items-center gap-2 mt-1 mb-3">
                  <Badge variant="outline">{category}</Badge>
                  <span className="text-sm text-muted-foreground">Created on {createdAt}</span>
                </div>
                <p className="text-sm">{ideaDescription}</p>
                <div className="flex items-center gap-2 mt-4">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={createdBy.avatar || "/placeholder.svg"} alt={createdBy.name} />
                    <AvatarFallback>{createdBy.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{createdBy.name}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Approval Progress</span>
                <span className="font-medium">
                  {approvers.filter((a) => a.status === "approved").length} of {approvers.length} approvers
                </span>
              </div>
              <Progress value={getApprovalProgress()} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-quantum-900">
                <div className="flex items-center gap-3">
                  <BarChart2 className="h-5 w-5 text-quantum-600" />
                  <div>
                    <p className="font-medium">Impact Score</p>
                    <p className="text-sm text-muted-foreground">High potential impact</p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800">85/100</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-quantum-900">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-quantum-600" />
                  <div>
                    <p className="font-medium">Stakeholders</p>
                    <p className="text-sm text-muted-foreground">Cross-functional impact</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">4 teams</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-quantum-900">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-quantum-600" />
                  <div>
                    <p className="font-medium">Feedback</p>
                    <p className="text-sm text-muted-foreground">Community response</p>
                  </div>
                </div>
                <Badge className="bg-purple-100 text-purple-800">12 comments</Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="approvers" className="mt-4 space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Current Approvers</h3>
              {approvers.length > 0 ? (
                <div className="space-y-3">
                  {approvers.map((approver, index) => (
                    <ApproverCard key={index} {...approver} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-lg">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Approvers Yet</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Add approvers to request feedback on your idea</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Approval Timeline</h3>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activities</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-0 before:h-full before:w-0.5 before:bg-border">
                {approvers
                  .filter((a) => a.status !== "pending")
                  .map((approver, index) => (
                    <motion.div
                      key={index}
                      className="relative"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-background border-2 border-quantum-600 flex items-center justify-center">
                        {approver.status === "approved" ? (
                          <CheckCircle className="h-3 w-3 text-emerald-500" />
                        ) : approver.status === "rejected" ? (
                          <XCircle className="h-3 w-3 text-red-500" />
                        ) : (
                          <Clock className="h-3 w-3 text-amber-500" />
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">
                          {approver.name}{" "}
                          <span className="text-muted-foreground">
                            {approver.status === "approved"
                              ? "approved"
                              : approver.status === "rejected"
                                ? "rejected"
                                : "is reviewing"}
                          </span>{" "}
                          this idea
                        </p>
                        {approver.date && <p className="text-xs text-muted-foreground">{approver.date}</p>}
                        {approver.feedback && (
                          <div className="mt-1 p-3 bg-muted rounded-md">
                            <p className="text-sm">{approver.feedback}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="request" className="mt-4 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select Approvers</h3>
              <p className="text-sm text-muted-foreground">
                Choose the stakeholders who need to approve this idea before it can move forward.
              </p>

              <div className="space-y-3">
                {potentialApprovers.map((approver, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 border rounded-lg bg-white dark:bg-quantum-900 hover:bg-quantum-50 dark:hover:bg-quantum-800/50 cursor-pointer"
                    onClick={() => toggleApprover(approver.name)}
                  >
                    <Checkbox
                      id={`approver-${index}`}
                      checked={selectedApprovers.includes(approver.name)}
                      onCheckedChange={() => toggleApprover(approver.name)}
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={approver.avatar || "/placeholder.svg"} alt={approver.name} />
                        <AvatarFallback>{approver.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Label htmlFor={`approver-${index}`} className="font-medium cursor-pointer">
                          {approver.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">{approver.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Add a Message</h3>
                <Badge variant="outline" className="bg-quantum-100/50 dark:bg-quantum-800/50">
                  Optional
                </Badge>
              </div>
              <Textarea
                placeholder="Add context or specific questions for the approvers..."
                className="min-h-[100px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="rounded-lg border p-4 bg-quantum-50 dark:bg-quantum-900/50">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className="font-medium">Before You Submit</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Ensure your idea is fully developed and includes all necessary details. Approvers will evaluate based on
                feasibility, impact, and alignment with organizational goals.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-3">
        {activeTab === "request" ? (
          <Button
            onClick={handleSubmit}
            disabled={selectedApprovers.length === 0 || isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-quantum-600 hover:bg-quantum-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Clock className="h-4 w-4 animate-spin" />
                Submitting Request...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Submit Approval Request
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={() => setActiveTab("request")}
            className="w-full flex items-center justify-center gap-2 border-quantum-200 dark:border-quantum-700 hover:bg-quantum-100 dark:hover:bg-quantum-800"
            variant="outline"
          >
            Proceed to Request Approval
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
