import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Search,
  Sparkles,
  Users,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const SearchBar = ({ onSearch, initialData = {} }) => {
  // State is initialized from the initialData prop passed by the parent page
  const [searchTerm, setSearchTerm] = useState(initialData.searchTerm || "");
  const [dateRange, setDateRange] = useState(
    initialData.dateRange || { from: undefined, to: undefined }
  );
  const [adults, setAdults] = useState(initialData.adults || 1);
  const [children, setChildren] = useState(initialData.children || 0);

  // Effect to update internal state if the initial data from the parent changes
  useEffect(() => {
    setSearchTerm(initialData.searchTerm || "");
    setDateRange(initialData.dateRange || { from: undefined, to: undefined });
    setAdults(initialData.adults || 1);
    setChildren(initialData.children || 0);
  }, [initialData]);

  const handleSearchClick = () => {
    // Pass the current state up to the parent component's onSearch function
    onSearch({ searchTerm, dateRange, adults, children });
  };

  return (
    <div className="grid max-w-5xl grid-cols-1 gap-2 p-4 mx-auto rounded-lg shadow-lg md:grid-cols-12 bg-background">
      <div className="relative md:col-span-5">
        <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
        <Input
          type="search"
          placeholder="Describe your perfect stay..."
          className="w-full pl-10 h-14"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
        />
      </div>
      <div className="md:col-span-3">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="justify-start w-full font-normal text-left h-14 text-muted-foreground"
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              {dateRange?.from ? (
                dateRange.to ? (
                  `${format(dateRange.from, "LLL dd")} - ${format(
                    dateRange.to,
                    "LLL dd"
                  )}`
                ) : (
                  format(dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick dates</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              disabled={{ before: new Date() }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="md:col-span-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="justify-start w-full overflow-hidden font-normal text-left h-14 text-muted-foreground"
            >
              <Users className="flex-shrink-0 w-4 h-4 mr-2" />
              <span className="truncate whitespace-nowrap">
                {adults} Adults, {children} Children
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Adults</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setAdults((p) => Math.max(1, p - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span>{adults}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setAdults((p) => p + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Children</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setChildren((p) => Math.max(0, p - 1))}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span>{children}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setChildren((p) => p + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="md:col-span-2">
        <Button onClick={handleSearchClick} className="w-full text-lg h-14">
          <Sparkles className="w-5 h-5 mr-2" /> Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
