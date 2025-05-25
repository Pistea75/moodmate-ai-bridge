
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import { ChatExportPDFProps } from './pdf/types';
import { ChatPDFGenerator } from './pdf/pdfGenerator';
import { sanitizeTextForPDF } from './pdf/textSanitizer';

export const ChatExportPDF = ({ logs, summary, patientName }: ChatExportPDFProps) => {
  if (logs.length === 0) {
    return null;
  }

  const handleExport = async () => {
    try {
      const pdfGenerator = new ChatPDFGenerator();
      const pdfBytes = await pdfGenerator.generatePDF(logs, summary, patientName);
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const sanitizedFileName = sanitizeTextForPDF(patientName).replace(/\s+/g, '_');
      saveAs(blob, `${sanitizedFileName}_Chat_Log_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  
  return (
    <Button 
      onClick={handleExport} 
      variant="outline" 
      size="sm" 
      className="mt-2"
    >
      <FileDown className="mr-2 h-4 w-4" />
      Export as PDF
    </Button>
  );
};
