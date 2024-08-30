'use client'
import React from 'react'
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown } from "lucide-react"
import { Menu, MenuItem } from '@/components/animated/DropDown'

export function generateFallbackAvatar(name: string): string {
    if (!name) return "";
    return name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
}

export default function Component() {
    const userName = "Fathima Ebrahim"
    const userEmail = "fathima@qube.com"
    const fallbackAvatar = generateFallbackAvatar(userName)
    const [open, setOpen] = React.useState(false)
    return (

        <header className="flex h-16 px-10 items-center justify-between border-b bg-white ">
            <div className="flex items-center gap-4">
                <img src="/images/logo.svg" alt="" />
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage alt={`${userName}'s avatar`} src="/placeholder.svg?height=32&width=32" />
                        <AvatarFallback>{fallbackAvatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">{userName}</span>
                        <span className="text-xs text-gray-500">{userEmail}</span>
                    </div>
                    <Menu
                        label="Options"
                        open={open}
                        setOpen={setOpen}
                    >
                        <MenuItem>Edit</MenuItem>
                        <MenuItem>Share</MenuItem>
                        <MenuItem>Delete</MenuItem>
                        <MenuItem>Report</MenuItem>
                    </Menu>
                </div>
            </div>
        </header>
    )
}




