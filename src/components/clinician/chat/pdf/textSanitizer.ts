
/**
 * Utility function to sanitize text for PDF export
 * Removes or replaces unsupported characters for PDF compatibility
 */
export const sanitizeTextForPDF = (text: string): string => {
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
