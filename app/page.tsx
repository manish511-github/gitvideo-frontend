"use client"

import { HomePage } from "@/components/home-page"
import { useEffect, useState } from "react"

export default function MainPage() {
  // Use state to ensure component is only rendered client-side
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Only render the HomePage component after the component has mounted
  // This prevents hydration errors related to buildId and deploymentId
  if (!mounted) {
    return <div className="w-full h-screen bg-background"></div>
  }
  
  return <HomePage initialActivePage="gitvid" initialRepoId={null} />
}

