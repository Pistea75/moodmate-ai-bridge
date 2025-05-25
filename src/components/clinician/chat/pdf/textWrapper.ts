
import { StandardFonts, PDFFont, PDFPage, rgb } from 'pdf-lib';

interface TextWrapperOptions {
  text: string;
  font: PDFFont;
  fontSize: number;
  maxWidth: number;
  margin: number;
  lineHeight: number;
  startY: number;
  page: PDFPage;
  pdfDoc: any;
  pageHeight: number;
}

interface TextWrapperResult {
  finalY: number;
  currentPage: PDFPage;
}

export const wrapAndDrawText = (options: TextWrapperOptions): TextWrapperResult => {
  const { text, font, fontSize, maxWidth, margin, lineHeight, startY, pdfDoc, pageHeight } = options;
  let { page } = options;
  let y = startY;
  
  const words = text.split(' ');
  let line = '';
  
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const testLineWidth = font.widthOfTextAtSize(testLine, fontSize);
    
    if (testLineWidth > maxWidth) {
      // Draw the current line
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
        
        page = pdfDoc.addPage();
        y = pageHeight - margin;
        page.drawText('(continued from previous page)', {
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
    page.drawText(line, {
      x: margin,
      y,
      size: fontSize,
      font,
    });
    y -= lineHeight;
  }
  
  return { finalY: y, currentPage: page };
};
