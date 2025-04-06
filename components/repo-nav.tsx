"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Code2,
  CircleDot,
  GitPullRequest,
  Play,
  FolderKanban,
  BookOpen,
  Shield,
  LineChart,
  Settings,
} from "lucide-react"

export function RepoNav() {
  const pathname = usePathname()

  const tabs = [
    {
      name: "GitVid",
      href: "/repo/[id]",
      icon: Code2,
    },
    {
      name: "Issues",
      href: "/repo/[id]/issues",
      icon: CircleDot,
    },
    {
      name: "Pull requests",
      href: "/repo/[id]/pulls",
      icon: GitPullRequest,
    },
    {
      name: "Actions",
      href: "/repo/[id]/actions",
      icon: Play,
    },
    {
      name: "Projects",
      href: "/repo/[id]/projects",
      icon: FolderKanban,
    },
    {
      name: "Wiki",
      href: "/repo/[id]/wiki",
      icon: BookOpen,
    },
    {
      name: "Security",
      href: "/repo/[id]/security",
      icon: Shield,
    },
    {
      name: "Insights",
      href: "/repo/[id]/insights",
      icon: LineChart,
    },
    {
      name: "Settings",
      href: "/repo/[id]/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="border-b bg-background">
      <div className="container flex h-12 max-w-full items-center px-4">
        <div className="flex items-center gap-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = pathname.startsWith(tab.href.replace("[id]", "1"))

            return (
              <Link
                key={tab.name}
                href={tab.href.replace("[id]", "1")}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors hover:border-muted-foreground/30",
                  isActive ? "border-primary text-primary" : "border-transparent text-muted-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </Link>
            )
          })}
        </div>
      </div>
      <div className="mx-auto max-w-[1200px] border-b" />
    </div>
  )
}

