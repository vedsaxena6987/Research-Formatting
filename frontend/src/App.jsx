import React, { useState } from 'react';
import './index.css';

function App() {
  const [contentFile, setContentFile] = useState(null);
  const [templateFile, setTemplateFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState('docx');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultUrl, setResultUrl] = useState(null);

  const handleFileChange = (e, setter) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('File exceeds 10MB limit.');
        return;
      }
      setError('');
      setter(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!contentFile || !templateFile) {
      setError("Please upload both a content document and a template.");
      return;
    }

    setLoading(true);
    setError('');
    setResultUrl(null);

    const formData = new FormData();
    formData.append("content_file", contentFile);
    formData.append("template_file", templateFile);
    formData.append("output_format", outputFormat);

    try {
      // Direct to FastAPI backend running on port 8000
      const response = await fetch('http://localhost:8000/api/format', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setResultUrl(url);
      } else {
        const errData = await response.json();
        setError(errData.detail || "An error occurred during formatting.");
      }
    } catch (err) {
      setError("Failed to connect to the server. Ensure FastAPI is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="logo">
          <span className="material-symbols-outlined icon-hero">auto_awesome</span>
          <h1>AutoFormat</h1>
        </div>
        <p className="subtitle">Transform your documents with pure aesthetic.</p>
      </header>

      <main className="main-content">
        <div className="card glass-panel">
          <form onSubmit={handleSubmit}>
            <div className="upload-container">
              <div className={`upload-box ${contentFile ? 'has-file' : ''}`}>
                <span className="material-symbols-outlined">description</span>
                <h3>Content Document</h3>
                <p>The text you want to format</p>
                <input
                  type="file"
                  accept=".docx,.md,.txt,.tex"
                  onChange={(e) => handleFileChange(e, setContentFile)}
                />
                {contentFile && <span className="file-name">{contentFile.name}</span>}
              </div>

              <div className={`upload-box ${templateFile ? 'has-file' : ''}`}>
                <span className="material-symbols-outlined">design_services</span>
                <h3>Template Document</h3>
                <p>The style you want to apply</p>
                <input
                  type="file"
                  accept=".docx,.tex"
                  onChange={(e) => handleFileChange(e, setTemplateFile)}
                />
                {templateFile && <span className="file-name">{templateFile.name}</span>}
              </div>
            </div>

            <div className="options-container">
              <label htmlFor="format-select">Output Format</label>
              <div className="select-wrapper">
                <select
                  id="format-select"
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                >
                  <option value="docx">Microsoft Word (.docx)</option>
                  <option value="latex">LaTeX (.tex)</option>
                  <option value="pdf">PDF Document (.pdf)</option>
                </select>
                <span className="material-symbols-outlined select-icon">expand_more</span>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <span className="material-symbols-outlined">error</span> {error}
              </div>
            )}

            <button
              className={`submit-btn ${loading ? 'loading' : ''}`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <><span className="spinner"></span> Processing...</>
              ) : (
                <><span className="material-symbols-outlined">magic_button</span> Apply Formatting</>
              )}
            </button>
          </form>
        </div>

        {resultUrl && (
          <div className="result-container glass-panel fade-in">
            <h2>
              <span className="material-symbols-outlined">check_circle</span> Formatting Complete
            </h2>
            <p>Your document is ready.</p>

            <div className="preview-box">
              {outputFormat === 'pdf' ? (
                <iframe 
                  src={resultUrl} 
                  title="PDF Preview" 
                  style={{ width: '100%', height: '500px', border: 'none', borderRadius: '0.5rem' }} 
                />
              ) : (
                <>
                  <span className="material-symbols-outlined preview-icon">preview</span>
                  <p>Live preview is limited for this file type. Please download to view.</p>
                </>
              )}
            </div>

            <a
              href={resultUrl}
              download={`formatted_document.${outputFormat}`}
              className="download-btn"
            >
              <span className="material-symbols-outlined">download</span> Download File
            </a>
          </div>
        )}
      </main>
      
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>
    </div>
  );
}

export default App;
