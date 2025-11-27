const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Helper function to wait/delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.getSummary = async (documentContent) => {
  console.log("Sending document content to Gemini API for summarization...");
  console.log(
    "Document content length: " + JSON.stringify(documentContent, null, 2)
  );
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const prompt = `${process.env.GEMINI_TEXT_PROMPT}${documentContent}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error(
        `Error calling Gemini API (attempt ${retryCount + 1}):`,
        error
      );

      // Check if it's a rate limit error
      if (error.status === 429) {
        retryCount++;
        if (retryCount < maxRetries) {
          // Extract retry delay from error or use default
          const retryDelay = error.message.includes("34s") ? 35000 : 60000; // 35s or 60s fallback
          console.log(
            `Rate limited. Waiting ${retryDelay / 1000} seconds before retry ${
              retryCount + 1
            }...`
          );
          await delay(retryDelay);
          continue;
        } else {
          throw new Error(
            "Rate limit exceeded. Please try again later or upgrade your API plan."
          );
        }
      }

      // For other errors, don't retry
      throw new Error("Failed to get summary from AI service.");
    }
  }
};

exports.getSummaryFromPdfBuffer = async (pdfBuffer, filename) => {
  const maxRetries = 3;
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      console.log(
        `Attempting to send PDF directly to Gemini API (${filename})`
      );

      // Convert buffer to base64 for Gemini API
      const base64Data = pdfBuffer.toString("base64");

      const prompt = process.env.GEMINI_PDF_PROMPT;

      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: "application/pdf",
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      console.log("Successfully processed PDF directly with Gemini API");
      return text;
    } catch (error) {
      console.error(
        `Error calling Gemini API for PDF buffer (attempt ${retryCount + 1}):`,
        error
      );

      // Check if it's a rate limit error
      if (error.status === 429) {
        retryCount++;
        if (retryCount < maxRetries) {
          const retryDelay = error.message.includes("34s") ? 35000 : 60000;
          console.log(
            `Rate limited. Waiting ${retryDelay / 1000} seconds before retry ${
              retryCount + 1
            }...`
          );
          await delay(retryDelay);
          continue;
        } else {
          throw new Error(
            "Rate limit exceeded. Please try again later or upgrade your API plan."
          );
        }
      }

      // For other errors, don't retry
      throw new Error(
        "Failed to process PDF directly with AI service: " + error.message
      );
    }
  }
};
