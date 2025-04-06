import Link from "next/link"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { AddRepositoryDialog } from "@/components/add-repository-dialog"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          VideoGit
        </Link>
        <div className="flex-1">
          <Input type="search" placeholder="Search repositories..." className="md:w-[300px] lg:w-[400px]" />
        </div>
        <ThemeToggle />
        <AddRepositoryDialog />
      </div>
    </header>
  )
}

