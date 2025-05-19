"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  MessageSquare,
  Send,
  Minimize2,
  Maximize2,
  X,
  Search,
  Globe,
  Settings,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  RefreshCw,
  Link,
  Lightbulb,
  Loader,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

interface AIConversationProps {
  contextType?: "idea" | "project" | "document" | "global"
  contextId?: string
  contextTitle?: string
}

export function AIConversation({
  contextType = "idea",
  contextId = "idea-123",
  contextTitle = "AI-Powered Customer Insights Platform",
}: AIConversationProps) {
  const [messages, setMessages] = useState<
    Array<{
      id: string
      role: "user" | "assistant" | "system"
      content: string
      timestamp: Date
      sources?: Array<{
        title: string
        url: string
        snippet: string
      }>
      thinking?: string
      loading?: boolean
    }>
  >([
    {
      id: "msg-1",
      role: "system",
      content: `I'm your quantum-inspired AI assistant for IdeaForge. I can help with brainstorming, research, and development of your ${contextTitle} ${contextType}.`,
      timestamp: new Date(),
    },
    {
      id: "msg-2",
      role: "assistant",
      content: `Welcome to the AI Conversation feature! I'm here to help you with your ${contextType} "${contextTitle}". What would you like to discuss or explore today?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [thinkingProgress, setThinkingProgress] = useState(0)
  const [showSources, setShowSources] = useState<Record<string, boolean>>({})
  const [showThinking, setShowThinking] = useState<Record<string, boolean>>({})
  const [isWebSearching, setIsWebSearching] = useState(false)
  const [webSearchResults, setWebSearchResults] = useState<
    Array<{
      title: string
      url: string
      snippet: string
    }>
  >([])
  const [webSearchQuery, setWebSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("chat")
  const [settings, setSettings] = useState({
    webSearch: true,
    dataAccess: true,
    showThinking: true,
    citeSources: true,
    creativeMode: false,
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isThinking])

  // Simulate thinking progress
  useEffect(() => {
    if (isThinking) {
      const interval = setInterval(() => {
        setThinkingProgress((prev) => {
          const increment = Math.random() * 15
          return Math.min(prev + increment, 95) // Never quite reaches 100% until complete
        })
      }, 300)

      return () => clearInterval(interval)
    } else {
      setThinkingProgress(0)
    }
  }, [isThinking])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: `msg-${messages.length + 1}`,
      role: "user" as const,
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Focus back on input after sending
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)

    // Simulate AI thinking
    setIsThinking(true)

    // Simulate web search if enabled and query seems to need external information
    let sources: Array<{ title: string; url: string; snippet: string }> = []
    if (settings.webSearch && /what|how|why|when|latest|recent|news|trends|compare|versus|vs/i.test(input)) {
      await simulateWebSearch(input)
      sources = webSearchResults.slice(0, 3)
    }

    // Simulate AI response after delay
    setTimeout(
      () => {
        setIsThinking(false)

        const aiResponse = {
          id: `msg-${messages.length + 2}`,
          role: "assistant" as const,
          content: generateAIResponse(input, contextType, contextTitle),
          timestamp: new Date(),
          sources: sources.length > 0 ? sources : undefined,
          thinking: settings.showThinking ? generateAIThinking(input, contextType) : undefined,
        }

        setMessages((prev) => [...prev, aiResponse])
      },
      2000 + Math.random() * 2000,
    ) // Random delay between 2-4 seconds
  }

  const simulateWebSearch = async (query: string) => {
    setIsWebSearching(true)
    setWebSearchQuery(query)

    // Simulate web search delay
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000))

    // Generate fake search results based on query
    const results = [
      {
        title: `Latest Trends in ${query.includes("AI") ? "AI" : "Customer Insights"} Platforms`,
        url: "https://example.com/trends-ai-platforms",
        snippet: `The latest developments in ${
          query.includes("AI") ? "AI" : "customer insights"
        } platforms show a trend toward more integrated solutions that combine multiple data sources and provide actionable recommendations.`,
      },
      {
        title: `How to Build a Successful ${contextTitle}`,
        url: "https://example.com/building-ai-platforms",
        snippet: `Building a successful ${contextTitle.toLowerCase()} requires careful planning, the right technology stack, and a focus on user needs. This guide covers the essential steps.`,
      },
      {
        title: "Market Analysis: Customer Feedback Tools in 2023",
        url: "https://example.com/market-analysis-2023",
        snippet:
          "The market for customer feedback tools has grown by 35% in 2023, with AI-powered solutions leading the way. Companies are increasingly looking for integrated platforms that can analyze feedback from multiple channels.",
      },
      {
        title: "Case Study: Implementing AI for Customer Insights",
        url: "https://example.com/case-study-ai-customer-insights",
        snippet:
          "This case study examines how a mid-sized SaaS company implemented an AI-powered customer insights platform, resulting in a 40% increase in product improvement velocity and a 25% reduction in churn.",
      },
      {
        title: "Technical Challenges in Building AI Feedback Systems",
        url: "https://example.com/technical-challenges-ai-feedback",
        snippet:
          "This article explores the common technical challenges faced when building AI systems for analyzing customer feedback, including data normalization, model training, and scalability concerns.",
      },
    ]

    setWebSearchResults(results)
    setIsWebSearching(false)

    return results
  }

  const generateAIResponse = (query: string, context: string, contextTitle: string) => {
    // This is a simplified response generation - in a real app, this would call an actual AI model
    const responses = [
      `Based on my analysis, your ${context} "${contextTitle}" could benefit from focusing on real-time feedback processing capabilities. This would give you a competitive edge in the market, as most existing solutions process feedback in batches.`,

      `For your ${context}, I recommend implementing a multi-modal analysis approach that can handle text, audio, and visual feedback. This aligns with the trend toward more comprehensive customer experience analysis.`,

      `Looking at similar successful products in this space, a key differentiator could be providing actionable recommendations rather than just insights. Consider adding a recommendation engine that suggests specific product improvements based on the analyzed feedback.`,

      `To maximize the impact of your ${context}, consider implementing a prioritization framework that weighs customer feedback based on factors like customer segment, frequency of mention, and sentiment intensity. This would help product teams focus on the most impactful improvements.`,

      `One approach to consider for your ${context} is implementing a federated learning system that can analyze customer feedback while preserving privacy. This is becoming increasingly important with stricter data protection regulations.`,
    ]

    // Return a "relevant" response based on the query content
    if (query.toLowerCase().includes("market") || query.toLowerCase().includes("competitor")) {
      return "Based on current market research, there are several key competitors in this space including Qualtrics, Medallia, and newer AI-focused startups. Your platform could differentiate by focusing on real-time insights and more actionable recommendations, which our analysis shows is an underserved need in the market."
    }

    if (
      query.toLowerCase().includes("technical") ||
      query.toLowerCase().includes("architecture") ||
      query.toLowerCase().includes("stack")
    ) {
      return "For the technical architecture of your platform, I recommend considering a microservices approach with dedicated services for data ingestion, processing, analysis, and presentation. For the AI components, a combination of pre-trained models for common tasks (sentiment analysis, categorization) and custom models for your specific domain would provide the best balance of development speed and accuracy."
    }

    if (query.toLowerCase().includes("feature") || query.toLowerCase().includes("functionality")) {
      return "Key features to consider for your platform include: 1) Multi-channel data integration to collect feedback from various sources, 2) Advanced sentiment and intent analysis, 3) Trend identification across time periods, 4) Anomaly detection for sudden changes in feedback patterns, 5) Actionable recommendation engine, and 6) Customizable dashboards for different stakeholders. Based on market research, features 3 and 5 would be your strongest differentiators."
    }

    // Default to a random response for other queries
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const generateAIThinking = (query: string, context: string) => {
    return `
    Analyzing query in context of ${context}...
    
    Step 1: Identifying key concepts in the query
    - User is asking about ${
      query.includes("market")
        ? "market positioning"
        : query.includes("technical")
          ? "technical implementation"
          : "strategic approach"
    }
    - This relates to the ${context} development process
    
    Step 2: Retrieving relevant information
    - Accessing market data for similar products
    - Analyzing technical requirements for AI-powered platforms
    - Reviewing best practices for customer feedback systems
    
    Step 3: Synthesizing response
    - Combining market insights with technical feasibility
    - Prioritizing actionable recommendations
    - Ensuring alignment with user's specific context
    
    Step 4: Formulating response with appropriate detail level
    - Including specific examples and metrics where available
    - Structuring information for clarity
    - Balancing technical depth with accessibility
    `
  }

  const toggleSourcesVisibility = (messageId: string) => {
    setShowSources((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }))
  }

  const toggleThinkingVisibility = (messageId: string) => {
    setShowThinking((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    // You could add a toast notification here
  }

  const handleUseSearchResult = (result: { title: string; url: string; snippet: string }) => {
    setInput((prev) => `${prev}\n\nBased on "${result.title}": ${result.snippet}`)
    setActiveTab("chat")
    inputRef.current?.focus()
  }

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

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
          <MessageSquare className="h-6 w-6" />
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed ${isExpanded ? "inset-4" : "bottom-4 right-4 w-[400px]"} z-50 transition-all duration-300`}
    >
      <Card className="h-full shadow-lg border-0 flex flex-col bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
        <CardHeader className="px-4 py-2 flex flex-row items-center justify-between space-y-0 border-b">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/quantum-ai-assistant.png" alt="AI Assistant" />
              <AvatarFallback className="bg-primary/20 text-primary">AI</AvatarFallback>
            </Avatar>
            <CardTitle className="text-md font-medium">AI Assistant</CardTitle>
            <Badge variant="outline" className="ml-2 text-xs bg-primary/10 text-primary">
              {contextType.charAt(0).toUpperCase() + contextType.slice(1)} Context
            </Badge>
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
            <TabsTrigger value="web" className="data-[state=active]:bg-primary/10 rounded-md">
              <Globe className="h-4 w-4 mr-1" />
              Web Search
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-primary/10 rounded-md">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 flex flex-col p-0 m-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages
                  .filter((msg) => msg.role !== "system")
                  .map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>

                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSourcesVisibility(message.id)}
                              className={`text-xs h-6 px-2 ${
                                message.role === "user"
                                  ? "text-primary-foreground/80 hover:text-primary-foreground"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {showSources[message.id] ? (
                                <>
                                  <ChevronUp className="h-3 w-3 mr-1" />
                                  Hide sources
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-3 w-3 mr-1" />
                                  Show sources ({message.sources.length})
                                </>
                              )}
                            </Button>

                            {showSources[message.id] && (
                              <div className="mt-2 space-y-2 text-xs">
                                {message.sources.map((source, index) => (
                                  <div key={index} className="border-l-2 border-primary/30 pl-2">
                                    <div className="font-medium">{source.title}</div>
                                    <div className="mt-1 text-muted-foreground">{source.snippet}</div>
                                    <a
                                      href={source.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-1 flex items-center text-primary hover:underline"
                                    >
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      {source.url}
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {message.thinking && (
                          <div className="mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleThinkingVisibility(message.id)}
                              className={`text-xs h-6 px-2 ${
                                message.role === "user"
                                  ? "text-primary-foreground/80 hover:text-primary-foreground"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {showThinking[message.id] ? (
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

                            {showThinking[message.id] && (
                              <div className="mt-2 bg-background/50 rounded p-2 text-xs font-mono whitespace-pre-wrap text-muted-foreground">
                                {message.thinking}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-70">{formatTimestamp(message.timestamp)}</span>

                          {message.role === "assistant" && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleCopyMessage(message.content)}
                                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                                  >
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
                  ))}

                {isThinking && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-muted text-foreground">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                          <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                          <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                        </div>
                        <span className="text-sm text-muted-foreground">Thinking...</span>
                      </div>

                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Processing query</span>
                          <span className="text-muted-foreground">{Math.round(thinkingProgress)}%</span>
                        </div>
                        <Progress value={thinkingProgress} className="h-1" />
                      </div>

                      {settings.showThinking && (
                        <div className="mt-3 bg-background/50 rounded p-2 text-xs font-mono max-h-20 overflow-hidden relative">
                          <div className="whitespace-pre-wrap text-muted-foreground">
                            Analyzing query in context of {contextType}...
                            <br />
                            Retrieving relevant information...
                            <br />
                            Synthesizing response...
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t">
              <div className="flex items-end gap-2">
                <Textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask about your ${contextType}...`}
                  className="min-h-[60px] resize-none"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isThinking}
                  className="h-10 w-10 p-0 rounded-full"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Creative mode</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <Link className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add reference</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <Lightbulb className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Suggest prompts</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="text-xs text-muted-foreground">
                  {contextType.charAt(0).toUpperCase() + contextType.slice(1)} context: {contextTitle}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="web" className="flex-1 flex flex-col p-0 m-0">
            <div className="p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search the web..."
                    className="pl-9"
                    value={webSearchQuery}
                    onChange={(e) => setWebSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        simulateWebSearch(webSearchQuery)
                      }
                    }}
                  />
                </div>
                <Button
                  onClick={() => simulateWebSearch(webSearchQuery)}
                  disabled={!webSearchQuery.trim() || isWebSearching}
                >
                  Search
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              {isWebSearching ? (
                <div className="flex flex-col items-center justify-center h-full py-8">
                  <Loader className="h-8 w-8 text-primary animate-spin" />
                  <div className="mt-4 text-sm text-muted-foreground">Searching the web...</div>
                </div>
              ) : webSearchResults.length > 0 ? (
                <div className="space-y-4">
                  {webSearchResults.map((result, index) => (
                    <div key={index} className="border rounded-lg p-3 hover:border-primary/50 transition-colors">
                      <div className="font-medium">{result.title}</div>
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center mt-1"
                      >
                        <Globe className="h-3 w-3 mr-1" />
                        {result.url}
                      </a>
                      <div className="mt-2 text-sm text-muted-foreground">{result.snippet}</div>
                      <div className="mt-3 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUseSearchResult(result)}
                          className="h-7 text-xs"
                        >
                          Use in Chat
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-8">
                  <Globe className="h-12 w-12 text-muted-foreground" />
                  <div className="mt-4 text-sm text-muted-foreground">
                    Search the web to find information for your conversation
                  </div>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 p-4 m-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">AI Capabilities</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Web Search</Label>
                      <div className="text-xs text-muted-foreground">
                        Allow AI to search the web for up-to-date information
                      </div>
                    </div>
                    <Switch
                      checked={settings.webSearch}
                      onCheckedChange={(checked) => setSettings({ ...settings, webSearch: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Data Access</Label>
                      <div className="text-xs text-muted-foreground">
                        Allow AI to access your project data for context
                      </div>
                    </div>
                    <Switch
                      checked={settings.dataAccess}
                      onCheckedChange={(checked) => setSettings({ ...settings, dataAccess: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Show Thinking</Label>
                      <div className="text-xs text-muted-foreground">Show AI's reasoning process for transparency</div>
                    </div>
                    <Switch
                      checked={settings.showThinking}
                      onCheckedChange={(checked) => setSettings({ ...settings, showThinking: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Cite Sources</Label>
                      <div className="text-xs text-muted-foreground">
                        Include references for information from the web
                      </div>
                    </div>
                    <Switch
                      checked={settings.citeSources}
                      onCheckedChange={(checked) => setSettings({ ...settings, citeSources: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Creative Mode</Label>
                      <div className="text-xs text-muted-foreground">
                        Enable more creative and exploratory responses
                      </div>
                    </div>
                    <Switch
                      checked={settings.creativeMode}
                      onCheckedChange={(checked) => setSettings({ ...settings, creativeMode: checked })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Conversation</h3>
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start text-sm h-8">
                    <RefreshCw className="h-3.5 w-3.5 mr-2" />
                    Reset conversation
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-sm h-8">
                    <Copy className="h-3.5 w-3.5 mr-2" />
                    Export conversation
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">About</h3>
                <div className="text-xs text-muted-foreground">
                  <p>IdeaForge AI Assistant</p>
                  <p>Version 1.0.0</p>
                  <p className="mt-1">
                    Powered by quantum-inspired AI technology to help you develop and refine your ideas.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  )
}
