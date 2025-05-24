
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FinalRecommendationsProps {
  recommendations: string;
}

export const FinalRecommendations: FC<FinalRecommendationsProps> = ({ recommendations }) => {
  if (!recommendations) return null;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Final Recommendations for Clinician</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-700 leading-relaxed">{recommendations}</p>
        </div>
      </CardContent>
    </Card>
  );
};
