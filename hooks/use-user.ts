"use client"

import type React from "react"

import { createContext, useContext } from "react"
import { useLocalStorage } from "@/lib/data-persistence"
import { useToast } from "@/hooks/use-toast"

// Define user types and permissions
export type UserRole = "admin" | "manager" | "user" | "guest"

export type Permission = "create" | "read" | "update" | "delete" | "approve" | "convert" | "comment" | "vote"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  permissions: Permission[]
}

// Mock users for authentication
const mockUsers = [
  {
    id: "user-1",
    name: "Alex Johnson",
    email: "alex@example.com",
    password: "password123",
    avatar: "/person-with-glasses.png",
    role: "admin",
    permissions: ["create", "read", "update", "delete", "approve", "convert", "comment", "vote"],
  },
  {
    id: "user-2",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    password: "password123",
    avatar: "/short-haired-person.png",
    role: "manager",
    permissions: ["create", "read", "update", "approve", "convert", "comment", "vote"],
  },
  {
    id: "user-3",
    name: "James Smith",
    email: "james@example.com",
    password: "password123",
    avatar: "/person-dark-hair.png",
    role: "user",
    permissions: ["create", "read", "comment", "vote"],
  },
  {
    id: "user-4",
    name: "Guest User",
    email: "guest@example.com",
    password: "guest123",
    avatar: "/placeholder.svg",
    role: "guest",
    permissions: ["read"],
  },
]

// Define the context type
interface UserContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  hasPermission: (permission: Permission) => boolean
  isAdmin: () => boolean
  isManager: () => boolean
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined)

// Provider component
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>("ideaforge-user", null)
  const { toast } = useToast()

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (foundUser) {
      // Remove password from user object
      const { password, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword as User)
    } else {
      throw new Error("Invalid email or password")
    }
  }

  // Logout function
  const logout = () => {
    setUser(null)
  }

  // Check if user has a specific permission
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false
    return user.permissions.includes(permission)
  }

  // Check if user is an admin
  const isAdmin = (): boolean => {
    if (!user) return false
    return user.role === "admin"
  }

  // Check if user is a manager
  const isManager = (): boolean => {
    if (!user) return false
    return user.role === "manager" || user.role === "admin"
  }

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        hasPermission,
        isAdmin,
        isManager,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

// Hook to use the user context
export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
