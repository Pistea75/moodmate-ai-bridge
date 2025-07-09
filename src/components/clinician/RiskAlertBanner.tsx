
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X, ArrowRight } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { calculateRiskScore } from '@/lib/utils/riskScoring';

interface HighRiskPatient {
  id: string;
  name: string;
  riskLevel: string;
  riskScore: number;
}

export function RiskAlertBanner() {
  const [highRiskPatients, setHighRiskPatients] = useState<HighRiskPatient[]>([]);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHighRiskPatients();
  }, []);

  const checkHighRiskPatients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get clinician's patients
      const { data: patientLinks } = await supabase
        .from('patient_clinician_links')
        .select(`
          patient_id,
          profiles!patient_clinician_links_patient_id_fkey (
            id,
            first_name,
            last_name
          )
        `)
        .eq('clinician_id', user.id);

      if (!patientLinks) return;

      const highRiskPatients: HighRiskPatient[] = [];

      for (const link of patientLinks.slice(0, 5)) { // Check only first 5 for performance
        const patientId = link.patient_id;
        const profile = link.profiles as any;
        
        if (!profile) continue;

        // Fetch recent patient data for risk calculation
        const [moodData, sessionData, taskData, chatData] = await Promise.all([
          supabase
            .from('mood_entries')
            .select('*')
            .eq('patient_id', patientId)
            .order('created_at', { ascending: false })
            .limit(10),
          supabase
            .from('sessions')
            .select('*')
            .eq('patient_id', patientId)
            .order('scheduled_time', { ascending: false })
            .limit(5),
          supabase
            .from('tasks')
            .select('*')
            .eq('patient_id', patientId)
            .order('inserted_at', { ascending: false })
            .limit(10),
          supabase
            .from('ai_chat_logs')
            .select('*')
            .eq('patient_id', patientId)
            .order('created_at', { ascending: false })
            .limit(20)
        ]);

        const riskAssessment = calculateRiskScore(
          moodData.data || [],
          sessionData.data || [],
          taskData.data || [],
          chatData.data || []
        );

        if (riskAssessment.level === 'critical' || riskAssessment.level === 'high') {
          highRiskPatients.push({
            id: patientId,
            name: `${profile.first_name} ${profile.last_name}`,
            riskLevel: riskAssessment.level,
            riskScore: riskAssessment.score
          });
        }
      }

      setHighRiskPatients(highRiskPatients);
    } catch (error) {
      console.error('Error checking high-risk patients:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || dismissed || highRiskPatients.length === 0) {
    return null;
  }

  return (
    <Alert className="border-orange-200 bg-orange-50">
      <AlertTriangle className="h-4 w-4 text-orange-500" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div>
          <span className="font-medium text-orange-800">
            {highRiskPatients.length} patient{highRiskPatients.length > 1 ? 's' : ''} require immediate attention.
          </span>
          <span className="text-orange-700 ml-2">
            High-risk patients: {highRiskPatients.map(p => p.name).join(', ')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-orange-700 border-orange-300 hover:bg-orange-100"
            onClick={() => window.location.href = '/clinician/risk-management'}
          >
            View Details
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setDismissed(true)}
            className="text-orange-600 hover:bg-orange-100"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
