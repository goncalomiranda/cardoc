const axios = require("axios");
const { exec } = require("child_process");
const { promisify } = require("util");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");

const execAsync = promisify(exec);

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.2:3b";
const OLLAMA_TIMEOUT = parseInt(process.env.OLLAMA_TIMEOUT) || 60000; // 60 seconds default for text models

/**
 * Extract text from PDF using Tesseract OCR
 * DEPRECATED: Use Document Intelligence API instead (AI_PROVIDER=document-intelligence)
 * This function is kept for backward compatibility but requires tesseract.js
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<{text: string, timeSeconds: number}>} - Extracted text and time taken
 */
async function extractTextFromPDF(pdfBuffer) {
  throw new Error(
    "PDF OCR extraction not available. Please use Document Intelligence API (AI_PROVIDER=document-intelligence) for PDF processing with OCR."
  );
}

/**
 * Extract text from PDF and summarize using Ollama text model
 * DEPRECATED: Use Document Intelligence API instead (AI_PROVIDER=document-intelligence)
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<string>} - Summary
 */
async function extractAndSummarizePDF(pdfBuffer) {
  throw new Error(
    "PDF processing with Ollama not available. Please use Document Intelligence API (AI_PROVIDER=document-intelligence) for PDF processing."
  );
}

/**
 * Get summary using Ollama text model
 * @param {string} text - Text to summarize
 * @returns {Promise<{summary: string, timeSeconds: number}>} - Summary and time taken
 */
async function getSummary(text) {
  const startTime = Date.now();

  try {
    const prompt =
      process.env.OLLAMA_TEXT_PROMPT ||
      `You are an expert car appraiser and negotiation advisor. Analyze this car document and provide:

1. KEY VEHICLE DETAILS: Make, model, year, mileage, VIN, registration info
2. CONDITION ASSESSMENT: Note any mentioned damage, wear, or issues
3. NEGOTIATION OPPORTUNITIES: Identify 2-3 specific points where you could negotiate a better price (e.g., high mileage, older model year, cosmetic issues, missing features, service history gaps)
4. MONEY-SAVING TIPS: Suggest where to save costs (e.g., request maintenance records, negotiate based on market value, point out common issues for this model)

Be specific and actionable. Format clearly with sections.

Document text:
`;

    console.log("Sending text to Ollama for summarization...");
    console.log("Text length:", text.length);

    const response = await axios.post(
      `${OLLAMA_API_URL}/api/generate`,
      {
        model: OLLAMA_MODEL,
        prompt: prompt + text,
        stream: false,
      },
      {
        timeout: OLLAMA_TIMEOUT,
      }
    );

    const summary = response.data.response ? response.data.response.trim() : "";
    const llmTime = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`Summary received in ${llmTime}s, length: ${summary.length}`);

    if (!summary) {
      throw new Error("Empty summary received from Ollama");
    }

    return {
      summary,
      timeSeconds: parseFloat(llmTime),
    };
  } catch (error) {
    console.error("Ollama summary error:", error.message);
    throw new Error("Failed to get summary from Ollama: " + error.message);
  }
}

module.exports = {
  extractTextFromPDF,
  extractAndSummarizePDF,
  getSummary,
};
