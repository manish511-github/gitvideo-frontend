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
    <div className="flex-1 min-h-0 overflow-hidden w-full">
      <div className="h-full overflow-auto w-full">
        <div style={{ minWidth: `${calculateListViewWidth()}px` }}>
          {/* Header row */}
          <div className="flex items-center py-1.5 px-3 border-b text-[10px] font-medium text-muted-foreground bg-muted/5 sticky top-0 z-10">
            <div className="w-6 flex-shrink-0 flex items-center justify-center">
              <Checkbox className="h-3 w-3" />
            </div>
            <div className="flex-1 min-w-0">Name</div>

            {/* Dynamically render all visible fields */}
            {metadataFields
              .filter((field) => field.checked)
              .map((field) => {
                // Define field width based on field type
                const fieldWidth =
                  field.id === "dateUploaded"
                    ? "w-[160px]"
                    : field.id === "duration"
                      ? "w-[70px]"
                      : field.id === "uploader"
                        ? "w-[120px]"
                        : field.id === "sourceFilename"
                          ? "w-[110px]"
                          : "w-[100px]"

                return (
                  <div
                    key={field.id}
                    className={`${fieldWidth} flex-shrink-0 text-center ${field.id === "uploader" ? "text-left" : ""}`}
                  >
                    {field.label}
                  </div>
                )
              })}

            <div className="w-[70px] flex-shrink-0 text-center">Actions</div>
          </div>

          {/* Content rows */}
          <div className="divide-y divide-border/40">
            {filteredCommits.map((commit) => (
              <div
                key={commit.id}
                className={`flex items-center py-1.5 px-3 hover:bg-muted/20 cursor-pointer transition-colors ${
                  selectedCommit?.id === commit.id ? "bg-muted/30" : ""
                }`}
                onClick={() => handleAssetSelect(commit)}
              >
                <div className="w-6 flex-shrink-0 flex items-center justify-center">
                  <Checkbox
                    checked={selectedCommit?.id === commit.id}
                    className="h-3 w-3"
                    onCheckedChange={() => handleAssetSelect(commit)}
                  />
                </div>

                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <div className="relative w-10 h-7 overflow-hidden rounded flex-shrink-0">
                    <img
                      src={commit.videoAsset.thumbnail || "/placeholder.svg"}
                      alt={commit.videoAsset.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="min-w-0 overflow-hidden">
                    <div className="font-medium text-[10px] truncate">{commit.videoAsset.name}</div>
                    <div className="text-[9px] text-muted-foreground truncate">{commit.message}</div>
                  </div>
                </div>

                {/* Render all visible fields */}
                {metadataFields
                  .filter((field) => field.checked)
                  .map((field) => {
                    // Define field width based on field type
                    const fieldWidth =
                      field.id === "dateUploaded"
                        ? "w-[160px]"
                        : field.id === "duration"
                          ? "w-[70px]"
                          : field.id === "uploader"
                            ? "w-[120px]"
                            : field.id === "sourceFilename"
                              ? "w-[110px]"
                              : "w-[100px]"

                    if (field.id === "dateUploaded") {
                      return (
                        <div
                          key={field.id}
                          className={`${fieldWidth} flex-shrink-0 text-[9px] text-muted-foreground self-center text-center truncate px-2`}
                        >
                          {commit.date}
                        </div>
                      )
                    } else if (field.id === "duration") {
                      return (
                        <div
                          key={field.id}
                          className={`${fieldWidth} flex-shrink-0 text-[9px] text-muted-foreground self-center text-center`}
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
                          <Avatar className="h-4 w-4 flex-shrink-0">
                            <AvatarImage src={commit.avatar} alt={commit.author} />
                            <AvatarFallback className="text-[8px]">{commit.author[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-[9px] truncate">{commit.author}</span>
                        </div>
                      )
                    } else if (field.id === "sourceFilename") {
                      return (
                        <div
                          key={field.id}
                          className={`${fieldWidth} flex-shrink-0 text-[9px] text-muted-foreground self-center truncate px-2`}
                        >
                          {commit.videoAsset.name.split("/").pop()}
                        </div>
                      )
                    } else {
                      // For other fields, display a generic value
                      return (
                        <div
                          key={field.id}
                          className={`${fieldWidth} flex-shrink-0 text-[9px] text-muted-foreground self-center text-center`}
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

                <div className="w-[70px] flex-shrink-0 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      enterEditMode(commit)
                    }}
                    className="h-5 text-[9px] px-1.5"
                  >
                    <Edit2 className="h-2.5 w-2.5 mr-1" />
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

