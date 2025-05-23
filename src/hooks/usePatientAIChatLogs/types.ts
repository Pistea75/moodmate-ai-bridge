
export interface LogEntry {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

export interface UseChatLogsResult {
  logs: LogEntry[];
  loading: boolean;
  summary: string | null;
  summarizing: boolean;
  savingReport: boolean;
  patientName: string;
  startDate: Date | null;
  endDate: Date | null;
  isFilterActive: boolean;
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  handleApplyFilter: () => void;
  handleClearFilter: () => void;
  handleSummarize: () => Promise<void>;
  handleSaveReport: () => Promise<void>;
  refreshLogs: () => Promise<void>;
}
