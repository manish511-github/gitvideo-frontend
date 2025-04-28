"use client"

import { useState, useRef, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight } from "lucide-react"
import { PlaybackControls } from "./playback-controls"
import { Timeline } from "./timeline"
import { ToolbarSidebar } from "./toolbar-sidebar"
import { ClipsPanel } from "./clips-panel"
import { CutPanel } from "./cut-panel"
import { useThumbnailGenerator } from "./thumbnail-generator"
import { formatTime } from "./utils"
import { VideoPlayer } from "./video-player"
import type { VideoClip, TabId } from "./types"

interface SimplifiedVideoEditorProps {
  videoSrc?: string
  videoId?: string
}

export function SimplifiedVideoEditor({ videoSrc, videoId }: SimplifiedVideoEditorProps) {
  // State for video player
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [buffered, setBuffered] = useState<TimeRanges | null>(null)

  // State for UI
  const [activeTab, setActiveTab] = useState<TabId>("clips")
  const [selectedClip, setSelectedClip] = useState<number | null>(null)
  const [showPanel, setShowPanel] = useState(true)

  // State for clips
  const [clips, setClips] = useState<VideoClip[]>([])
  const [isGeneratingThumbnails, setIsGeneratingThumbnails] = useState(false)
  const [thumbnailProgress, setThumbnailProgress] = useState(0)

  // State for clip insertion
  const [isAddingClip, setIsAddingClip] = useState(false)
  const [insertPosition, setInsertPosition] = useState<"after" | "between" | null>(null)
  const [insertTime, setInsertTime] = useState(0)

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Dummy video URL for testing
  const dummyVideoSrc = videoSrc || "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

  // Use the thumbnail generator hook
  const { generateThumbnails } = useThumbnailGenerator({
    canvasRef,
    setIsGeneratingThumbnails,
    setThumbnailProgress,
    setClips,
  })

  // Initialize video player and create initial clip
  useEffect(() => {
    if (!videoRef.current) return

    const handleVideoReady = () => {
      console.log("Video ready, checking for thumbnails")
      if (clips.length > 0 && duration) {
        const mainClip = clips[0]
        if (!mainClip.thumbnails || mainClip.thumbnails.length === 0) {
          console.log("Generating thumbnails on canplay")
          generateThumbnails(mainClip.id, videoSrc || dummyVideoSrc, 0, duration)
        }
      }
    }

    const handleDurationChange = (newDuration: number) => {
      setDuration(newDuration)

      // Create a clip for the entire video when duration is available
      if (clips.length === 0) {
        const newClip = {
          id: 1,
          name: videoId || "Main Video",
          start: 0,
          end: newDuration,
          videoSrc: videoSrc || dummyVideoSrc,
          thumbnailsGenerated: false,
        }

        setClips([newClip])

        // Generate thumbnails for the clip once we have duration
        if (videoRef.current?.readyState >= 2) {
          // HAVE_CURRENT_DATA or higher
          console.log("Video ready, generating thumbnails")
          setTimeout(() => {
            generateThumbnails(1, videoSrc || dummyVideoSrc, 0, newDuration)
          }, 1000)
        }
      }
    }

    // These handlers will be passed to the VideoPlayer component
  }, [videoSrc, videoId, dummyVideoSrc, clips, duration, generateThumbnails])

  // Toggle play/pause
  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play().catch((e) => console.error("Error playing video:", e))
    }
  }

  // Seek to time
  const seekTo = (time: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(0, Math.min(time, video.duration || 0))
  }

  // Toggle mute
  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  // Skip forward/backward
  const skipForward = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.min(video.currentTime + 10, video.duration || 0)
  }

  const skipBackward = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(video.currentTime - 10, 0)
  }

  // Cut clip at current position
  const cutClipAtCurrentTime = () => {
    if (!duration || currentTime <= 0) return

    // Find which clip contains the current time
    const clipToCut = clips.find((clip) => currentTime >= clip.start && currentTime <= clip.end)

    if (!clipToCut) return

    // Create two new clips from the cut
    const newClipId = Math.max(...clips.map((c) => c.id)) + 1

    const updatedClips = clips.flatMap((clip) => {
      if (clip.id === clipToCut.id) {
        const part1 = {
          ...clip,
          end: currentTime,
          name: `${clip.name} (Part 1)`,
          thumbnailsGenerated: false,
        }

        const part2 = {
          ...clip,
          id: newClipId,
          start: currentTime,
          name: `${clip.name} (Part 2)`,
          thumbnailsGenerated: false,
        }

        // Generate thumbnails for both parts
        setTimeout(() => {
          generateThumbnails(part1.id, part1.videoSrc || dummyVideoSrc, part1.start, part1.end)
          generateThumbnails(part2.id, part2.videoSrc || dummyVideoSrc, part2.start, part2.end)
        }, 500)

        return [part1, part2]
      }
      return [clip]
    })

    // Sort by start time
    updatedClips.sort((a, b) => a.start - b.start)
    setClips(updatedClips)
  }

  // Delete selected clip
  const deleteSelectedClip = () => {
    if (selectedClip === null) return

    setClips(clips.filter((clip) => clip.id !== selectedClip))
    setSelectedClip(null)
  }

  // Merge adjacent clips
  const mergeAdjacentClips = () => {
    if (selectedClip === null) return

    const selectedClipIndex = clips.findIndex((clip) => clip.id === selectedClip)
    if (selectedClipIndex === -1 || selectedClipIndex === clips.length - 1) return

    const currentClip = clips[selectedClipIndex]
    const nextClip = clips[selectedClipIndex + 1]

    // Check if they're adjacent
    if (Math.abs(currentClip.end - nextClip.start) > 0.1) return

    const mergedClip = {
      ...currentClip,
      end: nextClip.end,
      name: `${currentClip.name} + ${nextClip.name}`,
      thumbnailsGenerated: false,
    }

    const updatedClips = clips
      .filter((clip) => clip.id !== nextClip.id)
      .map((clip) => {
        if (clip.id === currentClip.id) {
          return mergedClip
        }
        return clip
      })

    setClips(updatedClips)

    // Generate thumbnails for the merged clip
    setTimeout(() => {
      generateThumbnails(mergedClip.id, mergedClip.videoSrc || dummyVideoSrc, mergedClip.start, mergedClip.end)
    }, 500)
  }

  // Update clip properties
  const updateClipProperties = (clipId: number, updates: Partial<VideoClip>) => {
    setClips(
      clips.map((clip) => {
        if (clip.id === clipId) {
          const updatedClip = { ...clip, ...updates, thumbnailsGenerated: false }

          // Generate thumbnails for the updated clip
          setTimeout(() => {
            generateThumbnails(clipId, updatedClip.videoSrc || dummyVideoSrc, updatedClip.start, updatedClip.end)
          }, 500)

          return updatedClip
        }
        return clip
      }),
    )
  }

  // Handle adding a new clip
  const handleAddClip = (position: "after" | "between") => {
    setIsAddingClip(true)
    setInsertPosition(position)

    if (position === "after") {
      // Set insert time to the end of the last clip
      const lastClip = clips[clips.length - 1]
      if (lastClip) {
        setInsertTime(lastClip.end)
      } else {
        setInsertTime(0)
      }
    } else {
      // Set insert time to current playhead position
      setInsertTime(currentTime)
    }
  }

  // Confirm adding a new clip
  const confirmAddClip = (clipName: string, clipSrc: string) => {
    const newClipId = Math.max(0, ...clips.map((c) => c.id)) + 1
    const videoSource = clipSrc || dummyVideoSrc

    if (insertPosition === "after") {
      // Add clip after the last clip
      const newClip = {
        id: newClipId,
        name: clipName,
        start: insertTime,
        end: insertTime + 30, // Default 30 seconds duration
        videoSrc: videoSource,
        thumbnailsGenerated: false,
      }

      setClips([...clips, newClip])

      // Generate thumbnails for the new clip
      setTimeout(() => {
        generateThumbnails(newClipId, videoSource, insertTime, insertTime + 30)
      }, 500)
    } else if (insertPosition === "between") {
      // Find which clip contains the current time
      const clipIndex = clips.findIndex((clip) => currentTime >= clip.start && currentTime <= clip.end)

      if (clipIndex !== -1) {
        const currentClip = clips[clipIndex]

        // Split the current clip and insert the new one
        const part1 = {
          ...currentClip,
          end: currentTime,
          name: `${currentClip.name} (Part 1)`,
          thumbnailsGenerated: false,
        }

        const newClip = {
          id: newClipId,
          name: clipName,
          start: currentTime,
          end: currentTime + 30, // Default 30 seconds
          videoSrc: videoSource,
          thumbnailsGenerated: false,
        }

        const part2 = {
          ...currentClip,
          id: newClipId + 1,
          start: currentTime + 30,
          name: `${currentClip.name} (Part 2)`,
          thumbnailsGenerated: false,
        }

        const updatedClips = [...clips.slice(0, clipIndex), part1, newClip, part2, ...clips.slice(clipIndex + 1)]

        setClips(updatedClips)

        // Generate thumbnails for all new clips
        setTimeout(() => {
          generateThumbnails(part1.id, part1.videoSrc || dummyVideoSrc, part1.start, part1.end)
          generateThumbnails(newClip.id, videoSource, newClip.start, newClip.end)
          generateThumbnails(part2.id, part2.videoSrc || dummyVideoSrc, part2.start, part2.end)
        }, 500)
      }
    }

    setIsAddingClip(false)
    setInsertPosition(null)
  }

  // Cancel adding a clip
  const cancelAddClip = () => {
    setIsAddingClip(false)
    setInsertPosition(null)
  }

  // Handle clip movement
  const handleClipMove = (clipId: number, newStart: number) => {
    const clip = clips.find((c) => c.id === clipId)
    if (!clip) return

    const clipDuration = clip.end - clip.start
    const newEnd = Math.min(duration, newStart + clipDuration)

    setClips(
      clips.map((c) => {
        if (c.id === clipId) {
          return { ...c, start: newStart, end: newEnd }
        }
        return c
      }),
    )
  }

  // Handle clip trimming
  const handleClipTrim = (clipId: number, newStart: number, newEnd: number) => {
    setClips(
      clips.map((c) => {
        if (c.id === clipId) {
          return { ...c, start: newStart, end: newEnd, thumbnailsGenerated: false }
        }
        return c
      }),
    )

    // Regenerate thumbnails after trimming
    const clip = clips.find((c) => c.id === clipId)
    if (clip) {
      setTimeout(() => {
        generateThumbnails(clipId, clip.videoSrc || dummyVideoSrc, newStart, newEnd)
      }, 500)
    }
  }

  // Get panel content based on active tab
  const getPanelContent = () => {
    switch (activeTab) {
      case "clips":
        return (
          <ClipsPanel
            clips={clips}
            selectedClip={selectedClip}
            onClipSelect={setSelectedClip}
            onAddClip={handleAddClip}
            onDeleteClip={deleteSelectedClip}
            isGeneratingThumbnails={isGeneratingThumbnails}
            thumbnailProgress={thumbnailProgress}
            isAddingClip={isAddingClip}
            insertPosition={insertPosition}
            insertTime={insertTime}
            onConfirmAddClip={confirmAddClip}
            onCancelAddClip={cancelAddClip}
            formatTime={formatTime}
          />
        )

      case "cut":
        return (
          <CutPanel
            currentTime={currentTime}
            selectedClip={selectedClip}
            clips={clips}
            onCutAtCurrentTime={cutClipAtCurrentTime}
            onDeleteSelectedClip={deleteSelectedClip}
            onMergeAdjacentClips={mergeAdjacentClips}
            onUpdateClip={updateClipProperties}
            onAddClip={handleAddClip}
            formatTime={formatTime}
          />
        )

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <div className="bg-zinc-800 rounded-full p-3 mb-3">
              {activeTab === "text" && <span className="h-4 w-4 text-white">T</span>}
            </div>
            <h3 className="text-sm font-medium text-white mb-1 capitalize">{activeTab}</h3>
            <p className="text-xs text-zinc-400 text-center max-w-xs">
              This panel allows you to work with {activeTab} in your video project.
            </p>
          </div>
        )
    }
  }

  return (
    <div className="flex h-full bg-zinc-950">
      {/* Hidden canvas for thumbnail generation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Left sidebar with icons */}
      <ToolbarSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Video preview area with fixed playback controls */}
        <div className="flex-1 p-3 pb-2 flex flex-col">
          <div className="flex-1 bg-black rounded-lg overflow-hidden shadow-xl relative">
            {/* Video player */}
            <div className="absolute inset-0">
              <VideoPlayer
                videoSrc={dummyVideoSrc}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                isMuted={isMuted}
                volume={volume}
                onTimeUpdate={setCurrentTime}
                onDurationChange={(newDuration: number) => setDuration(newDuration)}
                onBufferedChange={setBuffered}
                onPlayStateChange={setIsPlaying}
                onVideoReady={() => {}}
                videoRef={videoRef}
              />
            </div>

            {/* Playback controls */}
            <PlaybackControls
              currentTime={currentTime}
              duration={duration}
              isPlaying={isPlaying}
              isMuted={isMuted}
              buffered={buffered}
              onPlayPause={togglePlayPause}
              onSeek={seekTo}
              onSkipForward={skipForward}
              onSkipBackward={skipBackward}
              onToggleMute={toggleMute}
              formatTime={formatTime}
            />
          </div>
        </div>

        {/* Timeline area */}
        <div className="h-32 bg-zinc-900 border-t border-zinc-800 p-2 pt-4 flex flex-col">
          {/* Timeline header with controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="text-xs font-medium text-white mr-1.5">Timeline</span>
                <span className="text-[9px] bg-zinc-800/80 text-zinc-300 border border-zinc-700 rounded px-1.5 py-0">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                className="h-6 px-1.5 rounded bg-zinc-800/80 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700/80 transition-colors text-[9px]"
                onClick={cutClipAtCurrentTime}
              >
                <span className="h-2.5 w-2.5 mr-1">✂️</span>
                Cut
              </button>
              <button
                className="h-6 px-1.5 rounded bg-zinc-800/80 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700/80 transition-colors text-[9px]"
                onClick={mergeAdjacentClips}
                disabled={selectedClip === null}
              >
                <span className="h-2.5 w-2.5 mr-1">🔗</span>
                Merge
              </button>
            </div>
          </div>

          {/* Timeline component */}
          <Timeline
            clips={clips}
            currentTime={currentTime}
            duration={duration}
            selectedClip={selectedClip}
            onTimeChange={seekTo}
            onClipSelect={setSelectedClip}
            onClipMove={handleClipMove}
            onClipTrim={handleClipTrim}
            onDoubleClick={(time) => {
              seekTo(time)
              handleAddClip("between")
            }}
            timelineRef={timelineRef}
          />
        </div>
      </div>

      {/* Right panel */}
      <div
        className={`bg-zinc-900 border-l border-zinc-800 transition-all duration-300 ${showPanel ? "w-64" : "w-0 opacity-0 overflow-hidden"}`}
      >
        <div className="p-2 h-full">
          <ScrollArea className="h-full pr-1">{getPanelContent()}</ScrollArea>
        </div>
      </div>

      {/* Toggle panel button */}
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-zinc-800 border-l border-t border-b border-zinc-700 rounded-l-md p-1 text-zinc-400 hover:text-white"
        onClick={() => setShowPanel(!showPanel)}
      >
        <ChevronRight className={`h-3 w-3 transition-transform ${showPanel ? "rotate-180" : ""}`} />
      </button>
    </div>
  )
}
