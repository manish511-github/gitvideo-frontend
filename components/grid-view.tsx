"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Commit } from "@/types/repo-types"
import { Edit2, Clock } from "lucide-react"

interface GridViewProps {
  filteredCommits: Commit[]
  selectedCommit: Commit | null
  handleAssetSelect: (commit: Commit) => void
  enterEditMode: (commit: Commit) => void
}

export function GridView({ filteredCommits, selectedCommit, handleAssetSelect, enterEditMode }: GridViewProps) {
  return (
    <div className="flex-1 min-h-0 overflow-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCommits.map((commit) => (
          <div
            key={commit.id}
            className={`group border rounded-lg overflow-hidden transition-all hover:shadow-md ${
              selectedCommit?.id === commit.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleAssetSelect(commit)}
          >
            {/* Thumbnail section */}
            <div className="relative aspect-video bg-muted/30">
              <img
                src={commit.videoAsset.thumbnail || "/placeholder.svg?height=180&width=320"}
                alt={commit.videoAsset.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Duration badge */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                {commit.videoAsset.duration}
              </div>

              {/* Edit button (appears on hover) */}
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 text-xs"
                onClick={(e) => {
                  e.stopPropagation()
                  enterEditMode(commit)
                }}
              >
                <Edit2 className="h-3 w-3 mr-1.5" />
                Edit
              </Button>
            </div>

            {/* Content section */}
            <div className="p-3">
              {/* Title and branch badge */}
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h3 className="font-medium text-sm line-clamp-1">{commit.videoAsset.name}</h3>
                <Badge variant="outline" className="text-[10px] px-1 py-0 shrink-0">
                  {commit.branch}
                </Badge>
              </div>

              {/* Commit message */}
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{commit.message}</p>

              {/* Author and date info */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={commit.avatar} alt={commit.author} />
                    <AvatarFallback>{commit.author[0]}</AvatarFallback>
                  </Avatar>
                  <span className="truncate max-w-[100px]">{commit.author}</span>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{commit.date.split(" at")[0]}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

