
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { RiskAssessment, getRiskColor } from "@/lib/utils/riskScoring";

interface PatientRiskCardProps {
  patientId: string;
  patientName: string;
  riskAssessment: RiskAssessment;
  onViewDetails?: () => void;
}

export function PatientRiskCard({ 
  patientId, 
  patientName, 
  riskAssessment,
  onViewDetails 
}: PatientRiskCardProps) {
  const getRiskIcon = (level: RiskAssessment['level']) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high': return <TrendingDown className="h-4 w-4 text-orange-500" />;
      case 'medium': return <Minus className="h-4 w-4 text-yellow-500" />;
      case 'low': return <TrendingUp className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onViewDetails}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{patientName}</CardTitle>
          <div className="flex items-center gap-2">
            {getRiskIcon(riskAssessment.level)}
            <Badge className={getRiskColor(riskAssessment.level)}>
              {riskAssessment.level.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Risk Score</span>
            <span className="font-medium">{riskAssessment.score}/100</span>
          </div>
          <Progress value={riskAssessment.score} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Mood Trend</span>
            <div className="font-medium flex items-center gap-1">
              {riskAssessment.factors.moodTrend > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              {Math.abs(Math.round(riskAssessment.factors.moodTrend))}%
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Attendance</span>
            <div className="font-medium">{Math.round(riskAssessment.factors.sessionAttendance)}%</div>
          </div>
        </div>

        {riskAssessment.recommendations.length > 0 && (
          <div className="bg-muted/30 p-3 rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Top Recommendation:</p>
            <p className="text-sm">{riskAssessment.recommendations[0]}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
