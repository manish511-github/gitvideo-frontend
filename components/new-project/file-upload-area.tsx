"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileVideo, Upload, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { VideoPreview } from "./video-preview"

interface FileUploadAreaProps {
  onFileUpload: (file: File | null) => void
  file: File | null
}

export function FileUploadArea({ onFileUpload, file }: FileUploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false)

  // Handle drag events for the upload area
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.startsWith("video/")) {
      onFileUpload(droppedFile)
    }
  }

  return (
    <>
      {!file ? (
        <div
          className={`relative transition-all duration-300 ${isDragging ? "scale-[1.01]" : ""}`}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Animated gradient border */}
          <div
            className={`absolute inset-0 rounded-xl p-[1px] overflow-hidden ${
              isDragging ? "opacity-100" : "opacity-0"
            } transition-opacity duration-300`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 animate-gradient-x"></div>
          </div>

          {/* Theme-aware border styling in the drag area */}
          <div
            className={`border border-dashed rounded-lg transition-all cursor-pointer py-10 relative z-10
              ${
                isDragging
                  ? "border-blue-400/70 bg-blue-500/5"
                  : "border-border hover:border-blue-500/20 hover:bg-blue-500/5"
              }`}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <div className="flex flex-col items-center justify-center text-center p-4">
              <motion.div
                className={`rounded-full p-4 mb-3 ${isDragging ? "bg-blue-500/30" : "bg-blue-500/10"}`}
                animate={{
                  scale: isDragging ? 1.1 : 1,
                  boxShadow: isDragging ? "0 0 25px rgba(59, 130, 246, 0.5)" : "0 0 0 rgba(59, 130, 246, 0)",
                }}
              >
                <Upload className={`h-8 w-8 ${isDragging ? "text-blue-400" : "text-blue-500/80"}`} />
              </motion.div>

              <h3 className="text-base font-medium mb-2 text-foreground">
                {isDragging ? "Drop to upload" : "Drag & drop your video"}
              </h3>

              <p className="text-sm text-muted-foreground max-w-md mb-4">
                Upload a video file to create your project. We support MP4, MOV, and WebM formats.
              </p>

              <input
                id="file-upload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  onFileUpload(file)
                }}
              />

              {/* Theme-aware button */}
              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-muted relative overflow-hidden group"
              >
                <span className="relative z-10">Select Video</span>
                <span className="absolute inset-0 w-0 bg-muted group-hover:w-full transition-all duration-300"></span>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-medium text-foreground flex items-center">
              <FileVideo className="h-4 w-4 mr-2 text-blue-400" />
              Video Preview
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 px-2 group"
              onClick={() => onFileUpload(null)}
            >
              <X className="h-3 w-3 mr-1.5 group-hover:rotate-90 transition-transform duration-200" />
              Remove
            </Button>
          </div>

          <div className="h-[350px] rounded-lg overflow-hidden border border-border shadow-xl flex items-center justify-center bg-black">
            <VideoPreview file={file} />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-foreground">
              <div className="flex items-center gap-1.5">
                <FileVideo className="h-3.5 w-3.5 text-blue-400" />
                <span className="truncate max-w-[300px] font-medium">{file.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </Badge>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
