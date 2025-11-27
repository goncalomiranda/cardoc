# 🚗 CarDoc - AI-Powered Document Summarizer

A full-stack MERN application that uses AI to summarize car-related documents (inspection reports, specifications, etc.) with OCR fallback for scanned PDFs.

## 🌟 Features

- 📄 PDF & Text document upload with drag-and-drop
- 🤖 AI-powered summarization using Google Gemini
- 🔍 OCR fallback for scanned/image-based PDFs
- 🔐 User authentication with Clerk
- 📱 Responsive React frontend
- 🚀 Production-ready build process

## 🛠️ Tech Stack

**Frontend:**
- React
- Bootstrap 5
- Axios
- Clerk React

**Backend:**
- Node.js + Express
- Google Gemini AI (gemini-2.0-flash)
- pdf-parse (text extraction)
- pdf2pic + Tesseract.js (OCR fallback)
- Clerk authentication

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Clerk account ([dashboard.clerk.com](https://dashboard.clerk.com))
- Google Gemini API key ([ai.google.dev](https://ai.google.dev))

### Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd cardoc
   ```

2. **Install dependencies:**
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   cd ..
   ```

3. **Configure environment variables:**

   **Backend** (`backend/.env`):
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your actual keys
   ```

   **Frontend** (`frontend/.env`):
   ```bash
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env with your actual keys
   ```

4. **Required Environment Variables:**

   See `.env.example` files for all required variables.

   ⚠️ **NEVER commit `.env` files to Git!**

## 🚀 Running the App

### Development Mode (Hot Reload)

```bash
npm start
```

This runs:
- Backend on `http://localhost:5100`
- Frontend on `http://localhost:3000`

### Production Build

```bash
npm run build
```

This creates a `dist/` folder with:
- Backend server
- Frontend static files in `backend/public/`
- All production-ready code

### Run Production Build Locally

```bash
npm run start:prod
```

Runs the production build from `dist/` folder on port 5100.

## 🌐 Deployment (cPanel)

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Upload `dist/` contents** to your cPanel app directory

3. **Set environment variables** in cPanel:
   - `GOOGLE_GEMINI_API_KEY`
   - `CLERK_SECRET_KEY`
   - `NODE_ENV=production`
   - `PORT=5100`
   - `GEMINI_TEXT_PROMPT` (your custom prompt)
   - `GEMINI_PDF_PROMPT` (your custom PDF prompt)

4. **Run NPM Install** in cPanel Node.js interface

5. **Set startup file:** `server.js`

6. **Start the app**

## 🔒 Security

- ✅ All API routes protected with Clerk authentication
- ✅ Environment variables for all sensitive data
- ✅ `.env` files excluded from Git
- ✅ CORS configured for development and production
- ⚠️ **Never commit real API keys to GitHub!**

## 📁 Project Structure

```
cardoc/
├── backend/              # Express API server
│   ├── controllers/      # Request handlers
│   ├── routes/           # API routes
│   ├── services/         # Business logic (AI, PDF extraction)
│   ├── public/           # Frontend build (generated)
│   ├── .env.example      # Environment template
│   └── server.js         # Entry point
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   └── App.js        # Main app component
│   ├── public/
│   └── .env.example      # Environment template
├── dist/                 # Production build (generated)
├── package.json          # Root scripts
└── README.md

```

## 🧪 Testing

Upload a PDF document through the web interface:
1. Sign in with Clerk
2. Upload a car-related document or any PDF
3. Get an AI-generated summary

## 📝 License

MIT

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

---

Made with ❤️ for car enthusiasts