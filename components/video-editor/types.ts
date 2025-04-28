import type React from "react"
export interface VideoClip {
  id: number
  name: string
  start: number
  end: number
  thumbnail?: string
  videoSrc?: string
  thumbnails?: { time: number; url: string }[]
  thumbnailsGenerated?: boolean
}

export interface VideoPlayerProps {
  videoSrc: string
  isPlaying: boolean
  currentTime: number
  duration: number
  isMuted: boolean
  volume: number
  onTimeUpdate: (time: number) => void
  onDurationChange: (duration: number) => void
  onBufferedChange: (buffered: TimeRanges) => void
  onPlayStateChange: (isPlaying: boolean) => void
  onVideoReady: () => void
  videoRef: React.RefObject<HTMLVideoElement>
}

export interface TimelineProps {
  clips: VideoClip[]
  currentTime: number
  duration: number
  selectedClip: number | null
  onTimeChange: (time: number) => void
  onClipSelect: (clipId: number | null) => void
  onClipMove: (clipId: number, newStart: number) => void
  onClipTrim: (clipId: number, newStart: number, newEnd: number) => void
  onDoubleClick: (time: number) => void
  timelineRef: React.RefObject<HTMLDivElement>
}

export interface ClipsPanelProps {
  clips: VideoClip[]
  selectedClip: number | null
  onClipSelect: (clipId: number | null) => void
  onAddClip: (position: "after" | "between") => void
  onDeleteClip: (clipId: number) => void
  isGeneratingThumbnails: boolean
  thumbnailProgress: number
  isAddingClip: boolean
  insertPosition: "after" | "between" | null
  insertTime: number
  onConfirmAddClip: (name: string, src: string) => void
  onCancelAddClip: () => void
  formatTime: (time: number) => string
}

export interface CutPanelProps {
  currentTime: number
  selectedClip: number | null
  clips?: VideoClip[]
  onCutAtCurrentTime: () => void
  onDeleteSelectedClip: () => void
  onMergeAdjacentClips: () => void
  onUpdateClip?: (clipId: number, updates: Partial<VideoClip>) => void
  onAddClip?: (position: "after" | "between") => void
  formatTime: (time: number) => string
}

export interface ToolbarSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export interface PlaybackControlsProps {
  currentTime: number
  duration: number
  isPlaying: boolean
  isMuted: boolean
  buffered: TimeRanges | null
  onPlayPause: () => void
  onSeek: (time: number) => void
  onSkipForward: () => void
  onSkipBackward: () => void
  onToggleMute: () => void
  formatTime: (time: number) => string
}

export type TabId =
  | "clips"
  | "cut"
  | "text"
  | "audio"
  | "effects"
  | "transitions"
  | "images"
  | "animations"
  | "adjustments"
  | "ai"
  | "chroma"
  | "files"
  | "export"
