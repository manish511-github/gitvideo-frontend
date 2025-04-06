"use client"

import type React from "react"

import { useState } from "react"
import { EnhancedVideoPlayer } from "@/components/enhanced-video-player"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Sample HLS streams for testing
const HLS_STREAMS = [
  {
    name: "Big Buck Bunny",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    description: "Test stream from Mux",
  },
  {
    name: "Apple Advanced Stream",
    url: "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8",
    description: "Apple's advanced streaming test",
  },
  {
    name: "Sintel Trailer",
    url: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
    description: "Sintel open movie trailer",
  },
  {
    name: "Tears of Steel",
    url: "https://cdn.theoplayer.com/video/tears_of_steel/playlist.m3u8",
    description: "Tears of Steel open movie",
  },
]

export default function PlayerTestPage() {
  const [currentStream, setCurrentStream] = useState(HLS_STREAMS[0])
  const [customUrl, setCustomUrl] = useState("")

  const handleStreamSelect = (stream: (typeof HLS_STREAMS)[0]) => {
    setCurrentStream(stream)
  }

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customUrl.trim()) {
      setCurrentStream({
        name: "Custom Stream",
        url: customUrl,
        description: "User provided URL",
      })
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-white">HLS Video Player Test</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
            <EnhancedVideoPlayer
              videoUrl={currentStream.url}
              title={currentStream.name}
              author="HLS Stream"
              useHls={true}
            />
          </div>

          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle>Currently Playing: {currentStream.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-400">{currentStream.description}</p>
              <p className="mt-2 text-sm text-zinc-500">
                Stream URL: <span className="font-mono text-xs break-all">{currentStream.url}</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-zinc-900 border-zinc-800 text-white mb-6">
            <CardHeader>
              <CardTitle>Test Streams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {HLS_STREAMS.map((stream) => (
                  <Button
                    key={stream.url}
                    variant={currentStream.url === stream.url ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => handleStreamSelect(stream)}
                  >
                    {stream.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader>
              <CardTitle>Custom HLS URL</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCustomUrlSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-url">Enter HLS Stream URL</Label>
                  <Input
                    id="custom-url"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://example.com/stream.m3u8"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
                <Button type="submit" disabled={!customUrl.trim()}>
                  Load Custom Stream
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

