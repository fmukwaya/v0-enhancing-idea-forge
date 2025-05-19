"use client"

import type React from "react"

import { useState } from "react"
import {
  Calculator,
  DollarSign,
  Users,
  Server,
  Layers,
  Plus,
  Save,
  Download,
  Share2,
  Copy,
  Trash2,
  ChevronDown,
  Zap,
  Sparkles,
  FileText,
  Settings,
  BarChart,
  LineChart,
  Percent,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
} from "recharts"

// Types
interface CostItem {
  id: string
  name: string
  category: string
  amount: number
  frequency: "one-time" | "hourly" | "daily" | "weekly" | "monthly" | "quarterly" | "yearly"
  quantity: number
  startDate?: Date
  endDate?: Date
  description?: string
  tags?: string[]
  isVariable?: boolean
  variabilityFactor?: number
  isRecurring?: boolean
}

interface CostCategory {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  items: CostItem[]
}

interface CostScenario {
  id: string
  name: string
  description?: string
  categories: CostCategory[]
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  linkedEntityId?: string
  linkedEntityType?: "idea" | "project"
}

interface CostForecast {
  month: string
  oneTime: number
  recurring: number
  total: number
}

// Sample data
const initialCategories: CostCategory[] = [
  {
    id: "cat-1",
    name: "Personnel",
    icon: <Users className="h-5 w-5" />,
    color: "bg-blue-500",
    items: [
      {
        id: "item-1",
        name: "Senior Developer",
        category: "cat-1",
        amount: 75,
        frequency: "hourly",
        quantity: 160,
        description: "Full-time senior developer",
        tags: ["development", "core-team"],
        isVariable: false,
        isRecurring: true,
      },
      {
        id: "item-2",
        name: "UX Designer",
        category: "cat-1",
        amount: 65,
        frequency: "hourly",
        quantity: 80,
        description: "Part-time UX designer",
        tags: ["design", "contract"],
        isVariable: true,
        variabilityFactor: 0.2,
        isRecurring: true,
      },
      {
        id: "item-3",
        name: "Project Manager",
        category: "cat-1",
        amount: 85,
        frequency: "hourly",
        quantity: 160,
        description: "Full-time project manager",
        tags: ["management", "core-team"],
        isVariable: false,
        isRecurring: true,
      },
    ],
  },
  {
    id: "cat-2",
    name: "Infrastructure",
    icon: <Server className="h-5 w-5" />,
    color: "bg-green-500",
    items: [
      {
        id: "item-4",
        name: "Cloud Hosting",
        category: "cat-2",
        amount: 750,
        frequency: "monthly",
        quantity: 1,
        description: "AWS hosting and services",
        tags: ["aws", "infrastructure"],
        isVariable: true,
        variabilityFactor: 0.3,
        isRecurring: true,
      },
      {
        id: "item-5",
        name: "Database",
        category: "cat-2",
        amount: 350,
        frequency: "monthly",
        quantity: 1,
        description: "Managed database service",
        tags: ["aws", "database"],
        isVariable: true,
        variabilityFactor: 0.15,
        isRecurring: true,
      },
      {
        id: "item-6",
        name: "CDN",
        category: "cat-2",
        amount: 200,
        frequency: "monthly",
        quantity: 1,
        description: "Content delivery network",
        tags: ["aws", "cdn"],
        isVariable: true,
        variabilityFactor: 0.25,
        isRecurring: true,
      },
    ],
  },
  {
    id: "cat-3",
    name: "Software",
    icon: <Layers className="h-5 w-5" />,
    color: "bg-purple-500",
    items: [
      {
        id: "item-7",
        name: "Development Tools",
        category: "cat-3",
        amount: 150,
        frequency: "monthly",
        quantity: 5,
        description: "IDE and development tools",
        tags: ["tools", "development"],
        isVariable: false,
        isRecurring: true,
      },
      {
        id: "item-8",
        name: "Analytics Platform",
        category: "cat-3",
        amount: 500,
        frequency: "monthly",
        quantity: 1,
        description: "Data analytics platform",
        tags: ["analytics", "data"],
        isVariable: false,
        isRecurring: true,
      },
      {
        id: "item-9",
        name: "Third-party APIs",
        category: "cat-3",
        amount: 300,
        frequency: "monthly",
        quantity: 1,
        description: "Various API subscriptions",
        tags: ["api", "integration"],
        isVariable: true,
        variabilityFactor: 0.4,
        isRecurring: true,
      },
    ],
  },
  {
    id: "cat-4",
    name: "One-time Costs",
    icon: <DollarSign className="h-5 w-5" />,
    color: "bg-amber-500",
    items: [
      {
        id: "item-10",
        name: "Initial Setup",
        category: "cat-4",
        amount: 5000,
        frequency: "one-time",
        quantity: 1,
        description: "Initial infrastructure setup",
        tags: ["setup", "infrastructure"],
        isVariable: false,
        isRecurring: false,
      },
      {
        id: "item-11",
        name: "Software Licenses",
        category: "cat-4",
        amount: 3500,
        frequency: "one-time",
        quantity: 1,
        description: "Perpetual software licenses",
        tags: ["licenses", "software"],
        isVariable: false,
        isRecurring: false,
      },
      {
        id: "item-12",
        name: "Training",
        category: "cat-4",
        amount: 2500,
        frequency: "one-time",
        quantity: 1,
        description: "Team training sessions",
        tags: ["training", "team"],
        isVariable: false,
        isRecurring: false,
      },
    ],
  },
]

