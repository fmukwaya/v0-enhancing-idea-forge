"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Lightbulb,
  Sparkles,
  Zap,
  Brain,
  Target,
  Clock,
  Users,
  Trash2,
  Plus,
  Wand2,
  Loader2,
  Check,
  X,
} from "lucide-react"
import { motion } from "framer-motion"

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  tags: z.string().optional(),
  feasibilityScore: z.number().min(1).max(100),
  impactScore: z.number().min(1).max(100),
  timeframe: z.string({
    required_error: "Please select a timeframe.",
  }),
  isConfidential: z.boolean().default(false),
  collaborators: z.string().optional(),
})

interface IdeaCreationFormProps {
  onSubmit?: (values: z.infer<typeof formSchema>) => void
}

export function IdeaCreationForm({ onSubmit }: IdeaCreationFormProps) {
  const [activeTab, setActiveTab] = useState("basic")
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      tags: "",
      feasibilityScore: 50,
      impactScore: 50,
      timeframe: "",
      isConfidential: false,
      collaborators: "",
    },
  })

  function handleSubmit(values: z.infer<typeof formSchema>) {
    // Include selected tags in the form values
    const formData = {
      ...values,
      tags: selectedTags.join(", "),
    }

    console.log(formData)
    if (onSubmit) {
      onSubmit(formData)
    }
  }

  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
    form.setValue("tags", "")
  }

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  const generateAiSuggestions = async () => {
    setIsGenerating(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock AI suggestions
    const suggestions = [
      "Consider adding a quantum computing angle to enhance processing capabilities",
      "Integrate with existing neural networks for improved pattern recognition",
      "Add biometric authentication for enhanced security",
      "Implement temporal data visualization for better trend analysis",
      "Consider cross-dimensional data representation for complex relationships",
    ]

    setAiSuggestions(suggestions)
    setIsGenerating(false)
  }

  const applySuggestion = (suggestion: string) => {
    const currentDescription = form.getValues("description")
    form.setValue("description", currentDescription + "\n\n" + suggestion)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-quantum-400 to-quantum-600 flex items-center justify-center">
          <Lightbulb className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Create New Idea</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span>Basic Info</span>
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>Details & Impact</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>AI Enhancement</span>
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <TabsContent value="basic" className="space-y-6 mt-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idea Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a concise title for your idea" {...field} />
                    </FormControl>
                    <FormDescription>
                      A clear, descriptive title helps others understand your idea quickly.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your idea in detail..." className="min-h-[150px]" {...field} />
                    </FormControl>
                    <FormDescription>Explain the problem your idea solves and how it works.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="process">Process</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="customer-service">Customer Service</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Categorizing your idea helps with organization and discovery.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          placeholder="Add tags..."
                          {...field}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && field.value) {
                              e.preventDefault()
                              addTag(field.value)
                            }
                          }}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addTag(field.value)}
                        disabled={!field.value}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <FormDescription>Add relevant tags to make your idea more discoverable.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={() => setActiveTab("details")}
                  className="bg-quantum-600 hover:bg-quantum-700"
                >
                  Next Step
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="feasibilityScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feasibility Score</FormLabel>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Challenging</span>
                          <span className="font-medium">{field.value}%</span>
                          <span>Highly Feasible</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={1}
                            max={100}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="py-4"
                          />
                        </FormControl>
                      </div>
                      <FormDescription>How feasible is this idea to implement with current resources?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="impactScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Impact Score</FormLabel>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Low Impact</span>
                          <span className="font-medium">{field.value}%</span>
                          <span>High Impact</span>
                        </div>
                        <FormControl>
                          <Slider
                            min={1}
                            max={100}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                            className="py-4"
                          />
                        </FormControl>
                      </div>
                      <FormDescription>How significant is the potential impact of this idea?</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="timeframe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Implementation Timeframe</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a timeframe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate (&lt; 1 month)</SelectItem>
                        <SelectItem value="short">Short-term (1-3 months)</SelectItem>
                        <SelectItem value="medium">Medium-term (3-6 months)</SelectItem>
                        <SelectItem value="long">Long-term (6-12 months)</SelectItem>
                        <SelectItem value="strategic">Strategic (&gt; 12 months)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Estimated time required to implement this idea.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="collaborators"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collaborators</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email addresses separated by commas" {...field} />
                    </FormControl>
                    <FormDescription>Invite team members to collaborate on this idea.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isConfidential"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Confidential Idea</FormLabel>
                      <FormDescription>
                        Mark this idea as confidential to limit visibility to specific team members.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
                  Previous Step
                </Button>
                <Button
                  type="button"
                  onClick={() => setActiveTab("ai")}
                  className="bg-quantum-600 hover:bg-quantum-700"
                >
                  Next Step
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-6 mt-6">
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-quantum-600" />
                  <h3 className="text-lg font-medium">AI Enhancement</h3>
                </div>

                <p className="text-sm text-muted-foreground">
                  Our quantum-powered AI can analyze your idea and suggest improvements, identify potential challenges,
                  and recommend implementation strategies.
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={generateAiSuggestions}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                    <span>{isGenerating ? "Generating..." : "Generate AI Suggestions"}</span>
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="flex items-center gap-2"
                    onClick={() => setAiSuggestions([])}
                    disabled={aiSuggestions.length === 0}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Clear</span>
                  </Button>
                </div>

                {aiSuggestions.length > 0 && (
                  <div className="space-y-3 mt-4">
                    <h4 className="text-sm font-medium">AI Suggestions:</h4>
                    <div className="space-y-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="overflow-hidden">
                            <CardContent className="p-3">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                  <div className="mt-1">
                                    <Brain className="h-5 w-5 text-quantum-600" />
                                  </div>
                                  <p className="text-sm">{suggestion}</p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 flex-shrink-0"
                                  onClick={() => applySuggestion(suggestion)}
                                >
                                  <Check className="h-4 w-4" />
                                  <span className="sr-only">Apply suggestion</span>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-quantum-600" />
                  <h3 className="text-lg font-medium">Quantum Analysis</h3>
                </div>

                <p className="text-sm text-muted-foreground">
                  Our quantum analysis engine evaluates your idea across multiple dimensions and provides a
                  comprehensive assessment.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="rounded-lg border p-3 bg-quantum-50 dark:bg-quantum-900">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-quantum-600" />
                      <h4 className="text-sm font-medium">Success Probability</h4>
                    </div>
                    <div className="text-2xl font-bold text-quantum-700 dark:text-quantum-300">
                      {Math.round((form.getValues("feasibilityScore") + form.getValues("impactScore")) / 2)}%
                    </div>
                  </div>

                  <div className="rounded-lg border p-3 bg-quantum-50 dark:bg-quantum-900">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-quantum-600" />
                      <h4 className="text-sm font-medium">Time to Value</h4>
                    </div>
                    <div className="text-2xl font-bold text-quantum-700 dark:text-quantum-300">
                      {form.getValues("timeframe")
                        ? form.getValues("timeframe").charAt(0).toUpperCase() + form.getValues("timeframe").slice(1)
                        : "Not set"}
                    </div>
                  </div>

                  <div className="rounded-lg border p-3 bg-quantum-50 dark:bg-quantum-900">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-quantum-600" />
                      <h4 className="text-sm font-medium">Collaboration Score</h4>
                    </div>
                    <div className="text-2xl font-bold text-quantum-700 dark:text-quantum-300">
                      {form.getValues("collaborators") ? "High" : "Low"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                  Previous Step
                </Button>
                <Button type="submit" className="bg-quantum-600 hover:bg-quantum-700">
                  Submit Idea
                </Button>
              </div>
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  )
}
