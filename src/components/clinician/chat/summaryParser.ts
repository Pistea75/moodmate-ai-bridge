
import { ParsedSummary } from './types';

export function parseSummary(text: string): ParsedSummary {
  const sections: ParsedSummary = {
    overview: '',
    emotions: [],
    distortions: [],
    warnings: [],
    strategies: [],
    recommendations: ''
  };

  // Simple parsing logic - in a real implementation, this would be more sophisticated
  const lines = text.split('\n').filter(line => line.trim());
  let currentSection: keyof ParsedSummary = 'overview';
  
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
    } else if (currentSection === 'recommendations') {
      sections.recommendations += line + ' ';
    } else if (line.includes('•') || line.includes('-')) {
      const cleanLine = line.replace(/^[•\-\s]+/, '').trim();
      if (cleanLine && Array.isArray(sections[currentSection])) {
        (sections[currentSection] as string[]).push(cleanLine);
      }
    }
  });

  // If we couldn't parse properly, use the full summary as overview
  if (!sections.overview && sections.emotions.length === 0) {
    sections.overview = text;
  }

  return sections;
}
