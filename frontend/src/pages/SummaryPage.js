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
  const [activeTab, setActiveTab] = useState("overview");

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
        setError(
          "Unable to process the document analysis. Please try uploading again.",
        );
        setSummary("");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to analyze document. Please try again.",
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
              Unlock Insights from Your Contracts
            </h1>
            <p
              className="lead mb-4"
              style={{
                fontSize: "1.25rem",
                color: "#6c757d",
              }}
            >
              A secure vault to store, organize, and analyze your important
              contracts.
            </p>
            {!summary && (
              <button
                className="btn btn-lg px-5 py-3"
                style={{
                  fontSize: "1.1rem",
                  borderRadius: "8px",
                  background: "#4285F4",
                  border: "none",
                  color: "white",
                  boxShadow: "0 4px 6px rgba(66, 133, 244, 0.3)",
                }}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container pb-5" style={{ marginTop: "2rem" }}>
        <div className="row">
          <div className={summary ? "col-lg-5" : "col-lg-6 mx-auto"}>
            {/* Upload Card */}
            <div
              className="card"
              style={{ border: "1px solid #e0e0e0", borderRadius: "12px" }}
            >
              <div className="card-body p-4">
                {/* Error Alert */}
                {error && (
                  <div
                    className="alert alert-danger alert-dismissible fade show mb-3"
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

                {/* Upload Area */}
                <div
                  className={`p-5 text-center ${dragOver ? "drag-over" : ""}`}
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
                      <i
                        className="material-symbols-rounded icon-lg"
                        style={{ color: "#4285F4", fontSize: "3rem" }}
                      >
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
                      <i
                        className="material-symbols-rounded mb-3"
                        style={{ fontSize: "4rem", color: "#4285F4" }}
                      >
                        description
                      </i>
                      <h5 className="mb-3" style={{ color: "#333" }}>
                        Drag & Drop
                      </h5>
                      <p className="text-secondary mb-0">or</p>
                      <label
                        htmlFor="file-upload"
                        className="btn mt-3"
                        style={{
                          background: "#4285F4",
                          border: "none",
                          borderRadius: "6px",
                          padding: "10px 30px",
                          color: "white",
                          cursor: "pointer",
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

                {/* Action Buttons */}
                {selectedFile && (
                  <div className="mt-4">
                    <button
                      className="btn w-100 mb-2"
                      style={{
                        background: "#4285F4",
                        border: "none",
                        borderRadius: "6px",
                        padding: "12px",
                        color: "white",
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
                    <button
                      className="btn btn-outline-secondary w-100"
                      style={{ borderRadius: "6px", padding: "12px" }}
                      onClick={() => {
                        setSelectedFile(null);
                        setSummary("");
                        setError("");
                      }}
                    >
                      <i className="material-symbols-rounded me-2">close</i>
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Insights Panel */}
          {summary && typeof summary === "object" && summary.keyInsights && (
            <div className="col-lg-6">
              <div
                className="card"
                style={{ border: "1px solid #e0e0e0", borderRadius: "12px" }}
              >
                <div className="card-body p-0">
                  {/* Header with Vehicle Title and Contract Strength */}
                  <div className="d-flex justify-content-between align-items-start p-4 pb-3">
                    <div>
                      <h4
                        className="mb-1"
                        style={{
                          color: "#1a1a1a",
                          fontWeight: 600,
                          fontSize: "1.75rem",
                        }}
                      >
                        Contract Analysis
                      </h4>
                      {summary.vehicleModel && (
                        <p
                          className="text-secondary mb-0"
                          style={{ fontSize: "1.1rem" }}
                        >
                          {summary.vehicleModel.year &&
                            `${summary.vehicleModel.year} `}
                          {summary.vehicleModel.make &&
                            `${summary.vehicleModel.make} `}
                          {summary.vehicleModel.model &&
                            summary.vehicleModel.model}
                          {summary.vehicleModel.trim &&
                            ` ${summary.vehicleModel.trim}`}
                        </p>
                      )}
                    </div>
                    {summary.contractStrength !== null &&
                      summary.contractStrength !== undefined && (
                        <div
                          style={{
                            background: "#1a73e8",
                            color: "white",
                            padding: "20px 24px",
                            borderRadius: "12px",
                            textAlign: "center",
                            minWidth: "120px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "2.5rem",
                              fontWeight: 700,
                              lineHeight: 1,
                            }}
                          >
                            {summary.contractStrength}
                          </div>
                          <div
                            style={{ fontSize: "0.875rem", marginTop: "8px" }}
                          >
                            Contract Strength
                          </div>
                        </div>
                      )}
                  </div>

                  {/* Navigation Tabs */}
                  <div className="px-4">
                    <div
                      style={{
                        borderBottom: "2px solid #e0e0e0",
                        display: "flex",
                        gap: "2rem",
                      }}
                    >
                      <button
                        onClick={() => setActiveTab("overview")}
                        style={{
                          background: "none",
                          border: "none",
                          padding: "12px 0",
                          color:
                            activeTab === "overview" ? "#1a73e8" : "#5f6368",
                          fontWeight: 500,
                          fontSize: "1rem",
                          cursor: "pointer",
                          borderBottom:
                            activeTab === "overview"
                              ? "3px solid #1a73e8"
                              : "none",
                          marginBottom: "-2px",
                        }}
                      >
                        Overview
                      </button>
                      <button
                        onClick={() => setActiveTab("clauses")}
                        style={{
                          background: "none",
                          border: "none",
                          padding: "12px 0",
                          color:
                            activeTab === "clauses" ? "#1a73e8" : "#5f6368",
                          fontWeight: 500,
                          fontSize: "1rem",
                          cursor: "pointer",
                          borderBottom:
                            activeTab === "clauses"
                              ? "3px solid #1a73e8"
                              : "none",
                          marginBottom: "-2px",
                        }}
                      >
                        Key Clauses
                      </button>
                      <button
                        onClick={() => setActiveTab("risks")}
                        style={{
                          background: "none",
                          border: "none",
                          padding: "12px 0",
                          color: activeTab === "risks" ? "#1a73e8" : "#5f6368",
                          fontWeight: 500,
                          fontSize: "1rem",
                          cursor: "pointer",
                          borderBottom:
                            activeTab === "risks"
                              ? "3px solid #1a73e8"
                              : "none",
                          marginBottom: "-2px",
                        }}
                      >
                        Risks
                      </button>
                      <button
                        onClick={() => setActiveTab("insights")}
                        style={{
                          background: "none",
                          border: "none",
                          padding: "12px 0",
                          color:
                            activeTab === "insights" ? "#1a73e8" : "#5f6368",
                          fontWeight: 500,
                          fontSize: "1rem",
                          cursor: "pointer",
                          borderBottom:
                            activeTab === "insights"
                              ? "3px solid #1a73e8"
                              : "none",
                          marginBottom: "-2px",
                        }}
                      >
                        Insights
                      </button>
                    </div>
                  </div>

                  {/* Content Area with Sidebar */}
                  <div className="d-flex" style={{ minHeight: "400px" }}>
                    {/* Main Content */}
                    <div className="flex-grow-1 p-4">
                      {/* Overview Tab Content */}
                      {activeTab === "overview" && (
                        <>
                          {/* Key Insights Section */}
                          <h5
                            className="mb-3"
                            style={{
                              color: "#1a1a1a",
                              fontWeight: 600,
                              fontSize: "1.25rem",
                            }}
                          >
                            Key Insights
                          </h5>
                          <div style={{ marginBottom: "2rem" }}>
                            {summary.keyInsights &&
                              summary.keyInsights.map((insight, idx) => (
                                <div
                                  key={idx}
                                  className="d-flex align-items-start mb-3"
                                >
                                  <i
                                    className="material-symbols-rounded me-2"
                                    style={{
                                      color:
                                        insight.icon === "alert"
                                          ? "#ea4335"
                                          : insight.icon === "wrench"
                                            ? "#fbbc04"
                                            : "#5f6368",
                                      fontSize: "1.5rem",
                                    }}
                                  >
                                    {insight.icon === "alert"
                                      ? "warning"
                                      : insight.icon === "wrench"
                                        ? "build"
                                        : "description"}
                                  </i>
                                  <span
                                    style={{
                                      color: "#1a1a1a",
                                      lineHeight: "1.5",
                                    }}
                                  >
                                    {insight.text}
                                  </span>
                                </div>
                              ))}
                          </div>

                          {/* Recommendations Section */}
                          {summary.recommendations &&
                            summary.recommendations.length > 0 && (
                              <div>
                                <h5
                                  className="mb-3"
                                  style={{
                                    color: "#1a1a1a",
                                    fontWeight: 600,
                                    fontSize: "1.25rem",
                                  }}
                                >
                                  Recommendations
                                </h5>
                                <div>
                                  {summary.recommendations.map((rec, idx) => (
                                    <div
                                      key={`rec-${idx}`}
                                      className="d-flex align-items-start mb-3"
                                    >
                                      <i
                                        className="material-symbols-rounded me-2"
                                        style={{
                                          color:
                                            rec.icon === "lightbulb"
                                              ? "#fbbc04"
                                              : rec.icon === "checkmark"
                                                ? "#34a853"
                                                : "#5f6368",
                                          fontSize: "1.5rem",
                                        }}
                                      >
                                        {rec.icon === "lightbulb"
                                          ? "lightbulb"
                                          : rec.icon === "checkmark"
                                            ? "check_circle"
                                            : "build"}
                                      </i>
                                      <span
                                        style={{
                                          color: "#1a1a1a",
                                          lineHeight: "1.5",
                                        }}
                                      >
                                        {rec.text}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </>
                      )}

                      {/* Key Clauses Tab Content */}
                      {activeTab === "clauses" && (
                        <>
                          <h5
                            className="mb-3"
                            style={{
                              color: "#1a1a1a",
                              fontWeight: 600,
                              fontSize: "1.25rem",
                            }}
                          >
                            Key Clauses
                          </h5>
                          {summary.keyClauses &&
                          summary.keyClauses.length > 0 ? (
                            <div>
                              {summary.keyClauses.map((clause, idx) => (
                                <div
                                  key={`clause-${idx}`}
                                  className="mb-4 p-3"
                                  style={{
                                    background: "#f8f9fa",
                                    borderRadius: "8px",
                                    borderLeft: "4px solid #1a73e8",
                                  }}
                                >
                                  <h6
                                    style={{
                                      color: "#1a1a1a",
                                      fontWeight: 600,
                                      marginBottom: "0.5rem",
                                    }}
                                  >
                                    {clause.title}
                                  </h6>
                                  <p
                                    style={{
                                      color: "#5f6368",
                                      marginBottom: 0,
                                      fontSize: "0.9rem",
                                      lineHeight: "1.6",
                                    }}
                                  >
                                    {clause.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p style={{ color: "#5f6368" }}>
                              No key clauses identified in this document.
                            </p>
                          )}
                        </>
                      )}

                      {/* Risks Tab Content */}
                      {activeTab === "risks" && (
                        <>
                          <h5
                            className="mb-3"
                            style={{
                              color: "#1a1a1a",
                              fontWeight: 600,
                              fontSize: "1.25rem",
                            }}
                          >
                            Identified Risks
                          </h5>
                          {summary.risks && summary.risks.length > 0 ? (
                            <div>
                              {summary.risks.map((risk, idx) => (
                                <div
                                  key={`risk-${idx}`}
                                  className="d-flex align-items-start mb-3 p-3"
                                  style={{
                                    background:
                                      risk.severity === "critical" ||
                                      risk.severity === "high"
                                        ? "#fef7f7"
                                        : risk.severity === "medium"
                                          ? "#fff9f0"
                                          : "#f0f7ff",
                                    borderRadius: "8px",
                                    borderLeft: `4px solid ${
                                      risk.severity === "critical" ||
                                      risk.severity === "high"
                                        ? "#ea4335"
                                        : risk.severity === "medium"
                                          ? "#fbbc04"
                                          : "#1a73e8"
                                    }`,
                                  }}
                                >
                                  <i
                                    className="material-symbols-rounded me-3"
                                    style={{
                                      color:
                                        risk.severity === "critical" ||
                                        risk.severity === "high"
                                          ? "#ea4335"
                                          : risk.severity === "medium"
                                            ? "#fbbc04"
                                            : "#1a73e8",
                                      fontSize: "1.5rem",
                                    }}
                                  >
                                    {risk.icon === "warning"
                                      ? "warning"
                                      : risk.icon === "error"
                                        ? "error"
                                        : "info"}
                                  </i>
                                  <div className="flex-grow-1">
                                    <div className="d-flex align-items-center mb-1">
                                      <h6
                                        style={{
                                          color: "#1a1a1a",
                                          fontWeight: 600,
                                          marginBottom: 0,
                                          marginRight: "0.5rem",
                                        }}
                                      >
                                        {risk.title}
                                      </h6>
                                      <span
                                        style={{
                                          fontSize: "0.75rem",
                                          padding: "2px 8px",
                                          borderRadius: "4px",
                                          background:
                                            risk.severity === "critical"
                                              ? "#ea4335"
                                              : risk.severity === "high"
                                                ? "#f28b82"
                                                : risk.severity === "medium"
                                                  ? "#fbbc04"
                                                  : "#4285f4",
                                          color: "white",
                                          fontWeight: 600,
                                          textTransform: "uppercase",
                                        }}
                                      >
                                        {risk.severity}
                                      </span>
                                    </div>
                                    <p
                                      style={{
                                        color: "#5f6368",
                                        marginBottom: 0,
                                        fontSize: "0.9rem",
                                        lineHeight: "1.6",
                                      }}
                                    >
                                      {risk.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p style={{ color: "#5f6368" }}>
                              No significant risks identified in this document.
                            </p>
                          )}
                        </>
                      )}

                      {/* Insights Tab Content */}
                      {activeTab === "insights" && (
                        <>
                          <h5
                            className="mb-3"
                            style={{
                              color: "#1a1a1a",
                              fontWeight: 600,
                              fontSize: "1.25rem",
                            }}
                          >
                            Detailed Analysis
                          </h5>
                          {summary.insights ? (
                            <div>
                              {/* Financial Analysis */}
                              {summary.insights.financialAnalysis && (
                                <div className="mb-4">
                                  <h6
                                    style={{
                                      color: "#1a1a1a",
                                      fontWeight: 600,
                                      marginBottom: "0.75rem",
                                    }}
                                  >
                                    Financial Analysis
                                  </h6>
                                  <p
                                    style={{
                                      color: "#5f6368",
                                      fontSize: "0.9rem",
                                      lineHeight: "1.6",
                                    }}
                                  >
                                    {summary.insights.financialAnalysis}
                                  </p>
                                </div>
                              )}

                              {/* Market Comparison */}
                              {summary.insights.marketComparison && (
                                <div className="mb-4">
                                  <h6
                                    style={{
                                      color: "#1a1a1a",
                                      fontWeight: 600,
                                      marginBottom: "0.75rem",
                                    }}
                                  >
                                    Market Comparison
                                  </h6>
                                  <p
                                    style={{
                                      color: "#5f6368",
                                      fontSize: "0.9rem",
                                      lineHeight: "1.6",
                                    }}
                                  >
                                    {summary.insights.marketComparison}
                                  </p>
                                </div>
                              )}

                              {/* Hidden Costs */}
                              {summary.insights.hiddenCosts &&
                                summary.insights.hiddenCosts.length > 0 && (
                                  <div className="mb-4">
                                    <h6
                                      style={{
                                        color: "#1a1a1a",
                                        fontWeight: 600,
                                        marginBottom: "0.75rem",
                                      }}
                                    >
                                      Potential Hidden Costs
                                    </h6>
                                    <ul style={{ paddingLeft: "1.5rem" }}>
                                      {summary.insights.hiddenCosts.map(
                                        (cost, idx) => (
                                          <li
                                            key={`cost-${idx}`}
                                            style={{
                                              color: "#5f6368",
                                              fontSize: "0.9rem",
                                              lineHeight: "1.6",
                                              marginBottom: "0.5rem",
                                            }}
                                          >
                                            {cost}
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                )}

                              {/* Detailed Recommendations */}
                              {summary.insights.recommendations &&
                                summary.insights.recommendations.length > 0 && (
                                  <div className="mb-4">
                                    <h6
                                      style={{
                                        color: "#1a1a1a",
                                        fontWeight: 600,
                                        marginBottom: "0.75rem",
                                      }}
                                    >
                                      Detailed Recommendations
                                    </h6>
                                    <ul style={{ paddingLeft: "1.5rem" }}>
                                      {summary.insights.recommendations.map(
                                        (rec, idx) => (
                                          <li
                                            key={`insight-rec-${idx}`}
                                            style={{
                                              color: "#5f6368",
                                              fontSize: "0.9rem",
                                              lineHeight: "1.6",
                                              marginBottom: "0.5rem",
                                            }}
                                          >
                                            {rec}
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  </div>
                                )}
                            </div>
                          ) : (
                            <p style={{ color: "#5f6368" }}>
                              No detailed insights available for this document.
                            </p>
                          )}
                        </>
                      )}
                    </div>

                    {/* Right Sidebar - Only show on Overview tab */}
                    {activeTab === "overview" && (
                      <div
                        style={{
                          width: "280px",
                          borderLeft: "1px solid #e0e0e0",
                          padding: "1.5rem",
                          background: "#fafafa",
                        }}
                      >
                        {/* Benchmark Section */}
                        {summary.benchmark && (
                          <div className="mb-4">
                            <h6
                              style={{
                                color: "#1a1a1a",
                                fontWeight: 600,
                                fontSize: "1rem",
                                marginBottom: "1rem",
                              }}
                            >
                              Benchmark
                            </h6>
                            <div>
                              <div
                                style={{
                                  color: "#5f6368",
                                  fontSize: "0.875rem",
                                  marginBottom: "0.5rem",
                                }}
                              >
                                Your Spending
                              </div>
                              <div
                                style={{
                                  color: "#1a1a1a",
                                  fontSize: "1.75rem",
                                  fontWeight: 700,
                                  marginBottom: "0.5rem",
                                }}
                              >
                                $
                                {summary.benchmark.spending
                                  ? summary.benchmark.spending.toLocaleString()
                                  : "0"}
                              </div>
                              <div
                                style={{
                                  color: "#5f6368",
                                  fontSize: "0.875rem",
                                }}
                              >
                                {summary.benchmark.comparison}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Upcoming Events Section */}
                        {summary.upcomingEvents &&
                          summary.upcomingEvents.length > 0 && (
                            <div>
                              <h6
                                style={{
                                  color: "#1a1a1a",
                                  fontWeight: 600,
                                  fontSize: "1rem",
                                  marginBottom: "1rem",
                                }}
                              >
                                Upcoming Events
                              </h6>
                              {summary.upcomingEvents.map((event, idx) => (
                                <div
                                  key={`event-${idx}`}
                                  className="d-flex align-items-start mb-3"
                                >
                                  <i
                                    className="material-symbols-rounded me-2"
                                    style={{
                                      color: "#1a73e8",
                                      fontSize: "1.25rem",
                                    }}
                                  >
                                    event
                                  </i>
                                  <div>
                                    <div
                                      style={{
                                        color: "#1a1a1a",
                                        fontSize: "0.875rem",
                                        lineHeight: "1.4",
                                      }}
                                    >
                                      {event.text}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SummaryPage;
