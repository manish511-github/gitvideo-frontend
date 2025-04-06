"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ViewToggle } from "@/components/repositories/view-toggle"
import { ZoomControl } from "@/components/repositories/zoom-control"
import { Clock, GitBranch, GitCommit, MoreVertical, Play, Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function VideoRepositories() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [zoom, setZoom] = useState(3) // Default to 3 columns

  // Load zoom preference from localStorage
  useEffect(() => {
    const savedZoom = localStorage.getItem("videoGitZoom")
    if (savedZoom) {
      setZoom(Number(savedZoom))
    }
  }, [])

  // Save zoom preference to localStorage
  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom)
    localStorage.setItem("videoGitZoom", String(newZoom))
  }

  const repositories = [
    {
      id: 1,
      name: "Product Demo v2.0",
      description: "Updated product demonstration video with new features",
      lastUpdated: "2 hours ago",
      commits: 5,
      branches: 2,
      thumbnail: "/placeholder.svg?height=200&width=360",
      duration: "3:24",
      status: "Updated",
      author: {
        name: "Sarah Chen",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
    {
      id: 2,
      name: "Company Overview",
      description: "Main company overview and mission video",
      lastUpdated: "1 day ago",
      commits: 8,
      branches: 3,
      thumbnail: "/placeholder.svg?height=200&width=360",
      duration: "5:12",
      status: "In Progress",
      author: {
        name: "Mike Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
    {
      id: 3,
      name: "Tutorial Series",
      description: "Video tutorials for onboarding new users",
      lastUpdated: "3 days ago",
      commits: 12,
      branches: 4,
      thumbnail: "/placeholder.svg?height=200&width=360",
      duration: "8:45",
      status: "Published",
      author: {
        name: "Alex Kim",
        avatar: "/placeholder.svg?height=32&width=32",
      },
    },
  ]

  return (
    <div className="w-full px-4 md:px-6 py-6">
      {/* Header with search and controls */}
      <div className="flex flex-col space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h1 className="text-base font-medium tracking-tight">Video Repositories</h1>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search repositories..."
                className="w-full sm:w-[220px] pl-7 h-7 text-xs bg-background"
              />
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
              <SlidersHorizontal className="h-3 w-3" />
              <span>Filter</span>
            </Button>
            <div className="flex items-center border rounded-md p-0.5 h-7">
              <ViewToggle view={view} onViewChange={setView} />
              {view === "grid" && <ZoomControl zoom={zoom} onZoomChange={handleZoomChange} />}
            </div>
          </div>
        </div>

        <Separator />
      </div>

      {/* Repositories grid */}
      <div className="mt-6">
        {view === "grid" ? (
          <div
            className={`grid gap-4 transition-all duration-200
    ${zoom === 2 ? "md:grid-cols-2" : ""}
    ${zoom === 3 ? "md:grid-cols-2 lg:grid-cols-3" : ""}
    ${zoom === 4 ? "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : ""}
    ${zoom === 5 ? "md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : ""}
    ${zoom === 6 ? "md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6" : ""}
  `}
          >
            {repositories.map((repo) => (
              <Link href={`/repo/${repo.id}`} key={repo.id} className="group">
                <Card className="overflow-hidden transition-all hover:shadow-sm border-muted/40 bg-card/50 hover:bg-card">
                  <CardHeader className="p-0">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={repo.thumbnail || "/placeholder.svg"}
                        alt={repo.name}
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        <Badge
                          variant="secondary"
                          className="backdrop-blur-sm bg-black/30 text-white border-0 text-[9px] font-normal"
                        >
                          {repo.duration}
                        </Badge>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-6 w-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                        >
                          <Play className="h-3 w-3 text-white" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-2.5 pt-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xs font-medium leading-tight">{repo.name}</h3>
                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{repo.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 -mr-1.5 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-1.5">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={repo.author.avatar} alt={repo.author.name} />
                          <AvatarFallback className="text-[8px]">{repo.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-[10px] text-muted-foreground">{repo.author.name}</span>
                      </div>
                      <Badge
                        variant={
                          repo.status === "Published"
                            ? "default"
                            : repo.status === "In Progress"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-[9px] h-4 font-normal"
                      >
                        {repo.status}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="px-2.5 py-2 border-t border-border/40 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <GitCommit className="h-3 w-3" />
                        {repo.commits}
                      </div>
                      <div className="flex items-center gap-1">
                        <GitBranch className="h-3 w-3" />
                        {repo.branches}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {repo.lastUpdated}
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {repositories.map((repo) => (
              <Link href={`/repo/${repo.id}`} key={repo.id} className="group">
                <Card className="overflow-hidden transition-all hover:shadow-sm border-muted/40 bg-card/50 hover:bg-card">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-[160px]">
                      <div className="relative aspect-video sm:h-full">
                        <img
                          src={repo.thumbnail || "/placeholder.svg"}
                          alt={repo.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent sm:bg-gradient-to-r" />
                        <div className="absolute bottom-2 left-2 flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="backdrop-blur-sm bg-black/30 text-white border-0 text-[9px] font-normal"
                          >
                            {repo.duration}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:h-full">
                        <div className="p-2.5 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-xs font-medium">{repo.name}</h3>
                                <Badge
                                  variant={
                                    repo.status === "Published"
                                      ? "default"
                                      : repo.status === "In Progress"
                                        ? "secondary"
                                        : "outline"
                                  }
                                  className="text-[9px] h-4 font-normal hidden sm:inline-flex"
                                >
                                  {repo.status}
                                </Badge>
                              </div>
                              <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                                {repo.description}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 -mr-1.5 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1.5">
                              <Avatar className="h-4 w-4">
                                <AvatarImage src={repo.author.avatar} alt={repo.author.name} />
                                <AvatarFallback className="text-[8px]">{repo.author.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-[10px] text-muted-foreground">{repo.author.name}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <GitCommit className="h-3 w-3" />
                                {repo.commits}
                              </div>
                              <div className="flex items-center gap-1">
                                <GitBranch className="h-3 w-3" />
                                {repo.branches}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {repo.lastUpdated}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="hidden sm:flex items-center justify-center px-4 border-l h-full">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <Play className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

