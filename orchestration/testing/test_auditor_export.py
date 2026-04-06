"""
Module 5.5 - Auditor Data Export
Pytest API Tests

Tests:
5.5.1.1 - Secure Data Export returns a .zip file
5.5.3.1 - Exported file is valid and cryptographically signed

Run:
    cd testing && source venv/bin/activate
    pytest test_auditor_export.py -v -s
"""

import pytest
import requests
import zipfile
import io

BASE_URL = "http://localhost:5001"

def test_5_5_1_export_ledger_returns_zip():
    """5.5.1.1 - GET /api/observer/export-ledger returns a zip file."""
    res = requests.get(f"{BASE_URL}/api/observer/export-ledger")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    
    # Check headers
    assert "application/zip" in res.headers.get("Content-Type", "")
    assert "secure_voting_ledger_export.zip" in res.headers.get("Content-Disposition", "")
    
    # Check it's a valid zip file
    try:
        z = zipfile.ZipFile(io.BytesIO(res.content))
        file_list = z.namelist()
        assert "ledger.json" in file_list
        assert "signature.sha256" in file_list
        assert "README.txt" in file_list
        print("\n[5.5.1] Exported valid .zip containing ledger and signature.")
    except zipfile.BadZipFile:
        pytest.fail("Endpoint did not return a valid zip file")

def test_5_5_3_export_is_verifiable():
    """5.5.3.1 - The ledger.json inside the bundle generates the signature.sha256 using HMAC."""
    import hmac
    import hashlib
    import os
    
    res = requests.get(f"{BASE_URL}/api/observer/export-ledger")
    assert res.status_code == 200
    
    z = zipfile.ZipFile(io.BytesIO(res.content))
    
    # Read files from inside the zip
    ledger_content = z.read("ledger.json")
    signature_content = z.read("signature.sha256").decode('utf-8')
    
    # Re-calculate the HMAC signature using the same mock key
    # In the app, process.env.JWT_SECRET or 'eci_secure_export_key_2026' is used.
    # We simulate this to prove cryptographic verification is possible.
    secret_key = os.environ.get('JWT_SECRET', 'eci_secure_export_key_2026').encode('utf-8')
    
    expected_hmac = hmac.new(secret_key, ledger_content, hashlib.sha256).hexdigest()
    
    assert expected_hmac == signature_content, "Signature mismatch! The ledger is tampered with."
    print("\n[5.5.3] Cryptographic signature verified successfully!")
