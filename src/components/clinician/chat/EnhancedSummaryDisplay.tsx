
import { FC } from 'react';
import { AlertTriangle, Heart, Lightbulb, Brain } from 'lucide-react';
import { EnhancedSummaryDisplayProps } from './types';
import { parseSummary } from './summaryParser';
import { ReportHeader } from './ReportHeader';
import { SessionOverview } from './SessionOverview';
import { SummarySection } from './SummarySection';
import { FinalRecommendations } from './FinalRecommendations';

export const EnhancedSummaryDisplay: FC<EnhancedSummaryDisplayProps> = ({ 
  summary, 
  patientName = "Patient", 
  clinicianName = "Clinician" 
}) => {
  const sections = parseSummary(summary);

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl shadow-lg">
      <ReportHeader patientName={patientName} clinicianName={clinicianName} />
      
      <SessionOverview overview={sections.overview} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SummarySection
          title="Main Emotional Themes"
          icon={Heart}
          iconColor="text-pink-600"
          bulletColor="bg-pink-400"
          items={sections.emotions}
          fallbackText="Emotional themes will be identified from the conversation analysis."
        />

        <SummarySection
          title="Warning Signs or Concerns"
          icon={AlertTriangle}
          iconColor="text-orange-600"
          bulletColor="bg-orange-400"
          items={sections.warnings}
          fallbackText="No immediate warning signs identified in this session."
        />

        <SummarySection
          title="Cognitive Distortions"
          icon={Brain}
          iconColor="text-purple-600"
          bulletColor="bg-purple-400"
          items={sections.distortions}
          fallbackText="Cognitive patterns will be analyzed from the conversation."
        />

        <SummarySection
          title="Suggested Coping Strategies"
          icon={Lightbulb}
          iconColor="text-yellow-600"
          bulletColor="bg-yellow-400"
          items={sections.strategies}
          fallbackText="Personalized coping strategies will be recommended based on session content."
        />
      </div>

      <FinalRecommendations recommendations={sections.recommendations} />

      {/* Footer */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
        <span>Confidentiality Disclaimer: This report contains sensitive patient information.</span>
        <span>Page 1</span>
      </div>
    </div>
  );
};
