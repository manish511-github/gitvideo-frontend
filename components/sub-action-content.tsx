"use client"

import { CircleDot, GitPullRequest, FolderKanban, BookOpen, Shield, FileVideo } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SubActionContentProps {
  activePage: string
  selectedSubAction: string
  subActions: { [key: string]: string[] }
  onSubActionClick: (action: string) => void
}

export function SubActionContent({
  activePage,
  selectedSubAction,
  subActions,
  onSubActionClick,
}: SubActionContentProps) {
  // Get the icon for the current page
  const getPageIcon = () => {
    switch (activePage) {
      case "gitvid":
        return <FileVideo className="h-12 w-12 mx-auto text-muted-foreground" />
      case "issues":
        return <CircleDot className="h-12 w-12 mx-auto text-muted-foreground" />
      case "pulls":
        return <GitPullRequest className="h-12 w-12 mx-auto text-muted-foreground" />
      case "projects":
        return <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground" />
      case "wiki":
        return <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
      case "security":
        return <Shield className="h-12 w-12 mx-auto text-muted-foreground" />
      default:
        return <FileVideo className="h-12 w-12 mx-auto text-muted-foreground" />
    }
  }

  // Get dummy content for each sub-action
  const getActionContent = () => {
    // This would be replaced with actual content in a real application
    return (
      <div className="bg-muted/10 rounded-lg border p-6 max-w-2xl mx-auto">
        <h3 className="text-lg font-medium mb-2">
          {selectedSubAction} - {activePage}
        </h3>
        <p className="text-muted-foreground mb-4">
          This is a placeholder for the {selectedSubAction} view in the {activePage} section.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background rounded-md p-4 border">
            <h4 className="font-medium mb-2">Recent Activity</h4>
            <div className="space-y-2">
              <div className="h-4 bg-muted/50 rounded w-3/4"></div>
              <div className="h-4 bg-muted/50 rounded w-1/2"></div>
              <div className="h-4 bg-muted/50 rounded w-5/6"></div>
            </div>
          </div>
          <div className="bg-background rounded-md p-4 border">
            <h4 className="font-medium mb-2">Statistics</h4>
            <div className="space-y-2">
              <div className="h-4 bg-muted/50 rounded w-2/3"></div>
              <div className="h-4 bg-muted/50 rounded w-3/5"></div>
              <div className="h-4 bg-muted/50 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-medium capitalize flex items-center gap-2">
            {getPageIcon()}
            <span>{activePage}</span>
            <span className="text-muted-foreground mx-1">/</span>
            <span>{selectedSubAction}</span>
          </h2>
          <div className="flex gap-2">
            {subActions[activePage]?.map((action) => (
              <Button
                key={action}
                variant={selectedSubAction === action ? "default" : "outline"}
                size="sm"
                onClick={() => onSubActionClick(action)}
              >
                {action}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex-1">{getActionContent()}</div>
      </div>
    </div>
  )
}

