"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Branch } from "@/types/repo-types"
import { Folder, GitBranch, Plus, FileVideo, Trash2 } from "lucide-react"

interface BranchPanelProps {
  branches: Branch[]
  selectedBranch: string
  showBranchPanel: boolean
  handleBranchSelect: (branchName: string) => void
}

export function BranchPanel({ branches, selectedBranch, showBranchPanel, handleBranchSelect }: BranchPanelProps) {
  return (
    <div
      className={`w-56 flex-shrink-0 transition-all duration-300 ease-in-out border-r bg-muted/5 ${
        showBranchPanel ? "translate-x-0" : "-translate-x-full w-0"
      }`}
    >
      <div className="h-full w-full overflow-auto">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Branches</h2>
              <Button variant="ghost" size="icon" className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground">
                <Plus className="h-3 w-3" />
                <span className="sr-only">Add branch</span>
              </Button>
            </div>
            <Badge variant="outline" className="px-1.5 py-0 text-[10px] font-normal">
              <GitBranch className="h-2.5 w-2.5 mr-0.5" />
              <span>{branches.length}</span>
            </Badge>
          </div>

          <div className="space-y-0.5">
            {branches.map((branch) => (
              <div key={branch.name} className="text-xs">
                <button
                  className={`flex items-center w-full hover:bg-muted rounded-md p-1.5 transition-colors ${
                    selectedBranch === branch.name ? "bg-muted/80 font-medium" : ""
                  }`}
                  onClick={() => handleBranchSelect(branch.name)}
                >
                  <Folder className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                  <span className="truncate">{branch.name}</span>
                  <Badge variant="outline" className="ml-auto text-[10px] px-1 py-0 font-normal">
                    {branch.commits.length}
                  </Badge>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-b">
          <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Collections</h2>
          <div className="space-y-0.5 text-xs">
            <div className="flex items-center hover:bg-muted rounded-md p-1.5 transition-colors">
              <FileVideo className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <span>Source Assets</span>
            </div>
            <div className="flex items-center hover:bg-muted rounded-md p-1.5 transition-colors">
              <FileVideo className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <span>Final Deliverables</span>
            </div>
          </div>
        </div>

        <div className="p-4 border-t mt-auto">
          <div className="flex items-center hover:bg-muted rounded-md p-1.5 transition-colors text-xs">
            <Trash2 className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
            <span>Recently Deleted</span>
          </div>
        </div>
      </div>
    </div>
  )
}

