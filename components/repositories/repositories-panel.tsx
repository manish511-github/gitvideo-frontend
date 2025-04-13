"use client"

import { useState, useEffect } from "react"
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
  Loader2,
  AlertCircle,
} from "lucide-react"
import { RepositoryStatus} from "@/components/repositories/repository-status"
import { NewProjectDialog } from "@/components/new-project/new-project-dialog"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchRepositories } from "@/lib/redux/repositoriesSlice"

// Helper function to format relative time
const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`

  // Format date for older items
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  })
}

// Format creation date
const formatCreationDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  })
}

// Calculate storage size based on video count (mock data)
const calculateStorage = (videos: any[]): string => {
  const baseSize = 50 // Base size in MB
  const sizePerVideo = videos.length * 25 // 25MB per video
  return `${baseSize + sizePerVideo} MB`
}

interface RepositoriesPanelProps {
  onRepoSelect: (repoId: number) => void
}

export function RepositoriesPanel({ onRepoSelect }: RepositoriesPanelProps) {
  const dispatch = useAppDispatch()
  const { items: repositories, status, error } = useAppSelector((state) => state.repositories)

  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [filterActive, setFilterActive] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch repositories on component mount
  useEffect(() => {
    // if (status === "idle") {
      dispatch(fetchRepositories())
    
  }, [dispatch])

  // Filter repositories based on status and search term
  const filteredRepositories = repositories
    .filter((repo) => !filterActive || repo.status === "Created" ||repo.status === "Added") // "Created" is equivalent to "Active" in the API
    .filter(
      (repo) =>
        searchTerm === "" ||
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || "No description",
      lastUpdated: getRelativeTime(repo.updatedAt),
      commits: repo.branches.reduce((total, branch) => total + branch.commits.length, 0),
      branches: repo.branches.length,
      thumbnail: repo.thumbnail || "/placeholder.svg?height=120&width=200",
      status: repo.status === "Created" ? "Active" : repo.status,
      processingProgress:0,
      creationDate: formatCreationDate(repo.createdAt),
      storage: calculateStorage(repo.videos),
    }))

  const isLoading = status === "loading"

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
              <p className="text-xs text-muted-foreground mt-0.5 opacity-80">
                {isLoading ? "Loading projects..." : `${filteredRepositories.length} Projects`}
              </p>
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
                <Input
                  placeholder="Search repositories..."
                  className="w-[180px] h-7 text-xs pl-7 pr-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <NewProjectDialog buttonVariant="small" />
            </div>
          </div>

          <Separator className="w-full" />

          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 w-full">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Loading repositories...</p>
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 w-full">
              <AlertCircle className="h-8 w-8 text-destructive mb-2" />
              <p className="text-sm font-medium mb-1">Failed to load repositories</p>
              <p className="text-xs text-muted-foreground">{error}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => dispatch(fetchRepositories())}>
                Try Again
              </Button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && filteredRepositories.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 w-full">
              <div className="bg-muted/30 rounded-full p-3 mb-3">
                <GitBranch className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium mb-1">No repositories found</p>
              <p className="text-xs text-muted-foreground text-center max-w-sm mb-4">
                {filterActive
                  ? "No active repositories found. Try removing the filter or create a new project."
                  : searchTerm
                    ? "No repositories match your search. Try a different search term."
                    : "You don't have any repositories yet. Create your first project to get started."}
              </p>
              <NewProjectDialog buttonVariant="outline-small" />
            </div>
          )}

          {/* Repositories list */}
          {!isLoading &&
            !error &&
            filteredRepositories.length > 0 &&
            (viewMode === "grid" ? (
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
                        {repo.status === "Active" ? (
                          <Badge
                          variant={repo.status === "Active" ? "default" : "secondary"}
                          className="text-[9px] px-2 py-0.5 font-medium"
                        >
                          {repo.status}
                        </Badge>
                    ) : (
                      <RepositoryStatus repoId = {repo.id}
                        videoId={repo.name} 
                        status={repo.status} 
                        progress={repo.processingProgress} 
                      />
                    )}  
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
                            {repo.status === "Active" ? (
                          <Badge
                          variant={repo.status === "Active" ? "default" : "secondary"}
                          className="text-[9px] px-2 py-0.5 font-medium"
                        >
                          {repo.status}
                        </Badge>
                    ) : (
                      <RepositoryStatus repoId = {repo.id}
                        videoId={repo.name} 
                        status={repo.status} 
                        progress={repo.processingProgress} 
                      />
                    )}  
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
                            <p className="text-[9px] text-muted-foreground truncate max-w-[200px]">
                              {repo.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center pl-2">
                        {repo.status === "Active" ? (
                          <Badge
                          variant={repo.status === "Active" ? "default" : "secondary"}
                          className="text-[9px] px-2 py-0.5 font-medium"
                        >
                          {repo.status}
                        </Badge>
                    ) : (
                      <RepositoryStatus repoId = {repo.id}
                        videoId={repo.name} 
                        status={repo.status} 
                        progress={repo.processingProgress} 
                      />
                    )}                        </div>
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
            ))}
        </div>
      </div>
    </div>
  )
}

