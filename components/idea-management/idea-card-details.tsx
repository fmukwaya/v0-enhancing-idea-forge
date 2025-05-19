"use client"

import { Progress } from "@/components/ui/progress"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, MessageSquare, Share2, Bookmark, Edit, Save, Plus, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUser } from "@/hooks/use-user" // Import the useUser hook

interface IdeaCardDetailsProps {
  ideaId: string
  ideaTitle: string
  ideaDescription: string
  ideaCategory: string
  ideaTags: string[]
  ideaCreatedBy: {
    name: string
    avatar?: string
  }
  ideaCreatedAt: string
  ideaImpactScore: number
  ideaVotes: number
  ideaComments: number
  ideaCollaborators: IdeaCollaborator[]
}

interface IdeaCollaborator {
  id: string
  name: string
  avatar?: string
  role?: string
}

export function IdeaCardDetails({
  ideaId,
  ideaTitle,
  ideaDescription,
  ideaCategory,
  ideaTags,
  ideaCreatedBy,
  ideaCreatedAt,
  ideaImpactScore,
  ideaVotes,
  ideaComments,
  ideaCollaborators,
}: IdeaCardDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [commentText, setCommentText] = useState("")
  const { hasPermission, user } = useUser() // Use the useUser hook

  const handleAddComment = () => {
    if (!user) {
      console.warn("User not authenticated. Cannot add comment.")
      return
    }

    if (commentText.trim()) {
      // In a real app, this would add the comment to the database
      console.log(`Adding comment "${commentText}" to idea ${ideaId} by user ${user.id}`)
      setCommentText("")
    }
  }

  const handleVote = (voteType: "up" | "down") => {
    if (!user) {
      console.warn("User not authenticated. Cannot vote.")
      return
    }

    // In a real app, this would add the vote to the database
    console.log(`Voting ${voteType} on idea ${ideaId} by user ${user.id}`)
  }

  return (
    <Card className="w-full overflow-hidden border-quantum-600/20 bg-gradient-to-br from-white to-quantum-50/30 dark:from-quantum-950 dark:to-quantum-900">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-quantum tracking-tight">{ideaTitle}</CardTitle>
            <CardDescription className="text-quantum-700 dark:text-quantum-300">
              Created by {ideaCreatedBy.name} on {ideaCreatedAt}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bookmark className="h-4 w-4" />
            </Button>
            {hasPermission("update") && (
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-1">
        <div className="space-y-4">
          {isEditing ? (
            <Textarea
              className="w-full"
              defaultValue={ideaDescription}
              onChange={(e) => console.log("Updating description:", e.target.value)}
            />
          ) : (
            <p className="text-sm text-muted-foreground">{ideaDescription}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {ideaTags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-quantum-50 dark:bg-quantum-900">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={ideaCreatedBy.avatar || "/placeholder.svg"} alt={ideaCreatedBy.name} />
                <AvatarFallback>{ideaCreatedBy.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{ideaCreatedBy.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                <span>{ideaVotes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span>{ideaComments}</span>
              </div>
              {ideaCollaborators.length > 0 && (
                <div className="flex -space-x-2">
                  {ideaCollaborators.slice(0, 3).map((collaborator) => (
                    <Avatar key={collaborator.id} className="h-6 w-6 border-2 border-background">
                      <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                      <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                  {ideaCollaborators.length > 3 && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                      +{ideaCollaborators.length - 3}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Impact</span>
              <span className="font-medium">{ideaImpactScore}%</span>
            </div>
            <Progress value={ideaImpactScore} className="h-1" />
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Comments</h4>
            <ScrollArea className="h-[200px] pr-2">
              <div className="space-y-3">
                {/* Mock comments - replace with actual data */}
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-start gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/short-haired-person.png" alt="Sarah Wilson" />
                      <AvatarFallback>SW</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">Sarah Wilson</div>
                      <p className="text-sm text-muted-foreground">This is a great idea!</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-start gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/person-dark-hair.png" alt="James Smith" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">James Smith</div>
                      <p className="text-sm text-muted-foreground">I agree, we should prioritize this.</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" onClick={handleAddComment} disabled={!hasPermission("comment")}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3 flex justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleVote("up")} disabled={!hasPermission("vote")}>
            <ThumbsUp className="h-4 w-4 mr-2" />
            Upvote
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleVote("down")} disabled={!hasPermission("vote")}>
            <ThumbsUp className="h-4 w-4 mr-2 rotate-180" />
            Downvote
          </Button>
        </div>
        {hasPermission("delete") && (
          <Button variant="destructive" size="sm">
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
