"use client"

import type React from "react"

import { useState } from "react"
import { ThemeToggle } from "../theme/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Menu, Search, X, Lightbulb, Users, Briefcase, BarChart2, Settings, LogOut, Plus } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { IdeaCreationForm } from "../idea-management/idea-creation-form"

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}

const NavItem = ({ icon, label, active, onClick }: NavItemProps) => (
  <Button
    variant="ghost"
    className={cn(
      "flex items-center gap-2 w-full justify-start",
      active
        ? "bg-quantum-100 text-quantum-900 dark:bg-quantum-800 dark:text-quantum-50"
        : "text-muted-foreground hover:text-foreground",
    )}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </Button>
)

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCreateIdeaOpen, setIsCreateIdeaOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-6 py-4">
                <div className="flex items-center gap-2 px-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-quantum-400 to-quantum-600 flex items-center justify-center">
                    <Lightbulb className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold text-lg">IdeaForge</span>
                </div>
                <div className="flex flex-col gap-1">
                  <NavItem icon={<Lightbulb className="h-4 w-4" />} label="Ideas" active />
                  <NavItem icon={<Users className="h-4 w-4" />} label="Workspace" />
                  <NavItem icon={<Briefcase className="h-4 w-4" />} label="Projects" />
                  <NavItem icon={<BarChart2 className="h-4 w-4" />} label="Analytics" />
                  <NavItem icon={<Settings className="h-4 w-4" />} label="Settings" />
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="hidden md:flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-quantum-400 to-quantum-600 flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg">IdeaForge</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <NavItem icon={<Lightbulb className="h-4 w-4" />} label="Ideas" active />
            <NavItem icon={<Users className="h-4 w-4" />} label="Workspace" />
            <NavItem icon={<Briefcase className="h-4 w-4" />} label="Projects" />
            <NavItem icon={<BarChart2 className="h-4 w-4" />} label="Analytics" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <div className="flex items-center gap-2 bg-background border rounded-md px-2 animate-in fade-in-0 zoom-in-95">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-9"
                placeholder="Search ideas..."
                autoFocus
              />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsSearchOpen(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close search</span>
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <Dialog open={isCreateIdeaOpen} onOpenChange={setIsCreateIdeaOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="hidden md:flex">
                <Plus className="h-4 w-4 mr-2" />
                New Idea
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px]">
              <IdeaCreationForm onSubmit={() => setIsCreateIdeaOpen(false)} />
            </DialogContent>
          </Dialog>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            <span className="sr-only">Notifications</span>
          </Button>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/person-with-glasses.png" alt="User" />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="h-4 w-4 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
