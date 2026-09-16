"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { PlusIcon } from "lucide-react"
import EquipmentDetailsForm from "./equipments-add-form"
import { MasterService } from "@/services/api/masters-service"

export default function AddEquipmentButton() {
  const [open, setOpen] = useState(false)
  const [isManufacturer, setIsManufacturer] = useState(false)
  const [isStandard, setIsStandard] = useState(false)
  const [isLocation, setIsLocation] = useState(false)
  const [changed, setChanged] = useState(false)

  // Option states
  const [minorCategoryOptions, setMinorCategoryOptions] = useState<any[]>([])
  const [supplierOptions, setSupplierOptions] = useState<any[]>([])
  const [standardOptions, setStandardOptions] = useState<any[]>([])
  const [annexureOptions, setAnnexureOptions] = useState<any[]>([])
  const [locationOptions, setLocationOptions] = useState<any[]>([])
  const [ownerOptions, setOwnerOptions] = useState<any[]>([])

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const masterService = new MasterService()
        // Fetch minor category options
        const minorCategories = await masterService.getAllSubtopicDetails('minor_category')
        if (minorCategories) {
          setMinorCategoryOptions(minorCategories.filter((item: any) => item.status === "ACTIVE"))
        }

        // Fetch supplier options
        const suppliers = await masterService.getAllSubtopicDetails('manufacturer')
        if (suppliers) {
          setSupplierOptions(suppliers.filter((item: any) => item.status === "ACTIVE"))
        }

        // Fetch standard options
        const standards = await masterService.getAllSubtopicDetails('standard')
        if (standards) {
          setStandardOptions(standards.filter((item: any) => item.status === "ACTIVE"))
        }

        // Fetch annexure options
        const annexures = await masterService.getAllSubtopicDetails('annexure')
        if (annexures) {
          setAnnexureOptions(annexures.filter((item: any) => item.status === "ACTIVE"))
        }

        // Fetch location options
        const locations = await masterService.getAllSubtopicDetails('location')
        if (locations) {
          setLocationOptions(locations.filter((item: any) => item.status === "ACTIVE"))
        }

        // Fetch owner options
        const owners = await masterService.getAllSubtopicDetails('owner')
        if (owners) {
          setOwnerOptions(owners.filter((item: any) => item.status === "ACTIVE"))
        }
      } catch (error) {
        console.error('Error fetching options:', error)
      }
    }
    fetchOptions()
  }, [changed])

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
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0">
        <div className="overflow-y-auto max-h-[80vh] p-6">
          <EquipmentDetailsForm
            minorCategoryOptions={minorCategoryOptions}
            supplierOptions={supplierOptions}
            standardOptions={standardOptions}
            annexureOptions={annexureOptions}
            locationOptions={locationOptions}
            ownerOptions={ownerOptions}
            onClose={handleClose}
            isManufacturer={isManufacturer}
            isStandard={isStandard}
            isLocation={isLocation}
            setIsManufacturer={setIsManufacturer}
            setIsStandard={setIsStandard}
            setIsLocation={setIsLocation}
            changed={changed}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
