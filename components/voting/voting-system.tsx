"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, BarChart2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from "@/hooks/use-user"
import { useRealTimeUpdates } from "@/lib/real-time-service"
import { motion } from "framer-motion"

interface Vote {
  id: string
  type: "up" | "down"
  userId: string
  userName: string
  userAvatar?: string
  timestamp: number
}

interface VotingSystemProps {
  entityId: string
  entityType: "idea" | "project"
  votes?: Vote[]
  onVote?: (vote: Vote) => void
  showVoters?: boolean
  showStats?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "outline" | "ghost"
}

export function VotingSystem({
  entityId,
  entityType,
  votes: initialVotes = [],
  onVote,
  showVoters = true,
  showStats = true,
  size = "md",
  variant = "outline",
}: VotingSystemProps) {
  const [votes, setVotes] = useState<Vote[]>(initialVotes)
  const [showVotersDialog, setShowVotersDialog] = useState(false)
  const { user, hasPermission } = useUser()
  const { addVote } = useRealTimeUpdates()

  // Update votes when initialVotes changes
  useEffect(() => {
    setVotes(initialVotes)
  }, [initialVotes])

  // Calculate vote counts
  const upvotes = votes.filter((vote) => vote.type === "up").length
  const downvotes = votes.filter((vote) => vote.type === "down").length
  const totalVotes = upvotes + downvotes
  const upvotePercentage = totalVotes > 0 ? Math.round((upvotes / totalVotes) * 100) : 0

  // Check if user has already voted
  const userVote = user ? votes.find((vote) => vote.userId === user.id) : undefined
  const hasUpvoted = userVote?.type === "up"
  const hasDownvoted = userVote?.type === "down"

  // Handle voting
  const handleVote = (type: "up" | "down") => {
    if (!user) {
      console.warn("User not authenticated. Cannot vote.")
      return
    }

    if (!hasPermission("vote")) {
      console.warn("User does not have permission to vote.")
      return
    }

    // If user has already voted with the same type, remove the vote
    if ((type === "up" && hasUpvoted) || (type === "down" && hasDownvoted)) {
      const updatedVotes = votes.filter((vote) => vote.userId !== user.id)
      setVotes(updatedVotes)
      return
    }

    // If user has already voted with a different type, update the vote
    if (userVote) {
      const updatedVotes = votes.map((vote) =>
        vote.userId === user.id ? { ...vote, type, timestamp: Date.now() } : vote,
      )
      setVotes(updatedVotes)
      return
    }

    // Otherwise, add a new vote
    const newVote: Vote = {
      id: `vote-${Date.now()}`,
      type,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      timestamp: Date.now(),
    }

    setVotes([...votes, newVote])

    // Call the onVote callback if provided
    if (onVote) {
      onVote(newVote)
    }

    // Add vote to real-time service
    addVote(entityId, newVote)
  }

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

  // Get button size based on the size prop
  const getButtonSize = () => {
    switch (size) {
      case "sm":
        return "h-8 px-2"
      case "lg":
        return "h-12 px-4"
      default:
        return "h-10 px-3"
    }
  }

  // Get icon size based on the size prop
  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "h-4 w-4"
      case "lg":
        return "h-6 w-6"
      default:
        return "h-5 w-5"
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          variant={variant}
          size={size}
          className={`${getButtonSize()} ${hasUpvoted ? "bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" : ""}`}
          onClick={() => handleVote("up")}
          disabled={!hasPermission("vote")}
        >
          <ThumbsUp className={`${getIconSize()} mr-1`} />
          <span>{upvotes}</span>
        </Button>
        <Button
          variant={variant}
          size={size}
          className={`${getButtonSize()} ${hasDownvoted ? "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800" : ""}`}
          onClick={() => handleVote("down")}
          disabled={!hasPermission("vote")}
        >
          <ThumbsDown className={`${getIconSize()} mr-1`} />
          <span>{downvotes}</span>
        </Button>
        {showVoters && (
          <Dialog open={showVotersDialog} onOpenChange={setShowVotersDialog}>
            <DialogTrigger asChild>
              <Button variant="ghost" size={size} className={getButtonSize()}>
                <BarChart2 className={getIconSize()} />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Votes</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                {showStats && (
                  <div className="space-y-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Upvotes: {upvotes}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ThumbsDown className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium">Downvotes: {downvotes}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Approval Rating</span>
                        <span className="font-medium">{upvotePercentage}%</span>
                      </div>
                      <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
                        <motion.div
                          className="bg-green-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${upvotePercentage}%` }}
                          transition={{ duration: 0.5 }}
                        />
                        <motion.div
                          className="bg-red-600"
                          initial={{ width: 0 }}
                          animate={{ width: `${100 - upvotePercentage}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <ScrollArea className="max-h-[300px] pr-4">
                  <div className="space-y-4">
                    {votes.length > 0 ? (
                      <>
                        {upvotes > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Upvotes</h4>
                            <div className="space-y-2">
                              {votes
                                .filter((vote) => vote.type === "up")
                                .map((vote) => (
                                  <div key={vote.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage src={vote.userAvatar || "/placeholder.svg"} alt={vote.userName} />
                                        <AvatarFallback>{vote.userName.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm">{vote.userName}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{formatDate(vote.timestamp)}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                        {downvotes > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Downvotes</h4>
                            <div className="space-y-2">
                              {votes
                                .filter((vote) => vote.type === "down")
                                .map((vote) => (
                                  <div key={vote.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-6 w-6">
                                        <AvatarImage src={vote.userAvatar || "/placeholder.svg"} alt={vote.userName} />
                                        <AvatarFallback>{vote.userName.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm">{vote.userName}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{formatDate(vote.timestamp)}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <BarChart2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No votes yet. Be the first to vote!</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
