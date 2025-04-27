"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { SimplifiedVideoEditor } from "@/components/video-editor/simplified-video-editor"

export default function VideoEditorPage() {
  const searchParams = useSearchParams()
  const [videoSrc, setVideoSrc] = useState<string>(
    "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  )
  const [videoId, setVideoId] = useState<string>("demo-video")

  useEffect(() => {
    // Get video information from URL params
    const srcParam = searchParams.get("videoSrc")
    const idParam = searchParams.get("videoId")

    if (srcParam) {
      setVideoSrc(decodeURIComponent(srcParam))
    }

    if (idParam) {
      setVideoId(idParam)
    }
  }, [searchParams])

  return (
    <div className="h-screen w-full">
      <SimplifiedVideoEditor videoSrc={videoSrc} videoId={videoId} />
    </div>
  )
}
