"use client"

import type React from "react"

import { useCallback } from "react"
import type { VideoClip } from "./types"

interface UseThumbnailGeneratorProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  setIsGeneratingThumbnails: (isGenerating: boolean) => void
  setThumbnailProgress: (progress: number) => void
  setClips: React.Dispatch<React.SetStateAction<VideoClip[]>>
}

export const useThumbnailGenerator = ({
  canvasRef,
  setIsGeneratingThumbnails,
  setThumbnailProgress,
  setClips,
}: UseThumbnailGeneratorProps) => {
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

  return { generateThumbnails }
}
