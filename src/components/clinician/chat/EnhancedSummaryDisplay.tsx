
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, AlertTriangle, Heart, Lightbulb, MessageSquare, User } from 'lucide-react';

interface EnhancedSummaryDisplayProps {
  summary: string;
  patientName?: string;
  clinicianName?: string;
}

export const EnhancedSummaryDisplay: FC<EnhancedSummaryDisplayProps> = ({ 
  summary, 
  patientName = "Patient", 
  clinicianName = "Clinician" 
}) => {
  // Parse the summary to extract structured sections
  const parseSummary = (text: string) => {
    const sections = {
      overview: '',
      emotions: [] as string[],
      distortions: [] as string[],
      warnings: [] as string[],
      strategies: [] as string[],
      recommendations: ''
    };

    // Simple parsing logic - in a real implementation, this would be more sophisticated
    const lines = text.split('\n').filter(line => line.trim());
    let currentSection = 'overview';
    
    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('emotion') || lowerLine.includes('feeling') || lowerLine.includes('mood')) {
        currentSection = 'emotions';
      } else if (lowerLine.includes('distortion') || lowerLine.includes('thinking') || lowerLine.includes('thought')) {
        currentSection = 'distortions';
      } else if (lowerLine.includes('warning') || lowerLine.includes('concern') || lowerLine.includes('risk')) {
        currentSection = 'warnings';
      } else if (lowerLine.includes('strategy') || lowerLine.includes('coping') || lowerLine.includes('technique')) {
        currentSection = 'strategies';
      } else if (lowerLine.includes('recommend') || lowerLine.includes('suggest') || lowerLine.includes('next')) {
        currentSection = 'recommendations';
      }

      if (currentSection === 'overview' && !line.includes(':')) {
        sections.overview += line + ' ';
      } else if (line.includes('•') || line.includes('-')) {
        const cleanLine = line.replace(/^[•\-\s]+/, '').trim();
        if (cleanLine) {
          sections[currentSection as keyof typeof sections].push?.(cleanLine) || 
          (sections[currentSection as keyof typeof sections] += cleanLine + ' ');
        }
      }
    });

    // If we couldn't parse properly, use the full summary as overview
    if (!sections.overview && sections.emotions.length === 0) {
      sections.overview = text;
    }

    return sections;
  };

  const sections = parseSummary(summary);

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl shadow-lg">
      {/* Header */}
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

      {/* Session Overview */}
      {sections.overview && (
        <Card className="mb-6 border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Session Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">{sections.overview}</p>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Main Emotional Themes */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Heart className="h-5 w-5 text-pink-600" />
              Main Emotional Themes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sections.emotions.length > 0 ? (
              <ul className="space-y-2">
                {sections.emotions.map((emotion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{emotion}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 italic">
                Emotional themes will be identified from the conversation analysis.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Warning Signs or Concerns */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Warning Signs or Concerns
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sections.warnings.length > 0 ? (
              <ul className="space-y-2">
                {sections.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{warning}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 italic">
                No immediate warning signs identified in this session.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cognitive Distortions */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-purple-600" />
              Cognitive Distortions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sections.distortions.length > 0 ? (
              <ul className="space-y-2">
                {sections.distortions.map((distortion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{distortion}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 italic">
                Cognitive patterns will be analyzed from the conversation.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Suggested Coping Strategies */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Suggested Coping Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sections.strategies.length > 0 ? (
              <ul className="space-y-2">
                {sections.strategies.map((strategy, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{strategy}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500 italic">
                Personalized coping strategies will be recommended based on session content.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Final Recommendations */}
      {sections.recommendations && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Final Recommendations for Clinician</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-700 leading-relaxed">{sections.recommendations}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
        <span>Confidentiality Disclaimer: This report contains sensitive patient information.</span>
        <span>Page 1</span>
      </div>
    </div>
  );
};
