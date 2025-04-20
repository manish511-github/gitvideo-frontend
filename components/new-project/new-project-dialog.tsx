"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ProjectMetadataForm } from "./project-metadata-form"
import { CreateProjectButton } from "./create-project-button"
import { VideoPreview } from "./video-preview"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Plus, Upload, ArrowRight, ArrowLeft, FileVideo, X, CheckCircle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { current } from "@reduxjs/toolkit"
import { fetchRepositories } from "@/lib/redux/repositoriesSlice"

// Update the ProjectMetadata interface to include thumbnail
export interface ProjectMetadata {
  title: string
  description: string
  tags: string[]
  collaborators: string[]
  thumbnail?: File | null
}

export interface ProjectTemplate {
  id: string
  name: string
  description: string
  thumbnail: string
  settings: {
    resolution: string
    frameRate: number
    aspectRatio: string
  }
}

interface NewProjectDialogProps {
  buttonVariant?: "default" | "small" | "outline-small" | "outline-tiny" | "hero"
  onProjectCreated?: (project: any) => void
  children?: React.ReactNode
}

export function NewProjectDialog({ buttonVariant = "default", onProjectCreated, children }: NewProjectDialogProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"upload" | "metadata">("upload")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [metadata, setMetadata] = useState<ProjectMetadata>({
    title: "",
    description: "",
    tags: [],
    collaborators: [],
    thumbnail: null,
  })
  const [isCreating, setIsCreating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isPrivate, setIsPrivate] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSpeed, setUploadSpeed] = useState(0)

  const controller = new AbortController()


  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep("upload")
        setUploadedFile(null)
        setMetadata({
          title: "",
          description: "",
          tags: [],
          collaborators: [],
          thumbnail: null,
        })
        setShowSuccess(false)
      }, 300)
    }
  }, [open])

  const handleFileUploaded = (file: File | null) => {
    setUploadedFile(file)
    if (file) {
      // Pre-fill title with the file name (without extension)
      const fileName = file.name.split(".")
      fileName.pop() // Remove extension
      setMetadata((prev) => ({
        ...prev,
        title: fileName.join("."),
      }))
    }
  }

  const handleMetadataChange = (newMetadata: ProjectMetadata) => {
    setMetadata(newMetadata)
  }

  const handleCreateProject = async () => {
    setIsCreating(true)

    try {
      const payload = {
        name: metadata.title,
        description: metadata.description,
        authorId: 1, // Using hardcoded authorId as specified
        status: "Created",
        thumbnail: metadata.thumbnail
          ? URL.createObjectURL(metadata.thumbnail)
          : "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
        fileName: uploadedFile?.name.split(".")[0] || "untitled",
        fileType: `.${uploadedFile?.name.split(".").pop()}` || ".mp4",
      }
      // Sent request to create new repo
      const response  = await fetch("http://localhost:4300/api/repo/createRepo",{
        method : "POST",
        headers : {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
  
      })
      if (!response.ok)
      {
        throw new Error(`Failed to create project`)
        return
      }
      const result = await response.json()
      
      if (result.success && uploadedFile)
      {
          await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", result.data.uploadUrl, true);
            xhr.setRequestHeader("Content-Type", uploadedFile.type )
            let startTime = Date.now();
            xhr.upload.onprogress = (event) => {
              if (event.lengthComputable)
              {
                const percentComplete = (event.loaded / event.total) * 100;
                const currentTime = Date.now()
                const timeElapsedInSeconds = (currentTime - startTime) / 1000;
                const speedInBytesPerSec = event.loaded/timeElapsedInSeconds;
                const speedReadable =
                speedInBytesPerSec > 1024 * 1024
                  ? `${(speedInBytesPerSec / (1024 * 1024)).toFixed(2)} MB/s`
                  : `${(speedInBytesPerSec / 1024).toFixed(2)} KB/s`;
        
              console.log(`Progress: ${percentComplete.toFixed(2)}%`);
              console.log(`Speed: ${speedReadable}`);
                   // OPTIONAL: hook these into React state
            setUploadProgress(percentComplete);
            setUploadSpeed(speedReadable);
        

              }
            }
            xhr.onload = () =>{
              if (xhr.status >= 200 && xhr.status < 300)
              {
                console.log("Upload Complete");
                resolve();
              }
              else{
                reject(new Error (`Upload failed with status ${xhr.status}`))
              }
            };
            xhr.onerror = () =>{
              reject(new Error ("Network error during upload"))
            }
            xhr.send(uploadedFile)
          });
          }
        
        console.log("File uploaded successfully to S3")
        await fetch("http://localhost:4300/api/notification/videoupload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event: "VIDEO_UPLOAD_INITIATED",
            repo: result.data.repo,
            filename: uploadedFile?.name.split(".")[0] || "untitled",
            filetype: uploadedFile?.type,
          }),
        });
      
      
      // Simulate project creation
      console.log(response)
      // try {
      //   const payload = {
      //     name:metadata.title,
      //     description: metadata.description,
      //     authorId :1,
      //     status : "Created",
      //     thumbnail: metadata.thumbnail?URL.createObjectURL(metadata.thumbnail):"https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250",
      //     fileName: uploadedFile?name
  
   
      //   }
      // }
      // Show success animation
      setShowSuccess(true)
  
      // Wait for animation to complete
      await new Promise((resolve) => setTimeout(resolve, 1500))
  
      setIsCreating(false)
      setOpen(false)
  
      // Call the onProjectCreated callback if provided
      if (onProjectCreated) {
        onProjectCreated({
          // title: metadata.title,
          // description: metadata.description,
          // file: uploadedFile?.name,
          // thumbnail: metadata.thumbnail?.name,
          ...result.data.repo,
          file:uploadedFile?.name,
        })
      }
  
      // Navigate to the new project page
      // router.push("/repo/1")
      dispatch(fetchRepositories())
      router.push("/")
      
    } catch (error) {
      console.error("Error creating project:", error)
      setIsCreating(false)
      alert(`Failed to create project: ${error}`)
    }
  }

  const canProceed = () => {
    if (step === "upload") return uploadedFile !== null
    if (step === "metadata") return metadata.title.trim() !== ""
    return false
  }

  const handleNext = () => {
    if (step === "upload") setStep("metadata")
  }

  const handleBack = () => {
    if (step === "metadata") setStep("upload")
  }

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
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("video/")) {
      handleFileUploaded(file)
    }
  }

  // Render the appropriate button based on the variant
  const renderButton = () => {
    if (children) {
      return <div onClick={() => setOpen(true)}>{children}</div>
    }

    switch (buttonVariant) {
      case "small":
        return (
          <Button onClick={() => setOpen(true)} size="sm" className="h-7 text-xs gap-1 px-2.5">
            <Plus className="h-3 w-3" />
            <span>New Project</span>
          </Button>
        )
      case "outline-small":
        return (
          <Button onClick={() => setOpen(true)} variant="outline" size="sm" className="h-7 text-[10px] gap-1.5">
            <Plus className="h-2.5 w-2.5" />
            New Project
          </Button>
        )
      case "outline-tiny":
        return (
          <Button onClick={() => setOpen(true)} variant="outline" size="sm" className="h-6 text-[10px] gap-1.5">
            <Plus className="h-2.5 w-2.5" />
            New Project
          </Button>
        )
      case "hero":
        return (
          <Button
            onClick={() => setOpen(true)}
            size="sm"
            className="gap-1.5 bg-white text-slate-900 hover:bg-white/90 h-7 text-xs"
          >
            <Upload className="h-3 w-3" />
            Upload New Project
          </Button>
        )
      default:
        return (
          <Button
            onClick={() => setOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        )
    }
  }

  return (
    <>
      {renderButton()}

      <Dialog open={open} onOpenChange={setOpen}>
        {/* Update DialogContent to use theme-aware classes */}
        <DialogContent className="sm:max-w-[600px] max-h-[750px] flex flex-col overflow-hidden bg-background border-border shadow-2xl p-0 rounded-xl">
          {/* Theme-aware header */}
          <div className="relative">
            {/* Subtle gradient accent at the top */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-border via-blue-500/50 to-border"></div>

            {/* Header content with improved styling */}
            <div className="pt-6 pb-4 px-6 bg-gradient-to-b from-muted/50 to-background">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-medium text-foreground">Create New Project</h2>

                {/* More refined step indicator */}
                <div className="flex items-center gap-3">
                  <StepIndicator
                    isActive={step === "upload"}
                    isComplete={uploadedFile !== null && step === "metadata"}
                    label="Upload"
                    icon={<Upload className="h-3 w-3" />}
                  />
                  <div className="w-8 h-[1px] bg-border"></div>
                  <StepIndicator
                    isActive={step === "metadata"}
                    isComplete={false}
                    label="Details"
                    icon={<FileVideo className="h-3 w-3" />}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content area with theme-aware styling */}
          <div className="flex-grow overflow-y-auto px-6 pb-6 bg-background">
            <AnimatePresence mode="wait">
              {step === "upload" && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col"
                >
                  {/* Theme-aware upload area */}
                  <div className="bg-muted/30 rounded-lg border border-border shadow-md overflow-hidden">
                    {!uploadedFile ? (
                      <div
                        className={`relative transition-all duration-300 ${isDragging ? "scale-[1.01]" : ""}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                      >
                        {/* Animated gradient border */}
                        <div
                          className={`absolute inset-0 rounded-xl p-[1px] overflow-hidden ${isDragging ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
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
                                boxShadow: isDragging
                                  ? "0 0 25px rgba(59, 130, 246, 0.5)"
                                  : "0 0 0 rgba(59, 130, 246, 0)",
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
                                handleFileUploaded(file)
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
                            onClick={() => handleFileUploaded(null)}
                          >
                            <X className="h-3 w-3 mr-1.5 group-hover:rotate-90 transition-transform duration-200" />
                            Remove
                          </Button>
                        </div>

                        <div className="h-[350px] rounded-lg overflow-hidden border border-border shadow-xl flex items-center justify-center bg-black">
                          <VideoPreview file={uploadedFile} />
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 text-foreground">
                            <div className="flex items-center gap-1.5">
                              <FileVideo className="h-3.5 w-3.5 text-blue-400" />
                              <span className="truncate max-w-[300px] font-medium">{uploadedFile.name}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">
                              {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {step === "metadata" && (
                <motion.div
                  key="metadata"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Theme-aware metadata area */}
                  <div className="bg-muted/30 rounded-lg border border-border shadow-md p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-border flex-shrink-0">
                        <img
                          src={uploadedFile ? URL.createObjectURL(uploadedFile) : "/placeholder.svg?height=48&width=48"}
                          alt="Video thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-foreground">Project Details</h3>
                        <p className="text-xs text-muted-foreground">Add information about your video project</p>
                      </div>
                    </div>

                    <ProjectMetadataForm metadata={metadata} onChange={handleMetadataChange} />

                    <Textarea
                      id="description"
                      value={metadata.description}
                      onChange={(e) => handleMetadataChange({ ...metadata, description: e.target.value })}
                      placeholder="Enter project description"
                      rows={4}
                      className="bg-muted/50 border-border focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 resize-none transition-all text-xs min-h-[100px] shadow-inner"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme-aware footer */}
          <div className="flex-shrink-0 border-t border-border p-4 px-6 flex justify-between bg-muted/20 backdrop-blur-sm">
            {/* Theme-aware back button */}
            <Button
              variant="outline"
              onClick={step === "upload" ? () => setOpen(false) : handleBack}
              className="border-border hover:bg-muted hover:text-foreground text-xs group"
            >
              {step === "upload" ? (
                "Cancel"
              ) : (
                <>
                  <ArrowLeft className="mr-2 h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  Back
                </>
              )}
            </Button>

            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-2 text-green-500"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Project Created!</span>
                </motion.div>
              ) : (
                <div className="flex gap-2">
                  {step === "upload" ? (
                    /* Theme-aware continue button */
                    <Button
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md text-xs group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center">
                        Continue
                        <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                      {canProceed() && (
                        <span className="absolute inset-0 w-full h-full bg-white/5 transform translate-x-full group-hover:translate-x-[-100%] transition-transform duration-500"></span>
                      )}
                    </Button>
                  ) : (
                    <CreateProjectButton
                      onClick={handleCreateProject}
                      progress={uploadProgress}
                      disabled={!canProceed() || isCreating}
                      isCreating={isCreating}
                    />
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Theme-aware StepIndicator component
function StepIndicator({
  isActive,
  isComplete,
  label,
  icon,
}: {
  isActive: boolean
  isComplete: boolean
  label: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        animate={{
          scale: isActive ? 1 : 1,
          backgroundColor: isActive ? "var(--muted)" : isComplete ? "var(--muted)" : "var(--muted)",
          borderColor: isActive ? "rgb(59, 130, 246)" : isComplete ? "rgb(34, 197, 94)" : "var(--border)",
        }}
        className="flex items-center justify-center w-6 h-6 rounded-full text-foreground shadow-sm relative border"
        style={{
          boxShadow: isActive
            ? "0 0 10px rgba(59, 130, 246, 0.2)"
            : isComplete
              ? "0 0 10px rgba(34, 197, 94, 0.1)"
              : "none",
        }}
      >
        {isComplete ? (
          <CheckCircle className="h-3 w-3 text-green-500" />
        ) : (
          <div className={`${isActive ? "text-blue-400" : "text-muted-foreground"}`}>{icon}</div>
        )}

        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full border border-blue-400"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        )}
      </motion.div>
      <span
        className={`text-[9px] ${isActive ? "text-blue-400" : isComplete ? "text-green-400" : "text-muted-foreground"}`}
      >
        {label}
      </span>
    </div>
  )
}

