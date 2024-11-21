// StepperLayout.js
'use client'
import * as React from "react"
import { StepHeader } from "./Header"
import Import from "./Import"
import Map from "./Map"
import { Button } from "@/components/ui/button"
import Preview from "./Preview"
import { StepperProvider, useStepper } from "../_context/Context"
import { useState } from "react"

const steps = [
  { id: 1, name: "Import - Select File", status: "complete" },
  { id: 2, name: "Map Fields", status: "current" },
  { id: 3, name: "Preview", status: "upcoming" },
]

const StepperLayoutContent = ( ) => {
  const { currentStep, goToNextStep, goToPreviousStep } = useStepper()
  const [errors, setErrors] = useState({});
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Import />
      case 2:
        return <Map errors={errors} setErrors={setErrors} />
      case 3:
        return <Preview  />
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
          <Button variant="outline" className="hover:bg-secondary hover:text-primary hover:border-primary border bg-primary text-primary-foreground" onClick={goToPreviousStep}>Back</Button>
        )}
        <Button
          className="hover:bg-secondary hover:text-primary hover:border-primary border bg-primary text-primary-foreground"
          onClick={goToNextStep}
          disabled={currentStep === steps.length+1 || Object.keys(errors).length !== 0 && errors.constructor === Object}
        >
          {currentStep === steps.length ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  )
}

export default function StepperLayout({setIsBulk}:{setIsBulk:any}) {
  return (
    <StepperProvider  setIsBulk={setIsBulk}>
      <StepperLayoutContent />
    </StepperProvider>
  )
}
