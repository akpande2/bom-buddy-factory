import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";

const stages = [
  "All Stages",
  "OPS Submitted",
  "PR Created",
  "Comparative Sheet",
  "SCM Review",
  "MD Approval",
  "PO Issued",
  "GRN",
];

const vendors = [
  "All Vendors",
  "Bajaj Electric",
  "Maharaja Industries",
  "Crompton Parts",
  "Supreme Plastics",
  "Anchor Electronics",
  "TechCircuit Systems",
  "SKF Bearings",
  "Bosch Automotive",
];

const dateRanges = [
  "All Time",
  "Today",
  "Last 7 Days",
  "Last 30 Days",
  "Last 3 Months",
  "Last 6 Months",
  "This Year",
  "Custom Range",
];

export const FilterBar = () => {
  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="text-sm font-medium text-foreground whitespace-nowrap">Filters:</span>
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search PR/PO number..."
              className="pl-10 h-9"
            />
          </div>
          
          {/* Stage Dropdown */}
          <Select defaultValue="All Stages">
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {stages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Vendor Dropdown */}
          <Select defaultValue="All Vendors">
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Select vendor" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {vendors.map((vendor) => (
                <SelectItem key={vendor} value={vendor}>
                  {vendor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Date Range Dropdown */}
          <Select defaultValue="All Time">
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent className="bg-popover z-50">
              {dateRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Clear Filters Button */}
        <Button variant="ghost" size="sm" className="h-9">
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>
    </div>
  );
};
