"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  Clock,
  FileText,
  GitBranch,
  GitMerge,
  GitPullRequest,
  Link2,
  Plus,
  RefreshCw,
  Trello,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProjectCardProps {
  id: string
  name: string
  description: string
  progress: number
  status: "active" | "completed" | "on-hold" | "planned"
  dueDate: string
  team: Array<{
    id: string
    name: string
    avatar?: string
  }>
  onConnect: () => void
  isConnected: boolean
}

const ProjectCard = ({
  id,
  name,
  description,
  progress,
  status,
  dueDate,
  team,
  onConnect,
  isConnected,
}: ProjectCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900"
      case "on-hold":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900"
      case "planned":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    }
  }

  return (
    <Card className="w-full overflow-hidden border-quantum-200 dark:border-quantum-800 hover:border-quantum-400 dark:hover:border-quantum-600 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium">{name}</CardTitle>
            <CardDescription className="line-clamp-2">{description}</CardDescription>
          </div>
          <Badge variant="outline" className={getStatusColor()}>
            {status.replace("-", " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1" />
          </div>

          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Due: {dueDate}</span>
            </div>
            <div className="flex -space-x-2">
              {team.slice(0, 3).map((member) => (
                <Avatar key={member.id} className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {team.length > 3 && (
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-quantum-100 dark:bg-quantum-800 text-xs font-medium border-2 border-background">
                  +{team.length - 3}
                </div>
              )}
            </div>
          </div>

          <Button variant={isConnected ? "secondary" : "default"} size="sm" className="w-full" onClick={onConnect}>
            {isConnected ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Connected
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4 mr-2" />
                Connect Idea to Project
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface TaskCardProps {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high" | "urgent"
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
  dueDate?: string
  onConnect: () => void
  isConnected: boolean
}

const TaskCard = ({
  id,
  title,
  description,
  status,
  priority,
  assignee,
  dueDate,
  onConnect,
  isConnected,
}: TaskCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900"
      case "review":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900"
      case "done":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    }
  }

  const getPriorityColor = () => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900"
      case "high":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900"
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900"
      case "low":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    }
  }

  return (
    <Card className="w-full overflow-hidden border-quantum-200 dark:border-quantum-800 hover:border-quantum-400 dark:hover:border-quantum-600 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className={getPriorityColor()}>
              {priority}
            </Badge>
            <Badge variant="outline" className={getStatusColor()}>
              {status.replace("-", " ")}
            </Badge>
          </div>
        </div>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            {assignee ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={assignee.avatar || "/placeholder.svg"} alt={assignee.name} />
                  <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{assignee.name}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Unassigned</span>
            )}

            {dueDate && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Due: {dueDate}</span>
              </div>
            )}
          </div>

          <Button variant={isConnected ? "secondary" : "default"} size="sm" className="w-full" onClick={onConnect}>
            {isConnected ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Connected
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4 mr-2" />
                Connect Idea to Task
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface GitCardProps {
  id: string
  repo: string
  branch: string
  description: string
  status: "open" | "merged" | "closed"
  commits: number
  author: {
    id: string
    name: string
    avatar?: string
  }
  updatedAt: string
  onConnect: () => void
  isConnected: boolean
}

const GitCard = ({
  id,
  repo,
  branch,
  description,
  status,
  commits,
  author,
  updatedAt,
  onConnect,
  isConnected,
}: GitCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "open":
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-900"
      case "merged":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900"
      case "closed":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "open":
        return <GitPullRequest className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      case "merged":
        return <GitMerge className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      case "closed":
        return <GitPullRequest className="h-4 w-4 text-red-600 dark:text-red-400" />
      default:
        return <GitPullRequest className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full overflow-hidden border-quantum-200 dark:border-quantum-800 hover:border-quantum-400 dark:hover:border-quantum-600 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-quantum-600" />
              <CardTitle className="text-lg font-medium">{repo}</CardTitle>
            </div>
            <CardDescription className="line-clamp-2 mt-1">{description}</CardDescription>
          </div>
          <Badge variant="outline" className={getStatusColor()}>
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              <span>{status}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{author.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-muted-foreground">
                <GitBranch className="h-4 w-4" />
                <span>{branch}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>{commits} commits</span>
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">Updated {updatedAt}</div>

          <Button variant={isConnected ? "secondary" : "default"} size="sm" className="w-full" onClick={onConnect}>
            {isConnected ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Connected
              </>
            ) : (
              <>
                <Link2 className="h-4 w-4 mr-2" />
                Connect Idea to Repository
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface IdeaIntegrationProps {
  ideaId: string
  ideaTitle: string
  connectedProjects?: string[]
  connectedTasks?: string[]
  connectedRepos?: string[]
  onConnectProject?: (projectId: string) => void
  onDisconnectProject?: (projectId: string) => void
  onConnectTask?: (taskId: string) => void
  onDisconnectTask?: (taskId: string) => void
  onConnectRepo?: (repoId: string) => void
  onDisconnectRepo?: (repoId: string) => void
  onCreateProject?: (projectData: any) => void
  onCreateTask?: (taskData: any) => void
}

export function IdeaIntegration({
  ideaId,
  ideaTitle,
  connectedProjects = [],
  connectedTasks = [],
  connectedRepos = [],
  onConnectProject,
  onDisconnectProject,
  onConnectTask,
  onDisconnectTask,
  onConnectRepo,
  onDisconnectRepo,
  onCreateProject,
  onCreateTask,
}: IdeaIntegrationProps) {
  const [activeTab, setActiveTab] = useState("projects")
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    dueDate: "",
  })
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  })
  const { toast } = useToast()

  // Mock data for projects
  const projects = [
    {
      id: "project-1",
      name: "Quantum Interface Redesign",
      description: "Redesign the quantum interface to improve user experience and accessibility",
      progress: 65,
      status: "active" as const,
      dueDate: "Jun 15, 2025",
      team: [
        { id: "user-1", name: "Alex Johnson", avatar: "/person-with-glasses.png" },
        { id: "user-2", name: "Maria Garcia", avatar: "/curly-haired-person.png" },
        { id: "user-3", name: "James Smith", avatar: "/person-dark-hair.png" },
      ],
    },
    {
      id: "project-2",
      name: "Temporal Intelligence Integration",
      description: "Integrate temporal intelligence features into the core platform",
      progress: 30,
      status: "active" as const,
      dueDate: "Jul 22, 2025",
      team: [
        { id: "user-2", name: "Maria Garcia", avatar: "/curly-haired-person.png" },
        { id: "user-4", name: "Sarah Wilson", avatar: "/short-haired-person.png" },
      ],
    },
    {
      id: "project-3",
      name: "Cognitive Load Optimization",
      description: "Optimize cognitive load across all platform interfaces",
      progress: 100,
      status: "completed" as const,
      dueDate: "May 5, 2025",
      team: [
        { id: "user-1", name: "Alex Johnson", avatar: "/person-with-glasses.png" },
        { id: "user-3", name: "James Smith", avatar: "/person-dark-hair.png" },
        { id: "user-5", name: "David Brown", avatar: "/short-haired-person.png" },
        { id: "user-6", name: "Lisa Miller", avatar: "/person-with-glasses.png" },
      ],
    },
  ]

  // Mock data for tasks
  const tasks = [
    {
      id: "task-1",
      title: "Research quantum visualization techniques",
      description: "Conduct research on the latest quantum visualization techniques and their applications",
      status: "in-progress" as const,
      priority: "high" as const,
      assignee: { id: "user-1", name: "Alex Johnson", avatar: "/person-with-glasses.png" },
      dueDate: "May 28, 2025",
    },
    {
      id: "task-2",
      title: "Create prototype for dimensional navigation",
      description: "Develop a prototype for the new dimensional navigation system",
      status: "todo" as const,
      priority: "medium" as const,
      assignee: { id: "user-2", name: "Maria Garcia", avatar: "/curly-haired-person.png" },
      dueDate: "Jun 10, 2025",
    },
    {
      id: "task-3",
      title: "Test cognitive load monitoring component",
      description: "Conduct user testing for the cognitive load monitoring component",
      status: "review" as const,
      priority: "medium" as const,
      assignee: { id: "user-4", name: "Sarah Wilson", avatar: "/short-haired-person.png" },
      dueDate: "Jun 5, 2025",
    },
    {
      id: "task-4",
      title: "Document temporal awareness API",
      description: "Create comprehensive documentation for the temporal awareness API",
      status: "done" as const,
      priority: "low" as const,
      assignee: { id: "user-3", name: "James Smith", avatar: "/person-dark-hair.png" },
      dueDate: "May 20, 2025",
    },
  ]

  // Mock data for git repositories
  const repos = [
    {
      id: "repo-1",
      repo: "quantum-core",
      branch: "feature/quantum-field",
      description: "Implementation of the quantum field visualization component",
      status: "open" as const,
      commits: 12,
      author: { id: "user-1", name: "Alex Johnson", avatar: "/person-with-glasses.png" },
      updatedAt: "2 days ago",
    },
    {
      id: "repo-2",
      repo: "temporal-intelligence",
      branch: "feature/chronological-superposition",
      description: "Adding chronological superposition capabilities to the temporal intelligence module",
      status: "merged" as const,
      commits: 8,
      author: { id: "user-3", name: "James Smith", avatar: "/person-dark-hair.png" },
      updatedAt: "1 week ago",
    },
    {
      id: "repo-3",
      repo: "cognitive-interface",
      branch: "bugfix/neural-resonance",
      description: "Fixing issues with the neural resonance mapping component",
      status: "closed" as const,
      commits: 3,
      author: { id: "user-2", name: "Maria Garcia", avatar: "/curly-haired-person.png" },
      updatedAt: "3 days ago",
    },
  ]

  const handleConnectProject = (projectId: string) => {
    if (connectedProjects.includes(projectId)) {
      if (onDisconnectProject) {
        onDisconnectProject(projectId)
      }
      toast({
        title: "Project Disconnected",
        description: `Idea has been disconnected from the project`,
      })
    } else {
      if (onConnectProject) {
        onConnectProject(projectId)
      }
      toast({
        title: "Project Connected",
        description: `Idea has been connected to the project`,
      })
    }
  }

  const handleConnectTask = (taskId: string) => {
    if (connectedTasks.includes(taskId)) {
      if (onDisconnectTask) {
        onDisconnectTask(taskId)
      }
      toast({
        title: "Task Disconnected",
        description: `Idea has been disconnected from the task`,
      })
    } else {
      if (onConnectTask) {
        onConnectTask(taskId)
      }
      toast({
        title: "Task Connected",
        description: `Idea has been connected to the task`,
      })
    }
  }

  const handleConnectRepo = (repoId: string) => {
    if (connectedRepos.includes(repoId)) {
      if (onDisconnectRepo) {
        onDisconnectRepo(repoId)
      }
      toast({
        title: "Repository Disconnected",
        description: `Idea has been disconnected from the repository`,
      })
    } else {
      if (onConnectRepo) {
        onConnectRepo(repoId)
      }
      toast({
        title: "Repository Connected",
        description: `Idea has been connected to the repository`,
      })
    }
  }

  const handleCreateProject = () => {
    if (!newProject.name) {
      toast({
        title: "Missing Project Name",
        description: "Please enter a name for the project",
        variant: "destructive",
      })
      return
    }

    if (onCreateProject) {
      onCreateProject({
        ...newProject,
        ideaId,
      })
    }

    toast({
      title: "Project Created",
      description: `New project created and connected to the idea`,
    })

    setNewProject({
      name: "",
      description: "",
      dueDate: "",
    })
    setIsCreatingProject(false)
  }

  const handleCreateTask = () => {
    if (!newTask.title) {
      toast({
        title: "Missing Task Title",
        description: "Please enter a title for the task",
        variant: "destructive",
      })
      return
    }

    if (onCreateTask) {
      onCreateTask({
        ...newTask,
        ideaId,
      })
    }

    toast({
      title: "Task Created",
      description: `New task created and connected to the idea`,
    })

    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
    })
    setIsCreatingTask(false)
  }

  return (
    <Card className="w-full overflow-hidden border-quantum-600/20 bg-gradient-to-br from-white to-quantum-50/30 dark:from-quantum-950 dark:to-quantum-900">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-quantum tracking-tight flex items-center gap-2">
              <Link2 className="h-5 w-5 text-quantum-600" />
              Idea Integrations
            </CardTitle>
            <CardDescription className="text-quantum-700 dark:text-quantum-300">
              Connect "{ideaTitle}" to projects, tasks, and repositories
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-quantum-200 dark:border-quantum-700 hover:bg-quantum-100 dark:hover:bg-quantum-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-quantum-100/50 dark:bg-quantum-800/50">
            <TabsTrigger value="projects" className="flex-1 flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              <span>Projects</span>
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex-1 flex items-center gap-1">
              <Trello className="h-4 w-4" />
              <span>Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="repositories" className="flex-1 flex items-center gap-1">
              <GitBranch className="h-4 w-4" />
              <span>Repositories</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Connected Projects</h3>
              <Dialog open={isCreatingProject} onOpenChange={setIsCreatingProject}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Create a new project based on this idea. The project will be automatically connected to the idea.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        placeholder="Enter project name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-description">Description</Label>
                      <Input
                        id="project-description"
                        placeholder="Enter project description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="project-due-date">Due Date</Label>
                      <Input
                        id="project-due-date"
                        type="date"
                        value={newProject.dueDate}
                        onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreatingProject(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateProject}>Create Project</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  {...project}
                  onConnect={() => handleConnectProject(project.id)}
                  isConnected={connectedProjects.includes(project.id)}
                />
              ))}

              {projects.length === 0 && (
                <div className="col-span-3 text-center py-8">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Projects Available</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Create a new project to connect with this idea</p>
                  <Button onClick={() => setIsCreatingProject(true)} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </div>
              )}
            </div>

            {connectedProjects.length > 0 && (
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-quantum-200 dark:border-quantum-700 hover:bg-quantum-100 dark:hover:bg-quantum-800"
                >
                  View All Connected Projects
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="tasks" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Connected Tasks</h3>
              <Dialog open={isCreatingTask} onOpenChange={setIsCreatingTask}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                      Create a new task based on this idea. The task will be automatically connected to the idea.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="task-title">Task Title</Label>
                      <Input
                        id="task-title"
                        placeholder="Enter task title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-description">Description</Label>
                      <Input
                        id="task-description"
                        placeholder="Enter task description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-priority">Priority</Label>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) => setNewTask({ ...newTask, priority: value as any })}
                      >
                        <SelectTrigger id="task-priority">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="task-due-date">Due Date</Label>
                      <Input
                        id="task-due-date"
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreatingTask(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTask}>Create Task</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  {...task}
                  onConnect={() => handleConnectTask(task.id)}
                  isConnected={connectedTasks.includes(task.id)}
                />
              ))}

              {tasks.length === 0 && (
                <div className="col-span-3 text-center py-8">
                  <Trello className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Tasks Available</h3>
                  <p className="mt-2 text-sm text-muted-foreground">Create a new task to connect with this idea</p>
                  <Button onClick={() => setIsCreatingTask(true)} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Task
                  </Button>
                </div>
              )}
            </div>

            {connectedTasks.length > 0 && (
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-quantum-200 dark:border-quantum-700 hover:bg-quantum-100 dark:hover:bg-quantum-800"
                >
                  View All Connected Tasks
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="repositories" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Connected Repositories</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {repos.map((repo) => (
                <GitCard
                  key={repo.id}
                  {...repo}
                  onConnect={() => handleConnectRepo(repo.id)}
                  isConnected={connectedRepos.includes(repo.id)}
                />
              ))}

              {repos.length === 0 && (
                <div className="col-span-3 text-center py-8">
                  <GitBranch className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No Repositories Available</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Connect your Git repositories to link them with this idea
                  </p>
                </div>
              )}
            </div>

            {connectedRepos.length > 0 && (
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-quantum-200 dark:border-quantum-700 hover:bg-quantum-100 dark:hover:bg-quantum-800"
                >
                  View All Connected Repositories
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
