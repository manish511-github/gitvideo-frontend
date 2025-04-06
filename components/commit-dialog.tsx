"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { GitCommit, Scissors, Combine, Upload, Replace } from "lucide-react"

export function CommitDialog() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState("clip")
  const [videoTime, setVideoTime] = useState([0])
  const [clipRange, setClipRange] = useState([0, 100])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <GitCommit className="mr-2 h-4 w-4" />
          New Commit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create new commit</DialogTitle>
          <DialogDescription>Make changes to your video and create a new commit</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <Tabs defaultValue="clip" value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="clip">Clip</TabsTrigger>
                <TabsTrigger value="merge">Merge</TabsTrigger>
                <TabsTrigger value="insert">Insert</TabsTrigger>
                <TabsTrigger value="update">Update</TabsTrigger>
              </TabsList>
              <TabsContent value="clip" className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Clip Range</Label>
                    <div className="px-2">
                      <Slider
                        value={clipRange}
                        max={100}
                        step={1}
                        onValueChange={setClipRange}
                        className="[&>span:first-child]:h-2"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatTime(clipRange[0])}</span>
                      <span>{formatTime(clipRange[1])}</span>
                    </div>
                  </div>
                  <div className="relative aspect-video rounded-lg border bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Scissors className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="merge" className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Select Video to Merge</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a video" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video1">Tutorial Part 1</SelectItem>
                        <SelectItem value="video2">Product Demo</SelectItem>
                        <SelectItem value="video3">Company Overview</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative aspect-video rounded-lg border bg-muted">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Combine className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="insert" className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Insert Position</Label>
                    <div className="px-2">
                      <Slider
                        value={videoTime}
                        max={100}
                        step={1}
                        onValueChange={setVideoTime}
                        className="[&>span:first-child]:h-2"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatTime(videoTime[0])}</span>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Upload Video Segment</Label>
                    <div className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 px-5 py-5 text-center hover:bg-muted/50">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <div className="mt-4 flex flex-col items-center gap-1">
                        <p className="text-sm font-medium">Drop your video here</p>
                        <p className="text-xs text-muted-foreground">MP4, MOV, or WebM</p>
                        <Input id="video-upload" type="file" accept="video/*" className="hidden" />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="mt-2"
                          onClick={() => document.getElementById("video-upload")?.click()}
                        >
                          Select file
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="update" className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Update Range</Label>
                    <div className="px-2">
                      <Slider
                        value={clipRange}
                        max={100}
                        step={1}
                        onValueChange={setClipRange}
                        className="[&>span:first-child]:h-2"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatTime(clipRange[0])}</span>
                      <span>{formatTime(clipRange[1])}</span>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Upload Replacement Segment</Label>
                    <div className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 px-5 py-5 text-center hover:bg-muted/50">
                      <Replace className="h-8 w-8 text-muted-foreground" />
                      <div className="mt-4 flex flex-col items-center gap-1">
                        <p className="text-sm font-medium">Drop your video here</p>
                        <p className="text-xs text-muted-foreground">MP4, MOV, or WebM</p>
                        <Input id="video-replace" type="file" accept="video/*" className="hidden" />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="mt-2"
                          onClick={() => document.getElementById("video-replace")?.click()}
                        >
                          Select file
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="commit-message">Commit message</Label>
                <Textarea id="commit-message" placeholder="Describe your changes..." className="resize-none" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="branch">Target Branch</Label>
                <Select defaultValue="main">
                  <SelectTrigger id="branch">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">main</SelectItem>
                    <SelectItem value="dev">development</SelectItem>
                    <SelectItem value="feature">feature/new-intro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating commit..." : "Create commit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function formatTime(seconds: number) {
  const minutes = Math.floor((seconds / 100) * 10)
  const remainingSeconds = Math.floor(((seconds / 100) * 10 * 60) % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

