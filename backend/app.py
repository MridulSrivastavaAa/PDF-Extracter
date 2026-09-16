"""
FastAPI Backend Application for Standalone MoSPI PDF Extractor Suite.
Provides endpoints for file upload, format classification, live extraction,
preview datasets, and styled Excel exports.
"""

import os
import sys
import uuid
import shutil
from typing import Optional
from pydantic import BaseModel
from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse

# Ensure current directory is in sys.path
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from core.universal_engine import extract_pdf_to_canonical_dataset
from core.excel_exporter import export_records_to_styled_excel
from core.classifier import classify_pdf_report

UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")
EXPORT_DIR = os.path.join(BASE_DIR, "exports")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(EXPORT_DIR, exist_ok=True)

app = FastAPI(
    title="MoSPI PDF Extractor API",
    description="Universal Adaptive Extractor for MoSPI Flash Report PDFs (2001 - 2026+)",
    version="2.0.0"
)

# Enable CORS for React frontend (Vite dev server default port 5173, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "MoSPI Universal PDF Extractor API",
        "version": "2.0.0",
        "supported_formats": ["PAIMANA (2025-2027+)", "Modern Flash (2024-2025)", "Legacy Milestone (2001-2024)", "Future-Adaptive Semantic"]
    }

@app.get("/api/sample-files")
def list_sample_files():
    """Lists representative sample files from the workspace for one-click testing."""
    samples = [
        {
            "name": "May 2026 Flash Report (PAIMANA Portal Era)",
            "path": os.path.abspath(os.path.join(BASE_DIR, "../../2026-2027/FlashReport_May2026.pdf")),
            "era": "PAIMANA 2026-2027",
            "size": "2,200+ projects"
        },
        {
            "name": "July 2024 Flash Report (Modern Table 6/7 Era)",
            "path": os.path.abspath(os.path.join(BASE_DIR, "../../2024-2025/July_Part-II.pdf")),
            "era": "Modern Flash 2024-2025",
            "size": "1,700+ projects"
        },
        {
            "name": "March 2023 Flash Report (Historical Milestone Era)",
            "path": os.path.abspath(os.path.join(BASE_DIR, "../../2022-2023/FR_march_2023.pdf")),
            "era": "Legacy Milestones 2001-2024",
            "size": "1,400+ projects"
        }
    ]
    available = [s for s in samples if os.path.exists(s["path"])]
    return {"samples": available}

@app.post("/api/classify")
async def classify_uploaded_pdf(file: UploadFile = File(...)):
    """Classifies a PDF and returns document metadata and detected structure."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    temp_id = str(uuid.uuid4())[:8]
    temp_path = os.path.join(UPLOAD_DIR, f"{temp_id}_{file.filename}")
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        classification = classify_pdf_report(temp_path)
        return {"filename": file.filename, "classification": classification}
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/api/extract")
async def extract_pdf(file: UploadFile = File(...)):
    """Upload and extract a MoSPI PDF into canonical 20-column dataset and styled Excel."""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    file_id = str(uuid.uuid4())[:8]
    clean_name = os.path.splitext(file.filename)[0]
    saved_pdf_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")
    
    with open(saved_pdf_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    try:
        # Run universal extraction pipeline
        result = extract_pdf_to_canonical_dataset(saved_pdf_path)
        
        # Export styled Excel file
        excel_filename = f"{clean_name}_Extracted_Canonical_{file_id}.xlsx"
        excel_path = os.path.join(EXPORT_DIR, excel_filename)
        export_records_to_styled_excel(result['records'], excel_path)
        
        # Build response
        return {
            "status": "success",
            "file_id": file_id,
            "filename": file.filename,
            "classification": result['classification'],
            "engine_used": result['engine_used'],
            "execution_time_seconds": result['execution_time_seconds'],
            "summary_metrics": result['summary_metrics'],
            "records_count": result['records_count'],
            "download_url": f"/api/download/{excel_filename}",
            "records_preview": result['records'][:200]  # First 200 for fast UI preview
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")

class SampleExtractRequest(BaseModel):
    sample_path: Optional[str] = None
    path: Optional[str] = None

@app.post("/api/extract-sample")
async def extract_sample_pdf(
    sample_path: Optional[str] = Query(None),
    body: Optional[SampleExtractRequest] = None
):
    """Extract a pre-existing workspace sample PDF directly."""
    target_path = sample_path
    if not target_path and body:
        target_path = body.sample_path or body.path
        
    if not target_path or not os.path.exists(target_path):
        raise HTTPException(status_code=404, detail="Sample PDF not found on disk.")
        
    clean_name = os.path.splitext(os.path.basename(target_path))[0]
    file_id = str(uuid.uuid4())[:8]
    
    try:
        result = extract_pdf_to_canonical_dataset(target_path)
        excel_filename = f"{clean_name}_Extracted_{file_id}.xlsx"
        excel_path = os.path.join(EXPORT_DIR, excel_filename)
        export_records_to_styled_excel(result['records'], excel_path)
        
        return {
            "status": "success",
            "file_id": file_id,
            "filename": os.path.basename(target_path),
            "classification": result['classification'],
            "engine_used": result['engine_used'],
            "execution_time_seconds": result['execution_time_seconds'],
            "summary_metrics": result['summary_metrics'],
            "records_count": result['records_count'],
            "download_url": f"/api/download/{excel_filename}",
            "records_preview": result['records'][:200]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sample extraction failed: {str(e)}")

@app.get("/api/download/{filename}")
def download_excel(filename: str):
    """Download generated styled Excel workbook."""
    file_path = os.path.join(EXPORT_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Requested file does not exist.")
        
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

# Mount React static files if built
FRONTEND_DIST = os.path.abspath(os.path.join(BASE_DIR, "../frontend/dist"))
if os.path.exists(FRONTEND_DIST):
    from fastapi.staticfiles import StaticFiles
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    import threading
    import webbrowser
    import time

    def open_browser():
        time.sleep(1.2)
        print("\n>>> Web Dashboard ready! Opening http://localhost:8000 in your browser...")
        try:
            webbrowser.open("http://localhost:8000")
        except Exception as e:
            print(f"Could not open browser automatically: {e}")

    threading.Thread(target=open_browser, daemon=True).start()
    print("Starting MoSPI Universal PDF Extractor Server on http://localhost:8000 ...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
