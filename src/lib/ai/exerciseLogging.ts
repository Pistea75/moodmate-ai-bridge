
import { supabase } from "@/integrations/supabase/client";

export async function logExercise(patientId: string, content: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('exercise_logs')
      .insert([
        {
          patient_id: patientId,
          exercise_text: content,
          completed: null, // null means pending
        },
      ]);

    if (error) {
      console.error('Failed to log exercise:', error.message);
    } else {
      console.log('✅ Exercise logged:', content.substring(0, 50) + '...');
    }
  } catch (error) {
    console.error('Error logging exercise:', error);
  }
}

export async function markExerciseCompleted(patientId: string, completed: boolean): Promise<void> {
  try {
    // Find the most recent incomplete exercise
    const { data, error } = await supabase
      .from('exercise_logs')
      .select('id')
      .eq('patient_id', patientId)
      .is('completed', null) // pending exercises
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error finding exercise to update:', error.message);
      return;
    }

    if (!data) {
      console.warn('No pending exercise found to mark as completed');
      return;
    }

    const { error: updateError } = await supabase
      .from('exercise_logs')
      .update({ 
        completed: completed,
        completed_at: completed ? new Date().toISOString() : null
      })
      .eq('id', data.id);

    if (updateError) {
      console.error('Failed to update exercise completion:', updateError.message);
    } else {
      console.log(`✅ Exercise marked as ${completed ? 'completed' : 'not completed'}`);
    }
  } catch (error) {
    console.error('Error updating exercise completion:', error);
  }
}

export async function hasUnconfirmedExercise(patientId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('exercise_logs')
      .select('id')
      .eq('patient_id', patientId)
      .is('completed', null) // pending exercises
      .limit(1);

    if (error) {
      console.error('Error checking for unconfirmed exercise:', error.message);
      return false;
    }

    return !!data?.length;
  } catch (error) {
    console.error('Error checking unconfirmed exercise:', error);
    return false;
  }
}

export async function getLatestPendingExercise(patientId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('exercise_logs')
      .select('exercise_text')
      .eq('patient_id', patientId)
      .is('completed', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error getting latest pending exercise:', error.message);
      return null;
    }

    return data?.exercise_text || null;
  } catch (error) {
    console.error('Error getting pending exercise:', error);
    return null;
  }
}
