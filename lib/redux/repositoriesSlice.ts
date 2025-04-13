import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

// Define types for our state
export interface Repository {
    id: number
    name: string
    description: string
    status: string
    thumbnail: string
    duration: string
    commits: number
    authorId: number
    createdAt: string
    updatedAt: string
    branches: Branch[]
    videos: any[]
  }
  
export interface Branch {
    id: number
    name: string
    repositoryId: number
    createdAt: string
    commits: Commit[]
  }



export interface Commit {
    id: number
    commitId: string
    description: string
    changes: any
    branchId: number
    videoId: number
    parentCommitId: number | null
    createdAt: string
  }

  interface RepositoriesState {
    items : Repository[]
    status : "idle" | "loading" | "succeeded" | "failed",
    error : string | null,
    selectedRepository : Repository | null,
    selectedBranch : string,
  }
  const initialState : RepositoriesState = {
    items : [],
    status : "idle",
    error : null,
    selectedRepository : null,
    selectedBranch : "main",

  }

  // Create async thunk for fetching repositories
export const fetchRepositories = createAsyncThunk("repositories/fetchRepositories", async() => {
    const response = await fetch("http://localhost:4300/api/repo/repos")
    const data = await response.json()
    if (!response.ok)
    {
        throw new Error(data.message || "Failed to fetch repositories")
    }
    return data.data
})

const repositoriesSlice = createSlice({
    name : "repositories",
    initialState,
    reducers : {
        setSelectedRepository : (state, action: PayloadAction<number>) => {
            const repository = state.items.find((repo) => repo.id == action.payload)
            state.selectedRepository = repository || null

            // Set default branch if repository exists and has branches
            if (repository && repository.branches && repository.branches.length > 0) {
                state.selectedBranch = repository.branches[0].name
              } else {
                state.selectedBranch = "main"
              }
        },

        setSelectedBranch: (state, action: PayloadAction<string>) => {
            state.selectedBranch = action.payload
          },
        updateRepositoryStatus: (state, action:PayloadAction<{repoId: Number; status: string}>) =>{
          const repo = state.items.find((r)=> r.id == action.payload.repoId)
          if (repo){
            debugger
            repo.status =action.payload.status
          }

        }
    },
    extraReducers : (builder) => {
        builder
        .addCase(fetchRepositories.pending, (state)=>{
            state.status = "loading"
        })
        .addCase(fetchRepositories.fulfilled, (state, action)=>{
            state.status = "succeeded"
            state.items = action.payload
            state.error = null
        })
        .addCase(fetchRepositories.rejected, (state, action) => {
            state.status = "failed"
            state.error = action.error.message || "Failed to fetch repositories"
          })
    }

})

export const { setSelectedRepository, setSelectedBranch,updateRepositoryStatus } = repositoriesSlice.actions
export default repositoriesSlice.reducer