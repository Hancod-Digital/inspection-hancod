'use client'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '@/context/LoadingContext'; // Import the loading context

import JobOrdersIcon from "@/components/icons/JobOrdersIcon";
import {
    PanelRightClose as MenuBarIcon,
    LayoutDashboard,
    User,
    ChartNoAxesCombined,
    RefreshCcw,
    Square,
    ChevronDown,
    ChevronRight
} from "lucide-react";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import AnimateButton from "../animated/AnimateButton";
import { LoadingProvider } from '@/context/LoadingContext';
import { flushSync } from 'react-dom';
import PrintCardIcon from '../icons/PrintCardIcon';

type Option = {
    type?: string;
    url?: string;
    subtopics?: Option[];
    title?: string;
    identifier?: string;
    icon: JSX.Element;
};

export default function Sidebar() {
    const router = usePathname();
    const currentPath = router;
    const [currentActiveDiv, setCurrentActiveDiv] = useState(currentPath.split('/')[1])
    const { setLoading } = useLoading();  // Access setLoading from the context
    useLayoutEffect(() => {
           
            setLoading(false);
      
    }, [currentActiveDiv]);
    useEffect(() => {
        const timer = setTimeout(() => {
          setLoading(false);
        }, 0);
        return () => clearTimeout(timer);
      }, [currentActiveDiv]);
    const options: Option[] = [
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
            subtopics: [
                {
                    title: "Equipment",
                    identifier: "equipment",
                    icon: <Square
                        style={{ fill: currentPath == '/masters/equipment' ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                        className={`me-2 ${currentPath == '/masters/equipment' ? "text-primary" : "text-[#75829C]"}`}
                        size="0.5em"
                    />,
                    url: "/masters/equipment",
                },
                {
                    title: "Equipment Type",
                    identifier: "equipment-type",
                    icon: <Square
                        style={{ fill: currentPath.includes('equipment-type') ? "#962c3d" : "#75829C" ,width:'0.6em',height:'0.6em'}}
                        className={`me-2 ${currentPath.includes('equipment-type') ? "text-primary" : "text-[#75829C]"}`}
                        size="0.5em"
                    />,
                    url: "/masters/equipment-type",
                },
                {
                    title: "Area",
                    identifier: "area",
                    icon: <Square
                        style={{ fill: currentPath.includes('area') ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em'}}
                        className={`me-2 ${currentPath.includes('area') ? "text-primary" : "text-[#75829C]"}`}
                        size="0.5em"
                    />,
                    url: "/masters/area",
                },
                {
                    title: "Site",
                    identifier: "site",
                    icon: <Square
                        style={{ fill: currentPath.includes('site') ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                        className={`me-2 ${currentPath.includes('site') ? "text-primary" : "text-[#75829C]"}`}
                        size="0.5em"
                    />,
                    url: "/masters/site",
                },
                {
                    title: "Location",
                    identifier: "location",
                    icon: <Square
                        style={{ fill: currentPath.includes('location') ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                        className={`me-2 ${currentPath.includes('location') ? "text-primary" : "text-[#75829C] "}`}
                        size="0.5em"
                    />,
                    url: "/masters/location",
                },
                {
                    title: "Major Category",
                    identifier: "major-category",
                    icon: <Square
                        style={{ fill: currentPath.includes('major-category') ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em'}}
                        className={`me-2 ${currentPath.includes('major-category') ? "text-primary" : "text-[#75829C]"}`}
                        size="0.5em"
                    />,
                    url: "/masters/major-category",
                },
                {
                    title: "Minor Category",
                    identifier: "minor-category",
                    icon: <Square
                        style={{ fill: currentPath.includes('minor-category') ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                        className={`me-2 ${currentPath.includes('minor-category') ? "text-primary" : "text-[#75829C]"}`}
                        size="0.5em"
                    />,
                    url: "/masters/minor-category",
                },
                {
                    title: "Property",
                    identifier: "property",
                    icon: <Square
                        style={{ fill: currentPath.includes('property') ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                        className={`me-2 ${currentPath.includes('property') ? "text-primary" : "text-[#75829C]"}`}
                        size="0.5em"
                    />,
                    url: "/masters/property",
                },
                {
                    title: "Annexure",
                    identifier: "annexure",
                    icon: <Square
                        style={{ fill: currentPath.includes('annexure') ? "#962c3d" : "#75829C" ,width:'0.6em',height:'0.6em'}}
                        className={`me-2 ${currentPath.includes('annexure') ? "text-primary" : "text-[#75829C]"}`}
                        size="0.5em"
                    />,
                    url: "/masters/annexure",
                },
                {
                    title: "Standard",
                    identifier: "standard",
                    icon: <Square
                        style={{ fill: currentPath.includes('standard') ? "#962c3d" : "#75829C" ,width:'0.6em',height:'0.6em'}}
                        className={`me-2 ${currentPath.includes('standard') ? "text-primary" : "text-[#75829C]"}`}
                        size="0.5em"
                    />,
                    url: "/masters/standard",
                },
                {
                    title: "Manufacturer",
                    identifier: "",
                    icon: <Square
                        style={{ fill: currentPath.includes('manufacturer') ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                        className={`me-2 ${currentPath.includes('manufacturer') ? "text-primary" : "text-[#75829C]"}`}
                        size="0.5em"
                    />,
                    url: "/masters/manufacturer",
                },
                {
                    title: "Owner",
                    identifier: "owner",
                    icon: <Square
                        style={{ fill: currentPath.includes('owner') ? "#962c3d" : "#75829C" ,width:'0.6em',height:'0.6em'}}
                        className={`me-2 ${currentPath.includes('owner') ? "text-primary" : "text-[#75829C]"}`}
                        size="0.5em"
                    />,
                    url: "/masters/owner",
                },
                {
                    title: "Surveyor",
                    identifier: "surveyor",
                    icon: <Square
                        style={{ fill: currentPath.includes('surveyor') ? "#962c3d" : "#75829C",width:'0.6em',height:'0.6em' }}
                        className={`me-2 ${currentPath.includes('surveyor') ? "text-primary" : "text-[#75829C]"}`}
                        size="0.5em"
                    />,
                    url: "/masters/surveyor",
                },
                {
                    title: "Authority",
                    identifier: "authority",
                    icon: <Square
                        style={{ fill: currentPath.includes('authority') ? "#962c3d" : "#75829C" ,width:'0.6em',height:'0.6em'}}
                        className={`me-2 ${currentPath.includes('authority') ? "text-primary" : "text-[#75829C]"}`}
                        size="0.5em"
                    />,
                    url: "/masters/authority",
                },
            ]

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
            subtopics: [
                {
                    title: "Lifting Equipment",
                    identifier: "lifting-equipment",
                    icon: <Square
                        fill={currentPath.includes('lifting-equipment') ? "#962c3d" : "#75829C"}
                        className={`me-2 ${currentPath.includes('lifting-equipment') ? "text-primary" : "text-[#75829C]"}`}
                        size="0.5em"
                    />,
                    url: "/transactions/lifting-equipment",
                },
                {
                    title: "Lifting Gear Single",
                    identifier: "lifting-gear-single",
                    icon: <Square
                        fill={currentPath.includes('lifting-gear-single') ? "#962c3d" : "#75829C"}
                        className={`me-2 ${currentPath.includes('lifting-gear-single') ? "text-primary" : "text-[#75829C]"}`}
                        size="0.5em"
                    />,
                    url: "/transactions/lifting-gear-single"
                },
                {
                    title: "Lifting Gear Multi",
                    identifier: "lifting-gear-multi",
                    icon: <Square
                        fill={currentPath.includes('lifting-gear-multi') ? "#962c3d" : "#75829C"}
                        className={`me-2 ${currentPath.includes('lifting-gear-multi') ? "text-primary" : "text-[#75829C]"}`}
                        size="0.5em"
                    />,
                    url: "/transactions/lifting-gear-multi",
                },
            ]
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
    ];

    return (

        <>

            <Sheet>
                <SheetTrigger className="absolute left-5 top-[2.75rem] z-[12] text-muted-foreground sm:hidden">
                    <MenuBarIcon />
                </SheetTrigger>
                <SheetContent side="left" className="z-[9999]  max-w-72 p-0">
                    <SidebarItems
                        className="border-none"
                        options={options}
                        currentActiveDiv={currentActiveDiv}
                        setCurrentActiveDiv={setCurrentActiveDiv}
                    /> 
                </SheetContent>
            </Sheet>
            <SidebarItems
                className="sticky top-0 z-50 hidden h-[90vh] min-w-72 sm:block"
                options={options} 
                currentActiveDiv={currentActiveDiv}
                setCurrentActiveDiv={setCurrentActiveDiv}
            />

        </>
    );
}

interface SidebarItemsProps {
    options: Option[];
    className?: string;
    currentActiveDiv: string
    setCurrentActiveDiv: React.Dispatch<React.SetStateAction<string>>
}

const AnimateButtons= ({ children }:any) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const SubtopicButton = ({ subtopic, currentPathname, onClick, isActive }:any) => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -20, opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Link href={subtopic.url || '#'} passHref>
      <Button
        onClick={onClick}
        variant="ghost"
        className={cn(
          "flex w-full justify-start shadow-sm pl-8",
          isActive && "font-bold text-primary"
        )}
      >
        {subtopic.icon}
        <span className="text-start">{subtopic.title}</span>
      </Button>
    </Link>
  </motion.div>
);

const NavigationButton = ({ opt, isActive, isExpanded, onClick, hasSubtopics }:any) => (
  <AnimateButtons>
    {opt.url ? (
      <Link href={opt.url} passHref>
        <Button
          onClick={onClick}
          variant="ghost"
          className={cn(
            "flex w-full justify-start shadow-sm rounded-none",
            isActive && "font-bold text-primary border-r-[3px] border-primary"
          )}
        >
          {opt.icon}
          <span className="text-start flex-grow">{opt.title}</span>
          {hasSubtopics && isExpanded && <ChevronDown size={16} />}
        </Button>
      </Link>
    ) : (
      <Button
        onClick={onClick}
        variant="ghost"
        className={cn(
          "flex w-full justify-start shadow-sm rounded-none",
          isActive && "font-bold text-primary border-r-[3px] border-primary"
        )}
      >
        {opt.icon}
        <span className="text-start flex-grow">{opt.title}</span>
        {hasSubtopics && isExpanded && <ChevronDown size={16} />}
      </Button> 
    )}
  </AnimateButtons>
);

function SidebarItems({ options, className, currentActiveDiv, setCurrentActiveDiv }:any) {
  const currentPathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<any>({});
  const { isLoadingOne, setLoading } = useLoading(); 

  const toggleExpanded = useCallback((identifier: string | number) => {
    setExpandedItems((prev:any) => ({ ...prev, [identifier]: !prev[identifier] }));
  }, []);

  const handleItemClick = useCallback((opt: { subtopics: string | any[]; identifier: string; }) => {
    const hasSubtopics = opt.subtopics && opt.subtopics.length > 0;
    if (hasSubtopics) {
      toggleExpanded(opt.identifier || '');
    }
    if (opt.identifier !== "transactions" && opt.identifier !== "masters") {
      setCurrentActiveDiv(opt.identifier);
      setLoading(true);
      setTimeout(() => setLoading(false), 500);
    }
    
    
  }, [setCurrentActiveDiv, setLoading, toggleExpanded]);

  const renderNavigationButton = useCallback((opt: any) => {
    const isActive = currentActiveDiv === opt.identifier;
    const hasSubtopics = opt.subtopics && opt.subtopics.length > 0;
    const isExpanded = expandedItems[opt.identifier || ''];

    return (
      <React.Fragment key={opt.identifier}>
        <NavigationButton
          opt={opt}
          isActive={isActive}
          isExpanded={isExpanded}
          onClick={() => handleItemClick(opt)}
          hasSubtopics={hasSubtopics}
        />
        <AnimatePresence initial={false}>
          {hasSubtopics && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="ml-4 overflow-hidden"
            >
              {opt.subtopics?.map((subtopic: any) => (
                <SubtopicButton
                  key={subtopic.identifier}
                  subtopic={subtopic}
                  currentPathname={currentPathname}
                  onClick={() => {
                    flushSync(() => {
                      setLoading(true);
                      setCurrentActiveDiv(opt.identifier);
                      setLoading(false);
                    });
                  
                  }}
                  isActive={currentPathname === subtopic.url}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </React.Fragment>
    );
  }, [currentActiveDiv, expandedItems, currentPathname, handleItemClick, setLoading]);

  return (
<aside className={cn("border-t-0 bg-secondary  p-2 pt-20 backdrop-blur-lg  overflow-y-auto", className)}>
          <div className="grid gap-2">
        {options.map((opt: { identifier: React.Key | null | undefined; type: string; }) => (
          <div key={opt.identifier}>
            {opt.type === "separator" ? (
              <div className="px-2">
                <Separator />
              </div>
            ) : (
              renderNavigationButton(opt)
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

 