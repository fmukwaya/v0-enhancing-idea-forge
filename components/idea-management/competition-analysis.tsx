"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
  PieChart,
  Pie,
} from "recharts"
import {
  Search,
  TrendingUp,
  BarChart2,
  RefreshCw,
  Download,
  Target,
  Zap,
  Plus,
  ExternalLink,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Globe,
  Twitter,
  Linkedin,
  Facebook,
  Database,
  Shield,
  CheckCircle,
} from "lucide-react"
import { motion } from "framer-motion"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
\
import { typeof } from "some-module" // Placeholder for the correct import or declaration

// Mock data for the competition analysis
const competitorData = [
  {
    id: "comp1",
    name: "TechVision",
    website: "techvision.com",
    founded: 2015,
    funding: "$25M",
    employees: "50-100",
    marketShare: 15,
    strengths: ["User Experience", "Integration Capabilities", "Mobile Support"],
    weaknesses: ["Limited Customization", "Higher Price Point", "Customer Support"],
    score: {
      features: 85,
      pricing: 65,
      userExperience: 90,
      marketPresence: 75,
      innovation: 80,
    },
  },
  {
    id: "comp2",
    name: "InnovateCorp",
    website: "innovatecorp.io",
    founded: 2018,
    funding: "$12M",
    employees: "25-50",
    marketShare: 8,
    strengths: ["Innovative Features", "Competitive Pricing", "API Flexibility"],
    weaknesses: ["New Market Entrant", "Limited Integrations", "Smaller User Base"],
    score: {
      features: 75,
      pricing: 90,
      userExperience: 70,
      marketPresence: 60,
      innovation: 95,
    },
  },
  {
    id: "comp3",
    name: "Enterprise Solutions",
    website: "enterprise-solutions.com",
    founded: 2010,
    funding: "$50M",
    employees: "200-500",
    marketShare: 22,
    strengths: ["Enterprise Scale", "Comprehensive Features", "Established Brand"],
    weaknesses: ["Complex Interface", "Slow Innovation Cycle", "Higher Cost"],
    score: {
      features: 95,
      pricing: 60,
      userExperience: 65,
      marketPresence: 90,
      innovation: 70,
    },
  },
]

const marketShareData = [
  { name: "TechVision", value: 15 },
  { name: "InnovateCorp", value: 8 },
  { name: "Enterprise Solutions", value: 22 },
  { name: "Our Solution", value: 5 },
  { name: "Others", value: 50 },
]

const featureComparisonData = [
  {
    feature: "User Interface",
    "Our Solution": 90,
    TechVision: 85,
    InnovateCorp: 70,
    "Enterprise Solutions": 65,
  },
  {
    feature: "Performance",
    "Our Solution": 85,
    TechVision: 80,
    InnovateCorp: 75,
    "Enterprise Solutions": 90,
  },
  {
    feature: "Customization",
    "Our Solution": 95,
    TechVision: 65,
    InnovateCorp: 80,
    "Enterprise Solutions": 70,
  },
  {
    feature: "Integration",
    "Our Solution": 80,
    TechVision: 90,
    InnovateCorp: 65,
    "Enterprise Solutions": 85,
  },
  {
    feature: "Pricing",
    "Our Solution": 85,
    TechVision: 65,
    InnovateCorp: 90,
    "Enterprise Solutions": 60,
  },
]

