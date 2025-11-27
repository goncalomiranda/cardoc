// backend/services/pdfExtractor.js
const pdf = require("pdf-parse");
const Tesseract = require("tesseract.js");
const { PDFDocument } = require("pdf-lib");
const { createCanvas } = require("canvas");
const { fromBuffer } = require("pdf2pic");

// Extract text from PDF with OCR fallback
async function extractTextFromPDF(buffer) {
  let text = "";

  // Step 1: Try pdf-parse
  try {
    const data = await pdf(buffer);
    if (data.text && data.text.trim().length > 0) {
      return data.text;
    }
  } catch (err) {
    console.log("pdf-parse failed:", err.message);
  }

  // Step 2: OCR fallback using pdf2pic + tesseract.js
  try {
    console.log("Falling back to OCR...");
    const pdfDoc = await PDFDocument.load(buffer);
    const numPages = pdfDoc.getPages().length;
    const options = {
      density: 150,
      format: "png",
      width: 1200,
      height: 1600,
      savePath: null, // Don't save to disk
    };
    const convert = fromBuffer(buffer, options);
    for (let i = 1; i <= numPages; i++) {
      // Convert page to image buffer
      const result = await convert(i, false);
      const imageBuffer = result.base64
        ? Buffer.from(result.base64, "base64")
        : result.path;
      // OCR the image
      const {
        data: { text: ocrText },
      } = await Tesseract.recognize(imageBuffer, "eng", {
        logger: (m) => console.log(m.status),
      });
      text += ocrText + "\n";
    }
    if (text.trim().length > 0) return text;
    else throw new Error("OCR returned empty text");
  } catch (ocrError) {
    console.log("OCR failed:", ocrError.message);
    throw new Error(
      "Failed to extract text from PDF. It may be scanned, corrupted, or too large."
    );
  }
}

module.exports = { extractTextFromPDF };
