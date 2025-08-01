import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


export default function Component({ onOpen, setIsBulk, onSearchChange }:any) {
  const [searchValue, setSearchValue] = useState("");

  const [searchType, setSearchType] = useState("name"); // default search type sort based on selected option

  const handleSearchChange = (e: { target: { value: any; }; }) => {
    const value = e.target.value;
    setSearchValue(value);
    // onSearchChange(value);
    onSearchChange(value, searchType); // pass search value & type to parent
  };

  return (
    <div className="flex flex-col items-center space-x-4 w-full p-4">
      <div className="flex w-full space-x-3">
          {/* Search Bar */}
        <div className="relative border-0 flex-[3]">
          <Search className="absolute left-2 top-1/2 h-6 w-6 -translate-y-1/2 text-primary" />
          <Input
            type="search"
            placeholder="Search"
            value={searchValue}
            onChange={handleSearchChange}
            className="pl-10 pr-4 focus:border-primary w-full"
          />
        </div>

          {/* Dropdown */}
          <Select
          defaultValue="name"
          onValueChange={(val) => {
            setSearchType(val);  // Update search type based on dropdown selection
            onSearchChange(searchValue, val);  // update parent with the new type
          }}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Search by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="card">Card/Model Level</SelectItem>
          </SelectContent>
        </Select>

        {/* <div className="relative border-0 flex-[5]">
          <Search className="absolute left-2 top-1/2 h-6 w-6 -translate-y-1/2 text-primary" />
          <Input
            type="search"
            placeholder="Search"
            value={searchValue}
            onChange={handleSearchChange}
            className="pl-10 pr-4 focus:border-primary w-full"
          />
        </div> */}
        <Button
          variant="outline"
          onClick={() => {
            setIsBulk(true);
           // Check if this logs when you click Import
          }}
          className="flex-[1] hover:bg-secondary hover:text-primary hover:border-primary border bg-primary text-primary-foreground"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Import
        </Button>
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
