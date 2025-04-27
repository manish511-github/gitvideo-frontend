"use client"

import { useState, useEffect } from "react"
import { VideoPlayer } from "@/components/video-player"
import { VideoOperations } from "@/components/video-operations"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { X, Edit2, GitCommit } from "lucide-react"

interface Change {
  type: "merge" | "cut" | "insert" | "update"
  timestamp: string
}

interface Commit {
  id: string
  message: string
  author: string
  date: string
  avatar: string
  branch: string
  changes: Change[]
  videoUrl?: string
}

interface VideoEditorModalProps {
  commit: Commit
  onClose: () => void
  isOpen: boolean
}

export function VideoEditorModal({ commit, onClose, isOpen }: VideoEditorModalProps) {
  const [mounted, setMounted] = useState(false)

  // Handle mounting for client-side rendering
  useEffect(() => {
    setMounted(true)

    // Add escape key listener to close modal
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  const getChangeIcon = (type: "merge" | "cut" | "insert" | "update") => {
    switch (type) {
      case "merge":
        return "🔄"
      case "cut":
        return "✂️"
      case "insert":
        return "➕"
      case "update":
        return "🔄"
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="absolute top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full h-10 w-10 bg-background/50 hover:bg-background/80"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="h-screen w-full flex flex-col">
        {/* Header with commit info */}
        <div className="h-14 border-b flex items-center px-4 bg-background/95 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-2 py-0.5">
              Editing: {commit.message}
            </Badge>
          </div>
        </div>

        {/* Main content with resizable panels */}
        <ResizablePanelGroup direction="horizontal" className="flex-grow">
          {/* Video panel - takes most of the space */}
          <ResizablePanel defaultSize={75} minSize={60}>
            <div className="w-full h-full flex items-center justify-center p-4 bg-black/5">
              <div className="w-full h-full max-w-5xl">
                <VideoPlayer videoUrl={commit.videoUrl} forceShowVideo={true} />
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right panel with tabs */}
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <Tabs defaultValue="edit" className="h-full">
              <TabsList className="w-full flex justify-center border-b rounded-none">
                <TabsTrigger value="edit" className="flex gap-2">
                  <Edit2 className="h-4 w-4" />
                  <span>Edit</span>
                </TabsTrigger>
                <TabsTrigger value="commit-info" className="flex gap-2">
                  <GitCommit className="h-4 w-4" />
                  <span>Commit</span>
                </TabsTrigger>
              </TabsList>

              <div className="h-[calc(100%-40px)] overflow-auto">
                <TabsContent value="edit" className="h-full p-4 m-0">
                  <VideoOperations />
                </TabsContent>

                <TabsContent value="commit-info" className="h-full p-4 m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <GitCommit className="h-5 w-5" />
                        Commit Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={commit.avatar} alt={commit.author} />
                          {/* <AvatarFallback>{commit.author[0]}</AvatarFallback> */}
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{commit.message}</h3>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-sm text-muted-foreground">
                            <span>{commit.author}</span>
                            <span>•</span>
                            <span>{commit.date}</span>
                            <span>•</span>
                            <Badge variant="outline" className="px-1 py-0 text-xs font-normal">
                              {commit.branch}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Changes</h4>
                        <div className="space-y-2">
                          {/* {commit.changes.map((change, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                              <span>{getChangeIcon(change.type)}</span>
                              <div>
                                <span className="text-sm font-medium capitalize">{change.type}</span>
                                <span className="text-xs text-muted-foreground ml-2">at {change.timestamp}</span>
                              </div>
                            </div>
                          ))} */}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

