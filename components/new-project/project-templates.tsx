"use client"
import type { ProjectTemplate } from "./new-project-dialog"
import { TemplateCard } from "./template-card"

interface ProjectTemplatesProps {
  onSelectTemplate: (template: ProjectTemplate) => void
  selectedTemplate: ProjectTemplate | null
}

export function ProjectTemplates({ onSelectTemplate, selectedTemplate }: ProjectTemplatesProps) {
  const templates: ProjectTemplate[] = [
    {
      id: "blank",
      name: "Blank Project",
      description: "Start from scratch with a blank project",
      thumbnail: "/placeholder.svg?height=120&width=200",
      settings: {
        resolution: "1920x1080",
        frameRate: 30,
        aspectRatio: "16:9",
      },
    },
    {
      id: "social-media",
      name: "Social Media",
      description: "Optimized for social media platforms",
      thumbnail: "/placeholder.svg?height=120&width=200",
      settings: {
        resolution: "1080x1080",
        frameRate: 30,
        aspectRatio: "1:1",
      },
    },
    {
      id: "presentation",
      name: "Presentation",
      description: "Perfect for business presentations",
      thumbnail: "/placeholder.svg?height=120&width=200",
      settings: {
        resolution: "1920x1080",
        frameRate: 24,
        aspectRatio: "16:9",
      },
    },
    {
      id: "cinematic",
      name: "Cinematic",
      description: "Film-like quality for professional videos",
      thumbnail: "/placeholder.svg?height=120&width=200",
      settings: {
        resolution: "3840x2160",
        frameRate: 24,
        aspectRatio: "21:9",
      },
    },
    {
      id: "youtube",
      name: "YouTube",
      description: "Optimized for YouTube uploads",
      thumbnail: "/placeholder.svg?height=120&width=200",
      settings: {
        resolution: "1920x1080",
        frameRate: 30,
        aspectRatio: "16:9",
      },
    },
    {
      id: "mobile",
      name: "Mobile",
      description: "Vertical format for mobile viewing",
      thumbnail: "/placeholder.svg?height=120&width=200",
      settings: {
        resolution: "1080x1920",
        frameRate: 30,
        aspectRatio: "9:16",
      },
    },
  ]

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Choose a template to get started or create a blank project.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={selectedTemplate?.id === template.id}
            onClick={() => onSelectTemplate(template)}
          />
        ))}
      </div>
    </div>
  )
}

