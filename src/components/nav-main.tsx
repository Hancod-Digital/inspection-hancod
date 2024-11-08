"use client"

import { ChevronRight, LucideProps, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import React from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon:  React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const router = usePathname();
  const currentPath = router;
  const [currentActiveDiv, setCurrentActiveDiv] = React.useState(currentPath.split('/')[1])
  return (
    <SidebarGroup> 
                
      <SidebarMenu className="py-4">
        {items.map((item) => (
        <Collapsible key={item.title} defaultOpen={item.isActive}>
        <SidebarMenuItem
          className={`${
            currentActiveDiv === item.title ? 'border-r-[3px] border-primary' : ''
          }`}
        >
          {/* Entire button acts as trigger */}
          <CollapsibleTrigger asChild>
            {item?.url ? (
              <Link href={item?.url}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className="h-11 flex items-center justify-between w-full px-4"
                >
                  <div className="flex items-center">
                    {/* {item.icon} */}
                    <span className="font-medium text-[#75829C] ml-2">{item.title}</span>
                  </div>
                  {item.items?.length && (
                    <ChevronRight
                      className="transition-transform duration-200"
                    />
                  )}
                </SidebarMenuButton>
              </Link>
            ): (
              <SidebarMenuButton
                  tooltip={item.title}
                  className="h-11 flex items-center justify-between w-full px-4"
                >
                  <div className="flex items-center">
                    {/* {item.icon} */}
                    <span className="font-medium text-[#75829C] ml-2">{item.title}</span>
                  </div>
                  {item.items?.length && (
                    <ChevronRight
                      className="transition-transform duration-200"
                    />
                  )}
                </SidebarMenuButton>
            )}
          </CollapsibleTrigger>

          {item.items?.length ? (
            <CollapsibleContent className="mt-2">
              <SidebarMenuSub>
                {item.items.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.title}>
                    <SidebarMenuSubButton asChild className="h-9 px-4">
                      <Link href={subItem.url} className="flex items-center w-full">
                        {/* {subItem.icon && <span className="mr-2">{subItem.icon}</span>} */}
                        <span className="font-medium text-[13px] text-[#75829C]">
                          {subItem.title}
                        </span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          ) : null}
        </SidebarMenuItem>
      </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
