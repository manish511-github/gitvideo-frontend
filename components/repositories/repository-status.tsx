"use client"

import { useVideoStatus } from "@/hooks/use-video-status"
import { CircularProgress } from "@/components/ui/circular-progress"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { updateRepositoryStatus } from "@/lib/redux/repositoriesSlice"

interface RepositoryStatusProps {
  repoId : number
  videoId: string | number
  status: string
  progress: number
}

export function RepositoryStatus({ repoId,videoId, status, progress }: RepositoryStatusProps) {
    const dispatch =useAppDispatch()
  // Convert videoId to string if it's a number
  const videoIdString = typeof videoId === "number" ? videoId.toString() : videoId

  // Use the WebSocket hook to get real-time status
  const { status: wsStatus, isConnected, error } = useVideoStatus(videoIdString)

  // If we have WebSocket data, use it; otherwise, fall back to the provided status
  const currentStatus = wsStatus?.status || status
  const currentProgress = wsStatus?.progress !== undefined ? wsStatus.progress : progress
  const [hasReported, setHasReported] = useState(false)

  // Map the status to a display status
  const getDisplayStatus = () => {
    if (currentStatus === "complete" || status === "Published") {
      return "Published"
    }
    if (currentStatus === "error") {
      return "Failed"
    }
    if (["uploading", "processing", "transcoding", "analyzing"].includes(currentStatus as string)) {
      return "Processing"
    }
    return status
  }

  // Map the status to a progress status for the circular progress
//   const getProgressStatus = () => {
//     if (currentStatus === "complete" || status === "Published") {
//       return "completed"
//     }
//     if (currentStatus === "error") {
//       return "error"
//     }
//     return "processing"
//   }

  const displayStatus = getDisplayStatus()
//   const progressStatus = getProgressStatus()
  useEffect(()=>{
    if (currentProgress === 100 && !hasReported)
    {
        fetch(`http://localhost:4300/api/repo/updaterepostatus/${repoId}`, {method : "POST"})
        .then((res) => {
            if (!res.ok) throw new Error("Failed to notify backed")
                return res.json()

        })
        .then(() => {
            console.log(`Video ${repoId} marked as Active`)
            // Update Redux State too
            dispatch(updateRepositoryStatus({repoId, status: "Created"}))
            setHasReported(true)
        })
        .catch((err) => {
            console.error("Error marking video as published:", err)
        })
    }
  }, [currentProgress, hasReported, repoId, dispatch])
  // If the status is "Published" and there's no WebSocket connection, just show the badge
//   if (displayStatus === "Published" && !isConnected) {
//     return (
//       <Badge variant="default" className="text-[9px] h-4 font-normal">
//         {displayStatus}
//       </Badge>
//     )
//   }

  // If the status is processing or we have a WebSocket connection, show the progress
  if (displayStatus === "Processing" || isConnected) {
    return (
      <div className="flex items-center gap-1.5">
        <CircularProgress progress={currentProgress} size={16} strokeWidth={2} />
        <span className="text-[9px] text-muted-foreground">{currentProgress}%</span>
      </div>
    )
  }

  // For other statuses, show a badge
  return (
    <Badge
      variant={displayStatus === "Failed" ? "destructive" : displayStatus === "In Progress" ? "secondary" : "outline"}
      className="text-[9px] h-4 font-normal"
    >
      {displayStatus}
    </Badge>
  )
}
