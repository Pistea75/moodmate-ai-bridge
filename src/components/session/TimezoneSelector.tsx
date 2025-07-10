
import { Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCommonTimezones, getCurrentTimezone } from "@/utils/sessionUtils";

interface TimezoneSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimezoneSelector({ value, onChange }: TimezoneSelectorProps) {
  const currentTimezone = getCurrentTimezone();
  const timezones = getCommonTimezones();
  
  return (
    <div className="space-y-2">
      <Label htmlFor="timezone" className="text-gray-700 font-medium text-sm flex items-center gap-1">
        <Globe className="h-3 w-3" /> Timezone
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="timezone" className="bg-white h-9 text-sm">
          <SelectValue placeholder="Select timezone" />
        </SelectTrigger>
        <SelectContent className="max-h-[200px]">
          <ScrollArea className="h-[200px]">
            <SelectItem value={currentTimezone}>
              Current: {currentTimezone}
            </SelectItem>
            {timezones.map((zone) => (
              <SelectItem key={zone.value} value={zone.value}>
                {zone.label}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  );
}
