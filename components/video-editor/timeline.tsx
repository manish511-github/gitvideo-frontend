"use client"

import type React from "react"
import { Film } from "lucide-react"
import type { TimelineProps } from "./types"
import { formatTime } from "./utils"

export const Timeline: React.FC<TimelineProps> = ({
  clips,
  currentTime,
  duration,
  selectedClip,
  onTimeChange,
  onClipSelect,
  onClipMove,
  onClipTrim,
  onDoubleClick,
  timelineRef,
}) => {
  // Handle timeline click for seeking
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !duration) return

    // Don't seek if we're clicking on a clip
    if ((e.target as HTMLElement).closest(".timeline-clip")) {
      return
    }

    e.preventDefault()
    e.stopPropagation()

    const rect = timelineRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const clickTime = Math.max(0, Math.min((offsetX / rect.width) * duration, duration))

    onTimeChange(clickTime)
  }

  // Handle timeline double click
  const handleTimelineDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return

    // Don't insert if we're clicking on a clip
    if ((e.target as HTMLElement).closest(".timeline-clip")) {
      return
    }

    const rect = timelineRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const clickTime = (offsetX / rect.width) * duration

    // Set current time to click position
    onTimeChange(clickTime)

    // Trigger double click handler
    onDoubleClick(clickTime)
  }

  // Handle clip mouse down for dragging
  const handleClipMouseDown = (e: React.MouseEvent, clipId: number, action: "move" | "trimStart" | "trimEnd") => {
    e.stopPropagation()
    onClipSelect(clipId)

    // Set up drag handling based on action
    const startX = e.clientX
    const clip = clips.find((c) => c.id === clipId)
    if (!clip) return

    const startPosition = clip.start
    const clipDuration = clip.end - clip.start

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!timelineRef.current || !duration) return

      const rect = timelineRef.current.getBoundingClientRect()
      const deltaX = moveEvent.clientX - startX
      const deltaTime = (deltaX / rect.width) * duration

      if (action === "move") {
        const newStart = Math.max(0, startPosition + deltaTime)
        const newEnd = Math.min(duration, newStart + clipDuration)

        // Update clip position
        onClipMove(clipId, newStart)
      } else if (action === "trimStart") {
        const newStart = Math.max(0, Math.min(clip.end - 0.5, startPosition + deltaTime))
        onClipTrim(clipId, newStart, clip.end)
      } else if (action === "trimEnd") {
        const newEnd = Math.max(clip.start + 0.5, Math.min(duration, clip.end + deltaTime))
        onClipTrim(clipId, clip.start, newEnd)
      }
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  return (
    <div
      ref={timelineRef}
      className="flex-1 relative bg-zinc-800/50 rounded-md overflow-hidden"
      onClick={handleTimelineClick}
      onDoubleClick={handleTimelineDoubleClick}
    >
      {/* Time markers */}
      <div className="absolute top-0 left-0 right-0 h-4 border-b border-zinc-700 flex">
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className="flex-1 relative">
            <div className="absolute top-0 left-0 h-2 w-px bg-zinc-600"></div>
            <div className="absolute top-2 left-1 text-[8px] text-zinc-500 font-mono">
              {formatTime((i / 10) * duration)}
            </div>
          </div>
        ))}
      </div>

      {/* Clips */}
      <div className="absolute top-4 bottom-0 left-0 right-0">
        {clips.map((clip) => {
          const clipStart = (clip.start / duration) * 100
          const clipWidth = ((clip.end - clip.start) / duration) * 100

          return (
            <div
              key={clip.id}
              className={`timeline-clip absolute h-10 rounded-md border flex items-center justify-center overflow-hidden shadow-md cursor-move ${
                selectedClip === clip.id ? "ring-1 ring-white" : ""
              }`}
              style={{
                left: `${clipStart}%`,
                width: `${clipWidth}%`,
                top: "2px",
                backgroundColor: `rgba(20, 184, 166, ${selectedClip === clip.id ? 0.4 : 0.2})`,
                borderColor: `rgba(20, 184, 166, ${selectedClip === clip.id ? 0.8 : 0.4})`,
              }}
              onClick={(e) => {
                e.stopPropagation()
                onClipSelect(clip.id)
              }}
              onMouseDown={(e) => handleClipMouseDown(e, clip.id, "move")}
            >
              {/* Clip content with thumbnails */}
              <div className="absolute inset-0 flex overflow-hidden">
                {clip.thumbnails && clip.thumbnails.length > 0 ? (
                  // Display thumbnails in a row
                  clip.thumbnails.map((thumb, i) => (
                    <div
                      key={i}
                      className="h-full flex-grow"
                      style={{
                        width: `${100 / clip.thumbnails.length}%`,
                        backgroundImage: `url(${thumb.url})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        opacity: 0.7,
                      }}
                    />
                  ))
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                    <Film className="h-4 w-4 text-zinc-500" />
                  </div>
                )}
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0.5 left-1 right-1 flex items-center justify-between">
                <span className="text-[8px] text-white font-medium truncate">{clip.name}</span>
                <span className="text-[7px] text-zinc-300 bg-black/50 px-0.5 rounded">
                  {formatTime(clip.end - clip.start)}
                </span>
              </div>

              {/* Clip handles for trimming */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-600/50 hover:bg-white/80 cursor-ew-resize"
                onMouseDown={(e) => handleClipMouseDown(e, clip.id, "trimStart")}
              ></div>
              <div
                className="absolute right-0 top-0 bottom-0 w-1 bg-zinc-600/50 hover:bg-white/80 cursor-ew-resize"
                onMouseDown={(e) => handleClipMouseDown(e, clip.id, "trimEnd")}
              ></div>
            </div>
          )
        })}
      </div>

      {/* Playhead */}
      <div
        className="absolute top-4 bottom-0 w-0.5 bg-teal-500 z-10"
        style={{ left: `${(currentTime / duration) * 100}%` }}
      >
        <div className="w-3 h-3 bg-teal-500 rounded-full -ml-[6px] -mt-[6px] shadow-lg flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
