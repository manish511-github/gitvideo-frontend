"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Scissors, Combine, Upload, Replace, ChevronDown, ChevronUp, GitCommit, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useMediaQuery } from "@/hooks/use-media-query"

type ChangeType = "merge" | "cut" | "insert" | "update"

interface Change {
  type: ChangeType
  timestamp: string
}

interface Commit {
  id: string
  message: string
  author: string
  date: string
  avatar: string
  branch: string
  changes: Change[]
}

const getChangeIcon = (type: ChangeType) => {
  switch (type) {
    case "merge":
      return <Combine className="h-4 w-4 text-muted-foreground" />
    case "cut":
      return <Scissors className="h-4 w-4 text-muted-foreground" />
    case "insert":
      return <Upload className="h-4 w-4 text-muted-foreground" />
    case "update":
      return <Replace className="h-4 w-4 text-muted-foreground" />
  }
}

const getChangeLabel = (type: ChangeType) => {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

export function VersionHistory() {
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null)
  const isMobile = useMediaQuery("(max-width: 640px)")

  const commits: Commit[] = [
    {
      id: "abc123",
      message: "Updated intro sequence",
      author: "Sarah Chen",
      date: "2h ago",
      avatar: "/placeholder.svg?height=40&width=40",
      branch: "main",
      changes: [
        { type: "cut", timestamp: "0:00-0:15" },
        { type: "insert", timestamp: "0:00" },
        { type: "update", timestamp: "0:15-0:30" },
      ],
    },
    {
      id: "def456",
      message: "Fixed audio sync issues",
      author: "Mike Johnson",
      date: "1d ago",
      avatar: "/placeholder.svg?height=40&width=40",
      branch: "main",
      changes: [{ type: "update", timestamp: "1:20-2:45" }],
    },
    {
      id: "ghi789",
      message: "Added new product features section",
      author: "Alex Kim",
      date: "2d ago",
      avatar: "/placeholder.svg?height=40&width=40",
      branch: "feature/new-intro",
      changes: [
        { type: "merge", timestamp: "2:30" },
        { type: "insert", timestamp: "2:30-3:45" },
      ],
    },
  ]

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="bg-muted/30 py-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <GitCommit className="h-4 w-4" />
            Version History
          </CardTitle>
          <Badge variant="outline" className="px-2 py-0.5 text-xs">
            {commits.length} commits
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="divide-y">
            {commits.map((commit) => (
              <div key={commit.id} className="transition-colors hover:bg-muted/30">
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7 md:h-8 md:w-8">
                      <AvatarImage src={commit.avatar} />
                      <AvatarFallback>{commit.author[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm md:text-base truncate">{commit.message}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 shrink-0 rounded-full p-0"
                          onClick={() => setSelectedCommit(selectedCommit === commit.id ? null : commit.id)}
                        >
                          {selectedCommit === commit.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-muted-foreground">
                        <span className="truncate max-w-[100px] md:max-w-[150px]">{commit.author}</span>
                        <span className="hidden xs:inline">•</span>
                        <span>{commit.date}</span>
                        <span className="hidden xs:inline">•</span>
                        <Badge variant="outline" className="px-1 py-0 text-[10px] font-normal">
                          {commit.branch}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedCommit === commit.id && (
                  <div className="mx-3 mb-3 overflow-hidden rounded-md border bg-card">
                    <div className="bg-muted/40 px-3 py-1.5 text-xs font-medium flex items-center justify-between">
                      <span>Changes</span>
                      <Badge variant="outline" className="px-1 py-0 text-[10px] font-normal">
                        {commit.changes.length}
                      </Badge>
                    </div>

                    {/* Column headers */}
                    <div className="grid grid-cols-[auto_1fr_auto] gap-2 px-3 py-1.5 text-[10px] font-medium text-muted-foreground border-b">
                      <div>Type</div>
                      <div>Operation</div>
                      <div>Timestamp</div>
                    </div>

                    <div className="p-1.5 space-y-1">
                      {commit.changes.map((change, index) => (
                        <div key={index} className="grid grid-cols-[auto_1fr_auto] gap-2 items-center p-1.5 rounded-md">
                          <div className="flex-shrink-0 bg-muted rounded-full p-1">{getChangeIcon(change.type)}</div>
                          <div className="text-xs font-medium">{getChangeLabel(change.type)}</div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs font-mono bg-muted/50 px-1.5 py-0.5 rounded text-muted-foreground">
                              {change.timestamp}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

