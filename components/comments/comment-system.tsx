"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, MessageSquare, MoreHorizontal, Reply, Edit, Trash, Send } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useUser } from "@/hooks/use-user"
import { useRealTimeUpdates } from "@/lib/real-time-service"
import { motion, AnimatePresence } from "framer-motion"

interface Comment {
  id: string
  text: string
  userId: string
  userName: string
  userAvatar?: string
  timestamp: number
  replies?: Comment[]
  likes?: string[] // Array of user IDs who liked the comment
}

interface CommentSystemProps {
  entityId: string
  entityType: "idea" | "project"
  comments?: Comment[]
  onAddComment?: (comment: Comment) => void
  onUpdateComment?: (commentId: string, text: string) => void
  onDeleteComment?: (commentId: string) => void
  onLikeComment?: (commentId: string, userId: string) => void
  maxHeight?: string
}

export function CommentSystem({
  entityId,
  entityType,
  comments: initialComments = [],
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onLikeComment,
  maxHeight = "400px",
}: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const { user, hasPermission } = useUser()
  const { addComment } = useRealTimeUpdates()

  // Update comments when initialComments changes
  useEffect(() => {
    setComments(initialComments)
  }, [initialComments])

  // Format date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  // Format relative time
  const formatRelativeTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp

    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 7) {
      return formatDate(timestamp)
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

  // Handle adding a new comment
  const handleAddComment = () => {
    if (!user) {
      console.warn("User not authenticated. Cannot add comment.")
      return
    }

    if (!newComment.trim()) return

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      text: newComment,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      timestamp: Date.now(),
      replies: [],
      likes: [],
    }

    setComments([...comments, comment])
    setNewComment("")

    // Call the onAddComment callback if provided
    if (onAddComment) {
      onAddComment(comment)
    }

    // Add comment to real-time service
    addComment(entityId, comment)
  }

  // Handle adding a reply
  const handleAddReply = (parentId: string) => {
    if (!user) {
      console.warn("User not authenticated. Cannot add reply.")
      return
    }

    if (!replyText.trim()) return

    const reply: Comment = {
      id: `comment-${Date.now()}`,
      text: replyText,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      timestamp: Date.now(),
      likes: [],
    }

    const updatedComments = comments.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply],
        }
      }
      return comment
    })

    setComments(updatedComments)
    setReplyingTo(null)
    setReplyText("")

    // Call the onAddComment callback if provided
    if (onAddComment) {
      onAddComment(reply)
    }
  }

  // Handle updating a comment
  const handleUpdateComment = (commentId: string) => {
    if (!editText.trim()) return

    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          text: editText,
        }
      }

      if (comment.replies) {
        const updatedReplies = comment.replies.map((reply) => {
          if (reply.id === commentId) {
            return {
              ...reply,
              text: editText,
            }
          }
          return reply
        })

        return {
          ...comment,
          replies: updatedReplies,
        }
      }

      return comment
    })

    setComments(updatedComments)
    setEditingComment(null)
    setEditText("")

    // Call the onUpdateComment callback if provided
    if (onUpdateComment) {
      onUpdateComment(commentId, editText)
    }
  }

  // Handle deleting a comment
  const handleDeleteComment = (commentId: string, parentId?: string) => {
    if (parentId) {
      // Delete a reply
      const updatedComments = comments.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: (comment.replies || []).filter((reply) => reply.id !== commentId),
          }
        }
        return comment
      })

      setComments(updatedComments)
    } else {
      // Delete a top-level comment
      const updatedComments = comments.filter((comment) => comment.id !== commentId)
      setComments(updatedComments)
    }

    // Call the onDeleteComment callback if provided
    if (onDeleteComment) {
      onDeleteComment(commentId)
    }
  }

  // Handle liking a comment
  const handleLikeComment = (commentId: string, parentId?: string) => {
    if (!user) {
      console.warn("User not authenticated. Cannot like comment.")
      return
    }

    const updatedComments = comments.map((comment) => {
      if (parentId) {
        // Like a reply
        if (comment.id === parentId && comment.replies) {
          const updatedReplies = comment.replies.map((reply) => {
            if (reply.id === commentId) {
              const likes = reply.likes || []
              const userLiked = likes.includes(user.id)

              return {
                ...reply,
                likes: userLiked ? likes.filter((userId) => userId !== user.id) : [...likes, user.id],
              }
            }
            return reply
          })

          return {
            ...comment,
            replies: updatedReplies,
          }
        }
      } else {
        // Like a top-level comment
        if (comment.id === commentId) {
          const likes = comment.likes || []
          const userLiked = likes.includes(user.id)

          return {
            ...comment,
            likes: userLiked ? likes.filter((userId) => userId !== user.id) : [...likes, user.id],
          }
        }
      }

      return comment
    })

    setComments(updatedComments)

    // Call the onLikeComment callback if provided
    if (onLikeComment) {
      onLikeComment(commentId, user.id)
    }
  }

  // Render a single comment
  const renderComment = (comment: Comment, parentId?: string) => {
    const isEditing = editingComment === comment.id
    const isReplying = replyingTo === comment.id
    const userLiked = comment.likes?.includes(user?.id || "") || false
    const canEdit = user?.id === comment.userId || hasPermission("update")
    const canDelete = user?.id === comment.userId || hasPermission("delete")

    return (
      <motion.div
        key={comment.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`p-3 rounded-lg ${parentId ? "bg-muted/30 ml-8 mt-2" : "bg-muted/50"}`}
      >
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.userAvatar || "/placeholder.svg"} alt={comment.userName} />
            <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="font-medium text-sm">{comment.userName}</div>
              <div className="text-xs text-muted-foreground">{formatRelativeTime(comment.timestamp)}</div>
            </div>
            {isEditing ? (
              <div className="mt-2 space-y-2">
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Edit your comment..."
                  className="min-h-[80px]"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingComment(null)
                      setEditText("")
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => handleUpdateComment(comment.id)}>
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm mt-1">{comment.text}</p>
            )}
            <div className="flex items-center gap-4 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className={`h-7 px-2 ${userLiked ? "text-quantum-600" : ""}`}
                onClick={() => handleLikeComment(comment.id, parentId)}
                disabled={!hasPermission("vote")}
              >
                <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">{comment.likes?.length || 0}</span>
              </Button>
              {!parentId && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => {
                    setReplyingTo(isReplying ? null : comment.id)
                    setReplyText("")
                  }}
                  disabled={!hasPermission("comment")}
                >
                  <Reply className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Reply</span>
                </Button>
              )}
              {(canEdit || canDelete) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 px-2">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {canEdit && (
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingComment(comment.id)
                          setEditText(comment.text)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {canDelete && (
                      <DropdownMenuItem onClick={() => handleDeleteComment(comment.id, parentId)}>
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {isReplying && !parentId && (
              <div className="mt-3 space-y-2">
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="min-h-[80px]"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null)
                      setReplyText("")
                    }}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => handleAddReply(comment.id)}>
                    Reply
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        {comment.replies && comment.replies.length > 0 && !parentId && (
          <div className="mt-2">
            <AnimatePresence>{comment.replies.map((reply) => renderComment(reply, comment.id))}</AnimatePresence>
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-medium">Comments</h3>
          <span className="text-sm text-muted-foreground">({comments.length})</span>
        </div>

        <ScrollArea className={`max-h-[${maxHeight}]`}>
          <div className="space-y-3">
            <AnimatePresence>
              {comments.length > 0 ? (
                comments.map((comment) => renderComment(comment))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No comments yet. Be the first to comment!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {hasPermission("comment") && (
          <div className="pt-2 border-t">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || "User"} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="min-h-[80px]"
                />
                <div className="flex justify-end">
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