const initialScenarios: CostScenario[] = [
  {
    id: "scenario-1",
    name: "Base Scenario",
    description: "Standard cost projection with current team and infrastructure",
    categories: initialCategories,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    id: "scenario-2",
    name: "Scaled Infrastructure",
    description: "Increased infrastructure for higher load",
    categories: initialCategories.map((cat) => {
      if (cat.id === "cat-2") {
        return {
          ...cat,
          items: cat.items.map((item) => ({
            ...item,
            amount: item.amount * 1.5,
          })),
        }
      }
      return cat
    }),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isActive: false,
  },
  {
    id: "scenario-3",
    name: "Expanded Team",
    description: "Additional team members for faster development",
    categories: initialCategories.map((cat) => {
      if (cat.id === "cat-1") {
        return {
          ...cat,
          items: [
            ...cat.items,
            {
              id: "item-13",
              name: "Junior Developer",
              category: "cat-1",
              amount: 45,
              frequency: "hourly",
              quantity: 160,
              description: "Full-time junior developer",
              tags: ["development", "junior"],
              isVariable: false,
              isRecurring: true,
            },
            {
              id: "item-14",
              name: "QA Engineer",
              category: "cat-1",
              amount: 60,
              frequency: "hourly",
              quantity: 160,
              description: "Full-time QA engineer",
              tags: ["qa", "testing"],
              isVariable: false,
              isRecurring: true,
            },
          ],
        }
      }
      return cat
    }),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isActive: false,
    linkedEntityId: "project-2",
    linkedEntityType: "project",
  },
]

// Helper functions
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function normalizeFrequencyToMonthly(item: CostItem): number {
  const amount = item.amount * item.quantity

  switch (item.frequency) {
    case "one-time":
      return 0 // One-time costs don't contribute to recurring monthly costs
    case "hourly":
      return amount * 160 // Assuming 160 working hours per month
    case "daily":
      return amount * 22 // Assuming 22 working days per month
    case "weekly":
      return amount * 4.33 // Average weeks per month
    case "monthly":
      return amount
    case "quarterly":
      return amount / 3
    case "yearly":
      return amount / 12
    default:
      return amount
  }
}

function calculateMonthlyTotal(categories: CostCategory[]): number {
  return categories.reduce((total, category) => {
    return (
      total +
      category.items.reduce((catTotal, item) => {
        if (item.isRecurring) {
          return catTotal + normalizeFrequencyToMonthly(item)
        }
        return catTotal
      }, 0)
    )
  }, 0)
}

function calculateOneTimeTotal(categories: CostCategory[]): number {
  return categories.reduce((total, category) => {
    return (
      total +
      category.items.reduce((catTotal, item) => {
        if (!item.isRecurring) {
          return catTotal + item.amount * item.quantity
        }
        return catTotal
      }, 0)
    )
  }, 0)
}

function calculateTotalByCategory(categories: CostCategory[]): { name: string; value: number; color: string }[] {
  return categories
    .map((category) => {
      const value = category.items.reduce((total, item) => {
        if (item.isRecurring) {
          return total + normalizeFrequencyToMonthly(item)
        }
        return total
      }, 0)

      return {
        name: category.name,
        value,
        color: category.color,
      }
    })
    .filter((item) => item.value > 0)
}

function generateForecastData(categories: CostCategory[], months = 12): CostForecast[] {
  const data: CostForecast[] = []
  const oneTimeTotal = calculateOneTimeTotal(categories)
  const monthlyTotal = calculateMonthlyTotal(categories)

  const currentDate = new Date()

  for (let i = 0; i < months; i++) {
    const date = new Date(currentDate)
    date.setMonth(currentDate.getMonth() + i)

    const month = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    const oneTime = i === 0 ? oneTimeTotal : 0 // One-time costs only in first month
    const recurring = monthlyTotal

    data.push({
      month,
      oneTime,
      recurring,
      total: oneTime + recurring,
    })
  }

  return data
}

const Separator = () => <div className="w-full border-b border-border" />

