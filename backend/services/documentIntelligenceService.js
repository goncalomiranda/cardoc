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
 * @param {string} documentType - The type of document being analyzed
 * @returns {Promise<string>} - The analysis/summary text
 */
async function analyzeDocument(
  fileBuffer,
  mimeType,
  customPrompt = null,
  documentType = "not-sure",
) {
  try {
    if (!API_KEY) {
      throw new Error(
        "DOCUMENT_INTELLIGENCE_API_KEY not configured in environment",
      );
    }

    // Map document type to human-readable label
    const documentTypeLabels = {
      "not-sure": "Unknown - Auto-detect",
      "residential-lease": "Residential lease / rental agreement",
      "lease-renewal": "Lease renewal / amendment",
      "commercial-lease": "Commercial lease",
      "property-purchase": "Property purchase agreement",
      "mortgage-agreement": "Mortgage agreement",
      "condo-bylaws": "Condo bylaws / condo rules",
      "home-insurance": "Home insurance policy",
      "vehicle-purchase": "Vehicle purchase agreement",
      "auto-loan": "Auto loan agreement",
      "vehicle-lease": "Vehicle lease",
      "extended-warranty": "Extended warranty",
      "auto-insurance": "Insurance policy (auto)",
      "rideshare-agreement": "Ride-share / fleet agreements",
      "employment-contract": "Employment contract",
      "contractor-agreement": "Independent contractor agreement",
      "offer-letter": "Offer letter",
      "non-compete": "Non-compete / non-solicit",
      "severance-agreement": "Severance agreement",
      nda: "NDA / confidentiality agreement",
      "union-agreement": "Union agreement (collective agreement)",
      "personal-loan": "Personal loan agreement",
      "line-of-credit": "Line of credit",
      "credit-card": "Credit card agreement",
      "mortgage-renewal": "Mortgage renewal",
      "investment-account": "Investment account agreement",
      "rrsp-tfsa": "RRSP / TFSA terms",
      "debt-settlement": "Debt settlement agreement",
      "cra-notice": "CRA notices",
      "tax-assessment": "Tax assessments",
      "payment-plan": "Payment plans",
      "benefits-agreement": "Benefits agreements (EI, CPP)",
      "immigration-docs": "Immigration documents",
      "student-loan": "Student loan agreements",
      "telecom-contract": "Telecom contracts (internet, mobile)",
      "utility-agreement": "Utility agreements",
      "gym-membership": "Gym memberships",
      "saas-contract": "SaaS / software contracts",
      "cancellation-policy": "Cancellation policies",
      "settlement-agreement": "Settlement agreements",
      "power-of-attorney": "Power of attorney",
      "separation-agreement": "Separation agreements",
      "small-claims": "Small claims documents",
      "will-analysis": "Wills (analysis only)",
      "other-contract": "Other / Unknown contract",
    };

    const documentTypeLabel =
      documentTypeLabels[documentType] || "Unknown document type";

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

    // Add custom prompt with document type context if provided
    if (customPrompt) {
      let enhancedPrompt = customPrompt;

      // Prepend document type context to the prompt
      if (documentType !== "not-sure") {
        enhancedPrompt = `DOCUMENT TYPE: This is a "${documentTypeLabel}". Consider this context when analyzing the document and extracting relevant fields specific to this type of contract/agreement. ${customPrompt}`;
      } else {
        enhancedPrompt = `DOCUMENT TYPE: Unknown - automatically detect the document type from the content and provide appropriate analysis. ${customPrompt}`;
      }

      // Replace newlines with spaces to make it valid for HTTP header
      headers["x-prompt"] = enhancedPrompt
        .replace(/\n/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    console.log(
      `Sending ${mimeType} document (type: ${documentTypeLabel}) to Document Intelligence API...`,
    );

    const response = await axios.post(
      `${API_URL}/documents/analyze`,
      formData,
      {
        headers,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 120000, // 2 minute timeout for OCR + LLM processing
      },
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
      `Document Intelligence API analysis received: ${response.data.data.analysis.length} characters`,
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
      error.message,
    );
    return false;
  }
}

module.exports = {
  analyzeDocument,
  checkHealth,
};
