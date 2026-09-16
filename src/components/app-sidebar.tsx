"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  ChartNoAxesCombined,
  Command,
  Frame,
  LayoutDashboard,
  LifeBuoy,
  Map,
  PieChart,
  RefreshCcw,
  Send,
  Settings2,
  Square,
  SquareTerminal,
  User,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import JobOrdersIcon from "./icons/JobOrdersIcon"
import PrintCardIcon from "./icons/PrintCardIcon"
import { usePathname } from "next/navigation"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = usePathname();
    const currentPath = router;
    const [currentActiveDiv, setCurrentActiveDiv] = React.useState(currentPath.split('/')[1])
    const data = {
      user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
      },
      navMain: [
        {
          title: "Dashboard",
          url: "/dashboard",
          identifier: "dashboard",
          icon: (
            <LayoutDashboard
            fill={currentActiveDiv === "dashboard" ? "currentColor" : "#75829C"}
            className={`me-2 ${currentActiveDiv === "dashboard" ? "text-primary" : "text-[#75829C]"}`}
            size="1.3em"
        />
          ),
        },
        {
          title: "Masters",
          identifier: "masters",
          icon: (
            <User
                fill={currentActiveDiv === "masters" || currentPath.includes('masters') ? "currentColor" : "#75829C"}
                className={`me-2 ${currentActiveDiv === "masters" ? "text-primary" : "text-[#75829C]"}`}
                size="1.3em"
            />
        ),
          items: [
            {
              title: "Equipment",
              identifier: "equipment",
              url: "/masters/equipment",
              icon: <Square
                            style={{ fill: currentPath == '/masters/equipment' ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                            className={`me-2 ${currentPath == '/masters/equipment' ? "text-primary" : "text-[#75829C]"}`}
                            size="0.5em"
                        />,
            },
            {
              title: "Equipment Type",
              identifier: "equipment-type",
              url: "/masters/equipment-type",
              icon: <Square
                            style={{ fill: currentPath == '/masters/equipment' ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                            className={`me-2 ${currentPath == '/masters/equipment' ? "text-primary" : "text-[#75829C]"}`}
                            size="0.5em"
                        />,
            },
            {
              title: "Area",
              identifier: "area",
              url: "/masters/area",
              icon: <Square
                            style={{ fill: currentPath == '/masters/equipment' ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                            className={`me-2 ${currentPath == '/masters/equipment' ? "text-primary" : "text-[#75829C]"}`}
                            size="0.5em"
                        />,
            },
            {
              title: "Site",
              identifier: "site",
              url: "/masters/site",
              icon: <Square
                            style={{ fill: currentPath == '/masters/equipment' ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                            className={`me-2 ${currentPath == '/masters/equipment' ? "text-primary" : "text-[#75829C]"}`}
                            size="0.5em"
                        />,
            },
            {
              title: "Location",
              identifier: "location",
              url: "/masters/location",
              icon: <Square
                            style={{ fill: currentPath == '/masters/equipment' ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                            className={`me-2 ${currentPath == '/masters/equipment' ? "text-primary" : "text-[#75829C]"}`}
                            size="0.5em"
                        />,
            },
            {
              title: "Major Category",
              identifier: "major-category",
              url: "/masters/major-category",
              icon: <Square
                            style={{ fill: currentPath == '/masters/equipment' ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                            className={`me-2 ${currentPath == '/masters/equipment' ? "text-primary" : "text-[#75829C]"}`}
                            size="0.5em"
                        />,
            },
            {
              title: "Minor Category",
              identifier: "minor-category",
              url: "/masters/minor-category",
              icon: <Square
                            style={{ fill: currentPath == '/masters/equipment' ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                            className={`me-2 ${currentPath == '/masters/equipment' ? "text-primary" : "text-[#75829C]"}`}
                            size="0.5em"
                        />,
            },
            {
              title: "Property",
              identifier: "property",
              url: "/masters/property",
              icon: <Square
                            style={{ fill: currentPath == '/masters/equipment' ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                            className={`me-2 ${currentPath == '/masters/equipment' ? "text-primary" : "text-[#75829C]"}`}
                            size="0.5em"
                        />,
            },
            {
              title: "Annexure",
              identifier: "annexure",
              url: "/masters/annexure",
              icon: <Square
                            style={{ fill: currentPath == '/masters/equipment' ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                            className={`me-2 ${currentPath == '/masters/equipment' ? "text-primary" : "text-[#75829C]"}`}
                            size="0.5em"
                        />, 
            },
            {
              title: "Standard",
              identifier: "standard",
              url: "/masters/standard",
              icon: <Square
                            style={{ fill: currentPath == '/masters/equipment' ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                            className={`me-2 ${currentPath == '/masters/equipment' ? "text-primary" : "text-[#75829C]"}`}
                            size="0.5em"
                        />,
            },
            {
              title: "Manufacturer",
              identifier: "manufacturer",
              url: "/masters/manufacturer",
              icon: <Square
                            style={{ fill: currentPath == '/masters/equipment' ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                            className={`me-2 ${currentPath == '/masters/equipment' ? "text-primary" : "text-[#75829C]"}`}
                            size="0.5em"
                        />,
            },
            {
              title: "Owner",
              identifier: "owner",
              url: "/masters/owner",
              icon: <Square
                            style={{ fill: currentPath == '/masters/equipment' ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                            className={`me-2 ${currentPath == '/masters/equipment' ? "text-primary" : "text-[#75829C]"}`}
                            size="0.5em"
                        />,
            },
            {
              title: "Surveyor",
              identifier: "surveyor",
              url: "/masters/surveyor",
              icon: <Square
                            style={{ fill: currentPath == '/masters/equipment' ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                            className={`me-2 ${currentPath == '/masters/equipment' ? "text-primary" : "text-[#75829C]"}`}
                            size="0.5em"
                        />,
            },
            {
              title: "Authority",
              identifier: "authority",
              url: "/masters/authority",
              icon: <Square
                            style={{ fill: currentPath == '/masters/equipment' ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                            className={`me-2 ${currentPath == '/masters/equipment' ? "text-primary" : "text-[#75829C]"}`}
                            size="0.5em"
                        />,
            },
          ],
        },
        {
          title: "Transactions",
          identifier: "transactions",
          icon: (
            <ChartNoAxesCombined
                fill={currentActiveDiv === "transactions" && currentPath.includes('transactions') ? "#962c3d" : "none"}
                className={`me-2 ${currentActiveDiv === "transactions" && currentPath.includes('transactions') ? "text-primary" : "text-[#75829C]"}`}
                size="1.3em"
            />
        ),
          items: [
            {
              title: "Lifting Equipment",
              identifier: "lifting-equipment",
              url: "/transactions/lifting-equipment",
              icon: <Square
                            style={{ fill: currentPath == '/masters/equipment' ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                            className={`me-2 ${currentPath == '/masters/equipment' ? "text-primary" : "text-[#75829C]"}`}
                            size="0.5em"
                        />,
            },
            {
              title: "Lifting Gear Single",
              identifier: "lifting-gear-single",
              url: "/transactions/lifting-gear-single",
              icon: <Square
                            style={{ fill: currentPath == '/masters/equipment' ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                            className={`me-2 ${currentPath == '/masters/equipment' ? "text-primary" : "text-[#75829C]"}`}
                            size="0.5em"
                        />,
            },
            {
              title: "Lifting Gear Multi",
              identifier: "lifting-gear-multi",
              url: "/transactions/lifting-gear-multi",
              icon: <Square
                            style={{ fill: currentPath == '/masters/equipment' ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                            className={`me-2 ${currentPath == '/masters/equipment' ? "text-primary" : "text-[#75829C]"}`}
                            size="0.5em"
                        />,
            },
          ],
        },
        {
          title: "Reports",
          url: "/reports",
          identifier: "reports",
          icon: (
            <RefreshCcw
                className={`me-2 ${currentPath === "/reports" ? "text-primary" : "text-[#75829C]"}`}
                size="1.3em"
            />
        ),
        },
        {
          title: "Job Orders",
          url: "/job-orders",
          identifier: "job-orders",
          icon: <JobOrdersIcon isLive={currentPath === "/job-orders"} />,
        },
        {
          title: "Print Cards",
          url: "/print-cards",
          identifier: "print-cards",
          icon: <PrintCardIcon isLive={currentPath === "/print-cards"} />,
        },
      ],
      navSecondary: [
        {
          title: "Support",
          url: "#",
          icon: LifeBuoy,
        },
        {
          title: "Feedback",
          url: "#",
          icon: Send,
        },
      ],
      projects: [
        {
          name: "Design Engineering",
          url: "#",
          icon: Frame,
        },
        {
          name: "Sales & Marketing",
          url: "#",
          icon: PieChart,
        },
        {
          name: "Travel",
          url: "#",
          icon: Map,
        },
      ],
    };
    
  return (
    <Sidebar variant="inset" className="bg-white" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="  w-full   bg-white   rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <img
                  src="/images/han-inspection.png"
                  className="mr-auto h-14 w-28 object-cover object-center"
                  alt="Han Inspection"
                />
                </div>
               
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain as any} />
         
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  )
}
