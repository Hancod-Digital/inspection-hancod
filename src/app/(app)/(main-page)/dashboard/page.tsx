'use client'
import React from 'react';
import StatCard from './_components/StatsCard';
import TotalEquipmentCard from './_components/TotalEquipmentCard';
import ChartComponent from './_components/Chart';
import BarGraph from './_components/BarGraph';
import DueDate from './_components/DueDate'
import Approval from './_components/Approval'


export default function Component() {
  return (
    <div className="p-6 space-y-6 w-full bg-[#fafbfb]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard value={12} label="Certified" color="text-blue-500" />
        <StatCard value={570} label="Defect" color="text-yellow-500" />
        <StatCard value={16} label="Scrapped" color="text-red-500" />
        <StatCard value={45} label="About to expire" color="text-purple-500" />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 flex-1 ">
        <TotalEquipmentCard />
        <ChartComponent />
      </div>
      <div className="flex flex-col md:flex-row gap-6 flex-1 ">
        <BarGraph /> 
      </div>
      <DueDate />
      <Approval />
    </div>
  );
}
