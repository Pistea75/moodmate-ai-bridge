
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ReportViewerModalProps {
  open: boolean;
  onClose: () => void;
  report: {
    id: string;
    title: string;
    content: string;
    chat_date: string;
    report_type: string;
    status: string;
  } | null;
  onDownload: (report: any) => void;
}

export function ReportViewerModal({ open, onClose, report, onDownload }: ReportViewerModalProps) {
  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{report.title}</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-muted-foreground mb-2">
          <p><strong>Type:</strong> {report.report_type}</p>
          <p><strong>Status:</strong> {report.status}</p>
          <p><strong>Date:</strong> {new Date(report.chat_date).toLocaleDateString()}</p>
        </div>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-muted/10 text-sm whitespace-pre-wrap">
          {report.content || "This report has no content."}
        </ScrollArea>
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => onDownload(report)}
            disabled={!report.content}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
