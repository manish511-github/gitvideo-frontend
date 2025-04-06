"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetOverlay } from "@/components/ui/sheet"
import { UserSidebar } from "@/components/user-sidebar"
import type { SubActions } from "@/types/repo-types"
import {
  Zap,
  Plus,
  Search,
  Import,
  Code2,
  CircleDot,
  GitPullRequest,
  FolderKanban,
  BookOpen,
  Shield,
  Clock,
  GitCommit,
  GitBranch,
  Tag,
  Rocket,
  CheckCircle,
  User,
  AtSign,
  GitMerge,
  FileText,
  UserCheck,
  Trello,
  Table,
  Map,
  BarChart,
  Settings,
  Home,
  History,
  Edit,
  FilePlus,
  FileCheck,
  AlertTriangle,
  Package,
  Lock,
  Circle,
  Eye,
} from "lucide-react"

// Import the ThemeToggle component
import { ThemeToggle } from "@/components/theme-toggle"

interface RepoHeaderProps {
  activePage: string
  selectedSubAction: string
  subActions: SubActions
  handleSubActionClick: (action: string) => void
}

export function RepoHeader({ activePage, selectedSubAction, subActions, handleSubActionClick }: RepoHeaderProps) {
  const [userSidebarOpen, setUserSidebarOpen] = useState(false)

  // Function to get the appropriate icon for each sub-action
  const getActionIcon = (action: string) => {
    if (action === "Timeline") return <Clock className="h-3 w-3 mr-1" />
    if (action === "Commits") return <GitCommit className="h-3 w-3 mr-1" />
    if (action === "Branches") return <GitBranch className="h-3 w-3 mr-1" />
    if (action === "Tags") return <Tag className="h-3 w-3 mr-1" />
    if (action === "Releases") return <Rocket className="h-3 w-3 mr-1" />
    if (action === "Open") return <CircleDot className="h-3 w-3 mr-1" />
    if (action === "Closed") return <CheckCircle className="h-3 w-3 mr-1" />
    if (action === "Assigned") return <User className="h-3 w-3 mr-1" />
    if (action === "Mentioned") return <AtSign className="h-3 w-3 mr-1" />
    if (action === "Created") return <Plus className="h-3 w-3 mr-1" />
    if (action === "Merged") return <GitMerge className="h-3 w-3 mr-1" />
    if (action === "Draft") return <FileText className="h-3 w-3 mr-1" />
    if (action === "Requested") return <UserCheck className="h-3 w-3 mr-1" />
    if (action === "Board") return <Trello className="h-3 w-3 mr-1" />
    if (action === "Table") return <Table className="h-3 w-3 mr-1" />
    if (action === "Roadmap") return <Map className="h-3 w-3 mr-1" />
    if (action === "Insights") return <BarChart className="h-3 w-3 mr-1" />
    if (action === "Settings") return <Settings className="h-3 w-3 mr-1" />
    if (action === "Home") return <Home className="h-3 w-3 mr-1" />
    if (action === "Pages") return <FileText className="h-3 w-3 mr-1" />
    if (action === "History") return <History className="h-3 w-3 mr-1" />
    if (action === "Edit") return <Edit className="h-3 w-3 mr-1" />
    if (action === "New") return <FilePlus className="h-3 w-3 mr-1" />
    if (action === "Overview") return <Eye className="h-3 w-3 mr-1" />
    if (action === "Policy") return <FileCheck className="h-3 w-3 mr-1" />
    if (action === "Advisories") return <AlertTriangle className="h-3 w-3 mr-1" />
    if (action === "Dependabot") return <Package className="h-3 w-3 mr-1" />
    if (action === "Secrets") return <Lock className="h-3 w-3 mr-1" />
    return <Circle className="h-3 w-3 mr-1" />
  }

  // Function to get the appropriate icon for the active page
  const getPageIcon = () => {
    if (activePage === "gitvid") return <Code2 className="h-3 w-3" />
    if (activePage === "issues") return <CircleDot className="h-3 w-3" />
    if (activePage === "pulls") return <GitPullRequest className="h-3 w-3" />
    if (activePage === "projects") return <FolderKanban className="h-3 w-3" />
    if (activePage === "wiki") return <BookOpen className="h-3 w-3" />
    if (activePage === "security") return <Shield className="h-3 w-3" />
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-10 items-center">
        {/* Repository path and active section - aligned with branch panel width */}
        <div className="flex items-center" style={{ width: "272px" }}>
          <div className="flex items-center h-full border-r w-full px-3">
            <Zap className="h-5 w-5 text-primary mr-4" />
            <span className="text-xs font-medium mr-8 truncate max-w-[100px]">repo1</span>
            <div className="flex-1 flex justify-end">
              <Button variant="default" size="sm" className="h-6 px-2 text-xs gap-1.5 capitalize">
                {getPageIcon()}
                {activePage}
              </Button>
            </div>
          </div>
        </div>

        {/* Sub-actions with proper spacing */}
        <div className="flex items-center gap-4 px-4">
          {/* Show sub-actions for the current active page with icons */}
          {subActions[activePage]?.map((action) => (
            <Button
              key={action}
              variant={selectedSubAction === action ? "default" : "ghost"}
              size="sm"
              className="h-6 px-2 text-xs flex items-center gap-1"
              onClick={() => handleSubActionClick(action)}
            >
              {getActionIcon(action)}
              {action}
            </Button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 pr-3">
          <div className="relative w-[180px]">
            <Search className="absolute left-2 top-1.5 h-3 w-3 text-muted-foreground" />
            <Input type="search" placeholder="Search repositories..." className="h-6 text-xs pl-7" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-6 text-xs">
                <Plus className="mr-1 h-3 w-3" />
                New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                New Repository
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Import className="mr-2 h-4 w-4" />
                Import Repository
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />

          <Sheet open={userSidebarOpen} onOpenChange={setUserSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                <Avatar className="h-5 w-5">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@manish511" />
                  <AvatarFallback>MS</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </SheetTrigger>
            <SheetOverlay />
            <SheetContent side="right" className="w-[300px] p-0">
              <UserSidebar />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

