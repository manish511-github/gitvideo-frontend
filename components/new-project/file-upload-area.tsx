"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileVideo, Upload, X, Film } from "lucide-react"
import { motion } from "framer-motion"

// Update the props interface
interface FileUploadAreaProps {
  onFileUpload: (file: File | null) => void
  file: File | null
}

// Update the component implementation
export function FileUploadArea({ onFileUpload, file }: FileUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = Array.from(e.dataTransfer.files).find((file) => file.type.startsWith("video/"))
    onFileUpload(droppedFile || null)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const videoFile = Array.from(e.target.files).find((file) => file.type.startsWith("video/"))
      onFileUpload(videoFile || null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-lg transition-all ${
          isDragging
            ? "border-primary bg-primary/10 scale-[1.01]"
            : "border-zinc-700 hover:border-primary/50 hover:bg-zinc-900/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center py-10 px-4">
          <div
            className={`rounded-full p-4 mb-4 transition-all ${isDragging ? "bg-primary/20 scale-110" : "bg-zinc-900"}`}
          >
            {isDragging ? (
              <Film className="h-10 w-10 text-primary animate-pulse" />
            ) : (
              <Upload className="h-10 w-10 text-primary/80" />
            )}
          </div>

          <h3 className="text-lg font-medium mb-2 text-white/90">
            {isDragging ? "Drop your video here" : "Drag & drop your video"}
          </h3>

          <p className="text-xs text-muted-foreground text-center max-w-md mb-4">
            Upload a single video file to create your project. We support MP4, MOV, AVI, and WebM formats.
          </p>

          <div className="flex gap-3">
            <input id="file-upload" type="file" accept="video/*" className="hidden" onChange={handleFileInputChange} />

            <Button
              onClick={() => document.getElementById("file-upload")?.click()}
              variant="outline"
              className="border-zinc-700 hover:bg-zinc-900 text-xs"
            >
              Select File
            </Button>
          </div>
        </div>
      </div>

      {file && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium text-white/90">Uploaded File</h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground hover:text-white"
              onClick={() => onFileUpload(null)}
            >
              Remove
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between p-3 rounded-md bg-zinc-900/70 border border-zinc-800"
          >
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="flex-shrink-0 w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                <FileVideo className="h-4 w-4 text-primary" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs truncate max-w-[300px] text-white/90">{file.name}</p>
                <p className="text-[10px] text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-zinc-800"
              onClick={() => onFileUpload(null)}
            >
              <X className="h-3.5 w-3.5" />
              <span className="sr-only">Remove file</span>
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

