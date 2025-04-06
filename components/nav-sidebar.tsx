"use client"

import { Button } from "@/components/ui/button"
import { Code2, CircleDot, GitPullRequest, FolderKanban, BookOpen, Shield } from "lucide-react"

interface NavSidebarProps {
  activePage: string
  handleNavClick: (page: string) => void
}

export function NavSidebar({ activePage, handleNavClick }: NavSidebarProps) {
  return (
    <div className="w-12 border-r bg-muted/5 flex flex-col items-center py-3">
      <div className="space-y-3 flex flex-col items-center">
        <Button
          variant={activePage === "gitvid" ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => handleNavClick("gitvid")}
        >
          <Code2 className="h-4 w-4" />
          <span className="sr-only">GitVid</span>
        </Button>
        <Button
          variant={activePage === "issues" ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => handleNavClick("issues")}
        >
          <CircleDot className="h-4 w-4" />
          <span className="sr-only">Issues</span>
        </Button>
        <Button
          variant={activePage === "pulls" ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => handleNavClick("pulls")}
        >
          <GitPullRequest className="h-4 w-4" />
          <span className="sr-only">Pull requests</span>
        </Button>
        <Button
          variant={activePage === "projects" ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => handleNavClick("projects")}
        >
          <FolderKanban className="h-4 w-4" />
          <span className="sr-only">Projects</span>
        </Button>
        <Button
          variant={activePage === "wiki" ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => handleNavClick("wiki")}
        >
          <BookOpen className="h-4 w-4" />
          <span className="sr-only">Wiki</span>
        </Button>
        <Button
          variant={activePage === "security" ? "secondary" : "ghost"}
          size="icon"
          className="h-8 w-8"
          onClick={() => handleNavClick("security")}
        >
          <Shield className="h-4 w-4" />
          <span className="sr-only">Security</span>
        </Button>
      </div>
    </div>
  )
}

