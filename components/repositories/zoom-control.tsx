"use client"

import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

interface ZoomControlProps {
  zoom: number
  onZoomChange: (zoom: number) => void
}

export function ZoomControl({ zoom, onZoomChange }: ZoomControlProps) {
  const decreaseZoom = () => {
    if (zoom > 2) {
      onZoomChange(zoom - 1)
    }
  }

  const increaseZoom = () => {
    if (zoom < 6) {
      onZoomChange(zoom + 1)
    }
  }

  return (
    <div className="flex items-center border-l ml-1 pl-1">
      <Button variant="ghost" size="icon" onClick={decreaseZoom} disabled={zoom <= 2} className="h-7 w-7 rounded-md">
        <Minus className="h-3.5 w-3.5" />
        <span className="sr-only">Decrease zoom</span>
      </Button>
      <Button variant="ghost" size="icon" onClick={increaseZoom} disabled={zoom >= 6} className="h-7 w-7 rounded-md">
        <Plus className="h-3.5 w-3.5" />
        <span className="sr-only">Increase zoom</span>
      </Button>
    </div>
  )
}

