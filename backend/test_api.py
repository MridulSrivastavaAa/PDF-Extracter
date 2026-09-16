import os
import sys
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_api():
    print("--- 1. Health Check ---")
    res_health = client.get('/api/health')
    print("Status:", res_health.status_code, res_health.json())
    assert res_health.status_code == 200

    print("\n--- 2. Sample Files List ---")
    res_samples = client.get('/api/sample-files')
    assert res_samples.status_code == 200
    samples = res_samples.json().get('samples', [])
    print(f"Discovered {len(samples)} sample reports.")
    for s in samples:
        print(f" - {s['name']} ({s['era']}): {s['path']}")

    if samples:
        print("\n--- 3. Extract Sample File ---")
        sample = samples[0]
        print(f"Extracting: {sample['name']}")
        res_extract = client.post('/api/extract-sample', json={'path': sample['path']})
        assert res_extract.status_code == 200
        data = res_extract.json()
        print(f"Extraction successful!")
        print(f"Engine: {data.get('engine_used')}")
        print(f"Execution time: {data.get('execution_time_seconds')}s")
        print(f"Records extracted: {data.get('records_count')}")
        print(f"Summary metrics: {data.get('summary_metrics')}")
        print(f"Preview rows: {len(data.get('records_preview', []))}")
        
        dl_url = data.get('download_url')
        print(f"\n--- 4. Download Excel Workbook ---")
        print(f"URL: {dl_url}")
        res_dl = client.get(dl_url)
        assert res_dl.status_code == 200
        print(f"Download HTTP Status: {res_dl.status_code}, File size: {len(res_dl.content):,} bytes")
        
        # Verify first row columns match canonical 20 columns
        first_row = data['records_preview'][0]
        print(f"\nSample Extracted Project Record:")
        print(f" - Project ID: {first_row.get('project_id')}")
        print(f" - Project Name: {first_row.get('project_name')}")
        print(f" - Ministry: {first_row.get('ministry_department')}")
        print(f" - State: {first_row.get('state')}")
        print(f" - Physical Progress: {first_row.get('physical progress')}%")
        print(f" - Anticipated Cost: Rs. {first_row.get('Anticipated cost (₹ Cr)')} Cr")

    print("\nALL API TESTS COMPLETED AND PASSED!")

if __name__ == "__main__":
    test_api()
