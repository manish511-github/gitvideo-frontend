"use client"

import { Button } from "@/components/ui/button"
import { CircleDot, GitPullRequest, FolderKanban, BookOpen, Shield } from "lucide-react"

interface OtherPagesContentProps {
  activePage: string
  selectedSubAction: string
  subActions: { [key: string]: string[] }
  handleSubActionClick: (action: string) => void
}

export function OtherPagesContent({
  activePage,
  selectedSubAction,
  subActions,
  handleSubActionClick,
}: OtherPagesContentProps) {
  // Function to get the appropriate icon for the active page
  const getPageIcon = () => {
    if (activePage === "issues") return <CircleDot className="h-12 w-12 mx-auto text-muted-foreground" />
    if (activePage === "pulls") return <GitPullRequest className="h-12 w-12 mx-auto text-muted-foreground" />
    if (activePage === "projects") return <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground" />
    if (activePage === "wiki") return <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
    if (activePage === "security") return <Shield className="h-12 w-12 mx-auto text-muted-foreground" />
    return null
  }

  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="mb-4">{getPageIcon()}</div>
        <h2 className="text-xl font-medium mb-2 capitalize">{activePage}</h2>
        <p className="text-muted-foreground mb-4">
          Currently viewing: <span className="font-medium">{selectedSubAction}</span>
        </p>
        <div className="flex flex-wrap gap-2 justify-center max-w-md">
          {subActions[activePage]?.map((action) => (
            <Button
              key={action}
              variant={selectedSubAction === action ? "default" : "outline"}
              size="sm"
              onClick={() => handleSubActionClick(action)}
            >
              {action}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

