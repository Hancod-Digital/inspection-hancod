import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ApprovalItem {
  certID: string
  certificateNo: string
  equipmentNo: string
  result: string
  inspDate: string
}

const approvalData: ApprovalItem[] = [
  {
    certID: "1556",
    certificateNo: "488556648852555411",
    equipmentNo: "ZP 40-D",
    result: "Certified and color coded",
    inspDate: "20-10-2024",
  },
  {
    certID: "1556",
    certificateNo: "488556648852555411",
    equipmentNo: "ZP 40-D",
    result: "Certified and color coded",
    inspDate: "20-10-2024",
  },
  {
    certID: "1556",
    certificateNo: "488556648852555411",
    equipmentNo: "ZP 40-D",
    result: "Certified and color coded",
    inspDate: "20-10-2024",
  },
  {
    certID: "1556",
    certificateNo: "488556648852555411",
    equipmentNo: "ZP 40-D",
    result: "Certified and color coded",
    inspDate: "20-10-2024",
  },
  {
    certID: "1556",
    certificateNo: "488556648852555411",
    equipmentNo: "ZP 40-D",
    result: "Certified and color coded",
    inspDate: "20-10-2024",
  },
]

export default function Component() {
  return (
    <div className="w-full mx-auto p-10 bg-white">
      <h2 className="text-xl font-bold mb-4">Waiting For Approval</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]"><div className="py-4  ">CertID</div></TableHead>
            <TableHead><div className="py-4  ">Certificate No.</div></TableHead>
            <TableHead><div className="py-4  ">Equipment No.</div></TableHead>
            <TableHead><div className="py-4  ">Result</div></TableHead>
            <TableHead className="text-right"><div className="py-4  ">Insp Date</div></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {approvalData.map((item, index) => (
            
            <TableRow key={index} className="py-10">
                 
    <TableCell className="font-medium"><div className="py-4  ">{item.certID}</div></TableCell>
    <TableCell><div className="py-4  ">{item.certificateNo}</div></TableCell>
    <TableCell><div className="py-4  ">{item.equipmentNo}</div></TableCell>
    <TableCell><div className="py-4  ">{item.result}</div></TableCell>
    <TableCell className="text-right"><div className="py-4  ">{item.inspDate}</div></TableCell>
 
               
            </TableRow> 
          ))}
        </TableBody>
      </Table>
    </div>
  )
}