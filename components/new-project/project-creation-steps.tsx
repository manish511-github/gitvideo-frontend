"use client"

import { Check } from "lucide-react"

interface ProjectCreationStepsProps {
  currentStep: "template" | "upload" | "metadata"
}

export function ProjectCreationSteps({ currentStep }: ProjectCreationStepsProps) {
  const steps = [
    { id: "template", name: "Choose Template" },
    { id: "upload", name: "Upload Files" },
    { id: "metadata", name: "Project Details" },
  ]

  const getStepStatus = (step: string) => {
    if (step === "template" && currentStep === "template") return "current"
    if (step === "upload" && currentStep === "upload") return "current"
    if (step === "metadata" && currentStep === "metadata") return "current"
    if (
      (step === "template" && (currentStep === "upload" || currentStep === "metadata")) ||
      (step === "upload" && currentStep === "metadata")
    )
      return "complete"
    return "upcoming"
  }

  return (
    <div className="mt-4">
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li
              key={step.id}
              className={`relative ${stepIdx !== steps.length - 1 ? "pr-8 sm:pr-20" : ""} ${
                stepIdx !== 0 ? "pl-8 sm:pl-20" : ""
              } flex-1 ${stepIdx === 0 ? "flex justify-start" : stepIdx === steps.length - 1 ? "flex justify-end" : "flex justify-center"}`}
            >
              {stepIdx !== 0 && (
                <div
                  className={`absolute top-4 left-0 w-full h-0.5 ${
                    getStepStatus(step.id) === "upcoming" ? "bg-muted" : "bg-primary"
                  }`}
                  aria-hidden="true"
                />
              )}
              <div className="relative flex items-center justify-center">
                <span className="relative flex h-8 w-8 items-center justify-center rounded-full">
                  {getStepStatus(step.id) === "complete" ? (
                    <>
                      <span className="h-8 w-8 flex items-center justify-center rounded-full bg-primary">
                        <Check className="h-5 w-5 text-white" aria-hidden="true" />
                      </span>
                    </>
                  ) : getStepStatus(step.id) === "current" ? (
                    <>
                      <span className="h-8 w-8 flex items-center justify-center rounded-full border-2 border-primary">
                        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="h-8 w-8 flex items-center justify-center rounded-full border-2 border-muted">
                        <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                      </span>
                    </>
                  )}
                </span>
                <span
                  className={`absolute whitespace-nowrap text-xs font-medium ${
                    getStepStatus(step.id) === "upcoming" ? "text-muted-foreground" : "text-foreground"
                  } mt-16`}
                >
                  {step.name}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}

