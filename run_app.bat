@echo off
setlocal enabledelayedexpansion
title MoSPI Universal PDF Extractor ^& Converter
color 0B

cd /d "%~dp0"

echo ===============================================================================
echo                MoSPI UNIVERSAL PDF EXTRACTOR ^& CONVERTER
echo            Multi-Era Government Infrastructure Report Parsing Engine
echo ===============================================================================
echo.

echo [1/3] Checking Python Environment...
set "PYTHON_EXE=python"
python --version >nul 2>&1
if %errorlevel% neq 0 (
    py --version >nul 2>&1
    if %errorlevel% equ 0 (
        set "PYTHON_EXE=py"
    ) else (
        color 0C
        echo [ERROR] Python was not found on your system!
        echo Please ensure Python 3.10+ is installed and added to PATH.
        echo Download from: https://www.python.org/downloads/
        echo.
        pause
        exit /b 1
    )
)
%PYTHON_EXE% --version

echo.
echo [2/3] Checking Python Dependencies...
%PYTHON_EXE% -c "import fastapi, uvicorn, pymupdf, openpyxl, pydantic" >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Installing required dependencies...
    pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo [WARNING] Pip encountered a warning. Attempting to start server...
    )
) else (
    echo [OK] All core dependencies are ready!
)

echo.
echo [3/3] Starting MoSPI Extractor Web Application...
echo ===============================================================================
echo  Local URL : http://localhost:8000
echo  The web dashboard will open automatically in your browser.
echo  Keep this window open while using the application.
echo  Press Ctrl+C to stop the server anytime.
echo ===============================================================================
echo.

%PYTHON_EXE% backend/app.py

if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERROR] The server stopped. Exit code: %errorlevel%
    pause
)
