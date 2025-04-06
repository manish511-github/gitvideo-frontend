"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Tag, FileText, Users, Globe, Lock, ImagePlus, UploadIcon } from "lucide-react"
import type { ProjectMetadata } from "./new-project-dialog"
import { motion, AnimatePresence } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface ProjectMetadataFormProps {
  metadata: ProjectMetadata & { thumbnail?: File | null }
  onChange: (metadata: ProjectMetadata & { thumbnail?: File | null }) => void
}

export function ProjectMetadataForm({ metadata, onChange }: ProjectMetadataFormProps) {
  const [tagInput, setTagInput] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      handleChange("thumbnail", file)
      const objectUrl = URL.createObjectURL(file)
      setThumbnailPreview(objectUrl)
    }
  }

  const handleChange = (field: keyof (ProjectMetadata & { thumbnail?: File | null }), value: any) => {
    onChange({
      ...metadata,
      [field]: value,
    })
  }

  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview)
      }
    }
  }, [thumbnailPreview])

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      if (!metadata.tags.includes(tagInput.trim())) {
        handleChange("tags", [...metadata.tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    handleChange(
      "tags",
      metadata.tags.filter((t) => t !== tag),
    )
  }

  // Suggested tags for better UX
  const suggestedTags = ["tutorial", "marketing", "product-demo", "social-media", "presentation"]

  // Filter out already added tags
  const availableSuggestions = suggestedTags.filter((tag) => !metadata.tags.includes(tag))

  return (
    <div className="space-y-6">
      {/* Title field with animation */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Label htmlFor="title" className="flex items-center gap-2 text-foreground text-xs">
          <FileText className="h-3.5 w-3.5 text-blue-400" />
          Project Title
        </Label>
        <Input
          id="title"
          value={metadata.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter project title"
          className="bg-muted/30 border-border focus-visible:ring-blue-500/30 focus-visible:border-blue-500/50 transition-all text-xs h-8 shadow-inner"
        />
      </motion.div>

      {/* Thumbnail upload section - theme-aware */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <Label htmlFor="thumbnail" className="flex items-center gap-2 text-foreground text-xs">
          <ImagePlus className="h-3.5 w-3.5 text-blue-400" />
          Custom Thumbnail
        </Label>

        <div className="flex gap-3 items-start">
          {/* Thumbnail preview */}
          <div className="w-24 h-24 rounded-md overflow-hidden border border-border bg-muted/30 flex-shrink-0">
            {thumbnailPreview ? (
              <img
                src={thumbnailPreview || "/placeholder.svg"}
                alt="Thumbnail preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/50">
                <ImagePlus className="h-8 w-8 text-muted-foreground/50" />
              </div>
            )}
          </div>

          {/* Upload controls */}
          <div className="flex-1 flex flex-col justify-center h-24">
            <p className="text-[10px] text-muted-foreground mb-2">
              Upload a custom thumbnail image for your project or we'll generate one from your video.
            </p>
            <input
              id="thumbnail-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleThumbnailChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-[10px] h-7 border-border hover:bg-muted hover:text-foreground w-fit"
              onClick={() => document.getElementById("thumbnail-upload")?.click()}
            >
              <UploadIcon className="h-3 w-3 mr-1.5" />
              {thumbnailPreview ? "Change Thumbnail" : "Upload Thumbnail"}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Description field */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Label htmlFor="description" className="flex items-center gap-2 text-foreground text-xs">
          <FileText className="h-3.5 w-3.5 text-blue-400" />
          Description
        </Label>
        <Textarea
          id="description"
          value={metadata.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Enter project description"
          rows={4}
          className="bg-muted/30 border-border focus-visible:ring-blue-500/30 focus-visible:border-blue-500/50 resize-none transition-all text-xs min-h-[100px] shadow-inner"
        />
      </motion.div>

      {/* Tags field with interactive suggestions */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Label htmlFor="tags" className="flex items-center gap-2 text-foreground text-xs">
          <Tag className="h-3.5 w-3.5 text-blue-400" />
          Tags
        </Label>

        {/* Tag display area with animations */}
        <div className="flex flex-wrap gap-1.5 mb-2 min-h-[28px]">
          <AnimatePresence>
            {metadata.tags.map((tag) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, height: 0 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <Badge
                  variant="secondary"
                  className="px-1.5 py-0.5 text-[10px] bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 group"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-1 hover:text-white group-hover:bg-blue-500/30 rounded-full p-0.5 transition-colors"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-2 w-2" />
                    <span className="sr-only">Remove tag</span>
                  </button>
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Tag input */}
        <div className="relative">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Add tags (press Enter to add)"
            className="bg-muted/30 border-border focus-visible:ring-blue-500/30 focus-visible:border-blue-500/50 transition-all text-xs h-8 shadow-inner pr-8"
          />
          {tagInput && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setTagInput("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear</span>
            </button>
          )}
        </div>

        {/* Tag suggestions */}
        {availableSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {availableSuggestions.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="px-1.5 py-0.5 text-[10px] border-border text-muted-foreground hover:border-blue-500/50 hover:text-blue-400 cursor-pointer transition-colors"
                onClick={() => {
                  handleChange("tags", [...metadata.tags, tag])
                }}
              >
                + {tag}
              </Badge>
            ))}
          </div>
        )}
      </motion.div>

      {/* Privacy setting */}
      <motion.div
        className="space-y-2 pt-2"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2 text-foreground text-xs">
            <Users className="h-3.5 w-3.5 text-blue-400" />
            Project Privacy
          </Label>
          <Switch checked={isPrivate} onCheckedChange={setIsPrivate} className="data-[state=checked]:bg-blue-500" />
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-lg bg-muted/30 border border-border">
          {isPrivate ? (
            <>
              <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Lock className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <div>
                <div className="text-xs font-medium text-foreground">Private Project</div>
                <div className="text-[9px] text-muted-foreground">Only you and invited collaborators can access</div>
              </div>
            </>
          ) : (
            <>
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div>
                <div className="text-xs font-medium text-foreground">Public Project</div>
                <div className="text-[9px] text-muted-foreground">Anyone with the link can view this project</div>
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* Collaborators section */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Label className="flex items-center gap-2 text-foreground text-xs">
          <Users className="h-3.5 w-3.5 text-blue-400" />
          Collaborators
        </Label>

        <div className="flex -space-x-2 mt-1">
          <Avatar className="border-2 border-background w-7 h-7">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>MS</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background w-7 h-7">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <Avatar className="border-2 border-background w-7 h-7 bg-blue-500/20 text-blue-400">
            <AvatarFallback>+</AvatarFallback>
          </Avatar>
        </div>
      </motion.div>
    </div>
  )
}

