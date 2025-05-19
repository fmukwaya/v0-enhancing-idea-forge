"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"

// Types
export type ViewMode = "desktop" | "tablet" | "mobile"
export type LayoutType = "sidebar" | "stacked" | "tabbed" | "drawer" | "split"

interface MobileResponsiveLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  header?: React.ReactNode
  footer?: React.ReactNode
  layoutType?: LayoutType
  sidebarWidth?: string
  sidebarPosition?: "left" | "right"
  showBackButton?: boolean
  onBack?: () => void
  title?: string
  className?: string
}

// Breakpoints
const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
}

// Hook for detecting device type
export function useDeviceDetection() {
  const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.mobile}px)`)
  const isTablet = useMediaQuery(`(min-width: ${BREAKPOINTS.mobile + 1}px) and (max-width: ${BREAKPOINTS.tablet}px)`)
  const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.tablet + 1}px)`)

  const viewMode: ViewMode = isMobile ? "mobile" : isTablet ? "tablet" : "desktop"

  return {
    isMobile,
    isTablet,
    isDesktop,
    viewMode,
  }
}

// Mobile Responsive Layout Component
export function MobileResponsiveLayout({
  children,
  sidebar,
  header,
  footer,
  layoutType = "sidebar",
  sidebarWidth = "280px",
  sidebarPosition = "left",
  showBackButton = false,
  onBack,
  title,
  className = "",
}: MobileResponsiveLayoutProps) {
  const { viewMode, isMobile, isTablet } = useDeviceDetection()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<number>(0)

  // Determine if we should use a mobile layout
  const useMobileLayout = isMobile || (isTablet && layoutType !== "split")

  // Handle back button click
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack()
    } else {
      window.history.back()
    }
  }, [onBack])

  // Close sidebar when changing to desktop view
  useEffect(() => {
    if (!useMobileLayout) {
      setSidebarOpen(false)
    }
  }, [useMobileLayout])

  // Render sidebar for mobile
  const renderMobileSidebar = () => {
    if (!sidebar) return null

    if (layoutType === "drawer") {
      return (
        <Drawer open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="px-4 py-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="absolute right-4 top-4"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
              <div className="mt-8">{sidebar}</div>
            </div>
          </DrawerContent>
        </Drawer>
      )
    }

    return (
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side={sidebarPosition} className="w-[80vw] sm:w-[350px]">
          {sidebar}
        </SheetContent>
      </Sheet>
    )
  }

  // Render content based on layout type and device
  const renderContent = () => {
    // Mobile layouts
    if (useMobileLayout) {
      if (layoutType === "tabbed" && Array.isArray(children)) {
        // Tabbed layout for mobile
        return (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-hidden">{Array.isArray(children) ? children[activeSection] : children}</div>
            <div className="flex border-t">
              {Array.isArray(children) &&
                children.map((_, index) => (
                  <Button
                    key={index}
                    variant={activeSection === index ? "default" : "ghost"}
                    className="flex-1 rounded-none h-14"
                    onClick={() => setActiveSection(index)}
                  >
                    {`Tab ${index + 1}`}
                  </Button>
                ))}
            </div>
          </div>
        )
      }

      // Stacked layout for mobile
      return (
        <div className="flex flex-col h-full">
          <div className="flex items-center h-14 px-4 border-b">
            {showBackButton && (
              <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back</span>
              </Button>
            )}
            {renderMobileSidebar()}
            {title && <h1 className="text-lg font-medium ml-2">{title}</h1>}
          </div>
          <div className="flex-1 overflow-auto">
            <ScrollArea className="h-full">{children}</ScrollArea>
          </div>
          {footer && <div className="border-t">{footer}</div>}
        </div>
      )
    }

    // Desktop layouts
    if (layoutType === "sidebar" && sidebar) {
      return (
        <div className="flex h-full">
          <div
            className={`hidden md:block border-r ${sidebarPosition === "left" ? "order-first" : "order-last"}`}
            style={{ width: sidebarWidth }}
          >
            <ScrollArea className="h-full">{sidebar}</ScrollArea>
          </div>
          <div className="flex-1 flex flex-col h-full">
            {header && <div className="border-b">{header}</div>}
            <div className="flex-1 overflow-auto">
              <ScrollArea className="h-full">{children}</ScrollArea>
            </div>
            {footer && <div className="border-t">{footer}</div>}
          </div>
        </div>
      )
    }

    if (layoutType === "split" && sidebar) {
      return (
        <div className="flex h-full">
          <div
            className={`hidden lg:block border-r ${sidebarPosition === "left" ? "order-first" : "order-last"}`}
            style={{ width: sidebarWidth }}
          >
            <ScrollArea className="h-full">{sidebar}</ScrollArea>
          </div>
          <div className="flex-1 flex flex-col h-full">
            {header && <div className="border-b">{header}</div>}
            <div className="flex-1 overflow-auto">
              <ScrollArea className="h-full">{children}</ScrollArea>
            </div>
            {footer && <div className="border-t">{footer}</div>}
          </div>
        </div>
      )
    }

    // Default stacked layout
    return (
      <div className="flex flex-col h-full">
        {header && <div className="border-b">{header}</div>}
        <div className="flex-1 overflow-auto">
          <ScrollArea className="h-full">{children}</ScrollArea>
        </div>
        {footer && <div className="border-t">{footer}</div>}
      </div>
    )
  }

  return <div className={`h-full ${className}`}>{renderContent()}</div>
}

// Mobile Navigation Component
interface MobileNavigationProps {
  items: Array<{
    label: string
    icon?: React.ReactNode
    onClick: () => void
    active?: boolean
  }>
  position?: "bottom" | "top"
  className?: string
}

export function MobileNavigation({ items, position = "bottom", className = "" }: MobileNavigationProps) {
  const { isMobile } = useDeviceDetection()

  if (!isMobile) return null

  return (
    <div
      className={`fixed ${
        position === "bottom" ? "bottom-0" : "top-0"
      } left-0 right-0 bg-background border-t z-50 ${className}`}
    >
      <div className="flex justify-around">
        {items.map((item, index) => (
          <Button
            key={index}
            variant={item.active ? "default" : "ghost"}
            className="flex-1 flex flex-col items-center py-3 h-auto rounded-none"
            onClick={item.onClick}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

// Mobile Pagination Component
interface MobilePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function MobilePagination({ currentPage, totalPages, onPageChange, className = "" }: MobilePaginationProps) {
  const { isMobile } = useDeviceDetection()

  if (!isMobile) return null

  return (
    <div className={`flex items-center justify-between p-4 ${className}`}>
      <Button variant="outline" size="icon" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}>
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  )
}

// Mobile Action Button Component
interface MobileActionButtonProps {
  icon: React.ReactNode
  onClick: () => void
  label?: string
  variant?: "primary" | "secondary" | "outline" | "ghost"
  className?: string
}

export function MobileActionButton({
  icon,
  onClick,
  label,
  variant = "primary",
  className = "",
}: MobileActionButtonProps) {
  const { isMobile } = useDeviceDetection()

  if (!isMobile) return null

  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  }

  return (
    <button
      className={`fixed bottom-20 right-4 rounded-full w-14 h-14 flex items-center justify-center shadow-lg ${
        variantClasses[variant]
      } ${className}`}
      onClick={onClick}
    >
      {icon}
      {label && <span className="sr-only">{label}</span>}
    </button>
  )
}
