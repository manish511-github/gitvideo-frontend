"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "@/components/ui/resizable"
import { VideoEditorModal } from "@/components/video-editor-modal"
import { RepoHeader } from "@/components/navigation/repo-header"
import { NavSidebar } from "@/components/navigation/nav-sidebar"
import { BranchPanel } from "@/components/branch/branch-panel"
import { Toolbar } from "@/components/content/toolbar"
import { GridView } from "@/components/content/grid-view"
import { ListView } from "@/components/content/list-view"
import { InfoPanel } from "@/components/info/info-panel"
import { OtherPagesContent } from "@/components/navigation/other-pages-content"
import { RepositoriesPanel } from "@/components/repositories/repositories-panel"
import { useSearch } from "@/hooks/use-search"
import { useMetadata } from "@/hooks/use-metadata"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { appearanceOptions, sortOptions, defaultMetadataFields, defaultSubActions } from "@/data/sample-data"
import { fetchRepositories, setSelectedRepository,setSelectedBranch, Branch } from "@/lib/redux/repositoriesSlice"
import type { Commit, VideoAsset } from "@/types/repo-types"

interface HomePageProps {
  initialActivePage?: string
  initialRepoId?: number | null
}

export function HomePage({ initialActivePage = "gitvid", initialRepoId = null }: HomePageProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const {items, status, selectedRepository, selectedBranch } = useAppSelector((state) => state.repositories)
  
  // State for selected repository
  const [selectedRepoId, setSelectedRepoId] = useState<number | null>(initialRepoId)

  // State for video editing
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedCommit, setSelectedCommit] = useState<Commit | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<VideoAsset | null>(null)

  // State for navigation and UI
  const [showInfoPanel, setShowInfoPanel] = useState(true)
  const [showPreview, setShowPreview] = useState(true)
  const [activePage, setActivePage] = useState<string>(initialActivePage)
  const [showBranchPanel, setShowBranchPanel] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedAppearance, setSelectedAppearance] = useState("default")
  const [selectedSort, setSelectedSort] = useState("dateDesc")

  // State for sub-actions
  const [subActions, setSubActions] = useState(defaultSubActions)
  const [selectedSubAction, setSelectedSubAction] = useState<string>(
    defaultSubActions[initialActivePage]?.[0] || "Timeline",
  )

  // Custom hooks
  const { isSearchExpanded, searchQuery, setSearchQuery, toggleSearch, searchInputRef } = useSearch()
  const { metadataFields, setMetadataFields, visibleFields, setVisibleFields, calculateListViewWidth } =
    useMetadata(defaultMetadataFields)

// Fetch repositories when component mounts
useEffect(() => {
  if (status == "idle")
  {
    dispatch(fetchRepositories())
  }
},[dispatch, status])

// Set selected repository when intialRepoId changes or repositories are loaded
useEffect(() => {
  if (initialRepoId && status == "succeeded")
  {
    dispatch(setSelectedRepository(initialRepoId))
    setSelectedRepoId(initialRepoId)
  }
},[dispatch, initialRepoId, status])

