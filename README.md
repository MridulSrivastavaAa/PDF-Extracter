# MoSPI Universal PDF Extractor & Converter

An enterprise-grade, future-proof extraction engine and interactive web application designed to ingest Ministry of Statistics and Programme Implementation (MoSPI) Infrastructure Project Flash Reports across three decades (2001–2027+) and dynamically adapt to future government layout modifications.

---

## 🌟 Key Features

1. **Multi-Era Format Support**:
   - **Legacy Era (2001 – Feb 2024)**: Annexure-III multi-page project layouts with milestone ratios (`Completed / Total`).
   - **Modern Flash Era (Feb 2024 – Feb 2025)**: Table 6 / Table 7 columnar layouts with financial/physical progress indicators.
   - **PAIMANA Era (Feb 2025 – 2027+)**: Project Analysis and Integrated Monitoring Application with single/multi-line grid layouts, boundary guards against serial number bleed (`sl_no + 1`), and strict percentage validation ($0 \le \text{progress} \le 100$).
   - **Adaptive Future-Proof Engine**: Dynamic header discovery, bounding-box geometry clustering, and semantic keyword scoring that automatically extracts data even if the government alters table column order, headers, or formatting.

2. **Canonical 20-Column Master Schema**:
   Every extracted file conforms to the unified schema:
   `['project_id', 'legacy_ocms_code', 'PMGID', 'project_name', 'ministry_department', 'state', 'Date of approval', 'Original cost (₹ Cr)', 'revised cost (₹ Cr)', 'Anticipated cost (₹ Cr)', 'cumulative expenditure (₹ Cr)', 'cost_revision_flag', 'original date of commissioning', 'anticipated commissioning', 'ministry_department/milestone', 'physical progress', 'financial_year', 'month', 'year', 'month_order']`

3. **Government-Grade Excel Output**:
   - Deep Navy Blue header (`#1F4E79`) with white bold text.
   - Alternating zebra striping (`#F2F5F9`).
   - Thin cell borders (`#D3D3D3`), auto-fitted column widths, and frozen top pane.

4. **Modern React Web Dashboard**:
   - Interactive drag-and-drop file uploader.
   - One-click sample report selector (PAIMANA May 2026, Modern Oct 2024, Legacy Dec 2022).
   - Real-time extraction progress and statistics (total projects, active projects, processing speed, format classified).
   - Live searchable and filterable preview table.
   - Direct one-click `.xlsx` download.

5. **Comprehensive Technical Documentation**:
   - Includes a 6-page comprehensive **Technical Architecture & Defense Guide** (`docs/MoSPI_Extractor_Architecture_and_Technical_Guide.pdf`) with complete architectural diagrams, parsing algorithms, boundary condition proofs, and technical interview/defense Q&A.

---

## 🚀 Quick Start

### Method 1: One-Click Launcher (Windows)
Simply double-click:
```bat
run_app.bat
```
This automatically verifies dependencies, starts the FastAPI server on port 8000, and opens your browser to `http://localhost:8000`.

### Method 2: Command Line

#### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 2. Start Backend & Web Server
```bash
python backend/app.py
```
Open your browser at: **`http://localhost:8000`**

---

## 📁 Directory Structure

```
standalone_pdf_extractor/
├── run_app.bat                        # Windows 1-click batch launcher
├── requirements.txt                   # Unified Python dependencies
├── README.md                          # Project documentation
├── backend/
│   ├── app.py                         # FastAPI REST API & Static Single-Page App server
│   ├── core/
│   │   ├── schema.py                  # Canonical 20-column schema & Pydantic models
│   │   ├── classifier.py              # Era & metadata classifier
│   │   ├── extractor_paimana.py       # PAIMANA 2025–2027+ parser with boundary protection
│   │   ├── extractor_modern.py        # Modern Flash 2024–2025 parser
│   │   ├── extractor_legacy.py        # Legacy 2001–2024 milestone ratio parser
│   │   ├── extractor_adaptive.py      # Heuristic future-proof layout parser
│   │   ├── universal_engine.py        # 4-tier cascading orchestrator
│   │   └── excel_exporter.py          # Openpyxl government-grade styled workbook generator
│   ├── uploads/                       # Temporary PDF upload storage
│   └── exports/                       # Generated canonical Excel files
├── frontend/
│   ├── package.json                   # Vite + React configuration
│   ├── index.html                     # Google Outfit/Inter typography & viewport
│   ├── src/
│   │   ├── App.jsx                    # Reactive dashboard UI
│   │   ├── App.css                    # Glassmorphic dark theme & animations
│   │   └── main.jsx                   # Entry point
│   └── dist/                          # Pre-compiled, production-ready frontend bundle
└── docs/
    ├── generate_architecture_pdf.py   # ReportLab PDF documentation builder
    └── MoSPI_Extractor_Architecture_and_Technical_Guide.pdf  # 6-page Technical Guide
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check and engine status |
| `GET` | `/api/sample-files` | List pre-configured sample PDFs available in the workspace |
| `POST` | `/api/classify` | Inspect PDF and return era classification and metadata |
| `POST` | `/api/extract` | Upload PDF, execute 4-tier extraction cascade, generate styled Excel |
| `POST` | `/api/extract-sample` | Trigger extraction directly on a server-side sample PDF |
| `GET` | `/api/download/{filename}` | Download the styled canonical Excel workbook |

---

## 🛠 Rebuilding the Frontend (Optional)

If you modify files in `frontend/src/`:
```bash
cd frontend
npm install
npm run build
```
The compiled assets will be placed into `frontend/dist/`, which FastAPI serves automatically.

---

## 📖 Technical Defense & Architecture Guide

For in-depth explanations of:
- The 4-Tier Cascading Fallback Architecture
- PyMuPDF Block Extraction vs OCR vs Native Tables
- Regular Expression Boundary Conditions (`sl_no + 1` bleed protection)
- State & Ministry Normalization Matrices
- Technical Defense Q&A for Stakeholders and Auditors

Refer to:  
`docs/MoSPI_Extractor_Architecture_and_Technical_Guide.pdf`
