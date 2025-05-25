
import { PDFDocument, PDFPage, PDFFont, rgb, StandardFonts } from 'pdf-lib';
import { format } from 'date-fns';
import { LogEntry, PDFGenerationConfig } from './types';
import { sanitizeTextForPDF } from './textSanitizer';
import { wrapAndDrawText } from './textWrapper';

const defaultConfig: PDFGenerationConfig = {
  margin: 50,
  fontSize: 11,
  titleSize: 16,
  headingSize: 14,
  lineHeight: 16,
};

export class ChatPDFGenerator {
  private config: PDFGenerationConfig;
  
  constructor(config: Partial<PDFGenerationConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }
  
  async generatePDF(logs: LogEntry[], summary: string | null, patientName: string): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    let currentPage = pdfDoc.addPage();
    const { width, height } = currentPage.getSize();
    
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    let y = height - this.config.margin;
    
    // Add title and header
    currentPage = this.addHeader(currentPage, patientName, boldFont, font, y);
    y = height - this.config.margin - (this.config.lineHeight * 6);
    
    // Add chat logs
    const { finalY: afterLogsY, currentPage: pageAfterLogs } = await this.addChatLogs(
      logs, currentPage, pdfDoc, font, boldFont, y, width, height
    );
    
    // Add summary if available
    if (summary) {
      await this.addSummary(
        summary, pageAfterLogs, pdfDoc, font, boldFont, afterLogsY, width, height
      );
    }
    
    return await pdfDoc.save();
  }
  
  private addHeader(page: PDFPage, patientName: string, boldFont: PDFFont, font: PDFFont, startY: number): PDFPage {
    let y = startY;
    
    // Add title
    page.drawText('AI Chat Log & Summary', {
      x: this.config.margin,
      y,
      size: this.config.titleSize,
      font: boldFont,
    });
    
    y -= this.config.lineHeight * 2;
    
    // Add patient info
    const sanitizedPatientName = sanitizeTextForPDF(patientName);
    page.drawText(`Patient: ${sanitizedPatientName}`, {
      x: this.config.margin,
      y,
      size: this.config.fontSize,
      font: boldFont,
    });
    
    y -= this.config.lineHeight;
    
    // Add date info
    page.drawText(`Date Generated: ${format(new Date(), 'PPP')}`, {
      x: this.config.margin,
      y,
      size: this.config.fontSize,
      font,
    });
    
    y -= this.config.lineHeight * 2;
    
    // Add chat logs heading
    page.drawText('Chat Log Entries:', {
      x: this.config.margin,
      y,
      size: this.config.headingSize,
      font: boldFont,
    });
    
    return page;
  }
  
  private async addChatLogs(
    logs: LogEntry[], 
    page: PDFPage, 
    pdfDoc: PDFDocument, 
    font: PDFFont, 
    boldFont: PDFFont, 
    startY: number, 
    width: number, 
    height: number
  ): Promise<{ finalY: number; currentPage: PDFPage }> {
    let y = startY;
    let currentPage = page;
    
    for (const log of logs) {
      const role = log.role === 'user' ? 'Patient' : 'AI Assistant';
      const dateStr = format(new Date(log.created_at), 'PPp');
      const header = `${role} - ${dateStr}`;
      
      // Add entry header
      currentPage.drawText(header, {
        x: this.config.margin,
        y,
        size: this.config.fontSize,
        font: boldFont,
        color: log.role === 'user' ? rgb(0.2, 0.4, 0.8) : rgb(0.4, 0.4, 0.4),
      });
      
      y -= this.config.lineHeight;
      
      // Sanitize and wrap message content
      const sanitizedMessage = sanitizeTextForPDF(log.message);
      const maxWidth = width - (this.config.margin * 2);
      
      const { finalY, currentPage: updatedPage } = wrapAndDrawText({
        text: sanitizedMessage,
        font,
        fontSize: this.config.fontSize,
        maxWidth,
        margin: this.config.margin,
        lineHeight: this.config.lineHeight,
        startY: y,
        page: currentPage,
        pdfDoc,
        pageHeight: height,
      });
      
      y = finalY - this.config.lineHeight; // Extra space between entries
      currentPage = updatedPage;
      
      // Add new page if needed
      if (y < this.config.margin) {
        currentPage = pdfDoc.addPage();
        y = height - this.config.margin;
      }
    }
    
    return { finalY: y, currentPage };
  }
  
  private async addSummary(
    summary: string, 
    page: PDFPage, 
    pdfDoc: PDFDocument, 
    font: PDFFont, 
    boldFont: PDFFont, 
    startY: number, 
    width: number, 
    height: number
  ): Promise<void> {
    let y = startY - this.config.lineHeight;
    let currentPage = page;
    
    currentPage.drawText('Clinical Summary:', {
      x: this.config.margin,
      y,
      size: this.config.headingSize,
      font: boldFont,
    });
    
    y -= this.config.lineHeight * 1.5;
    
    // Sanitize and wrap summary content
    const sanitizedSummary = sanitizeTextForPDF(summary);
    const maxWidth = width - (this.config.margin * 2);
    
    wrapAndDrawText({
      text: sanitizedSummary,
      font,
      fontSize: this.config.fontSize,
      maxWidth,
      margin: this.config.margin,
      lineHeight: this.config.lineHeight,
      startY: y,
      page: currentPage,
      pdfDoc,
      pageHeight: height,
    });
  }
}
