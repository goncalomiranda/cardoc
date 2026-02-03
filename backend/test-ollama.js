const axios = require("axios");
const fs = require("fs");

async function test() {
  const image = fs.readFileSync(
    "/home/gmiranda/Documents/GitHub/cardoc/backend/debug/pdf-2025-12-13T07-34-40.131Z.png"
  );
  const base64 = image.toString("base64");

  console.log("Base64 length:", base64.length);
  console.log("Testing with simple prompt...\n");

  const response = await axios.post("http://localhost:11434/api/generate", {
    model: "deepseek-ocr",
    prompt: "OCR:",
    images: [base64],
    stream: false,
  });

  console.log("Response:", JSON.stringify(response.data, null, 2));
}

test().catch(console.error);
