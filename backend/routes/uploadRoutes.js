const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const multer = require("multer");

// Configure Multer for file uploads
const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory

// POST /api/upload - handles file upload and summarization
router.post(
  "/upload",
  upload.single("document"),
  uploadController.summarizeDocument
);

module.exports = router;
