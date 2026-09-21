import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardInspection } from "@/services/api/dashboard-service"
import { formatDate } from "@/services/api/utils"

export default function Component({ inspections }: { inspections: DashboardInspection[] }) {
  const approvalData = inspections.filter((item) => {
    const status = String(item.approval_status ?? '').toLowerCase();
    return status === 'pending' || status === 'waiting' || status === 'false' || !status;
  }).slice(0, 10);
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
                 
    <TableCell className="font-medium"><div className="py-4">{item.id}</div></TableCell>
    <TableCell><div className="py-4">{item.certificate_no ?? item.test_cert_coc_no ?? '—'}</div></TableCell>
    <TableCell><div className="py-4">{item.equipment ?? item.title ?? '—'}</div></TableCell>
    <TableCell><div className="py-4">{item.result ?? 'Pending approval'}</div></TableCell>
    <TableCell className="text-right"><div className="py-4">{item.inspection_date ? formatDate(item.inspection_date) : '—'}</div></TableCell>
 
               
            </TableRow> 
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
