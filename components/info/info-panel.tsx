"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedVideoPlayer } from "@/components/enhanced-video-player"
import type { Branch, Commit } from "@/types/repo-types"
import { fetchCommitMetadata } from "@/lib/redux/commitMetadataSlice"

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
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Utility functions for formatting metadata
const formatDuration = (seconds: number | undefined): string => {
  if (!seconds) return "00:00"
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

const formatFileSize = (bytes: number | undefined): string => {
  if (!bytes) return "0 B"
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

const formatFrameTypes = (frameTypes: any): string => {
  if (!frameTypes) return "N/A"
  return `I:${frameTypes.I || 0}, P:${frameTypes.P || 0}, B:${frameTypes.B || 0}`
}

const formatProcessingTime = (timestamp: string | undefined): string => {
  if (!timestamp) return "N/A"
  try {
    const date = new Date(timestamp)
    return date.toLocaleString()
  } catch (e) {
    return timestamp
  }
}

interface InfoPanelProps {
  selectedBranchObj: Branch | undefined
  selectedCommit: any | null
  showPreview: boolean
  enterEditMode: (commit: Commit) => void
}

export function InfoPanel({ selectedBranchObj, selectedCommit, showPreview, enterEditMode }: InfoPanelProps) {
  const [activeTab, setActiveTab] = useState<string>("technical")
  const dispatch = useAppDispatch()

  // Get metadata from Redux store with debugging
  const { data, loading, error } = useAppSelector((state: any) => {
    console.log("Current commitMetadata state:", state.commitMetadata)
    return state.commitMetadata
  })

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

  useEffect(() => {
    if (!selectedCommit) return

    console.log("Fetching metadata for commit:", selectedCommit.commitId)
    dispatch(fetchCommitMetadata({ commitId: selectedCommit.commitId }))
  }, [selectedCommit, dispatch])

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
                  videoUrl={selectedCommit.playlistUrl}
                  title={selectedCommit.description}
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
                <TabsTrigger
                  value="debug"
                  className="text-[11px] h-9 px-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none flex items-center gap-1.5"
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  Debug
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
                  {loading ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading metadata...</p>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center p-4">
                        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-red-500">Error loading metadata</p>
                        <p className="text-xs text-muted-foreground mt-1">{error}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 space-y-3 w-full">
                      {/* Technical Overview */}
                      <div className="space-y-1.5 w-full">
                        <h3 className="text-[10px] uppercase font-medium text-muted-foreground dark:text-white/70 flex items-center gap-1.5">
                          <Info className="h-3.5 w-3.5" />
                          TECHNICAL OVERVIEW
                        </h3>
                        <div className="grid grid-cols-2 gap-1.5 w-full">
                          {data?.technical?.video_streams?.[0] ? (
                            <>
                              <TechSpec
                                label="Codec"
                                value={data.technical.video_streams[0].codec_long_name || "H.264"}
                              />
                              <TechSpec
                                label="Resolution"
                                value={`${data.technical.video_streams[0].width} × ${data.technical.video_streams[0].height}`}
                              />
                              <TechSpec
                                label="Bitrate"
                                value={`${Math.round(data.technical.video_streams[0].bit_rate / 1000)} kbps`}
                              />
                              <TechSpec
                                label="Format"
                                value={data.technical.general.format_long_name || "MOV (H.264)"}
                              />
                              <TechSpec label="Duration" value={formatDuration(data.technical.general.duration)} />
                              <TechSpec label="File Size" value={formatFileSize(data.technical.general.size)} />
                            </>
                          ) : (
                            <>
                              <TechSpec label="Codec" value="Not available" />
                              <TechSpec label="Resolution" value="Not available" />
                              <TechSpec label="Bitrate" value="Not available" />
                              <TechSpec label="Format" value="Not available" />
                              <TechSpec label="Duration" value="Not available" />
                              <TechSpec label="File Size" value="Not available" />
                            </>
                          )}
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
                          {data?.technical?.video_streams?.[0] ? (
                            <>
                              <TechSpec
                                label="Frame Rate"
                                value={`${data.technical.video_streams[0].frame_rate} fps`}
                              />
                              <TechSpec
                                label="Pixel Format"
                                value={data.technical.video_streams[0].pix_fmt || "yuv420p"}
                              />
                              <TechSpec label="Profile" value={data.technical.video_streams[0].profile || "High"} />
                              <TechSpec
                                label="Aspect Ratio"
                                value={data.technical.video_streams[0].display_aspect_ratio || "16:9"}
                              />
                              <TechSpec
                                label="Field Order"
                                value={data.technical.video_streams[0].field_order || "Progressive"}
                              />
                              <TechSpec label="Total Frames" value={data.analysis?.total_frames?.toString() || "N/A"} />
                            </>
                          ) : (
                            <>
                              <TechSpec label="Frame Rate" value="Not available" />
                              <TechSpec label="Pixel Format" value="Not available" />
                              <TechSpec label="Profile" value="Not available" />
                              <TechSpec label="Aspect Ratio" value="Not available" />
                              <TechSpec label="Field Order" value="Not available" />
                              <TechSpec label="Total Frames" value="Not available" />
                            </>
                          )}
                        </div>
                      </div>

                      <Separator className="w-full my-2 bg-border dark:bg-zinc-800" />

                      {/* Audio specs */}
                      <div className="space-y-1.5 w-full">
                        <h3 className="text-[10px] uppercase font-medium text-muted-foreground dark:text-white/70 flex items-center gap-1.5">
                          <Volume2 className="h-3.5 w-3.5" />
                          AUDIO
                        </h3>
                        <div className="grid grid-cols-2 gap-1.5 w-full">
                          {data?.technical?.audio_streams?.[0] ? (
                            <>
                              <TechSpec
                                label="Codec"
                                value={data.technical.audio_streams[0].codec_long_name || "AAC-LC"}
                              />
                              <TechSpec
                                label="Sample Rate"
                                value={`${data.technical.audio_streams[0].sample_rate} Hz`}
                              />
                              <TechSpec
                                label="Channels"
                                value={data.technical.audio_streams[0].channel_layout || "Stereo"}
                              />
                              <TechSpec
                                label="Bit Rate"
                                value={`${Math.round(data.technical.audio_streams[0].bit_rate / 1000)} kbps`}
                              />
                            </>
                          ) : (
                            <>
                              <TechSpec label="Codec" value="Not available" />
                              <TechSpec label="Sample Rate" value="Not available" />
                              <TechSpec label="Channels" value="Not available" />
                              <TechSpec label="Bit Rate" value="Not available" />
                            </>
                          )}
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
                              {data?.system?.hardware_acceleration?.length > 0 ? "enabled" : "disabled"}
                            </Badge>
                          </div>
                          <TechSpec label="Encoder" value={data?.technical?.general?.tags?.encoder || "Unknown"} />
                          {data?.technical?.video_streams?.[0] ? (
                            <>
                              <TechSpec label="Profile" value={data.technical.video_streams[0].profile || "Main 10"} />
                              <TechSpec label="Frame Types" value={formatFrameTypes(data.analysis?.frame_types)} />
                            </>
                          ) : (
                            <>
                              <TechSpec label="Profile" value="Not available" />
                              <TechSpec label="Frame Types" value="Not available" />
                            </>
                          )}
                        </div>
                      </div>

                      {data?.analysis && (
                        <>
                          <Separator className="w-full my-2 bg-border dark:bg-zinc-800" />

                          {/* Analysis info */}
                          <div className="space-y-1.5 w-full">
                            <h3 className="text-[10px] uppercase font-medium text-muted-foreground dark:text-white/70 flex items-center gap-1.5">
                              <Cpu className="h-3.5 w-3.5" />
                              ANALYSIS
                            </h3>
                            <div className="grid grid-cols-2 gap-1.5 w-full">
                              <TechSpec
                                label="Keyframe Count"
                                value={data.analysis.keyframe_count?.toString() || "N/A"}
                              />
                              <TechSpec
                                label="Keyframe Interval"
                                value={data.analysis.keyframe_interval?.toString() || "N/A"}
                              />
                              <TechSpec label="Motion Analysis" value={data.analysis.motion_analysis || "N/A"} />
                              <TechSpec
                                label="Processing Time"
                                value={formatProcessingTime(data.system?.processing_time)}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
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
                        {/* {selectedCommit.changes.map((change, index) => (
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
                        ))} */}
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
                        <div className="bg-muted dark:bg-zinc-900 rounded-md p-1.5 border border-border dark:border-zinc-800" />
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

            {/* Debug tab */}
            <TabsContent
              value="debug"
              className="h-full m-0 data-[state=active]:flex-1 data-[state=active]:overflow-hidden"
            >
              <ScrollArea className="h-full">
                <div className="p-3 space-y-3">
                  <h3 className="text-[10px] uppercase font-medium text-muted-foreground dark:text-white/70 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    DEBUG INFORMATION
                  </h3>

                  <div className="space-y-2">
                    <div className="bg-muted dark:bg-zinc-900 rounded-md p-2 shadow-sm border border-border dark:border-zinc-800">
                      <div className="text-[10px] text-muted-foreground dark:text-white/60 mb-0.5">API Status</div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${loading ? "bg-amber-500" : error ? "bg-red-500" : "bg-green-500"}`}
                        ></div>
                        <span className="text-[11px] font-medium">
                          {loading ? "Loading..." : error ? "Error" : data ? "Data Loaded" : "No Data"}
                        </span>
                      </div>
                    </div>

                    <div className="bg-muted dark:bg-zinc-900 rounded-md p-2 shadow-sm border border-border dark:border-zinc-800">
                      <div className="text-[10px] text-muted-foreground dark:text-white/60 mb-0.5">
                        Selected Commit ID
                      </div>
                      <div className="text-[11px] font-mono bg-black/20 p-1 rounded overflow-x-auto">
                        {selectedCommit?.commitId || "None"}
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-500/10 rounded-md p-2 shadow-sm border border-red-500/30">
                        <div className="text-[10px] text-red-500 font-medium mb-0.5">Error Message</div>
                        <div className="text-[11px] text-red-500/80">{error}</div>
                      </div>
                    )}

                    <div className="bg-muted dark:bg-zinc-900 rounded-md p-2 shadow-sm border border-border dark:border-zinc-800">
                      <div className="text-[10px] text-muted-foreground dark:text-white/60 mb-0.5">Raw Metadata</div>
                      <div className="text-[10px] font-mono bg-black/20 p-1 rounded overflow-x-auto max-h-[300px] overflow-y-auto">
                        <pre>{JSON.stringify(data, null, 2) || "No data available"}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
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