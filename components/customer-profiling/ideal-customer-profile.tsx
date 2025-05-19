"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Users,
  Target,
  BarChart3,
  Building2,
  Globe,
  Briefcase,
  UserCheck,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Plus,
  Check,
  X,
  Edit3,
  Save,
  FileText,
  Zap,
  Brain,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Types
interface ICPAttribute {
  id: string
  name: string
  value: string | number | boolean | string[]
  importance: number
  type: "text" | "number" | "boolean" | "select" | "multi-select" | "range"
  options?: string[]
  min?: number
  max?: number
  unit?: string
}

interface ICPCategory {
  id: string
  name: string
  icon: React.ReactNode
  attributes: ICPAttribute[]
  importance: number
}

interface ICP {
  id: string
  name: string
  description: string
  createdAt: number
  updatedAt: number
  categories: ICPCategory[]
  score: number
  matchedIdeas: string[]
  matchedProjects: string[]
  isActive: boolean
}

interface ICPMatchScore {
  id: string
  name: string
  type: "idea" | "project"
  score: number
  strengths: string[]
  gaps: string[]
}

// Sample data
const initialICP: ICP = {
  id: "icp-1",
  name: "Enterprise SaaS Decision Makers",
  description:
    "Technology leaders in enterprise companies looking for advanced SaaS solutions to improve operational efficiency and data insights.",
  createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  categories: [
    {
      id: "cat-1",
      name: "Demographics",
      icon: <Users className="h-5 w-5" />,
      importance: 80,
      attributes: [
        {
          id: "attr-1",
          name: "Company Size",
          value: ["500-1000", "1000-5000", "5000+"],
          importance: 90,
          type: "multi-select",
          options: ["1-10", "10-50", "50-200", "200-500", "500-1000", "1000-5000", "5000+"],
        },
        {
          id: "attr-2",
          name: "Industry",
          value: ["Technology", "Finance", "Healthcare", "Manufacturing"],
          importance: 85,
          type: "multi-select",
          options: [
            "Technology",
            "Finance",
            "Healthcare",
            "Manufacturing",
            "Retail",
            "Education",
            "Government",
            "Other",
          ],
        },
        {
          id: "attr-3",
          name: "Geographic Location",
          value: ["North America", "Europe"],
          importance: 70,
          type: "multi-select",
          options: ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East", "Africa"],
        },
      ],
    },
    {
      id: "cat-2",
      name: "Firmographics",
      icon: <Building2 className="h-5 w-5" />,
      importance: 85,
      attributes: [
        {
          id: "attr-4",
          name: "Annual Revenue",
          value: [100000000, 5000000000],
          importance: 80,
          type: "range",
          min: 1000000,
          max: 10000000000,
          unit: "$",
        },
        {
          id: "attr-5",
          name: "Growth Rate",
          value: [10, 30],
          importance: 75,
          type: "range",
          min: 0,
          max: 100,
          unit: "%",
        },
        {
          id: "attr-6",
          name: "Technology Maturity",
          value: "High",
          importance: 90,
          type: "select",
          options: ["Low", "Medium", "High", "Very High"],
        },
      ],
    },
    {
      id: "cat-3",
      name: "Decision Criteria",
      icon: <Target className="h-5 w-5" />,
      importance: 95,
      attributes: [
        {
          id: "attr-7",
          name: "Budget Range",
          value: [50000, 500000],
          importance: 85,
          type: "range",
          min: 10000,
          max: 1000000,
          unit: "$",
        },
        {
          id: "attr-8",
          name: "Decision Timeline",
          value: "3-6 months",
          importance: 80,
          type: "select",
          options: ["< 1 month", "1-3 months", "3-6 months", "6-12 months", "> 12 months"],
        },
        {
          id: "attr-9",
          name: "Security Requirements",
          value: "Very High",
          importance: 95,
          type: "select",
          options: ["Low", "Medium", "High", "Very High"],
        },
      ],
    },
    {
      id: "cat-4",
      name: "Pain Points",
      icon: <BarChart3 className="h-5 w-5" />,
      importance: 90,
      attributes: [
        {
          id: "attr-10",
          name: "Data Integration Challenges",
          value: true,
          importance: 90,
          type: "boolean",
        },
        {
          id: "attr-11",
          name: "Legacy System Limitations",
          value: true,
          importance: 85,
          type: "boolean",
        },
        {
          id: "attr-12",
          name: "Scalability Concerns",
          value: true,
          importance: 80,
          type: "boolean",
        },
      ],
    },
    {
      id: "cat-5",
      name: "Buying Process",
      icon: <Briefcase className="h-5 w-5" />,
      importance: 75,
      attributes: [
        {
          id: "attr-13",
          name: "Decision Makers",
          value: ["CTO", "CIO", "IT Director"],
          importance: 90,
          type: "multi-select",
          options: ["CEO", "CTO", "CIO", "CFO", "IT Director", "VP of Engineering", "Product Manager", "Other"],
        },
        {
          id: "attr-14",
          name: "Evaluation Criteria",
          value: ["Security", "Scalability", "Integration", "Cost", "Support"],
          importance: 85,
          type: "multi-select",
          options: [
            "Security",
            "Scalability",
            "Integration",
            "Cost",
            "Support",
            "Ease of Use",
            "Features",
            "Performance",
          ],
        },
        {
          id: "attr-15",
          name: "Procurement Process",
          value: "RFP",
          importance: 70,
          type: "select",
          options: ["Direct Purchase", "RFP", "Tender", "Negotiated Contract", "Other"],
        },
      ],
    },
  ],
  score: 87,
  matchedIdeas: ["idea-1", "idea-2", "idea-4"],
  matchedProjects: ["project-2"],
  isActive: true,
}

