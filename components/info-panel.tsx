"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { VideoPlayer } from "@/components/video-player"
import type { Branch, Commit } from "@/types/repo-types"
import { FileVideo, GitBranch, Folder, GitCommit, Clock, Edit2 } from "lucide-react"

interface InfoPanelProps {
  selectedBranchObj: Branch | undefined
  selectedCommit: Commit | null
  showPreview: boolean
  enterEditMode: (commit: Commit) => void
}

export function InfoPanel({ selectedBranchObj, selectedCommit, showPreview, enterEditMode }: InfoPanelProps) {
  return (
    <ResizablePanelGroup direction="vertical">
      {/* Video preview panel */}
      <ResizablePanel defaultSize={60}>
        <div className="h-full flex flex-col p-3">
          <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
            <FileVideo className="h-3.5 w-3.5 text-muted-foreground" />
            Video Preview
          </h3>
          {selectedCommit && showPreview ? (
            <div className="flex-grow flex items-center justify-center bg-black/5 rounded-md overflow-hidden">
              <VideoPlayer />
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center bg-muted/50 rounded-md">
              <div className="text-center text-muted-foreground">
                <FileVideo className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a video to preview</p>
              </div>
            </div>
          )}
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Branch metadata panel - More elegant design */}
      <ResizablePanel defaultSize={40}>
        <div className="h-full flex flex-col p-3 overflow-auto">
          <h3 className="text-sm font-medium mb-3 flex items-center gap-1.5">
            <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
            Branch Information
          </h3>

          {selectedBranchObj ? (
            <div className="space-y-4">
              <div className="bg-muted/20 rounded-md p-3">
                <h4 className="text-sm font-medium flex items-center gap-1.5">
                  <Folder className="h-3.5 w-3.5 text-muted-foreground" />
                  {selectedBranchObj.name}
                </h4>
                <div className="mt-1 flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                    <GitCommit className="h-2.5 w-2.5 mr-0.5" />
                    {selectedBranchObj.commits.length} commits
                  </Badge>
                </div>
              </div>

              {selectedBranchObj.commits.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Latest Commit</h4>
                  <div className="border rounded-md p-3 bg-muted/5 hover:bg-muted/10 transition-colors">
                    <div className="flex items-start gap-2">
                      <Avatar className="h-6 w-6 mt-0.5">
                        <AvatarImage
                          src={selectedBranchObj.commits[0].avatar}
                          alt={selectedBranchObj.commits[0].author}
                        />
                        <AvatarFallback>{selectedBranchObj.commits[0].author[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{selectedBranchObj.commits[0].message}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <span>{selectedBranchObj.commits[0].author}</span>
                          <span className="text-muted-foreground/50">•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {selectedBranchObj.commits[0].date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedCommit && (
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Selected Commit
                  </h4>
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-muted/10 p-3 border-b">
                      <div className="flex items-start gap-2">
                        <Avatar className="h-6 w-6 mt-0.5">
                          <AvatarImage src={selectedCommit.avatar} alt={selectedCommit.author} />
                          <AvatarFallback>{selectedCommit.author[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{selectedCommit.message}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <span>{selectedCommit.author}</span>
                            <span className="text-muted-foreground/50">•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {selectedCommit.date}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="text-xs font-medium mb-2">Changes</div>
                      <div className="space-y-1.5">
                        {selectedCommit.changes.map((change, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-muted/5 rounded-md p-1.5">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${
                                change.type === "cut"
                                  ? "bg-red-500"
                                  : change.type === "insert"
                                    ? "bg-green-500"
                                    : change.type === "merge"
                                      ? "bg-blue-500"
                                      : "bg-amber-500"
                              }`}
                            />
                            <div className="flex-1">
                              <div className="text-xs font-medium capitalize">{change.type}</div>
                              <div className="text-[10px] text-muted-foreground">{change.timestamp}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button className="w-full mt-3" size="sm" onClick={() => enterEditMode(selectedCommit)}>
                        <Edit2 className="mr-2 h-3.5 w-3.5" />
                        Enter Edit Mode
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <div className="text-center">
                <GitBranch className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No branch selected</p>
              </div>
            </div>
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

