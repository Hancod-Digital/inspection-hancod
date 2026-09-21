import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import CircularProgress from './CircularProgress';

const TotalEquipmentCard = ({ total }: { total: number }) => (
  <Card className="w-full md:w-[35%] border-0 shadow-sm py-8">
    <CardContent className="flex items-center justify-center ">
      <div className="text-left">
        <h3 className="text-lg font-semibold mb-10  ">Total Equipment</h3>
        <CircularProgress value={total} label="Equipment" />
      </div>
    </CardContent> 
  </Card>
);

export default TotalEquipmentCard;
