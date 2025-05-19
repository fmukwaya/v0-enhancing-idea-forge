"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, X, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AdvancedSearchFiltersProps {
  onApplyFilters: (filters: any) => void
  onResetFilters: () => void
  initialFilters?: any
}

export function AdvancedSearchFilters({
  onApplyFilters,
  onResetFilters,
  initialFilters = {},
}: AdvancedSearchFiltersProps) {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState({
    searchTerm: initialFilters.searchTerm || "",
    categories: initialFilters.categories || [],
    statuses: initialFilters.statuses || [],
    tags: initialFilters.tags || [],
    impactRange: initialFilters.impactRange || [0, 100],
    feasibilityRange: initialFilters.feasibilityRange || [0, 100],
    timeframe: initialFilters.timeframe || "all",
    createdAfter: initialFilters.createdAfter || "",
    createdBefore: initialFilters.createdBefore || "",
    createdBy: initialFilters.createdBy || [],
    isConfidential: initialFilters.isConfidential || false,
    hasDocuments: initialFilters.hasDocuments || false,
    sortBy: initialFilters.sortBy || "newest",
    sortDirection: initialFilters.sortDirection || "desc",
  })

  // Available categories
  const availableCategories = [
    { id: "product", name: "Product" },
    { id: "technology", name: "Technology" },
    { id: "process", name: "Process" },
    { id: "marketing", name: "Marketing" },
    { id: "security", name: "Security" },
  ]

  // Available statuses
  const availableStatuses = [
    { id: "draft", name: "Draft" },
    { id: "pending", name: "Pending" },
    { id: "in-review", name: "In Review" },
    { id: "approved", name: "Approved" },
    { id: "rejected", name: "Rejected" },
    { id: "in-progress", name: "In Progress" },
    { id: "completed", name: "Completed" },
  ]

  // Available tags
  const availableTags = [
    { id: "ux", name: "UX" },
    { id: "quantum", name: "Quantum" },
    { id: "design", name: "Design" },
    { id: "ai", name: "AI" },
    { id: "customer-experience", name: "Customer Experience" },
    { id: "analytics", name: "Analytics" },
    { id: "security", name: "Security" },
    { id: "biometrics", name: "Biometrics" },
    { id: "authentication", name: "Authentication" },
    { id: "optimization", name: "Optimization" },
    { id: "infrastructure", name: "Infrastructure" },
  ]

  // Available users
  const availableUsers = [
    { id: "user-1", name: "Alex Johnson" },
    { id: "user-2", name: "Sarah Wilson" },
    { id: "user-3", name: "James Smith" },
    { id: "user-4", name: "David Brown" },
    { id: "user-5", name: "Maria Garcia" },
    { id: "user-6", name: "Robert Lee" },
  ]

  // Handle checkbox change for categories, statuses, tags, and users
  const handleCheckboxChange = (field: string, id: string, checked: boolean) => {
    setFilters((prev) => {
      if (checked) {
        return { ...prev, [field]: [...prev[field], id] }
      } else {
        return { ...prev, [field]: prev[field].filter((item: string) => item !== id) }
      }
    })
  }

  // Handle slider change for impact and feasibility ranges
  const handleSliderChange = (field: string, value: number[]) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  // Handle input change for search term, dates, etc.
  const handleInputChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  // Handle select change for timeframe, sort by, and sort direction
  const handleSelectChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  // Handle toggle change for confidential and has documents
  const handleToggleChange = (field: string, checked: boolean) => {
    setFilters((prev) => ({ ...prev, [field]: checked }))
  }

  // Handle apply filters
  const handleApplyFilters = () => {
    onApplyFilters(filters)
    setOpen(false)
  }

  // Handle reset filters
  const handleResetFilters = () => {
    setFilters({
      searchTerm: "",
      categories: [],
      statuses: [],
      tags: [],
      impactRange: [0, 100],
      feasibilityRange: [0, 100],
      timeframe: "all",
      createdAfter: "",
      createdBefore: "",
      createdBy: [],
      isConfidential: false,
      hasDocuments: false,
      sortBy: "newest",
      sortDirection: "desc",
    })
    onResetFilters()
  }

  // Count active filters
  const countActiveFilters = () => {
    let count = 0
    if (filters.searchTerm) count++
    if (filters.categories.length > 0) count++
    if (filters.statuses.length > 0) count++
    if (filters.tags.length > 0) count++
    if (filters.impactRange[0] > 0 || filters.impactRange[1] < 100) count++
    if (filters.feasibilityRange[0] > 0 || filters.feasibilityRange[1] < 100) count++
    if (filters.timeframe !== "all") count++
    if (filters.createdAfter) count++
    if (filters.createdBefore) count++
    if (filters.createdBy.length > 0) count++
    if (filters.isConfidential) count++
    if (filters.hasDocuments) count++
    if (filters.sortBy !== "newest") count++
    if (filters.sortDirection !== "desc") count++
    return count
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Advanced Filters</span>
          {countActiveFilters() > 0 && (
            <Badge variant="secondary" className="ml-1">
              {countActiveFilters()}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Advanced Search Filters</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6 py-4">
            {/* Search Term */}
            <div className="space-y-2">
              <Label htmlFor="searchTerm">Search Term</Label>
              <Input
                id="searchTerm"
                placeholder="Search in title and description"
                value={filters.searchTerm}
                onChange={(e) => handleInputChange("searchTerm", e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <Label>Categories</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableCategories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={filters.categories.includes(category.id)}
                      onCheckedChange={(checked) => handleCheckboxChange("categories", category.id, checked as boolean)}
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Statuses */}
            <div className="space-y-2">
              <Label>Statuses</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableStatuses.map((status) => (
                  <div key={status.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status.id}`}
                      checked={filters.statuses.includes(status.id)}
                      onCheckedChange={(checked) => handleCheckboxChange("statuses", status.id, checked as boolean)}
                    />
                    <label
                      htmlFor={`status-${status.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {status.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={filters.tags.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleCheckboxChange("tags", tag.id, !filters.tags.includes(tag.id))}
                  >
                    {tag.name}
                    {filters.tags.includes(tag.id) && <X className="ml-1 h-3 w-3" />}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Impact Range */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Impact Score</Label>
                <span className="text-xs text-muted-foreground">
                  {filters.impactRange[0]}% - {filters.impactRange[1]}%
                </span>
              </div>
              <Slider
                defaultValue={filters.impactRange}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => handleSliderChange("impactRange", value)}
              />
            </div>

            {/* Feasibility Range */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Feasibility Score</Label>
                <span className="text-xs text-muted-foreground">
                  {filters.feasibilityRange[0]}% - {filters.feasibilityRange[1]}%
                </span>
              </div>
              <Slider
                defaultValue={filters.feasibilityRange}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => handleSliderChange("feasibilityRange", value)}
              />
            </div>

            {/* Timeframe */}
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select value={filters.timeframe} onValueChange={(value) => handleSelectChange("timeframe", value)}>
                <SelectTrigger id="timeframe">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Timeframes</SelectItem>
                  <SelectItem value="short">Short Term</SelectItem>
                  <SelectItem value="medium">Medium Term</SelectItem>
                  <SelectItem value="long">Long Term</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Created Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="createdAfter">Created After</Label>
                <Input
                  id="createdAfter"
                  type="date"
                  value={filters.createdAfter}
                  onChange={(e) => handleInputChange("createdAfter", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="createdBefore">Created Before</Label>
                <Input
                  id="createdBefore"
                  type="date"
                  value={filters.createdBefore}
                  onChange={(e) => handleInputChange("createdBefore", e.target.value)}
                />
              </div>
            </div>

            {/* Created By */}
            <div className="space-y-2">
              <Label>Created By</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={filters.createdBy.includes(user.id)}
                      onCheckedChange={(checked) => handleCheckboxChange("createdBy", user.id, checked as boolean)}
                    />
                    <label
                      htmlFor={`user-${user.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {user.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Filters */}
            <div className="space-y-2">
              <Label>Additional Filters</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isConfidential"
                    checked={filters.isConfidential}
                    onCheckedChange={(checked) => handleToggleChange("isConfidential", checked as boolean)}
                  />
                  <label
                    htmlFor="isConfidential"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Confidential Ideas Only
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasDocuments"
                    checked={filters.hasDocuments}
                    onCheckedChange={(checked) => handleToggleChange("hasDocuments", checked as boolean)}
                  />
                  <label
                    htmlFor="hasDocuments"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Has Documents
                  </label>
                </div>
              </div>
            </div>

            {/* Sort Options */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sortBy">Sort By</Label>
                <Select value={filters.sortBy} onValueChange={(value) => handleSelectChange("sortBy", value)}>
                  <SelectTrigger id="sortBy">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Created Date</SelectItem>
                    <SelectItem value="updated">Updated Date</SelectItem>
                    <SelectItem value="impact">Impact Score</SelectItem>
                    <SelectItem value="feasibility">Feasibility Score</SelectItem>
                    <SelectItem value="votes">Votes</SelectItem>
                    <SelectItem value="comments">Comments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortDirection">Sort Direction</Label>
                <Select
                  value={filters.sortDirection}
                  onValueChange={(value) => handleSelectChange("sortDirection", value)}
                >
                  <SelectTrigger id="sortDirection">
                    <SelectValue placeholder="Sort direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="flex justify-between">
          <Button variant="outline" onClick={handleResetFilters}>
            Reset Filters
          </Button>
          <Button onClick={handleApplyFilters}>
            <Check className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