// Get branches and commit for the current repository and branch
const branches: Branch[] = selectedRepository?.branches || []
console.log(branches)


  const currentBranchCommits = branches.find((branch) => branch.name === selectedBranch)?.commits || []
  console.log(currentBranchCommits)
  const filteredCommits = currentBranchCommits.filter(
    (commit) =>
      commit.description?.toLowerCase().includes(searchQuery.toLowerCase()) 
    ||
      commit.videoAsset?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      commit.author?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Find the selected branch object
  const selectedBranchObj = branches.find((branch) => branch.name === selectedBranch)

  // Event handlers
  const handleBranchSelect = (branchName: string) => {
    dispatch(setSelectedBranch(branchName))
    setSelectedAsset(null)
    setSelectedCommit(null)
  }

  const enterEditMode = (commit: Commit) => {
    // Instead of opening the modal, navigate to the video editor page
    const videoSrc = commit.videoAsset?.url || "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    const videoId = commit.id
    router.push(`/video-editor?videoSrc=${encodeURIComponent(videoSrc)}&videoId=${videoId}`)
  }

  const exitEditMode = () => {
    setIsEditMode(false)
  }

  const handleAssetSelect = (commit: Commit) => {
    setSelectedAsset(commit.videoAsset)
    setSelectedCommit(commit)
  }

  // Navigation handlers
  const handleNavClick = (page: string) => {
    setActivePage(page)
    if (subActions[page] && subActions[page].length > 0) {
      setSelectedSubAction(subActions[page][0])
    }

    // Reset repository selection when navigating to a different section
    if (page !== "gitvid" && selectedRepoId !== null) {
      setSelectedRepoId(null)
    }

    // Update URL
    if (page === "gitvid") {
      if (selectedRepoId) {
        router.push(`/repo/${selectedRepoId}`)
      } else {
        router.push("/")
      }
    } else {
      router.push(`/${page.toLowerCase()}`)
    }
  }

  const handleSubActionClick = (action: string) => {
    setSelectedSubAction(action)
  }

  // Repository selection handler
  const handleRepoSelect = (repoId: number) => {
    dispatch(setSelectedRepository(repoId))
    // Reset other states when changing repositories
    setSelectedCommit(null)
    setSelectedAsset(null)
    setIsEditMode(false)
    // Ensure we're on the gitvid page when selecting a repository
    setActivePage("gitvid")
    // Update URL
    router.push(`/repo/${repoId}`)
  }

  // Back to repositories handler
  const handleBackToRepositories = () => {
    setSelectedRepoId(null)
    router.push("/")
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <RepoHeader
        activePage={activePage}
        selectedSubAction={selectedSubAction}
        subActions={subActions}
        handleSubActionClick={handleSubActionClick}
        selectedRepoId={selectedRepoId}
        onBack={handleBackToRepositories}
      />

      {/* Main content area with panels */}
      <div className="flex-grow flex overflow-hidden">
        {/* Navigation Sidebar */}
        <NavSidebar activePage={activePage} handleNavClick={handleNavClick} />

        {/* Branch panel - only render when a repo is selected */}
        {selectedRepoId !== null && (
          <BranchPanel
            branches={branches}
            selectedBranch={selectedBranch}
            showBranchPanel={showBranchPanel}
            handleBranchSelect={handleBranchSelect}
          />
        )}

        {/* Dynamic content based on selected navigation */}
        {activePage !== "gitvid" ? (
          <OtherPagesContent
            activePage={activePage}
            selectedSubAction={selectedSubAction}
            subActions={subActions}
            handleSubActionClick={handleSubActionClick}
          />
        ) : (
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            {/* Main content area */}
            <ResizablePanel defaultSize={60} minSize={40} className="w-full">
              <div className="h-full flex flex-col overflow-hidden relative w-full">
                {selectedRepoId ? (
                  <>
                    {/* Toolbar - only show when a repo is selected */}
                    <Toolbar
                      isSearchExpanded={isSearchExpanded}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      toggleSearch={toggleSearch}
                      viewMode={viewMode}
                      setViewMode={setViewMode}
                      selectedAppearance={selectedAppearance}
                      setSelectedAppearance={setSelectedAppearance}
                      appearanceOptions={appearanceOptions}
                      selectedSort={selectedSort}
                      setSelectedSort={setSelectedSort}
                      sortOptions={sortOptions}
                      metadataFields={metadataFields}
                      setMetadataFields={setMetadataFields}
                      visibleFields={visibleFields}
                      setVisibleFields={setVisibleFields}
                      showBranchPanel={showBranchPanel}
                      setShowBranchPanel={setShowBranchPanel}
                    />

                    {/* Content View (Grid or List) - only show when a repo is selected */}
                    {viewMode === "list" ? (
                      <ListView
                        filteredCommits={filteredCommits}
                        selectedCommit={selectedCommit}
                        handleAssetSelect={handleAssetSelect}
                        enterEditMode={enterEditMode}
                        metadataFields={metadataFields}
                        calculateListViewWidth={calculateListViewWidth}
                      />
                    ) : (
                      <GridView
                        filteredCommits={filteredCommits}
                        selectedCommit={selectedCommit}
                        handleAssetSelect={handleAssetSelect}
                        enterEditMode={enterEditMode}
                      />
                    )}

                    {/* Status bar - only show when a repo is selected */}
                    <div className="px-3 py-1.5 text-[10px] text-muted-foreground border-t flex-shrink-0">
                      {filteredCommits.length} items in {selectedBranch}
                    </div>
                  </>
                ) : (
                  // Show repositories list when no repo is selected
                  <div className="flex flex-col h-full">
                    {/* Removed the New Project button from here */}
                    <RepositoriesPanel onRepoSelect={handleRepoSelect} />
                  </div>
                )}
              </div>
            </ResizablePanel>

            {selectedRepoId && showInfoPanel && (
              <>
                <ResizableHandle withHandle />
                {/* Info Panel - only show when a repo is selected */}
                <ResizablePanel defaultSize={40} minSize={30}>
                  <InfoPanel
                    selectedBranchObj={selectedBranchObj}
                    selectedCommit={selectedCommit}
                    
                    showPreview={showPreview}
                    enterEditMode={enterEditMode}
                  />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        )}
      </div>

      {/* Video Editor Modal */}
      {selectedCommit && <VideoEditorModal commit={selectedCommit} onClose={exitEditMode} isOpen={isEditMode} />}
    </div>
  )
}

