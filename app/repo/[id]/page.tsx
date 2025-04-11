"use client"

import { use } from "react"
import { HomePage } from "@/components/home-page"

interface RepoPageProps {
  params: Promise<{
    id: string
  }>
}

export default function RepoPage({ params }: RepoPageProps) {
  const { id } = use(params)
  const repoId = Number.parseInt(id, 10)

  if (Number.isNaN(repoId)) {
    return <div>Invalid repository ID</div>
  }

  return <HomePage initialActivePage="gitvid" initialRepoId={repoId} />
}