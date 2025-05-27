
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface PatientSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function PatientSelector({ value, onChange, placeholder = "Select patient" }: PatientSelectorProps) {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .eq("role", "patient");

      if (!error && data) {
        console.log("✅ Patients loaded from Supabase:", data);
        setPatients(data);
      } else {
        console.error("❌ Error fetching patients:", error);
      }
      setLoading(false);
    };

    fetchPatients();
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="patient" className="text-gray-700 font-medium">
        Select Patient
      </Label>
      <Select value={value} onValueChange={onChange} disabled={loading}>
        <SelectTrigger id="patient" className="bg-white">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {patients.map((patient) => (
            <SelectItem key={patient.id} value={patient.id}>
              {patient.first_name} {patient.last_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
