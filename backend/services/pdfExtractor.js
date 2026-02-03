// backend/services/pdfExtractor.js
// Simplified PDF text extraction (no OCR fallback)
// For production, use Document Intelligence API instead

// Basic text extraction from PDF (no heavy dependencies)
async function extractTextFromPDF(buffer) {
  // This is a placeholder for legacy Gemini support
  // In production, you should use the Document Intelligence API
  // which handles both OCR and text extraction

  throw new Error(
    "PDF text extraction not available. Please use Document Intelligence API (AI_PROVIDER=document-intelligence) for PDF processing."
  );
}

module.exports = {
  extractTextFromPDF,
};
