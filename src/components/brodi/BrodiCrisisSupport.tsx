import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Phone, MessageSquare, Heart, Shield, Clock } from 'lucide-react';
import { BrodiCharacter } from './BrodiCharacter';

interface CrisisAlert {
  severity: 'low' | 'moderate' | 'high' | 'critical';
  triggers: string[];
  timestamp: string;
  riskFactors: string[];
}

export function BrodiCrisisSupport() {
  const { user } = useAuth();
  const [crisisAlert, setCrisisAlert] = useState<CrisisAlert | null>(null);
  const [showSupport, setShowSupport] = useState(false);
  const [brodiActive, setBrodiActive] = useState(false);

  useEffect(() => {
    if (user) {
      checkCrisisIndicators();
      // Check every 30 minutes
      const interval = setInterval(checkCrisisIndicators, 30 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const checkCrisisIndicators = async () => {
    if (!user) return;

    try {
      // Get recent mood entries
      const { data: moods } = await supabase
        .from('mood_entries')
        .select('mood_score, notes, created_at')
        .eq('patient_id', user.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      // Get recent interactions with Brodi
      const { data: interactions } = await supabase
        .from('brodi_interactions')
        .select('interaction_type, user_response, created_at')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      const riskFactors = [];
      const triggers = [];

      // Check for crisis indicators
      if (moods && moods.length > 0) {
        const recentMoods = moods.slice(0, 3);
        const avgMood = recentMoods.reduce((sum, m) => sum + m.mood_score, 0) / recentMoods.length;
        
        if (avgMood <= 2) {
          riskFactors.push('Consistently low mood scores');
          triggers.push('low_mood');
        }

        // Check for crisis keywords in notes
        const crisisKeywords = ['suicidal', 'hopeless', 'worthless', 'end it all', 'can\'t go on', 'better off dead'];
        const hasResks = moods.some(m => 
          m.notes && crisisKeywords.some(keyword => 
            m.notes.toLowerCase().includes(keyword)
          )
        );

        if (hasResks) {
          riskFactors.push('Crisis language detected in mood notes');
          triggers.push('crisis_language');
        }
      }

      // Check interaction patterns
      if (interactions && interactions.length > 0) {
        const dismissedCount = interactions.filter(i => i.user_response === 'dismissed').length;
        if (dismissedCount > 5) {
          riskFactors.push('Avoiding support interactions');
          triggers.push('avoidance_pattern');
        }
      }

      // Determine severity
      let severity: CrisisAlert['severity'] = 'low';
      if (triggers.includes('crisis_language')) {
        severity = 'critical';
      } else if (triggers.length >= 2) {
        severity = 'high';
      } else if (triggers.length === 1) {
        severity = 'moderate';
      }

      // Create alert if needed
      if (triggers.length > 0) {
        const alert: CrisisAlert = {
          severity,
          triggers,
          timestamp: new Date().toISOString(),
          riskFactors
        };

        setCrisisAlert(alert);

        // Show support interface for high/critical alerts
        if (severity === 'high' || severity === 'critical') {
          setShowSupport(true);
          setBrodiActive(true);
        }

        // Notify clinician for critical alerts
        if (severity === 'critical') {
          await notifyClinicianOfCrisis(alert);
        }
      }

    } catch (error) {
      console.error('Error checking crisis indicators:', error);
    }
  };

  const notifyClinicianOfCrisis = async (alert: CrisisAlert) => {
    try {
      // Get the patient's clinician
      const { data: clinicianLink } = await supabase
        .from('patient_clinician_links')
        .select('clinician_id')
        .eq('patient_id', user?.id)
        .single();

      if (clinicianLink) {
        // Create high-priority notification
        await supabase
          .from('notifications')
          .insert({
            user_id: clinicianLink.clinician_id,
            type: 'crisis_alert',
            title: 'URGENT: Crisis Alert',
            description: `Patient showing crisis indicators. Immediate attention required.`,
            priority: 'critical',
            metadata: {
              patient_id: user?.id,
              alert_severity: alert.severity,
              triggers: alert.triggers,
              timestamp: alert.timestamp
            }
          });
      }
    } catch (error) {
      console.error('Error notifying clinician:', error);
    }
  };

  const handleEmergencyContact = (type: 'call' | 'text') => {
    if (type === 'call') {
      window.location.href = 'tel:988'; // Suicide & Crisis Lifeline
    } else {
      window.location.href = 'sms:741741'; // Crisis Text Line
    }
  };

  const handleSafetyPlan = () => {
    // Navigate to safety plan or show resources
    setShowSupport(true);
  };

  const getCrisisMessage = (severity: string) => {
    switch (severity) {
      case 'critical':
        return "I'm really concerned about you right now. You don't have to go through this alone. Please reach out for immediate support. 💙";
      case 'high':
        return "I've noticed you might be struggling more than usual. Let's make sure you have the support you need. 🤗";
      case 'moderate':
        return "I'm here to support you. Sometimes reaching out can make a big difference. 💙";
      default:
        return "Remember, I'm always here if you need support. You matter. 💙";
    }
  };

  if (!crisisAlert) return null;

  return (
    <>
      {showSupport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Shield className="h-5 w-5" />
                Crisis Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  If you're having thoughts of suicide or self-harm, please reach out immediately.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Emergency Resources:</h4>
                
                <Button 
                  className="w-full justify-start gap-2 bg-red-600 hover:bg-red-700"
                  onClick={() => handleEmergencyContact('call')}
                >
                  <Phone className="h-4 w-4" />
                  Call 988 - Crisis Lifeline
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2 border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => handleEmergencyContact('text')}
                >
                  <MessageSquare className="h-4 w-4" />
                  Text HOME to 741741
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full justify-start gap-2"
                  onClick={handleSafetyPlan}
                >
                  <Heart className="h-4 w-4" />
                  View Safety Plan
                </Button>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold text-sm mb-2">Coping Strategies:</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Take slow, deep breaths</li>
                  <li>• Call a trusted friend or family member</li>
                  <li>• Use grounding techniques (5-4-3-2-1 method)</li>
                  <li>• Remove means of self-harm</li>
                  <li>• Stay in a safe space with others</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowSupport(false)}
                  className="flex-1"
                >
                  I'm Safe
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => handleEmergencyContact('call')}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Get Help Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {brodiActive && (
        <BrodiCharacter
          message={getCrisisMessage(crisisAlert.severity)}
          type="mood_reminder"
          onDismiss={() => setBrodiActive(false)}
          onEngaged={() => {
            setBrodiActive(false);
            setShowSupport(true);
          }}
          showActions={true}
        />
      )}

      {crisisAlert.severity === 'moderate' && !showSupport && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm text-yellow-800">
                  We've noticed you might need some extra support today.
                </p>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowSupport(true)}
                className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
              >
                Resources
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}