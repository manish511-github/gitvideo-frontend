"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NewProjectDialog } from "@/components/new-project/new-project-dialog"
import {
  Plus,
  Clock,
  GitBranch,
  GitCommit,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
  FileVideo,
  Folder,
  Users,
  Star,
} from "lucide-react"
import { Input } from "@/components/ui/input"

interface Project {
  id: string
  name: string
  description: string
  thumbnail: string
  lastUpdated: string
  commits: number
  branches: number
  status: string
  author: {
    name: string
    avatar: string
  }
}

export function ProjectDashboard() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState("all")

  const projects: Project[] = [
    {
      id: "1",
      name: "Product Demo v2.0",
      description: "Updated product demonstration video with new features",
      lastUpdated: "2 hours ago",
      commits: 5,
      branches: 2,
      thumbnail: "/placeholder.svg?height=200&width=360",
      status: "In Progress",
      author: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
    {
      id: "2",
      name: "Company Overview",
      description: "Main company overview and mission video",
      lastUpdated: "1 day ago",
      commits: 8,
      branches: 3,
      thumbnail: "/placeholder.svg?height=200&width=360",
      status: "Published",
      author: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
    {
      id: "3",
      name: "Tutorial Series",
      description: "Video tutorials for onboarding new users",
      lastUpdated: "3 days ago",
      commits: 12,
      branches: 4,
      thumbnail: "/placeholder.svg?height=200&width=360",
      status: "Draft",
      author: {
        name: "Alex Kim",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
  ]

  const handleProjectCreated = (project: any) => {
    console.log("Project created:", project)
    // Here you would typically add the project to your state or send to an API
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        {/* Header with stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
            <CardHeader className="pb-2">
              <CardDescription>Total Projects</CardDescription>
              <CardTitle className="text-3xl">12</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground">
                <FileVideo className="h-3.5 w-3.5 mr-1" />3 active projects
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
            <CardHeader className="pb-2">
              <CardDescription>Total Commits</CardDescription>
              <CardTitle className="text-3xl">87</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground">
                <GitCommit className="h-3.5 w-3.5 mr-1" />
                12 this week
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
            <CardHeader className="pb-2">
              <CardDescription>Storage Used</CardDescription>
              <CardTitle className="text-3xl">1.2 GB</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground">
                <Folder className="h-3.5 w-3.5 mr-1" />
                8.8 GB available
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
            <CardHeader className="pb-2">
              <CardDescription>Team Members</CardDescription>
              <CardTitle className="text-3xl">5</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5 mr-1" />2 pending invites
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project management header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">Manage your video projects</p>
          </div>

          <NewProjectDialog onProjectCreated={handleProjectCreated} />
        </div>

        {/* Tabs and filters */}
        <div className="flex flex-col space-y-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center">
              <TabsList className="bg-zinc-900">
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search projects..."
                    className="pl-9 h-9 w-[200px] bg-zinc-900 border-zinc-800"
                  />
                </div>

                <Button variant="outline" size="icon" className="h-9 w-9 border-zinc-800">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>

                <div className="flex items-center border rounded-md border-zinc-800">
                  <Button
                    variant={view === "grid" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setView("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={view === "list" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setView("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <TabsContent value="all" className="mt-6">
              {view === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <Card
                      key={project.id}
                      className="overflow-hidden border-zinc-800 hover:border-zinc-700 transition-colors"
                    >
                      <div className="relative aspect-video">
                        <img
                          src={project.thumbnail || "/placeholder.svg"}
                          alt={project.name}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          <Badge
                            variant={
                              project.status === "Published"
                                ? "default"
                                : project.status === "In Progress"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {project.status}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader className="p-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                      </CardHeader>

                      <CardFooter className="p-4 pt-0 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={project.author.avatar} alt={project.author.name} />
                            <AvatarFallback>{project.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">{project.author.name}</span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <GitCommit className="h-3.5 w-3.5" />
                            {project.commits}
                          </div>
                          <div className="flex items-center gap-1">
                            <GitBranch className="h-3.5 w-3.5" />
                            {project.branches}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {project.lastUpdated}
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}

                  {/* Create new project card */}
                  <Card className="border-dashed border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col items-center justify-center aspect-[4/3]">
                    <CardContent className="flex flex-col items-center justify-center h-full text-center p-6">
                      <div className="bg-zinc-900 rounded-full p-4 mb-4">
                        <Plus className="h-8 w-8 text-zinc-400" />
                      </div>
                      <h3 className="font-medium mb-2">Create New Project</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Start a new video project from scratch or use a template
                      </p>
                      <NewProjectDialog onProjectCreated={handleProjectCreated}>
                        <Button>Get Started</Button>
                      </NewProjectDialog>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="border rounded-md border-zinc-800 overflow-hidden">
                  <div className="grid grid-cols-[auto_1fr_auto] gap-4 p-3 bg-zinc-900 text-xs font-medium text-muted-foreground">
                    <div className="w-[300px]">Project</div>
                    <div>Status</div>
                    <div className="w-[200px] text-right">Last Updated</div>
                  </div>

                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="grid grid-cols-[auto_1fr_auto] gap-4 p-3 border-t border-zinc-800 hover:bg-zinc-900/50 transition-colors"
                    >
                      <div className="w-[300px] flex items-center gap-3">
                        <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={project.thumbnail || "/placeholder.svg"}
                            alt={project.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{project.name}</div>
                          <div className="text-xs text-muted-foreground">{project.description}</div>
                        </div>
                      </div>

                      <div>
                        <Badge
                          variant={
                            project.status === "Published"
                              ? "default"
                              : project.status === "In Progress"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {project.status}
                        </Badge>
                      </div>

                      <div className="w-[200px] text-right flex items-center justify-end gap-4">
                        <div className="text-xs text-muted-foreground">{project.lastUpdated}</div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent" className="mt-6">
              <div className="flex items-center justify-center h-40 border rounded-md border-zinc-800">
                <p className="text-muted-foreground">Recent projects will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="starred" className="mt-6">
              <div className="flex items-center justify-center h-40 border rounded-md border-zinc-800">
                <p className="text-muted-foreground">Starred projects will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="archived" className="mt-6">
              <div className="flex items-center justify-center h-40 border rounded-md border-zinc-800">
                <p className="text-muted-foreground">Archived projects will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

