import Link from "next/link"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, HelpCircle, Mountain } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Mountain className="h-5 w-5" />
          VideoGit
        </Link>
        <div className="flex-1 flex justify-end gap-4">
          <div className="hidden md:flex">
            <Input type="search" placeholder="Search..." className="w-[200px]" />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="@manish511" />
              <AvatarFallback>MA</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}

