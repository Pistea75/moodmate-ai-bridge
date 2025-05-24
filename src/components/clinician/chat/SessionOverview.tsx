
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface SessionOverviewProps {
  overview: string;
}

export const SessionOverview: FC<SessionOverviewProps> = ({ overview }) => {
  if (!overview) return null;

  return (
    <Card className="mb-6 border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          Session Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed">{overview}</p>
      </CardContent>
    </Card>
  );
};
