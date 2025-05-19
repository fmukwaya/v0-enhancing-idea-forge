"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Lightbulb,
  TrendingUp,
  Brain,
  Target,
  Layers,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Bookmark,
  Share2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EnhancedRecommendationsProps {
  ideaId?: string
  ideaTitle?: string
  ideaDescription?: string
  ideaCategories?: string[]
}

export function EnhancedRecommendations({
  ideaId = "idea-123",
  ideaTitle = "AI-Powered Customer Insights Platform",
  ideaDescription = "Create a platform that uses AI to analyze customer feedback across multiple channels and generate actionable insights for product teams.",
  ideaCategories = ["AI/ML", "Customer Experience", "Product Development"],
}: EnhancedRecommendationsProps) {
  const [activeTab, setActiveTab] = useState("strategic")
  const [expandedRecommendation, setExpandedRecommendation] = useState<string | null>(null)
  const [savedRecommendations, setSavedRecommendations] = useState<string[]>([])
  const [generatingInsights, setGeneratingInsights] = useState(false)
  const [insightProgress, setInsightProgress] = useState(0)

  // Simulated AI-generated recommendations
  const recommendations = {
    strategic: [
      {
        id: "rec-1",
        title: "Focus on Sentiment Analysis First",
        description:
          "Begin with sentiment analysis capabilities as they provide the most immediate value to product teams and have the highest implementation success rate.",
        impact: 92,
        effort: 65,
        timeframe: "Short-term",
        tags: ["Core Feature", "High ROI"],
        details:
          "Sentiment analysis provides a foundation for understanding customer emotions and can be implemented with existing pre-trained models. Our analysis of 50+ similar products shows that teams who started with sentiment analysis achieved 40% faster time-to-value.",
        relatedResources: [
          { title: "Sentiment Analysis Best Practices", url: "#" },
          { title: "Case Study: Sentiment Analysis Implementation", url: "#" },
        ],
      },
      {
        id: "rec-2",
        title: "Implement Cross-Channel Data Integration",
        description:
          "Design a flexible integration framework that can connect to multiple feedback channels through standardized APIs.",
        impact: 88,
        effort: 78,
        timeframe: "Medium-term",
        tags: ["Infrastructure", "Scalability"],
        details:
          "A unified data integration layer will allow you to normalize and standardize feedback from different sources. This approach has been shown to reduce development time for new channel integrations by up to 60% in similar systems.",
        relatedResources: [
          { title: "API Integration Patterns", url: "#" },
          { title: "Data Normalization Techniques", url: "#" },
        ],
      },
      {
        id: "rec-3",
        title: "Develop Insight Visualization Dashboard",
        description:
          "Create an intuitive dashboard that visualizes trends, patterns, and anomalies in customer feedback.",
        impact: 85,
        effort: 70,
        timeframe: "Medium-term",
        tags: ["UX/UI", "Analytics"],
        details:
          "Visual representations of insights significantly improve comprehension and action rates. Our analysis shows that teams using visual dashboards implement 35% more customer-driven improvements than those using text-based reports.",
        relatedResources: [
          { title: "Dashboard Design Principles", url: "#" },
          { title: "Data Visualization Best Practices", url: "#" },
        ],
      },
    ],
    technical: [
      {
        id: "rec-4",
        title: "Utilize Transformer-Based NLP Models",
        description:
          "Implement state-of-the-art transformer models like BERT or RoBERTa for natural language understanding tasks.",
        impact: 90,
        effort: 82,
        timeframe: "Medium-term",
        tags: ["AI/ML", "NLP"],
        details:
          "Transformer models have shown a 25-30% improvement in accuracy for sentiment analysis and intent classification compared to traditional approaches. Consider fine-tuning pre-trained models on your specific domain data for optimal results.",
        relatedResources: [
          { title: "Transformer Models Overview", url: "#" },
          { title: "Fine-tuning NLP Models", url: "#" },
        ],
      },
      {
        id: "rec-5",
        title: "Implement Real-time Processing Pipeline",
        description:
          "Build a streaming data pipeline using technologies like Kafka or Kinesis for real-time feedback processing.",
        impact: 85,
        effort: 75,
        timeframe: "Medium-term",
        tags: ["Infrastructure", "Performance"],
        details:
          "Real-time processing enables immediate insights and alerts, which can be critical for addressing urgent customer issues. A well-designed pipeline can handle thousands of feedback items per second with sub-second latency.",
        relatedResources: [
          { title: "Stream Processing Architectures", url: "#" },
          { title: "Real-time Analytics Implementation", url: "#" },
        ],
      },
      {
        id: "rec-6",
        title: "Adopt a Microservices Architecture",
        description:
          "Structure the platform as a collection of loosely coupled microservices to improve scalability and maintainability.",
        impact: 80,
        effort: 85,
        timeframe: "Long-term",
        tags: ["Architecture", "Scalability"],
        details:
          "Microservices allow different components of the system to scale independently based on demand. This approach also enables faster iteration on individual features without affecting the entire system.",
        relatedResources: [
          { title: "Microservices Design Patterns", url: "#" },
          { title: "Service Mesh Implementation", url: "#" },
        ],
      },
    ],
    market: [
      {
        id: "rec-7",
        title: "Target Product Management Teams First",
        description:
          "Focus initial marketing and sales efforts on product management teams in mid to large-sized SaaS companies.",
        impact: 88,
        effort: 60,
        timeframe: "Short-term",
        tags: ["Go-to-Market", "Target Audience"],
        details:
          "Product management teams in SaaS companies have shown the highest adoption rates for customer insight tools, with a 45% higher conversion rate than other potential user segments. They also typically have dedicated budgets for tools that improve product decisions.",
        relatedResources: [
          { title: "SaaS Product Management Landscape", url: "#" },
          { title: "Selling to Product Teams", url: "#" },
        ],
      },
      {
        id: "rec-8",
        title: "Develop Integration Partnerships",
        description:
          "Form strategic partnerships with popular customer feedback collection tools to create seamless integrations.",
        impact: 85,
        effort: 70,
        timeframe: "Medium-term",
        tags: ["Partnerships", "Ecosystem"],
        details:
          "Partnerships with established tools can provide immediate access to their customer base. Companies with similar partnership strategies have seen user acquisition costs decrease by up to 40% through these channels.",
        relatedResources: [
          { title: "Partnership Development Strategy", url: "#" },
          { title: "Integration Marketplace Success Stories", url: "#" },
        ],
      },
      {
        id: "rec-9",
        title: "Implement Tiered Pricing Model",
        description:
          "Create a pricing structure with free, team, and enterprise tiers to capture different market segments.",
        impact: 82,
        effort: 55,
        timeframe: "Short-term",
        tags: ["Pricing", "Business Model"],
        details:
          "A tiered approach allows for broader market penetration while maximizing revenue from enterprise customers. Analysis of similar B2B SaaS products shows that those with well-designed tiered pricing achieve 30% higher lifetime customer value.",
        relatedResources: [
          { title: "SaaS Pricing Strategies", url: "#" },
          { title: "Optimizing Conversion Between Tiers", url: "#" },
        ],
      },
    ],
  }

  // Simulate AI insight generation
  useEffect(() => {
    if (generatingInsights) {
      const interval = setInterval(() => {
        setInsightProgress((prev) => {
          const newProgress = prev + Math.random() * 10
          if (newProgress >= 100) {
            clearInterval(interval)
            setGeneratingInsights(false)
            return 100
          }
          return newProgress
        })
      }, 300)

      return () => clearInterval(interval)
    }
  }, [generatingInsights])

  const handleGenerateInsights = () => {
    setGeneratingInsights(true)
    setInsightProgress(0)
  }

  const toggleRecommendation = (id: string) => {
    setExpandedRecommendation(expandedRecommendation === id ? null : id)
  }

  const toggleSaveRecommendation = (id: string) => {
    setSavedRecommendations((prev) => (prev.includes(id) ? prev.filter((recId) => recId !== id) : [...prev, id]))
  }

  const getImpactColor = (impact: number) => {
    if (impact >= 90) return "text-green-500"
    if (impact >= 80) return "text-emerald-500"
    if (impact >= 70) return "text-blue-500"
    return "text-yellow-500"
  }

  const getEffortColor = (effort: number) => {
    if (effort >= 80) return "text-red-500"
    if (effort >= 70) return "text-orange-500"
    if (effort >= 60) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span>Enhanced AI Recommendations</span>
            </CardTitle>
            <CardDescription className="mt-1">
              Quantum-inspired insights and strategic recommendations for your idea
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary">
              <Lightbulb className="h-3 w-3 mr-1" />
              {ideaCategories.join(", ")}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {generatingInsights ? (
          <div className="space-y-4 py-8">
            <div className="flex justify-center">
              <div className="relative h-24 w-24">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <svg className="h-full w-full animate-spin-slow" viewBox="0 0 100 100">
                  <circle
                    className="text-primary/20 stroke-current"
                    strokeWidth="3"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-primary stroke-current"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * insightProgress) / 100}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
            </div>

            <div className="text-center">
              <div className="text-lg font-medium">Generating Enhanced Insights</div>
              <div className="text-sm text-muted-foreground mt-1">
                Analyzing market trends, technical feasibility, and strategic alignment
              </div>
            </div>

            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{Math.round(insightProgress)}%</span>
              </div>
              <Progress value={insightProgress} className="h-2" />

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className={`h-2 w-2 rounded-full ${insightProgress > 30 ? "bg-green-500" : "bg-muted"}`} />
                  <span className={insightProgress > 30 ? "" : "text-muted-foreground"}>Analyzing idea context</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className={`h-2 w-2 rounded-full ${insightProgress > 50 ? "bg-green-500" : "bg-muted"}`} />
                  <span className={insightProgress > 50 ? "" : "text-muted-foreground"}>
                    Evaluating market conditions
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className={`h-2 w-2 rounded-full ${insightProgress > 70 ? "bg-green-500" : "bg-muted"}`} />
                  <span className={insightProgress > 70 ? "" : "text-muted-foreground"}>
                    Generating technical recommendations
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className={`h-2 w-2 rounded-full ${insightProgress > 90 ? "bg-green-500" : "bg-muted"}`} />
                  <span className={insightProgress > 90 ? "" : "text-muted-foreground"}>
                    Finalizing strategic insights
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="strategic" className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span>Strategic</span>
                </TabsTrigger>
                <TabsTrigger value="technical" className="flex items-center gap-1">
                  <Layers className="h-4 w-4" />
                  <span>Technical</span>
                </TabsTrigger>
                <TabsTrigger value="market" className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>Market</span>
                </TabsTrigger>
              </TabsList>

              {Object.entries(recommendations).map(([category, recs]) => (
                <TabsContent key={category} value={category} className="mt-4">
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-4">
                      {recs.map((recommendation) => (
                        <Card
                          key={recommendation.id}
                          className={`border ${
                            expandedRecommendation === recommendation.id
                              ? "border-primary/30 bg-primary/5"
                              : "border-border"
                          } transition-all duration-200`}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-lg font-medium">{recommendation.title}</CardTitle>
                                <CardDescription className="mt-1">{recommendation.description}</CardDescription>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleRecommendation(recommendation.id)}
                                className="h-8 w-8 p-0"
                              >
                                {expandedRecommendation === recommendation.id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-2">
                              {recommendation.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              <Badge variant="outline" className="text-xs">
                                {recommendation.timeframe}
                              </Badge>
                            </div>
                          </CardHeader>

                          <CardContent className="pb-2">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">Impact Potential</div>
                                <div className="flex items-center gap-2">
                                  <Progress value={recommendation.impact} className="h-2 flex-1" />
                                  <span className={`text-sm font-medium ${getImpactColor(recommendation.impact)}`}>
                                    {recommendation.impact}%
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">Implementation Effort</div>
                                <div className="flex items-center gap-2">
                                  <Progress value={recommendation.effort} className="h-2 flex-1" />
                                  <span className={`text-sm font-medium ${getEffortColor(recommendation.effort)}`}>
                                    {recommendation.effort}%
                                  </span>
                                </div>
                              </div>
                            </div>

                            <AnimatePresence>
                              {expandedRecommendation === recommendation.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="mt-4 space-y-4 overflow-hidden"
                                >
                                  <div>
                                    <div className="text-sm font-medium mb-1">Detailed Analysis</div>
                                    <div className="text-sm text-muted-foreground">{recommendation.details}</div>
                                  </div>

                                  {recommendation.relatedResources.length > 0 && (
                                    <div>
                                      <div className="text-sm font-medium mb-1">Related Resources</div>
                                      <div className="space-y-1">
                                        {recommendation.relatedResources.map((resource, index) => (
                                          <div key={index} className="flex items-center gap-1">
                                            <ExternalLink className="h-3 w-3 text-primary" />
                                            <a href={resource.url} className="text-sm text-primary hover:underline">
                                              {resource.title}
                                            </a>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </CardContent>

                          <CardFooter>
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleSaveRecommendation(recommendation.id)}
                                        className={`h-8 w-8 p-0 ${
                                          savedRecommendations.includes(recommendation.id) ? "text-primary" : ""
                                        }`}
                                      >
                                        <Bookmark className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      {savedRecommendations.includes(recommendation.id)
                                        ? "Remove from saved"
                                        : "Save recommendation"}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Share2 className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Share recommendation</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>

                              <Button variant="outline" size="sm" className="h-8 text-xs">
                                Apply to Idea
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>

            <div className="flex justify-center">
              <Button
                onClick={handleGenerateInsights}
                className="bg-gradient-to-r from-primary to-primary/80 flex items-center gap-1"
              >
                <Sparkles className="h-4 w-4" />
                Generate Fresh Insights
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
