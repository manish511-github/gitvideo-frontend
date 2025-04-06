"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Pause, Play, Volume2, VolumeX, Maximize2, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { Slider } from "@/components/ui/slider"

interface VideoPreviewProps {
  file: File
}

export function VideoPreview({ file }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [isHovering, setIsHovering] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [videoInfo, setVideoInfo] = useState<{ width: number; height: number } | null>(null)

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setVideoUrl(url)
    console.log(videoUrl)
    return () => URL.revokeObjectURL(url)
  }, [file])

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
      video.currentTime = 0
    }

    const handleLoadedMetadata = () => {
      setVideoInfo({
        width: video.videoWidth,
        height: video.videoHeight,
      })
    }

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("durationchange", handleDurationChange)
    video.addEventListener("ended", handleEnded)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("durationchange", handleDurationChange)
      video.removeEventListener("ended", handleEnded)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play().catch((err) => console.error("Error playing video:", err))
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video || !duration) return

    const newTime = (value[0] / 100) * duration
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0] / 100
    video.volume = newVolume
    if (newVolume === 0) {
      video.muted = true
      setIsMuted(true)
    } else if (isMuted) {
      video.muted = false
      setIsMuted(false)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getResolutionLabel = () => {
    if (!videoInfo) return "HD"

    const { width, height } = videoInfo
    if (width >= 3840) return "4K"
    if (width >= 1920) return "HD"
    if (width >= 1280) return "720p"
    return `${width}×${height}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full relative group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false)
        setShowVolumeSlider(false)
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
        {/* Loading indicator */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
            <div className="relative">
              <div className="w-10 h-10 border-2 border-zinc-800 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-black"></div>
              </div>
            </div>
          </div>
        )}

        {/* Video element */}
        <video
          ref={videoRef}
          src={videoUrl }
          className="max-w-full max-h-full object-contain"
          playsInline
          muted={isMuted}
          onClick={togglePlay}
        />

        {/* Video quality badge */}
        <Badge
          className="absolute top-2 right-2 bg-black/70 text-white border-none text-[9px] px-1.5 backdrop-blur-sm"
          variant="outline"
        >
          {getResolutionLabel()}
        </Badge>

        {/* Overlay gradient - always visible but more prominent on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

        {/* Play/pause button - always visible and centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-black/50 backdrop-blur-sm border-white/20 hover:bg-black/70 transition-all shadow-lg h-14 w-14 group"
              onClick={togglePlay}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
              ) : (
                <Play className="h-6 w-6 text-white ml-0.5 group-hover:scale-110 transition-transform" />
              )}
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-white/30"
                animate={isPlaying ? { opacity: 0 } : { opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </Button>
          </motion.div>
        </div>

        {/* Controls overlay - enhanced with animations */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/70 to-transparent">
          {/* Progress bar */}
          <div className="mb-2 relative h-1.5 group/progress">
            <div className="absolute inset-0 rounded-full bg-zinc-800/70 overflow-hidden">
              {/* Buffered progress */}
              <motion.div
                className="absolute h-full bg-zinc-600/70"
                style={{ width: `${Math.min((currentTime / duration) * 100 + 15, 100)}%` }}
              />

              {/* Actual progress */}
              <motion.div
                className="absolute h-full bg-zinc-400"
                style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                animate={{
                  width: `${(currentTime / duration) * 100 || 0}%`,
                }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Slider for seeking */}
            <Slider
              value={[(currentTime / duration) * 100 || 0]}
              max={100}
              step={0.1}
              onValueChange={handleSeek}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />

            {/* Hover effect - glowing dot */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-white rounded-full shadow-sm opacity-0 group-hover/progress:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ left: `${(currentTime / duration) * 100 || 0}%`, transform: "translate(-50%, -50%)" }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Time display */}
              <div className="text-[10px] text-white/90 font-mono tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration || 0)}
              </div>

              {/* Volume control */}
              <div
                className="relative flex items-center"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
                  onClick={toggleMute}
                >
                  {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                </Button>

                {/* Volume slider - appears on hover */}
                <AnimatePresence>
                  {showVolumeSlider && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 70 }}
                      exit={{ opacity: 0, width: 0 }}
                      className="absolute left-7 top-1/2 -translate-y-1/2 bg-black/80 rounded-full h-6 flex items-center px-2 overflow-hidden"
                    >
                      <Slider
                        value={[isMuted ? 0 : (videoRef.current?.volume || 0) * 100]}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                        className="w-full"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Settings button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
              >
                <Settings className="h-3 w-3" />
              </Button>

              {/* Fullscreen button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white/80 hover:text-white hover:bg-white/10 rounded-full"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

