"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, ChevronUp, Clock, Edit2, GitCommit } from "lucide-react"

interface Change {
  type: "merge" | "cut" | "insert" | "update"
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

interface CommitCardProps {
  commit: Commit
  onEditClick: (commit: Commit) => void
}

export function CommitCard({ commit, onEditClick }: CommitCardProps) {
  const [expanded, setExpanded] = useState(false)

  const getChangeIcon = (type: "merge" | "cut" | "insert" | "update") => {
    switch (type) {
      case "merge":
        return "🔄"
      case "cut":
        return "✂️"
      case "insert":
        return "➕"
      case "update":
        return "🔄"
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <GitCommit className="h-4 w-4" />
            {commit.message}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
          <Avatar className="h-6 w-6">
            <AvatarImage src={commit.avatar} alt={commit.author} />
            <AvatarFallback>{commit.author[0]}</AvatarFallback>
          </Avatar>
          <span>{commit.author}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {commit.date}
          </span>
          <Badge variant="outline" className="ml-1 text-xs">
            {commit.branch}
          </Badge>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium mb-2">Changes:</h4>
              <div className="space-y-2">
                {commit.changes.map((change, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm p-2 bg-muted rounded-md">
                    <span>{getChangeIcon(change.type)}</span>
                    <span className="capitalize">{change.type}</span>
                    <span className="text-muted-foreground">at {change.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={() => onEditClick(commit)} className="w-full mt-2" variant="outline">
              <Edit2 className="mr-2 h-4 w-4" />
              Enter Edit Mode
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

