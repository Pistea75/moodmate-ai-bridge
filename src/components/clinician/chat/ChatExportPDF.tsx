
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { format } from 'date-fns';

interface LogEntry {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

interface ChatExportPDFProps {
  logs: LogEntry[];
  summary: string | null;
  patientName: string;
}

export const ChatExportPDF = ({ logs, summary, patientName }: ChatExportPDFProps) => {
  if (logs.length === 0) {
    return null;
  }

  const handleExport = async () => {
    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    
    // Set up fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Define positions and sizes
    const margin = 50;
    const fontSize = 11;
    const titleSize = 16;
    const headingSize = 14;
    const lineHeight = 16;
    
    let y = height - margin;
    
    // Add title
    page.drawText('AI Chat Log & Summary', {
      x: margin,
      y,
      size: titleSize,
      font: boldFont,
    });
    
    y -= lineHeight * 2;
    
    // Add patient info
    page.drawText(`Patient: ${patientName}`, {
      x: margin,
      y,
      size: fontSize,
      font: boldFont,
    });
    
    y -= lineHeight;
    
    // Add date info
    page.drawText(`Date Generated: ${format(new Date(), 'PPP')}`, {
      x: margin,
      y,
      size: fontSize,
      font,
    });
    
    y -= lineHeight * 2;
    
    // Add chat logs heading
    page.drawText('Chat Log Entries:', {
      x: margin,
      y,
      size: headingSize,
      font: boldFont,
    });
    
    y -= lineHeight * 1.5;
    
    // Format and add each chat log entry
    for (const log of logs) {
      const role = log.role === 'user' ? 'Patient' : 'AI Assistant';
      const dateStr = format(new Date(log.created_at), 'PPp');
      const header = `${role} - ${dateStr}`;
      
      // Add entry header
      page.drawText(header, {
        x: margin,
        y,
        size: fontSize,
        font: boldFont,
        color: log.role === 'user' ? rgb(0.2, 0.4, 0.8) : rgb(0.4, 0.4, 0.4),
      });
      
      y -= lineHeight;
      
      // Handle message wrapping
      const maxWidth = width - (margin * 2);
      const words = log.message.split(' ');
      let line = '';
      
      for (const word of words) {
        const testLine = line ? `${line} ${word}` : word;
        const testLineWidth = font.widthOfTextAtSize(testLine, fontSize);
        
        if (testLineWidth > maxWidth) {
          page.drawText(line, {
            x: margin,
            y,
            size: fontSize,
            font,
          });
          
          y -= lineHeight;
          line = word;
          
          // Add new page if needed
          if (y < margin) {
            page.drawText('(continued on next page)', {
              x: margin,
              y,
              size: fontSize,
              font: font,
              color: rgb(0.5, 0.5, 0.5),
            });
            
            const newPage = pdfDoc.addPage();
            y = height - margin;
            newPage.drawText('(continued from previous page)', {
              x: margin,
              y,
              size: fontSize,
              font: font,
              color: rgb(0.5, 0.5, 0.5),
            });
            
            y -= lineHeight * 1.5;
            page = newPage;
          }
        } else {
          line = testLine;
        }
      }
      
      // Draw the last line
      if (line) {
        page.drawText(line, {
          x: margin,
          y,
          size: fontSize,
          font,
        });
        y -= lineHeight;
      }
      
      y -= lineHeight; // Extra space between entries
      
      // Add new page if needed
      if (y < margin) {
        const newPage = pdfDoc.addPage();
        y = height - margin;
        page = newPage;
      }
    }
    
    // Add summary if available
    if (summary) {
      y -= lineHeight;
      
      page.drawText('Clinical Summary:', {
        x: margin,
        y,
        size: headingSize,
        font: boldFont,
      });
      
      y -= lineHeight * 1.5;
      
      // Handle summary wrapping (similar to message wrapping)
      const maxWidth = width - (margin * 2);
      const words = summary.split(' ');
      let line = '';
      
      for (const word of words) {
        const testLine = line ? `${line} ${word}` : word;
        const testLineWidth = font.widthOfTextAtSize(testLine, fontSize);
        
        if (testLineWidth > maxWidth) {
          page.drawText(line, {
            x: margin,
            y,
            size: fontSize,
            font,
          });
          
          y -= lineHeight;
          line = word;
          
          // Add new page if needed
          if (y < margin) {
            page.drawText('(continued on next page)', {
              x: margin,
              y,
              size: fontSize,
              font: font,
              color: rgb(0.5, 0.5, 0.5),
            });
            
            const newPage = pdfDoc.addPage();
            y = height - margin;
            newPage.drawText('(continued from previous page)', {
              x: margin,
              y,
              size: fontSize,
              font: font,
              color: rgb(0.5, 0.5, 0.5),
            });
            
            y -= lineHeight * 1.5;
            page = newPage;
          }
        } else {
          line = testLine;
        }
      }
      
      // Draw the last line
      if (line) {
        page.drawText(line, {
          x: margin,
          y,
          size: fontSize,
          font,
        });
      }
    }
    
    // Generate PDF bytes and save
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, `${patientName.replace(/\s+/g, '_')}_Chat_Log_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
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
