import type React from "react"
import { cn } from "@/lib/utils"

interface CircularProgressProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
  bgColor?: string
  progressColor?: string
  showPercentage?: boolean
  children?: React.ReactNode
}

export function CircularProgress({
  progress,
  size = 36,
  strokeWidth = 3,
  className,
  bgColor = "rgba(255, 255, 255, 0.2)",
  progressColor = "currentColor",
  showPercentage = false,
  children,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        {/* Background circle */}
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={bgColor} strokeWidth={strokeWidth} />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>

      {/* Content inside the circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showPercentage && <span className="text-xs font-medium">{Math.round(progress)}%</span>)}
      </div>
    </div>
  )
}
