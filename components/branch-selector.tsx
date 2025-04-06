"use client"

import { useState } from "react"
import { Check, ChevronDown, GitBranch, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const branches = [
  {
    value: "main",
    label: "main",
  },
  {
    value: "development",
    label: "development",
  },
  {
    value: "feature/new-intro",
    label: "feature/new-intro",
  },
]

export function BranchSelector() {
  const [open, setOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState(branches[0])

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
            <GitBranch className="mr-2 h-4 w-4" />
            {selectedBranch.label}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search branch..." />
            <CommandList>
              <CommandEmpty>No branch found.</CommandEmpty>
              <CommandGroup>
                {branches.map((branch) => (
                  <CommandItem
                    key={branch.value}
                    value={branch.value}
                    onSelect={() => {
                      setSelectedBranch(branch)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedBranch.value === branch.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {branch.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="sm" className="gap-2">
        <GitBranch className="h-4 w-4" />1 Branch
      </Button>

      <Button variant="outline" size="sm" className="gap-2">
        <Tag className="h-4 w-4" />1 Tag
      </Button>
    </div>
  )
}

