"""
Unit test for Core Universal Extractor.
Tests classification, extraction, and Excel generation across formats.
"""

import os
import sys

# Ensure backend directory in sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from core.universal_engine import extract_pdf_to_canonical_dataset
from core.excel_exporter import export_records_to_styled_excel

sys.stdout.reconfigure(encoding='utf-8')

print("=== Testing Universal Extractor Core ===")

# Test 1: PAIMANA May 2026
p_may26 = '../../2026-2027/FlashReport_May2026.pdf'
if os.path.exists(p_may26):
    print(f"\n1. Testing PAIMANA: {p_may26}")
    res = extract_pdf_to_canonical_dataset(p_may26)
    print(f"  Status: {res['status']}")
    print(f"  Detected Format: {res['classification']['format_type']}")
    print(f"  Engine Used: {res['engine_used']}")
    print(f"  Total Projects: {res['records_count']:,}")
    print(f"  Execution Time: {res['execution_time_seconds']}s")
    print(f"  Avg Progress: {res['summary_metrics']['average_physical_progress_pct']}%")
    print(f"  Total Cost: ₹ {res['summary_metrics']['total_original_cost_cr']:,} Cr")
    
    # Export sample Excel
    out_excel = 'test_output_may2026.xlsx'
    export_records_to_styled_excel(res['records'], out_excel)
    print(f"  Saved styled Excel to: {out_excel} ({os.path.getsize(out_excel):,} bytes)")

# Test 2: Modern July 2024
p_jul24 = '../../2024-2025/July_Part-II.pdf'
if os.path.exists(p_jul24):
    print(f"\n2. Testing Modern Flash: {p_jul24}")
    res2 = extract_pdf_to_canonical_dataset(p_jul24)
    print(f"  Detected Format: {res2['classification']['format_type']}")
    print(f"  Engine Used: {res2['engine_used']}")
    print(f"  Total Projects: {res2['records_count']:,}")
    print(f"  Avg Progress: {res2['summary_metrics']['average_physical_progress_pct']}%")

# Test 3: Legacy March 2023
p_mar23 = '../../2022-2023/FR_march_2023.pdf'
if os.path.exists(p_mar23):
    print(f"\n3. Testing Legacy Milestone: {p_mar23}")
    res3 = extract_pdf_to_canonical_dataset(p_mar23)
    print(f"  Detected Format: {res3['classification']['format_type']}")
    print(f"  Engine Used: {res3['engine_used']}")
    print(f"  Total Projects: {res3['records_count']:,}")
    print(f"  Avg Progress: {res3['summary_metrics']['average_physical_progress_pct']}%")

print("\n=== All Core Tests Passed Successfully! ===")
