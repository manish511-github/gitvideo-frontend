"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import type { ProjectTemplate } from "./new-project-dialog"

interface TemplateCardProps {
  template: ProjectTemplate
  isSelected: boolean
  onClick: () => void
}

export function TemplateCard({ template, isSelected, onClick }: TemplateCardProps) {
  return (
    <Card
      className={`overflow-hidden cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-primary" : "border-muted/40"
      }`}
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={template.thumbnail || "/placeholder.svg"}
          alt={template.name}
          className="object-cover w-full h-full"
        />
        {isSelected && (
          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
            <div className="bg-primary text-primary-foreground rounded-full p-1">
              <Check className="h-4 w-4" />
            </div>
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-sm">{template.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          <Badge variant="outline" className="text-[9px] px-1 py-0 font-normal">
            {template.settings.resolution}
          </Badge>
          <Badge variant="outline" className="text-[9px] px-1 py-0 font-normal">
            {template.settings.frameRate} fps
          </Badge>
          <Badge variant="outline" className="text-[9px] px-1 py-0 font-normal">
            {template.settings.aspectRatio}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

