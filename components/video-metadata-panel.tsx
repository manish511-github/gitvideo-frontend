"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ChevronDown, ChevronUp, Edit2, FileVideo, Info, Save, Star, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoMetadataField {
  key: string
  label: string
  value: string | number | boolean
  editable?: boolean
  type?: "text" | "number" | "date" | "textarea" | "select" | "rating" | "switch"
  options?: { label: string; value: string }[]
  category: "technical" | "content" | "status" | "user"
  icon?: React.ReactNode
}

export function VideoMetadataPanel() {
  const [showAllFields, setShowAllFields] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const [fields, setFields] = useState<VideoMetadataField[]>([
    // Technical fields
    {
      key: "filename",
      label: "Filename",
      value: "B003_B013_0816Y2_V1-0096.mov",
      category: "technical",
      icon: <FileVideo className="h-4 w-4" />,
    },
    { key: "codec", label: "Video Codec", value: "HEVC", category: "technical" },
    { key: "resolution", label: "Resolution", value: "3840 × 2160", category: "technical" },
    { key: "bitRate", label: "Bit Rate", value: "30.13 Mbps", category: "technical" },
    { key: "frameRate", label: "Frame Rate", value: "23.98 fps", category: "technical" },
    { key: "duration", label: "Duration", value: "00:29", category: "technical" },
    { key: "fileSize", label: "File Size", value: "109 MB", category: "technical" },
    { key: "fileType", label: "File Type", value: "Video", category: "technical" },
    { key: "format", label: "Format", value: "MOV", category: "technical" },
    { key: "colorSpace", label: "Color Space", value: "BT709", category: "technical" },
    { key: "dynamicRange", label: "Dynamic Range", value: "BT709", category: "technical" },
    { key: "audioCodec", label: "Audio Codec", value: "AAC", category: "technical" },
    { key: "audioBitRate", label: "Audio Bit Rate", value: "256 kbps", category: "technical" },
    { key: "audioBitDepth", label: "Audio Bit Depth", value: "24-bit", category: "technical" },
    { key: "sampleRate", label: "Sample Rate", value: "48 kHz", category: "technical" },
    { key: "channels", label: "Channels", value: "Stereo", category: "technical" },
    { key: "alphaChannel", label: "Alpha Channel", value: false, type: "switch", category: "technical" },

    // Content fields
    { key: "title", label: "Title", value: "Product Demo Scene", editable: true, type: "text", category: "content" },
    {
      key: "description",
      label: "Description",
      value: "Opening sequence for the product demonstration",
      editable: true,
      type: "textarea",
      category: "content",
    },
    {
      key: "keywords",
      label: "Keywords",
      value: "demo, product, intro",
      editable: true,
      type: "text",
      category: "content",
    },
    {
      key: "notes",
      label: "Notes",
      value: "Need to adjust color grading",
      editable: true,
      type: "textarea",
      category: "content",
    },
    {
      key: "rating",
      label: "Rating",
      value: 3,
      editable: true,
      type: "rating",
      category: "content",
      icon: <Star className="h-4 w-4" />,
    },
    { key: "finalEdit", label: "Final Edit", value: false, editable: true, type: "switch", category: "content" },

    // Status fields
    {
      key: "status",
      label: "Status",
      value: "In Progress",
      editable: true,
      type: "select",
      category: "status",
      options: [
        { label: "In Progress", value: "In Progress" },
        { label: "Review", value: "Review" },
        { label: "Approved", value: "Approved" },
        { label: "Published", value: "Published" },
      ],
    },
    { key: "uploadDate", label: "Date Uploaded", value: "03/30/2025 at 7:50 PM", category: "status" },
    {
      key: "releaseDate",
      label: "Release Date",
      value: "04/15/2025",
      editable: true,
      type: "date",
      category: "status",
    },
    {
      key: "releasePlatform",
      label: "Release Platform",
      value: "YouTube",
      editable: true,
      type: "select",
      category: "status",
      options: [
        { label: "YouTube", value: "YouTube" },
        { label: "Vimeo", value: "Vimeo" },
        { label: "Website", value: "Website" },
        { label: "Social Media", value: "Social Media" },
      ],
    },

    // User fields
    { key: "uploader", label: "Uploader", value: "Manish Singh", category: "user", icon: <User className="h-4 w-4" /> },
    { key: "assignee", label: "Assignee", value: "Manish Singh", editable: true, type: "text", category: "user" },
    { key: "seenBy", label: "Seen By", value: "Manish Singh", category: "user" },
  ])

  const handleFieldChange = (key: string, value: string | number | boolean) => {
    setFields(fields.map((field) => (field.key === key ? { ...field, value } : field)))
  }

  const toggleEditMode = () => {
    setEditMode(!editMode)
  }

  const saveChanges = () => {
    // Here you would typically save the changes to your backend
    setEditMode(false)
  }

  const filteredFields = fields.filter((field) => {
    if (activeTab === "all") return true
    if (activeTab === "technical") return field.category === "technical"
    if (activeTab === "content") return field.category === "content"
    if (activeTab === "status") return field.category === "status" || field.category === "user"
    return true
  })

  const displayedFields = showAllFields ? filteredFields : filteredFields.slice(0, 12)

  const renderFieldValue = (field: VideoMetadataField) => {
    if (!editMode || !field.editable) {
      if (field.type === "switch" || typeof field.value === "boolean") {
        return <Badge variant={field.value ? "default" : "outline"}>{field.value ? "Yes" : "No"}</Badge>
      }
      if (field.type === "rating") {
        return (
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-4 w-4",
                  Number(field.value) >= star ? "fill-primary text-primary" : "text-muted-foreground",
                )}
              />
            ))}
          </div>
        )
      }
      return <span className="text-sm">{field.value}</span>
    }

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            value={field.value as string}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className="h-20 resize-none"
          />
        )
      case "select":
        return (
          <Select value={field.value as string} onValueChange={(value) => handleFieldChange(field.key, value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={field.label} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "date":
        return (
          <Input
            type="date"
            value={field.value as string}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
          />
        )
      case "rating":
        return (
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleFieldChange(field.key, star)}
                className="focus:outline-none"
              >
                <Star
                  className={cn(
                    "h-5 w-5 cursor-pointer",
                    Number(field.value) >= star
                      ? "fill-primary text-primary"
                      : "text-muted-foreground hover:text-primary/70",
                  )}
                />
              </button>
            ))}
          </div>
        )
      case "switch":
        return (
          <Switch
            checked={field.value as boolean}
            onCheckedChange={(checked) => handleFieldChange(field.key, checked)}
          />
        )
      default:
        return (
          <Input
            type={field.type || "text"}
            value={field.value as string}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
          />
        )
    }
  }

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Info className="h-5 w-5" />
          Video Metadata
        </CardTitle>
        <div className="flex items-center gap-2">
          {editMode ? (
            <Button size="sm" onClick={saveChanges}>
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={toggleEditMode}>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-6 flex-1 overflow-hidden min-h-0 flex flex-col w-full">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0 w-full">
            <ScrollArea className="flex-1 w-full">
              <div className="grid gap-6 p-4 w-full">
                {displayedFields.map((field, index) => (
                  <div key={field.key} className="space-y-2 w-full">
                    <div className="flex items-center justify-between w-full">
                      <Label htmlFor={field.key} className="text-sm font-medium flex items-center gap-2">
                        {field.icon}
                        {field.label}
                        {field.editable && editMode && (
                          <Badge variant="outline" className="ml-2 text-xs font-normal">
                            Editable
                          </Badge>
                        )}
                      </Label>
                    </div>
                    <div id={field.key} className="w-full">
                      {renderFieldValue(field)}
                    </div>
                    {index < displayedFields.length - 1 && <Separator className="mt-4 w-full" />}
                  </div>
                ))}
              </div>
            </ScrollArea>

            {filteredFields.length > 12 && (
              <Button
                variant="ghost"
                className="w-full mt-4 text-muted-foreground"
                onClick={() => setShowAllFields(!showAllFields)}
              >
                {showAllFields ? (
                  <>
                    <ChevronUp className="mr-2 h-4 w-4" />
                    Show fewer fields
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Show all fields ({filteredFields.length})
                  </>
                )}
              </Button>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

