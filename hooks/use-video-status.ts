"use client"

import { useState, useEffect } from "react"

type VideoStatus = "uploading" | "processing" | "transcoding" | "analyzing" | "complete" | "error"

interface VideoStatusData {
  video_id: string
  status: VideoStatus
  progress?: number
  message?: string
}

export function useVideoStatus(videoId: string | null) {
  const [status, setStatus] = useState<VideoStatusData | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!videoId) return

    // Create WebSocket connection
    const socket = new WebSocket(`ws://localhost:8001/ws/video/${videoId}`)
    // Connection opened
    socket.addEventListener("open", () => {
      setIsConnected(true)
      setError(null)
      console.log(`WebSocket connected for video ${videoId}`)
    })

    // Listen for messages
    socket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log("WebSocket message received:", data)
        setStatus(data)
      } catch (err) {
        console.error("Error parsing WebSocket message:", err)
      }
    })

    // Connection closed
    socket.addEventListener("close", () => {
      setIsConnected(false)
      console.log(`WebSocket connection closed for video ${videoId}`)
    })

    // Connection error
    socket.addEventListener("error", (event) => {
      setError("WebSocket connection error")
      setIsConnected(false)
      console.log("WebSocket connection error")
    })

    // Clean up on unmount
    return () => {
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close()
      }
    }
  }, [videoId])

  return { status, isConnected, error }
}
