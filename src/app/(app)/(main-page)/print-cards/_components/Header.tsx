import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusIcon } from "lucide-react";
import { useState } from "react";

export default function Component({ onOpen, onSearchChange }:any) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange(value);
  };

  return (
    <div className="flex flex-col items-center space-x-4 w-full p-4">
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
        <Button
          variant="outline"
          onClick={onOpen}
          className="flex-[1] hover:bg-secondary hover:text-primary hover:border-primary border bg-primary text-primary-foreground"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add profile
        </Button>
      </div>
    </div>
  );
}
