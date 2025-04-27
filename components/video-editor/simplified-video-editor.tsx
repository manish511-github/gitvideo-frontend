"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Film,
  Scissors,
  Type,
  Music,
  Paintbrush,
  ContrastIcon as Transition,
  ImageIcon,
  Zap,
  Sliders,
  Sparkles,
  Palette,
  FolderOpen,
  Settings,
  ChevronRight,
  Plus,
  Trash2,
  Copy,
  Clock,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize,
  Volume2,
  VolumeX,
  Split,
  Combine,
} from "lucide-react"

interface SimplifiedVideoEditorProps {
  videoSrc?: string
  videoId?: string
}

// Add this interface at the top of the file with other interfaces
interface VideoClip {
  id: number
  name: string
  start: number
  end: number
  thumbnail?: string
  videoSrc?: string
  thumbnails?: { time: number; url: string }[]
  thumbnailsGenerated?: boolean // Track if thumbnails were already generated
}

export function SimplifiedVideoEditor({ videoSrc, videoId }: SimplifiedVideoEditorProps) {
  const [activeTab, setActiveTab] = useState("clips")
  const [selectedClip, setSelectedClip] = useState<number | null>(null)
  const [showPanel, setShowPanel] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [buffered, setBuffered] = useState<TimeRanges | null>(null)
  const [isDraggingClip, setIsDraggingClip] = useState(false)
  const [draggedClipId, setDraggedClipId] = useState<number | null>(null)
  const [dragStartX, setDragStartX] = useState(0)
  const [dragStartPosition, setDragStartPosition] = useState(0)
  const [isGeneratingThumbnails, setIsGeneratingThumbnails] = useState(false)
  const [thumbnailProgress, setThumbnailProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Dummy video URL for testing
  const dummyVideoSrc = videoSrc || "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

  // Update the state management for clips
  const [clips, setClips] = useState<VideoClip[]>([])
  const [isAddingClip, setIsAddingClip] = useState(false)
  const [insertPosition, setInsertPosition] = useState<"after" | "between" | null>(null)
  const [insertTime, setInsertTime] = useState(0)

  // Add this at the top of the component
  useEffect(() => {
    console.log("Current clips:", clips)
  }, [clips])

  // Function to generate thumbnails for a video clip
  const generateThumbnails = useCallback(
    async (clipId: number, videoSource: string, startTime: number, endTime: number, count = 10) => {
      if (!canvasRef.current) return

      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      setIsGeneratingThumbnails(true)
      setThumbnailProgress(0)

      // Set canvas dimensions to match video
      canvas.width = 160 // Thumbnail width
      canvas.height = 90 // Thumbnail height (16:9 aspect ratio)

      // Create a temporary video element to avoid disrupting the main player
      const tempVideo = document.createElement("video")
      tempVideo.crossOrigin = "anonymous" // This is the key fix for CORS issues
      tempVideo.src = videoSource
      tempVideo.muted = true

      const thumbnails: { time: number; url: string }[] = []
      const interval = (endTime - startTime) / count

      console.log(`Generating thumbnails for clip ${clipId} from ${startTime} to ${endTime}`)

      // Wait for temp video to be ready
      await new Promise<void>((resolve) => {
        tempVideo.onloadedmetadata = () => {
          tempVideo.currentTime = startTime
          resolve()
        }
        tempVideo.onerror = (e) => {
          console.error("Error loading video for thumbnails", e)
          setIsGeneratingThumbnails(false)
          resolve()
        }
      })

      try {
        for (let i = 0; i < count; i++) {
          const time = startTime + i * interval

          // Update progress
          setThumbnailProgress(Math.round((i / count) * 100))

          // Seek to the time
          tempVideo.currentTime = time

          // Wait for the video to seek
          await new Promise<void>((resolve) => {
            const onSeeked = () => {
              tempVideo.removeEventListener("seeked", onSeeked)
              resolve()
            }
            tempVideo.addEventListener("seeked", onSeeked)
          })

          try {
            // Draw the current frame to the canvas
            ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height)

            // Convert canvas to data URL
            const dataUrl = canvas.toDataURL("image/jpeg", 0.7)

            // Add to thumbnails array
            thumbnails.push({ time, url: dataUrl })
          } catch (err) {
            console.error("Error generating thumbnail:", err)
            // Continue with the loop even if one thumbnail fails
          }
        }
      } catch (err) {
        console.error("Error in thumbnail generation:", err)
      }

      // Clean up
      tempVideo.src = ""

      // Update the clip with thumbnails and mark as generated
      setClips((prevClips) =>
        prevClips.map((clip) => {
          if (clip.id === clipId) {
            return {
              ...clip,
              thumbnails,
              thumbnailsGenerated: true, // Mark as generated
            }
          }
          return clip
        }),
      )

      setIsGeneratingThumbnails(false)
      return thumbnails
    },
    [], // Empty dependency array since we're using setClips function which is stable
  )

  // Replace the useEffect that initializes the video player with this updated version
  useEffect(() => {
    // Initialize video player
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      if (video.currentTime && !isNaN(video.currentTime)) {
        setCurrentTime(video.currentTime)
      }
    }

    const handleDurationChange = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration)

        // Create a clip for the entire video when duration is available
        if (clips.length === 0) {
          const newClip = {
            id: 1,
            name: videoId || "Main Video",
            start: 0,
            end: video.duration,
            videoSrc: videoSrc || dummyVideoSrc,
            thumbnailsGenerated: false,
          }

          setClips([newClip])

          // Generate thumbnails for the clip once we have duration
          if (video.readyState >= 2) {
            // HAVE_CURRENT_DATA or higher
            console.log("Video ready, generating thumbnails")
            setTimeout(() => {
              generateThumbnails(1, videoSrc || dummyVideoSrc, 0, video.duration)
            }, 1000)
          }
        }
      }
    }

    const handleProgress = () => {
      setBuffered(video.buffered)
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    // Handle video loaded enough to generate thumbnails
    const handleCanPlay = () => {
      console.log("Video can play, checking for thumbnails")
      if (clips.length > 0 && video.duration) {
        const mainClip = clips[0]
        if (!mainClip.thumbnails || mainClip.thumbnails.length === 0) {
          console.log("Generating thumbnails on canplay")
          generateThumbnails(mainClip.id, videoSrc || dummyVideoSrc, 0, video.duration)
        }
      }
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("durationchange", handleDurationChange)
    video.addEventListener("progress", handleProgress)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)
    video.addEventListener("canplay", handleCanPlay)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("durationchange", handleDurationChange)
      video.removeEventListener("progress", handleProgress)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
      video.removeEventListener("canplay", handleCanPlay)
    }
  }, [videoSrc, videoId, dummyVideoSrc, clips, generateThumbnails])

  // Add synchronization effect to keep video and state in sync
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // This ensures the video element's currentTime is always in sync with our state
    const syncCurrentTime = () => {
      if (Math.abs(video.currentTime - currentTime) > 0.5) {
        video.currentTime = currentTime
      }
    }

    syncCurrentTime()
  }, [currentTime])

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

  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds)) return "00:00"
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Handle timeline click for seeking
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !duration || !videoRef.current) return

    // Don't seek if we're clicking on a clip
    if ((e.target as HTMLElement).closest(".timeline-clip")) {
      return
    }

    e.preventDefault()
    e.stopPropagation()

    const rect = timelineRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const clickTime = Math.max(0, Math.min((offsetX / rect.width) * duration, duration))

    console.log("Timeline seeking to:", clickTime)
    videoRef.current.currentTime = clickTime
    setCurrentTime(clickTime)
  }

  // Handle clip mouse down for dragging
  const handleClipMouseDown = (e: React.MouseEvent, clipId: number) => {
    e.stopPropagation()
    setSelectedClip(clipId)
    setDraggedClipId(clipId)
    setDragStartX(e.clientX)

    const clip = clips.find((c) => c.id === clipId)
    if (clip) {
      setDragStartPosition(clip.start)
    }

    setIsDraggingClip(true)
  }

  // Handle mouse move for dragging clips
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingClip || draggedClipId === null || !timelineRef.current || !duration) return

    const rect = timelineRef.current.getBoundingClientRect()
    const deltaX = e.clientX - dragStartX
    const deltaTime = (deltaX / rect.width) * duration

    const updatedClips = clips.map((clip) => {
      if (clip.id === draggedClipId) {
        const newStart = Math.max(0, dragStartPosition + deltaTime)
        const clipDuration = clip.end - clip.start
        const newEnd = Math.min(duration, newStart + clipDuration)

        return {
          ...clip,
          start: newStart,
          end: newEnd,
        }
      }
      return clip
    })

    setClips(updatedClips)
  }

  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    setIsDraggingClip(false)
    setDraggedClipId(null)
  }

  // Add global mouse up event listener
  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp)
    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

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

  // Get icon for sidebar item
  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "clips":
        return <Film className="h-4 w-4" />
      case "cut":
        return <Scissors className="h-4 w-4" />
      case "text":
        return <Type className="h-4 w-4" />
      case "audio":
        return <Music className="h-4 w-4" />
      case "effects":
        return <Paintbrush className="h-4 w-4" />
      case "transitions":
        return <Transition className="h-4 w-4" />
      case "images":
        return <ImageIcon className="h-4 w-4" />
      case "animations":
        return <Zap className="h-4 w-4" />
      case "adjustments":
        return <Sliders className="h-4 w-4" />
      case "ai":
        return <Sparkles className="h-4 w-4" />
      case "chroma":
        return <Palette className="h-4 w-4" />
      case "files":
        return <FolderOpen className="h-4 w-4" />
      case "export":
        return <Settings className="h-4 w-4" />
      default:
        return <Film className="h-4 w-4" />
    }
  }

  // Add these new functions for clip insertion
  // Add function to handle adding a new clip
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

  // Add function to confirm adding a new clip
  const confirmAddClip = (clipName: string, clipSrc: string) => {
    const newClipId = Math.max(0, ...clips.map((c) => c.id)) + 1

    if (insertPosition === "after") {
      // Add clip after the last clip
      const newClip = {
        id: newClipId,
        name: clipName,
        start: insertTime,
        end: insertTime + 30, // Default 30 seconds duration
        videoSrc: clipSrc,
        thumbnailsGenerated: false,
      }

      setClips([...clips, newClip])

      // Generate thumbnails for the new clip
      setTimeout(() => {
        generateThumbnails(newClipId, clipSrc, insertTime, insertTime + 30)
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
          videoSrc: clipSrc,
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
          generateThumbnails(newClip.id, clipSrc, newClip.start, newClip.end)
          generateThumbnails(part2.id, part2.videoSrc || dummyVideoSrc, part2.start, part2.end)
        }, 500)
      }
    }

    setIsAddingClip(false)
    setInsertPosition(null)
  }

  // Add function to cancel adding a clip
  const cancelAddClip = () => {
    setIsAddingClip(false)
    setInsertPosition(null)
  }

  // Get panel content based on active tab
  const getPanelContent = () => {
    switch (activeTab) {
      // Replace the getPanelContent function's "clips" case with this updated version
      // that includes the new clip insertion UI
      case "clips":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Clips</h3>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                  onClick={() => handleAddClip("after")}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add After
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                  onClick={() => handleAddClip("between")}
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
                      defaultValue={dummyVideoSrc}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 block mb-1">Insert at: {formatTime(insertTime)}</label>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={cancelAddClip}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      className="h-7 text-xs bg-teal-600 hover:bg-teal-700"
                      onClick={() => {
                        const nameInput = document.getElementById("new-clip-name") as HTMLInputElement
                        const srcInput = document.getElementById("new-clip-src") as HTMLInputElement
                        confirmAddClip(nameInput?.value || "New Clip", srcInput?.value || dummyVideoSrc)
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
                      onClick={() => setSelectedClip(clip.id)}
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
                            <Badge
                              variant="outline"
                              className="text-[8px] h-3.5 bg-zinc-800 text-zinc-400 border-zinc-700"
                            >
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
                                  setSelectedClip(clip.id)
                                  deleteSelectedClip()
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

      case "cut":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">Cut & Trim</h3>
              <Button
                size="sm"
                variant="outline"
                className="h-7 bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                onClick={cutClipAtCurrentTime}
              >
                <Scissors className="h-3 w-3 mr-1" />
                Cut at {formatTime(currentTime)}
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-medium text-zinc-300">Current Position</h4>
                  <span className="text-[10px] text-zinc-400">{formatTime(currentTime)}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-medium text-zinc-300">Actions</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 justify-start h-7 text-xs"
                    onClick={cutClipAtCurrentTime}
                  >
                    <Split className="h-3 w-3 mr-1.5" />
                    Split
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 justify-start h-7 text-xs"
                    onClick={deleteSelectedClip}
                    disabled={selectedClip === null}
                  >
                    <Trash2 className="h-3 w-3 mr-1.5" />
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 justify-start h-7 text-xs"
                    onClick={mergeAdjacentClips}
                    disabled={selectedClip === null}
                  >
                    <Combine className="h-3 w-3 mr-1.5" />
                    Merge
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700 justify-start h-7 text-xs"
                  >
                    <Clock className="h-3 w-3 mr-1.5" />
                    Speed
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <div className="bg-zinc-800 rounded-full p-3 mb-3">{getTabIcon(activeTab)}</div>
            <h3 className="text-sm font-medium text-white mb-1 capitalize">{activeTab}</h3>
            <p className="text-xs text-zinc-400 text-center max-w-xs">
              This panel allows you to work with {activeTab} in your video project.
            </p>
          </div>
        )
    }
  }

  // Update the handleTimelineClick function to also handle double-click for inserting clips
  const positionToTime = (offsetX: number) => {
    if (!timelineRef.current || !duration) return 0
    const rect = timelineRef.current.getBoundingClientRect()
    const clickPosition = offsetX / rect.width
    return clickPosition * duration
  }

  const handleTimelineDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return

    // Don't insert if we're clicking on a clip
    if ((e.target as HTMLElement).closest(".timeline-clip")) {
      return
    }

    const rect = timelineRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left
    const clickTime = positionToTime(offsetX)

    // Set current time to click position
    seekTo(clickTime)

    // Open insert clip dialog
    handleAddClip("between")
  }

  // Function to find the appropriate thumbnail for a position in the timeline
  const getThumbnailForPosition = (clip: VideoClip, position: number): string | undefined => {
    if (!clip.thumbnails || clip.thumbnails.length === 0) {
      return clip.thumbnail
    }

    // Find the thumbnail closest to the position
    const relativePosition = (position - clip.start) / (clip.end - clip.start)
    const index = Math.floor(relativePosition * clip.thumbnails.length)
    const safeIndex = Math.max(0, Math.min(clip.thumbnails.length - 1, index))

    return clip.thumbnails[safeIndex]?.url
  }

  return (
    <div className="flex h-full bg-zinc-950">
      {/* Hidden canvas for thumbnail generation */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Left sidebar with icons */}
      <div className="w-12 bg-black border-r border-zinc-800 flex flex-col items-center py-3">
        <TooltipProvider>
          {[
            { id: "clips", label: "Clips", desc: "Manage clips" },
            { id: "cut", label: "Cut/Trim", desc: "Cut, trim videos" },
            { id: "text", label: "Text", desc: "Add text, captions" },
            { id: "audio", label: "Audio", desc: "Add audio" },
            { id: "effects", label: "Effects", desc: "Apply effects" },
            { id: "transitions", label: "Transitions", desc: "Add transitions" },
            { id: "images", label: "Images", desc: "Insert images" },
            { id: "animations", label: "Animations", desc: "Add animations" },
            { id: "adjustments", label: "Adjustments", desc: "Adjust video" },
            { id: "ai", label: "AI", desc: "AI features" },
            { id: "export", label: "Export", desc: "Export video" },
          ].map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <button
                  className={`w-8 h-8 rounded-md flex items-center justify-center mb-1 ${
                    activeTab === item.id
                      ? "bg-teal-500 text-black"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  {getTabIcon(item.id)}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex flex-col py-1 px-2">
                <p className="text-xs font-medium">{item.label}</p>
                <p className="text-[10px] text-zinc-400">{item.desc}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Video preview area with fixed playback controls */}
        <div className="flex-1 p-3 pb-2 flex flex-col">
          <div className="flex-1 bg-black rounded-lg overflow-hidden shadow-xl relative">
            {/* Video player */}
            <div className="absolute inset-0">
              <video
                ref={videoRef}
                src={dummyVideoSrc}
                className="w-full h-full object-contain"
                poster="/video-editor-workspace.png"
                onClick={togglePlayPause}
                crossOrigin="anonymous"
              />
            </div>

            {/* Playback controls - fixed at bottom with dedicated space */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-10 pb-2 px-3">
              {/* Progress bar */}
              <div className="relative h-3 bg-zinc-700/50 rounded-full overflow-hidden cursor-pointer group mb-3">
                {/* Buffered segments */}
                {buffered &&
                  Array.from({ length: buffered.length }).map((_, i) => {
                    const start = buffered.start(i)
                    const end = buffered.end(i)
                    return (
                      <div
                        key={i}
                        className="absolute top-0 bottom-0 bg-zinc-500/50"
                        style={{
                          left: `${(start / duration) * 100}%`,
                          width: `${((end - start) / duration) * 100}%`,
                        }}
                      />
                    )
                  })}

                {/* Progress */}
                <div
                  className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />

                {/* Handle */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-5 w-5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100"
                  style={{ left: `${(currentTime / duration) * 100}%`, transform: "translate(-50%, -50%)" }}
                />

                {/* Clickable area */}
                <div
                  className="absolute inset-0 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()

                    if (!videoRef.current || !duration) return

                    const rect = e.currentTarget.getBoundingClientRect()
                    const pos = (e.clientX - rect.left) / rect.width
                    const newTime = Math.max(0, Math.min(pos * duration, duration))

                    console.log("Seeking to:", newTime)
                    videoRef.current.currentTime = newTime
                    setCurrentTime(newTime)
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                {/* Left controls */}
                <div className="flex items-center space-x-3">
                  <button
                    className="w-10 h-10 rounded-full bg-zinc-800/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-teal-500/80 transition-colors"
                    onClick={togglePlayPause}
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      className="w-8 h-8 rounded-full bg-zinc-800/60 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-zinc-700/80 transition-colors"
                      onClick={skipBackward}
                    >
                      <SkipBack className="h-4 w-4" />
                    </button>
                    <button
                      className="w-8 h-8 rounded-full bg-zinc-800/60 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-zinc-700/80 transition-colors"
                      onClick={skipForward}
                    >
                      <SkipForward className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-white/90 text-sm font-medium">
                    {formatTime(currentTime)} <span className="text-white/50 mx-1">/</span> {formatTime(duration)}
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center space-x-2">
                  <button
                    className="w-8 h-8 rounded-full bg-zinc-800/60 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-zinc-700/80 transition-colors"
                    onClick={toggleMute}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  <button className="w-8 h-8 rounded-full bg-zinc-800/60 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-zinc-700/80 transition-colors">
                    <Maximize className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline area - with fixed height and more space above */}
        <div className="h-32 bg-zinc-900 border-t border-zinc-800 p-2 pt-4 flex flex-col">
          {/* Timeline header with controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="text-xs font-medium text-white mr-1.5">Timeline</span>
                <Badge
                  variant="outline"
                  className="text-[9px] bg-zinc-800/80 text-zinc-300 border-zinc-700 px-1.5 py-0"
                >
                  {formatTime(duration)}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                className="h-6 px-1.5 rounded bg-zinc-800/80 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700/80 transition-colors text-[9px]"
                onClick={cutClipAtCurrentTime}
              >
                <Scissors className="h-2.5 w-2.5 mr-1" />
                Cut
              </button>
              <button
                className="h-6 px-1.5 rounded bg-zinc-800/80 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700/80 transition-colors text-[9px]"
                onClick={mergeAdjacentClips}
                disabled={selectedClip === null}
              >
                <Combine className="h-2.5 w-2.5 mr-1" />
                Merge
              </button>
            </div>
          </div>

          {/* Simplified timeline */}
          <div
            ref={timelineRef}
            className="flex-1 relative bg-zinc-800/50 rounded-md overflow-hidden"
            onClick={handleTimelineClick}
            onDoubleClick={handleTimelineDoubleClick}
            onMouseMove={handleMouseMove}
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

                // Create a gradient of thumbnails for the clip
                const thumbnailStyle =
                  clip.thumbnails && clip.thumbnails.length > 0
                    ? {
                        backgroundImage: `linear-gradient(to right, ${clip.thumbnails
                          .map(
                            (thumb, i) =>
                              `url(${thumb.url}) ${(i / clip.thumbnails.length) * 100}%, url(${thumb.url}) ${((i + 1) / clip.thumbnails.length) * 100}%`,
                          )
                          .join(", ")})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {}

                return (
                  <div
                    key={clip.id}
                    className={`timeline-clip absolute h-10 rounded-md border flex items-center justify-center overflow-hidden shadow-md cursor-move ${
                      selectedClip === clip.id ? "ring-1 ring-white" : ""
                    } ${isDraggingClip && draggedClipId === clip.id ? "opacity-70" : ""}`}
                    style={{
                      left: `${clipStart}%`,
                      width: `${clipWidth}%`,
                      top: "2px",
                      backgroundColor: `rgba(20, 184, 166, ${selectedClip === clip.id ? 0.4 : 0.2})`,
                      borderColor: `rgba(20, 184, 166, ${selectedClip === clip.id ? 0.8 : 0.4})`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedClip(clip.id)
                    }}
                    onMouseDown={(e) => handleClipMouseDown(e, clip.id)}
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
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-600/50 hover:bg-white/80 cursor-ew-resize"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-zinc-600/50 hover:bg-white/80 cursor-ew-resize"></div>
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
        </div>
      </div>

      {/* Right panel */}
      <div
        className={`bg-zinc-900 border-l border-zinc-800 transition-all duration-300 ${showPanel ? "w-64" : "w-0 opacity-0 overflow-hidden"}`}
      >
        <div className="p-3 h-full">
          <ScrollArea className="h-full pr-3">{getPanelContent()}</ScrollArea>
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
