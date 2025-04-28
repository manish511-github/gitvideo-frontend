"use client"

import type React from "react"
import { Play, Pause, SkipBack, SkipForward, Maximize, Volume2, VolumeX } from "lucide-react"
import type { PlaybackControlsProps } from "./types"

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  currentTime,
  duration,
  isPlaying,
  isMuted,
  buffered,
  onPlayPause,
  onSeek,
  onSkipForward,
  onSkipBackward,
  onToggleMute,
  formatTime,
}) => {
  return (
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

            const rect = e.currentTarget.getBoundingClientRect()
            const pos = (e.clientX - rect.left) / rect.width
            const newTime = Math.max(0, Math.min(pos * duration, duration))

            onSeek(newTime)
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        {/* Left controls */}
        <div className="flex items-center space-x-3">
          <button
            className="w-10 h-10 rounded-full bg-zinc-800/80 backdrop-blur-sm flex items-center justify-center text-white hover:bg-teal-500/80 transition-colors"
            onClick={onPlayPause}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </button>

          <div className="flex items-center space-x-2">
            <button
              className="w-8 h-8 rounded-full bg-zinc-800/60 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-zinc-700/80 transition-colors"
              onClick={onSkipBackward}
            >
              <SkipBack className="h-4 w-4" />
            </button>
            <button
              className="w-8 h-8 rounded-full bg-zinc-800/60 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-zinc-700/80 transition-colors"
              onClick={onSkipForward}
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
            onClick={onToggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button className="w-8 h-8 rounded-full bg-zinc-800/60 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-zinc-700/80 transition-colors">
            <Maximize className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
