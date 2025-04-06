"use client"

import { useState } from "react"
import type { MetadataField } from "@/types/repo-types"

export function useMetadata(defaultFields: MetadataField[]) {
  const [metadataFields, setMetadataFields] = useState<MetadataField[]>(defaultFields)
  const [visibleFields, setVisibleFields] = useState<string[]>(
    defaultFields.filter((field) => field.checked).map((field) => field.id),
  )

  // Calculate width for list view based on visible fields
  const calculateListViewWidth = () => {
    // Base width for name column and actions column
    const baseWidth = 300
    // Calculate width needed for all visible fields
    const fieldsWidth = metadataFields
      .filter((field) => field.checked)
      .reduce((total, field) => {
        if (field.id === "dateUploaded") return total + 180
        if (field.id === "duration") return total + 80
        if (field.id === "uploader") return total + 140
        if (field.id === "sourceFilename") return total + 120
        return total + 120 // Default width for other fields
      }, 0)

    // Add width for checkbox column and actions column
    return Math.max(800, baseWidth + fieldsWidth + 100)
  }

  return {
    metadataFields,
    setMetadataFields,
    visibleFields,
    setVisibleFields,
    calculateListViewWidth,
  }
}

