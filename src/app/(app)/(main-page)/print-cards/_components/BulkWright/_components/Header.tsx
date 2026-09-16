// StepHeader.js
import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function StepHeader({ steps }:any) {
  return (
    <div className="flex items-center justify-center gap-4 px-2">
      {steps.map((step:any, index:any) => (
        <div key={step.id} className="flex items-center  gap-2">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              step.status === "complete" && "bg-green-500",
              step.status === "current" && "bg-primary",
              step.status === "upcoming" && "bg-muted"
            )}
          >
            {step.status === "complete" ? (
              <Check className="h-5 w-5 text-white" />
            ) : (
              <span
                className={cn(
                  "text-sm font-medium",
                  step.status === "current" && "text-white",
                  step.status === "upcoming" && "text-muted-foreground"
                )}
              >
                {step.id}
              </span>
            )}
          </div>
          <span
            className={cn(
              "text-sm font-medium",
              step.status === "current" && "text-primary",
              step.status === "upcoming" && "text-muted-foreground"
            )}
          >
            {step.name}
          </span>
          {index < steps.length - 1 && <div className="h-px w-8 bg-muted" />}
        </div>
      ))}
    </div>
  )
}
