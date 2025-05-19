import type React from "react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-quantum-50 to-white dark:from-quantum-950 dark:to-quantum-900">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  )
}
