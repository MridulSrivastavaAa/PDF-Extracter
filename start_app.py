"""
MoSPI Universal PDF Extractor & Converter - One-Click Launcher
Double-click this file or run: python start_app.py
"""
import os
import sys
import webbrowser
import threading
import time

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")

# Verify core dependencies
try:
    import fastapi
    import uvicorn
    import pymupdf
    import openpyxl
    import pydantic
except ImportError:
    print("[INFO] Installing missing Python dependencies from requirements.txt...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", os.path.join(BASE_DIR, "requirements.txt")])
    import fastapi
    import uvicorn

sys.path.insert(0, BACKEND_DIR)
from app import app

def open_browser():
    time.sleep(1.2)
    url = "http://localhost:8000"
    print(f"\n[OK] Server is ready! Opening dashboard in browser: {url}")
    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"Could not open browser automatically: {e}")

if __name__ == "__main__":
    print("=" * 75)
    print("           MoSPI UNIVERSAL PDF EXTRACTOR & CONVERTER")
    print("=" * 75)
    print(" >> Local URL  : http://localhost:8000")
    print(" >> IP URL     : http://127.0.0.1:8000")
    print(" >> Status     : Server is running...")
    print(" >> Note       : Keep this window OPEN while using the application.")
    print(" >> Stop       : Press Ctrl+C anytime to stop.")
    print("=" * 75)

    threading.Thread(target=open_browser, daemon=True).start()
    uvicorn.run(app, host="0.0.0.0", port=8000)
