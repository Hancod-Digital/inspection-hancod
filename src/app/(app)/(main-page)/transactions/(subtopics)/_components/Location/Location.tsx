"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { PlusIcon } from "lucide-react"
import EquipmentDetailsForm from "./location-add-form"

export default function AddLocationButton() {
  const [open, setOpen] = useState(false)
  const [isSite, setIsSite] = useState(false)
  const [isArea, setIsArea] = useState(false)
  const [isChanged, setIsChanged] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="absolute bg-primary text-white font-bold right-0 top-0" variant="outline">
          <PlusIcon className="h-4 w-4" />
         
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <EquipmentDetailsForm
          onClose={handleClose}
       //   setIsSite={setIsSite}
       //   setIsArea={setIsArea}
          setIsChanged={setIsChanged}
          isChanged={isChanged}
        />
      </DialogContent>
    </Dialog>
  )
}
