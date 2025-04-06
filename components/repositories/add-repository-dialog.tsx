"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Upload } from "lucide-react"

export function AddRepositoryDialog() {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Create new repository</DialogTitle>
            <DialogDescription>
              Add a new video repository to your workspace. You can upload your video and add details here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Repository name</Label>
              <Input id="name" placeholder="Enter repository name" required disabled={isLoading} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter repository description"
                className="resize-none"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label>Video file</Label>
              <div className="grid gap-4">
                <div className="flex items-center justify-center">
                  <div className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 px-5 py-5 text-center hover:bg-muted/50">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div className="mt-4 flex flex-col items-center gap-1">
                      <p className="text-sm font-medium">Drag and drop your video here</p>
                      <p className="text-xs text-muted-foreground">MP4, MOV, or WebM (max 2GB)</p>
                      <Input id="video" type="file" accept="video/*" className="hidden" disabled={isLoading} />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="mt-2"
                        disabled={isLoading}
                        onClick={() => document.getElementById("video")?.click()}
                      >
                        Select file
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create repository"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

