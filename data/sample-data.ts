import type { Branch, MetadataField, AppearanceOption, SortOption, SubActions } from "@/types/repo-types"

// Sample branches and commits data
export const branches: Branch[] = [
  {
    name: "main",
    commits: [
      {
        id: "abc123",
        message: "Updated intro sequence",
        author: "Sarah Chen",
        date: "03/30/2025 at 7:50 PM",
        avatar: "/placeholder.svg?height=40&width=40",
        branch: "main",
        changes: [
          { type: "cut", timestamp: "0:00-0:15" },
          { type: "insert", timestamp: "0:00" },
          { type: "update", timestamp: "0:15-0:30" },
        ],
        videoAsset: {
          id: "A001_A009_08159T_V1",
          name: "A001_A009_08159T_V1-0096.mov",
          thumbnail: "/placeholder.svg?height=80&width=120",
          uploadDate: "03/30/2025 at 7:50 PM",
          uploader: "Manish Singh",
          uploaderAvatar: "/placeholder.svg?height=32&width=32",
          branch: "main",
          size: "118 MB",
          duration: "00:31",
          resolution: "3840 × 2160",
          codec: "HEVC",
          bitrate: "29.98 Mbps",
        },
      },
      {
        id: "def456",
        message: "Fixed audio sync issues",
        author: "Mike Johnson",
        date: "03/30/2025 at 7:50 PM",
        avatar: "/placeholder.svg?height=40&width=40",
        branch: "main",
        changes: [{ type: "update", timestamp: "1:20-2:45" }],
        videoAsset: {
          id: "A001_A014_08159L_V1",
          name: "A001_A014_08159L_V1-0097.mov",
          thumbnail: "/placeholder.svg?height=80&width=120",
          uploadDate: "03/30/2025 at 7:50 PM",
          uploader: "Manish Singh",
          uploaderAvatar: "/placeholder.svg?height=32&width=32",
          branch: "main",
          size: "124 MB",
          duration: "00:35",
          resolution: "3840 × 2160",
          codec: "HEVC",
          bitrate: "29.98 Mbps",
        },
      },
    ],
  },
  {
    name: "feature/new-intro",
    commits: [
      {
        id: "ghi789",
        message: "Added new product features section",
        author: "Alex Kim",
        date: "03/30/2025 at 7:50 PM",
        avatar: "/placeholder.svg?height=40&width=40",
        branch: "feature/new-intro",
        changes: [
          { type: "merge", timestamp: "2:30" },
          { type: "insert", timestamp: "2:30-3:45" },
        ],
        videoAsset: {
          id: "B001_B013_0815DR_V1",
          name: "B001_B013_0815DR_V1-0098.mov",
          thumbnail: "/placeholder.svg?height=80&width=120",
          uploadDate: "03/30/2025 at 7:50 PM",
          uploader: "Manish Singh",
          uploaderAvatar: "/placeholder.svg?height=32&width=32",
          branch: "feature/new-intro",
          size: "156 MB",
          duration: "00:42",
          resolution: "3840 × 2160",
          codec: "HEVC",
          bitrate: "29.98 Mbps",
        },
      },
    ],
  },
  {
    name: "feature/ending",
    commits: [
      {
        id: "jkl012",
        message: "New ending credits sequence",
        author: "Manish Singh",
        date: "03/30/2025 at 7:50 PM",
        avatar: "/placeholder.svg?height=40&width=40",
        branch: "feature/ending",
        changes: [{ type: "insert", timestamp: "4:15-5:00" }],
        videoAsset: {
          id: "B001_B014_0815ST_V1",
          name: "B001_B014_0815ST_V1-0099.mov",
          thumbnail: "/placeholder.svg?height=80&width=120",
          uploadDate: "03/30/2025 at 7:50 PM",
          uploader: "Manish Singh",
          uploaderAvatar: "/placeholder.svg?height=32&width=32",
          branch: "feature/ending",
          size: "132 MB",
          duration: "00:38",
          resolution: "3840 × 2160",
          codec: "HEVC",
          bitrate: "29.98 Mbps",
        },
      },
    ],
  },
]

// Default metadata fields
export const defaultMetadataFields: MetadataField[] = [
  { id: "alphaChannel", label: "Alpha Channel", checked: false },
  { id: "assignee", label: "Assignee", checked: false },
  { id: "audioBitDepth", label: "Audio Bit Depth", checked: false },
  { id: "audioBitRate", label: "Audio Bit Rate", checked: false },
  { id: "audioCodec", label: "Audio Codec", checked: false },
  { id: "bitDepth", label: "Bit Depth", checked: false },
  { id: "bitRate", label: "Bit Rate", checked: false },
  { id: "channels", label: "Channels", checked: false },
  { id: "colorSpace", label: "Color Space", checked: false },
  { id: "commentCount", label: "Comment Count", checked: false },
  { id: "dateUploaded", label: "Date Uploaded", checked: true },
  { id: "duration", label: "Duration", checked: true },
  { id: "dynamicRange", label: "Dynamic Range", checked: false },
  { id: "endTime", label: "End Time", checked: false },
  { id: "pageCount", label: "Page Count", checked: false },
  { id: "rating", label: "Rating", checked: false },
  { id: "releaseDate", label: "Release Date", checked: false },
  { id: "releasePlatform", label: "Release Platform", checked: false },
  { id: "resolutionHeight", label: "Resolution - Height", checked: false },
  { id: "resolutionWidth", label: "Resolution - Width", checked: false },
  { id: "sampleRate", label: "Sample Rate", checked: false },
  { id: "seenBy", label: "Seen By", checked: false },
  { id: "sourceFilename", label: "Source Filename", checked: true },
  { id: "startTime", label: "Start Time", checked: false },
  { id: "status", label: "Status", checked: false },
  { id: "uploader", label: "Uploader", checked: true },
  { id: "videoBitRate", label: "Video Bit Rate", checked: false },
]

// Appearance options
export const appearanceOptions: AppearanceOption[] = [
  { value: "default", label: "Default View" },
  { value: "compact", label: "Compact View" },
  { value: "detailed", label: "Detailed View" },
  { value: "timeline", label: "Timeline View" },
]

// Sort options
export const sortOptions: SortOption[] = [
  { value: "dateDesc", label: "Date (Newest First)" },
  { value: "dateAsc", label: "Date (Oldest First)" },
  { value: "nameAsc", label: "Name (A-Z)" },
  { value: "nameDesc", label: "Name (Z-A)" },
  { value: "authorAsc", label: "Author (A-Z)" },
  { value: "authorDesc", label: "Author (Z-A)" },
]

// Default sub-actions
export const defaultSubActions: SubActions = {
  gitvid: ["Timeline", "Commits", "Branches", "Tags", "Releases"],
  issues: ["Open", "Closed", "Assigned", "Mentioned", "Created"],
  pulls: ["Open", "Closed", "Merged", "Draft", "Requested"],
  projects: ["Board", "Table", "Roadmap", "Insights", "Settings"],
  wiki: ["Home", "Pages", "History", "Edit", "New"],
  security: ["Overview", "Policy", "Advisories", "Dependabot", "Secrets"],
}

