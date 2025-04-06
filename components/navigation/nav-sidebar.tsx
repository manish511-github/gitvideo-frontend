"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Code2, CircleDot, GitPullRequest, FolderKanban, BookOpen, Shield } from "lucide-react"

interface NavSidebarProps {
  activePage: string
  handleNavClick: (page: string) => void
}

export function NavSidebar({ activePage, handleNavClick }: NavSidebarProps) {
  return (
    <div className="w-14 border-r flex flex-col items-center py-4 bg-background">
      <TooltipProvider>
        <div className="flex flex-col gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activePage === "gitvid" ? "secondary" : "ghost"}
                size="icon"
                className="h-10 w-10"
                onClick={() => handleNavClick("gitvid")}
                asChild
              >
                <Link href="/">
                  <Code2 className="h-5 w-5" />
                  <span className="sr-only">Code</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Code</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activePage === "issues" ? "secondary" : "ghost"}
                size="icon"
                className="h-10 w-10"
                onClick={() => handleNavClick("issues")}
                asChild
              >
                <Link href="/issues">
                  <CircleDot className="h-5 w-5" />
                  <span className="sr-only">Issues</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Issues</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activePage === "pulls" ? "secondary" : "ghost"}
                size="icon"
                className="h-10 w-10"
                onClick={() => handleNavClick("pulls")}
                asChild
              >
                <Link href="/pulls">
                  <GitPullRequest className="h-5 w-5" />
                  <span className="sr-only">Pull Requests</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Pull Requests</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activePage === "projects" ? "secondary" : "ghost"}
                size="icon"
                className="h-10 w-10"
                onClick={() => handleNavClick("projects")}
                asChild
              >
                <Link href="/projects">
                  <FolderKanban className="h-5 w-5" />
                  <span className="sr-only">Projects</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Projects</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activePage === "wiki" ? "secondary" : "ghost"}
                size="icon"
                className="h-10 w-10"
                onClick={() => handleNavClick("wiki")}
                asChild
              >
                <Link href="/wiki">
                  <BookOpen className="h-5 w-5" />
                  <span className="sr-only">Wiki</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Wiki</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activePage === "security" ? "secondary" : "ghost"}
                size="icon"
                className="h-10 w-10"
                onClick={() => handleNavClick("security")}
                asChild
              >
                <Link href="/security">
                  <Shield className="h-5 w-5" />
                  <span className="sr-only">Security</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Security</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  )
}

