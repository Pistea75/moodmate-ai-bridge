
export interface LogEntry {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

export interface ChatExportPDFProps {
  logs: LogEntry[];
  summary: string | null;
  patientName: string;
}

export interface PDFGenerationConfig {
  margin: number;
  fontSize: number;
  titleSize: number;
  headingSize: number;
  lineHeight: number;
}
