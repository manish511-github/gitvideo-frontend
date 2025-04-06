"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { Commit, MetadataField } from "@/types/repo-types"
import { Edit2 } from "lucide-react"

interface ListViewProps {
  filteredCommits: Commit[]
  selectedCommit: Commit | null
  handleAssetSelect: (commit: Commit) => void
  enterEditMode: (commit: Commit) => void
  metadataFields: MetadataField[]
  calculateListViewWidth: () => number
}

export function ListView({
  filteredCommits,
  selectedCommit,
  handleAssetSelect,
  enterEditMode,
  metadataFields,
  calculateListViewWidth,
}: ListViewProps) {
  return (
    <div className="flex-1 min-h-0 overflow-hidden">
      <div className="h-full overflow-auto">
        <div style={{ minWidth: `${calculateListViewWidth()}px` }}>
          {/* Header row */}
          <div className="flex items-center py-2 px-3 border-b text-xs font-medium text-muted-foreground bg-muted/5 sticky top-0 z-10">
            <div className="w-7 flex-shrink-0 flex items-center justify-center">
              <Checkbox className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">Name</div>

            {/* Dynamically render all visible fields */}
            {metadataFields
              .filter((field) => field.checked)
              .map((field) => {
                // Define field width based on field type
                const fieldWidth =
                  field.id === "dateUploaded"
                    ? "w-[180px]"
                    : field.id === "duration"
                      ? "w-[80px]"
                      : field.id === "uploader"
                        ? "w-[140px]"
                        : field.id === "sourceFilename"
                          ? "w-[120px]"
                          : "w-[120px]"

                return (
                  <div
                    key={field.id}
                    className={`${fieldWidth} flex-shrink-0 text-center ${field.id === "uploader" ? "text-left" : ""}`}
                  >
                    {field.label}
                  </div>
                )
              })}

            <div className="w-[80px] flex-shrink-0 text-center">Actions</div>
          </div>

          {/* Content rows */}
          <div className="divide-y">
            {filteredCommits.map((commit) => (
              <div
                key={commit.id}
                className={`flex items-center py-2 px-3 hover:bg-muted/30 cursor-pointer transition-colors ${
                  selectedCommit?.id === commit.id ? "bg-muted/50" : ""
                }`}
                onClick={() => handleAssetSelect(commit)}
              >
                <div className="w-7 flex-shrink-0 flex items-center justify-center">
                  <Checkbox
                    checked={selectedCommit?.id === commit.id}
                    className="h-3.5 w-3.5"
                    onCheckedChange={() => handleAssetSelect(commit)}
                  />
                </div>

                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <div className="relative w-12 h-8 overflow-hidden rounded flex-shrink-0">
                    <img
                      src={commit.videoAsset.thumbnail || "/placeholder.svg"}
                      alt={commit.videoAsset.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="min-w-0 overflow-hidden">
                    <div className="font-medium text-xs truncate">{commit.videoAsset.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{commit.message}</div>
                  </div>
                </div>

                {/* Render all visible fields */}
                {metadataFields
                  .filter((field) => field.checked)
                  .map((field) => {
                    // Define field width based on field type
                    const fieldWidth =
                      field.id === "dateUploaded"
                        ? "w-[180px]"
                        : field.id === "duration"
                          ? "w-[80px]"
                          : field.id === "uploader"
                            ? "w-[140px]"
                            : field.id === "sourceFilename"
                              ? "w-[120px]"
                              : "w-[120px]"

                    if (field.id === "dateUploaded") {
                      return (
                        <div
                          key={field.id}
                          className={`${fieldWidth} flex-shrink-0 text-xs text-muted-foreground self-center text-center truncate px-2`}
                        >
                          {commit.date}
                        </div>
                      )
                    } else if (field.id === "duration") {
                      return (
                        <div
                          key={field.id}
                          className={`${fieldWidth} flex-shrink-0 text-xs text-muted-foreground self-center text-center`}
                        >
                          {commit.videoAsset.duration}
                        </div>
                      )
                    } else if (field.id === "uploader") {
                      return (
                        <div
                          key={field.id}
                          className={`${fieldWidth} flex-shrink-0 flex items-center gap-1.5 self-center`}
                        >
                          <Avatar className="h-5 w-5 flex-shrink-0">
                            <AvatarImage src={commit.avatar} alt={commit.author} />
                            <AvatarFallback>{commit.author[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs truncate">{commit.author}</span>
                        </div>
                      )
                    } else if (field.id === "sourceFilename") {
                      return (
                        <div
                          key={field.id}
                          className={`${fieldWidth} flex-shrink-0 text-xs text-muted-foreground self-center truncate px-2`}
                        >
                          {commit.videoAsset.name.split("/").pop()}
                        </div>
                      )
                    } else {
                      // For other fields, display a generic value
                      return (
                        <div
                          key={field.id}
                          className={`${fieldWidth} flex-shrink-0 text-xs text-muted-foreground self-center text-center`}
                        >
                          {field.id in commit.videoAsset
                            ? (commit.videoAsset as any)[field.id]
                            : field.id in commit
                              ? (commit as any)[field.id]
                              : "-"}
                        </div>
                      )
                    }
                  })}

                <div className="w-[80px] flex-shrink-0 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      enterEditMode(commit)
                    }}
                    className="h-6 text-xs px-2"
                  >
                    <Edit2 className="h-3 w-3 mr-1.5" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

