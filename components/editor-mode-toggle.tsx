"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Maximize2, Minimize2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface EditorModeToggleProps {
  isEditorMode: boolean
  onToggle: (value: boolean) => void
}

export function EditorModeToggle({ isEditorMode, onToggle }: EditorModeToggleProps) {
  const [showDialog, setShowDialog] = useState(false)

  const handleToggle = (value: boolean) => {
    onToggle(value)
    setShowDialog(false)
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant={isEditorMode ? "default" : "outline"} size="sm" className="gap-2">
          {isEditorMode ? (
            <>
              <Minimize2 className="h-4 w-4" />
              Exit Editor Mode
            </>
          ) : (
            <>
              <Maximize2 className="h-4 w-4" />
              Enter Editor Mode
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditorMode ? "Exit Editor Mode?" : "Enter Editor Mode?"}</DialogTitle>
          <DialogDescription>
            {isEditorMode
              ? "You'll return to the standard repository view with all features visible."
              : "Editor Mode focuses on the video with minimal distractions, perfect for editing and reviewing."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 py-4">
          <Switch
            id="editor-mode-dialog"
            checked={!isEditorMode}
            onCheckedChange={(checked) => handleToggle(!checked)}
          />
          <Label htmlFor="editor-mode-dialog">{isEditorMode ? "Standard Mode" : "Editor Mode"}</Label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <Button onClick={() => handleToggle(!isEditorMode)}>
            {isEditorMode ? "Exit Editor Mode" : "Enter Editor Mode"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

