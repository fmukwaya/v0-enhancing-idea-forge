import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { UserProvider } from "@/hooks/use-user"
import { ErrorBoundary } from "@/lib/error-boundary"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>IdeaForge - Quantum-powered Innovation Management</title>
        <meta name="description" content="IdeaForge - Quantum-powered Innovation Management Platform" />
      </head>
      <body>
        <ErrorBoundary>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <UserProvider>{children}</UserProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
