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
    <div className="gradient-overlay">
      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center py-5 mt-5">
            <h1
              className="text-white mb-3 mt-5 fw-bold"
              style={{
                fontSize: "3rem",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              AI-Powered Document Summarizer
            </h1>
            <p
              className="lead text-white mb-0"
              style={{
                fontSize: "1.25rem",
                textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
              }}
            >
              Upload your car documents (PDF, PNG, JPEG) and get instant
              AI-powered summaries
            </p>
          </div>
        </div>
      </div>

      <div className="container pb-5" style={{ marginTop: "4rem" }}>
        <div className="row">
          <div className="col-lg-10 mx-auto">
            {/* Upload Card */}
            <div className="card move-on-hover">
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-lg-12">
                    {/* Upload Area */}
                    <div
                      className={`card-upload border-radius-lg p-5 text-center ${
                        dragOver ? "drag-over" : ""
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      {selectedFile ? (
                        <div className="file-name">
                          <i className="material-symbols-rounded icon-lg">
                            description
                          </i>
                          <div className="ms-3">
                            <h6 className="mb-0">{selectedFile.name}</h6>
                            <p className="text-sm text-secondary mb-0">
                              {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <i className="material-symbols-rounded icon-lg mb-3">
                            cloud_upload
                          </i>
                          <h5 className="text-dark mb-3">
                            Drop your file here
                          </h5>
                          <p className="text-sm text-secondary mb-3">
                            PDF, PNG, or JPEG files • Max 3MB
                          </p>
                          <label
                            htmlFor="file-upload"
                            className="btn bg-gradient-primary mb-0"
                          >
                            <i className="material-symbols-rounded me-2">
                              upload_file
                            </i>
                            Choose File
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
                        <div className="col-md-6">
                          <button
                            className="btn bg-gradient-primary w-100 mb-0"
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
                                Processing...
                              </>
                            ) : (
                              <>
                                <i className="material-symbols-rounded me-2">
                                  auto_awesome
                                </i>
                                Summarize Document
                              </>
                            )}
                          </button>
                        </div>
                        <div className="col-md-6">
                          <button
                            className="btn btn-outline-secondary w-100 mb-0"
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

            {/* Summary Card */}
            {summary && (
              <div className="card summary-card mt-4">
                {/* Check if structured JSON response */}
                {typeof summary === "object" && summary.keyInsights ? (
                  <>
                    {/* Header with Contract Strength */}
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
