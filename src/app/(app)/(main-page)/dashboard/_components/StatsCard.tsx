import React from 'react';
import { Card } from "@/components/ui/card";

const StatCard = ({ value, label, color }:{value:number,label:string,color:string}) => (
  <Card className="flex flex-col items-center justify-center p-6 border-0 shadow-sm">
    <div className={`text-4xl font-bold mb-2 ${color}`}>{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </Card>
);

export default StatCard;
