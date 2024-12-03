// components/ColumnModal.tsx

"use client";

import * as React from "react";
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColumnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (columnName: string) => void;
}

export default function ColumnModal({ open, onOpenChange, onSave }: ColumnModalProps) {
  const [columnName, setColumnName] = React.useState("");

  const handleSave = () => {
    onSave(columnName);
    setColumnName("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 px-1">
          <DialogTitle className="text-xl font-normal">Column</DialogTitle>
          <X className="h-4 w-4 cursor-pointer" onClick={() => onOpenChange(false)} />
        </DialogHeader>
        <div className="space-y-6 p-1">
          <div className="space-y-2">
            <Label htmlFor="columnName">Column Name</Label>
            <Input
              id="columnName"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleSave}
            className="w-full bg-[#8E2449] hover:bg-[#8E2449]/90"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
