import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import Footer from "../components/Footer";

function SummaryPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const { getToken } = useAuth();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError("");
    setSummary("");
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
      setSummary("");
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
      const token = await getToken();

      const response = await axios.post(`${backendUrl}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Parse JSON if it's a string
      let summaryData = response.data.summary;
      if (typeof summaryData === "string") {
        try {
          summaryData = JSON.parse(summaryData);
        } catch (parseError) {
          console.log("Summary is plain text, not JSON - cannot parse");
          // If parsing fails, show error modal instead of displaying malformed data
          setError(
            "Unable to process the document analysis. Please try uploading again.",
          );
          setSummary("");
          setLoading(false);
          return;
        }
      }

      // Only set summary if it's a valid structured object with keyInsights
      if (typeof summaryData === "object" && summaryData.keyInsights) {
        setSummary(summaryData);
      } else {
        // Invalid structure, show error
        setError(
          "Unable to process the document analysis. Please try uploading again.",
        );
        setSummary("");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to summarize document. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center py-5 mt-5">
            <h1
              className="mb-3 mt-5 fw-bold"
              style={{
                fontSize: "3.5rem",
                color: "#1a1a1a",
              }}
            >
              Unlock Insights from Your Documents
            </h1>
            <p
              className="lead mb-4"
              style={{
                fontSize: "1.25rem",
                color: "#6c757d",
              }}
            >
              A secure vault to store, organize, and analyze your important documents.
            </p>
            <button
              className="btn btn-primary btn-lg px-5 py-3"
              style={{
                fontSize: "1.1rem",
                borderRadius: "8px",
                background: "linear-gradient(195deg, #4285F4 0%, #1976D2 100%)",
                border: "none",
                display: summary ? "none" : "inline-block",
              }}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      <div className="container pb-5" style={{ marginTop: "2rem" }}>
        <div className="row">
          <div className={summary ? "col-lg-5 mx-auto" : "col-lg-10 mx-auto"}>
            {/* Upload Card */}
            <div className="card" style={{ border: "1px solid #e0e0e0", borderRadius: "12px" }}>
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-lg-12">
                    {/* Upload Area */}
                    <div
                      className={`p-5 text-center ${
                        dragOver ? "drag-over" : ""
                      }`}
                      style={{
                        border: "2px dashed #d0d0d0",
                        borderRadius: "8px",
                        background: "#fafafa",
                      }}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {selectedFile ? (
                        <div className="d-flex align-items-center justify-content-center">
                          <i className="material-symbols-rounded icon-lg" style={{ color: "#4285F4" }}>
                            description
                          </i>
                          <div className="ms-3 text-start">
                            <h6 className="mb-0">{selectedFile.name}</h6>
                            <p className="text-sm text-secondary mb-0">
                              {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <i className="material-symbols-rounded mb-3" style={{ fontSize: "4rem", color: "#4285F4" }}>
                            description
                          </i>
                          <h5 className="mb-3" style={{ color: "#333" }}>
                            Drag & Drop
                          </h5>
                          <p className="text-secondary mb-0">or</p>
                          <label
                            htmlFor="file-upload"
                            className="btn btn-primary mt-3"
                            style={{
                              background: "#4285F4",
                              border: "none",
                              borderRadius: "6px",
                              padding: "10px 30px",
                            }}
                          >
                            Upload Document
                            <input
                              id="file-upload"
                              type="file"
                              onChange={handleFileChange}
                              className="d-none"
                              accept=".pdf,.png,.jpg,.jpeg"
                            />
                          </label>
                        </>
                      )}
                    </div>

                    {/* Error Alert */}
                    {error && (
                      <div
                        className="alert alert-danger alert-dismissible fade show mt-4"
                        role="alert"
                      >
                        <i className="material-symbols-rounded me-2">error</i>
                        <strong>Error!</strong> {error}
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setError("")}
                          aria-label="Close"
                        ></button>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {selectedFile && (
                      <div className="row mt-4">
                        <div className="col-12">
                          <button
                            className="btn btn-primary w-100 mb-2"
                            style={{
                              background: "#4285F4",
                              border: "none",
                              borderRadius: "6px",
                              padding: "12px",
                            }}
                            onClick={handleUpload}
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <i className="material-symbols-rounded me-2">
                                  auto_awesome
                                </i>
                                Analyze Document
                              </>
                            )}
                          </button>
                        </div>
                        <div className="col-12">
                          <button
                            className="btn btn-outline-secondary w-100 mb-0"
                            style={{ borderRadius: "6px", padding: "12px" }}
                            onClick={() => {
                              setSelectedFile(null);
                              setSummary("");
                              setError("");
                            }}
                          >
                            <i className="material-symbols-rounded me-2">
                              close
                            </i>
                            Clear
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Insights Panel - Shows when summary exists */}
          {summary && typeof summary === "object" && summary.keyInsights && (
            <div className="col-lg-6 mx-auto">
              <div className="card" style={{ border: "1px solid #e0e0e0", borderRadius: "12px" }}>
                <div className="card-body p-4">
                  <h4 className="mb-4" style={{ color: "#333" }}>
                    <i className="material-symbols-rounded me-2" style={{ verticalAlign: "middle" }}>
                      insights
                    </i>
                    Insights
                  </h4>
                  <p className="text-secondary mb-4">This document provides the following insights:</p>

                  {/* Vehicle Model */}
                  {summary.vehicleModel && (
                    <div className="mb-4">
                      <div className="p-3" style={{ background: "#f8f9fa", borderRadius: "8px" }}>
                        <div className="d-flex align-items-center">
                          <i className="material-symbols-rounded me-3" style={{ fontSize: "2rem", color: "#4285F4" }}>
                            directions_car
                          </i>
                          <div>
                            <h6 className="mb-0" style={{ color: "#333" }}>
                              {summary.vehicleModel.year && `${summary.vehicleModel.year} `}
                              {summary.vehicleModel.make && `${summary.vehicleModel.make} `}
                              {summary.vehicleModel.model && summary.vehicleModel.model}
                            </h6>
                            {summary.vehicleModel.trim && (
                              <small className="text-secondary">
                                {summary.vehicleModel.trim}
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Key Insights List */}
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {summary.keyInsights && summary.keyInsights.map((insight, idx) => (
                      <li key={idx} className="mb-3 d-flex align-items-start">
                        <span style={{ 
                          color: "#4285F4", 
                          fontSize: "1.5rem", 
                          marginRight: "10px",
                          marginTop: "-2px"
                        }}>
                          •
                        </span>
                        <span style={{ color: "#333" }}>{insight.text}</span>
                      </li>
                    ))}
                    
                    {/* Contract Strength */}
                    {summary.contractStrength !== null && summary.contractStrength !== undefined && (
                      <li className="mb-3 d-flex align-items-start">
                        <span style={{ 
                          color: "#4285F4", 
                          fontSize: "1.5rem", 
                          marginRight: "10px",
                          marginTop: "-2px"
                        }}>
                          •
                        </span>
                        <span style={{ color: "#333" }}>
                          Contract strength: {summary.contractStrength}/100
                        </span>
                      </li>
                    )}
                    
                    {/* Sale Price */}
                    {summary.details && summary.details.salePrice && (
                      <li className="mb-3 d-flex align-items-start">
                        <span style={{ 
                          color: "#4285F4", 
                          fontSize: "1.5rem", 
                          marginRight: "10px",
                          marginTop: "-2px"
                        }}>
                          •
                        </span>
                        <span style={{ color: "#333" }}>
                          Total price: ${summary.details.salePrice.toLocaleString()}
                        </span>
                      </li>
                    )}
                    
                    {/* Upcoming Events */}
                    {summary.upcomingEvents && summary.upcomingEvents.length > 0 && summary.upcomingEvents.map((event, idx) => (
                      <li key={idx} className="mb-3 d-flex align-items-start">
                        <span style={{ 
                          color: "#4285F4", 
                          fontSize: "1.5rem", 
                          marginRight: "10px",
                          marginTop: "-2px"
                        }}>
                          •
                        </span>
                        <span style={{ color: "#333" }}>{event.text}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Recommendations Section */}
                  {summary.recommendations && summary.recommendations.length > 0 && (
                    <>
                      <hr className="my-4" />
                      <h5 className="mb-3" style={{ color: "#333" }}>
                        <i className="material-symbols-rounded me-2" style={{ verticalAlign: "middle", fontSize: "1.2rem" }}>
                          recommend
                        </i>
                        Recommendations
                      </h5>
                      <ul style={{ listStyle: "none", padding: 0 }}>
                        {summary.recommendations.map((rec, idx) => (
                          <li key={idx} className="mb-2 d-flex align-items-start">
                            <span style={{ 
                              color: "#34A853", 
                              fontSize: "1.5rem", 
                              marginRight: "10px",
                              marginTop: "-2px"
                            }}>
                              •
                            </span>
                            <span style={{ color: "#555", fontSize: "0.9rem" }}>{rec.text}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legacy summary card - hidden, kept for compatibility */}
      <div style={{ display: "none" }}>
        {summary && (
          <div className="card summary-card mt-4">
            {typeof summary === "object" && summary.keyInsights ? (
              <>
                <div className="card-header bg-gradient-primary p-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <i className="material-symbols-rounded text-white me-2">
                            summarize
                          </i>
                          <h5 className="text-white mb-0">Contract Analysis</h5>
                        </div>
                        {summary.contractStrength !== null &&
                          summary.contractStrength !== undefined && (
                            <div className="text-center">
                              <h2 className="text-white mb-0">
                                {summary.contractStrength}
                              </h2>
                              <small className="text-white">
                                Contract Strength
                              </small>
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="card-body p-4">
                      {/* Vehicle Model */}
                      {summary.vehicleModel && (
                        <div className="mb-4">
                          <div className="card bg-gradient-dark">
                            <div className="card-body p-3">
                              <div className="d-flex align-items-center">
                                <i className="material-symbols-rounded text-white text-lg me-3">
                                  directions_car
                                </i>
                                <div>
                                  <h5 className="text-white mb-0">
                                    {summary.vehicleModel.year &&
                                      `${summary.vehicleModel.year} `}
                                    {summary.vehicleModel.make &&
                                      `${summary.vehicleModel.make} `}
                                    {summary.vehicleModel.model &&
                                      summary.vehicleModel.model}
                                  </h5>
                                  {summary.vehicleModel.trim && (
                                    <small className="text-white opacity-8">
                                      {summary.vehicleModel.trim}
                                    </small>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Key Insights */}
                      {summary.keyInsights &&
                        summary.keyInsights.length > 0 && (
                          <div className="mb-4">
                            <h6 className="text-dark mb-3">
                              <i className="material-symbols-rounded text-sm me-1">
                                lightbulb
                              </i>
                              Key Insights
                            </h6>
                            {summary.keyInsights.map((insight, idx) => (
                              <div
                                key={idx}
                                className="d-flex align-items-start mb-2"
                              >
                                <i className="material-symbols-rounded text-warning me-2">
                                  {insight.icon === "alert"
                                    ? "error"
                                    : insight.icon === "document"
                                      ? "description"
                                      : "build"}
                                </i>
                                <span className="text-dark">
                                  {insight.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                      {/* Key Clauses */}
                      {summary.keyClauses && summary.keyClauses.length > 0 && (
                        <div className="mb-4">
                          <h6 className="text-dark mb-3">
                            <i className="material-symbols-rounded text-sm me-1">
                              gavel
                            </i>
                            Key Clauses
                          </h6>
                          {summary.keyClauses.map((clause, idx) => (
                            <div key={idx} className="card mb-2">
                              <div className="card-body p-3">
                                <div className="d-flex align-items-start">
                                  <i className="material-symbols-rounded text-info me-2">
                                    article
                                  </i>
                                  <div>
                                    <h6 className="text-dark mb-1">
                                      {clause.title}
                                    </h6>
                                    <small className="text-secondary">
                                      {clause.description}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Recommendations */}
                      {summary.recommendations &&
                        summary.recommendations.length > 0 && (
                          <div className="mb-4">
                            <h6 className="text-dark mb-3">
                              <i className="material-symbols-rounded text-sm me-1">
                                recommend
                              </i>
                              Recommendations
                            </h6>
                            {summary.recommendations.map((rec, idx) => (
                              <div
                                key={idx}
                                className="d-flex align-items-start mb-2"
                              >
                                <i className="material-symbols-rounded text-success me-2">
                                  {rec.icon === "lightbulb"
                                    ? "lightbulb"
                                    : rec.icon === "checkmark"
                                      ? "check_circle"
                                      : "build"}
                                </i>
                                <span className="text-dark">{rec.text}</span>
                              </div>
                            ))}
                          </div>
                        )}

                      <div className="row">
                        {/* Benchmark */}
                        {summary.benchmark && summary.benchmark.spending && (
                          <div className="col-md-6 mb-3">
                            <div className="card">
                              <div className="card-body p-3">
                                <h6 className="text-dark mb-2">Benchmark</h6>
                                <h4 className="text-primary mb-1">
                                  ${summary.benchmark.spending.toLocaleString()}
                                </h4>
                                {summary.benchmark.comparison && (
                                  <small className="text-secondary">
                                    {summary.benchmark.comparison}
                                  </small>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Upcoming Events */}
                        {summary.upcomingEvents &&
                          summary.upcomingEvents.length > 0 && (
                            <div className="col-md-6 mb-3">
                              <div className="card">
                                <div className="card-body p-3">
                                  <h6 className="text-dark mb-2">
                                    Upcoming Events
                                  </h6>
                                  {summary.upcomingEvents.map((event, idx) => (
                                    <div key={idx} className="mb-2">
                                      <div className="d-flex align-items-center">
                                        <i className="material-symbols-rounded text-info me-2">
                                          event
                                        </i>
                                        <small className="text-dark">
                                          {event.text}
                                        </small>
                                      </div>
                                      {event.daysUntil !== null &&
                                        event.daysUntil !== undefined && (
                                          <small className="text-secondary ms-4">
                                            in {event.daysUntil} days
                                          </small>
                                        )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                      </div>

                      {/* Details */}
                      {summary.details && (
                        <div className="mt-3">
                          <h6 className="text-dark mb-3">Contract Details</h6>
                          <div className="row">
                            {summary.details.salePrice && (
                              <div className="col-md-4 mb-2">
                                <small className="text-secondary">
                                  Sale Price
                                </small>
                                <p className="text-dark mb-0">
                                  <strong>
                                    $
                                    {summary.details.salePrice.toLocaleString()}
                                  </strong>
                                </p>
                              </div>
                            )}
                            {summary.details.dealQuality && (
                              <div className="col-md-4 mb-2">
                                <small className="text-secondary">
                                  Deal Quality
                                </small>
                                <p className="text-dark mb-0">
                                  <span
                                    className={`badge bg-${summary.details.dealQuality === "high" ? "success" : summary.details.dealQuality === "medium" ? "warning" : "danger"}`}
                                  >
                                    {summary.details.dealQuality.toUpperCase()}
                                  </span>
                                </p>
                              </div>
                            )}
                            {summary.details.financing &&
                              summary.details.financing.principalAmount && (
                                <div className="col-md-4 mb-2">
                                  <small className="text-secondary">
                                    Amount Financed
                                  </small>
                                  <p className="text-dark mb-0">
                                    <strong>
                                      $
                                      {summary.details.financing.principalAmount.toLocaleString()}
                                    </strong>
                                  </p>
                                </div>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : null}
                {/* Removed fallback for plain text - now shows error modal instead */}
                <div className="card-footer bg-transparent border-0 p-3">
                  <small className="text-muted">
                    <i className="material-symbols-rounded text-sm me-1">
                      info
                    </i>
                    Generated by AI • Please verify critical information
                  </small>
                </div>
              </div>
            )}

            {/* Features Section */}
            {!summary && !selectedFile && (
              <div className="row mt-5">
                <div className="col-md-4 mb-4">
                  <div className="text-center">
                    <div className="icon icon-shape bg-gradient-primary shadow text-center border-radius-md mb-3 mx-auto">
                      <i
                        className="material-symbols-rounded opacity-10"
                        style={{ fontSize: "2rem" }}
                      >
                        speed
                      </i>
                    </div>
                    <h5 className="text-dark">Lightning Fast</h5>
                    <p className="text-secondary text-sm">
                      Get summaries in seconds with our AI-powered engine
                    </p>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="text-center">
                    <div className="icon icon-shape bg-gradient-primary shadow text-center border-radius-md mb-3 mx-auto">
                      <i
                        className="material-symbols-rounded opacity-10"
                        style={{ fontSize: "2rem" }}
                      >
                        document_scanner
                      </i>
                    </div>
                    <h5 className="text-dark">OCR Enabled</h5>
                    <p className="text-secondary text-sm">
                      Works with scanned documents using advanced OCR technology
                    </p>
                  </div>
                </div>
                <div className="col-md-4 mb-4">
                  <div className="text-center">
                    <div className="icon icon-shape bg-gradient-primary shadow text-center border-radius-md mb-3 mx-auto">
                      <i
                        className="material-symbols-rounded opacity-10"
                        style={{ fontSize: "2rem" }}
                      >
                        shield
                      </i>
                    </div>
                    <h5 className="text-dark">Secure & Private</h5>
                    <p className="text-secondary text-sm">
                      Your documents are processed securely and never stored
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SummaryPage;
