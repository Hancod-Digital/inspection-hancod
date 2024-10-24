'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusIcon, Search } from "lucide-react"
import * as XLSX from 'xlsx';
import { useSubtopic } from '@/context/SubtopicContext';
import { useEffect, useState } from "react";
import { equipmentDataRange } from "@/lib/utils";

export default function Component({ onOpen, onSearchChange }:{onOpen: () => void, onSearchChange: (value: string) => void}) {
    const { isLoading, error, getAllSingleSubtopic, getMergedData, deleteRecord, data } = useSubtopic();
    const [subtopics, setSubtopics] = useState([]);
    useEffect(() => {
        async function fetchSubtopics() {
            try {
                const equipment_type = await getMergedData(equipmentDataRange, 'equipment');
                setSubtopics(equipment_type);
            } catch (error) {
                console.error("Error fetching subtopics:", error);
            }
        }

        fetchSubtopics();
    }, [getMergedData]);
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(subtopics!);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Equipment");
        XLSX.writeFile(workbook, "equipment.xlsx");
    };

    return (
        <div className="flex items-center space-x-4 w-full p-4">
            <div className="flex w-full space-x-3">
                <div className="relative  border-0 flex-[5]">
                    <Search className="absolute left-2 top-1/2 h-6 w-6 -translate-y-1/2 text-primary" />
                    <Input
                        type="search"
                        placeholder="Search"
                        className="pl-10 pr-4 focus:border-primary w-full"
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>
                <Button variant="link" className="flex-[1]  text-primary bg-white">
                    Advanced Search
                </Button>
                <Button variant="outline" onClick={onOpen} className="flex-[1]  hover:bg-secondary hover:text-primary hover:border-primary bg-primary text-primary-foreground">
                <PlusIcon className="h-4 w-4 mr-1" />
  New
                </Button>
                <Button onClick={exportToExcel} className="flex-[1] hover:bg-secondary hover:text-primary hover:border-primary  bg-primary text-primary-foreground">
                    Export
                </Button>
            </div>

        </div>
    )
}