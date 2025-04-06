"use client"
import { VideoPlayer } from "@/components/video-player"
import { VideoOperations } from "@/components/video-operations"
import { BranchSelector } from "@/components/branch-selector"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ChevronLeft, Edit2, GitCommit } from "lucide-react"

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

interface VideoEditorViewProps {
  commit: Commit
  onBack: () => void
}

export function VideoEditorView({ commit, onBack }: VideoEditorViewProps) {
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
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Minimal header */}
      <div className="h-14 border-b flex items-center justify-between px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2" onClick={onBack}>
            <ChevronLeft className="h-4 w-4" />
            Back to Repository
          </Button>
          <div className="flex items-center gap-2 ml-4">
            <Badge variant="outline" className="px-2 py-0.5">
              Editing: {commit.message}
            </Badge>
          </div>
        </div>
        <BranchSelector />
      </div>

      {/* Main content with resizable panels */}
      <ResizablePanelGroup direction="vertical" className="flex-grow">
        {/* Video panel - takes most of the space */}
        <ResizablePanel defaultSize={70} minSize={50}>
          <div className="w-full h-full flex items-center justify-center p-4 bg-black/5">
            <div className="w-full h-full max-w-5xl">
              <VideoPlayer videoUrl={commit.videoUrl} forceShowVideo={true} />
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Bottom panel with tabs */}
        <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
          <Tabs defaultValue="edit" className="h-full">
            <div className="flex h-full">
              <TabsList className="flex-col h-full border-r p-1 space-y-1 rounded-none justify-start">
                <TabsTrigger value="edit" className="flex gap-2 justify-start px-3">
                  <Edit2 className="h-4 w-4" />
                  <span>Edit</span>
                </TabsTrigger>
                <TabsTrigger value="commit-info" className="flex gap-2 justify-start px-3">
                  <GitCommit className="h-4 w-4" />
                  <span>Commit</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-auto">
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
                          <AvatarFallback>{commit.author[0]}</AvatarFallback>
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
                          {commit.changes.map((change, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                              <span>{getChangeIcon(change.type)}</span>
                              <div>
                                <span className="text-sm font-medium capitalize">{change.type}</span>
                                <span className="text-xs text-muted-foreground ml-2">at {change.timestamp}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

