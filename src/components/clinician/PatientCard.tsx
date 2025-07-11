import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Calendar, 
  Activity,
  AlertTriangle,
  Clock,
  MoreHorizontal,
  MessageSquare,
  UserPlus,
  Brain,
  Phone
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface PatientCardData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone?: string | null;
  status: 'active' | 'inactive' | 'at_risk' | 'pending';
  last_active_at: string | null;
  onboarding_completed: boolean;
  onboarding_step: number;
  // Additional computed fields
  lastMoodScore?: number;
  lastMoodDate?: string;
  upcomingSessionsCount?: number;
  riskLevel?: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  riskScore?: number;
}

interface PatientCardProps {
  patient: PatientCardData;
  onViewProfile: (patientId: string) => void;
  onAssessRisk: (patientId: string) => void;
  onStartOnboarding: (patientId: string) => void;
  onMessagePatient?: (patientId: string) => void;
}

export function PatientCard({ 
  patient, 
  onViewProfile, 
  onAssessRisk,
  onStartOnboarding,
  onMessagePatient 
}: PatientCardProps) {
  const [isAssessing, setIsAssessing] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'at_risk':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (riskLevel?: string) => {
    switch (riskLevel) {
      case 'LOW':
        return 'bg-green-100 text-green-800';
      case 'MODERATE':
        return 'bg-yellow-100 text-yellow-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'CRITICAL':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return first + last || 'P';
  };

  const formatLastActive = (lastActive?: string | null) => {
    if (!lastActive) return 'Never';
    const date = new Date(lastActive);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleQuickRiskAssess = async () => {
    try {
      setIsAssessing(true);
      
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('assess-patient-risk', {
        body: {
          patientId: patient.id,
          clinicianId: currentUser.user.id
        }
      });

      if (error) throw error;

      toast({
        title: 'Risk Assessment Complete',
        description: `Risk level: ${data?.summary?.riskLevel || 'Assessment completed'}`
      });

      onAssessRisk(patient.id);
    } catch (error: any) {
      console.error('Error assessing risk:', error);
      toast({
        title: 'Assessment Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsAssessing(false);
    }
  };

  const handleEmailContact = () => {
    if (patient.email) {
      window.location.href = `mailto:${patient.email}`;
    } else {
      toast({
        title: 'No Email Available',
        description: 'This patient does not have an email address on file.',
        variant: 'destructive'
      });
    }
  };

  const handlePhoneContact = () => {
    if (patient.phone) {
      window.location.href = `tel:${patient.phone}`;
    } else {
      toast({
        title: 'No Phone Number Available',
        description: 'This patient does not have a phone number on file.',
        variant: 'destructive'
      });
    }
  };

  const handleChatPatient = () => {
    if (onMessagePatient) {
      onMessagePatient(patient.id);
    } else {
      toast({
        title: 'Chat Feature Coming Soon',
        description: 'In-platform messaging will be available soon.',
      });
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow h-full">
      <CardContent className="p-4 h-full flex flex-col">
        {/* Header with patient info and actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                {getInitials(patient.first_name, patient.last_name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg truncate">
                {patient.first_name && patient.last_name 
                  ? `${patient.first_name} ${patient.last_name}`
                  : 'Unnamed Patient'
                }
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Mail className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{patient.email}</span>
              </div>
              {patient.phone && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Phone className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{patient.phone}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge className={getStatusColor(patient.status)}>
              {patient.status.replace('_', ' ')}
            </Badge>
            {patient.riskLevel && (
              <Badge className={getRiskColor(patient.riskLevel)}>
                {patient.riskLevel} Risk
              </Badge>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewProfile(patient.id)}>
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleQuickRiskAssess} disabled={isAssessing}>
                  <Brain className="h-4 w-4 mr-2" />
                  {isAssessing ? 'Assessing...' : 'AI Risk Assessment'}
                </DropdownMenuItem>
                {!patient.onboarding_completed && (
                  <DropdownMenuItem onClick={() => onStartOnboarding(patient.id)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Complete Onboarding
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Patient Stats */}
        <div className="grid grid-cols-3 gap-3 text-sm mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-600 text-xs">Last Mood</p>
              <p className="font-medium truncate">
                {patient.lastMoodScore ? `${patient.lastMoodScore}/10` : 'No data'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-600 text-xs">Sessions</p>
              <p className="font-medium truncate">
                {patient.upcomingSessionsCount || 0} upcoming
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-gray-600 text-xs">Last Active</p>
              <p className="font-medium truncate">
                {formatLastActive(patient.last_active_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-2 mb-4 flex-1">
          {/* Onboarding Status */}
          {!patient.onboarding_completed && (
            <div className="p-2 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                <span className="text-sm text-yellow-800">
                  Onboarding incomplete ({patient.onboarding_step || 0}/5 steps)
                </span>
              </div>
            </div>
          )}

          {/* Risk Assessment Alert */}
          {(patient.riskLevel === 'HIGH' || patient.riskLevel === 'CRITICAL') && (
            <div className="p-2 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-800">
                  {patient.riskLevel} risk - Consider immediate attention
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Contact and Action Buttons */}
        <div className="space-y-2 mt-auto">
          {/* Contact Buttons Row */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEmailContact}
              className="flex-1 min-w-0"
              disabled={!patient.email}
            >
              <Mail className="h-4 w-4 mr-1" />
              <span className="truncate">Email</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePhoneContact}
              className="flex-1 min-w-0"
              disabled={!patient.phone}
            >
              <Phone className="h-4 w-4 mr-1" />
              <span className="truncate">Call</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleChatPatient}
              className="flex-1 min-w-0"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              <span className="truncate">Chat</span>
            </Button>
          </div>
          
          {/* Main Action Buttons Row */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onViewProfile(patient.id)}
              className="flex-1"
            >
              <User className="h-4 w-4 mr-2" />
              View Profile
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleQuickRiskAssess}
              disabled={isAssessing}
              className="flex-shrink-0"
            >
              <Brain className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
