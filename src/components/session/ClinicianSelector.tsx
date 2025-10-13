import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssignedClinician } from '@/hooks/useAssignedClinician';
import { getClinicianFullName } from '@/utils/supabase/clinician';

interface ClinicianSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ClinicianSelector({ value, onChange, placeholder = "Select clinician" }: ClinicianSelectorProps) {
  const { clinician, loading } = useAssignedClinician();

  useEffect(() => {
    if (clinician && !value) {
      onChange(clinician.id);
    }
  }, [clinician, value, onChange]);

  if (loading) {
    return (
      <div className="space-y-2">
        <Label className="text-gray-700 font-medium">Psychologist</Label>
        <div className="h-10 bg-gray-100 animate-pulse rounded-md" />
      </div>
    );
  }

  if (!clinician) {
    return (
      <div className="space-y-2">
        <Label className="text-gray-700 font-medium">Psychologist</Label>
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">No psychologist assigned yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="clinician" className="text-gray-700 font-medium">
        Psychologist
      </Label>
      <Select value={value} onValueChange={onChange} disabled={loading}>
        <SelectTrigger id="clinician" className="bg-white">
          <SelectValue placeholder={placeholder}>
            {getClinicianFullName(clinician)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={clinician.id}>
            {getClinicianFullName(clinician)}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
