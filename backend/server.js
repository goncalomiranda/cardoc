require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
const PORT = process.env.PORT || 5100;

// Middleware
// In production, frontend is served from same origin, so CORS is not needed
if (process.env.NODE_ENV === "production") {
  app.use(cors()); // Allow all origins in production (or restrict to your domain)
} else {
  app.use(cors({ origin: "http://localhost:3000" })); // Dev mode
}
app.use(express.json()); // For parsing application/json

// Routes (public routes before authentication)
// Add any public API routes here if needed

// Clerk authentication middleware - protects all routes after this point
app.use(
  "/api",
  ClerkExpressRequireAuth({
    secretKey: process.env.CLERK_SECRET_KEY,
  })
);

// Protected routes - require authentication
app.use("/api", uploadRoutes);

// Serve static files from React build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "public")));

  // Handle React routing - return index.html for all non-API routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "Authentication failed." });
  }
  res.status(500).json({
    message: "Something went wrong on the server.",
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
