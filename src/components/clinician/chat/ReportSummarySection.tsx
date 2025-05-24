
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface ReportSummarySectionProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  bulletColor: string;
  items: string[];
  fallbackText: string;
}

export const ReportSummarySection: FC<ReportSummarySectionProps> = ({
  title,
  icon: Icon,
  iconColor,
  bulletColor,
  items,
  fallbackText
}) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full ${bulletColor} mt-2 flex-shrink-0`} />
                <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic text-sm">{fallbackText}</p>
        )}
      </CardContent>
    </Card>
  );
};
