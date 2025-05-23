
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

interface ReportsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  typeFilter: string;
  onTypeFilterChange: (value: string) => void;
  reportTypes: string[];
}

export function ReportsFilters({ 
  searchTerm, 
  onSearchChange, 
  typeFilter, 
  onTypeFilterChange, 
  reportTypes 
}: ReportsFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="space-y-1 flex-1">
        <Label htmlFor="search">Search Reports</Label>
        <div className="relative">
          <Input
            id="search"
            placeholder="Search by patient name, title or type..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1 w-[180px]">
        <Label htmlFor="type-filter">Report Type</Label>
        <Select 
          value={typeFilter} 
          onValueChange={onTypeFilterChange}
        >
          <SelectTrigger id="type-filter">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {reportTypes.map(type => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
