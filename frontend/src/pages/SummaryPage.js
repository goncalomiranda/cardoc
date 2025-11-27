import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

function SummaryPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false); // State for drag-and-drop styling

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const { getToken } = useAuth();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError("");
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setSelectedFile(event.dataTransfer.files[0]);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setSummary("");
    setError("");

    const formData = new FormData();
    formData.append("document", selectedFile);

    try {
      // Get Clerk authentication token
      const token = await getToken();

      const response = await axios.post(`${backendUrl}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setSummary(response.data.summary);
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to summarize document. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-lg-8">
        <div className="card shadow-sm border-0 mb-4 car-theme-card">
          {" "}
          {/* Custom class for subtle car theme */}
          <div className="card-body">
            <h3 className="card-title text-center mb-4 text-dark-emphasis">
              <span role="img" aria-label="car-emoji">
                🚗
              </span>{" "}
              Upload Car Document for Summary
            </h3>
            <p className="card-text text-center text-muted">
              Upload a document (e.g., inspection report, specifications) and
              get an AI-powered summary.
            </p>

            <div
              className={`border p-4 mb-4 text-center rounded ${
                dragOver ? "border-primary bg-light" : "border-dashed"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{
                borderColor: dragOver ? "#0d6efd" : "#dee2e6",
                borderWidth: "2px",
              }}
            >
              {selectedFile ? (
                <p className="mb-0 text-success">
                  File selected: <strong>{selectedFile.name}</strong>
                </p>
              ) : (
                <>
                  <p className="lead mb-2 text-muted">
                    Drag & Drop your file here
                  </p>
                  <p className="text-muted mb-2">or</p>
                  <label
                    htmlFor="file-upload"
                    className="btn btn-outline-secondary cursor-pointer"
                  >
                    Choose File
                    <input
                      id="file-upload"
                      type="file"
                      onChange={handleFileChange}
                      className="d-none" // Hide default input
                      accept=".txt,.md,.pdf" // Suggest file types (backend needs PDF parsing for actual PDFs)
                    />
                  </label>
                </>
              )}
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <div className="d-grid gap-2 mb-4">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleUpload}
                disabled={!selectedFile || loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      aria-hidden="true"
                    ></span>
                    <span role="status">Processing...</span>
                  </>
                ) : (
                  "Upload and Summarize"
                )}
              </button>
            </div>

            {summary && (
              <div className="card border-info mt-4">
                <div className="card-header bg-info text-white">
                  <h5 className="mb-0">AI Summary</h5>
                </div>
                <div className="card-body">
                  <p className="card-text">{summary}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SummaryPage;
