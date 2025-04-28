"use client"

import type React from "react"
import {
  Film,
  Scissors,
  Type,
  Music,
  Paintbrush,
  ContrastIcon as Transition,
  ImageIcon,
  Zap,
  Sliders,
  Sparkles,
  Palette,
  FolderOpen,
  Settings,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { ToolbarSidebarProps, TabId } from "./types"

export const ToolbarSidebar: React.FC<ToolbarSidebarProps> = ({ activeTab, onTabChange }) => {
  // Get icon for sidebar item
  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "clips":
        return <Film className="h-4 w-4" />
      case "cut":
        return <Scissors className="h-4 w-4" />
      case "text":
        return <Type className="h-4 w-4" />
      case "audio":
        return <Music className="h-4 w-4" />
      case "effects":
        return <Paintbrush className="h-4 w-4" />
      case "transitions":
        return <Transition className="h-4 w-4" />
      case "images":
        return <ImageIcon className="h-4 w-4" />
      case "animations":
        return <Zap className="h-4 w-4" />
      case "adjustments":
        return <Sliders className="h-4 w-4" />
      case "ai":
        return <Sparkles className="h-4 w-4" />
      case "chroma":
        return <Palette className="h-4 w-4" />
      case "files":
        return <FolderOpen className="h-4 w-4" />
      case "export":
        return <Settings className="h-4 w-4" />
      default:
        return <Film className="h-4 w-4" />
    }
  }

  const tabs: { id: TabId; label: string; desc: string }[] = [
    { id: "clips", label: "Clips", desc: "Manage clips" },
    { id: "cut", label: "Cut/Trim", desc: "Cut, trim videos" },
    { id: "text", label: "Text", desc: "Add text, captions" },
    { id: "audio", label: "Audio", desc: "Add audio" },
    { id: "effects", label: "Effects", desc: "Apply effects" },
    { id: "transitions", label: "Transitions", desc: "Add transitions" },
    { id: "images", label: "Images", desc: "Insert images" },
    { id: "animations", label: "Animations", desc: "Add animations" },
    { id: "adjustments", label: "Adjustments", desc: "Adjust video" },
    { id: "ai", label: "AI", desc: "AI features" },
    { id: "export", label: "Export", desc: "Export video" },
  ]

  return (
    <div className="w-12 bg-black border-r border-zinc-800 flex flex-col items-center py-3">
      <TooltipProvider>
        {tabs.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <button
                className={`w-8 h-8 rounded-md flex items-center justify-center mb-1 ${
                  activeTab === item.id ? "bg-teal-500 text-black" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
                onClick={() => onTabChange(item.id)}
              >
                {getTabIcon(item.id)}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex flex-col py-1 px-2">
              <p className="text-xs font-medium">{item.label}</p>
              <p className="text-[10px] text-zinc-400">{item.desc}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}