const positioningData = [
  { x: 90, y: 85, z: 150, name: "Our Solution" },
  { x: 85, y: 65, z: 120, name: "TechVision" },
  { x: 70, y: 90, z: 80, name: "InnovateCorp" },
  { x: 65, y: 60, z: 220, name: "Enterprise Solutions" },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

interface CompetitorCardProps {
  competitor: (typeof competitorData)[0]
  onSelect: (id: string) => void
  isSelected: boolean
}

const CompetitorCard = ({ competitor, onSelect, isSelected }: CompetitorCardProps) => {
  return (
    <Card
      className={`overflow-hidden transition-all ${
        isSelected
          ? "border-quantum-600 dark:border-quantum-400"
          : "border-quantum-200 dark:border-quantum-800 hover:border-quantum-400 dark:hover:border-quantum-600"
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">{competitor.name}</CardTitle>
            <CardDescription>
              <a
                href={`https://${competitor.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline"
              >
                {competitor.website}
                <ExternalLink className="h-3 w-3" />
              </a>
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-quantum-100/50 dark:bg-quantum-800/50">
            {competitor.marketShare}% Market Share
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Founded</p>
              <p className="font-medium">{competitor.founded}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Funding</p>
              <p className="font-medium">{competitor.funding}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Employees</p>
              <p className="font-medium">{competitor.employees}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Competitive Score</p>
            <div className="flex items-center gap-2">
              <Progress value={Object.values(competitor.score).reduce((a, b) => a + b, 0) / 5} className="h-2" />
              <span className="text-sm font-medium">
                {Math.round(Object.values(competitor.score).reduce((a, b) => a + b, 0) / 5)}%
              </span>
            </div>
          </div>

          <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className="w-full"
            onClick={() => onSelect(competitor.id)}
          >
            {isSelected ? "Selected for Analysis" : "Select for Analysis"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface CompetitionAnalysisProps {
  ideaId?: string
  ideaTitle?: string
  onAnalysisComplete?: (results: any) => void
}

export function CompetitionAnalysis({ ideaId, ideaTitle, onAnalysisComplete }: CompetitionAnalysisProps) {
  const [activeTab, setActiveTab] = useState("competitors")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>(["comp1", "comp2", "comp3"])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(true)
  const [searchSources, setSearchSources] = useState({
    googleSearch: true,
    bingSearch: true,
    duckduckgo: true,
    twitter: true,
    linkedin: true,
    facebook: false,
    crunchbase: true,
    bloomberg: true,
    reuters: true,
    secFilings: true,
  })
  const [isSearching, setIsSearching] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)

  const filteredCompetitors = competitorData.filter((competitor) =>
    competitor.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleCompetitor = (id: string) => {
    if (selectedCompetitors.includes(id)) {
      setSelectedCompetitors(selectedCompetitors.filter((c) => c !== id))
    } else {
      setSelectedCompetitors([...selectedCompetitors, id])
    }
  }

  const runCompetitiveAnalysis = async () => {
    setIsAnalyzing(true)

    // Simulate analysis processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsAnalyzing(false)
    setAnalysisComplete(true)
    setActiveTab("analysis")

    if (onAnalysisComplete) {
      onAnalysisComplete({
        competitors: selectedCompetitors.map((id) => competitorData.find((c) => c.id === id)),
        marketShare: marketShareData,
        featureComparison: featureComparisonData,
        positioning: positioningData,
      })
    }
  }

  const toggleSearchSource = (source: keyof typeof searchSources) => {
    setSearchSources({
      ...searchSources,
      [source]: !searchSources[source],
    })
  }

  const handleSearch = () => {
    setIsSearching(true)

    // Log the search sources being used
    console.log(
      "Searching with sources:",
      Object.entries(searchSources)
        .filter(([_, enabled]) => enabled)
        .map(([source]) => source),
    )

    // Simulate API call with timeout
    setTimeout(() => {
      setIsSearching(false)
      setSearchPerformed(true)
    }, 2000)
  }

  return (
    <Card className="w-full overflow-hidden border-quantum-600/20 bg-gradient-to-br from-white to-quantum-50/30 dark:from-quantum-950 dark:to-quantum-900">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-quantum tracking-tight flex items-center gap-2">
              <Target className="h-5 w-5 text-quantum-600" />
              Competitive Analysis
            </CardTitle>
            <CardDescription className="text-quantum-700 dark:text-quantum-300">
              {ideaTitle ? `Analyze competition for "${ideaTitle}"` : "Analyze market competition for your idea"}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={runCompetitiveAnalysis}
              disabled={selectedCompetitors.length === 0 || isAnalyzing}
              className="border-quantum-200 dark:border-quantum-700 hover:bg-quantum-100 dark:hover:bg-quantum-800"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Run Analysis
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!analysisComplete}
              className="border-quantum-200 dark:border-quantum-700 hover:bg-quantum-100 dark:hover:bg-quantum-800"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-quantum-100/50 dark:bg-quantum-800/50">
            <TabsTrigger value="competitors" className="flex-1 flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>Competitors</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex-1 flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              <span>Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="positioning" className="flex-1 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>Market Positioning</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="competitors" className="mt-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search competitors..."
                  className="pl-9 bg-white dark:bg-quantum-900"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add competitor</span>
              </Button>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Search Sources</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => {
                    const allEnabled = Object.values(searchSources).every((v) => v)
                    setSearchSources(
                      Object.keys(searchSources).reduce(
                        (acc, key) => ({
                          ...acc,
                          [key]: !allEnabled,
                        }),
                        {} as any, // Corrected to use any instead of typeof typeof searchSources
                      ),
                    )
                  }}
                >
                  {Object.values(searchSources).every((v) => v) ? "Deselect All" : "Select All"}
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                <div
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border ${
                    searchSources.googleSearch ? "bg-primary/10 border-primary" : "bg-muted/30 border-muted"
                  }`}
                  onClick={() => toggleSearchSource("googleSearch")}
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-xs">Google</span>
                  {searchSources.googleSearch && <CheckCircle className="h-3 w-3 ml-auto text-primary" />}
                </div>

                <div
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border ${
                    searchSources.bingSearch ? "bg-primary/10 border-primary" : "bg-muted/30 border-muted"
                  }`}
                  onClick={() => toggleSearchSource("bingSearch")}
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-xs">Bing</span>
                  {searchSources.bingSearch && <CheckCircle className="h-3 w-3 ml-auto text-primary" />}
                </div>

                <div
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border ${
                    searchSources.duckduckgo ? "bg-primary/10 border-primary" : "bg-muted/30 border-muted"
                  }`}
                  onClick={() => toggleSearchSource("duckduckgo")}
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-xs">DuckDuckGo</span>
                  {searchSources.duckduckgo && <CheckCircle className="h-3 w-3 ml-auto text-primary" />}
                </div>

                <div
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border ${
                    searchSources.twitter ? "bg-primary/10 border-primary" : "bg-muted/30 border-muted"
                  }`}
                  onClick={() => toggleSearchSource("twitter")}
                >
                  <Twitter className="h-4 w-4" />
                  <span className="text-xs">Twitter</span>
                  {searchSources.twitter && <CheckCircle className="h-3 w-3 ml-auto text-primary" />}
                </div>

                <div
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border ${
                    searchSources.linkedin ? "bg-primary/10 border-primary" : "bg-muted/30 border-muted"
                  }`}
                  onClick={() => toggleSearchSource("linkedin")}
                >
                  <Linkedin className="h-4 w-4" />
                  <span className="text-xs">LinkedIn</span>
                  {searchSources.linkedin && <CheckCircle className="h-3 w-3 ml-auto text-primary" />}
                </div>

                <div
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border ${
                    searchSources.facebook ? "bg-primary/10 border-primary" : "bg-muted/30 border-muted"
                  }`}
                  onClick={() => toggleSearchSource("facebook")}
                >
                  <Facebook className="h-4 w-4" />
                  <span className="text-xs">Facebook</span>
                  {searchSources.facebook && <CheckCircle className="h-3 w-3 ml-auto text-primary" />}
                </div>

                <div
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border ${
                    searchSources.crunchbase ? "bg-primary/10 border-primary" : "bg-muted/30 border-muted"
                  }`}
                  onClick={() => toggleSearchSource("crunchbase")}
                >
                  <Database className="h-4 w-4" />
                  <span className="text-xs">Crunchbase</span>
                  {searchSources.crunchbase && <CheckCircle className="h-3 w-3 ml-auto text-primary" />}
                </div>

                <div
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border ${
                    searchSources.bloomberg ? "bg-primary/10 border-primary" : "bg-muted/30 border-muted"
                  }`}
                  onClick={() => toggleSearchSource("bloomberg")}
                >
                  <Shield className="h-4 w-4" />
                  <span className="text-xs">Bloomberg</span>
                  {searchSources.bloomberg && <CheckCircle className="h-3 w-3 ml-auto text-primary" />}
                </div>

                <div
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border ${
                    searchSources.reuters ? "bg-primary/10 border-primary" : "bg-muted/30 border-muted"
                  }`}
                  onClick={() => toggleSearchSource("reuters")}
                >
                  <Shield className="h-4 w-4" />
                  <span className="text-xs">Reuters</span>
                  {searchSources.reuters && <CheckCircle className="h-3 w-3 ml-auto text-primary" />}
                </div>

                <div
                  className={`flex items-center gap-2 p-2 rounded-md cursor-pointer border ${
                    searchSources.secFilings ? "bg-primary/10 border-primary" : "bg-muted/30 border-muted"
                  }`}
                  onClick={() => toggleSearchSource("secFilings")}
                >
                  <Shield className="h-4 w-4" />
                  <span className="text-xs">SEC Filings</span>
                  {searchSources.secFilings && <CheckCircle className="h-3 w-3 ml-auto text-primary" />}
                </div>
              </div>

              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>All sources are verified and comply with data privacy regulations</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompetitors.map((competitor) => (
                <CompetitorCard
                  key={competitor.id}
                  competitor={competitor}
                  onSelect={toggleCompetitor}
                  isSelected={selectedCompetitors.includes(competitor.id)}
                />
              ))}
            </div>

            {filteredCompetitors.length === 0 && (
              <div className="text-center py-8 border rounded-lg">
                <Target className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No Competitors Found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try a different search term or add a new competitor
                </p>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Competitor
                </Button>
              </div>
            )}

            {selectedCompetitors.length > 0 && (
              <div className="flex justify-between items-center p-4 border rounded-lg bg-quantum-50 dark:bg-quantum-900">
                <div>
                  <p className="font-medium">
                    {selectedCompetitors.length} competitor{selectedCompetitors.length !== 1 ? "s" : ""} selected
                  </p>
                  <p className="text-sm text-muted-foreground">Ready for competitive analysis</p>
                </div>
                <Button
                  onClick={runCompetitiveAnalysis}
                  disabled={isAnalyzing}
                  className="bg-quantum-600 hover:bg-quantum-700"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Run Analysis
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-quantum-200 dark:border-quantum-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Market Share Analysis</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={marketShareData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {marketShareData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-quantum-200 dark:border-quantum-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Competitive Radar Analysis</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        data={[
                          {
                            subject: "Features",
                            "Our Solution": 90,
                            TechVision: 85,
                            InnovateCorp: 75,
                            "Enterprise Solutions": 95,
                          },
                          {
                            subject: "Pricing",
                            "Our Solution": 85,
                            TechVision: 65,
                            InnovateCorp: 90,
                            "Enterprise Solutions": 60,
                          },
                          {
                            subject: "UX",
                            "Our Solution": 95,
                            TechVision: 90,
                            InnovateCorp: 70,
                            "Enterprise Solutions": 65,
                          },
                          {
                            subject: "Market Presence",
                            "Our Solution": 60,
                            TechVision: 75,
                            InnovateCorp: 60,
                            "Enterprise Solutions": 90,
                          },
                          {
                            subject: "Innovation",
                            "Our Solution": 95,
                            TechVision: 80,
                            InnovateCorp: 95,
                            "Enterprise Solutions": 70,
                          },
                        ]}
                      >
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar
                          name="Our Solution"
                          dataKey="Our Solution"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="TechVision"
                          dataKey="TechVision"
                          stroke="#82ca9d"
                          fill="#82ca9d"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="InnovateCorp"
                          dataKey="InnovateCorp"
                          stroke="#ffc658"
                          fill="#ffc658"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="Enterprise Solutions"
                          dataKey="Enterprise Solutions"
                          stroke="#ff8042"
                          fill="#ff8042"
                          fillOpacity={0.6}
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-quantum-200 dark:border-quantum-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Feature Comparison</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[400px]">
                  <ChartContainer
                    config={{
                      "Our Solution": {
                        label: "Our Solution",
                        color: "hsl(var(--chart-1))",
                      },
                      TechVision: {
                        label: "TechVision",
                        color: "hsl(var(--chart-2))",
                      },
                      InnovateCorp: {
                        label: "InnovateCorp",
                        color: "hsl(var(--chart-3))",
                      },
                      "Enterprise Solutions": {
                        label: "Enterprise Solutions",
                        color: "hsl(var(--chart-4))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={featureComparisonData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="feature" type="category" width={100} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="Our Solution" fill="var(--color-Our-Solution)" />
                        <Bar dataKey="TechVision" fill="var(--color-TechVision)" />
                        <Bar dataKey="InnovateCorp" fill="var(--color-InnovateCorp)" />
                        <Bar dataKey="Enterprise Solutions" fill="var(--color-Enterprise-Solutions)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Competitive Insights</h3>
              <div className="space-y-3">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <Sparkles className="h-5 w-5 text-quantum-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">Competitive Advantage</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Your solution excels in user experience and customization compared to competitors. Leverage
                            these strengths in your marketing and development strategy.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">Market Challenges</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Enterprise Solutions dominates market share (22%). Focus on differentiation and targeting
                            specific market segments to gain traction.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Card className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <TrendingUp className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">Growth Opportunity</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            InnovateCorp's pricing strategy is capturing price-sensitive segments. Consider a tiered
                            pricing model to compete effectively across different market segments.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="positioning" className="mt-4 space-y-6">
            <Card className="border-quantum-200 dark:border-quantum-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Market Positioning Map</CardTitle>
                <CardDescription>
                  Visualize competitive positioning based on feature richness (x-axis), pricing competitiveness
                  (y-axis), and market share (bubble size)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20,
                      }}
                    >
                      <CartesianGrid />
                      <XAxis
                        type="number"
                        dataKey="x"
                        name="Feature Richness"
                        domain={[0, 100]}
                        label={{ value: "Feature Richness", position: "bottom" }}
                      />
                      <YAxis
                        type="number"
                        dataKey="y"
                        name="Pricing Competitiveness"
                        domain={[0, 100]}
                        label={{ value: "Pricing Competitiveness", angle: -90, position: "left" }}
                      />
                      <ZAxis type="number" dataKey="z" range={[100, 400]} />
                      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                      <Legend />
                      <Scatter name="Companies" data={positioningData} fill="#8884d8">
                        {positioningData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-quantum-200 dark:border-quantum-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Differentiation Strategy</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Feature Innovation</span>
                        <span className="font-medium">75%</span>
                      </div>
                      <Slider defaultValue={[75]} max={100} step={1} disabled className="py-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Price Competitiveness</span>
                        <span className="font-medium">60%</span>
                      </div>
                      <Slider defaultValue={[60]} max={100} step={1} disabled className="py-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>User Experience</span>
                        <span className="font-medium">90%</span>
                      </div>
                      <Slider defaultValue={[90]} max={100} step={1} disabled className="py-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Market Presence</span>
                        <span className="font-medium">40%</span>
                      </div>
                      <Slider defaultValue={[40]} max={100} step={1} disabled className="py-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-quantum-200 dark:border-quantum-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Strategic Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg bg-quantum-50 dark:bg-quantum-900">
                      <div className="h-8 w-8 rounded-full bg-quantum-100 dark:bg-quantum-800 flex items-center justify-center">
                        <span className="font-medium">1</span>
                      </div>
                      <div>
                        <p className="font-medium">Focus on UX Advantage</p>
                        <p className="text-sm text-muted-foreground">
                          Leverage your superior user experience as a key differentiator in marketing materials.
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg bg-quantum-50 dark:bg-quantum-900">
                      <div className="h-8 w-8 rounded-full bg-quantum-100 dark:bg-quantum-800 flex items-center justify-center">
                        <span className="font-medium">2</span>
                      </div>
                      <div>
                        <p className="font-medium">Tiered Pricing Strategy</p>
                        <p className="text-sm text-muted-foreground">
                          Implement a tiered pricing model to compete with InnovateCorp's pricing advantage.
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
                    </div>

                    <div className="flex items-center gap-3 p-3 border rounded-lg bg-quantum-50 dark:bg-quantum-900">
                      <div className="h-8 w-8 rounded-full bg-quantum-100 dark:bg-quantum-800 flex items-center justify-center">
                        <span className="font-medium">3</span>
                      </div>
                      <div>
                        <p className="font-medium">Target Niche Segments</p>
                        <p className="text-sm text-muted-foreground">
                          Focus on specific market segments where Enterprise Solutions is underperforming.
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
