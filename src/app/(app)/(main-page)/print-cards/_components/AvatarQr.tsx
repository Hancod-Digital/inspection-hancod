"use client"

import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { User } from "lucide-react"

interface AvatarWithTooltipProps {
  item: {
    name?: string
    image?: string
    qr_url?: string
  }
  tooltipPosition?: "top" | "bottom" | "left" | "right"
}

export default function AvatarWithTooltip({ item, tooltipPosition = "top" }: AvatarWithTooltipProps) {
  if (!item) return null

  const initials = item.name
    ? item.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : ""

  return (
    <Popover>
      <PopoverTrigger asChild>
        
          {item.qr_url && <div className={`tooltip ${tooltipPosition}`}>
          <img src={item.qr_url} alt="QR code" className="w-16 h-16" />
          </div>
          }
       
      </PopoverTrigger>
      <PopoverContent side={tooltipPosition} align="center" className="w-auto p-4 flex items-center justify-center">
        {item.qr_url ? (
          <div className="flex flex-col items-center gap-2">
            <div className="relative w-48 h-48 border rounded-md overflow-hidden">
              <Image src={item.qr_url || "/placeholder.svg"} alt="QR Code" fill className="object-contain" />
            </div>
           
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No QR code available</p>
        )}
      </PopoverContent>
    </Popover>
  )
}
