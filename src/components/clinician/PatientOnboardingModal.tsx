import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Circle, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  FileText,
  MessageSquare,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PatientOnboardingModalProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  currentStep: number;
  onComplete: () => void;
}

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Basic Information',
    description: 'Verify patient contact details',
    icon: User
  },
  {
    id: 2,
    title: 'Emergency Contact',
    description: 'Add emergency contact information',
    icon: Phone
  },
  {
    id: 3,
    title: 'Initial Assessment',
    description: 'Complete intake assessment',
    icon: FileText
  },
  {
    id: 4,
    title: 'Treatment Goals',
    description: 'Set initial treatment objectives',
    icon: Calendar
  },
  {
    id: 5,
    title: 'Welcome Message',
    description: 'Send welcome and next steps',
    icon: MessageSquare
  }
];

interface OnboardingData {
  phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  initial_assessment?: string;
  treatment_goals?: string;
  welcome_message?: string;
}

export function PatientOnboardingModal({
  open,
  onClose,
  patientId,
  patientName,
  currentStep,
  onComplete
}: PatientOnboardingModalProps) {
  const [activeStep, setActiveStep] = useState(currentStep);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && patientId) {
      loadOnboardingData();
    }
  }, [open, patientId]);

  const loadOnboardingData = async () => {
    try {
      setLoading(true);
      // Load any existing onboarding data from patient profile or separate table
      // For now, we'll use the profiles table extended fields
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', patientId)
        .single();

      if (error) throw error;

      // Extract onboarding-related data
      setOnboardingData({
        phone: data.phone || '',
        emergency_contact_name: data.emergency_contact_name || '',
        emergency_contact_phone: data.emergency_contact_phone || '',
        initial_assessment: data.initial_assessment || '',
        treatment_goals: data.treatment_goals || '',
        welcome_message: data.welcome_message || ''
      });
    } catch (error: any) {
      console.error('Error loading onboarding data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load onboarding data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const saveStepData = async (stepData: Partial<OnboardingData>) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          ...stepData,
          onboarding_step: activeStep,
          last_active_at: new Date().toISOString()
        })
        .eq('id', patientId);

      if (error) throw error;

      setOnboardingData(prev => ({ ...prev, ...stepData }));
      
      toast({
        title: 'Progress saved',
        description: `Step ${activeStep} completed successfully`
      });
    } catch (error: any) {
      console.error('Error saving step data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save progress',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          onboarding_step: 5,
          status: 'active',
          last_active_at: new Date().toISOString()
        })
        .eq('id', patientId);

      if (error) throw error;

      toast({
        title: 'Onboarding Complete!',
        description: `${patientName} has been successfully onboarded`
      });

      onComplete();
      onClose();
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete onboarding',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-4">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="Enter patient's phone number"
              value={onboardingData.phone || ''}
              onChange={(e) => setOnboardingData(prev => ({ ...prev, phone: e.target.value }))}
            />
            <p className="text-sm text-gray-600">
              Verify and update the patient's contact information.
            </p>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="emergency-name">Emergency Contact Name</Label>
              <Input
                id="emergency-name"
                placeholder="Full name of emergency contact"
                value={onboardingData.emergency_contact_name || ''}
                onChange={(e) => setOnboardingData(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="emergency-phone">Emergency Contact Phone</Label>
              <Input
                id="emergency-phone"
                placeholder="Emergency contact phone number"
                value={onboardingData.emergency_contact_phone || ''}
                onChange={(e) => setOnboardingData(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <Label htmlFor="assessment">Initial Assessment Notes</Label>
            <Textarea
              id="assessment"
              placeholder="Record initial assessment findings, presenting concerns, and preliminary observations..."
              className="min-h-[120px]"
              value={onboardingData.initial_assessment || ''}
              onChange={(e) => setOnboardingData(prev => ({ ...prev, initial_assessment: e.target.value }))}
            />
            <p className="text-sm text-gray-600">
              Document the patient's current state, concerns, and initial clinical impressions.
            </p>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <Label htmlFor="goals">Treatment Goals</Label>
            <Textarea
              id="goals"
              placeholder="Define specific, measurable treatment objectives and expected outcomes..."
              className="min-h-[120px]"
              value={onboardingData.treatment_goals || ''}
              onChange={(e) => setOnboardingData(prev => ({ ...prev, treatment_goals: e.target.value }))}
            />
            <p className="text-sm text-gray-600">
              Set clear, achievable goals that will guide the treatment process.
            </p>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <Label htmlFor="welcome">Welcome Message</Label>
            <Textarea
              id="welcome"
              placeholder="Craft a personalized welcome message with next steps and expectations..."
              className="min-h-[120px]"
              value={onboardingData.welcome_message || `Hello ${patientName},\n\nWelcome to our practice! I'm excited to work with you on your mental health journey. Here's what you can expect:\n\n• Regular check-ins and mood tracking\n• Personalized therapeutic exercises\n• Secure communication through our platform\n\nYour first session is scheduled soon. Please don't hesitate to reach out if you have any questions.\n\nBest regards,\nYour Clinical Team`}
              onChange={(e) => setOnboardingData(prev => ({ ...prev, welcome_message: e.target.value }))}
            />
            <p className="text-sm text-gray-600">
              This message will be sent to the patient after onboarding completion.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const handleNext = async () => {
    // Save current step data
    const stepData: Partial<OnboardingData> = {};
    
    switch (activeStep) {
      case 1:
        stepData.phone = onboardingData.phone;
        break;
      case 2:
        stepData.emergency_contact_name = onboardingData.emergency_contact_name;
        stepData.emergency_contact_phone = onboardingData.emergency_contact_phone;
        break;
      case 3:
        stepData.initial_assessment = onboardingData.initial_assessment;
        break;
      case 4:
        stepData.treatment_goals = onboardingData.treatment_goals;
        break;
      case 5:
        stepData.welcome_message = onboardingData.welcome_message;
        break;
    }

    await saveStepData(stepData);

    if (activeStep === 5) {
      await completeOnboarding();
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const progressPercentage = (activeStep / 5) * 100;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Onboarding: {patientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {activeStep} of 5</span>
              <span>{Math.round(progressPercentage)}% complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Steps Overview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Onboarding Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {ONBOARDING_STEPS.map((step) => {
                  const Icon = step.icon;
                  const isCompleted = step.id < activeStep;
                  const isCurrent = step.id === activeStep;
                  
                  return (
                    <div 
                      key={step.id}
                      className={`flex items-center gap-3 p-2 rounded-lg ${
                        isCurrent ? 'bg-blue-50 border border-blue-200' : ''
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className={`h-5 w-5 ${isCurrent ? 'text-blue-600' : 'text-gray-400'}`} />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-4 w-4 ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`} />
                          <span className={`font-medium ${isCurrent ? 'text-blue-900' : 'text-gray-700'}`}>
                            {step.title}
                          </span>
                          {isCompleted && <Badge variant="secondary" className="text-xs">Complete</Badge>}
                          {isCurrent && <Badge className="text-xs">Current</Badge>}
                        </div>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Current Step Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {React.createElement(ONBOARDING_STEPS[activeStep - 1]?.icon, { className: "h-5 w-5" })}
                {ONBOARDING_STEPS[activeStep - 1]?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading...</div>
              ) : (
                renderStepContent()
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
              disabled={activeStep === 1 || saving}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={saving}
            >
              {saving ? 'Saving...' : activeStep === 5 ? 'Complete Onboarding' : 'Next'}
              {activeStep < 5 && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}