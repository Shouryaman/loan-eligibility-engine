import React, { useState } from "react";

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("❗ Please select a CSV file.");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5678/webhook/upload-users", {
        method: "POST",
        body: formData,
      });

      setMessage(
        response.ok
          ? "✅ CSV uploaded successfully! Workflow triggered."
          : "❌ Upload failed. Check n8n logs."
      );
    } catch (error) {
      setMessage("🔥 Error connecting to n8n server.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      {/* Header Section */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Loan Eligibility Engine</h1>
        <p style={styles.headerSubtitle}>
          Upload the user CSV file to start the matching workflow.
        </p>
      </header>

      {/* Content Section */}
      <main style={styles.main}>
        <label style={styles.dropzone}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {file ? (
            <span style={styles.fileName}>📁 {file.name}</span>
          ) : (
            <span style={styles.dropText}>📤 Drag & Drop CSV or Click to Browse</span>
          )}
        </label>

        <button
          style={styles.button}
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Processing..." : "Upload CSV"}
        </button>

        {message && (
          <div
            style={
              message.startsWith("✅") ? styles.success : styles.error
            }
          >
            {message}
          </div>
        )}
      </main>
    </div>
  );
}

/* -------------------- FULL-SCREEN STYLES -------------------- */
const styles = {
  page: {
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    background: "#F5F7FA",
    overflow: "hidden",
  },

  header: {
    padding: "40px 60px",
    background: "linear-gradient(135deg, #2563EB, #4F46E5)",
    color: "white",
    width: "100%",
  },

  headerTitle: {
    fontSize: 36,
    marginBottom: 10,
    fontWeight: 700,
  },

  headerSubtitle: {
    fontSize: 18,
    opacity: 0.9,
  },

  main: {
    flex: 1,
    padding: "60px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },

  dropzone: {
    width: "50%",
    minWidth: "400px",
    border: "3px dashed #2563EB",
    borderRadius: 12,
    padding: "50px 30px",
    background: "white",
    cursor: "pointer",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 30,
  },

  dropText: {
    color: "#444",
  },

  fileName: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#111",
  },

  button: {
    padding: "14px 35px",
    fontSize: 18,
    background: "#2563EB",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },

  success: {
    marginTop: 25,
    padding: 15,
    background: "#D1FAE5",
    color: "#065F46",
    borderRadius: 8,
    fontSize: 16,
    fontWeight: "bold",
    width: "50%",
    minWidth: "400px",
  },

  error: {
    marginTop: 25,
    padding: 15,
    background: "#FEE2E2",
    color: "#B91C1C",
    borderRadius: 8,
    fontSize: 16,
    fontWeight: "bold",
    width: "50%",
    minWidth: "400px",
  },
};