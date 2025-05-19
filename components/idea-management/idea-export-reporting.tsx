"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Download,
  Share2,
  Calendar,
  FileText,
  BarChart2,
  MessageSquare,
  Paperclip,
  Clock,
  FileIcon as FilePdf,
  FileSpreadsheet,
  FileJson,
  Mail,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExportOptionProps {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

const ExportOption = ({ id, label, description, icon, checked, onCheckedChange }: ExportOptionProps) => {
  return (
    <div
      className="flex items-start space-x-3 p-3 border rounded-lg bg-white dark:bg-quantum-900 hover:bg-quantum-50 dark:hover:bg-quantum-800/50 cursor-pointer transition-colors"
      onClick={() => onCheckedChange(!checked)}
    >
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} className="mt-1" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {icon}
          <Label htmlFor={id} className="font-medium cursor-pointer">
            {label}
          </Label>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  )
}

interface ScheduleOptionProps {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  selected: boolean
  onSelect: () => void
}

const ScheduleOption = ({ id, label, description, icon, selected, onSelect }: ScheduleOptionProps) => {
  return (
    <div
      className={`flex items-start space-x-3 p-3 border rounded-lg ${
        selected
          ? "border-quantum-600 bg-quantum-50 dark:border-quantum-400 dark:bg-quantum-900/70"
          : "bg-white dark:bg-quantum-900 hover:bg-quantum-50 dark:hover:bg-quantum-800/50"
      } cursor-pointer transition-colors`}
      onClick={onSelect}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          {icon}
          <Label htmlFor={id} className="font-medium cursor-pointer">
            {label}
          </Label>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  )
}

interface IdeaExportReportingProps {
  ideaIds?: string[]
  onExport?: (format: string, options: any) => void
  onSchedule?: (schedule: any) => void
  onShare?: (recipients: string[], message: string) => void
}

