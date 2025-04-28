"use client"

import type React from "react"
import { Film, Plus, Split, Copy, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ClipsPanelProps } from "./types"

export const ClipsPanel: React.FC<ClipsPanelProps> = ({
  clips,
  selectedClip,
  onClipSelect,
  onAddClip,
  onDeleteClip,
  isGeneratingThumbnails,
  thumbnailProgress,
  isAddingClip,
  insertPosition,
  insertTime,
  onConfirmAddClip,
  onCancelAddClip,
  formatTime,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white">Clips</h3>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-7 bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
            onClick={() => onAddClip("after")}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add After
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
            onClick={() => onAddClip("between")}
          >
            <Split className="h-3 w-3 mr-1" />
            Insert
          </Button>
        </div>
      </div>

      {isGeneratingThumbnails && (
        <div className="p-2 bg-zinc-800/50 rounded-md">
          <div className="text-xs text-zinc-300 mb-1">Generating thumbnails...</div>
          <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 transition-all duration-300"
              style={{ width: `${thumbnailProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {isAddingClip ? (
        <div className="space-y-2 p-2 border border-zinc-700 rounded-md bg-zinc-800/50">
          <h4 className="text-xs font-medium text-white">
            {insertPosition === "after" ? "Add Clip After" : "Insert Clip"}
          </h4>
          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Clip Name</label>
              <input
                type="text"
                className="w-full bg-zinc-900 border border-zinc-700 rounded text-xs px-2 py-1 text-white"
                placeholder="New Clip"
                id="new-clip-name"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Video Source</label>
              <input
                type="text"
                className="w-full bg-zinc-900 border border-zinc-700 rounded text-xs px-2 py-1 text-white"
                placeholder="Video URL"
                id="new-clip-src"
              />
            </div>
            <div>
              <label className="text-[10px] text-zinc-400 block mb-1">Insert at: {formatTime(insertTime)}</label>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={onCancelAddClip}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="default"
                className="h-7 text-xs bg-teal-600 hover:bg-teal-700"
                onClick={() => {
                  const nameInput = document.getElementById("new-clip-name") as HTMLInputElement
                  const srcInput = document.getElementById("new-clip-src") as HTMLInputElement
                  onConfirmAddClip(nameInput?.value || "New Clip", srcInput?.value || "")
                }}
              >
                Add Clip
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          {clips.length === 0 ? (
            <div className="text-center py-4 text-zinc-500 text-xs">No clips available. Add your first clip.</div>
          ) : (
            clips.map((clip) => (
              <div
                key={clip.id}
                className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                  selectedClip === clip.id
                    ? "bg-teal-500/20 border border-teal-500/40"
                    : "hover:bg-zinc-800 border border-transparent"
                }`}
                onClick={() => onClipSelect(clip.id)}
              >
                <div className="flex gap-2">
                  <div className="relative w-16 h-10 rounded overflow-hidden bg-zinc-800">
                    {clip.thumbnails && clip.thumbnails.length > 0 ? (
                      <img
                        src={clip.thumbnails[Math.floor(clip.thumbnails.length / 2)].url || "/placeholder.svg"}
                        alt={clip.name}
                        className="w-full h-full object-cover"
                      />
                    ) : clip.thumbnail ? (
                      <img
                        src={clip.thumbnail || "/placeholder.svg"}
                        alt={clip.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                        <Film className="h-4 w-4 text-zinc-500" />
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[8px] px-1 py-0.5">
                      {formatTime(clip.end - clip.start)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-medium text-white truncate">{clip.name}</h4>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Badge variant="outline" className="text-[8px] h-3.5 bg-zinc-800 text-zinc-400 border-zinc-700">
                        {formatTime(clip.start)} - {formatTime(clip.end)}
                      </Badge>
                      <div className="flex gap-1">
                        <button className="text-zinc-400 hover:text-white">
                          <Copy className="h-2.5 w-2.5" />
                        </button>
                        <button
                          className="text-zinc-400 hover:text-red-400"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteClip(clip.id)
                          }}
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
