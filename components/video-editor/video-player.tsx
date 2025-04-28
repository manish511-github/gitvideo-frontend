"use client"

import type React from "react"
import { useEffect } from "react"
import type { VideoPlayerProps } from "./types"

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoSrc,
  isPlaying,
  currentTime,
  isMuted,
  volume,
  onTimeUpdate,
  onDurationChange,
  onBufferedChange,
  onPlayStateChange,
  onVideoReady,
  videoRef,
}) => {
  // Sync video state with props
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Sync play state
    if (isPlaying && video.paused) {
      video.play().catch((e) => console.error("Error playing video:", e))
    } else if (!isPlaying && !video.paused) {
      video.pause()
    }

    // Sync mute state
    video.muted = isMuted

    // Sync volume
    video.volume = volume

    // Sync current time if it's significantly different
    if (Math.abs(video.currentTime - currentTime) > 0.5) {
      video.currentTime = currentTime
    }
  }, [isPlaying, currentTime, isMuted, volume, videoRef])

  // Set up event listeners
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      if (video.currentTime && !isNaN(video.currentTime)) {
        onTimeUpdate(video.currentTime)
      }
    }

    const handleDurationChange = () => {
      if (video.duration && !isNaN(video.duration)) {
        onDurationChange(video.duration)
      }
    }

    const handleProgress = () => {
      onBufferedChange(video.buffered)
    }

    const handlePlay = () => {
      onPlayStateChange(true)
    }

    const handlePause = () => {
      onPlayStateChange(false)
    }

    const handleCanPlay = () => {
      onVideoReady()
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
  }, [videoRef, onTimeUpdate, onDurationChange, onBufferedChange, onPlayStateChange, onVideoReady])

  return (
    <video
      ref={videoRef}
      src={videoSrc}
      className="w-full h-full object-contain"
      poster="/video-editor-workspace.png"
      crossOrigin="anonymous"
    />
  )
}
