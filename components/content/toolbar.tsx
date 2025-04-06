"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { AppearanceOption, SortOption, MetadataField } from "@/types/repo-types"
import { Search, X, Eye, Check, List, LayoutGrid, Filter, SortAsc, PanelLeft, PanelLeftClose } from "lucide-react"

interface ToolbarProps {
  isSearchExpanded: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  toggleSearch: () => void
  viewMode: "grid" | "list"
  setViewMode: (mode: "grid" | "list") => void
  selectedAppearance: string
  setSelectedAppearance: (appearance: string) => void
  appearanceOptions: AppearanceOption[]
  selectedSort: string
  setSelectedSort: (sort: string) => void
  sortOptions: SortOption[]
  metadataFields: MetadataField[]
  setMetadataFields: (fields: MetadataField[]) => void
  visibleFields: string[]
  setVisibleFields: (fields: string[]) => void
  showBranchPanel: boolean
  setShowBranchPanel: (show: boolean) => void
}

export function Toolbar({
  isSearchExpanded,
  searchQuery,
  setSearchQuery,
  toggleSearch,
  viewMode,
  setViewMode,
  selectedAppearance,
  setSelectedAppearance,
  appearanceOptions,
  selectedSort,
  setSelectedSort,
  sortOptions,
  metadataFields,
  setMetadataFields,
  visibleFields,
  setVisibleFields,
  showBranchPanel,
  setShowBranchPanel,
}: ToolbarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Toggle metadata field
  const toggleMetadataField = (id: string) => {
    // Update the metadata fields state
    setMetadataFields(metadataFields.map((field) => (field.id === id ? { ...field, checked: !field.checked } : field)))

    // Immediately update visible fields based on the toggle
    setVisibleFields((prev) => {
      if (prev.includes(id)) {
        return prev.filter((fieldId) => fieldId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  return (
    <div className="border-b flex items-center justify-between bg-muted/5 h-10 flex-shrink-0 pl-10">
      {/* Toggle button for branch panel */}
      <Button
        variant="outline"
        size="sm"
        className="absolute top-2 left-2 z-10 h-7 w-7 p-0"
        onClick={() => setShowBranchPanel(!showBranchPanel)}
      >
        {showBranchPanel ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
      </Button>

      {isSearchExpanded ? (
        <div className="flex items-center w-full p-1.5">
          <Search className="h-3.5 w-3.5 text-muted-foreground ml-2 mr-2 flex-shrink-0" />
          <Input
            ref={searchInputRef}
            placeholder="Search in branch..."
            className="h-7 text-xs border-none shadow-none focus-visible:ring-0 flex-grow"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleSearch}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <>
          <div className={`flex items-center gap-0.5 px-1.5 ${showBranchPanel ? "ml-10" : "ml-8"}`}>
            {/* Appearance dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 px-1.5">
                  <Eye className="h-3 w-3" />
                  <span className="sr-only">Appearance</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search appearance..." className="h-8 text-xs" />
                  <CommandList className="text-xs">
                    <CommandEmpty>No appearance found.</CommandEmpty>
                    <CommandGroup>
                      {appearanceOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          onSelect={() => setSelectedAppearance(option.value)}
                          className="flex items-center gap-2 text-xs py-1.5"
                        >
                          <div
                            className={cn(
                              "flex h-3.5 w-3.5 items-center justify-center rounded-sm border",
                              selectedAppearance === option.value
                                ? "bg-primary border-primary text-primary-foreground"
                                : "opacity-50",
                            )}
                          >
                            {selectedAppearance === option.value && <Check className="h-2.5 w-2.5" />}
                          </div>
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* View mode toggle */}
            <div className="flex items-center border rounded-md h-7">
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 rounded-none ${viewMode === "list" ? "bg-muted" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-3 w-3" />
              </Button>
              <Separator orientation="vertical" className="h-4" />
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 rounded-none ${viewMode === "grid" ? "bg-muted" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-3 w-3" />
              </Button>
            </div>

            {/* Filter dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 px-1.5">
                  <Filter className="h-3 w-3" />
                  <span className="sr-only">Filter</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[240px]" align="start">
                <div className="space-y-2 p-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-xs">Show Fields</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[10px] px-2"
                      onClick={() => {
                        // Toggle all fields
                        const allChecked = metadataFields.every((field) => field.checked)
                        const updatedFields = metadataFields.map((field) => ({
                          ...field,
                          checked: !allChecked,
                        }))
                        setMetadataFields(updatedFields)
                        // Update visible fields accordingly
                        setVisibleFields(!allChecked ? updatedFields.map((f) => f.id) : [])
                      }}
                    >
                      {metadataFields.every((field) => field.checked) ? "Unselect All" : "Select All"}
                    </Button>
                  </div>
                  <Separator className="my-1" />
                  <div className="max-h-[250px] overflow-y-auto pr-1">
                    <div className="grid grid-cols-2 gap-1.5">
                      {metadataFields.map((field) => (
                        <div key={field.id} className="flex items-center space-x-1.5">
                          <Checkbox
                            id={field.id}
                            checked={field.checked}
                            onCheckedChange={() => toggleMetadataField(field.id)}
                            className="h-3 w-3"
                          />
                          <label
                            htmlFor={field.id}
                            className="text-[10px] font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {field.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator className="my-1" />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      className="h-6 text-[10px] px-2"
                      onClick={() => {
                        // Just close the popover
                        const popoverTrigger = document.querySelector(
                          '[data-state="open"][aria-expanded="true"]',
                        ) as HTMLButtonElement
                        if (popoverTrigger) popoverTrigger.click()
                      }}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Sort dropdown */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 px-1.5">
                  <SortAsc className="h-3 w-3" />
                  <span className="sr-only">Sort</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search sort options..." className="h-8 text-xs" />
                  <CommandList className="text-xs">
                    <CommandEmpty>No sort option found.</CommandEmpty>
                    <CommandGroup>
                      {sortOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          onSelect={() => setSelectedSort(option.value)}
                          className="flex items-center gap-2 text-xs py-1.5"
                        >
                          <div
                            className={cn(
                              "flex h-3.5 w-3.5 items-center justify-center rounded-sm border",
                              selectedSort === option.value
                                ? "bg-primary border-primary text-primary-foreground"
                                : "opacity-50",
                            )}
                          >
                            {selectedSort === option.value && <Check className="h-2.5 w-2.5" />}
                          </div>
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center px-1.5">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={toggleSearch}>
              <Search className="h-3 w-3" />
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

