"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  Search,
  TrendingUp,
  BarChart2,
  RefreshCw,
  Download,
  Globe,
  Users,
  Lightbulb,
  Clock,
  Zap,
  Sparkles,
  Brain,
  Target,
  Loader2,
  Shield,
  Smartphone,
  ChevronRight,
  ArrowRight,
} from "lucide-react"
import { motion } from "framer-motion"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Mock data for market research
const marketSizeData = [
  { year: 2022, value: 5.2 },
  { year: 2023, value: 6.8 },
  { year: 2024, value: 8.5 },
  { year: 2025, value: 10.7 },
  { year: 2026, value: 13.2 },
  { year: 2027, value: 16.5 },
]

const marketSegmentData = [
  { name: "Enterprise", value: 45 },
  { name: "SMB", value: 30 },
  { name: "Consumer", value: 25 },
]

const demographicData = [
  { name: "18-24", value: 15 },
  { name: "25-34", value: 35 },
  { name: "35-44", value: 25 },
  { name: "45-54", value: 15 },
  { name: "55+", value: 10 },
]

const trendData = [
  { month: "Jan", searches: 4200, mentions: 1200 },
  { month: "Feb", searches: 4800, mentions: 1500 },
  { month: "Mar", searches: 5100, mentions: 1800 },
  { month: "Apr", searches: 5400, mentions: 2100 },
  { month: "May", searches: 6200, mentions: 2400 },
  { month: "Jun", searches: 6800, mentions: 2700 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

interface MarketInsightCardProps {
  title: string
  description: string
  icon: React.ReactNode
  tags?: string[]
  source?: string
  date?: string
}

const MarketInsightCard = ({ title, description, icon, tags, source, date }: MarketInsightCardProps) => {
  return (
    <Card className="overflow-hidden border-quantum-200 dark:border-quantum-800 hover:border-quantum-400 dark:hover:border-quantum-600 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-md bg-quantum-100 dark:bg-quantum-800 text-quantum-700 dark:text-quantum-300">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="bg-quantum-50 dark:bg-quantum-900">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            {(source || date) && (
              <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                {source && <span>{source}</span>}
                {date && <span>{date}</span>}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface MarketResearchProps {
  ideaId?: string
  ideaTitle?: string
  ideaCategory?: string
  onResearchComplete?: (results: any) => void
}

export function MarketResearch({ ideaId, ideaTitle, ideaCategory, onResearchComplete }: MarketResearchProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [isResearching, setIsResearching] = useState(false)
  const [researchComplete, setResearchComplete] = useState(true)
  const [aiInsights, setAiInsights] = useState<string[]>([])
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false)
  const [quantumResearchOpen, setQuantumResearchOpen] = useState(false)
  const [quantumResearchCriteria, setQuantumResearchCriteria] = useState({
    targetMarket: "",
    competitorFocus: "",
    trendAnalysis: "",
    consumerBehavior: "",
    emergingTechnologies: "",
  })
  const [quantumResearchLoading, setQuantumResearchLoading] = useState(false)
  const [quantumResearchResults, setQuantumResearchResults] = useState<null | {
    insights: string[]
    marketSize: string
    growthRate: string
    keyTrends: string[]
    consumerSegments: { name: string; size: string; characteristics: string[] }[]
    recommendations: string[]
  }>(null)

  const runMarketResearch = async () => {
    setIsResearching(true)

    // Simulate research processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsResearching(false)
    setResearchComplete(true)

    if (onResearchComplete) {
      onResearchComplete({
        marketSize: marketSizeData,
        marketSegments: marketSegmentData,
        demographics: demographicData,
        trends: trendData,
      })
    }
  }

  const generateAiInsights = async () => {
    setIsGeneratingInsights(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock AI insights
    const insights = [
      "The market is showing a 25% year-over-year growth rate, indicating strong potential for new entrants.",
      "Enterprise segment represents the largest opportunity but has the highest competition intensity.",
      "25-34 age demographic shows the strongest engagement with similar products and services.",
      "Recent regulatory changes in data privacy may impact go-to-market strategy in certain regions.",
      "Competitor pricing analysis suggests a premium pricing strategy could be viable for a differentiated offering.",
    ]

    setAiInsights(insights)
    setIsGeneratingInsights(false)
  }

  const handleQuantumResearchSubmit = () => {
    setQuantumResearchLoading(true)

    // Simulate API call with timeout
    setTimeout(() => {
      setQuantumResearchResults({
        insights: [
          "The market shows significant growth potential in the next 3-5 years",
          "Early adopters are primarily in the 25-34 age demographic",
          "Sustainability features are becoming a key differentiator",
          "Integration with existing ecosystems is a primary adoption factor",
          "Price sensitivity decreases with increased perceived innovation value",
        ],
        marketSize: "$4.7 billion",
        growthRate: "17.3% CAGR",
        keyTrends: [
          "AI-powered personalization",
          "Subscription-based revenue models",
          "Increased focus on data privacy",
          "Integration with smart home ecosystems",
          "Sustainability and ethical sourcing",
        ],
        consumerSegments: [
          {
            name: "Tech Enthusiasts",
            size: "32%",
            characteristics: ["Early adopters", "Higher income", "Urban dwellers", "Value innovation"],
          },
          {
            name: "Practical Professionals",
            size: "41%",
            characteristics: ["Value efficiency", "Mid-to-high income", "Suburban", "Brand loyal"],
          },
          {
            name: "Budget Conscious",
            size: "27%",
            characteristics: ["Price sensitive", "Feature selective", "Diverse locations", "Value durability"],
          },
        ],
        recommendations: [
          "Focus marketing efforts on the 25-34 demographic with emphasis on innovation and sustainability",
          "Develop integration capabilities with popular smart home platforms",
          "Consider a tiered pricing strategy to capture both premium and value segments",
          "Invest in AI capabilities to enhance personalization features",
          "Highlight data privacy measures in marketing materials",
        ],
      })
      setQuantumResearchLoading(false)
    }, 3000)
  }

  return (
    <Card className="w-full overflow-hidden border-quantum-600/20 bg-gradient-to-br from-white to-quantum-50/30 dark:from-quantum-950 dark:to-quantum-900">
      <CardHeader className="pb-3">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-xl font-quantum tracking-tight flex items-center gap-2">
              <Globe className="h-5 w-5 text-quantum-600" />
              Market Research
            </CardTitle>
            <CardDescription className="text-quantum-700 dark:text-quantum-300">
              {ideaTitle ? `Research market potential for "${ideaTitle}"` : "Analyze market potential for your idea"}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={runMarketResearch}
              disabled={isResearching}
              className="border-quantum-200 dark:border-quantum-700 hover:bg-quantum-100 dark:hover:bg-quantum-800"
            >
              {isResearching ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Researching...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Run Research
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!researchComplete}
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
            <TabsTrigger value="overview" className="flex-1 flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>Market Overview</span>
            </TabsTrigger>
            <TabsTrigger value="segments" className="flex-1 flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Segments & Demographics</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex-1 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>Trends & Insights</span>
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex-1 flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              <span>AI Analysis</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-quantum-200 dark:border-quantum-800">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Market Size (2024)</p>
                      <p className="text-2xl font-semibold mt-1">$8.5B</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-xs font-medium text-emerald-500">+25% YoY</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-quantum-100 dark:bg-quantum-800 text-quantum-600 dark:text-quantum-300">
                      <BarChart2 className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-quantum-200 dark:border-quantum-800">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">CAGR (2022-2027)</p>
                      <p className="text-2xl font-semibold mt-1">25.9%</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-xs font-medium text-emerald-500">Strong Growth</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-quantum-100 dark:bg-quantum-800 text-quantum-600 dark:text-quantum-300">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-quantum-200 dark:border-quantum-800">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Market Potential</p>
                      <p className="text-2xl font-semibold mt-1">High</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Target className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-xs font-medium text-emerald-500">Favorable Conditions</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-quantum-100 dark:bg-quantum-800 text-quantum-600 dark:text-quantum-300">
                      <Target className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-quantum-200 dark:border-quantum-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Market Size Forecast (2022-2027)</CardTitle>
                <CardDescription>Projected market size in billions USD</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      value: {
                        label: "Market Size (Billions USD)",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={marketSizeData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="var(--color-value)"
                          fillOpacity={1}
                          fill="url(#colorValue)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Key Market Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MarketInsightCard
                  title="Strong Growth Trajectory"
                  description="The market is experiencing robust growth with a CAGR of 25.9%, driven by increasing adoption of digital solutions and technological advancements."
                  icon={<TrendingUp className="h-5 w-5" />}
                  tags={["Growth", "Digital Transformation"]}
                  source="Industry Report"
                  date="May 2025"
                />

                <MarketInsightCard
                  title="Competitive Landscape"
                  description="The market is moderately fragmented with several key players holding significant market share. New entrants with innovative solutions have opportunity for disruption."
                  icon={<Users className="h-5 w-5" />}
                  tags={["Competition", "Market Entry"]}
                  source="Market Analysis"
                  date="April 2025"
                />

                <MarketInsightCard
                  title="Regulatory Environment"
                  description="Recent regulatory changes in data privacy and security are creating both challenges and opportunities for market participants."
                  icon={<Globe className="h-5 w-5" />}
                  tags={["Regulation", "Compliance"]}
                  source="Legal Analysis"
                  date="March 2025"
                />

                <MarketInsightCard
                  title="Technology Trends"
                  description="AI and quantum computing are emerging as key differentiators in the market, with early adopters gaining competitive advantage."
                  icon={<Lightbulb className="h-5 w-5" />}
                  tags={["AI", "Quantum", "Innovation"]}
                  source="Tech Trends Report"
                  date="May 2025"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="segments" className="mt-4 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-quantum-200 dark:border-quantum-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Market Segments</CardTitle>
                  <CardDescription>Distribution by customer segment</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={marketSegmentData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {marketSegmentData.map((entry, index) => (
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
                  <CardTitle className="text-lg">Demographics</CardTitle>
                  <CardDescription>Age distribution of target users</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={demographicData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {demographicData.map((entry, index) => (
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
            </div>

            <Card className="border-quantum-200 dark:border-quantum-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Segment Analysis</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Enterprise Segment</h4>
                      <Badge className="bg-blue-100 text-blue-800">45% of Market</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Growth Potential</span>
                        <span className="font-medium">High</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Competition Intensity</span>
                        <span className="font-medium">High</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Barrier to Entry</span>
                        <span className="font-medium">Medium</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enterprise customers prioritize security, scalability, and integration capabilities. They have
                      longer sales cycles but higher lifetime value.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">SMB Segment</h4>
                      <Badge className="bg-green-100 text-green-800">30% of Market</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Growth Potential</span>
                        <span className="font-medium">Very High</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Competition Intensity</span>
                        <span className="font-medium">Medium</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Barrier to Entry</span>
                        <span className="font-medium">Low</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      SMB customers are price-sensitive but faster to adopt new solutions. They value ease of use and
                      quick implementation.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Consumer Segment</h4>
                      <Badge className="bg-amber-100 text-amber-800">25% of Market</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Growth Potential</span>
                        <span className="font-medium">Medium</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Competition Intensity</span>
                        <span className="font-medium">Very High</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Barrier to Entry</span>
                        <span className="font-medium">Low</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Consumer market is highly competitive with lower price points. Success depends on user experience,
                      brand, and viral adoption.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="mt-4 space-y-6">
            <Card className="border-quantum-200 dark:border-quantum-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Market Trends</CardTitle>
                <CardDescription>Search volume and social mentions over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      searches: {
                        label: "Search Volume",
                        color: "hsl(var(--chart-1))",
                      },
                      mentions: {
                        label: "Social Mentions",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="searches"
                          stroke="var(--color-searches)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="mentions"
                          stroke="var(--color-mentions)"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Emerging Trends</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MarketInsightCard
                  title="AI Integration"
                  description="Companies are increasingly integrating AI capabilities to enhance product functionality and user experience, creating a competitive advantage."
                  icon={<Brain className="h-5 w-5" />}
                  tags={["AI", "Machine Learning", "Automation"]}
                  source="Tech Trends Report"
                  date="May 2025"
                />

                <MarketInsightCard
                  title="Subscription Models"
                  description="The market is shifting towards subscription-based pricing models, providing more predictable revenue streams and customer relationships."
                  icon={<Clock className="h-5 w-5" />}
                  tags={["Pricing", "Business Model", "Revenue"]}
                  source="Business Analysis"
                  date="April 2025"
                />

                <MarketInsightCard
                  title="Mobile-First Approach"
                  description="Users increasingly expect mobile-optimized experiences, with mobile usage surpassing desktop for many applications."
                  icon={<Smartphone className="h-5 w-5" />}
                  tags={["Mobile", "UX", "Design"]}
                  source="User Research"
                  date="March 2025"
                />

                <MarketInsightCard
                  title="Privacy & Security Focus"
                  description="Growing concerns about data privacy and security are driving demand for solutions with robust protection features and transparent data practices."
                  icon={<Shield className="h-5 w-5" />}
                  tags={["Privacy", "Security", "Compliance"]}
                  source="Security Report"
                  date="May 2025"
                />
              </div>
            </div>

            <Card className="border-quantum-200 dark:border-quantum-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Keyword Analysis</CardTitle>
                <CardDescription>Popular search terms related to your idea</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-quantum-900">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-quantum-100 dark:bg-quantum-800 flex items-center justify-center">
                        <Search className="h-4 w-4 text-quantum-600" />
                      </div>
                      <div>
                        <p className="font-medium">AI-powered productivity</p>
                        <p className="text-sm text-muted-foreground">High search volume, moderate competition</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800">+45% Growth</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-quantum-900">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-quantum-100 dark:bg-quantum-800 flex items-center justify-center">
                        <Search className="h-4 w-4 text-quantum-600" />
                      </div>
                      <div>
                        <p className="font-medium">Quantum computing applications</p>
                        <p className="text-sm text-muted-foreground">Moderate search volume, low competition</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800">+120% Growth</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-quantum-900">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-quantum-100 dark:bg-quantum-800 flex items-center justify-center">
                        <Search className="h-4 w-4 text-quantum-600" />
                      </div>
                      <div>
                        <p className="font-medium">Enterprise collaboration tools</p>
                        <p className="text-sm text-muted-foreground">Very high search volume, high competition</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800">+28% Growth</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg bg-white dark:bg-quantum-900">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-quantum-100 dark:bg-quantum-800 flex items-center justify-center">
                        <Search className="h-4 w-4 text-quantum-600" />
                      </div>
                      <div>
                        <p className="font-medium">Secure data visualization</p>
                        <p className="text-sm text-muted-foreground">Moderate search volume, moderate competition</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800">+35% Growth</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="mt-4 space-y-6">
            <div className="rounded-lg border p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-quantum-600" />
                <h3 className="text-lg font-medium">Quantum AI Market Analysis</h3>
              </div>

              <p className="text-sm text-muted-foreground">
                Our quantum-powered AI can analyze market data across multiple dimensions and provide deep insights into
                market potential, competitive landscape, and strategic opportunities.
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={generateAiInsights}
                  disabled={isGeneratingInsights}
                >
                  {isGeneratingInsights ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                  <span>{isGeneratingInsights ? "Analyzing..." : "Generate AI Insights"}</span>
                </Button>
              </div>

              {aiInsights.length > 0 && (
                <div className="space-y-3 mt-4">
                  <h4 className="text-sm font-medium">AI-Generated Market Insights:</h4>
                  <div className="space-y-2">
                    {aiInsights.map((insight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="overflow-hidden">
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="mt-1">
                                <Brain className="h-5 w-5 text-quantum-600" />
                              </div>
                              <p className="text-sm">{insight}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Card className="border-quantum-200 dark:border-quantum-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Market Opportunity Score</CardTitle>
                <CardDescription>AI-generated assessment of market potential</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-6">
                  <div className="flex items-center justify-center">
                    <div className="relative h-48 w-48">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-5xl font-bold text-quantum-600">85</div>
                      </div>
                      <svg className="h-full w-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="10"
                          className="text-muted"
                          opacity="0.1"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="10"
                          strokeDasharray="283"
                          strokeDashoffset="42.45"
                          className="text-quantum-600"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Market Growth</span>
                        <span className="font-medium">90/100</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Competitive Advantage</span>
                        <span className="font-medium">85/100</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Barrier to Entry</span>
                        <span className="font-medium">70/100</span>
                      </div>
                      <Progress value={70} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Regulatory Risk</span>
                        <span className="font-medium">80/100</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Strategic Recommendations</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-white dark:bg-quantum-900">
                  <div className="h-10 w-10 rounded-full bg-quantum-100 dark:bg-quantum-800 flex items-center justify-center">
                    <span className="font-medium">1</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Focus on Enterprise-First Strategy</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Target enterprise segment initially to establish credibility and secure higher-value contracts.
                      Emphasize security, scalability, and integration capabilities.
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg bg-white dark:bg-quantum-900">
                  <div className="h-10 w-10 rounded-full bg-quantum-100 dark:bg-quantum-800 flex items-center justify-center">
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Differentiate with AI & Quantum Features</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Leverage AI and quantum computing capabilities as key differentiators. Focus on solving complex
                      problems that traditional solutions cannot address effectively.
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg bg-white dark:bg-quantum-900">
                  <div className="h-10 w-10 rounded-full bg-quantum-100 dark:bg-quantum-800 flex items-center justify-center">
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Implement Tiered Pricing Strategy</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Create a tiered pricing model to capture value across different market segments. Consider a
                      freemium model to drive adoption in the SMB segment.
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg bg-white dark:bg-quantum-900">
                  <div className="h-10 w-10 rounded-full bg-quantum-100 dark:bg-quantum-800 flex items-center justify-center">
                    <span className="font-medium">4</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Prioritize Privacy & Security</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Make privacy and security core features, not afterthoughts. Implement quantum-resistant encryption
                      and transparent data practices to address growing concerns.
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-quantum-600 hover:bg-quantum-700 flex items-center gap-2">
                  <span>Apply Recommendations to Idea</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <Dialog open={quantumResearchOpen} onOpenChange={setQuantumResearchOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="mt-4 w-full border-quantum-200 dark:border-quantum-700 bg-gradient-to-r from-quantum-100 to-quantum-50 dark:from-quantum-800 dark:to-quantum-900"
          >
            <Sparkles className="mr-2 h-4 w-4 text-quantum-600 dark:text-quantum-400" />
            Run Quantum-Inspired Market Research
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-quantum">Quantum-Inspired Market Research</DialogTitle>
            <DialogDescription>
              Leverage advanced quantum-inspired algorithms to gain deeper market insights based on specific criteria.
            </DialogDescription>
          </DialogHeader>

          {!quantumResearchResults ? (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetMarket">Target Market Specification</Label>
                  <Textarea
                    id="targetMarket"
                    placeholder="Describe your target market in detail (demographics, geography, etc.)"
                    value={quantumResearchCriteria.targetMarket}
                    onChange={(e) =>
                      setQuantumResearchCriteria({ ...quantumResearchCriteria, targetMarket: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competitorFocus">Competitor Analysis Focus</Label>
                  <Textarea
                    id="competitorFocus"
                    placeholder="Specify which aspects of competitors you want to analyze"
                    value={quantumResearchCriteria.competitorFocus}
                    onChange={(e) =>
                      setQuantumResearchCriteria({ ...quantumResearchCriteria, competitorFocus: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trendAnalysis">Trend Analysis Parameters</Label>
                  <Textarea
                    id="trendAnalysis"
                    placeholder="Specify which market trends you want to analyze"
                    value={quantumResearchCriteria.trendAnalysis}
                    onChange={(e) =>
                      setQuantumResearchCriteria({ ...quantumResearchCriteria, trendAnalysis: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consumerBehavior">Consumer Behavior Focus</Label>
                  <Textarea
                    id="consumerBehavior"
                    placeholder="Specify which consumer behaviors you want to analyze"
                    value={quantumResearchCriteria.consumerBehavior}
                    onChange={(e) =>
                      setQuantumResearchCriteria({ ...quantumResearchCriteria, consumerBehavior: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergingTechnologies">Emerging Technologies</Label>
                  <Textarea
                    id="emergingTechnologies"
                    placeholder="Specify which emerging technologies you want to analyze"
                    value={quantumResearchCriteria.emergingTechnologies}
                    onChange={(e) =>
                      setQuantumResearchCriteria({ ...quantumResearchCriteria, emergingTechnologies: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Key Insights</h3>
                <ul className="space-y-1">
                  {quantumResearchResults.insights.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="mt-0.5 h-2 w-2 rounded-full bg-quantum-600 dark:bg-quantum-400" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-muted/30">
                  <h3 className="text-sm font-medium mb-2">Market Size</h3>
                  <p className="text-2xl font-bold">{quantumResearchResults.marketSize}</p>
                </div>
                <div className="p-4 rounded-lg border bg-muted/30">
                  <h3 className="text-sm font-medium mb-2">Growth Rate</h3>
                  <p className="text-2xl font-bold">{quantumResearchResults.growthRate}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Key Trends</h3>
                <div className="flex flex-wrap gap-2">
                  {quantumResearchResults.keyTrends.map((trend, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      {trend}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Consumer Segments</h3>
                {quantumResearchResults.consumerSegments.map((segment, index) => (
                  <div key={index} className="p-4 rounded-lg border">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">{segment.name}</h4>
                      <Badge>{segment.size}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {segment.characteristics.map((char, charIndex) => (
                        <Badge key={charIndex} variant="outline" className="text-xs">
                          {char}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Strategic Recommendations</h3>
                <ul className="space-y-2">
                  {quantumResearchResults.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
                      <div className="mt-0.5 h-5 w-5 rounded-full bg-quantum-600 dark:bg-quantum-400 flex items-center justify-center text-white text-xs">
                        {index + 1}
                      </div>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <DialogFooter>
            {!quantumResearchResults ? (
              <Button
                onClick={handleQuantumResearchSubmit}
                disabled={quantumResearchLoading}
                className="w-full sm:w-auto"
              >
                {quantumResearchLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Run Analysis"
                )}
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setQuantumResearchResults(null)}>
                  Modify Criteria
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Export Results
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
