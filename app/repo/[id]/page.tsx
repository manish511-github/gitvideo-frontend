"use client"

import { HomePage } from "@/components/home-page"

interface RepoPageProps {
  params: {
    id: string
  }
}

export default function RepoPage({ params }: RepoPageProps) {
  const repoId = Number.parseInt(params.id, 10)
  return <HomePage initialActivePage="gitvid" initialRepoId={repoId} />
}

