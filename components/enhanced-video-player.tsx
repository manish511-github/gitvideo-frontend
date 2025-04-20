"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
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
  Clock,
  Layers,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Hls from "hls.js"

// Add a default HLS test stream URL
const TEST_HLS_URL = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"

interface VideoPlayerProps {
  videoUrl?: string
  posterUrl?: string
  forceShowVideo?: boolean
  title?: string
  author?: string
  authorAvatar?: string
  useHls?: boolean
}

export function EnhancedVideoPlayer({
  videoUrl,
  posterUrl,
  forceShowVideo = true,
  title,
  author = "Sarah Chen",
  authorAvatar = "/placeholder.svg?height=32&width=32",
  useHls = true, // Default to using HLS
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isControlsVisible, setIsControlsVisible] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [activeMarker, setActiveMarker] = useState<string | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const [hlsInstance, setHlsInstance] = useState<Hls | null>(null)
  const [isHovering, setIsHovering] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  // Sample markers for edit points
  const markers = [
    { id: "cut1", type: "cut", position: 15, time: "0:15" },
    { id: "insert1", type: "insert", position: 35, time: "0:35" },
    { id: "replace1", type: "replace", position: 65, time: "1:05", duration: 10 },
  ]

  // Initialize HLS
  useEffect(() => {
    if (!videoRef.current) return

    // Clean up previous HLS instance if it exists
    if (hlsInstance) {
      hlsInstance.destroy()
      setHlsInstance(null)
    }
    const frontUrl = "http://localhost:4566/video-processed/";
    // const fullVideoUrl = videoUrl ? `${frontUrl}${videoUrl}` : null;

    // const videoSrc = useHls ? TEST_HLS_URL : videoUrl || "/placeholder.mp4"
    const videoSrc = videoUrl ? `${frontUrl}${videoUrl}` : null;

    // Check if HLS is needed and supported
    if (useHls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      })

      if (videoSrc) {
        hls.loadSource(videoSrc)
      } else {
        console.error("Video source is null or undefined.")
      }
      hls.attachMedia(videoRef.current)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false)
        if (isPlaying && videoRef.current) {
          videoRef.current.play().catch((err) => console.error("Error playing video:", err))
        }
      })

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("HLS network error - trying to recover")
              hls.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("HLS media error - trying to recover")
              hls.recoverMediaError()
              break
            default:
              console.error("HLS fatal error - destroying", data)
              hls.destroy()
              break
          }
        }
      })

      setHlsInstance(hls)
    }
    // For Safari which has native HLS support or when not using HLS
    else if (videoRef.current) {
      if (videoSrc) {
        videoRef.current.src = videoSrc
      }
    }

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy()
      }
    }
  }, [useHls, videoUrl])

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play().catch((err) => console.error("Error playing video:", err))
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

  // Handle seeking with click on progress bar
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !videoRef.current || duration <= 0) return

    const rect = progressRef.current.getBoundingClientRect()
    const clickPosition = (e.clientX - rect.left) / rect.width
    const newTime = clickPosition * duration

    videoRef.current.currentTime = newTime
    setCurrentTime(newTime)
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
      setIsLoading(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    const handleLoadStart = () => {
      setIsLoading(true)
    }

    const handleCanPlay = () => {
      setIsLoading(false)
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("durationchange", handleDurationChange)
    video.addEventListener("ended", handleEnded)
    video.addEventListener("loadstart", handleLoadStart)
    video.addEventListener("canplay", handleCanPlay)
    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("durationchange", handleDurationChange)
      video.removeEventListener("ended", handleEnded)
      video.removeEventListener("loadstart", handleLoadStart)
      video.removeEventListener("canplay", handleCanPlay)
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
      if (isPlaying && !isHovering) {
        setIsControlsVisible(false)
        setShowInfo(false)
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
        <div
          className="overflow-hidden shadow-2xl w-full h-full relative rounded-lg bg-muted dark:bg-black"
          ref={playerRef}
          onMouseMove={showControls}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false)
            if (isPlaying) {
              setIsControlsVisible(false)
              setShowInfo(false)
            }
          }}
        >
          {/* Ambient light effect - subtle glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none z-10 opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-primary/5 pointer-events-none z-10 opacity-30"></div>

          {/* Video title and info overlay - appears on hover */}
          <div
            className={cn(
              "absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-background/80 dark:from-black/80 to-transparent flex items-center justify-between transition-all duration-500 z-20",
              isControlsVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Avatar className="h-6 w-6 border border-border dark:border-white/20">
                  <AvatarImage src={authorAvatar} alt={author} />
                  <AvatarFallback className="text-[10px] bg-muted dark:bg-zinc-800">{author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-foreground dark:text-white/90 text-xs font-medium tracking-wide">{title}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-muted-foreground dark:text-white/70 text-[10px]">{author}</p>
                    <div className="h-0.5 w-0.5 rounded-full bg-white/30"></div>
                    <p className="text-muted-foreground dark:text-white/70 text-[10px] tabular-nums">
                      {formatTime(duration)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge
                  className="bg-black/40 text-foreground dark:text-white border-0 backdrop-blur-sm text-[8px] flex items-center gap-1 px-1.5 py-0 shadow-md h-4"
                  variant="outline"
                >
                  <Layers className="h-2.5 w-2.5" />
                  4K UHD
                </Badge>
              </div>
            </div>
          </div>

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/60 backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full bg-black/80"></div>
                  </div>
                </div>
                <span className="text-xs text-foreground dark:text-white/80 mt-3 font-medium">Loading video...</span>
              </div>
            </div>
          )}

          {/* Video element */}
          <video
            ref={videoRef}
            className="w-full h-full object-contain bg-black"
            poster={posterUrl || "/placeholder.svg?height=720&width=1280"}
            onClick={togglePlay}
            preload="metadata"
            playsInline
            controls={false}
          >
            {/* No source tag needed when using HLS.js */}
            {!useHls && <source src={videoUrl || "/placeholder.mp4"} type="video/mp4" />}
            Your browser does not support the video tag.
          </video>

          {/* Play/Pause overlay button (center of video) */}
          {!isPlaying && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center cursor-pointer z-20" onClick={togglePlay}>
              <div className="rounded-full bg-background/60 dark:bg-black/60 p-3 backdrop-blur-sm shadow-lg border border-border dark:border-white/10 transition-transform hover:scale-105 group">
                <Play className="h-10 w-10 text-foreground dark:text-white transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          )}

          {/* Video controls */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 dark:from-black/90 to-transparent px-6 py-6 transition-all duration-500 z-30",
              isControlsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            {/* Progress bar with markers */}
            <div className="mb-4 relative group/progress py-2 hover:py-3 transition-all">
              {/* Progress bar background */}
              <div
                ref={progressRef}
                className="h-1 w-full bg-white/10 rounded-full overflow-hidden cursor-pointer group-hover/progress:h-2 transition-all duration-300 relative z-20"
                onClick={handleProgressClick}
              >
                {/* Buffered progress */}
                <div
                  className="h-full bg-white/20 absolute top-0 left-0 rounded-full transition-all"
                  style={{ width: `${Math.min(progressPercentage + 15, 100)}%` }}
                ></div>
                {/* Actual progress */}
                <div
                  className="h-full bg-white absolute top-0 left-0 rounded-full transition-all shadow-glow-sm"
                  style={{ width: `${progressPercentage}%` }}
                ></div>

                {/* Progress hover effect - glowing dot */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full shadow-glow opacity-0 group-hover/progress:opacity-100 transition-opacity duration-300"
                  style={{ left: `${progressPercentage}%`, transform: "translate(-50%, -50%)" }}
                ></div>
              </div>

              {/* Larger invisible hit area for better click detection */}
              <div
                className="absolute left-0 right-0 h-6 -top-2 cursor-pointer z-10"
                onClick={handleProgressClick}
              ></div>

              {/* Slider for seeking (invisible but functional) */}
              <div className="absolute left-0 right-0 -top-2 bottom-0 z-0">
                <Slider
                  value={[progressPercentage]}
                  max={100}
                  step={0.1}
                  onValueChange={handleSeek}
                  className="cursor-pointer opacity-0"
                />
              </div>

              {/* Edit markers */}
              <TooltipProvider>
                {markers.map((marker) => (
                  <Tooltip key={marker.id}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "absolute top-1/2 -translate-y-1/2 w-0.5 h-2 rounded-sm cursor-pointer transform -translate-x-1/2 transition-all",
                          getMarkerColor(marker.type),
                          activeMarker === marker.id ? "ring-1 ring-white shadow-glow" : "",
                          "group-hover/progress:h-3 group-hover/progress:w-1",
                        )}
                        style={{ left: `${marker.position}%` }}
                        onClick={(e) => {
                          e.stopPropagation()
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
                            className={cn(
                              "absolute h-0.5 rounded-sm",
                              getMarkerColor(marker.type),
                              "group-hover/progress:h-0.5",
                            )}
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
                    <TooltipContent
                      side="top"
                      className="flex items-center gap-1 bg-black/80 border-white/10 backdrop-blur-sm text-xs px-2 py-1 shadow-xl"
                    >
                      {getMarkerIcon(marker.type)}
                      <span className="capitalize">{marker.type}</span> at {marker.time}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Play/Pause button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="h-9 w-9 rounded-full text-foreground dark:text-white hover:bg-white/10 transition-all"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                {/* Skip backward */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => skip(-10)}
                  className="h-8 w-8 rounded-full text-foreground dark:text-white hover:bg-white/10 transition-all"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>

                {/* Skip forward */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => skip(10)}
                  className="h-8 w-8 rounded-full text-foreground dark:text-white hover:bg-white/10 transition-all"
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
                    className="h-8 w-8 rounded-full text-foreground dark:text-white hover:bg-white/10 transition-all"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>

                  {/* Volume slider */}
                  {showVolumeSlider && (
                    <div className="absolute bottom-full left-0 mb-2 w-24 bg-black/80 p-2 rounded-lg border border-white/10 backdrop-blur-sm shadow-xl">
                      <Slider
                        value={[isMuted ? 0 : volume * 100]}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                        className="h-1.5"
                      />
                    </div>
                  )}
                </div>

                {/* Time display */}
                <div className="text-xs text-foreground dark:text-white/90 font-medium flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  <Clock className="h-3 w-3" />
                  <span className="tabular-nums tracking-wide">
                    {formatTime(currentTime)} / {isLoaded ? formatTime(duration) : "--:--"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Info button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 rounded-full text-foreground dark:text-white hover:bg-white/10 transition-all",
                    showInfo && "bg-white/10",
                  )}
                  onClick={() => setShowInfo(!showInfo)}
                >
                  <Info className="h-4 w-4" />
                </Button>

                {/* Settings button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-foreground dark:text-white hover:bg-white/10 transition-all"
                >
                  <Settings className="h-4 w-4" />
                </Button>

                {/* Fullscreen button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="h-8 w-8 rounded-full text-foreground dark:text-white hover:bg-white/10 transition-all"
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Info panel - slides up when info button is clicked */}
            {showInfo && (
              <div className="mt-4 bg-black/60 backdrop-blur-sm rounded-lg border border-white/10 p-3 animate-slideUp shadow-xl">
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-white/60 mb-1">Resolution</p>
                    <p className="text-foreground dark:text-white font-medium">3840 × 2160</p>
                  </div>
                  <div>
                    <p className="text-white/60 mb-1">Format</p>
                    <p className="text-foreground dark:text-white font-medium">
                      {useHls ? "HLS Stream" : "MOV (H.265)"}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 mb-1">Frame Rate</p>
                    <p className="text-foreground dark:text-white font-medium">23.98 fps</p>
                  </div>
                  <div>
                    <p className="text-white/60 mb-1">Bit Rate</p>
                    <p className="text-foreground dark:text-white font-medium">Adaptive</p>
                  </div>
                  <div>
                    <p className="text-white/60 mb-1">Audio</p>
                    <p className="text-foreground dark:text-white font-medium">AAC 48kHz</p>
                  </div>
                  <div>
                    <p className="text-white/60 mb-1">Stream URL</p>
                    <p className="text-foreground dark:text-white font-medium truncate text-xs">
                      {useHls ? "HLS Stream" : "Local File"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        // No video selected placeholder - full width and height
        <div className="w-full h-full flex items-center justify-center overflow-hidden shadow-2xl rounded-lg bg-black">
          <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
              <div className="bg-black/60 rounded-full p-5 shadow-inner border border-white/10 relative backdrop-blur-sm">
                <Video className="h-12 w-12 text-white/70" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No Video Selected</h3>
            <p className="text-sm text-white/70 max-w-md text-center">
              Select a video from your repository to preview and edit
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs text-white/50">
              <div className="h-1 w-1 rounded-full bg-white/50"></div>
              <span>Supports MP4, MOV, WebM, and HLS formats</span>
              <div className="h-1 w-1 rounded-full bg-white/50"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

