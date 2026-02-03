const axios = require("axios");
const FormData = require("form-data");

const API_URL =
  process.env.DOCUMENT_INTELLIGENCE_API_URL ||
  "https://docsummary.shaihulud.org/api/v1";
const API_KEY = process.env.DOCUMENT_INTELLIGENCE_API_KEY || "";

/**
 * Analyze document using Document Intelligence API
 * @param {Buffer} fileBuffer - The file buffer (PDF, PNG, or JPEG)
 * @param {string} mimeType - The MIME type of the file
 * @param {string} customPrompt - Optional custom prompt for analysis
 * @returns {Promise<string>} - The analysis/summary text
 */
async function analyzeDocument(fileBuffer, mimeType, customPrompt = null) {
  try {
    if (!API_KEY) {
      throw new Error(
        "DOCUMENT_INTELLIGENCE_API_KEY not configured in environment"
      );
    }

    // Create form data
    const formData = new FormData();

    // Determine file extension from mime type
    let filename = "document";
    if (mimeType === "application/pdf") {
      filename = "document.pdf";
    } else if (mimeType === "image/png") {
      filename = "document.png";
    } else if (mimeType === "image/jpeg") {
      filename = "document.jpg";
    }

    formData.append("file", fileBuffer, {
      filename,
      contentType: mimeType,
    });

    // Prepare headers
    const headers = {
      ...formData.getHeaders(),
      "x-api-key": API_KEY,
    };

    // Add custom prompt if provided
    if (customPrompt) {
      headers["x-prompt"] = customPrompt;
    }

    console.log(`Sending ${mimeType} document to Document Intelligence API...`);

    const response = await axios.post(
      `${API_URL}/documents/analyze`,
      formData,
      {
        headers,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 120000, // 2 minute timeout for OCR + LLM processing
      }
    );

    if (
      !response.data ||
      !response.data.success ||
      !response.data.data ||
      !response.data.data.analysis
    ) {
      throw new Error("Invalid response from Document Intelligence API");
    }

    console.log(
      `Document Intelligence API analysis received: ${response.data.data.analysis.length} characters`
    );

    return response.data.data.analysis;
  } catch (error) {
    console.error("Document Intelligence API error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    throw new Error(`Document Intelligence API failed: ${error.message}`);
  }
}

/**
 * Check if Document Intelligence API is available
 * @returns {Promise<boolean>}
 */
async function checkHealth() {
  try {
    const response = await axios.get(`${API_URL}/health`, {
      timeout: 5000,
    });
    return response.data && response.data.status === "healthy";
  } catch (error) {
    console.error(
      "Document Intelligence API health check failed:",
      error.message
    );
    return false;
  }
}

module.exports = {
  analyzeDocument,
  checkHealth,
};