export function IdeaExportReporting({ ideaIds = [], onExport, onSchedule, onShare }: IdeaExportReportingProps) {
  const [activeTab, setActiveTab] = useState("export")
  const [exportFormat, setExportFormat] = useState("pdf")
  const [selectedOptions, setSelectedOptions] = useState({
    includeAnalytics: true,
    includeComments: true,
    includeAttachments: false,
    includeHistory: false,
  })
  const [scheduleFrequency, setScheduleFrequency] = useState("weekly")
  const [selectedScheduleOption, setSelectedScheduleOption] = useState("weekly")
  const [recipients, setRecipients] = useState("")
  const [shareMessage, setShareMessage] = useState("")
  const { toast } = useToast()

  const handleExport = () => {
    if (onExport) {
      onExport(exportFormat, selectedOptions)
    } else {
      toast({
        title: "Export Started",
        description: `Exporting ${ideaIds.length > 0 ? ideaIds.length + " ideas" : "all ideas"} as ${exportFormat.toUpperCase()}`,
      })
    }
  }

  const handleSchedule = () => {
    if (onSchedule) {
      onSchedule({
        frequency: scheduleFrequency,
        options: selectedOptions,
      })
    } else {
      toast({
        title: "Report Scheduled",
        description: `Your ${selectedScheduleOption} report has been scheduled`,
      })
    }
  }

  const handleShare = () => {
    if (!recipients.trim()) {
      toast({
        title: "Missing Recipients",
        description: "Please enter at least one email address",
        variant: "destructive",
      })
      return
    }

    if (onShare) {
      onShare(
        recipients.split(",").map((email) => email.trim()),
        shareMessage,
      )
    } else {
      toast({
        title: "Ideas Shared",
        description: `Ideas shared with ${recipients.split(",").length} recipients`,
      })
    }
  }

  const handleOptionChange = (option: keyof typeof selectedOptions, checked: boolean) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [option]: checked,
    }))
  }

  const getFormatIcon = () => {
    switch (exportFormat) {
      case "pdf":
        return <FilePdf className="h-5 w-5 text-red-500" />
      case "excel":
        return <FileSpreadsheet className="h-5 w-5 text-green-600" />
      case "json":
        return <FileJson className="h-5 w-5 text-blue-500" />
      default:
        return <FileText className="h-5 w-5 text-quantum-600" />
    }
  }

  return (
    <Card className="w-full overflow-hidden border-quantum-600/20 bg-gradient-to-br from-white to-quantum-50/30 dark:from-quantum-950 dark:to-quantum-900">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-quantum tracking-tight">Idea Reports & Export</CardTitle>
            <CardDescription className="text-quantum-700 dark:text-quantum-300">
              {ideaIds.length > 0
                ? `Export or share ${ideaIds.length} selected ideas`
                : "Generate reports, export or share ideas"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-quantum-100/50 dark:bg-quantum-800/50">
            <TabsTrigger value="export" className="flex-1 flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex-1 flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Schedule Reports</span>
            </TabsTrigger>
            <TabsTrigger value="share" className="flex-1 flex items-center gap-1">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="export-format">Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger id="export-format" className="bg-white dark:bg-quantum-900">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="json">JSON Data</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Include in Export</Label>
              <div className="space-y-3">
                <ExportOption
                  id="include-analytics"
                  label="Analytics & Metrics"
                  description="Include performance metrics, scores, and analytics data"
                  icon={<BarChart2 className="h-5 w-5 text-quantum-600" />}
                  checked={selectedOptions.includeAnalytics}
                  onCheckedChange={(checked) => handleOptionChange("includeAnalytics", checked)}
                />
                <ExportOption
                  id="include-comments"
                  label="Comments & Feedback"
                  description="Include all comments and feedback on ideas"
                  icon={<MessageSquare className="h-5 w-5 text-quantum-600" />}
                  checked={selectedOptions.includeComments}
                  onCheckedChange={(checked) => handleOptionChange("includeComments", checked)}
                />
                <ExportOption
                  id="include-attachments"
                  label="Attachments"
                  description="Include all attached files and documents"
                  icon={<Paperclip className="h-5 w-5 text-quantum-600" />}
                  checked={selectedOptions.includeAttachments}
                  onCheckedChange={(checked) => handleOptionChange("includeAttachments", checked)}
                />
                <ExportOption
                  id="include-history"
                  label="Version History"
                  description="Include idea revision history and changes over time"
                  icon={<Clock className="h-5 w-5 text-quantum-600" />}
                  checked={selectedOptions.includeHistory}
                  onCheckedChange={(checked) => handleOptionChange("includeHistory", checked)}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-2 bg-quantum-600 hover:bg-quantum-700 text-white"
              >
                {getFormatIcon()}
                Export as {exportFormat.toUpperCase()}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Report Frequency</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <ScheduleOption
                  id="schedule-weekly"
                  label="Weekly Report"
                  description="Receive a summary report every Monday morning"
                  icon={<Calendar className="h-5 w-5 text-quantum-600" />}
                  selected={selectedScheduleOption === "weekly"}
                  onSelect={() => setSelectedScheduleOption("weekly")}
                />
                <ScheduleOption
                  id="schedule-monthly"
                  label="Monthly Report"
                  description="Receive a detailed report on the 1st of each month"
                  icon={<Calendar className="h-5 w-5 text-quantum-600" />}
                  selected={selectedScheduleOption === "monthly"}
                  onSelect={() => setSelectedScheduleOption("monthly")}
                />
                <ScheduleOption
                  id="schedule-quarterly"
                  label="Quarterly Report"
                  description="Receive a comprehensive report every three months"
                  icon={<Calendar className="h-5 w-5 text-quantum-600" />}
                  selected={selectedScheduleOption === "quarterly"}
                  onSelect={() => setSelectedScheduleOption("quarterly")}
                />
                <ScheduleOption
                  id="schedule-custom"
                  label="Custom Schedule"
                  description="Set up a custom reporting schedule"
                  icon={<Calendar className="h-5 w-5 text-quantum-600" />}
                  selected={selectedScheduleOption === "custom"}
                  onSelect={() => setSelectedScheduleOption("custom")}
                />
              </div>
            </div>

            {selectedScheduleOption === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="schedule-frequency">Custom Frequency</Label>
                <Select value={scheduleFrequency} onValueChange={setScheduleFrequency}>
                  <SelectTrigger id="schedule-frequency" className="bg-white dark:bg-quantum-900">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Report Contents</Label>
              <div className="space-y-3">
                <ExportOption
                  id="schedule-analytics"
                  label="Analytics & Metrics"
                  description="Include performance metrics, scores, and analytics data"
                  icon={<BarChart2 className="h-5 w-5 text-quantum-600" />}
                  checked={selectedOptions.includeAnalytics}
                  onCheckedChange={(checked) => handleOptionChange("includeAnalytics", checked)}
                />
                <ExportOption
                  id="schedule-comments"
                  label="Comments & Feedback"
                  description="Include all comments and feedback on ideas"
                  icon={<MessageSquare className="h-5 w-5 text-quantum-600" />}
                  checked={selectedOptions.includeComments}
                  onCheckedChange={(checked) => handleOptionChange("includeComments", checked)}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleSchedule}
                className="w-full flex items-center justify-center gap-2 bg-quantum-600 hover:bg-quantum-700 text-white"
              >
                <Calendar className="h-5 w-5" />
                Schedule {selectedScheduleOption === "custom" ? scheduleFrequency : selectedScheduleOption} Report
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="share" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="share-recipients">Recipients (comma separated)</Label>
              <Input
                id="share-recipients"
                placeholder="email@example.com, colleague@company.com"
                value={recipients}
                onChange={(e) => setRecipients(e.target.value)}
                className="bg-white dark:bg-quantum-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="share-message">Message (optional)</Label>
              <Textarea
                id="share-message"
                placeholder="I wanted to share these ideas with you..."
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                className="min-h-[100px] bg-white dark:bg-quantum-900"
              />
            </div>

            <div className="space-y-2">
              <Label>Include in Shared Report</Label>
              <div className="space-y-3">
                <ExportOption
                  id="share-analytics"
                  label="Analytics & Metrics"
                  description="Include performance metrics, scores, and analytics data"
                  icon={<BarChart2 className="h-5 w-5 text-quantum-600" />}
                  checked={selectedOptions.includeAnalytics}
                  onCheckedChange={(checked) => handleOptionChange("includeAnalytics", checked)}
                />
                <ExportOption
                  id="share-comments"
                  label="Comments & Feedback"
                  description="Include all comments and feedback on ideas"
                  icon={<MessageSquare className="h-5 w-5 text-quantum-600" />}
                  checked={selectedOptions.includeComments}
                  onCheckedChange={(checked) => handleOptionChange("includeComments", checked)}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 bg-quantum-600 hover:bg-quantum-700 text-white"
              >
                <Mail className="h-5 w-5" />
                Share with Recipients
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