// Main component
export function AdvancedCostCalculator() {
  const [scenarios, setScenarios] = useState<CostScenario[]>(initialScenarios)
  const [activeScenarioId, setActiveScenarioId] = useState<string>(initialScenarios[0].id)
  const [activeTab, setActiveTab] = useState("calculator")
  const [editMode, setEditMode] = useState(false)
  const [comparisonScenarioIds, setComparisonScenarioIds] = useState<string[]>([])
  const [forecastMonths, setForecastMonths] = useState(12)
  const [showVariability, setShowVariability] = useState(false)

  // Get active scenario
  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0]

  // Calculate totals
  const monthlyTotal = calculateMonthlyTotal(activeScenario.categories)
  const oneTimeTotal = calculateOneTimeTotal(activeScenario.categories)
  const yearlyTotal = monthlyTotal * 12 + oneTimeTotal
  const categoryTotals = calculateTotalByCategory(activeScenario.categories)
  const forecastData = generateForecastData(activeScenario.categories, forecastMonths)

  // Handle adding a cost item
  const handleAddCostItem = (categoryId: string) => {
    const newItem: CostItem = {
      id: `item-${Date.now()}`,
      name: "New Cost Item",
      category: categoryId,
      amount: 0,
      frequency: "monthly",
      quantity: 1,
      isRecurring: true,
    }

    setScenarios((prev) =>
      prev.map((scenario) => {
        if (scenario.id === activeScenarioId) {
          return {
            ...scenario,
            categories: scenario.categories.map((category) => {
              if (category.id === categoryId) {
                return {
                  ...category,
                  items: [...category.items, newItem],
                }
              }
              return category
            }),
            updatedAt: new Date(),
          }
        }
        return scenario
      }),
    )
  }

  // Handle updating a cost item
  const handleUpdateCostItem = (item: CostItem) => {
    setScenarios((prev) =>
      prev.map((scenario) => {
        if (scenario.id === activeScenarioId) {
          return {
            ...scenario,
            categories: scenario.categories.map((category) => {
              if (category.id === item.category) {
                return {
                  ...category,
                  items: category.items.map((i) => (i.id === item.id ? item : i)),
                }
              }
              return category
            }),
            updatedAt: new Date(),
          }
        }
        return scenario
      }),
    )
  }

  // Handle deleting a cost item
  const handleDeleteCostItem = (itemId: string, categoryId: string) => {
    setScenarios((prev) =>
      prev.map((scenario) => {
        if (scenario.id === activeScenarioId) {
          return {
            ...scenario,
            categories: scenario.categories.map((category) => {
              if (category.id === categoryId) {
                return {
                  ...category,
                  items: category.items.filter((item) => item.id !== itemId),
                }
              }
              return category
            }),
            updatedAt: new Date(),
          }
        }
        return scenario
      }),
    )
  }

  // Handle creating a new scenario
  const handleCreateScenario = () => {
    const newScenario: CostScenario = {
      id: `scenario-${Date.now()}`,
      name: "New Scenario",
      description: "Description of the new scenario",
      categories: JSON.parse(JSON.stringify(activeScenario.categories)), // Deep copy
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: false,
    }

    setScenarios((prev) => [...prev, newScenario])
    setActiveScenarioId(newScenario.id)
    setEditMode(true)
  }

  // Handle updating scenario details
  const handleUpdateScenarioDetails = (details: Partial<CostScenario>) => {
    setScenarios((prev) =>
      prev.map((scenario) => {
        if (scenario.id === activeScenarioId) {
          return {
            ...scenario,
            ...details,
            updatedAt: new Date(),
          }
        }
        return scenario
      }),
    )
  }

  // Handle toggling comparison
  const handleToggleComparison = (scenarioId: string) => {
    if (comparisonScenarioIds.includes(scenarioId)) {
      setComparisonScenarioIds((prev) => prev.filter((id) => id !== scenarioId))
    } else {
      setComparisonScenarioIds((prev) => [...prev, scenarioId])
    }
  }

  // Generate comparison data
  const generateComparisonData = () => {
    const data = []

    // Add active scenario
    data.push({
      name: activeScenario.name,
      monthly: calculateMonthlyTotal(activeScenario.categories),
      oneTime: calculateOneTimeTotal(activeScenario.categories),
      yearly: calculateMonthlyTotal(activeScenario.categories) * 12 + calculateOneTimeTotal(activeScenario.categories),
      id: activeScenario.id,
    })

    // Add comparison scenarios
    for (const id of comparisonScenarioIds) {
      const scenario = scenarios.find((s) => s.id === id)
      if (scenario) {
        data.push({
          name: scenario.name,
          monthly: calculateMonthlyTotal(scenario.categories),
          oneTime: calculateOneTimeTotal(scenario.categories),
          yearly: calculateMonthlyTotal(scenario.categories) * 12 + calculateOneTimeTotal(scenario.categories),
          id: scenario.id,
        })
      }
    }

    return data
  }

  const comparisonData = generateComparisonData()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-quantum tracking-tight flex items-center gap-2">
            <Calculator className="h-7 w-7 text-quantum-600" />
            Advanced Cost Calculator
          </h1>
          <p className="text-muted-foreground">Calculate, forecast, and compare costs for your ideas and projects</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={activeScenarioId} onValueChange={setActiveScenarioId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select scenario" />
            </SelectTrigger>
            <SelectContent>
              {scenarios.map((scenario) => (
                <SelectItem key={scenario.id} value={scenario.id}>
                  <div className="flex items-center gap-2">
                    <span>{scenario.name}</span>
                    {scenario.isActive && <Badge className="ml-1 bg-green-500">Active</Badge>}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {!editMode ? (
            <Button variant="outline" className="flex items-center gap-2" onClick={() => setEditMode(true)}>
              <Settings className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          ) : (
            <Button
              className="flex items-center gap-2 bg-quantum-600 hover:bg-quantum-700"
              onClick={() => setEditMode(false)}
            >
              <Save className="h-4 w-4" />
              <span>Save</span>
            </Button>
          )}

          <Button variant="outline" className="flex items-center gap-2" onClick={handleCreateScenario}>
            <Plus className="h-4 w-4" />
            <span>New</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-quantum-100/50 dark:bg-quantum-800/50">
          <TabsTrigger value="calculator" className="flex-1 flex items-center gap-1">
            <Calculator className="h-4 w-4" />
            <span>Cost Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="forecast" className="flex-1 flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            <span>Forecast</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex-1 flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span>Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex-1 flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            <span>Cost Insights</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-bold">
                        {editMode ? (
                          <Input
                            value={activeScenario.name}
                            onChange={(e) => handleUpdateScenarioDetails({ name: e.target.value })}
                            className="text-2xl font-bold h-auto py-1"
                          />
                        ) : (
                          activeScenario.name
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {editMode ? (
                          <Input
                            value={activeScenario.description || ""}
                            onChange={(e) => handleUpdateScenarioDetails({ description: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          activeScenario.description
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1">
                              <Switch checked={showVariability} onCheckedChange={setShowVariability} />
                              <Label className="text-sm">Show Variability</Label>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Show potential cost variations based on variability factors</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {activeScenario.categories.map((category) => (
                      <div key={category.id} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-full ${category.color} bg-opacity-20`}>{category.icon}</div>
                          <h3 className="text-lg font-medium">{category.name}</h3>
                        </div>

                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[300px]">Item</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Frequency</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                {editMode && <TableHead className="w-[100px]">Actions</TableHead>}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {category.items.map((item) => {
                                const monthlyAmount = normalizeFrequencyToMonthly(item)
                                const variabilityAmount =
                                  item.isVariable && item.variabilityFactor ? monthlyAmount * item.variabilityFactor : 0

                                return (
                                  <TableRow key={item.id}>
                                    <TableCell className="font-medium">
                                      {editMode ? (
                                        <Input
                                          value={item.name}
                                          onChange={(e) => handleUpdateCostItem({ ...item, name: e.target.value })}
                                          className="h-8"
                                        />
                                      ) : (
                                        <div className="flex items-center gap-2">
                                          <span>{item.name}</span>
                                          {item.isVariable && (
                                            <Badge variant="outline" className="text-xs">
                                              Variable
                                            </Badge>
                                          )}
                                        </div>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {editMode ? (
                                        <div className="flex items-center">
                                          <span className="mr-1">$</span>
                                          <Input
                                            type="number"
                                            value={item.amount}
                                            onChange={(e) =>
                                              handleUpdateCostItem({
                                                ...item,
                                                amount: Number.parseFloat(e.target.value) || 0,
                                              })
                                            }
                                            className="h-8 w-24"
                                          />
                                        </div>
                                      ) : (
                                        formatCurrency(item.amount)
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {editMode ? (
                                        <Select
                                          value={item.frequency}
                                          onValueChange={(value: any) =>
                                            handleUpdateCostItem({
                                              ...item,
                                              frequency: value,
                                              isRecurring: value !== "one-time",
                                            })
                                          }
                                        >
                                          <SelectTrigger className="h-8 w-32">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="one-time">One-time</SelectItem>
                                            <SelectItem value="hourly">Hourly</SelectItem>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="quarterly">Quarterly</SelectItem>
                                            <SelectItem value="yearly">Yearly</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      ) : (
                                        item.frequency.charAt(0).toUpperCase() + item.frequency.slice(1)
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {editMode ? (
                                        <Input
                                          type="number"
                                          value={item.quantity}
                                          onChange={(e) =>
                                            handleUpdateCostItem({
                                              ...item,
                                              quantity: Number.parseInt(e.target.value) || 1,
                                            })
                                          }
                                          className="h-8 w-20"
                                        />
                                      ) : (
                                        item.quantity
                                      )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div>
                                        {item.frequency === "one-time"
                                          ? formatCurrency(item.amount * item.quantity)
                                          : formatCurrency(monthlyAmount) + "/mo"}
                                      </div>
                                      {showVariability && item.isVariable && variabilityAmount > 0 && (
                                        <div className="text-xs text-muted-foreground">
                                          ±{formatCurrency(variabilityAmount)}/mo
                                        </div>
                                      )}
                                    </TableCell>
                                    {editMode && (
                                      <TableCell>
                                        <div className="flex items-center gap-1">
                                          <Popover>
                                            <PopoverTrigger asChild>
                                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Settings className="h-4 w-4" />
                                              </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80">
                                              <div className="space-y-4">
                                                <h4 className="font-medium">Advanced Settings</h4>
                                                <div className="space-y-2">
                                                  <div className="flex items-center justify-between">
                                                    <Label htmlFor={`variable-${item.id}`}>Variable Cost</Label>
                                                    <Switch
                                                      id={`variable-${item.id}`}
                                                      checked={item.isVariable}
                                                      onCheckedChange={(checked) =>
                                                        handleUpdateCostItem({
                                                          ...item,
                                                          isVariable: checked,
                                                          variabilityFactor: checked
                                                            ? item.variabilityFactor || 0.1
                                                            : undefined,
                                                        })
                                                      }
                                                    />
                                                  </div>

                                                  {item.isVariable && (
                                                    <div className="space-y-2">
                                                      <Label>
                                                        Variability Factor ({(item.variabilityFactor || 0) * 100}%)
                                                      </Label>
                                                      <Slider
                                                        value={[(item.variabilityFactor || 0) * 100]}
                                                        min={0}
                                                        max={100}
                                                        step={1}
                                                        onValueChange={(values) =>
                                                          handleUpdateCostItem({
                                                            ...item,
                                                            variabilityFactor: values[0] / 100,
                                                          })
                                                        }
                                                      />
                                                    </div>
                                                  )}

                                                  <div className="pt-2">
                                                    <Label>Description</Label>
                                                    <Input
                                                      value={item.description || ""}
                                                      onChange={(e) =>
                                                        handleUpdateCostItem({
                                                          ...item,
                                                          description: e.target.value,
                                                        })
                                                      }
                                                      className="mt-1"
                                                    />
                                                  </div>
                                                </div>
                                              </div>
                                            </PopoverContent>
                                          </Popover>

                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive"
                                            onClick={() => handleDeleteCostItem(item.id, category.id)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </TableCell>
                                    )}
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </div>

                        {editMode && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleAddCostItem(category.id)}
                          >
                            <Plus className="h-4 w-4" />
                            <span>Add Item</span>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Last updated: {activeScenario.updatedAt.toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Active:</Label>
                    <Switch
                      checked={activeScenario.isActive}
                      onCheckedChange={(checked) => {
                        // If setting this scenario to active, set all others to inactive
                        if (checked) {
                          setScenarios((prev) =>
                            prev.map((s) => ({
                              ...s,
                              isActive: s.id === activeScenarioId,
                            })),
                          )
                        } else {
                          handleUpdateScenarioDetails({ isActive: checked })
                        }
                      }}
                      disabled={!editMode}
                    />
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cost Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">Monthly Cost</div>
                        <div className="text-2xl font-bold text-quantum-600">{formatCurrency(monthlyTotal)}</div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">One-time Cost</div>
                        <div className="text-xl font-semibold">{formatCurrency(oneTimeTotal)}</div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">Annual Cost</div>
                        <div className="text-xl font-semibold">{formatCurrency(yearlyTotal)}</div>
                      </div>

                      <Separator />

                      <div>
                        <div className="text-sm font-medium mb-3">Cost Breakdown</div>
                        <div className="h-[200px]">
                          <ChartContainer
                            config={{
                              ...categoryTotals.reduce(
                                (acc, item, index) => {
                                  acc[`category${index}`] = {
                                    label: item.name,
                                    color: item.color,
                                  }
                                  return acc
                                },
                                {} as Record<string, { label: string; color: string }>,
                              ),
                            }}
                          >
                            <ResponsiveContainer width="100%" height="100%">
                              <RechartsPieChart>
                                {categoryTotals.map((item, index) => (
                                  <Bar
                                    key={index}
                                    dataKey={`category${index}`}
                                    fill={`var(--color-category${index})`}
                                    name={item.name}
                                  />
                                ))}
                                <ChartTooltip content={<ChartTooltipContent />} />
                              </RechartsPieChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium">Category Breakdown</div>
                      {categoryTotals.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className={`h-3 w-3 rounded-full ${item.color}`} />
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <div className="text-sm font-medium">{formatCurrency(item.value)}/mo</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      <span>Export Cost Report</span>
                    </Button>

                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <Copy className="h-4 w-4" />
                      <span>Duplicate Scenario</span>
                    </Button>

                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      <span>Share Scenario</span>
                    </Button>

                    <Button className="w-full bg-quantum-600 hover:bg-quantum-700 flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <span>Generate Cost Insights</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle className="text-xl">Cost Forecast</CardTitle>
                  <CardDescription>Projected costs over time for {activeScenario.name}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label>Forecast Period:</Label>
                  <Select
                    value={forecastMonths.toString()}
                    onValueChange={(value) => setForecastMonths(Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 months</SelectItem>
                      <SelectItem value="12">12 months</SelectItem>
                      <SelectItem value="24">24 months</SelectItem>
                      <SelectItem value="36">36 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    oneTime: {
                      label: "One-time Costs",
                      color: "hsl(var(--chart-1))",
                    },
                    recurring: {
                      label: "Recurring Costs",
                      color: "hsl(var(--chart-2))",
                    },
                    total: {
                      label: "Total Costs",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={forecastData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="oneTime" fill="var(--color-oneTime)" name="One-time Costs" stackId="a" />
                      <Bar dataKey="recurring" fill="var(--color-recurring)" name="Recurring Costs" stackId="a" />
                      <Line type="monotone" dataKey="total" stroke="var(--color-total)" name="Total Costs" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">Forecast Summary</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Cost ({forecastMonths} months)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-quantum-600">
                        {formatCurrency(oneTimeTotal + monthlyTotal * forecastMonths)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Includes one-time and recurring costs</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Average Monthly Cost</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-quantum-600">
                        {formatCurrency((oneTimeTotal + monthlyTotal * forecastMonths) / forecastMonths)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Averaged over {forecastMonths} months</div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Cost Stability</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-quantum-600">
                        {oneTimeTotal > 0 ? "Variable" : "Stable"}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {oneTimeTotal > 0
                          ? `${Math.round((oneTimeTotal / (oneTimeTotal + monthlyTotal * forecastMonths)) * 100)}% one-time costs`
                          : "Consistent monthly costs"}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead>One-time Costs</TableHead>
                        <TableHead>Recurring Costs</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {forecastData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.month}</TableCell>
                          <TableCell>{formatCurrency(item.oneTime)}</TableCell>
                          <TableCell>{formatCurrency(item.recurring)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle className="text-xl">Scenario Comparison</CardTitle>
                  <CardDescription>Compare costs across different scenarios</CardDescription>
                </div>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        Select Scenarios to Compare
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px]">
                      <div className="space-y-4">
                        <h4 className="font-medium">Select Scenarios</h4>
                        <div className="space-y-2">
                          {scenarios
                            .filter((s) => s.id !== activeScenarioId)
                            .map((scenario) => (
                              <div key={scenario.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`compare-${scenario.id}`}
                                  checked={comparisonScenarioIds.includes(scenario.id)}
                                  onCheckedChange={() => handleToggleComparison(scenario.id)}
                                />
                                <label
                                  htmlFor={`compare-${scenario.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {scenario.name}
                                </label>
                              </div>
                            ))}
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    monthly: {
                      label: "Monthly Cost",
                      color: "hsl(var(--chart-1))",
                    },
                    oneTime: {
                      label: "One-time Cost",
                      color: "hsl(var(--chart-2))",
                    },
                    yearly: {
                      label: "Yearly Cost",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="monthly" fill="var(--color-monthly)" name="Monthly Cost" />
                      <Bar dataKey="oneTime" fill="var(--color-oneTime)" name="One-time Cost" />
                      <Bar dataKey="yearly" fill="var(--color-yearly)" name="Yearly Cost" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Detailed Comparison</h3>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Scenario</TableHead>
                      <TableHead>Monthly Cost</TableHead>
                      <TableHead>One-time Cost</TableHead>
                      <TableHead>Yearly Cost</TableHead>
                      <TableHead className="text-right">Difference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparisonData.map((item, index) => {
                      const isActive = item.id === activeScenarioId
                      const baseYearly = comparisonData[0].yearly
                      const difference = item.yearly - baseYearly
                      const percentDifference = (difference / baseYearly) * 100

                      return (
                        <TableRow key={index} className={isActive ? "bg-muted/30" : ""}>
                          <TableCell className="font-medium">
                            {item.name}
                            {isActive && <Badge className="ml-2">Active</Badge>}
                          </TableCell>
                          <TableCell>{formatCurrency(item.monthly)}/mo</TableCell>
                          <TableCell>{formatCurrency(item.oneTime)}</TableCell>
                          <TableCell>{formatCurrency(item.yearly)}/yr</TableCell>
                          <TableCell className="text-right">
                            {index === 0 ? (
                              <span className="text-muted-foreground">Baseline</span>
                            ) : (
                              <div className="flex items-center justify-end gap-1">
                                <span className={difference < 0 ? "text-green-600" : "text-red-600"}>
                                  {difference < 0 ? "-" : "+"}
                                  {formatCurrency(Math.abs(difference))}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  ({difference < 0 ? "" : "+"}
                                  {percentDifference.toFixed(1)}%)
                                </span>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {comparisonData.length > 1 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Category Comparison</h3>

                  <div className="space-y-6">
                    {activeScenario.categories.map((category) => {
                      const categoryData = comparisonData.map((scenario) => {
                        const scenarioObj = scenarios.find((s) => s.id === scenario.id)
                        if (!scenarioObj) return { name: scenario.name, value: 0 }

                        const categoryObj = scenarioObj.categories.find((c) => c.name === category.name)
                        if (!categoryObj) return { name: scenario.name, value: 0 }

                        const value = categoryObj.items.reduce((total, item) => {
                          if (item.isRecurring) {
                            return total + normalizeFrequencyToMonthly(item)
                          }
                          return total
                        }, 0)

                        return { name: scenario.name, value }
                      })

                      return (
                        <div key={category.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-full ${category.color} bg-opacity-20`}>{category.icon}</div>
                            <h4 className="font-medium">{category.name}</h4>
                          </div>

                          <div className="pl-8">
                            {categoryData.map((item, index) => (
                              <div key={index} className="flex justify-between items-center py-1">
                                <div className="text-sm">{item.name}</div>
                                <div className="text-sm font-medium">{formatCurrency(item.value)}/mo</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-quantum-600" />
                Cost Insights & Optimization
              </CardTitle>
              <CardDescription>AI-powered analysis and recommendations to optimize your costs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border rounded-lg bg-quantum-50 dark:bg-quantum-900/50">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Zap className="h-5 w-5 text-quantum-600" />
                  Cost Efficiency Score
                </h3>

                <div className="mt-4 flex items-center gap-4">
                  <div className="relative h-32 w-32">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-3xl font-bold text-quantum-600">78%</div>
                    </div>
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-muted/20"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeDasharray="283"
                        strokeDashoffset="62"
                        className="text-quantum-600"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm">
                      Your cost structure is well-optimized overall, with some opportunities for improvement. The
                      current scenario has a good balance of resources, but there are potential savings in
                      infrastructure and third-party services.
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge className="bg-amber-500">Good</Badge>
                      <span className="text-sm text-muted-foreground">Room for optimization</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Optimization Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="p-3 border rounded-md bg-muted/20">
                        <div className="flex justify-between items-start">
                          <div className="font-medium">Infrastructure Rightsizing</div>
                          <Badge className="bg-green-600">High Impact</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Cloud hosting costs can be reduced by approximately 22% through rightsizing and reserved
                          instances.
                        </p>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Potential Savings:</span> {formatCurrency(750 * 0.22 * 12)}/year
                        </div>
                      </div>

                      <div className="p-3 border rounded-md bg-muted/20">
                        <div className="flex justify-between items-start">
                          <div className="font-medium">Resource Allocation</div>
                          <Badge className="bg-amber-500">Medium Impact</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Optimizing UX Designer hours based on project phases could reduce costs without impacting
                          delivery.
                        </p>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Potential Savings:</span> {formatCurrency(65 * 20 * 12)}/year
                        </div>
                      </div>

                      <div className="p-3 border rounded-md bg-muted/20">
                        <div className="flex justify-between items-start">
                          <div className="font-medium">Software Consolidation</div>
                          <Badge className="bg-amber-500">Medium Impact</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Consolidating analytics platforms and development tools could eliminate redundancies.
                        </p>
                        <div className="mt-2 text-sm">
                          <span className="font-medium">Potential Savings:</span> {formatCurrency(150 * 2 * 12)}/year
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Cost Benchmarks</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">Personnel Costs</div>
                          <div className="text-sm">
                            <span className="font-medium">You:</span> 35% of total
                          </div>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <Progress value={35} className="h-2 flex-1" />
                          <div className="text-xs text-muted-foreground">Industry: 40-50%</div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">Infrastructure Costs</div>
                          <div className="text-sm">
                            <span className="font-medium">You:</span> 28% of total
                          </div>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <Progress value={28} className="h-2 flex-1" />
                          <div className="text-xs text-muted-foreground">Industry: 20-30%</div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">Software Costs</div>
                          <div className="text-sm">
                            <span className="font-medium">You:</span> 22% of total
                          </div>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <Progress value={22} className="h-2 flex-1" />
                          <div className="text-xs text-muted-foreground">Industry: 15-25%</div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">One-time Costs</div>
                          <div className="text-sm">
                            <span className="font-medium">You:</span> 15% of total
                          </div>
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <Progress value={15} className="h-2 flex-1" />
                          <div className="text-xs text-muted-foreground">Industry: 10-20%</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 border rounded-md bg-muted/20">
                      <div className="font-medium">Benchmark Summary</div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your cost structure is within industry standards, with slightly lower personnel costs and higher
                        infrastructure costs compared to similar projects.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Percent className="h-4 w-4 text-quantum-600" />
                      ROI Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 border rounded-md bg-muted/20">
                          <div className="text-sm font-medium">Estimated ROI</div>
                          <div className="text-2xl font-bold text-quantum-600 mt-1">285%</div>
                          <div className="text-xs text-muted-foreground">Over 24 months</div>
                        </div>

                        <div className="p-3 border rounded-md bg-muted/20">
                          <div className="text-sm font-medium">Payback Period</div>
                          <div className="text-2xl font-bold text-quantum-600 mt-1">8.4 months</div>
                          <div className="text-xs text-muted-foreground">Break-even point</div>
                        </div>

                        <div className="p-3 border rounded-md bg-muted/20">
                          <div className="text-sm font-medium">Cost per User</div>
                          <div className="text-2xl font-bold text-quantum-600 mt-1">{formatCurrency(42)}</div>
                          <div className="text-xs text-muted-foreground">Monthly average</div>
                        </div>
                      </div>

                      <div className="h-[200px]">
                        <ChartContainer
                          config={{
                            costs: {
                              label: "Costs",
                              color: "hsl(var(--chart-1))",
                            },
                            revenue: {
                              label: "Revenue",
                              color: "hsl(var(--chart-2))",
                            },
                            profit: {
                              label: "Profit",
                              color: "hsl(var(--chart-3))",
                            },
                          }}
                        >
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsLineChart
                              data={[
                                { month: "Month 1", costs: 11000, revenue: 0, profit: -11000 },
                                { month: "Month 2", costs: 13500, revenue: 2000, profit: -11500 },
                                { month: "Month 3", costs: 16000, revenue: 5000, profit: -11000 },
                                { month: "Month 4", costs: 18500, revenue: 10000, profit: -8500 },
                                { month: "Month 5", costs: 21000, revenue: 15000, profit: -6000 },
                                { month: "Month 6", costs: 23500, revenue: 20000, profit: -3500 },
                                { month: "Month 7", costs: 26000, revenue: 25000, profit: -1000 },
                                { month: "Month 8", costs: 28500, revenue: 30000, profit: 1500 },
                                { month: "Month 9", costs: 31000, revenue: 35000, profit: 4000 },
                                { month: "Month 10", costs: 33500, revenue: 40000, profit: 6500 },
                                { month: "Month 11", costs: 36000, revenue: 45000, profit: 9000 },
                                { month: "Month 12", costs: 38500, revenue: 50000, profit: 11500 },
                              ]}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis tickFormatter={(value) => formatCurrency(value)} />
                              <ChartTooltip content={<ChartTooltipContent />} />
                              <Legend />
                              <Line type="monotone" dataKey="costs" stroke="var(--color-costs)" name="Costs" />
                              <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" name="Revenue" />
                              <Line type="monotone" dataKey="profit" stroke="var(--color-profit)" name="Profit" />
                            </RechartsLineChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>

                      <div className="flex justify-end">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>Export ROI Report</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-md bg-quantum-50 dark:bg-quantum-900/50">
                      <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 text-quantum-600 mt-0.5" />
                        <div>
                          <div className="font-medium">Create an Optimized Scenario</div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Our AI has analyzed your cost structure and can generate an optimized scenario that could
                            reduce costs by approximately 18% without impacting project delivery.
                          </p>
                          <Button className="mt-2 bg-quantum-600 hover:bg-quantum-700">
                            Generate Optimized Scenario
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-quantum-100 dark:bg-quantum-800 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium">1</span>
                        </div>
                        <div>
                          <div className="font-medium">Consider Reserved Instances</div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Switching to reserved instances for your cloud infrastructure could save up to 40% on those
                            costs. Based on your usage patterns, this would be highly beneficial.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-quantum-100 dark:bg-quantum-800 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium">2</span>
                        </div>
                        <div>
                          <div className="font-medium">Implement Resource Scaling</div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Implementing auto-scaling for your infrastructure based on usage patterns could optimize
                            costs during low-traffic periods while maintaining performance during peak times.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-quantum-100 dark:bg-quantum-800 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium">3</span>
                        </div>
                        <div>
                          <div className="font-medium">Evaluate Third-party Services</div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Review your third-party API subscriptions for usage patterns. Some services may be
                            underutilized or could be replaced with more cost-effective alternatives.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
