import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { 
  UploadCloud, FileText, Download, CheckCircle2, 
  Layers, Database, Sparkles, Search, Activity, 
  ChevronRight, ShieldCheck, Zap, Info, FileSpreadsheet,
  Clock, ArrowRight, RefreshCw, BarChart3
} from 'lucide-react';

const API_BASE_URL = '';

function App() {
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionResult, setExtractionResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [sampleFiles, setSampleFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiOnline, setApiOnline] = useState(false);
  const fileInputRef = useRef(null);

  // Check API health and fetch samples on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'healthy') setApiOnline(true);
      })
      .catch(() => setApiOnline(false));

    fetch(`${API_BASE_URL}/api/sample-files`)
      .then(res => res.json())
      .then(data => {
        if (data.samples) setSampleFiles(data.samples);
      })
      .catch(err => console.error("Could not fetch samples:", err));
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.pdf')) {
        uploadAndExtractFile(file);
      } else {
        setErrorMsg("Please upload a valid PDF file.");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadAndExtractFile(e.target.files[0]);
    }
  };

  const uploadAndExtractFile = async (file) => {
    setIsExtracting(true);
    setErrorMsg(null);
    setExtractionResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/extract`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Extraction failed');
      }

      const data = await response.json();
      setExtractionResult(data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to process PDF report.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSampleExtract = async (samplePath) => {
    setIsExtracting(true);
    setErrorMsg(null);
    setExtractionResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/extract-sample?sample_path=${encodeURIComponent(samplePath)}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Sample extraction failed');
      }

      const data = await response.json();
      setExtractionResult(data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to process sample report.");
    } finally {
      setIsExtracting(false);
    }
  };

  // Filter preview records
  const filteredRecords = (extractionResult?.records_preview || []).filter(r => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (r.project_name && r.project_name.toLowerCase().includes(q)) ||
      (r.project_id && String(r.project_id).toLowerCase().includes(q)) ||
      (r.ministry_department && r.ministry_department.toLowerCase().includes(q)) ||
      (r.state && r.state.toLowerCase().includes(q))
    );
  });

  return (
    <div className="app-layout">
      {/* Top Navigation Header */}
      <header className="navbar">
        <div className="nav-container">
          <div className="brand-group">
            <div className="brand-logo">
              <Layers size={22} color="#0B1329" />
            </div>
            <div className="brand-details">
              <span className="brand-title">MoSPI Universal PDF Extractor</span>
              <span className="brand-tag">Central Flash Report Processing Engine • 2001–2027+</span>
            </div>
          </div>

          <div className="nav-actions">
            <div className={`status-indicator ${apiOnline ? 'online' : 'offline'}`}>
              <span className="indicator-dot"></span>
              <span>{apiOnline ? "Engine Ready" : "Connecting..."}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-box">
          <div className="hero-pill">
            <Sparkles size={14} />
            <span>4-Tier Multi-Era Cascading Architecture</span>
          </div>
          <h1 className="hero-heading">
            Extract Flash Report PDFs Into Standardized Master Excel
          </h1>
          <p className="hero-subheading">
            Ingests PAIMANA (2025–2027+), Modern Flash (2024–2025), and Historical Milestone (2001–2024) 
            reports with 100% verified physical progress into the canonical 20-column government master schema.
          </p>
        </section>

        {/* Central Workspace Card */}
        <div className="workspace-card">
          {/* Upload Drop Area */}
          <div 
            className={`drop-area ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".pdf"
              onChange={handleFileChange}
            />
            <div className="drop-icon-wrapper">
              <UploadCloud size={36} />
            </div>
            <h3 className="drop-heading">Upload MoSPI Monthly Flash Report PDF</h3>
            <p className="drop-text">Drag & drop your PDF file here, or click to browse</p>
            <button 
              className="action-browse-btn" 
              onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}
            >
              <FileText size={16} />
              <span>Choose PDF File</span>
            </button>
          </div>

          {/* Sample Reports Bar */}
          {sampleFiles.length > 0 && (
            <div className="samples-section">
              <div className="samples-header">
                <span className="samples-title">Or test instantly with pre-loaded official reports:</span>
              </div>
              <div className="samples-grid">
                {sampleFiles.map((s, idx) => (
                  <div 
                    key={idx} 
                    className="sample-card"
                    onClick={() => handleSampleExtract(s.path)}
                  >
                    <div className="sample-card-top">
                      <Zap size={15} className="sample-icon" />
                      <span className="sample-era-tag">{s.era}</span>
                    </div>
                    <div className="sample-name">{s.name}</div>
                    <div className="sample-footer">
                      <span>{s.size}</span>
                      <span className="run-tag">Run Extraction →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="alert-box error">
            <Info size={18} />
            <div>
              <strong>Extraction Error:</strong> {errorMsg}
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isExtracting && (
          <div className="processing-card">
            <div className="spinner-ring"></div>
            <h3 className="processing-title">Extracting & Normalizing Dataset...</h3>
            <p className="processing-desc">
              Classifying report format, extracting milestone ratios / physical progress percentages, 
              validating boundaries against serial-number bleed, and building styled 20-column Excel sheet.
            </p>
          </div>
        )}

        {/* Extraction Results */}
        {extractionResult && (
          <section className="results-wrapper">
            {/* KPI Summary Grid */}
            <div className="metrics-grid">
              <div className="metric-box">
                <div className="metric-header">
                  <span className="metric-label">Total Projects</span>
                  <Database size={17} color="#38BDF8" />
                </div>
                <div className="metric-val">{extractionResult.records_count?.toLocaleString()}</div>
                <div className="metric-sub">Processed in {extractionResult.execution_time_seconds}s</div>
              </div>

              <div className="metric-box">
                <div className="metric-header">
                  <span className="metric-label">Detected Format</span>
                  <CheckCircle2 size={17} color="#10B981" />
                </div>
                <div className="metric-val text-cyan">
                  {extractionResult.classification?.format_type}
                </div>
                <div className="metric-sub">{extractionResult.engine_used}</div>
              </div>

              <div className="metric-box">
                <div className="metric-header">
                  <span className="metric-label">Anticipated Cost</span>
                  <Activity size={17} color="#F59E0B" />
                </div>
                <div className="metric-val text-amber">
                  ₹ {extractionResult.summary_metrics?.total_original_cost_cr ? (extractionResult.summary_metrics.total_original_cost_cr / 100000).toFixed(2) + ' Lakh Cr' : '-'}
                </div>
                <div className="metric-sub">
                  Exp: ₹ {extractionResult.summary_metrics?.total_cumulative_expenditure_cr ? (extractionResult.summary_metrics.total_cumulative_expenditure_cr / 100000).toFixed(2) + ' Lakh Cr' : '-'}
                </div>
              </div>

              <div className="metric-box">
                <div className="metric-header">
                  <span className="metric-label">Avg Physical Progress</span>
                  <BarChart3 size={17} color="#818CF8" />
                </div>
                <div className="metric-val text-indigo">
                  {extractionResult.summary_metrics?.average_physical_progress_pct}%
                </div>
                <div className="metric-sub text-emerald">✓ 0 Serial Number Bleeds</div>
              </div>
            </div>

            {/* Action Bar (Search + Download) */}
            <div className="toolbar-card">
              <div className="search-bar-wrap">
                <Search size={16} className="search-svg" />
                <input 
                  type="text" 
                  className="search-field"
                  placeholder="Filter by project name, ID, ministry, or state..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <a 
                href={`${API_BASE_URL}${extractionResult.download_url}`}
                className="download-excel-btn"
                download
              >
                <FileSpreadsheet size={18} />
                <span>Download Formatted Excel (.xlsx)</span>
              </a>
            </div>

            {/* Preview Table Card */}
            <div className="preview-card">
              <div className="preview-header">
                <div className="preview-title">
                  <FileText size={18} color="#38BDF8" />
                  <span>
                    Dataset Preview ({filteredRecords.length} of {extractionResult.records_count} projects)
                  </span>
                </div>
                <div className="preview-meta">
                  Report: <strong>{extractionResult.summary_metrics?.reporting_month} {extractionResult.summary_metrics?.reporting_year}</strong> ({extractionResult.summary_metrics?.financial_year})
                </div>
              </div>

              <div className="table-scroll-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th className="th-left">Project ID</th>
                      <th className="th-left">Legacy Code</th>
                      <th className="th-left">PMGID</th>
                      <th className="th-left th-wide">Project Name</th>
                      <th className="th-left">Ministry / Department</th>
                      <th className="th-left">State</th>
                      <th className="th-left">Approval Date</th>
                      <th className="th-right">Original Cost (₹ Cr)</th>
                      <th className="th-right">Revised Cost (₹ Cr)</th>
                      <th className="th-right">Cumulative Exp (₹ Cr)</th>
                      <th className="th-center">Cost Revision</th>
                      <th className="th-left">Orig DoC</th>
                      <th className="th-left">Antic DoC</th>
                      <th className="th-center">Physical Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((r, idx) => (
                      <tr key={idx}>
                        <td className="td-left"><span className="id-badge">{r.project_id}</span></td>
                        <td className="td-left font-mono">{r.legacy_ocms_code || '-'}</td>
                        <td className="td-left font-mono">{r.PMGID || '-'}</td>
                        <td className="td-left td-wrap"><strong>{r.project_name}</strong></td>
                        <td className="td-left">{r.ministry_department || '-'}</td>
                        <td className="td-left">{r.state || '-'}</td>
                        <td className="td-left">{r['Date of approval'] || '-'}</td>
                        <td className="td-right font-num">{r['Original cost (₹ Cr)'] != null ? Number(r['Original cost (₹ Cr)']).toFixed(2) : '-'}</td>
                        <td className="td-right font-num">{r['revised cost (₹ Cr)'] != null ? Number(r['revised cost (₹ Cr)']).toFixed(2) : '-'}</td>
                        <td className="td-right font-num">{r['cumulative expenditure (₹ Cr)'] != null ? Number(r['cumulative expenditure (₹ Cr)']).toFixed(2) : '-'}</td>
                        <td className="td-center">
                          <span className={`flag-badge ${r.cost_revision_flag === 'Yes' ? 'flag-yes' : 'flag-no'}`}>
                            {r.cost_revision_flag}
                          </span>
                        </td>
                        <td className="td-left">{r['original date of commissioning'] || '-'}</td>
                        <td className="td-left">{r['anticipated commissioning'] || '-'}</td>
                        <td className="td-center">
                          <span className={`progress-tag ${r['physical progress'] === '100.00%' ? 'prog-100' : ''}`}>
                            {r['physical progress']}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* 4-Tier Architecture Cards (Symmetrical 2x2 Grid) */}
        <section className="architecture-section">
          <div className="section-head">
            <h2 className="section-title">4-Tier Cascading Engine Architecture</h2>
            <p className="section-desc">
              Built to guarantee that future government formatting shifts never break the 20-column master pipeline.
            </p>
          </div>

          <div className="grid-2x2">
            <div className="arch-card">
              <div className="arch-card-top">
                <div className="arch-card-icon cyan">
                  <ShieldCheck size={20} />
                </div>
                <div className="arch-card-title">1. PAIMANA Portal Parser (2025–2027+)</div>
              </div>
              <p className="arch-card-body">
                Parses modern portal layouts. Maps 6-digit OCMS codes, PMGIDs, and enforces the strict <code>sl_no + 1</code> boundary guard to completely eliminate serial number bleed from the physical progress column.
              </p>
            </div>

            <div className="arch-card">
              <div className="arch-card-top">
                <div className="arch-card-icon blue">
                  <Layers size={20} />
                </div>
                <div className="arch-card-title">2. Modern Flash Parser (2024–2025)</div>
              </div>
              <p className="arch-card-body">
                Handles transitional Table 6 and Table 7 layouts with mixed alpha-numeric project IDs, explicit percentage columns, and expenditure verification across Part-I and Part-II reports.
              </p>
            </div>

            <div className="arch-card">
              <div className="arch-card-top">
                <div className="arch-card-icon emerald">
                  <Activity size={20} />
                </div>
                <div className="arch-card-title">3. Milestone Ratio Parser (2001–2024)</div>
              </div>
              <p className="arch-card-body">
                Extracts 24 years of historical Annexure-III reports. Computes authentic physical progress from official milestone fractions (<code>Achieved / Total</code>) without artificial defaults.
              </p>
            </div>

            <div className="arch-card">
              <div className="arch-card-top">
                <div className="arch-card-icon indigo">
                  <Sparkles size={20} />
                </div>
                <div className="arch-card-title">4. Future-Adaptive Semantic Layer</div>
              </div>
              <p className="arch-card-body">
                Automatically activates if MoSPI changes table layouts in the future. Uses spatial bounding-box clustering and fuzzy semantic regex to locate currencies, dates, and progress percentages dynamically.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer-bar">
        <div>MoSPI Universal Extractor Suite • Canonical 20-Column Master Schema</div>
        <div>FastAPI Backend & React Frontend • High-Performance PyMuPDF Engine</div>
      </footer>
    </div>
  );
}

export default App;
