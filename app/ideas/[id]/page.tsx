"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { IdeaCardDetails } from "@/components/idea-management/idea-card-details"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { NotificationSystem } from "@/components/notifications/notification-system"

// Mock data for ideas - in a real app, this would come from an API
const mockIdeas = [
  {
    id: "idea-1",
    title: "Quantum Interface Redesign",
    description:
      "Redesign our interface using quantum principles to create a more intuitive and responsive user experience. This will involve implementing non-linear navigation patterns and entangled state management.",
    category: "Product",
    tags: ["UX", "Quantum", "Design"],
    createdBy: {
      name: "Alex Johnson",
      avatar: "/person-with-glasses.png",
    },
    createdAt: "May 5, 2025",
    impactScore: 90,
    votes: 3,
    comments: 2,
    collaborators: [
      { id: "user-2", name: "Sarah Wilson", avatar: "/short-haired-person.png", role: "Product Designer" },
      { id: "user-3", name: "James Smith", avatar: "/person-dark-hair.png", role: "Developer" },
    ],
  },
  {
    id: "idea-2",
    title: "AI-Powered Customer Insights",
    description:
      "Implement an AI system that analyzes customer interactions across all touchpoints to provide deeper insights and predict future needs. This will help us proactively address customer requirements.",
    category: "Technology",
    tags: ["AI", "Customer Experience", "Analytics"],
    createdBy: {
      name: "James Smith",
      avatar: "/person-dark-hair.png",
    },
    createdAt: "April 21, 2025",
    impactScore: 95,
    votes: 2,
    comments: 2,
    collaborators: [
      { id: "user-5", name: "Maria Garcia", avatar: "/curly-haired-person.png", role: "Data Scientist" },
      { id: "user-4", name: "David Brown", avatar: "/person-with-glasses.png", role: "Product Manager" },
    ],
  },
  {
    id: "idea-3",
    title: "Biometric Authentication System",
    description:
      "Develop a multi-factor biometric authentication system that combines facial recognition, fingerprint scanning, and behavioral patterns for enhanced security across all our platforms.",
    category: "Security",
    tags: ["Security", "Biometrics", "Authentication"],
    createdBy: {
      name: "Maria Garcia",
      avatar: "/curly-haired-person.png",
    },
    createdAt: "May 13, 2025",
    impactScore: 85,
    votes: 2,
    comments: 1,
    collaborators: [
      { id: "user-3", name: "James Smith", avatar: "/person-dark-hair.png", role: "Developer" },
      { id: "user-6", name: "Robert Lee", avatar: "/person-with-beard.png", role: "Security Specialist" },
    ],
  },
  {
    id: "idea-4",
    title: "Quantum-Inspired Optimization Algorithm",
    description:
      "Develop a quantum-inspired algorithm for optimizing resource allocation and scheduling across our infrastructure, potentially reducing operational costs by 30% while improving performance.",
    category: "Technology",
    tags: ["Quantum", "Optimization", "Infrastructure"],
    createdBy: {
      name: "Alex Johnson",
      avatar: "/person-with-glasses.png",
    },
    createdAt: "May 14, 2025",
    impactScore: 95,
    votes: 0,
    comments: 0,
    collaborators: [{ id: "user-5", name: "Maria Garcia", avatar: "/curly-haired-person.png", role: "Data Scientist" }],
  },
]

export default function IdeaDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [idea, setIdea] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchIdea = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        const foundIdea = mockIdeas.find((i) => i.id === params.id)

        if (foundIdea) {
          setIdea(foundIdea)
        } else {
          // Handle not found
          console.error(`Idea with ID ${params.id} not found`)
          router.push("/") // Redirect to home if idea not found
        }
      } catch (error) {
        console.error("Error fetching idea:", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchIdea()
    }
  }, [params.id, router])

  return (
    <DashboardLayout>
      <div className="fixed bottom-4 right-4 z-50">
        <NotificationSystem initialExpanded={false} position="bottom-right" />
      </div>

      <div className="space-y-6 pb-10">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Idea Details</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-quantum-600" />
          </div>
        ) : idea ? (
          <IdeaCardDetails
            ideaId={idea.id}
            ideaTitle={idea.title}
            ideaDescription={idea.description}
            ideaCategory={idea.category}
            ideaTags={idea.tags}
            ideaCreatedBy={idea.createdBy}
            ideaCreatedAt={idea.createdAt}
            ideaImpactScore={idea.impactScore}
            ideaVotes={idea.votes}
            ideaComments={idea.comments}
            ideaCollaborators={idea.collaborators}
          />
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <h3 className="mt-4 text-lg font-medium">Idea not found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              The idea you're looking for doesn't exist or has been removed.
            </p>
            <Button className="mt-4" onClick={() => router.push("/")}>
              Return to Dashboard
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
