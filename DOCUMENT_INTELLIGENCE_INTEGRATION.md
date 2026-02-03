# Document Intelligence Integration

## Overview

CarDoc now supports three AI providers for document summarization:

1. **Document Intelligence API** (Recommended) - Standalone service with OCR + LLM
2. **Ollama** - Local LLM with Tesseract OCR
3. **Gemini** - Google's Gemini API (legacy)

## Document Intelligence API

### Features
- 🚀 Fast and reliable OCR using Tesseract.js
- 🤖 LLM analysis using Ollama (llama3.2:3b)
- 📄 Supports PDF, PNG, and JPEG files
- 🔒 Secure API with key-based authentication
- ☁️ Hosted at: https://docsummary.shaihulud.org

### Configuration

Set these environment variables in `backend/.env`:

```bash
AI_PROVIDER=document-intelligence
DOCUMENT_INTELLIGENCE_API_URL=https://docsummary.shaihulud.org/api/v1
DOCUMENT_INTELLIGENCE_API_KEY=cardoc-secret-key-12345
DOCUMENT_INTELLIGENCE_PROMPT=You are an expert car appraiser...
```

### Supported File Types
- PDF documents (`.pdf`)
- PNG images (`.png`)
- JPEG images (`.jpg`, `.jpeg`)

## Switching Providers

### Use Document Intelligence API (Current)
```bash
AI_PROVIDER=document-intelligence
```

### Use Ollama (Local)
```bash
AI_PROVIDER=ollama
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
```

### Use Gemini (Legacy)
```bash
AI_PROVIDER=gemini
GOOGLE_GEMINI_API_KEY=your-api-key-here
```

## Architecture

### Document Intelligence Flow
```
User Upload (PDF/PNG/JPEG)
    ↓
CarDoc Backend
    ↓
Document Intelligence API
    ↓
PDF → pdftocairo → PNG
    ↓
Tesseract OCR (extracts text)
    ↓
Ollama LLM (generates summary)
    ↓
Return Analysis to CarDoc
    ↓
Display to User
```

### Benefits
- ✅ Consistent OCR quality (better than Alpine Docker)
- ✅ Centralized service for multiple clients
- ✅ Easy to maintain and scale
- ✅ Works with scanned documents and images
- ✅ Custom prompts per request via header

## Testing

Test the Document Intelligence API directly:

```bash
curl -X POST https://docsummary.shaihulud.org/api/v1/documents/analyze \
  -H "x-api-key: cardoc-secret-key-12345" \
  -H "x-prompt: Summarize this document briefly" \
  -F "document=@/path/to/your/file.pdf"
```

## Performance

Typical processing times:
- OCR: 8-10 seconds
- LLM Analysis: 7-15 seconds
- **Total: 15-25 seconds**

## Notes

- The old Gemini approach is still available but not executed by default
- Text-only files (`.txt`, `.md`) still work with all providers
- Maximum file size: 3MB (configurable in Document Intelligence API)
