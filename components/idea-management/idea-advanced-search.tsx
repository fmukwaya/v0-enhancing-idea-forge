"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Check, ChevronsUpDown, Search, X, SlidersHorizontal, CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

const categories = [
  { value: "product", label: "Product" },
  { value: "marketing", label: "Marketing" },
  { value: "operations", label: "Operations" },
  { value: "customer-service", label: "Customer Service" },
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "hr", label: "Human Resources" },
]

const statuses = [
  { value: "new", label: "New" },
  { value: "under-review", label: "Under Review" },
  { value: "approved", label: "Approved" },
  { value: "in-progress", label: "In Progress" },
  { value: "implemented", label: "Implemented" },
  { value: "rejected", label: "Rejected" },
]

const users = [
  { value: "alex-johnson", label: "Alex Johnson" },
  { value: "maria-garcia", label: "Maria Garcia" },
  { value: "james-smith", label: "James Smith" },
  { value: "sarah-wilson", label: "Sarah Wilson" },
  { value: "david-brown", label: "David Brown" },
  { value: "lisa-miller", label: "Lisa Miller" },
]

interface FilterBadgeProps {
  label: string
  value: string
  onRemove: () => void
}

const FilterBadge = ({ label, value, onRemove }: FilterBadgeProps) => {
  return (
    <Badge
      variant="secondary"
      className="flex items-center gap-1 px-2 py-1 bg-quantum-100 text-quantum-800 dark:bg-quantum-800 dark:text-quantum-200"
    >
      <span className="text-xs font-normal">{label}:</span>
      <span className="text-xs font-medium">{value}</span>
      <X className="h-3 w-3 cursor-pointer" onClick={onRemove} />
    </Badge>
  )
}

interface IdeaAdvancedSearchProps {
  onSearch: (filters: any) => void
}

export function IdeaAdvancedSearch({ onSearch }: IdeaAdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [impactRange, setImpactRange] = useState([0, 100])
  const [activeFilters, setActiveFilters] = useState<Array<{ type: string; value: string; label: string }>>([])

  const handleSearch = () => {
    const filters = {
      searchTerm,
      category: selectedCategory,
      status: selectedStatus,
      creator: selectedCreator,
      dateRange,
      impactRange,
    }
    onSearch(filters)
  }

  const handleReset = () => {
    setSearchTerm("")
    setSelectedCategory(null)
    setSelectedStatus(null)
    setSelectedCreator(null)
    setDateRange({ from: undefined, to: undefined })
    setImpactRange([0, 100])
    setActiveFilters([])
  }

  const addFilter = (type: string, value: string, label: string) => {
    if (!value) return

    // Check if filter already exists
    const exists = activeFilters.some((filter) => filter.type === type)

    if (exists) {
      // Replace existing filter
      setActiveFilters(activeFilters.map((filter) => (filter.type === type ? { type, value, label } : filter)))
    } else {
      // Add new filter
      setActiveFilters([...activeFilters, { type, value, label }])
    }
  }

  const removeFilter = (type: string) => {
    setActiveFilters(activeFilters.filter((filter) => filter.type !== type))

    // Reset the corresponding state
    switch (type) {
      case "category":
        setSelectedCategory(null)
        break
      case "status":
        setSelectedStatus(null)
        break
      case "creator":
        setSelectedCreator(null)
        break
      case "dateRange":
        setDateRange({ from: undefined, to: undefined })
        break
      default:
        break
    }
  }

  return (
    <Card className="w-full border-quantum-600/20 bg-gradient-to-br from-white to-quantum-50/30 dark:from-quantum-950 dark:to-quantum-900">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-quantum tracking-tight flex items-center justify-between">
          <span>Search Ideas</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-quantum-600 hover:text-quantum-800 dark:text-quantum-400 dark:hover:text-quantum-200"
          >
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            {isExpanded ? "Simple Search" : "Advanced Search"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, description, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white dark:bg-quantum-900"
              />
            </div>
            <Button onClick={handleSearch} className="bg-quantum-600 hover:bg-quantum-700 text-white">
              Search
            </Button>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {activeFilters.map((filter) => (
                <FilterBadge
                  key={filter.type}
                  label={filter.type}
                  value={filter.label}
                  onRemove={() => removeFilter(filter.type)}
                />
              ))}
              {activeFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-xs h-6 px-2 text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </Button>
              )}
            </div>
          )}

          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between bg-white dark:bg-quantum-900"
                    >
                      {selectedCategory
                        ? categories.find((category) => category.value === selectedCategory)?.label
                        : "Select category"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search categories..." />
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {categories.map((category) => (
                          <CommandItem
                            key={category.value}
                            value={category.value}
                            onSelect={(currentValue) => {
                              const value = currentValue === selectedCategory ? "" : currentValue
                              setSelectedCategory(value || null)
                              if (value) {
                                addFilter("category", value, category.label)
                              }
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCategory === category.value ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {category.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between bg-white dark:bg-quantum-900"
                    >
                      {selectedStatus
                        ? statuses.find((status) => status.value === selectedStatus)?.label
                        : "Select status"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search statuses..." />
                      <CommandEmpty>No status found.</CommandEmpty>
                      <CommandGroup>
                        {statuses.map((status) => (
                          <CommandItem
                            key={status.value}
                            value={status.value}
                            onSelect={(currentValue) => {
                              const value = currentValue === selectedStatus ? "" : currentValue
                              setSelectedStatus(value || null)
                              if (value) {
                                addFilter("status", value, status.label)
                              }
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedStatus === status.value ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {status.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Created By</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between bg-white dark:bg-quantum-900"
                    >
                      {selectedCreator ? users.find((user) => user.value === selectedCreator)?.label : "Select user"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search users..." />
                      <CommandEmpty>No user found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {users.map((user) => (
                            <CommandItem
                              key={user.value}
                              value={user.value}
                              onSelect={(currentValue) => {
                                const value = currentValue === selectedCreator ? "" : currentValue
                                setSelectedCreator(value || null)
                                if (value) {
                                  addFilter("creator", value, user.label)
                                }
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedCreator === user.value ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {user.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-white dark:bg-quantum-900",
                        !dateRange.from && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(dateRange.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Select date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => {
                        setDateRange(range)
                        if (range.from && range.to) {
                          const fromStr = format(range.from, "LLL dd, y")
                          const toStr = format(range.to, "LLL dd, y")
                          addFilter("dateRange", "custom", `${fromStr} - ${toStr}`)
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Impact Score</label>
                  <span className="text-sm text-muted-foreground">
                    {impactRange[0]} - {impactRange[1]}
                  </span>
                </div>
                <Slider
                  defaultValue={[0, 100]}
                  min={0}
                  max={100}
                  step={1}
                  value={impactRange}
                  onValueChange={setImpactRange}
                  className="py-4"
                />
              </div>

              <div className="flex items-end space-x-2">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 border-quantum-200 dark:border-quantum-700 hover:bg-quantum-100 dark:hover:bg-quantum-800"
                >
                  Reset
                </Button>
                <Button onClick={handleSearch} className="flex-1 bg-quantum-600 hover:bg-quantum-700 text-white">
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
