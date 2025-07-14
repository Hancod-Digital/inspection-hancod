import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusIcon, Search } from "lucide-react"
import { useState } from "react"
import { useSubtopic } from "@/context/SubtopicContext"
import * as XLSX from 'xlsx';

export default function Component({ onOpen, onSearchChange }: { onOpen: () => void, onSearchChange: (value: string) => void }) {
    const [searchValue, setSearchValue] = useState("");
    const { data} = useSubtopic()
    const exportToExcel = () => {
        if (data) {
            const worksheet = XLSX.utils.json_to_sheet(data.map((item: any) => ({
                "Standard": item.standard,
                "Standard Type": item.standard_type,
                "Remarks": item.remarks,
                "Status": item.status
            })));
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Standard");
            XLSX.writeFile(workbook, "standard.xlsx");
        }
    }
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        onSearchChange(value);
    
        
    };

    return (
        <div className="flex items-center space-x-4 w-full p-4">
            <div className="flex w-full space-x-3">
                <div className="relative border-0 flex-[5]">
                    <Search className="absolute left-2 top-1/2 h-6 w-6 -translate-y-1/2 text-primary" />
                    <Input
                        type="search"
                        placeholder="Search"
                        value={searchValue}
                        onChange={handleSearchChange}
                        className="pl-10 pr-4 focus:border-primary w-full"
                    />
                </div>
                {/* <Button variant="link" className="flex-[1] text-primary bg-white">
                    Advanced Search
                </Button> */}
                <Button variant="outline" onClick={onOpen} className="flex-[1] hover:bg-secondary hover:text-primary hover:border-primary border bg-primary text-primary-foreground">
                    <PlusIcon className="h-4 w-4 mr-1" />
                    New
                </Button>
                <Button onClick={exportToExcel} className="flex-[1] hover:bg-secondary hover:text-primary hover:border-primary border bg-primary text-primary-foreground">
                    Export
                </Button>
            </div>
        </div>
    )
}
