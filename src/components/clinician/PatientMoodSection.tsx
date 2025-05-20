
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { MoodChart } from '@/components/mood/MoodChart';

export function PatientMoodSection({ patientId }: { patientId: string }) {
  const [moodData, setMoodData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const { data, error } = await supabase
          .from('mood_entries')
          .select('*')
          .eq('patient_id', patientId)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        setMoodData(data || []);
      } catch (error) {
        console.error('Error fetching mood data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMoodData();
  }, [patientId]);
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Mood Trends</h2>
      {loading ? (
        <div className="h-64 flex items-center justify-center">Loading mood data...</div>
      ) : moodData.length === 0 ? (
        <div className="text-center py-8 bg-muted/30 rounded-lg border border-muted">
          <p className="text-muted-foreground">No mood data available for this patient.</p>
        </div>
      ) : (
        <MoodChart patientId={patientId} />
      )}
    </Card>
  );
}
