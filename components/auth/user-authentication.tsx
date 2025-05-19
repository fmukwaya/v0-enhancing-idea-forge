"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@/hooks/use-toast"
import { useLocalStorage } from "@/lib/data-persistence"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useUser } from "@/hooks/use-user" // Import the useUser hook

// Form schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean().optional(),
})

const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

// Types
type LoginFormValues = z.infer<typeof loginSchema>
type RegisterFormValues = z.infer<typeof registerSchema>
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

interface UserAuthenticationProps {
  onSuccess?: (user: any) => void
  redirectUrl?: string
  appearance?: "default" | "minimal" | "embedded"
  defaultTab?: "login" | "register" | "forgot-password"
}

// Mock user data
const mockUsers = [
  {
    id: "user-1",
    name: "Alex Johnson",
    email: "alex@example.com",
    password: "password123",
    avatar: "/person-with-glasses.png",
    role: "admin",
  },
  {
    id: "user-2",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    password: "password123",
    avatar: "/short-haired-person.png",
    role: "user",
  },
]

export function UserAuthentication({
  onSuccess,
  redirectUrl = "/dashboard",
  appearance = "default",
  defaultTab = "login",
}: UserAuthenticationProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useLocalStorage<any | null>("ideaforge-user", null)
  const { login, logout } = useUser() // Use the useUser hook

  const router = useRouter()
  const { toast } = useToast()

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  })

  // Forgot password form
  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  // Handle login
  const handleLogin = async (values: LoginFormValues) => {
    setIsLoading(true)

    try {
      await login(values.email, values.password)
      // Show success toast
      toast({
        title: "Login successful",
        description: `Welcome back!`,
      })

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(user)
      } else {
        // Redirect to specified URL
        router.push(redirectUrl)
      }
    } catch (error: any) {
      console.error("Login error:", error)

      // Show error toast
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle registration
  const handleRegister = async (values: RegisterFormValues) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Check if email already exists
      const existingUser = mockUsers.find((u) => u.email === values.email)

      if (existingUser) {
        // Show error toast
        toast({
          title: "Registration failed",
          description: "An account with this email already exists.",
          variant: "destructive",
        })
        return
      }

      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        name: values.name,
        email: values.email,
        avatar: "/placeholder.svg",
        role: "user",
        permissions: ["create", "read", "update"],
      }

      // Set user in local storage
      setUser(newUser)

      // Show success toast
      toast({
        title: "Registration successful",
        description: `Welcome to IdeaForge, ${values.name}!`,
      })

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(newUser)
      } else {
        // Redirect to specified URL
        router.push(redirectUrl)
      }
    } catch (error) {
      console.error("Registration error:", error)

      // Show error toast
      toast({
        title: "Registration failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle forgot password
  const handleForgotPassword = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Check if email exists
      const existingUser = mockUsers.find((u) => u.email === values.email)

      if (!existingUser) {
        // Show error toast
        toast({
          title: "Password reset failed",
          description: "No account found with this email address.",
          variant: "destructive",
        })
        return
      }

      // Show success toast
      toast({
        title: "Password reset email sent",
        description: "Check your email for instructions to reset your password.",
      })

      // Switch back to login tab
      setActiveTab("login")
    } catch (error) {
      console.error("Forgot password error:", error)

      // Show error toast
      toast({
        title: "Password reset failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle logout
  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Render content based on appearance
  const renderContent = () => {
    if (appearance === "minimal") {
      return <div className="flex flex-col items-center justify-center h-full">{/* Minimal appearance content */}</div>
    }

    if (appearance === "embedded") {
      return (
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full bg-muted/50">
              <TabsTrigger value="login" className="flex-1">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="flex-1">
                Register
              </TabsTrigger>
              <TabsTrigger value="forgot-password" className="flex-1">
                Forgot Password
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-6 mt-6">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-8"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Remember me</FormLabel>
                          <FormDescription>Keep me signed in for longer</FormDescription>
                        </div>
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="register" className="space-y-6 mt-6">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-8"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center p-4 rounded-lg border">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Accept Terms & Conditions</FormLabel>
                          <FormDescription>I agree to the terms and conditions of IdeaForge.</FormDescription>
                        </div>
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      "Register"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="forgot-password" className="space-y-6 mt-6">
              <Form {...forgotPasswordForm}>
                <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
                  <FormField
                    control={forgotPasswordForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending reset link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      )
    }

    // Default appearance
    return (
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>Login or register to access IdeaForge</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">{renderContent()}</CardContent>
      </Card>
    )
  }

  return (
    <>
      {user ? (
        <div className="flex items-center justify-between">
          <p>Welcome, {user.name}!</p>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      ) : (
        renderContent()
      )}
    </>
  )
}
