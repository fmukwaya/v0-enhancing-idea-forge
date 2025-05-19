"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { IdeaCreationForm } from "@/components/idea-management/idea-creation-form"
import { ArrowLeft } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export default function CreateIdeaPage() {
  const router = useRouter()
  const { hasPermission } = useUser()
  const { toast } = useToast()

  // Check if user has permission to create ideas
  useEffect(() => {
    if (!hasPermission("create")) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to create ideas.",
        variant: "destructive",
      })
      router.push("/")
    }
  }, [hasPermission, router, toast])

  const handleSubmit = (values: any) => {
    console.log("Form submitted:", values)

    // Show success toast
    toast({
      title: "Idea Created",
      description: "Your idea has been created successfully.",
    })

    // Redirect to home page
    router.push("/")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-10">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Create New Idea</h1>
        </div>

        <IdeaCreationForm onSubmit={handleSubmit} />
      </div>
    </DashboardLayout>
  )
}
