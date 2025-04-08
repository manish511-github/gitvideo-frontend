"use client"

import { useState } from "react"
import { Film, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectCreationSteps } from "@/components/new-project/project-creation-steps"
import { FileUploadArea } from "@/components/new-project/file-upload-area"
import { VideoPreview } from "@/components/new-project/video-preview"
import { ProjectMetadataForm } from "@/components/new-project/project-metadata-form"
import { ProjectTemplates } from "@/components/new-project/project-templates"
import { CreateProjectButton } from "@/components/new-project/create-project-button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface VideoFile {
  file: File
  preview: string
}

export default function NewProjectPage() {
  const [activeTab, setActiveTab] = useState("blank")
  const [step, setStep] = useState(1)
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([])
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isPrivate, setIsPrivate] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const router = useRouter()

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    const newFiles = Array.from(files)
      .filter((file) => file.type.startsWith("video/"))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))

    setVideoFiles((prev) => [...prev, ...newFiles])
  }

  const removeVideo = (index: number) => {
    setVideoFiles((prev) => {
      const updated = [...prev]
      URL.revokeObjectURL(updated[index].preview)
      updated.splice(index, 1)
      return updated
    })
  }

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleCreateProject = async() => {
    try {
      const payload = {
        name: projectName,
        description: description,
        authorId: 1, // Using hardcoded authorId as specified
        status: "Created",
        thumbnail: "https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250", // Default thumbnail
        fileName: videoFiles.length > 0 ? videoFiles[0].file.name.split(".")[0] : "untitled",
        fileType: videoFiles.length > 0 ? `.${videoFiles[0].file.name.split(".").pop()}` : ".mp4",
        tags: tags,
        isPrivate: isPrivate,
        template: activeTab === "template" ? selectedTemplate : "blank",
      }

    } catch (error) {
      
    }
    // Here you would typically send the data to your backend
    // console.log({
    //   projectName,
    //   description,
    //   tags,
    //   isPrivate,
    //   videoFiles: videoFiles.map((v) => v.file.name),
    //   template: activeTab === "template" ? selectedTemplate : "blank",
    // })

    // // Redirect to the new project page or show success message
    // alert("Project created successfully!")
    // // In a real app, you'd use router.push('/projects/new-project-id')
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
        <p className="text-muted-foreground">Start a new video project from scratch or use a template</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ProjectCreationSteps currentStep={step} />

          <Card className="mt-6">
            <CardContent className="p-4">
              <h3 className="font-medium mb-2">Project Summary</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span> {projectName || "Untitled Project"}
                </div>
                <div>
                  <span className="text-muted-foreground">Videos:</span> {videoFiles.length}
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span> {activeTab === "template" ? "Template" : "Blank"}
                </div>
                <div>
                  <span className="text-muted-foreground">Visibility:</span> {isPrivate ? "Private" : "Public"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-xl font-semibold mb-4">Choose Project Type</h2>
                  <Tabs defaultValue="blank" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="blank">Blank Project</TabsTrigger>
                      <TabsTrigger value="template">Use Template</TabsTrigger>
                    </TabsList>
                    <TabsContent value="blank" className="space-y-4">
                      <div className="text-center p-8 border-2 border-dashed rounded-lg">
                        <Film className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">Start from scratch</h3>
                        <p className="text-muted-foreground mt-2">
                          Create a new project with your own videos and settings
                        </p>
                      </div>
                    </TabsContent>
                    <TabsContent value="template">
                      <ProjectTemplates selectedTemplate={selectedTemplate} onSelectTemplate={setSelectedTemplate} />
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold mb-4">Upload Videos</h2>
                  <FileUploadArea onFileUpload={handleFileUpload} />

                  {videoFiles.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-3">Uploaded Videos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {videoFiles.map((video, index) => (
                          <VideoPreview key={index} video={video} onRemove={() => removeVideo(index)} />
                        ))}

                        <button
                          onClick={() => document.getElementById("file-upload")?.click()}
                          className="flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                        >
                          <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                          <span className="text-muted-foreground">Add more videos</span>
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-xl font-semibold mb-4">Project Details</h2>
                  <ProjectMetadataForm
                    projectName={projectName}
                    setProjectName={setProjectName}
                    description={description}
                    setDescription={setDescription}
                    tags={tags}
                    setTags={setTags}
                    isPrivate={isPrivate}
                    setIsPrivate={setIsPrivate}
                  />
                </motion.div>
              )}

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={prevStep} disabled={step === 1}>
                  Back
                </Button>

                {step < 3 ? (
                  <Button onClick={nextStep}>Continue</Button>
                ) : (
                  <CreateProjectButton
                    onClick={handleCreateProject}
                    disabled={!projectName || videoFiles.length === 0}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

