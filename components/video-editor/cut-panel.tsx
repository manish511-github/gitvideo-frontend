"use client"

import { useState, useEffect } from "react"
import {
  Scissors,
  Link,
  RefreshCw,
  PlusSquare,
  Trash2,
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowLeftRight,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import type { VideoClip } from "./types"

interface CutPanelProps {
  currentTime: number
  selectedClip: number | null
  clips?: VideoClip[]
  onCutAtCurrentTime: () => void
  onDeleteSelectedClip: () => void
  onMergeAdjacentClips: () => void
  onUpdateClip?: (clipId: number, updates: Partial<VideoClip>) => void
  onAddClip?: (position: "after" | "between") => void
  formatTime: (time: number) => string
}

export function CutPanel({
  currentTime,
  selectedClip,
  clips = [],
  onCutAtCurrentTime,
  onDeleteSelectedClip,
  onMergeAdjacentClips,
  onUpdateClip,
  onAddClip,
  formatTime,
}: CutPanelProps) {
  const [expandedSection, setExpandedSection] = useState<"cut" | "merge" | "update" | "insert" | null>("cut")
  const [clipName, setClipName] = useState("")
  const [clipStart, setClipStart] = useState(0)
  const [clipEnd, setClipEnd] = useState(0)

  // Cut range selection
  const [cutStartTime, setCutStartTime] = useState(0)
  const [cutEndTime, setCutEndTime] = useState(0)
  const [maxDuration, setMaxDuration] = useState(0)
  const [useRangeCut, setUseRangeCut] = useState(false)

  // Find the selected clip
  const selectedClipData = clips.find((clip) => clip.id === selectedClip)

  // Initialize form values when a clip is selected
  const initializeUpdateForm = (clip: VideoClip) => {
    setClipName(clip.name)
    setClipStart(clip.start)
    setClipEnd(clip.end)
  }

  // Set max duration based on clips
  useEffect(() => {
    if (clips.length > 0) {
      const maxEnd = Math.max(...clips.map((clip) => clip.end))
      setMaxDuration(maxEnd)
    }
  }, [clips])

  // Update cut range when current time changes
  useEffect(() => {
    if (!useRangeCut) {
      setCutStartTime(currentTime)
      setCutEndTime(Math.min(currentTime + 5, maxDuration))
    }
  }, [currentTime, maxDuration, useRangeCut])

  // Toggle section expansion
  const toggleSection = (section: "cut" | "merge" | "update" | "insert") => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)

      // Initialize form if needed
      if (section === "update" && selectedClipData) {
        initializeUpdateForm(selectedClipData)
      }
    }
  }

  // Handle update submission
  const handleUpdateClip = () => {
    if (!selectedClip || !onUpdateClip) return

    onUpdateClip(selectedClip, {
      name: clipName,
      start: clipStart,
      end: clipEnd,
    })
  }

  // Handle range cut
  const handleRangeCut = () => {
    if (!selectedClipData || !onUpdateClip) return

    // Find which clip contains the cut range
    const clipToCut = clips.find(
      (clip) =>
        (cutStartTime >= clip.start && cutStartTime <= clip.end) ||
        (cutEndTime >= clip.start && cutEndTime <= clip.end) ||
        (clip.start >= cutStartTime && clip.end <= cutEndTime),
    )

    if (!clipToCut) return

    // Perform the cut operation based on the range
    // This is a simplified implementation - in a real app, you'd need to handle
    // more complex scenarios like cutting across multiple clips

    // For now, we'll just call the existing cut function
    // In a real implementation, you would create a more sophisticated cut operation
    onCutAtCurrentTime()
  }

  // Set cut range to match selected clip
  const setCutRangeToClip = () => {
    if (!selectedClipData) return

    setCutStartTime(selectedClipData.start)
    setCutEndTime(selectedClipData.end)
    setUseRangeCut(true)
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-white mb-1">Edit Operations</h3>
        <p className="text-xs text-zinc-400">Modify your clips with these editing tools</p>
      </div>

      <ScrollArea className="flex-1 pr-3">
        {/* Cut Section */}
        <div className="mb-3 bg-zinc-800/50 rounded-md overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-2 text-left hover:bg-zinc-700/30"
            onClick={() => toggleSection("cut")}
          >
            <div className="flex items-center">
              <Scissors className="h-4 w-4 text-teal-500 mr-2" />
              <span className="text-xs font-medium text-white">Cut</span>
            </div>
            {expandedSection === "cut" ? (
              <ChevronUp className="h-4 w-4 text-zinc-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            )}
          </button>

          {expandedSection === "cut" && (
            <div className="p-3 pt-1 border-t border-zinc-700/50">
              {/* Cut Range Selection */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-400">Cut Range</span>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={useRangeCut}
                      onChange={(e) => setUseRangeCut(e.target.checked)}
                      className="mr-1.5 h-3 w-3"
                    />
                    <span className="text-xs text-zinc-300">Use Range</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">Start</label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={cutStartTime.toFixed(2)}
                        onChange={(e) => setCutStartTime(Number(e.target.value))}
                        className="w-full h-7 bg-zinc-700/50 text-xs text-white rounded px-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        step="0.1"
                        min="0"
                        max={cutEndTime}
                        disabled={!useRangeCut}
                      />
                      <Clock className="h-3.5 w-3.5 text-zinc-400 ml-1" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1">End</label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={cutEndTime.toFixed(2)}
                        onChange={(e) => setCutEndTime(Number(e.target.value))}
                        className="w-full h-7 bg-zinc-700/50 text-xs text-white rounded px-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        step="0.1"
                        min={cutStartTime}
                        max={maxDuration}
                        disabled={!useRangeCut}
                      />
                      <Clock className="h-3.5 w-3.5 text-zinc-400 ml-1" />
                    </div>
                  </div>
                </div>

                {useRangeCut && (
                  <div className="mb-2">
                    <Slider
                      value={[cutStartTime, cutEndTime]}
                      min={0}
                      max={maxDuration}
                      step={0.1}
                      onValueChange={(values) => {
                        setCutStartTime(values[0])
                        setCutEndTime(values[1])
                      }}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                      <span>{formatTime(0)}</span>
                      <span>{formatTime(maxDuration / 2)}</span>
                      <span>{formatTime(maxDuration)}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 mb-2">
                  <button
                    className="flex-1 h-7 bg-teal-900/30 hover:bg-teal-900/50 text-xs text-white rounded flex items-center justify-center transition-colors"
                    onClick={useRangeCut ? handleRangeCut : onCutAtCurrentTime}
                  >
                    <Scissors className="h-3.5 w-3.5 mr-1.5 text-teal-400" />
                    {useRangeCut ? "Cut Range" : "Cut at Current Position"}
                  </button>

                  {selectedClipData && (
                    <button
                      className="h-7 px-2 bg-zinc-700/50 hover:bg-zinc-700 text-xs text-white rounded flex items-center justify-center transition-colors"
                      onClick={setCutRangeToClip}
                      title="Set range to selected clip"
                    >
                      <ArrowLeftRight className="h-3.5 w-3.5 text-zinc-300" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-zinc-400">Selected Clip</span>
                  <span className="text-xs font-mono bg-zinc-700/50 px-1.5 py-0.5 rounded text-zinc-300">
                    {selectedClip !== null ? `#${selectedClip}` : "None"}
                  </span>
                </div>
                <button
                  className="w-full h-8 bg-red-900/30 hover:bg-red-900/50 text-xs text-white rounded flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={onDeleteSelectedClip}
                  disabled={selectedClip === null}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5 text-red-400" />
                  Delete Selected Clip
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Merge Section */}
        <div className="mb-3 bg-zinc-800/50 rounded-md overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-2 text-left hover:bg-zinc-700/30"
            onClick={() => toggleSection("merge")}
          >
            <div className="flex items-center">
              <Link className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-xs font-medium text-white">Merge</span>
            </div>
            {expandedSection === "merge" ? (
              <ChevronUp className="h-4 w-4 text-zinc-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            )}
          </button>

          {expandedSection === "merge" && (
            <div className="p-3 pt-1 border-t border-zinc-700/50">
              <div className="mb-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-zinc-400">Merge with Next</span>
                  <span className="text-xs font-mono bg-zinc-700/50 px-1.5 py-0.5 rounded text-zinc-300">
                    {selectedClip !== null ? `#${selectedClip}` : "None"}
                  </span>
                </div>
                <button
                  className="w-full h-8 bg-blue-900/30 hover:bg-blue-900/50 text-xs text-white rounded flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={onMergeAdjacentClips}
                  disabled={selectedClip === null}
                >
                  <Link className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
                  Merge with Adjacent Clip
                </button>
              </div>

              <p className="text-xs text-zinc-500 mt-2">
                Select a clip and use this option to merge it with the next clip in the timeline.
              </p>
            </div>
          )}
        </div>

        {/* Update Section */}
        <div className="mb-3 bg-zinc-800/50 rounded-md overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-2 text-left hover:bg-zinc-700/30"
            onClick={() => toggleSection("update")}
          >
            <div className="flex items-center">
              <RefreshCw className="h-4 w-4 text-purple-500 mr-2" />
              <span className="text-xs font-medium text-white">Update</span>
            </div>
            {expandedSection === "update" ? (
              <ChevronUp className="h-4 w-4 text-zinc-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            )}
          </button>

          {expandedSection === "update" && (
            <div className="p-3 pt-1 border-t border-zinc-700/50">
              <div className="mb-3">
                <label className="block text-xs text-zinc-400 mb-1">Clip Name</label>
                <input
                  type="text"
                  value={clipName}
                  onChange={(e) => setClipName(e.target.value)}
                  className="w-full h-8 bg-zinc-700/50 text-xs text-white rounded px-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Enter clip name"
                  disabled={selectedClip === null}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Start Time</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={clipStart}
                      onChange={(e) => setClipStart(Number(e.target.value))}
                      className="w-full h-8 bg-zinc-700/50 text-xs text-white rounded px-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      step="0.1"
                      min="0"
                      disabled={selectedClip === null}
                    />
                    <Clock className="h-3.5 w-3.5 text-zinc-400 ml-1" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">End Time</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={clipEnd}
                      onChange={(e) => setClipEnd(Number(e.target.value))}
                      className="w-full h-8 bg-zinc-700/50 text-xs text-white rounded px-2 focus:outline-none focus:ring-1 focus:ring-teal-500"
                      step="0.1"
                      min="0"
                      disabled={selectedClip === null}
                    />
                    <Clock className="h-3.5 w-3.5 text-zinc-400 ml-1" />
                  </div>
                </div>
              </div>

              <button
                className="w-full h-8 bg-purple-900/30 hover:bg-purple-900/50 text-xs text-white rounded flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleUpdateClip}
                disabled={selectedClip === null || !onUpdateClip}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-purple-400" />
                Update Clip Properties
              </button>
            </div>
          )}
        </div>

        {/* Insert Section */}
        <div className="mb-3 bg-zinc-800/50 rounded-md overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-2 text-left hover:bg-zinc-700/30"
            onClick={() => toggleSection("insert")}
          >
            <div className="flex items-center">
              <PlusSquare className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-xs font-medium text-white">Insert</span>
            </div>
            {expandedSection === "insert" ? (
              <ChevronUp className="h-4 w-4 text-zinc-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            )}
          </button>

          {expandedSection === "insert" && (
            <div className="p-3 pt-1 border-t border-zinc-700/50">
              <div className="mb-3">
                <button
                  className="w-full h-8 bg-green-900/30 hover:bg-green-900/50 text-xs text-white rounded flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-2"
                  onClick={() => onAddClip && onAddClip("between")}
                  disabled={!onAddClip}
                >
                  <PlusSquare className="h-3.5 w-3.5 mr-1.5 text-green-400" />
                  Insert at Current Position
                </button>

                <button
                  className="w-full h-8 bg-green-900/30 hover:bg-green-900/50 text-xs text-white rounded flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => onAddClip && onAddClip("after")}
                  disabled={!onAddClip}
                >
                  <PlusSquare className="h-3.5 w-3.5 mr-1.5 text-green-400" />
                  Add to End of Timeline
                </button>
              </div>

              <p className="text-xs text-zinc-500 mt-2">
                Insert new clips at the current playhead position or add them to the end of your timeline.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
