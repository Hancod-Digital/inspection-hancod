'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { makeApiCall } from "@/lib/apicaller";
import { MasterService } from "@/services/api/masters-service";
import { Certificate } from "crypto";
import { PlusIcon, Search } from "lucide-react"
import { useEffect, useState } from "react";
import * as XLSX from 'xlsx';
export default function Component({ setSearchValue, onOpen }: { setSearchValue: (value: string) => void, onOpen: () => void }) {
  const [liftingEquipment, setLiftingEquipment] = useState<any>([]);
  useEffect(() => {
    makeApiCall(() => new MasterService().liftingEquipmentView(), {
      afterSuccess: (response: any) => {
        // console.log("liftingEquipment:",response);

        setLiftingEquipment(response);
      }
    });
  }, []);

  const exportToExcel = () => {

    if (!liftingEquipment || liftingEquipment.length === 0) {
      alert("No data available for export");
      return;
    }

    // 1️⃣ Group data by job_order_no
    const groupedData = liftingEquipment.reduce((acc: any, item: any) => {
      const key = item.job_order_no;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    // 2️⃣ Prepare flattened data for Excel
    const exportRows: any[] = [];
    Object.keys(groupedData).forEach((jobOrder) => {
      const group = groupedData[jobOrder];

      // Add each record with only required fields
      group.forEach((item: any) => {
        // console.log("items", item);
        exportRows.push({
          "Job Order No": item.job_order_no,
          "Inspection Date": item.inspection_date,
          "Inspection Location": item.location,
          "Type of Exam": item.type_of_exam,
          "Equipment ID": item.equipment,
          "Authority": item.authority,
          "Title": item.title,
          "Certificate Type": item.certificate_type,
          "Test Cert/COC No": item.test_cert_coc_no,
          "Serial No": item.serial_no,
          "Model No": item.model_no,
          "Owner ID/Name": item.owner,
          "Manufacturer": item.manufacturer,
          "Year of Manufacture": item.year_of_manufacture,
          "Standard": item.standard,
          "Surveyor": item.surveyor,
          "Next Thorough Exam": item.next_thorough_exam,
          "Next Test Exam": item.next_test_exam,
          "Last Thorough Exam": item.last_thorough_exam,
          "Last Test Exam": item.last_test_exam,
          "Result": item.result,
          "Approval Status": item.approval_status === "true" ? "APPROVED" : "REJECTED",
          "Safe Working Load": item.safe_working_load,
          "Certificate No": item.certificate_no,
        });
      });

      // Add an empty row between groups
      exportRows.push({});
    });

    // 3️⃣ Convert to worksheet and export
    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lifting Equipment");
    XLSX.writeFile(workbook, "lifting_equipment.xlsx");
  };


  // const exportToExcel = () => {
  //     const worksheet = XLSX.utils.json_to_sheet(liftingEquipment!);
  //     const workbook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(workbook, worksheet, "Lifting Equipment");
  //     XLSX.writeFile(workbook, "lifting_equipment.xlsx");
  // };

  return (
    <div className="flex items-center space-x-4 w-full p-4">
      <div className="flex w-full space-x-3">
        <div className="relative  border-0 flex-[5]">
          <Search className="absolute left-2 top-1/2 h-6 w-6 -translate-y-1/2 text-primary" />
          <Input
            type="search"
            placeholder="Search"
            className="pl-10 pr-4 focus:border-primary w-full"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        {/* <Button variant="link" className="flex-[1]  text-primary bg-white">
                    Advanced Search
                </Button> */}
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