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

interface Clinician {
  id: string;
  first_name: string;
  last_name: string;
}

interface ClinicianSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function ClinicianSelector({ value, onChange, placeholder = "Select clinician" }: ClinicianSelectorProps) {
  const [clinician, setClinician] = useState<Clinician | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClinician = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('❌ ClinicianSelector: No user found');
          return;
        }

        console.log('✅ ClinicianSelector: Fetching for patient ID:', user.id);

        // Get clinician from patient_clinician_links
        const { data: link, error: linkError } = await supabase
          .from("patient_clinician_links")
          .select("clinician_id")
          .eq("patient_id", user.id)
          .maybeSingle();

        console.log('📊 ClinicianSelector: Link query result:', { link, linkError });

        if (linkError) {
          console.error('❌ ClinicianSelector: Error fetching link:', linkError);
          throw linkError;
        }

        if (!link?.clinician_id) {
          console.log('⚠️ ClinicianSelector: No clinician link found');
          setClinician(null);
          setLoading(false);
          return;
        }

        console.log('✅ ClinicianSelector: Found clinician_id:', link.clinician_id);

        // Get clinician profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name")
          .eq("id", link.clinician_id)
          .single();

        console.log('📊 ClinicianSelector: Profile query result:', { profile, profileError });

        if (profileError) {
          console.error('❌ ClinicianSelector: Error fetching profile:', profileError);
          throw profileError;
        }

        if (profile) {
          console.log('✅ ClinicianSelector: Setting clinician:', profile);
          setClinician({
            id: profile.id,
            first_name: profile.first_name || '',
            last_name: profile.last_name || ''
          });
          // Auto-select the clinician
          onChange(profile.id);
        }
      } catch (error) {
        console.error("❌ ClinicianSelector: Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClinician();
  }, [onChange]);

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
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={clinician.id}>
            {clinician.first_name} {clinician.last_name}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
