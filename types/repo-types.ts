export interface VideoAsset {
  id: string
  name: string
  thumbnail: string
  uploadDate: string
  uploader: string
  uploaderAvatar: string
  branch: string
  size: string
  duration: string
  resolution: string
  codec: string
  bitrate: string
}

export interface Commit {
  id: string
  description: string
  message: string
  author: string
  date: string
  avatar: string
  branch: string
  changes: { type: string; timestamp: string }[]
  videoAsset: VideoAsset
}

export interface Branch {
  name: string
  commits: Commit[]
}

export interface MetadataField {
  id: string
  label: string
  checked: boolean
}

export interface AppearanceOption {
  value: string
  label: string
}

export interface SortOption {
  value: string
  label: string
}

export type SubActions = {
  [key: string]: string[]
}

