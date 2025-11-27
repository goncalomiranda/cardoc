const { extractTextFromPDF } = require("../services/pdfExtractor");
const geminiService = require("../services/geminiService");

exports.summarizeDocument = async (req, res, next) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded." });

    const mimeType = req.file.mimetype;

    let fileContent = "";

    if (mimeType === "application/pdf") {
      fileContent = await extractTextFromPDF(req.file.buffer);
    } else if (mimeType.startsWith("text")) {
      fileContent = req.file.buffer.toString("utf8");
    } else {
      return res.status(400).json({ message: "Unsupported file type." });
    }

    if (!fileContent || !fileContent.trim()) {
      return res.status(400).json({ message: "PDF has no readable text." });
    }

    const summary = await geminiService.getSummary(fileContent);

    res.status(200).json({ summary });
  } catch (error) {
    next(error);
  }
};
