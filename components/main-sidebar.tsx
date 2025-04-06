"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Mountain,
  Home,
  AlertCircle,
  FolderKanban,
  Compass,
  ShoppingBag,
  FileVideo,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

export function MainSidebar() {
  const [showAllRepos, setShowAllRepos] = useState(false)

  const repositories = [
    {
      name: "Product Demo v2.0",
      description: "Updated product demonstration video",
    },
    {
      name: "Company Overview",
      description: "Main company overview video",
    },
    {
      name: "Tutorial Series",
      description: "Video tutorials for onboarding",
    },
    {
      name: "Marketing Videos",
      description: "Collection of marketing materials",
    },
    {
      name: "Customer Testimonials",
      description: "Video testimonials from customers",
    },
    {
      name: "Product Updates",
      description: "Latest product feature updates",
    },
  ]

  const displayedRepos = showAllRepos ? repositories : repositories.slice(0, 3)

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 p-6">
        <Mountain className="h-6 w-6" />
        <span className="text-lg font-semibold">VideoGit</span>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/issues">
              <AlertCircle className="h-4 w-4" />
              Issues
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/projects">
              <FolderKanban className="h-4 w-4" />
              Projects
            </Link>
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/explore">
              <Compass className="h-4 w-4" />
              Explore
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link href="/marketplace">
              <ShoppingBag className="h-4 w-4" />
              Marketplace
            </Link>
          </Button>
        </div>
        <Separator className="my-4" />
        <div className="space-y-2">
          <div className="text-sm font-medium">Recent Repositories</div>
          <div className="space-y-1">
            {displayedRepos.map((repo) => (
              <Button key={repo.name} variant="ghost" className="w-full justify-start gap-2" asChild>
                <Link href="#">
                  <FileVideo className="h-4 w-4 shrink-0" />
                  <div className="flex flex-col items-start gap-0.5 text-sm">
                    <span className="font-medium">{repo.name}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">{repo.description}</span>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => setShowAllRepos(!showAllRepos)}
          >
            {showAllRepos ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show less repositories
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show more repositories
              </>
            )}
          </Button>
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="text-xs text-muted-foreground">
          © 2024 VideoGit, Inc.
          <div className="mt-1 flex gap-2">
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/security" className="hover:underline">
              Security
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

