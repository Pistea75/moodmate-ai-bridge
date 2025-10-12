import { Clock, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { useVoiceMinutes } from '@/hooks/useVoiceMinutes';

export function VoiceMinutesIndicator() {
  const { voiceData, loading } = useVoiceMinutes();

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 animate-pulse" />
          <span className="text-sm text-muted-foreground">Cargando...</span>
        </div>
      </Card>
    );
  }

  if (!voiceData.canUse && voiceData.planType === 'free') {
    return (
      <Card className="p-4 bg-muted/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-background">
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Modo de voz no disponible</p>
            <p className="text-xs text-muted-foreground mt-1">
              Actualiza a Premium para conversaciones por voz en tiempo real
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (voiceData.isUnlimited) {
    return (
      <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Minutos ilimitados</p>
            <p className="text-xs text-muted-foreground mt-1">
              Plan Profesional - Sin límites de voz
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const percentageUsed = voiceData.minutesLimit > 0 
    ? (voiceData.minutesUsed / voiceData.minutesLimit) * 100 
    : 0;

  const getStatusColor = () => {
    if (percentageUsed >= 90) return 'text-destructive';
    if (percentageUsed >= 70) return 'text-orange-500';
    return 'text-primary';
  };

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${getStatusColor()}`} />
            <span className="text-sm font-medium">Minutos de voz</span>
          </div>
          <span className={`text-sm font-bold ${getStatusColor()}`}>
            {Math.floor(voiceData.minutesRemaining)} / {voiceData.minutesLimit} min
          </span>
        </div>
        
        <Progress value={percentageUsed} className="h-2" />
        
        {percentageUsed >= 90 && (
          <p className="text-xs text-destructive">
            ⚠️ Alcanzando límite mensual. Considera adquirir minutos adicionales.
          </p>
        )}
        
        {percentageUsed >= 100 && (
          <p className="text-xs text-destructive font-medium">
            Has alcanzado tu límite de minutos este mes. Puedes seguir chateando por texto.
          </p>
        )}
      </div>
    </Card>
  );
}
