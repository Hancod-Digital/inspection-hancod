import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusIcon, Search } from "lucide-react"
import { useSubtopic } from "@/context/SubtopicContext";
import * as XLSX from 'xlsx';
import { useState } from "react";
import { useEffect } from "react";
import { MasterService } from "@/services/api/masters-service";
export default function Component({ onOpen,onSearchChange }:{onOpen: () => void,onSearchChange:any}) {
    

    const { FetchLocationDetails } = useSubtopic();
    const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datas = await new MasterService().getLocationDetails();
      
        setData(datas); // Update state with the fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []); // Empty dependency array ensures this runs once when the component mounts


    const exportToExcel = () => {
        if (data) {
            const worksheet = XLSX.utils.json_to_sheet(data.map((item: any) => ({
                Location: item.location?.name,
                Site: item.site?.name,  
                Area: item.area?.name,
                Status: item.location?.status
            })));
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Locations");
            XLSX.writeFile(workbook, "locations.xlsx");
        }
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
                <Button variant="outline" onClick={onOpen} className="flex-[1]  hover:bg-secondary hover:text-primary hover:border-primary border bg-primary text-primary-foreground">
                <PlusIcon className="h-4 w-4 mr-1" />
  New
                </Button>
                <Button onClick={exportToExcel} className="flex-[1] hover:bg-secondary hover:text-primary hover:border-primary border  bg-primary text-primary-foreground">
                    Export
                </Button>
            </div>

        </div>
    )
}