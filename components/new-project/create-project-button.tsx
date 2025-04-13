"use client"

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { CircularProgress } from "../ui/circular-progress"

interface CreateProjectButtonProps {
  onClick: () => void
  disabled: boolean
  isCreating?: boolean
  progress?: number
}

export function CreateProjectButton({ onClick, disabled, isCreating = false , progress = 0}: CreateProjectButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden group transition-all duration-300 text-xs ${!disabled ? "shadow-md" : ""} bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white`}
    >
      <span className={`flex items-center gap-2 ${isCreating ? "opacity-0" : "opacity-100"} transition-opacity`}>
        Create Project
        <span className="absolute inset-0 w-full h-full bg-white/10 transform translate-x-full group-hover:translate-x-[-100%] transition-transform duration-500"></span>
      </span>

      {isCreating && (
        <span className="absolute inset-0 flex items-center justify-center">
          <CircularProgress progress={progress} size={24} showPercentage = {false}></CircularProgress>
          {/* <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> */}
          Creating...
        </span>
      )}
    </Button>
  )
}