// Sample match scores
const sampleMatchScores: ICPMatchScore[] = [
  {
    id: "idea-1",
    name: "Quantum Interface Redesign",
    type: "idea",
    score: 92,
    strengths: ["Technology focus", "Enterprise scale", "Addresses legacy limitations"],
    gaps: ["Budget may be too high for some targets"],
  },
  {
    id: "idea-2",
    name: "AI-Powered Customer Insights",
    type: "idea",
    score: 88,
    strengths: ["Solves data integration challenges", "Appeals to target decision makers"],
    gaps: ["May require longer implementation than preferred"],
  },
  {
    id: "idea-4",
    name: "Quantum-Inspired Optimization Algorithm",
    type: "idea",
    score: 85,
    strengths: ["Addresses scalability concerns", "High technology maturity fit"],
    gaps: ["Narrow industry appeal within target segments"],
  },
  {
    id: "project-2",
    name: "Enterprise Data Integration Platform",
    type: "project",
    score: 94,
    strengths: ["Perfect match for pain points", "Ideal budget range", "Target decision maker alignment"],
    gaps: ["Geographic coverage limitations"],
  },
]

// Helper function to format currency
function formatCurrency(value: number): string {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`
  } else if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`
  } else {
    return `$${value}`
  }
}

// Helper function to get attribute display value
function getAttributeDisplayValue(attribute: ICPAttribute): string {
  switch (attribute.type) {
    case "boolean":
      return attribute.value ? "Yes" : "No"
    case "range":
      if (Array.isArray(attribute.value) && attribute.value.length === 2) {
        if (attribute.unit === "$") {
          return `${formatCurrency(attribute.value[0])} - ${formatCurrency(attribute.value[1])}`
        } else {
          return `${attribute.value[0]}${attribute.unit || ""} - ${attribute.value[1]}${attribute.unit || ""}`
        }
      }
      return String(attribute.value)
    case "multi-select":
      if (Array.isArray(attribute.value)) {
        return attribute.value.join(", ")
      }
      return String(attribute.value)
    default:
      return String(attribute.value)
  }
}

