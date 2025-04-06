"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Scissors,
  Upload,
  Replace,
  Video,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface VideoPlayerProps {
  videoUrl?: string
  posterUrl?: string
  forceShowVideo?: boolean // Added to force showing video player even without URL
}

export function VideoPlayer({ videoUrl, posterUrl, forceShowVideo = true }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isControlsVisible, setIsControlsVisible] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [activeMarker, setActiveMarker] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Sample markers for edit points
  const markers = [
    { id: "cut1", type: "cut", position: 15, time: "0:15" },
    { id: "insert1", type: "insert", position: 35, time: "0:35" },
    { id: "replace1", type: "replace", position: 65, time: "1:05", duration: 10 },
  ]

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Handle seeking
  const handleSeek = (value: number[]) => {
    if (videoRef.current && duration > 0) {
      const newTime = (value[0] / 100) * duration
      videoRef.current.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0] / 100
      videoRef.current.volume = newVolume
      setVolume(newVolume)

      if (newVolume === 0) {
        setIsMuted(true)
      } else if (isMuted) {
        setIsMuted(false)
      }
    }
  }

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!playerRef.current) return

    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  // Skip forward/backward
  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }

  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // Update progress as video plays
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    const handleDurationChange = () => {
      setDuration(video.duration)
      setIsLoaded(true)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("durationchange", handleDurationChange)
    video.addEventListener("ended", handleEnded)
    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("durationchange", handleDurationChange)
      video.removeEventListener("ended", handleEnded)
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Auto-hide controls after inactivity
  const showControls = () => {
    setIsControlsVisible(true)

    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }

    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setIsControlsVisible(false)
      }
    }, 3000)
  }

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

  // Get marker icon based on type
  const getMarkerIcon = (type: string) => {
    switch (type) {
      case "cut":
        return <Scissors className="h-3 w-3" />
      case "insert":
        return <Upload className="h-3 w-3" />
      case "replace":
        return <Replace className="h-3 w-3" />
      default:
        return null
    }
  }

  // Get marker color based on type
  const getMarkerColor = (type: string) => {
    switch (type) {
      case "cut":
        return "bg-red-500"
      case "insert":
        return "bg-green-500"
      case "replace":
        return "bg-amber-500"
      default:
        return "bg-primary"
    }
  }

  // Always show video player in this version
  const showVideoPlayer = forceShowVideo || !!videoUrl

  return (
    <div className="w-full h-full">
      {showVideoPlayer ? (
        <Card className="overflow-hidden shadow-md w-full h-full border border-border dark:border-muted/30">
          <div
            ref={playerRef}
            className="relative bg-muted/90 dark:bg-black/90 w-full h-full"
            onMouseMove={showControls}
            onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/10 dark:from-black/10 to-transparent pointer-events-none z-10"></div>
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              poster={posterUrl || "/placeholder.svg?height=720&width=1280"}
              onClick={togglePlay}
              preload="metadata"
            >
              <source src={videoUrl || "/placeholder.mp4"} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Play/Pause overlay button (center of video) */}
            {!isPlaying && (
              <div
                className="absolute inset-0 flex items-center justify-center cursor-pointer z-20"
                onClick={togglePlay}
              >
                <div className="rounded-full bg-background/60 dark:bg-black/60 p-4 backdrop-blur-sm shadow-lg border border-border dark:border-white/10 transition-transform hover:scale-105">
                  <Play className="h-8 w-8 text-foreground dark:text-white" />
                </div>
              </div>
            )}

            {/* Video controls */}
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 dark:from-black/90 to-transparent px-4 py-3 transition-opacity duration-300",
                isControlsVisible ? "opacity-100" : "opacity-0",
              )}
            >
              {/* Progress bar with markers */}
              <div className="mb-3 relative">
                <Slider
                  value={[progressPercentage]}
                  max={100}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="cursor-pointer"
                />

                {/* Edit markers */}
                <TooltipProvider>
                  {markers.map((marker) => (
                    <Tooltip key={marker.id}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "absolute top-1/2 -translate-y-1/2 w-2 h-4 rounded-sm cursor-pointer transform -translate-x-1/2",
                            getMarkerColor(marker.type),
                            activeMarker === marker.id ? "ring-2 ring-white" : "",
                          )}
                          style={{ left: `${marker.position}%` }}
                          onClick={() => {
                            setActiveMarker(marker.id)
                            if (videoRef.current && duration > 0) {
                              const newTime = (marker.position / 100) * duration
                              videoRef.current.currentTime = newTime
                              setCurrentTime(newTime)
                            }
                          }}
                        >
                          {marker.type === "replace" && (
                            <div
                              className={cn("absolute h-1 rounded-sm", getMarkerColor(marker.type))}
                              style={{
                                width: `${marker.duration}%`,
                                left: "50%",
                                top: "50%",
                                transform: "translateY(-50%)",
                              }}
                            />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="flex items-center gap-1">
                        {getMarkerIcon(marker.type)}
                        <span className="capitalize">{marker.type}</span> at {marker.time}
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </TooltipProvider>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Play/Pause button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlay}
                    className="h-8 w-8 text-foreground dark:text-white hover:bg-background/20 dark:hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>

                  {/* Skip backward */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => skip(-10)}
                    className="h-8 w-8 text-foreground dark:text-white hover:bg-background/20 dark:hover:bg-white/20"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  {/* Skip forward */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => skip(10)}
                    className="h-8 w-8 text-foreground dark:text-white hover:bg-background/20 dark:hover:bg-white/20"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>

                  {/* Volume control */}
                  <div
                    className="relative flex items-center"
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMute}
                      className="h-8 w-8 text-foreground dark:text-white hover:bg-background/20 dark:hover:bg-white/20"
                    >
                      {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>

                    {/* Volume slider */}
                    {showVolumeSlider && (
                      <div className="absolute bottom-full left-0 mb-2 w-24 bg-background/80 dark:bg-black/80 p-2 rounded">
                        <Slider
                          value={[isMuted ? 0 : volume * 100]}
                          max={100}
                          step={1}
                          onValueChange={handleVolumeChange}
                        />
                      </div>
                    )}
                  </div>

                  {/* Time display */}
                  <div className="text-xs text-foreground dark:text-white">
                    {formatTime(currentTime)} / {isLoaded ? formatTime(duration) : "--:--"}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Settings button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-foreground dark:text-white hover:bg-background/20 dark:hover:bg-white/20"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>

                  {/* Fullscreen button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    className="h-8 w-8 text-foreground dark:text-white hover:bg-background/20 dark:hover:bg-white/20"
                  >
                    {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        // No video selected placeholder - full width and height
        <Card className="w-full h-full flex items-center justify-center overflow-hidden">
          <div className="w-full h-full flex flex-col items-center justify-center bg-muted/30 text-muted-foreground p-4">
            <Video className="h-16 w-16 mb-4 opacity-50" />
            <h3 className="text-xl font-medium">Select a video to preview</h3>
            <p className="text-sm mt-2 max-w-md text-center">
              Choose a video from your repository to view and edit it here
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

