
export interface EnhancedSummaryDisplayProps {
  summary: string;
  patientName?: string;
  clinicianName?: string;
}

export interface ParsedSummary {
  overview: string;
  emotions: string[];
  distortions: string[];
  warnings: string[];
  strategies: string[];
  recommendations: string;
}
