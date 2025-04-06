"use client"

import { useState } from "react"
import { VideoPlayer } from "@/components/video-player"
import { VersionHistory } from "@/components/version-history"
import { VideoMetadataPanel } from "@/components/video-metadata-panel"
import { VideoOperations } from "@/components/video-operations"
import { BranchSelector } from "@/components/branch-selector"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ChevronLeft, FileVideo, GitCommit, Info } from "lucide-react"

interface VideoEditorLayoutProps {
  onExitEditorMode: () => void
}

export function VideoEditorLayout({ onExitEditorMode }: VideoEditorLayoutProps) {
  const [activeTab, setActiveTab] = useState("edit")

  return (
    <div className="flex flex-col h-screen">
      {/* Minimal header for editor mode */}
      <div className="h-14 border-b flex items-center justify-between px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="gap-2" onClick={onExitEditorMode}>
            <ChevronLeft className="h-4 w-4" />
            Exit Editor Mode
          </Button>
        </div>
        <BranchSelector />
      </div>

      <ResizablePanelGroup direction="vertical" className="flex-1 overflow-hidden">
        {/* Video panel - takes most of the space */}
        <ResizablePanel defaultSize={75} minSize={50}>
          <div className="flex items-center justify-center h-full p-6 bg-black/5">
            <div className="w-full max-w-5xl">
              <VideoPlayer />
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Bottom panel with tabs - can be resized */}
        <ResizablePanel defaultSize={25} minSize={15} maxSize={50} className="flex flex-col min-h-0">
          <Tabs
            defaultValue="edit"
            value={activeTab}
            onValueChange={setActiveTab}
            className="h-full flex flex-col min-h-0 overflow-hidden"
          >
            <div className="flex h-full overflow-hidden">
              <TabsList className="flex-col h-full border-r p-1 space-y-1 rounded-none justify-start">
                <TabsTrigger value="edit" className="flex gap-2 justify-start px-3">
                  <GitCommit className="h-4 w-4" />
                  <span>Edit</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex gap-2 justify-start px-3">
                  <FileVideo className="h-4 w-4" />
                  <span>History</span>
                </TabsTrigger>
                <TabsTrigger value="metadata" className="flex gap-2 justify-start px-3">
                  <Info className="h-4 w-4" />
                  <span>Metadata</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden min-h-0">
                <TabsContent value="edit" className="h-full p-4 m-0 overflow-hidden flex flex-col">
                  <VideoOperations />
                </TabsContent>
                <TabsContent value="history" className="h-full p-4 m-0 overflow-hidden flex flex-col">
                  <VersionHistory />
                </TabsContent>
                <TabsContent value="metadata" className="h-full p-4 m-0 overflow-hidden flex flex-col">
                  <VideoMetadataPanel />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

