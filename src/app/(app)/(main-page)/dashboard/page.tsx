'use client'
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import StatCard from './_components/StatsCard';
import TotalEquipmentCard from './_components/TotalEquipmentCard';
import ChartComponent from './_components/Chart';
import BarGraph from './_components/BarGraph';
import DueDate from './_components/DueDate'
import Approval from './_components/Approval'
import { DashboardService } from '@/services/api/dashboard-service';


export default function Component() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard-snapshot'],
    queryFn: () => new DashboardService().getSnapshot(),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });

  if (isLoading) return <div className="p-6 text-sm text-gray-500">Loading dashboard…</div>;
  if (isError) return <div className="p-6 text-sm text-red-600">Unable to load dashboard: {(error as Error).message}</div>;

  const equipment = data?.equipment ?? [];
  const inspections = data?.inspections ?? [];
  const certified = inspections.filter((item) => item.safe_to_use === true || /certif|verif/i.test(item.result ?? '')).length;
  const defects = inspections.filter((item) => /defect/i.test(item.result ?? '') || item.safe_to_use === false).length;
  const scrapped = inspections.filter((item) => /scrap/i.test(item.result ?? '')).length;
  const aboutToExpire = equipment.filter((item) => {
    const due = new Date(item.next_thorough_date ?? item.next_test_date ?? '').getTime();
    return Number.isFinite(due) && due >= Date.now() && due <= Date.now() + 30 * 24 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="p-6 space-y-6 w-full bg-[#fafbfb] min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard value={certified} label="Certified" color="text-blue-500" />
        <StatCard value={defects} label="Defect" color="text-yellow-500" />
        <StatCard value={scrapped} label="Scrapped" color="text-red-500" />
        <StatCard value={aboutToExpire} label="About to expire" color="text-purple-500" />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 flex-1 ">
        <TotalEquipmentCard total={equipment.length} />
        <ChartComponent inspections={inspections} />
      </div>
      <div className="flex flex-col md:flex-row gap-6 flex-1 ">
        <BarGraph equipment={equipment} />
      </div>
      <DueDate equipment={equipment} />
      <Approval inspections={inspections} />
    </div>
  );
}