// Main component
export function IdealCustomerProfile() {
  const [icp, setIcp] = useState<ICP>(initialICP)
  const [activeTab, setActiveTab] = useState("profile")
  const [editMode, setEditMode] = useState(false)
  const [matchScores, setMatchScores] = useState<ICPMatchScore[]>(sampleMatchScores)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showAIInsights, setShowAIInsights] = useState(false)

  // Calculate overall ICP score
  const calculateOverallScore = () => {
    let totalImportance = 0
    let weightedScore = 0

    icp.categories.forEach((category) => {
      totalImportance += category.importance
      weightedScore += category.importance * calculateCategoryScore(category)
    })

    return totalImportance > 0 ? Math.round(weightedScore / totalImportance) : 0
  }

  // Calculate category score
  const calculateCategoryScore = (category: ICPCategory) => {
    // This would be more sophisticated in a real app
    // For now, we'll use the completeness of attributes as a proxy
    const filledAttributes = category.attributes.filter((attr) => {
      if (attr.type === "boolean") return true
      if (Array.isArray(attr.value)) return attr.value.length > 0
      return attr.value !== undefined && attr.value !== null && attr.value !== ""
    }).length

    return (filledAttributes / category.attributes.length) * 100
  }

  // Update ICP when attributes change
  useEffect(() => {
    if (editMode) {
      const updatedScore = calculateOverallScore()
      setIcp((prev) => ({
        ...prev,
        score: updatedScore,
        updatedAt: Date.now(),
      }))
    }
  }, [icp.categories, editMode])

  // Handle attribute change
  const handleAttributeChange = (categoryId: string, attributeId: string, value: any) => {
    setIcp((prev) => {
      const updatedCategories = prev.categories.map((category) => {
        if (category.id === categoryId) {
          const updatedAttributes = category.attributes.map((attr) => {
            if (attr.id === attributeId) {
              return { ...attr, value }
            }
            return attr
          })
          return { ...category, attributes: updatedAttributes }
        }
        return category
      })
      return { ...prev, categories: updatedCategories }
    })
  }

  // Handle importance change
  const handleImportanceChange = (categoryId: string, attributeId: string, importance: number) => {
    setIcp((prev) => {
      const updatedCategories = prev.categories.map((category) => {
        if (category.id === categoryId) {
          const updatedAttributes = category.attributes.map((attr) => {
            if (attr.id === attributeId) {
              return { ...attr, importance }
            }
            return attr
          })
          return { ...category, attributes: updatedAttributes }
        }
        return category
      })
      return { ...prev, categories: updatedCategories }
    })
  }

  // Handle category importance change
  const handleCategoryImportanceChange = (categoryId: string, importance: number) => {
    setIcp((prev) => {
      const updatedCategories = prev.categories.map((category) => {
        if (category.id === categoryId) {
          return { ...category, importance }
        }
        return category
      })
      return { ...prev, categories: updatedCategories }
    })
  }

  // Analyze matches
  const analyzeMatches = () => {
    setIsAnalyzing(true)

    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false)
      // In a real app, this would call an API to analyze matches
      // For now, we'll just use the sample data
      setActiveTab("matches")
    }, 2000)
  }

  // Generate AI insights
  const generateAIInsights = () => {
    setShowAIInsights(true)
  }

  // Render attribute editor based on type
  const renderAttributeEditor = (category: ICPCategory, attribute: ICPAttribute) => {
    switch (attribute.type) {
      case "text":
        return (
          <Input
            value={attribute.value as string}
            onChange={(e) => handleAttributeChange(category.id, attribute.id, e.target.value)}
            className="w-full"
          />
        )
      case "number":
        return (
          <Input
            type="number"
            value={attribute.value as number}
            onChange={(e) => handleAttributeChange(category.id, attribute.id, Number.parseFloat(e.target.value))}
            className="w-full"
          />
        )
      case "boolean":
        return (
          <Switch
            checked={attribute.value as boolean}
            onCheckedChange={(checked) => handleAttributeChange(category.id, attribute.id, checked)}
          />
        )
      case "select":
        return (
          <Select
            value={attribute.value as string}
            onValueChange={(value) => handleAttributeChange(category.id, attribute.id, value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {attribute.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "multi-select":
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {(attribute.value as string[]).map((value) => (
                <Badge key={value} className="flex items-center gap-1 px-3 py-1">
                  {value}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newValues = (attribute.value as string[]).filter((v) => v !== value)
                      handleAttributeChange(category.id, attribute.id, newValues)
                    }}
                    className="h-4 w-4 p-0 ml-1"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </Badge>
              ))}
            </div>
            <Select
              onValueChange={(value) => {
                if (!(attribute.value as string[]).includes(value)) {
                  handleAttributeChange(category.id, attribute.id, [...(attribute.value as string[]), value])
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Add option" />
              </SelectTrigger>
              <SelectContent>
                {attribute.options
                  ?.filter((option) => !(attribute.value as string[]).includes(option))
                  .map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )
      case "range":
        if (Array.isArray(attribute.value) && attribute.value.length === 2) {
          return (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-medium text-sm">
                  {attribute.unit === "$"
                    ? formatCurrency(attribute.value[0])
                    : `${attribute.value[0]}${attribute.unit || ""}`}
                </div>
                <div className="font-medium text-sm">
                  {attribute.unit === "$"
                    ? formatCurrency(attribute.value[1])
                    : `${attribute.value[1]}${attribute.unit || ""}`}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min={attribute.min}
                  max={attribute.value[1]}
                  value={attribute.value[0]}
                  onChange={(e) => {
                    const newValue = Number.parseFloat(e.target.value)
                    if (!isNaN(newValue) && newValue <= attribute.value[1]) {
                      handleAttributeChange(category.id, attribute.id, [newValue, attribute.value[1]])
                    }
                  }}
                  className="w-full"
                />
                <span>to</span>
                <Input
                  type="number"
                  min={attribute.value[0]}
                  max={attribute.max}
                  value={attribute.value[1]}
                  onChange={(e) => {
                    const newValue = Number.parseFloat(e.target.value)
                    if (!isNaN(newValue) && newValue >= attribute.value[0]) {
                      handleAttributeChange(category.id, attribute.id, [attribute.value[0], newValue])
                    }
                  }}
                  className="w-full"
                />
              </div>
            </div>
          )
        }
        return null
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-quantum tracking-tight flex items-center gap-2">
            <Target className="h-7 w-7 text-quantum-600" />
            Ideal Customer Profile
          </h1>
          <p className="text-muted-foreground">
            Define, analyze, and match your ideal customer profile with ideas and projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!editMode ? (
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setEditMode(true)}>
              <Edit3 className="h-4 w-4" />
              <span>Edit Profile</span>
            </Button>
          ) : (
            <Button
              className="flex items-center gap-2 bg-quantum-600 hover:bg-quantum-700"
              onClick={() => setEditMode(false)}
            >
              <Save className="h-4 w-4" />
              <span>Save Profile</span>
            </Button>
          )}
          <Button
            variant={activeTab === "matches" ? "default" : "outline"}
            className="flex items-center gap-2"
            onClick={analyzeMatches}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                <span>Analyze Matches</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-quantum-100/50 dark:bg-quantum-800/50">
          <TabsTrigger value="profile" className="flex-1 flex items-center gap-1">
            <UserCheck className="h-4 w-4" />
            <span>ICP Definition</span>
          </TabsTrigger>
          <TabsTrigger value="matches" className="flex-1 flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span>Idea & Project Matches</span>
            <Badge variant="outline" className="ml-1 bg-quantum-50 dark:bg-quantum-900">
              {matchScores.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex-1 flex items-center gap-1">
            <Brain className="h-4 w-4" />
            <span>AI Insights</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    {editMode ? (
                      <Input
                        value={icp.name}
                        onChange={(e) => setIcp({ ...icp, name: e.target.value })}
                        className="text-2xl font-bold h-auto py-1"
                      />
                    ) : (
                      icp.name
                    )}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {editMode ? (
                      <Textarea
                        value={icp.description}
                        onChange={(e) => setIcp({ ...icp, description: e.target.value })}
                        className="mt-1"
                        rows={3}
                      />
                    ) : (
                      icp.description
                    )}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Profile Score:</span>
                    <Badge className="text-lg px-3 py-1 bg-quantum-600 text-white">{icp.score}%</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Last updated: {new Date(icp.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Profile Completeness</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Overall</span>
                        <span className="font-medium">{icp.score}%</span>
                      </div>
                      <Progress value={icp.score} className="h-2" />

                      {icp.categories.map((category) => (
                        <div key={category.id} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="flex items-center gap-1">
                              {category.icon}
                              <span>{category.name}</span>
                            </span>
                            <span>{calculateCategoryScore(category).toFixed(0)}%</span>
                          </div>
                          <Progress value={calculateCategoryScore(category)} className="h-1" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Key Attributes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {icp.categories.flatMap((category) =>
                          category.attributes
                            .filter((attr) => attr.importance >= 85)
                            .map((attr) => (
                              <div key={attr.id} className="flex justify-between items-center">
                                <div className="text-sm font-medium">{attr.name}</div>
                                <Badge variant="outline" className="font-mono">
                                  {getAttributeDisplayValue(attr)}
                                </Badge>
                              </div>
                            )),
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Match Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="text-sm">Ideas</div>
                          <Badge variant="outline">{icp.matchedIdeas.length} matches</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm">Projects</div>
                          <Badge variant="outline">{icp.matchedProjects.length} matches</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm">Best Match</div>
                          <Badge className="bg-quantum-600 text-white">
                            {matchScores.length > 0 ? `${Math.max(...matchScores.map((m) => m.score))}%` : "N/A"}
                          </Badge>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full mt-2" onClick={analyzeMatches} disabled={isAnalyzing}>
                        {isAnalyzing ? (
                          <>
                            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            <span>Analyze Matches</span>
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Profile Categories</h3>

                  <Accordion
                    type="single"
                    collapsible
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                    className="w-full"
                  >
                    {icp.categories.map((category) => (
                      <AccordionItem
                        key={category.id}
                        value={category.id}
                        className="border rounded-lg mb-4 overflow-hidden"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 [&[data-state=open]]:bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-quantum-100 dark:bg-quantum-800">{category.icon}</div>
                            <div>
                              <div className="font-medium text-left">{category.name}</div>
                              <div className="text-sm text-muted-foreground text-left">
                                {category.attributes.length} attributes • Importance: {category.importance}%
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4 pt-2">
                            {editMode && (
                              <div className="flex items-center gap-2">
                                <Label className="flex-shrink-0">Category Importance:</Label>
                                <div className="flex-1">
                                  <Slider
                                    value={[category.importance]}
                                    min={1}
                                    max={100}
                                    step={1}
                                    onValueChange={(values) => handleCategoryImportanceChange(category.id, values[0])}
                                  />
                                </div>
                                <span className="w-10 text-right">{category.importance}%</span>
                              </div>
                            )}

                            <div className="space-y-4">
                              {category.attributes.map((attribute) => (
                                <div key={attribute.id} className="border rounded-md p-3 bg-background">
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                    <Label className="font-medium">{attribute.name}</Label>
                                    {editMode && (
                                      <div className="flex items-center gap-2">
                                        <Label className="text-sm text-muted-foreground">Importance:</Label>
                                        <div className="w-32">
                                          <Slider
                                            value={[attribute.importance]}
                                            min={1}
                                            max={100}
                                            step={1}
                                            onValueChange={(values) =>
                                              handleImportanceChange(category.id, attribute.id, values[0])
                                            }
                                          />
                                        </div>
                                        <span className="w-8 text-right text-sm">{attribute.importance}%</span>
                                      </div>
                                    )}
                                  </div>

                                  {editMode ? (
                                    renderAttributeEditor(category, attribute)
                                  ) : (
                                    <div className="text-sm">{getAttributeDisplayValue(attribute)}</div>
                                  )}
                                </div>
                              ))}
                            </div>

                            {editMode && (
                              <Button variant="outline" className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Attribute
                              </Button>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  {editMode && (
                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Category
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Created: {new Date(icp.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Active:</Label>
                <Switch
                  checked={icp.isActive}
                  onCheckedChange={(checked) => setIcp({ ...icp, isActive: checked })}
                  disabled={!editMode}
                />
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="matches" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-quantum-600" />
                    Match Analysis
                  </CardTitle>
                  <CardDescription>Ideas and projects that match your ideal customer profile</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {matchScores.map((match) => (
                      <Card key={match.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="p-4 md:w-1/4 bg-muted/30 flex flex-col justify-center items-center">
                            <div className="text-4xl font-bold text-quantum-600">{match.score}%</div>
                            <div className="text-sm text-muted-foreground">Match Score</div>
                            <Badge className="mt-2" variant={match.type === "idea" ? "outline" : "default"}>
                              {match.type === "idea" ? (
                                <Lightbulb className="h-3 w-3 mr-1" />
                              ) : (
                                <Briefcase className="h-3 w-3 mr-1" />
                              )}
                              {match.type === "idea" ? "Idea" : "Project"}
                            </Badge>
                          </div>
                          <div className="p-4 md:w-3/4">
                            <h3 className="text-lg font-medium">{match.name}</h3>

                            <div className="mt-3 space-y-3">
                              <div>
                                <h4 className="text-sm font-medium flex items-center gap-1">
                                  <Check className="h-4 w-4 text-green-500" />
                                  Strengths
                                </h4>
                                <ul className="mt-1 space-y-1">
                                  {match.strengths.map((strength, index) => (
                                    <li key={index} className="text-sm flex items-start gap-2">
                                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                                      {strength}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="text-sm font-medium flex items-center gap-1">
                                  <X className="h-4 w-4 text-red-500" />
                                  Gaps
                                </h4>
                                <ul className="mt-1 space-y-1">
                                  {match.gaps.map((gap, index) => (
                                    <li key={index} className="text-sm flex items-start gap-2">
                                      <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                                      {gap}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="flex justify-end mt-4">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-quantum-50 dark:bg-quantum-900/50 sticky top-4">
                <CardHeader>
                  <CardTitle className="text-lg">Match Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium">Match Distribution</div>
                      <div className="mt-2 h-40 flex items-end gap-2">
                        {[
                          {
                            label: "90-100%",
                            count: matchScores.filter((m) => m.score >= 90).length,
                            color: "bg-green-500",
                          },
                          {
                            label: "80-89%",
                            count: matchScores.filter((m) => m.score >= 80 && m.score < 90).length,
                            color: "bg-green-300",
                          },
                          {
                            label: "70-79%",
                            count: matchScores.filter((m) => m.score >= 70 && m.score < 80).length,
                            color: "bg-yellow-400",
                          },
                          {
                            label: "60-69%",
                            count: matchScores.filter((m) => m.score >= 60 && m.score < 70).length,
                            color: "bg-orange-400",
                          },
                          { label: "<60%", count: matchScores.filter((m) => m.score < 60).length, color: "bg-red-400" },
                        ].map((item) => (
                          <div key={item.label} className="flex-1 flex flex-col items-center">
                            <div className="text-xs mb-1">{item.count}</div>
                            <div
                              className={`w-full ${item.color} rounded-t-sm`}
                              style={{ height: `${item.count > 0 ? (item.count * 30) + 20 : 10}px` }}
                            />
                            <div className="text-xs mt-1 text-center">{item.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium">Top Matching Attributes</div>
                      <div className="mt-2 space-y-2">
                        {[
                          { name: "Company Size", score: 95 },
                          { name: "Technology Maturity", score: 92 },
                          { name: "Security Requirements", score: 90 },
                          { name: "Decision Makers", score: 88 },
                        ].map((attr) => (
                          <div key={attr.name} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{attr.name}</span>
                              <span>{attr.score}%</span>
                            </div>
                            <Progress value={attr.score} className="h-1" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium">Improvement Opportunities</div>
                      <div className="mt-2 space-y-2">
                        <div className="text-xs text-muted-foreground">
                          Refine these attributes to improve match quality:
                        </div>
                        <ul className="space-y-1">
                          {["Geographic Location", "Procurement Process", "Decision Timeline"].map((item) => (
                            <li key={item} className="text-sm flex items-start gap-2">
                              <ArrowRight className="h-3 w-3 text-quantum-600 mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-quantum-600 hover:bg-quantum-700" onClick={generateAIInsights}>
                    <Brain className="h-4 w-4 mr-2" />
                    Generate AI Insights
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-quantum-600" />
                Quantum AI Insights
              </CardTitle>
              <CardDescription>Advanced analysis and recommendations for your ideal customer profile</CardDescription>
            </CardHeader>
            <CardContent>
              {!showAIInsights ? (
                <div className="text-center py-12">
                  <Brain className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Generate AI Insights</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                    Our quantum-powered AI can analyze your ICP and provide detailed insights, recommendations, and
                    market intelligence.
                  </p>
                  <Button className="mt-4 bg-quantum-600 hover:bg-quantum-700" onClick={generateAIInsights}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Insights
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 border rounded-lg bg-quantum-50 dark:bg-quantum-900/50">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-quantum-600" />
                      Executive Summary
                    </h3>
                    <p className="mt-2 text-sm">
                      Your ICP is well-defined and targets enterprise technology decision-makers with specific pain
                      points around data integration and legacy systems. The profile shows strong alignment with 4 of
                      your current ideas and projects, particularly in addressing technical challenges faced by large
                      organizations.
                    </p>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-3 bg-background rounded-md">
                        <div className="text-sm font-medium">Market Size</div>
                        <div className="text-2xl font-bold text-quantum-600 mt-1">$8.7B</div>
                        <div className="text-xs text-muted-foreground">Estimated TAM</div>
                      </div>
                      <div className="p-3 bg-background rounded-md">
                        <div className="text-sm font-medium">Growth Rate</div>
                        <div className="text-2xl font-bold text-quantum-600 mt-1">14.3%</div>
                        <div className="text-xs text-muted-foreground">Annual CAGR</div>
                      </div>
                      <div className="p-3 bg-background rounded-md">
                        <div className="text-sm font-medium">Competitive Intensity</div>
                        <div className="text-2xl font-bold text-quantum-600 mt-1">Medium</div>
                        <div className="text-xs text-muted-foreground">7.4/10 score</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Market Trends Analysis</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-quantum-600 mt-0.5" />
                            <div>
                              <div className="font-medium text-sm">Increasing Focus on Data Security</div>
                              <p className="text-xs text-muted-foreground">
                                Your ICP's high security requirements align with market trends showing 78% of
                                enterprises prioritizing security in purchasing decisions.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-quantum-600 mt-0.5" />
                            <div>
                              <div className="font-medium text-sm">Legacy System Modernization</div>
                              <p className="text-xs text-muted-foreground">
                                63% of enterprises are actively seeking solutions to modernize legacy systems, matching
                                your ICP's pain points.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-quantum-600 mt-0.5" />
                            <div>
                              <div className="font-medium text-sm">Shift to AI-Powered Analytics</div>
                              <p className="text-xs text-muted-foreground">
                                Market research shows 42% YoY growth in AI analytics adoption among your target
                                segments.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Competitive Landscape</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium">Major Competitors</div>
                            <Badge variant="outline">12 identified</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {["TechCorp Solutions", "DataSphere", "Quantum Analytics", "Legacy Modernizers"].map(
                              (comp) => (
                                <div key={comp} className="text-xs flex items-center gap-1">
                                  <div className="h-1.5 w-1.5 rounded-full bg-quantum-600" />
                                  {comp}
                                </div>
                              ),
                            )}
                          </div>

                          <div className="mt-3 text-sm font-medium">Competitive Positioning</div>
                          <div className="h-32 border rounded-md p-2 relative">
                            {/* Simple competitive positioning chart */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-xs text-muted-foreground">Interactive chart in full version</div>
                            </div>
                            <div className="absolute top-2 left-2 text-xs">High Value</div>
                            <div className="absolute bottom-2 left-2 text-xs">Low Value</div>
                            <div className="absolute top-2 right-2 text-xs">High Price</div>
                            <div className="absolute bottom-2 right-2 text-xs">Low Price</div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <div className="h-4 w-4 rounded-full bg-quantum-600 animate-quantum-pulse" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">ICP Refinement Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-quantum-100 dark:bg-quantum-800 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-medium">1</span>
                            </div>
                            <div>
                              <div className="font-medium text-sm">Narrow Geographic Focus</div>
                              <p className="text-xs text-muted-foreground">
                                Consider focusing on North America initially, where 72% of your best matches are
                                located.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-quantum-100 dark:bg-quantum-800 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-medium">2</span>
                            </div>
                            <div>
                              <div className="font-medium text-sm">Add Regulatory Compliance Needs</div>
                              <p className="text-xs text-muted-foreground">
                                Include specific regulatory requirements (GDPR, HIPAA, SOC2) as attributes to better
                                target compliance-driven decisions.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-quantum-100 dark:bg-quantum-800 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-medium">3</span>
                            </div>
                            <div>
                              <div className="font-medium text-sm">Refine Decision Timeline</div>
                              <p className="text-xs text-muted-foreground">
                                Market data suggests your target customers typically have 4-8 month decision cycles,
                                slightly longer than your current profile.
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Idea & Project Alignment</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Top Recommendations</div>
                          <div className="space-y-2">
                            <div className="p-2 border rounded-md bg-muted/20">
                              <div className="flex justify-between">
                                <div className="font-medium text-sm">Enterprise Data Integration Platform</div>
                                <Badge className="bg-green-600">94% Match</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                This project perfectly addresses the data integration pain points of your ICP.
                              </p>
                            </div>
                            <div className="p-2 border rounded-md bg-muted/20">
                              <div className="flex justify-between">
                                <div className="font-medium text-sm">Quantum Interface Redesign</div>
                                <Badge className="bg-green-600">92% Match</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Aligns with the technology maturity and enterprise scale of your target customers.
                              </p>
                            </div>
                          </div>

                          <div className="text-sm font-medium mt-3">Opportunity Gaps</div>
                          <div className="p-2 border rounded-md bg-muted/20">
                            <div className="font-medium text-sm">Compliance Automation Solution</div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Market analysis indicates high demand for compliance automation among your ICP, but no
                              current ideas address this need.
                            </p>
                            <Button variant="outline" size="sm" className="mt-2">
                              <Plus className="h-3 w-3 mr-1" />
                              Create Idea
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Globe className="h-4 w-4 text-quantum-600" />
                        Market Intelligence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Key Market Events</div>
                            <div className="space-y-2">
                              {[
                                { date: "2023-11-15", event: "TechCorp acquires DataSphere for $1.2B" },
                                { date: "2023-12-03", event: "New data privacy regulations announced in EU" },
                                { date: "2024-01-20", event: "Legacy Modernizers raises $85M Series C" },
                              ].map((item) => (
                                <div key={item.date} className="text-xs flex items-start gap-2">
                                  <Badge variant="outline" className="flex-shrink-0">
                                    {new Date(item.date).toLocaleDateString(undefined, {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </Badge>
                                  <div>{item.event}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm font-medium">Customer Sentiment Analysis</div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span>Positive</span>
                                <span>64%</span>
                              </div>
                              <Progress value={64} className="h-2 bg-muted" />

                              <div className="flex justify-between text-xs">
                                <span>Neutral</span>
                                <span>28%</span>
                              </div>
                              <Progress value={28} className="h-2 bg-muted" />

                              <div className="flex justify-between text-xs">
                                <span>Negative</span>
                                <span>8%</span>
                              </div>
                              <Progress value={8} className="h-2 bg-muted" />

                              <div className="text-xs text-muted-foreground mt-1">
                                Based on analysis of 2,347 social media posts and reviews
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm font-medium">Emerging Technologies</div>
                            <div className="flex flex-wrap gap-2">
                              {[
                                { name: "Quantum Computing", relevance: "High" },
                                { name: "Zero-Trust Security", relevance: "Very High" },
                                { name: "Edge Computing", relevance: "Medium" },
                                { name: "Federated Learning", relevance: "High" },
                                { name: "Blockchain Integration", relevance: "Low" },
                              ].map((tech) => (
                                <Badge key={tech.name} variant="outline" className="flex items-center gap-1">
                                  {tech.name}
                                  <span
                                    className={`
                                    ml-1 px-1 rounded text-xs
                                    ${
                                      tech.relevance === "Very High"
                                        ? "bg-green-600 text-white"
                                        : tech.relevance === "High"
                                          ? "bg-green-500/20 text-green-700 dark:text-green-400"
                                          : tech.relevance === "Medium"
                                            ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                                            : "bg-red-500/20 text-red-700 dark:text-red-400"
                                    }
                                  `}
                                  >
                                    {tech.relevance}
                                  </span>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>Export Full Report</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
