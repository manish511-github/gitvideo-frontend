"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetOverlay } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Menu,
  Plus,
  Import,
  AlertCircle,
  GitBranch,
  GitCommit,
  Code2,
  CircleDot,
  GitPullRequest,
  FolderKanban,
  BookOpen,
  Shield,
} from "lucide-react"
import { MainSidebar } from "@/components/main-sidebar"
import { UserSidebar } from "@/components/user-sidebar"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

export function MainNav() {
  const [mainSidebarOpen, setMainSidebarOpen] = useState(false)
  const [userSidebarOpen, setUserSidebarOpen] = useState(false)
  const [activePage, setActivePage] = useState<string>("gitvid")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Sheet open={mainSidebarOpen} onOpenChange={setMainSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle main menu</span>
            </Button>
          </SheetTrigger>
          <SheetOverlay />
          <SheetContent side="left" className="w-[300px] p-0">
            <MainSidebar />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2 ml-4 border-r pr-4">
          <span className="text-sm font-medium">Product Demo v2.0</span>
        </div>

        <div className="flex items-center gap-1 ml-4">
          <Button
            variant={activePage === "gitvid" ? "default" : "ghost"}
            size="sm"
            className="h-8 px-3"
            onClick={() => setActivePage("gitvid")}
          >
            <Code2 className="h-4 w-4 mr-1.5" />
            GitVid
          </Button>
          <Button
            variant={activePage === "issues" ? "default" : "ghost"}
            size="sm"
            className="h-8 px-3"
            onClick={() => setActivePage("issues")}
          >
            <CircleDot className="h-4 w-4 mr-1.5" />
            Issues
          </Button>
          <Button
            variant={activePage === "pulls" ? "default" : "ghost"}
            size="sm"
            className="h-8 px-3"
            onClick={() => setActivePage("pulls")}
          >
            <GitPullRequest className="h-4 w-4 mr-1.5" />
            Pull requests
          </Button>
          <Button
            variant={activePage === "projects" ? "default" : "ghost"}
            size="sm"
            className="h-8 px-3"
            onClick={() => setActivePage("projects")}
          >
            <FolderKanban className="h-4 w-4 mr-1.5" />
            Projects
          </Button>
          <Button
            variant={activePage === "wiki" ? "default" : "ghost"}
            size="sm"
            className="h-8 px-3"
            onClick={() => setActivePage("wiki")}
          >
            <BookOpen className="h-4 w-4 mr-1.5" />
            Wiki
          </Button>
          <Button
            variant={activePage === "security" ? "default" : "ghost"}
            size="sm"
            className="h-8 px-3"
            onClick={() => setActivePage("security")}
          >
            <Shield className="h-4 w-4 mr-1.5" />
            Security
          </Button>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <Badge className="px-2 py-1 gap-1">
            <GitBranch className="h-3.5 w-3.5" />
            <span>3 branches</span>
          </Badge>

          <Badge className="px-2 py-1 gap-1">
            <GitCommit className="h-3.5 w-3.5" />
            <span>4 commits</span>
          </Badge>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden items-center gap-1 text-sm font-medium md:flex">
            <Link href="/manish511/repo1" className="flex items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-accent">
              manish511
            </Link>
            <span>/</span>
            <Link href="/manish511/repo1" className="flex items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-accent">
              repo1
            </Link>
          </div>

          <div className="hidden w-full max-w-[300px] md:block">
            <Input type="search" placeholder="Search repositories..." className="h-9" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/new-project">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Link>
              </DropdownMenuItem>
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

          <Button variant="ghost" size="icon" asChild>
            <Link href="/issues">
              <AlertCircle className="h-5 w-5" />
              <span className="sr-only">Issues</span>
            </Link>
          </Button>

          <ThemeToggle />

          <Sheet open={userSidebarOpen} onOpenChange={setUserSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-7 w-7">
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

