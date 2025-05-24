
import { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { Brain, User } from 'lucide-react';

interface ReportHeaderProps {
  patientName: string;
  clinicianName: string;
}

export const ReportHeader: FC<ReportHeaderProps> = ({ patientName, clinicianName }) => {
  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-purple-100 p-2 rounded-lg">
          <Brain className="h-6 w-6 text-purple-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">AI Chat Summary Report</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-800 mb-2">
            Patient
          </Badge>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{patientName}</span>
          </div>
        </div>
        <div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 mb-2">
            Clinician
          </Badge>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{clinicianName}</span>
          </div>
        </div>
        <div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 mb-2">
            Date
          </Badge>
          <div className="font-medium">{new Date().toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );
};
