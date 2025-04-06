"use client"

import { useState, useRef } from "react"

export function useSearch() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Handle search expand/collapse
  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded)
    if (!isSearchExpanded) {
      // Focus the input when expanded
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }

  return {
    isSearchExpanded,
    searchQuery,
    setSearchQuery,
    toggleSearch,
    searchInputRef,
  }
}

