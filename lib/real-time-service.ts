"use client"

import { useState, useEffect } from "react"
import { createInstance } from "./quantum-error-prevention"

// Types for real-time updates
export type RealTimeUpdateType = "idea" | "comment" | "vote" | "approval"
export type RealTimeUpdateAction = "create" | "update" | "delete" | "approve" | "reject"

export interface RealTimeUpdate {
  id: string
  type: RealTimeUpdateType
  action: RealTimeUpdateAction
  timestamp: number
  data: any
}

// Mock WebSocket class
class MockWebSocket {
  private callbacks: { [key: string]: (data: any) => void } = {}
  private interval: NodeJS.Timeout | null = null
  private connected = false
  private mockData: RealTimeUpdate[] = [
    {
      id: "update-1",
      type: "idea",
      action: "update",
      timestamp: Date.now(),
      data: {
        ideaId: "idea-1",
        title: "Quantum Interface Redesign",
        updatedFields: ["description", "tags"],
        updatedBy: "Sarah Wilson",
      },
    },
    {
      id: "comment-1",
      type: "comment",
      action: "create",
      timestamp: Date.now() + 30000,
      data: {
        ideaId: "idea-2",
        commentId: "comment-1",
        text: "This is a brilliant idea! I think we should prioritize this for Q3.",
        author: "James Smith",
      },
    },
    {
      id: "vote-1",
      type: "vote",
      action: "create",
      timestamp: Date.now() + 60000,
      data: {
        ideaId: "idea-3",
        voteType: "upvote",
        voter: "Maria Garcia",
      },
    },
    {
      id: "approval-1",
      type: "approval",
      action: "approve",
      timestamp: Date.now() + 90000,
      data: {
        ideaId: "idea-1",
        approver: "David Brown",
        feedback: "Approved with minor suggestions for implementation.",
      },
    },
  ]

  constructor() {
    console.log("Mock WebSocket initialized")
  }

  connect() {
    if (this.connected) return this

    this.connected = true
    console.log("Mock WebSocket connected")

    // Simulate connection event
    setTimeout(() => {
      this.trigger("connect", {})
    }, 500)

    // Simulate periodic updates
    this.interval = setInterval(() => {
      const randomUpdate = this.mockData[Math.floor(Math.random() * this.mockData.length)]
      const update = {
        ...randomUpdate,
        id: `${randomUpdate.id}-${Date.now()}`,
        timestamp: Date.now(),
      }
      this.trigger("message", update)
    }, 8000)

    return this
  }

  disconnect() {
    if (!this.connected) return this

    this.connected = false
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    console.log("Mock WebSocket disconnected")

    // Simulate disconnect event
    setTimeout(() => {
      this.trigger("disconnect", {})
    }, 500)

    return this
  }

  on(event: string, callback: (data: any) => void) {
    this.callbacks[event] = callback
    return this
  }

  off(event: string) {
    delete this.callbacks[event]
    return this
  }

  private trigger(event: string, data: any) {
    if (this.callbacks[event]) {
      this.callbacks[event](data)
    }
  }

  isConnected() {
    return this.connected
  }
}

// Singleton instance
let websocketInstance: MockWebSocket | null = null

// Get or create the WebSocket instance
export function getWebSocketInstance() {
  if (!websocketInstance) {
    // Use the createInstance helper to ensure 'new' is used
    websocketInstance = createInstance(MockWebSocket)
  }
  return websocketInstance
}

// Hook for subscribing to real-time updates
export function useRealTimeUpdates() {
  const [isConnected, setIsConnected] = useState(false)
  const [updates, setUpdates] = useState<RealTimeUpdate[]>([])
  const [lastUpdate, setLastUpdate] = useState<RealTimeUpdate | null>(null)

  useEffect(() => {
    const ws = getWebSocketInstance()

    const handleConnect = () => {
      setIsConnected(true)
    }

    const handleDisconnect = () => {
      setIsConnected(false)
    }

    const handleMessage = (data: RealTimeUpdate) => {
      setUpdates((prev) => [data, ...prev].slice(0, 20))
      setLastUpdate(data)
    }

    ws.on("connect", handleConnect).on("disconnect", handleDisconnect).on("message", handleMessage).connect()

    // Check if already connected
    if (ws.isConnected()) {
      setIsConnected(true)
    }

    return () => {
      ws.off("connect").off("disconnect").off("message")
    }
  }, [])

  // Function to add a comment
  const addComment = (ideaId: string, comment: any) => {
    if (!isConnected) {
      console.warn("Not connected to real-time service. Cannot add comment.")
      return
    }

    // Create a real-time update for the comment
    const update: RealTimeUpdate = {
      id: `update-${Date.now()}`,
      type: "comment",
      action: "create",
      timestamp: Date.now(),
      data: {
        ideaId,
        commentId: comment.id,
        author: comment.userName,
        text: comment.text,
      },
    }

    // Set the last update
    setLastUpdate(update)
    setUpdates((prev) => [update, ...prev].slice(0, 20))

    console.log("Comment added:", update)
  }

  // Function to add a vote
  const addVote = (ideaId: string, vote: any) => {
    if (!isConnected) {
      console.warn("Not connected to real-time service. Cannot add vote.")
      return
    }

    // Create a real-time update for the vote
    const update: RealTimeUpdate = {
      id: `update-${Date.now()}`,
      type: "vote",
      action: "create",
      timestamp: Date.now(),
      data: {
        ideaId,
        voteId: vote.id,
        voter: vote.userName,
        voteType: vote.type,
      },
    }

    // Set the last update
    setLastUpdate(update)
    setUpdates((prev) => [update, ...prev].slice(0, 20))

    console.log("Vote added:", update)
  }

  // Function to update an idea
  const updateIdea = (ideaId: string, idea: any) => {
    if (!isConnected) {
      console.warn("Not connected to real-time service. Cannot update idea.")
      return
    }

    // Create a real-time update for the idea
    const update: RealTimeUpdate = {
      id: `update-${Date.now()}`,
      type: "idea",
      action: "update",
      timestamp: Date.now(),
      data: {
        ideaId,
        title: idea.title,
        updatedBy: idea.updatedBy,
      },
    }

    // Set the last update
    setLastUpdate(update)
    setUpdates((prev) => [update, ...prev].slice(0, 20))

    console.log("Idea updated:", update)
  }

  // Function to approve an idea
  const approveIdea = (ideaId: string, approver: string, feedback: string) => {
    if (!isConnected) {
      console.warn("Not connected to real-time service. Cannot approve idea.")
      return
    }

    // Create a real-time update for the approval
    const update: RealTimeUpdate = {
      id: `update-${Date.now()}`,
      type: "approval",
      action: "approve",
      timestamp: Date.now(),
      data: {
        ideaId,
        approver,
        feedback,
      },
    }

    // Set the last update
    setLastUpdate(update)
    setUpdates((prev) => [update, ...prev].slice(0, 20))

    console.log("Idea approved:", update)
  }

  return {
    isConnected,
    updates,
    lastUpdate,
    addComment,
    addVote,
    updateIdea,
    approveIdea,
  }
}
