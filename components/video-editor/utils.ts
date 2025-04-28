// Format time (seconds to MM:SS)
export const formatTime = (timeInSeconds: number): string => {
  if (isNaN(timeInSeconds)) return "00:00"
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = Math.floor(timeInSeconds % 60)
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

// Convert position on timeline to time
export const positionToTime = (offsetX: number, timelineWidth: number, duration: number): number => {
  const clickPosition = offsetX / timelineWidth
  return clickPosition * duration
}

// Generate a unique ID for new clips
export const generateUniqueId = (clips: { id: number }[]): number => {
  return Math.max(0, ...clips.map((c) => c.id)) + 1
}
