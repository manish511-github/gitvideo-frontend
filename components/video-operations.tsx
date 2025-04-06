"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Scissors, Upload, Replace, Wand2, Palette, Volume2, Clock, Crop, RotateCw } from "lucide-react"
import { SubActionContent } from "@/components/sub-action-content"

export function VideoOperations() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [selectedSubAction, setSelectedSubAction] = useState<string | null>(null)

  const handleActionSelect = (action: string) => {
    setSelectedAction(action)
    setSelectedSubAction(null)
  }

  const handleSubActionSelect = (subAction: string) => {
    setSelectedSubAction(subAction)
  }

  const renderActionContent = () => {
    if (!selectedAction) return null

    switch (selectedAction) {
      case "cut":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={selectedSubAction === "trim" ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => handleSubActionSelect("trim")}
              >
                <Scissors className="h-8 w-8" />
                <span>Trim</span>
              </Button>
              <Button
                variant={selectedSubAction === "split" ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => handleSubActionSelect("split")}
              >
                <Scissors className="h-8 w-8 rotate-90" />
                <span>Split</span>
              </Button>
            </div>
            {selectedSubAction && <SubActionContent type={selectedSubAction} />}
          </div>
        )
      case "insert":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={selectedSubAction === "video" ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => handleSubActionSelect("video")}
              >
                <Upload className="h-8 w-8" />
                <span>Video</span>
              </Button>
              <Button
                variant={selectedSubAction === "audio" ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => handleSubActionSelect("audio")}
              >
                <Volume2 className="h-8 w-8" />
                <span>Audio</span>
              </Button>
            </div>
            {selectedSubAction && <SubActionContent type={selectedSubAction} />}
          </div>
        )
      case "replace":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={selectedSubAction === "section" ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => handleSubActionSelect("section")}
              >
                <Replace className="h-8 w-8" />
                <span>Section</span>
              </Button>
              <Button
                variant={selectedSubAction === "audio" ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => handleSubActionSelect("audio")}
              >
                <Volume2 className="h-8 w-8" />
                <span>Audio</span>
              </Button>
            </div>
            {selectedSubAction && <SubActionContent type={selectedSubAction} />}
          </div>
        )
      case "enhance":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={selectedSubAction === "color" ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => handleSubActionSelect("color")}
              >
                <Palette className="h-8 w-8" />
                <span>Color</span>
              </Button>
              <Button
                variant={selectedSubAction === "ai" ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => handleSubActionSelect("ai")}
              >
                <Wand2 className="h-8 w-8" />
                <span>AI Enhance</span>
              </Button>
            </div>
            {selectedSubAction && <SubActionContent type={selectedSubAction} />}
          </div>
        )
      case "transform":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={selectedSubAction === "crop" ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => handleSubActionSelect("crop")}
              >
                <Crop className="h-8 w-8" />
                <span>Crop</span>
              </Button>
              <Button
                variant={selectedSubAction === "rotate" ? "default" : "outline"}
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => handleSubActionSelect("rotate")}
              >
                <RotateCw className="h-8 w-8" />
                <span>Rotate</span>
              </Button>
            </div>
            {selectedSubAction && <SubActionContent type={selectedSubAction} />}
          </div>
        )
      case "speed":
        return (
          <div className="space-y-4">
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Playback Speed</Label>
                  <span className="text-sm">1.0x</span>
                </div>
                <Slider defaultValue={[100]} max={200} step={10} />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>0.5x</span>
                  <span>1.0x</span>
                  <span>2.0x</span>
                </div>
              </div>

              <RadioGroup defaultValue="entire" className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="entire" id="entire" />
                  <Label htmlFor="entire">Entire video</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="selection" id="selection" />
                  <Label htmlFor="selection">Selected section only</Label>
                </div>
              </RadioGroup>

              <div className="flex justify-between gap-4">
                <Button variant="outline" className="w-full">
                  Reset
                </Button>
                <Button className="w-full">Apply</Button>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="basic" className="flex-grow flex flex-col">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="flex-grow flex flex-col space-y-4 m-0">
          {!selectedAction ? (
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => handleActionSelect("cut")}
              >
                <Scissors className="h-8 w-8" />
                <span>Cut</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => handleActionSelect("insert")}
              >
                <Upload className="h-8 w-8" />
                <span>Insert</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => handleActionSelect("replace")}
              >
                <Replace className="h-8 w-8" />
                <span>Replace</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => handleActionSelect("speed")}
              >
                <Clock className="h-8 w-8" />
                <span>Speed</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-4 flex-grow">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium capitalize">{selectedAction}</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedAction(null)}>
                  Back
                </Button>
              </div>
              <Card className="w-full h-full flex-grow p-4">{renderActionContent()}</Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="advanced" className="flex-grow flex flex-col space-y-4 m-0">
          {!selectedAction ? (
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => handleActionSelect("enhance")}
              >
                <Wand2 className="h-8 w-8" />
                <span>Enhance</span>
              </Button>
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-24 gap-2"
                onClick={() => handleActionSelect("transform")}
              >
                <Crop className="h-8 w-8" />
                <span>Transform</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-4 flex-grow">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium capitalize">{selectedAction}</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedAction(null)}>
                  Back
                </Button>
              </div>
              <Card className="w-full h-full flex-grow p-4">{renderActionContent()}</Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {!selectedAction && (
        <Card className="w-full mt-4 p-4 flex-grow flex items-center justify-center bg-muted/50 rounded-md">
          <div className="text-center w-full">
            <p className="text-muted-foreground">Select an action to edit your video</p>
          </div>
        </Card>
      )}
    </div>
  )
}

