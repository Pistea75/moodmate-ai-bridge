
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

// Utility function to sanitize text for PDF export
const sanitizeTextForPDF = (text: string): string => {
  return text
    // Remove or replace unsupported characters
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
    .replace(/'/g, "'") // Replace smart quotes
    .replace(/"/g, '"') // Replace smart quotes
    .replace(/–/g, '-') // Replace em dash
    .replace(/—/g, '-') // Replace en dash
    .replace(/…/g, '...') // Replace ellipsis
    .trim();
};

export const ChatExportPDF = ({ logs, summary, patientName }: ChatExportPDFProps) => {
  if (logs.length === 0) {
    return null;
  }

  const handleExport = async () => {
    try {
      // Create PDF document
      const pdfDoc = await PDFDocument.create();
      let currentPage = pdfDoc.addPage();
      const { width, height } = currentPage.getSize();
      
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
      currentPage.drawText('AI Chat Log & Summary', {
        x: margin,
        y,
        size: titleSize,
        font: boldFont,
      });
      
      y -= lineHeight * 2;
      
      // Add patient info (sanitized)
      const sanitizedPatientName = sanitizeTextForPDF(patientName);
      currentPage.drawText(`Patient: ${sanitizedPatientName}`, {
        x: margin,
        y,
        size: fontSize,
        font: boldFont,
      });
      
      y -= lineHeight;
      
      // Add date info
      currentPage.drawText(`Date Generated: ${format(new Date(), 'PPP')}`, {
        x: margin,
        y,
        size: fontSize,
        font,
      });
      
      y -= lineHeight * 2;
      
      // Add chat logs heading
      currentPage.drawText('Chat Log Entries:', {
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
        currentPage.drawText(header, {
          x: margin,
          y,
          size: fontSize,
          font: boldFont,
          color: log.role === 'user' ? rgb(0.2, 0.4, 0.8) : rgb(0.4, 0.4, 0.4),
        });
        
        y -= lineHeight;
        
        // Sanitize message content
        const sanitizedMessage = sanitizeTextForPDF(log.message);
        
        // Handle message wrapping
        const maxWidth = width - (margin * 2);
        const words = sanitizedMessage.split(' ');
        let line = '';
        
        for (const word of words) {
          const testLine = line ? `${line} ${word}` : word;
          const testLineWidth = font.widthOfTextAtSize(testLine, fontSize);
          
          if (testLineWidth > maxWidth) {
            currentPage.drawText(line, {
              x: margin,
              y,
              size: fontSize,
              font,
            });
            
            y -= lineHeight;
            line = word;
            
            // Add new page if needed
            if (y < margin) {
              currentPage.drawText('(continued on next page)', {
                x: margin,
                y,
                size: fontSize,
                font: font,
                color: rgb(0.5, 0.5, 0.5),
              });
              
              currentPage = pdfDoc.addPage();
              y = height - margin;
              currentPage.drawText('(continued from previous page)', {
                x: margin,
                y,
                size: fontSize,
                font: font,
                color: rgb(0.5, 0.5, 0.5),
              });
              
              y -= lineHeight * 1.5;
            }
          } else {
            line = testLine;
          }
        }
        
        // Draw the last line
        if (line) {
          currentPage.drawText(line, {
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
          currentPage = pdfDoc.addPage();
          y = height - margin;
        }
      }
      
      // Add summary if available
      if (summary) {
        y -= lineHeight;
        
        currentPage.drawText('Clinical Summary:', {
          x: margin,
          y,
          size: headingSize,
          font: boldFont,
        });
        
        y -= lineHeight * 1.5;
        
        // Sanitize summary content
        const sanitizedSummary = sanitizeTextForPDF(summary);
        
        // Handle summary wrapping (similar to message wrapping)
        const maxWidth = width - (margin * 2);
        const words = sanitizedSummary.split(' ');
        let line = '';
        
        for (const word of words) {
          const testLine = line ? `${line} ${word}` : word;
          const testLineWidth = font.widthOfTextAtSize(testLine, fontSize);
          
          if (testLineWidth > maxWidth) {
            currentPage.drawText(line, {
              x: margin,
              y,
              size: fontSize,
              font,
            });
            
            y -= lineHeight;
            line = word;
            
            // Add new page if needed
            if (y < margin) {
              currentPage.drawText('(continued on next page)', {
                x: margin,
                y,
                size: fontSize,
                font: font,
                color: rgb(0.5, 0.5, 0.5),
              });
              
              currentPage = pdfDoc.addPage();
              y = height - margin;
              currentPage.drawText('(continued from previous page)', {
                x: margin,
                y,
                size: fontSize,
                font: font,
                color: rgb(0.5, 0.5, 0.5),
              });
              
              y -= lineHeight * 1.5;
            }
          } else {
            line = testLine;
          }
        }
        
        // Draw the last line
        if (line) {
          currentPage.drawText(line, {
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
      const sanitizedFileName = sanitizeTextForPDF(patientName).replace(/\s+/g, '_');
      saveAs(blob, `${sanitizedFileName}_Chat_Log_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // You can add a toast notification here if needed
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
