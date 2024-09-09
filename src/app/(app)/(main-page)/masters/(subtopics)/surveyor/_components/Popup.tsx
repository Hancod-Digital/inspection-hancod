import { useState } from 'react'
import { X } from 'lucide-react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function Component() {
  const [open, setOpen] = useState(true)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] p-0">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-lg font-semibold">Add Surveyor Competency</h2>
            
          </div>
          <div className="space-y-4">
            <div className="space-y-2 grid grid-cols-2 ">
              <Label htmlFor="competency" className="text-sm mt-3 font-medium ">
                Competency:<span className="text-red-500">*</span>
              </Label>
              <Input id="competency" className="w-full" />
            </div>
            <div className="space-y-2 grid grid-cols-2 ">
              <Label htmlFor="validity" className="text-sm mt-3 font-medium">
                Validity:
              </Label>
              <Input id="validity" className="w-full" />
            </div>
            <div className="flex space-x-2">
              <Input className="flex-grow" placeholder="No file chosen" readOnly />
              <Button variant="secondary" className="whitespace-nowrap">Upload Attachment</Button>
            </div>
          </div>
          <Button className="w-full bg-[#8E2E47] hover:bg-[#7D2940] text-white">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}