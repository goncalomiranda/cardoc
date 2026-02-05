const { extractTextFromPDF } = require("../services/pdfExtractor");
const geminiService = require("../services/geminiService");
const ollamaService = require("../services/ollamaService");
const documentIntelligenceService = require("../services/documentIntelligenceService");
const fs = require("fs");
const path = require("path");

// AI provider: 'gemini', 'ollama', or 'document-intelligence'
const AI_PROVIDER = process.env.AI_PROVIDER || "document-intelligence";

exports.summarizeDocument = async (req, res, next) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded." });

    const mimeType = req.file.mimetype;
    const documentType = req.body.documentType || "not-sure"; // Get document type from request

    let fileContent = "";
    let summary;

    // Use Document Intelligence API for PDF, PNG, and JPEG files
    if (
      AI_PROVIDER === "document-intelligence" &&
      (mimeType === "application/pdf" ||
        mimeType === "image/png" ||
        mimeType === "image/jpeg")
    ) {
      console.log(
        `Using Document Intelligence API for ${mimeType} analysis...`,
      );

      // Read custom prompt from file if PROMPT_FILE is set, otherwise use env var
      let customPrompt = process.env.DOCUMENT_INTELLIGENCE_PROMPT || null;
      if (process.env.DOCUMENT_INTELLIGENCE_PROMPT_FILE) {
        try {
          const promptPath = path.join(
            __dirname,
            "..",
            process.env.DOCUMENT_INTELLIGENCE_PROMPT_FILE,
          );
          customPrompt = fs.readFileSync(promptPath, "utf-8");
          console.log(`Loaded prompt from file: ${promptPath}`);
        } catch (error) {
          console.error(`Failed to read prompt file: ${error.message}`);
          // Fallback to env var if file reading fails
        }
      }

      summary = await documentIntelligenceService.analyzeDocument(
        req.file.buffer,
        mimeType,
        customPrompt,
        documentType, // Pass document type to service
      );
    }

    console.log("Final summary to send:", summary);
    console.log("Summary length:", summary ? summary.length : 0);

    if (!summary || !summary.trim()) {
      console.warn("Warning: Empty summary being sent to frontend");
      return res.status(500).json({
        message: "Failed to generate summary - empty response from AI service.",
      });
    }

    // If using Document Intelligence API, try to parse JSON response
    let responseData = { summary };
    if (AI_PROVIDER === "document-intelligence") {
      try {
        // Clean the summary string and try to parse as JSON
        let cleanedSummary = summary.trim();

        // 0. Remove markdown code blocks and any leading text
        // Remove ```json ... ``` or ``` ... ```
        cleanedSummary = cleanedSummary.replace(/^[^{]*```(?:json)?\s*/i, "");
        cleanedSummary = cleanedSummary.replace(/```\s*$/, "");
        // Remove any leading text before the first {
        const firstBrace = cleanedSummary.indexOf("{");
        if (firstBrace > 0) {
          cleanedSummary = cleanedSummary.substring(firstBrace);
        }

        // Fix common LLM mistakes
        // 1. Remove % symbols from numbers (e.g., "5.99%" -> "5.99")
        cleanedSummary = cleanedSummary.replace(/(\d+\.?\d*)\s*%/g, "$1");

        // 2. Try to extract first valid JSON object if multiple are present
        const firstBraceIndex = cleanedSummary.indexOf("{");
        if (firstBraceIndex !== -1) {
          // Find the matching closing brace with proper nesting
          let braceCount = 0;
          let endIndex = -1;
          for (let i = firstBraceIndex; i < cleanedSummary.length; i++) {
            if (cleanedSummary[i] === "{") braceCount++;
            if (cleanedSummary[i] === "}") braceCount--;
            if (braceCount === 0) {
              endIndex = i + 1;
              break;
            }
          }
          if (endIndex !== -1) {
            cleanedSummary = cleanedSummary.substring(
              firstBraceIndex,
              endIndex,
            );
          }
        }

        // 3. Try to fix common JSON structural issues
        // Remove duplicate keys by keeping only the first occurrence
        cleanedSummary = cleanedSummary.replace(
          /,"keyClauses":\[{[^}]+}\],"recommendations":\[/g,
          ',"recommendations":[',
        );

        // 4. Fix malformed upcomingEvents arrays (split objects)
        // Pattern: }],{"daysUntil":N}] -> ,"daysUntil":N}]
        cleanedSummary = cleanedSummary.replace(
          /}\],\s*\{\s*"daysUntil"\s*:\s*(\d+)\s*}\s*\]/g,
          ',"daysUntil":$1}]',
        );

        // 5. Fix incorrect field names
        cleanedSummary = cleanedSummary.replace(
          /"feeInsights":/g,
          '"keyInsights":',
        );
        cleanedSummary = cleanedSummary.replace(
          /"clauseDetails":/g,
          '"keyClauses":',
        );
        cleanedSummary = cleanedSummary.replace(
          /"spendingNumber":/g,
          '"spending":',
        );
        cleanedSummary = cleanedSummary.replace(
          /"comparisonText":/g,
          '"comparison":',
        );

        // 6. Fix year as string to number (e.g., "year": "2026" -> "year": 2026)
        cleanedSummary = cleanedSummary.replace(
          /"year"\s*:\s*"(\d{4})"/g,
          '"year":$1',
        );

        // 7. Fix termInMonths to term
        cleanedSummary = cleanedSummary.replace(/"termInMonths":/g, '"term":');

        // 8. Fix spending as string to number (e.g., "spending": "$68500" -> "spending": 68500)
        cleanedSummary = cleanedSummary.replace(
          /"spending"\s*:\s*"\$?([\d,]+(?:\.\d{2})?)"/g,
          (match, amount) => `"spending":${amount.replace(/,/g, "")}`,
        );

        // 9. Fix missing decimal points in large numbers (e.g., 9098045 -> 90980.45, 68426296 -> 68462.96)
        // This targets salePrice and principalAmount that are likely missing decimals
        cleanedSummary = cleanedSummary.replace(
          /"(salePrice|principalAmount)"\s*:\s*(\d{7,})/g,
          (match, field, value) => {
            // Insert decimal point 2 positions from the right
            const corrected = value.slice(0, -2) + "." + value.slice(-2);
            return `"${field}":${corrected}`;
          },
        );

        // 10. Fix interest rate as too-small decimal (0.0399 -> 3.99)
        cleanedSummary = cleanedSummary.replace(
          /"interestRate"\s*:\s*0\.0(\d{3,})/g,
          (match, digits) => {
            // Convert 0.0399 to 3.99
            const rate = parseFloat("0.0" + digits) * 100;
            return `"interestRate":${rate}`;
          },
        );

        // 11. Fix upcomingEvents missing daysUntil - add 0 as default
        cleanedSummary = cleanedSummary.replace(
          /(\{"icon"\s*:\s*"calendar"\s*,\s*"text"\s*:\s*"[^"]*")\}/g,
          '$1,"daysUntil":0}',
        );

        // 12. Remove malformed fees/taxes objects before parsing
        // Remove lines like: fees": { or taxes": {
        cleanedSummary = cleanedSummary.replace(
          /,\s*\n\s*fees":\s*\n\s*\{[^}]*\},?/g,
          "",
        );
        cleanedSummary = cleanedSummary.replace(
          /,\s*\n\s*taxes":\s*\n\s*\{[^}]*\},?/g,
          "",
        );

        const parsedSummary = JSON.parse(cleanedSummary);
        // If successful, send as structured data
        responseData = {
          summary: parsedSummary,
          isStructured: true,
        };
        console.log("Parsed JSON response from Document Intelligence API");
      } catch (parseError) {
        // If parsing fails, send as plain text summary
        console.log("Response is plain text, not JSON");
        console.log("Parse error:", parseError.message);
        console.log("First 500 chars:", summary.substring(0, 500));
        responseData = { summary, isStructured: false };
      }
    }

    res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};
