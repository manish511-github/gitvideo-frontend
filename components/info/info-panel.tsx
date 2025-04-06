"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedVideoPlayer } from "@/components/enhanced-video-player"
import type { Branch, Commit } from "@/types/repo-types"
import {
  FileVideo,
  Edit2,
  Clock,
  Film,
  Volume2,
  Cpu,
  Info,
  Star,
  Tag,
  FileText,
  Youtube,
  MessageSquare,
  User,
  Users,
  CheckCircle,
  Scissors,
  Upload,
  Replace,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface InfoPanelProps {
  selectedBranchObj: Branch | undefined
  selectedCommit: Commit | null
  showPreview: boolean
  enterEditMode: (commit: Commit) => void
}

export function InfoPanel({ selectedBranchObj, selectedCommit, showPreview, enterEditMode }: InfoPanelProps) {
  const [activeTab, setActiveTab] = useState<string>("technical")

  // Get change type color
  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case "cut":
        return "bg-red-500"
      case "insert":
        return "bg-green-500"
      case "merge":
        return "bg-blue-500"
      case "update":
        return "bg-amber-500"
      default:
        return "bg-primary"
    }
  }

  // Get change type icon
  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case "cut":
        return <Scissors className="h-3 w-3 text-red-500" />
      case "insert":
        return <Upload className="h-3 w-3 text-green-500" />
      case "update":
        return <Replace className="h-3 w-3 text-amber-500" />
      default:
        return null
    }
  }

  return (
    <ResizablePanelGroup direction="vertical" className="h-full">
      {/* Video preview panel */}
      <ResizablePanel defaultSize={60} minSize={30}>
        <div className="h-full flex flex-col p-2 bg-background dark:bg-black">
          <h3 className="text-[9px] uppercase font-medium mb-1.5 flex items-center gap-1 text-muted-foreground dark:text-white/70">
            <FileVideo className="h-3 w-3" />
            VIDEO PREVIEW
          </h3>
          {selectedCommit && showPreview ? (
            <div className="flex-grow flex items-center justify-center bg-muted dark:bg-black rounded-md overflow-hidden shadow-md border border-border dark:border-zinc-800">
              <div className="w-full h-full relative">
                <EnhancedVideoPlayer
                  title={selectedCommit.message}
                  author={selectedCommit.author}
                  authorAvatar={selectedCommit.avatar}
                />
              </div>
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center bg-muted dark:bg-black rounded-md shadow-md border border-border dark:border-zinc-800">
              <div className="text-center p-4 max-w-[80%]">
                <div className="bg-background/80 dark:bg-zinc-900 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center shadow-inner">
                  <FileVideo className="h-8 w-8 text-muted-foreground dark:text-white/50" />
                </div>
                <p className="text-[10px] font-medium text-foreground dark:text-white/80 mb-1">No video selected</p>
                <p className="text-[9px] text-muted-foreground dark:text-white/50">
                  Select a video from the repository to preview and edit
                </p>
              </div>
            </div>
          )}
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle className="bg-border dark:bg-zinc-800" />

      {/* Metadata panel */}
      <ResizablePanel defaultSize={40} minSize={20} className="flex flex-col bg-black">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-border dark:border-zinc-800 px-3 bg-background dark:bg-black">
            <div className="flex">
              <TabsList className="h-9 bg-background dark:bg-black p-0 w-full justify-start gap-1">
                <TabsTrigger
                  value="technical"
                  className="text-[11px] h-9 px-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-1.5"
                >
                  <Cpu className="h-3.5 w-3.5" />
                  Technical
                </TabsTrigger>
                <TabsTrigger
                  value="content"
                  className="text-[11px] h-9 px-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-1.5"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Content
                </TabsTrigger>
                <TabsTrigger
                  value="status"
                  className="text-[11px] h-9 px-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-1.5"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  Status
                </TabsTrigger>
                <TabsTrigger
                  value="user"
                  className="text-[11px] h-9 px-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-1.5"
                >
                  <User className="h-3.5 w-3.5" />
                  User
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="flex-1 overflow-hidden bg-background dark:bg-black">
            {/* Technical metadata tab */}
            <TabsContent
              value="technical"
              className="h-full m-0 data-[state=active]:flex-1 data-[state=active]:overflow-hidden"
            >
              {selectedCommit ? (
                <ScrollArea className="h-full w-full">
                  <div className="p-3 space-y-3 w-full">
                    {/* Technical Overview */}
                    <div className="space-y-1.5 w-full">
                      <h3 className="text-[10px] uppercase font-medium text-muted-foreground dark:text-white/70 flex items-center gap-1.5">
                        <Info className="h-3.5 w-3.5" />
                        TECHNICAL OVERVIEW
                      </h3>
                      <div className="grid grid-cols-2 gap-1.5 w-full">
                        <TechSpec label="HEVC" value="H.265" />
                        <TechSpec label="Resolution" value="3840 × 2160" />
                        <TechSpec label="Bitrate" value="29.98 Mbps" />
                        <TechSpec label="Format" value="MOV (H.265)" />
                        <TechSpec label="Duration" value="00:31" />
                        <TechSpec label="File Size" value="118 MB" />
                      </div>
                    </div>

                    <Separator className="w-full my-2 bg-border dark:bg-zinc-800" />

                    {/* Video specs */}
                    <div className="space-y-1.5 w-full">
                      <h3 className="text-[10px] uppercase font-medium text-muted-foreground dark:text-white/70 flex items-center gap-1.5">
                        <Film className="h-3.5 w-3.5" />
                        VIDEO
                      </h3>
                      <div className="grid grid-cols-2 gap-1.5 w-full">
                        <TechSpec label="Frame Rate" value="23.98 fps" />
                        <TechSpec label="Color Depth" value="10-bit" />
                        <TechSpec label="Color Space" value="BT.709" />
                        <TechSpec label="File Size" value="118 MB" />
                      </div>
                    </div>

                    <Separator className="w-full my-2 bg-border dark:bg-zinc-800" />

                    {/* Audio specs */}
                    <div className="space-y-1.5 w-full">
                      <h3 className="text-[10px] uppercase font-medium text-muted-foreground dark:text-white/70 flex items-center gap-1.5">
                        <Volume2 className="h-3.5 w-3.5" /> {/* Changed from AudioWaveform to Volume2 */}
                        AUDIO
                      </h3>
                      <div className="grid grid-cols-2 gap-1.5 w-full">
                        <TechSpec label="Codec" value="AAC-LC" />
                        <TechSpec label="Sample Rate" value="48 kHz" />
                        <TechSpec label="Channels" value="Stereo" />
                        <TechSpec label="Bit Rate" value="256 kbps" />
                      </div>
                    </div>

                    <Separator className="w-full my-2 bg-border dark:bg-zinc-800" />

                    {/* Encoding info */}
                    <div className="space-y-1.5 w-full">
                      <h3 className="text-[10px] uppercase font-medium text-muted-foreground dark:text-white/70 flex items-center gap-1.5">
                        <Cpu className="h-3.5 w-3.5" />
                        ENCODING INFORMATION
                      </h3>
                      <div className="grid grid-cols-2 gap-1.5 w-full">
                        <div className="bg-muted dark:bg-zinc-900 rounded-md p-1.5 w-full shadow-sm border border-border dark:border-zinc-800">
                          <div className="text-[10px] text-muted-foreground dark:text-white/60 mb-0.5">
                            Hardware Acceleration
                          </div>
                          <Badge variant="outline" className="text-[9px] h-4 px-1 border-zinc-700">
                            enabled
                          </Badge>
                        </div>
                        <TechSpec label="Encoder" value="VideoToolbox / Apple M1" />
                        <TechSpec label="Profile" value="Main 10" />
                        <TechSpec label="Level" value="5.1" />
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <div className="h-full flex items-center justify-center bg-background dark:bg-black">
                  <div className="text-center text-muted-foreground dark:text-white/50">
                    <Info className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p className="text-[9px]">Select a commit to view metadata</p>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Content info tab */}
            <TabsContent
              value="content"
              className="h-full m-0 data-[state=active]:flex-1 data-[state=active]:overflow-hidden"
            >
              {selectedCommit ? (
                <ScrollArea className="h-full">
                  <div className="p-3 space-y-3">
                    {/* Content Details */}
                    <div className="space-y-1.5 w-full">
                      <h3 className="text-[10px] uppercase font-medium text-muted-foreground dark:text-white/70 flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        CONTENT DETAILS
                      </h3>
                      <div className="space-y-1.5">
                        <div className="bg-muted dark:bg-zinc-900 rounded-md p-1.5 shadow-sm border border-border dark:border-zinc-800">
                          <div className="text-[10px] text-muted-foreground dark:text-white/60 mb-0.5">Keywords</div>
                          <div className="flex flex-wrap gap-1">
                            {["demo", "product", "intro"].map((tag) => (
                              <div
                                key={tag}
                                className="flex items-center gap-0.5 bg-border dark:bg-zinc-800 rounded-full px-1.5 py-0.5"
                              >
                                <Tag className="h-2 w-2 text-muted-foreground dark:text-white/60" />
                                <span className="text-[10px] text-foreground dark:text-white/80">{tag}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="bg-muted dark:bg-zinc-900 rounded-md p-1.5 shadow-sm border border-border dark:border-zinc-800">
                            <div className="text-[10px] text-muted-foreground dark:text-white/60 mb-0.5">
                              Final Edit
                            </div>
                            <Badge variant="outline" className="text-[9px] h-4 px-1 border-zinc-700">
                              No
                            </Badge>
                          </div>

                          <div className="bg-muted dark:bg-zinc-900 rounded-md p-1.5 shadow-sm border border-border dark:border-zinc-800">
                            <div className="text-[10px] text-muted-foreground dark:text-white/60 mb-0.5">Rating</div>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={cn(
                                    "h-3 w-3",
                                    star <= 3
                                      ? "fill-amber-500 text-amber-500"
                                      : "text-muted-foreground dark:text-white/30",
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-2 bg-border dark:bg-zinc-800" />

                    {/* Timeline */}
                    <div className="space-y-1.5 w-full">
                      <h3 className="text-[10px] uppercase font-medium text-muted-foreground dark:text-white/70 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        TIMELINE
                      </h3>
                      <div className="grid grid-cols-3 gap-1.5">
                        <TechSpec label="Start Time" value="00:00:00" />
                        <TechSpec label="End Time" value="00:00:29" />
                        <TechSpec label="Duration" value="00:31" />
                      </div>
                    </div>

                    <Separator className="my-2 bg-border dark:bg-zinc-800" />

                    {/* Notes */}
                    <div className="space-y-1.5 w-full">
                      <h3 className="text-[10px] uppercase font-medium text-muted-foreground dark:text-white/70 flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5" />
                        NOTES
                      </h3>
                      <div className="bg-muted dark:bg-zinc-900 rounded-md p-2 shadow-sm border border-border dark:border-zinc-800">
                        <p className="text-[11px] leading-relaxed text-foreground dark:text-white/90">
                          Need to adjust color grading. The highlights are a bit blown out in the outdoor scenes.
                          Consider adding more contrast to the interview segments.
                        </p>
                      </div>
                    </div>

                    <Separator className="my-2 bg-border dark:bg-zinc-800" />

                    {/* Commit Changes */}
                    <div className="space-y-1.5 w-full">
                      <h3 className="text-[10px] uppercase font-medium text-muted-foreground dark:text-white/70 flex items-center gap-1.5">
                        <Edit2 className="h-3.5 w-3.5" />
                        COMMIT CHANGES
                      </h3>
                      <div className="space-y-1.5">
                        {selectedCommit.changes.map((change, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-muted dark:bg-zinc-900 rounded-md p-1.5 shadow-sm border border-border dark:border-zinc-800"
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${getChangeTypeColor(change.type)}`} />
                            <div>
                              <span className="text-[10px] font-medium capitalize text-foreground dark:text-white/90">
                                {change.type}
                              </span>
                              <span className="text-[9px] text-muted-foreground dark:text-white/60 ml-1.5">
                                at {change.timestamp}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <div className="h-full flex items-center justify-center bg-background dark:bg-black">
                  <div className="text-center text-muted-foreground dark:text-white/50">
                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p className="text-[9px]">Select a commit to view content details</p>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Status tab */}
            <TabsContent
              value="status"
              className="h-full m-0 data-[state=active]:flex-1 data-[state=active]:overflow-hidden"
            >
              {selectedCommit ? (
                <ScrollArea className="h-full">
                  <div className="p-3 space-y-3">
                    {/* Current Status */}
                    <div className="space-y-1.5 w-full">
                      <h3 className="text-[10px] uppercase font-medium text-muted-foreground dark:text-white/70 flex items-center gap-1.5">
                        <CheckCircle className="h-3.5 w-3.5" />
                        CURRENT STATUS
                      </h3>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="bg-muted dark:bg-zinc-900 rounded-md p-1.5 border border-border dark:border-zinc-800">
                          <div className="text-[10px] text-muted-foreground dark:text-white/60 mb-0.5">Status</div>
                          <Badge className="text-[9px] h-4 px-1.5">In Progress</Badge>
                        </div>
                        <TechSpec label="Date Uploaded" value="03/30/2025" />
                        <TechSpec label="Release Date" value="04/15/2025" />
                        <div className="bg-muted dark:bg-zinc-900 rounded-md p-1.5 border border-border dark:border-zinc-800">
                          <div className="text-[10px] text-muted-foreground dark:text-white/60 mb-0.5">
                            Release Platform
                          </div>
                          <div className="flex items-center gap-1">
                            <Youtube className="h-2.5 w-2.5 text-red-500" />
                            <span className="text-[10px] font-medium text-foreground dark:text-white/90">YouTube</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-2 bg-border dark:bg-zinc-800" />

                    {/* Activity */}
                    <div className="space-y-1.5 w-full">
                      <h3 className="text-[10px] uppercase font-medium text-muted-foreground dark:text-white/70 flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5" />
                        ACTIVITY
                      </h3>
                      <div className="space-y-1.5">
                        <div className="bg-muted dark:bg-zinc-900 rounded-md p-2 shadow-sm border border-border dark:border-zinc-800">
                          <div className="flex items-start gap-1.5">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Sarah Chen" />
                              <AvatarFallback className="text-[9px]">SC</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-medium text-foreground dark:text-white/90">
                                  Sarah Chen
                                </span>
                                <span className="text-[9px] text-muted-foreground dark:text-white/60">2 days ago</span>
                              </div>
                              <p className="text-[10px] mt-0.5 leading-relaxed text-foreground dark:text-white/80">
                                Added new color grading to the intro sequence.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-muted dark:bg-zinc-900 rounded-md p-2 shadow-sm border border-border dark:border-zinc-800">
                          <div className="flex items-start gap-1.5">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Manish Singh" />
                              <AvatarFallback className="text-[9px]">MS</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] font-medium text-foreground dark:text-white/90">
                                  Manish Singh
                                </span>
                                <span className="text-[9px] text-muted-foreground dark:text-white/60">3 days ago</span>
                              </div>
                              <p className="text-[10px] mt-0.5 leading-relaxed text-foreground dark:text-white/80">
                                Please review the audio levels in the interview section.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <div className="h-full flex items-center justify-center bg-background dark:bg-black">
                  <div className="text-center text-muted-foreground dark:text-white/50">
                    <CheckCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p className="text-[9px]">Select a commit to view status</p>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* User tab */}
            <TabsContent
              value="user"
              className="h-full m-0 data-[state=active]:flex-1 data-[state=active]:overflow-hidden"
            >
              {selectedCommit ? (
                <ScrollArea className="h-full">
                  <div className="p-3 space-y-3">
                    {/* User info */}
                    <div className="space-y-1.5">
                      <h3 className="text-[10px] uppercase font-medium text-muted-foreground dark:text-white/70 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        USER
                      </h3>

                      <div className="bg-muted dark:bg-zinc-900 rounded-md p-2 shadow-sm border border-border dark:border-zinc-800">
                        <div className="text-[10px] text-muted-foreground dark:text-white/60 mb-0.5">Uploader</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Manish Singh" />
                            <AvatarFallback className="text-[9px]">MS</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-[11px] font-medium text-foreground dark:text-white/90">
                              Manish Singh
                            </div>
                            <div className="text-[9px] text-muted-foreground dark:text-white/60">Content Creator</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted dark:bg-zinc-900 rounded-md p-2 shadow-sm border border-border dark:border-zinc-800">
                        <div className="text-[10px] text-muted-foreground dark:text-white/60 mb-0.5">Assignee</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Sarah Chen" />
                            <AvatarFallback className="text-[9px]">SC</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-[11px] font-medium text-foreground dark:text-white/90">Sarah Chen</div>
                            <div className="text-[9px] text-muted-foreground dark:text-white/60">Video Editor</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted dark:bg-zinc-900 rounded-md p-2 shadow-sm border border-border dark:border-zinc-800">
                        <div className="text-[10px] text-muted-foreground dark:text-white/60 mb-0.5">Seen By</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Sarah Chen" />
                            <AvatarFallback className="text-[9px]">SC</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-[11px] font-medium text-foreground dark:text-white/90">Sarah Chen</div>
                            <div className="text-[9px] text-muted-foreground dark:text-white/60">Video Editor</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-2 bg-border dark:bg-zinc-800" />

                    {/* Team Members */}
                    <div className="space-y-1.5">
                      <h3 className="text-[10px] uppercase font-medium text-muted-foreground dark:text-white/70 flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        TEAM MEMBERS
                      </h3>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        <Avatar className="h-6 w-6 border-2 border-zinc-900">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Sarah Chen" />
                          <AvatarFallback className="text-[9px]">SC</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-zinc-900">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Manish Singh" />
                          <AvatarFallback className="text-[9px]">MS</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-zinc-900">
                          <AvatarFallback className="text-[9px]">JD</AvatarFallback>
                        </Avatar>
                        <Avatar className="h-6 w-6 border-2 border-zinc-900">
                          <AvatarFallback className="text-[9px]">MK</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              ) : (
                <div className="h-full flex items-center justify-center bg-background dark:bg-black">
                  <div className="text-center text-muted-foreground dark:text-white/50">
                    <User className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p className="text-[9px]">Select a commit to view user information</p>
                  </div>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

// Helper component for technical specifications
function TechSpec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted dark:bg-zinc-900 rounded-md p-1.5 w-full shadow-sm border border-border dark:border-zinc-800">
      <div className="text-[10px] text-muted-foreground dark:text-white/60 mb-0.5">{label}</div>
      <div className="text-[11px] font-medium truncate text-foreground dark:text-white/90">{value}</div>
    </div>
  )
}

