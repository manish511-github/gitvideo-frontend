"use client"

import { Button } from "@/components/ui/button"
import { LayoutGrid, List } from "lucide-react"

interface ViewToggleProps {
  view: "grid" | "list"
  onViewChange: (view: "grid" | "list") => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center">
      <Button
        variant={view === "grid" ? "default" : "ghost"}
        size="icon"
        onClick={() => onViewChange("grid")}
        className="h-7 w-7 rounded-md"
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        <span className="sr-only">Grid view</span>
      </Button>
      <Button
        variant={view === "list" ? "default" : "ghost"}
        size="icon"
        onClick={() => onViewChange("list")}
        className="h-7 w-7 rounded-md"
      >
        <List className="h-3.5 w-3.5" />
        <span className="sr-only">List view</span>
      </Button>
    </div>
  )
}

