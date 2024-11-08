// StepperLayout.js
import * as React from "react"
import { StepHeader } from "./Header"
import Import from "./Import"
import Map from "./Map"
import { Button } from "@/components/ui/button"
import Preview from "./Preview"
import { StepperProvider, useStepper } from "../_context/Context"

const steps = [
  { id: 1, name: "Import Process", status: "complete" },
  { id: 2, name: "Map Fields", status: "current" },
  { id: 3, name: "Preview", status: "upcoming" },
]

const StepperLayoutContent: React.FC = () => {
  const { currentStep, goToNextStep, goToPreviousStep } = useStepper()

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Import />
      case 2:
        return <Map />
      case 3:
        return <Preview />
      default:
        return <Import />
    }
  }

  return (
    <div className="w-full mx-auto p-10 bg-white">
      <div className="mb-8">
        <h1 className="text-xl text-center font-semibold mb-6">{steps[currentStep - 1]?.name}</h1>
        <StepHeader steps={steps.map((step, index) => ({
          ...step,
          status: index + 1 < currentStep ? "complete" :
                  index + 1 === currentStep ? "current" : "upcoming"
        }))} />
      </div>

      {renderStepContent()}

      <div className="flex justify-end gap-4 mt-8">
        {currentStep > 1 && (
          <Button variant="outline" onClick={goToPreviousStep}>Back</Button>
        )}
        <Button
          className="bg-primary text-primary-foreground"
          onClick={goToNextStep}
          disabled={currentStep === steps.length+1}
        >
          {currentStep === steps.length ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  )
}

export default function StepperLayout() {
  return (
    <StepperProvider>
      <StepperLayoutContent />
    </StepperProvider>
  )
}
