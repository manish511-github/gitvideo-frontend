"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ChevronDown,
  Clock,
  Filter,
  GitBranch,
  GitCommit,
  LayoutGrid,
  List,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react"
import { NewProjectDialog } from "@/components/new-project/new-project-dialog"

interface RepositoriesPanelProps {
  onRepoSelect: (repoId: number) => void
}

export function RepositoriesPanel({ onRepoSelect }: RepositoriesPanelProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [filterActive, setFilterActive] = useState(true)

  const repositories = [
    {
      id: 1,
      name: "Product Demo v2.0",
      description: "Updated product demonstration video with new features",
      lastUpdated: "2 hours ago",
      commits: 5,
      branches: 2,
      thumbnail: "/placeholder.svg?height=120&width=200",
      status: "Active",
      creationDate: "Mar 30, 2025 7:50 PM",
      storage: "118 MB",
    },
    {
      id: 2,
      name: "Company Overview",
      description: "Main company overview and mission video",
      lastUpdated: "1 day ago",
      commits: 8,
      branches: 3,
      thumbnail: "/placeholder.svg?height=120&width=200",
      status: "Active",
      creationDate: "Mar 30, 2025 7:49 PM",
      storage: "124 MB",
    },
    {
      id: 3,
      name: "Tutorial Series",
      description: "Video tutorials for onboarding new users",
      lastUpdated: "3 days ago",
      commits: 12,
      branches: 4,
      thumbnail: "/placeholder.svg?height=120&width=200",
      status: "Active",
      creationDate: "Mar 28, 2025 2:30 PM",
      storage: "156 MB",
    },
    {
      id: 4,
      name: "Marketing Campaign",
      description: "Q2 marketing campaign videos",
      lastUpdated: "5 days ago",
      commits: 7,
      branches: 2,
      thumbnail: "/placeholder.svg?height=120&width=200",
      status: "Archived",
      creationDate: "Mar 26, 2025 11:15 AM",
      storage: "210 MB",
    },
  ]

  const filteredRepositories = filterActive ? repositories.filter((repo) => repo.status === "Active") : repositories

  return (
    <div className="h-full flex flex-col overflow-auto w-full max-w-none">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white w-full">
        <div className="w-full px-4 md:px-6 py-8 md:py-10 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 space-y-2.5">
            <h1 className="text-lg md:text-xl font-medium tracking-tight">Elevate Your Creative Workflow</h1>
            <p className="text-slate-300 text-xs leading-relaxed max-w-xl opacity-90">
              Upload and organize all of your work-in-progress creative to one space. Share and present creative assets
              beautifully and securely.
            </p>
            <div className="flex gap-2 pt-1">
              <NewProjectDialog buttonVariant="hero" />
              <Button
                variant="outline"
                size="sm"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white h-7 text-xs"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="w-full md:w-auto flex-shrink-0">
            <div className="relative w-full md:w-[220px] h-[140px] rounded-lg overflow-hidden shadow-xl">
              <img
                src="/placeholder.svg?height=150&width=240"
                alt="Creative workflow"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Workspace header and controls */}
      <div className="w-full px-4 md:px-6 py-5">
        <div className="flex flex-col space-y-4 w-full">
          {/* Workspace header */}
          <div className="flex items-center justify-between w-full">
            <div>
              <h2 className="text-sm font-medium">Manish's Workspace</h2>
              <p className="text-xs text-muted-foreground mt-0.5 opacity-80">{filteredRepositories.length} Projects</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-6 text-xs gap-1 px-2 border-dashed">
                <Users className="h-3 w-3" />
                <span className="text-[10px]">Team • Free Trial</span>
              </Button>
              <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal">
                12 days left
              </Badge>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 pb-2 w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center border rounded-md p-0.5 h-7">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="h-6 w-6 rounded-sm"
                >
                  <LayoutGrid className="h-3 w-3" />
                  <span className="sr-only">Grid view</span>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="h-6 w-6 rounded-sm"
                >
                  <List className="h-3 w-3" />
                  <span className="sr-only">List view</span>
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1 px-2"
                onClick={() => setFilterActive(!filterActive)}
              >
                <Filter className="h-3 w-3" />
                <span className="whitespace-nowrap">Filtered by</span>
                <Badge variant={filterActive ? "default" : "outline"} className="text-[10px] h-4 px-1 font-normal">
                  {filterActive ? "Active" : "All"}
                </Badge>
              </Button>

              <Button variant="outline" size="sm" className="h-7 text-xs gap-1 px-2">
                <SlidersHorizontal className="h-3 w-3" />
                <span className="whitespace-nowrap">Sort</span>
                <ChevronDown className="h-3 w-3 ml-0.5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search repositories..." className="w-[180px] h-7 text-xs pl-7 pr-2" />
              </div>
              <NewProjectDialog buttonVariant="small" />
            </div>
          </div>

          <Separator className="w-full" />

          {/* Repositories list */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
              {filteredRepositories.map((repo) => (
                <div key={repo.id} onClick={() => onRepoSelect(repo.id)} className="cursor-pointer group w-full">
                  <Card className="overflow-hidden transition-all hover:shadow-md border-muted/40 bg-card/50 hover:bg-card h-full flex flex-col w-full">
                    <div className="relative aspect-video overflow-hidden w-full">
                      <img
                        src={repo.thumbnail || "/placeholder.svg"}
                        alt={repo.name}
                        className="object-cover w-full h-full transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <Badge
                        variant={repo.status === "Active" ? "default" : "secondary"}
                        className="absolute top-2 right-2 text-[9px] px-1.5 py-0"
                      >
                        {repo.status}
                      </Badge>
                    </div>
                    <div className="p-2.5 flex flex-col flex-1 w-full">
                      <div>
                        <h3 className="font-semibold text-sm leading-tight tracking-tight">{repo.name}</h3>
                        <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2 leading-snug">
                          {repo.description}
                        </p>
                      </div>
                      <div className="mt-auto pt-2 flex items-center justify-between text-[9px] text-muted-foreground w-full">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            <GitCommit className="h-2.5 w-2.5" />
                            <span>{repo.commits}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <GitBranch className="h-2.5 w-2.5" />
                            <span>{repo.branches}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <Clock className="h-2.5 w-2.5" />
                          <span>{repo.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}

              {/* New project button at the end of the list */}
              <div className="flex items-center justify-center">
                <NewProjectDialog buttonVariant="outline-tiny" />
              </div>
            </div>
          ) : (
            <div className="w-full rounded-md border border-muted/40 overflow-hidden">
              {/* Table header for list view */}
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_100px] w-full bg-muted/20 px-3 py-2 border-b border-muted/40">
                <div className="text-xs font-semibold text-foreground/80">Project</div>
                <div className="text-xs font-semibold text-foreground/80">Status</div>
                <div className="text-xs font-semibold text-foreground/80">Last Updated</div>
                <div className="text-xs font-semibold text-foreground/80">Creation Date</div>
                <div className="text-xs font-semibold text-foreground/80">Storage</div>
              </div>

              {/* List items */}
              <div className="w-full">
                {filteredRepositories.map((repo, index) => (
                  <div
                    key={repo.id}
                    onClick={() => onRepoSelect(repo.id)}
                    className={`w-full cursor-pointer group hover:bg-muted/10 transition-colors ${index !== filteredRepositories.length - 1 ? "border-b border-muted/30" : ""} ${index % 2 === 0 ? "bg-muted/5" : ""}`}
                  >
                    {/* Mobile view (single column) */}
                    <div className="md:hidden p-3 flex items-start gap-2">
                      <div className="w-[45px] h-[32px] rounded overflow-hidden flex-shrink-0">
                        <img
                          src={repo.thumbnail || "/placeholder.svg"}
                          alt={repo.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-xs leading-tight text-foreground">{repo.name}</h3>
                          <Badge
                            variant={repo.status === "Active" ? "default" : "secondary"}
                            className="text-[8px] px-1.5 py-0"
                          >
                            {repo.status}
                          </Badge>
                        </div>
                        <p className="text-[9px] text-muted-foreground mt-0.5 line-clamp-1">{repo.description}</p>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-2 text-[8px] text-muted-foreground">
                            <div className="flex items-center gap-0.5">
                              <GitCommit className="h-2.5 w-2.5" />
                              <span>{repo.commits}</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <GitBranch className="h-2.5 w-2.5" />
                              <span>{repo.branches}</span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <Clock className="h-2.5 w-2.5" />
                              <span>{repo.lastUpdated}</span>
                            </div>
                          </div>
                          <span className="text-[8px] text-muted-foreground">{repo.storage}</span>
                        </div>
                      </div>
                    </div>

                    {/* Desktop view (table layout) */}
                    <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_100px] w-full py-2.5 px-3 items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-[45px] h-[32px] rounded overflow-hidden flex-shrink-0 border border-muted/30">
                          <img
                            src={repo.thumbnail || "/placeholder.svg"}
                            alt={repo.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-sm leading-tight tracking-tight text-foreground">
                            {repo.name}
                          </h3>
                          <p className="text-[9px] text-muted-foreground truncate max-w-[200px]">{repo.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center pl-2">
                        <Badge
                          variant={repo.status === "Active" ? "default" : "secondary"}
                          className="text-[9px] px-2 py-0.5 font-medium"
                        >
                          {repo.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-[10px] font-medium text-foreground/80 pl-2">
                        {repo.lastUpdated}
                      </div>
                      <div className="flex items-center text-[10px] text-muted-foreground pl-2">
                        {repo.creationDate}
                      </div>
                      <div className="flex items-center justify-between pl-2">
                        <span className="text-[10px] font-medium text-foreground/80">{repo.storage}</span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-3 w-3" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem className="text-[10px]">Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-[10px]">Duplicate</DropdownMenuItem>
                            <DropdownMenuItem className="text-[10px]">Archive</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}

                {/* New project button at the end of the list */}
                <div className="p-3 flex items-center justify-center hover:bg-muted/10 transition-colors w-full border-t border-muted/30">
                  <NewProjectDialog buttonVariant="outline-small" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

