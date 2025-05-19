"use client"

import { useState, useEffect, useRef } from "react"
import { Users, MessageSquare, History, Edit3, Save, Eye, Clock, Sparkles, FileText, Zap } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CollaborativeEditingProps {
  documentId?: string
  documentTitle?: string
  documentType?: "idea" | "project" | "document"
  initialContent?: string
}

export function CollaborativeEditing({
  documentId = "doc-123",
  documentTitle = "AI-Powered Customer Insights Platform",
  documentType = "idea",
  initialContent = "This platform will use AI to analyze customer feedback across multiple channels and generate actionable insights for product teams. The system will integrate with existing customer feedback tools and provide a unified dashboard for product managers.",
}: CollaborativeEditingProps) {
  const [content, setContent] = useState(initialContent)
  const [editMode, setEditMode] = useState(false)
  const [comments, setComments] = useState<
    Array<{
      id: string
      user: {
        name: string
        avatar: string
        role: string
      }
      text: string
      timestamp: Date
      resolved: boolean
    }>
  >([
    {
      id: "comment-1",
      user: {
        name: "Alex Morgan",
        avatar: "/abstract-am.png",
        role: "Product Strategist",
      },
      text: "I think we should expand on the AI capabilities section. What specific models are we planning to use?",
      timestamp: new Date(Date.now() - 3600000 * 2),
      resolved: false,
    },
    {
      id: "comment-2",
      user: {
        name: "Taylor Kim",
        avatar: "/abstract-geometric-TK.png",
        role: "Lead Developer",
      },
      text: "We should consider using a combination of NLP models for text analysis and sentiment detection.",
      timestamp: new Date(Date.now() - 3600000),
      resolved: false,
    },
  ])
  const [newComment, setNewComment] = useState("")
  const [activeUsers, setActiveUsers] = useState([
    {
      id: "user-1",
      name: "Jordan Lee",
      avatar: "/stylized-jl-logo.png",
      role: "Project Manager",
      lastActive: new Date(),
    },
    {
      id: "user-2",
      name: "You",
      avatar: "/abstract-self-reflection.png",
      role: "Current User",
      lastActive: new Date(),
    },
  ])
  const [versions, setVersions] = useState([
    {
      id: "v1",
      timestamp: new Date(Date.now() - 86400000),
      user: {
        name: "Alex Morgan",
        avatar: "/abstract-am.png",
      },
      changes: "Initial document creation",
    },
    {
      id: "v2",
      timestamp: new Date(Date.now() - 43200000),
      user: {
        name: "Taylor Kim",
        avatar: "/abstract-geometric-TK.png",
      },
      changes: "Added AI capabilities section",
    },
    {
      id: "v3",
      timestamp: new Date(Date.now() - 3600000),
      user: {
        name: "Jordan Lee",
        avatar: "/stylized-jl-logo.png",
      },
      changes: "Expanded implementation details",
    },
  ])
  const [aiSuggestions, setAiSuggestions] = useState([
    {
      id: "suggestion-1",
      text: "Consider adding specific metrics for measuring the success of the AI insights platform.",
      confidence: 92,
      applied: false,
    },
    {
      id: "suggestion-2",
      text: "The document could benefit from a section on data privacy and security considerations.",
      confidence: 88,
      applied: false,
    },
    {
      id: "suggestion-3",
      text: "You might want to specify which customer feedback channels will be supported initially.",
      confidence: 85,
      applied: false,
    },
  ])

  const contentRef = useRef<HTMLTextAreaElement>(null)
  const [cursorPositions, setCursorPositions] = useState<Record<string, { line: number; ch: number }>>({
    "user-1": { line: 3, ch: 15 },
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate cursor movement for other users
      setCursorPositions((prev) => ({
        ...prev,
        "user-1": {
          line: Math.floor(Math.random() * 5),
          ch: Math.floor(Math.random() * 30),
        },
      }))

      // Simulate users coming online/going offline
      if (Math.random() > 0.7) {
        const offlineUser = {
          id: "user-3",
          name: "Riley Singh",
          avatar: "/abstract-rs.png",
          role: "QA Engineer",
          lastActive: new Date(Date.now() - Math.floor(Math.random() * 600000)),
        }

        if (activeUsers.some((u) => u.id === "user-3")) {
          setActiveUsers((prev) => prev.filter((u) => u.id !== "user-3"))
        } else {
          setActiveUsers((prev) => [...prev, offlineUser])
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [activeUsers])

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: `comment-${comments.length + 1}`,
          user: {
            name: "You",
            avatar: "/abstract-self-reflection.png",
            role: "Current User",
          },
          text: newComment,
          timestamp: new Date(),
          resolved: false,
        },
      ])
      setNewComment("")
    }
  }

  const handleResolveComment = (commentId: string) => {
    setComments(comments.map((comment) => (comment.id === commentId ? { ...comment, resolved: true } : comment)))
  }

  const handleApplySuggestion = (suggestionId: string) => {
    const suggestion = aiSuggestions.find((s) => s.id === suggestionId)
    if (suggestion) {
      setContent((prev) => `${prev}\n\n${suggestion.text}`)
      setAiSuggestions(aiSuggestions.map((s) => (s.id === suggestionId ? { ...s, applied: true } : s)))
    }
  }

  const handleSaveContent = () => {
    // In a real app, this would save to a database
    setVersions([
      {
        id: `v${versions.length + 1}`,
        timestamp: new Date(),
        user: {
          name: "You",
          avatar: "/abstract-self-reflection.png",
        },
        changes: "Updated document content",
      },
      ...versions,
    ])
    setEditMode(false)
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <span>{documentTitle}</span>
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 text-primary">
                {documentType.charAt(0).toUpperCase() + documentType.slice(1)}
              </Badge>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last edited {formatTimestamp(versions[0].timestamp)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {activeUsers.length} active
              </span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {editMode ? (
              <>
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveContent} className="flex items-center gap-1">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditMode(true)} className="flex items-center gap-1">
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="relative">
              {editMode ? (
                <Textarea
                  ref={contentRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
              ) : (
                <div className="relative min-h-[300px] p-3 rounded-md border bg-muted/30 font-mono text-sm whitespace-pre-wrap">
                  {content}

                  {/* Cursor indicators for other users */}
                  {Object.entries(cursorPositions).map(([userId, position]) => {
                    const user = activeUsers.find((u) => u.id === userId)
                    if (!user) return null

                    // This is a simplified approach - in a real app you'd need more sophisticated cursor positioning
                    const lines = content.split("\n")
                    const lineHeight = 1.5 // em
                    const charWidth = 0.6 // em

                    const top = Math.min(position.line, lines.length - 1) * lineHeight
                    const left = Math.min(position.ch, (lines[position.line] || "").length) * charWidth

                    return (
                      <TooltipProvider key={userId}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="absolute w-0.5 h-5 bg-blue-500 animate-pulse"
                              style={{
                                top: `${top}em`,
                                left: `${left}em`,
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{user.name}</span>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                </div>
              )}

              {/* Active users indicator */}
              <div className="absolute top-2 right-2 flex -space-x-2">
                {activeUsers.map((user) => (
                  <TooltipProvider key={user.id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Avatar className="h-6 w-6 border-2 border-background">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">
                          <div>{user.name}</div>
                          <div className="text-muted-foreground">{user.role}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>

            <Tabs defaultValue="comments" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="comments" className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>Comments</span>
                  <Badge variant="secondary" className="ml-1 h-5 px-1">
                    {comments.filter((c) => !c.resolved).length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-1">
                  <History className="h-4 w-4" />
                  <span>Version History</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="comments" className="space-y-4 mt-4">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src="/abstract-self-reflection.png" alt="You" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full"
                    />
                  </div>
                  <Button onClick={handleAddComment} size="sm">
                    Comment
                  </Button>
                </div>

                <ScrollArea className="h-[300px]">
                  <div className="space-y-4 pr-4">
                    {comments.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">No comments yet</div>
                    ) : (
                      comments.map((comment) => (
                        <div
                          key={comment.id}
                          className={`p-3 rounded-lg ${comment.resolved ? "bg-muted/30 opacity-60" : "bg-muted"}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={comment.user.avatar || "/placeholder.svg"} alt={comment.user.name} />
                                <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">{comment.user.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {formatTimestamp(comment.timestamp)}
                                </div>
                              </div>
                            </div>
                            {!comment.resolved && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleResolveComment(comment.id)}
                                className="h-7 text-xs"
                              >
                                Resolve
                              </Button>
                            )}
                          </div>
                          <div className={`mt-2 text-sm ${comment.resolved ? "line-through opacity-70" : ""}`}>
                            {comment.text}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="history" className="mt-4">
                <ScrollArea className="h-[350px]">
                  <div className="space-y-2 pr-4">
                    {versions.map((version, index) => (
                      <div
                        key={version.id}
                        className={`p-3 rounded-lg border ${index === 0 ? "bg-primary/5 border-primary/20" : "bg-muted/30"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={version.user.avatar || "/placeholder.svg"} alt={version.user.name} />
                              <AvatarFallback>{version.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{version.user.name}</div>
                              <div className="text-xs text-muted-foreground">{formatTimestamp(version.timestamp)}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {index === 0 && (
                              <Badge variant="outline" className="bg-primary/10 text-primary">
                                Current
                              </Badge>
                            )}
                            <Button variant="ghost" size="sm" className="h-7">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2 text-sm">{version.changes}</div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="bg-primary/5 border border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>AI Suggestions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiSuggestions.length === 0 ? (
                  <div className="text-center text-muted-foreground py-4">No suggestions available</div>
                ) : (
                  aiSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="space-y-2">
                      <div className="text-sm">{suggestion.text}</div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">Confidence: {suggestion.confidence}%</div>
                        {suggestion.applied ? (
                          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500">
                            Applied
                          </Badge>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApplySuggestion(suggestion.id)}
                            className="h-7 text-xs"
                          >
                            Apply
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}

                <Button variant="outline" className="w-full text-xs h-8 mt-2">
                  <Zap className="h-3 w-3 mr-1" />
                  Generate More Suggestions
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Collaborators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.role}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{formatTimestamp(user.lastActive)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Document Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Word Count</span>
                    <span className="text-sm font-medium">{content.split(/\s+/).filter(Boolean).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Character Count</span>
                    <span className="text-sm font-medium">{content.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Versions</span>
                    <span className="text-sm font-medium">{versions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Comments</span>
                    <span className="text-sm font-medium">{comments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Last Updated</span>
                    <span className="text-sm font-medium">{formatTimestamp(versions[0].timestamp)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
