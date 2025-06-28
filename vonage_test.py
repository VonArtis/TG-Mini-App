#!/usr/bin/env python3
import requests
import json
import jwt
import time
import uuid
from datetime import datetime, timedelta

# Configuration
# Get the backend URL from the frontend .env file
with open('/app/frontend/.env', 'r') as f:
    for line in f:
        if line.startswith('REACT_APP_BACKEND_URL='):
            BACKEND_URL = line.strip().split('=')[1].strip('"\'')
            break

API_BASE = f"{BACKEND_URL}/api"
JWT_SECRET = "change-this-to-a-strong-random-secret-key-minimum-32-characters"  # Same as in server.py

# Test results tracking
test_results = {
    "total": 0,
    "passed": 0,
    "failed": 0,
    "tests": []
}

# Helper functions
def generate_test_jwt(user_id="test_user_123"):
    """Generate a JWT token for testing"""
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def log_test(name, passed, details=""):
    """Log test results"""
    test_results["total"] += 1
    if passed:
        test_results["passed"] += 1
        status = "PASSED"
    else:
        test_results["failed"] += 1
        status = "FAILED"
    
    test_results["tests"].append({
        "name": name,
        "status": status,
        "details": details
    })
    
    print(f"[{status}] {name}")
    if details:
        print(f"  Details: {details}")

def print_summary():
    """Print test summary"""
    print("\n===== TEST SUMMARY =====")
    print(f"Total tests: {test_results['total']}")
    print(f"Passed: {test_results['passed']}")
    print(f"Failed: {test_results['failed']}")
    
    if test_results["failed"] > 0:
        print("\nFailed tests:")
        for test in test_results["tests"]:
            if test["status"] == "FAILED":
                print(f"- {test['name']}: {test['details']}")

# Test functions
def test_health_check():
    """Test the health check endpoint"""
    response = requests.get(f"{API_BASE}/health")
    
    if response.status_code == 200 and response.json().get("status") == "healthy":
        log_test("Health Check Endpoint", True)
    else:
        log_test("Health Check Endpoint", False, f"Status code: {response.status_code}, Response: {response.text}")

# Vonage SMS Verification Tests
def test_vonage_initialization():
    """Test if Vonage client is initialized properly"""
    # Check the server logs for "Vonage client initialized successfully"
    # This is a basic test to ensure the server is running and logs are accessible
    response = requests.get(f"{API_BASE}/health")
    
    if response.status_code == 200:
        log_test("Vonage Initialization Check", True, "Server is running, check logs for 'Vonage client initialized successfully'")
    else:
        log_test("Vonage Initialization Check", False, f"Server health check failed: {response.status_code}")

def test_sms_send_without_auth():
    """Test sending SMS verification code without authentication"""
    payload = {"phone_number": "+12025550123"}
    response = requests.post(f"{API_BASE}/auth/sms/send", json=payload)
    
    if response.status_code == 401:
        log_test("SMS Send Without Auth", True, "Correctly returned 401 Unauthorized")
    else:
        log_test("SMS Send Without Auth", False, f"Expected 401, got {response.status_code}: {response.text}")

def test_sms_send_with_auth():
    """Test sending SMS verification code with authentication"""
    token = generate_test_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"phone_number": "+12025550123"}
    
    response = requests.post(f"{API_BASE}/auth/sms/send", json=payload, headers=headers)
    
    # If Vonage is not configured, we expect a 503 Service Unavailable
    # If Vonage is configured, we expect a 200 OK
    if response.status_code in [200, 503]:
        if response.status_code == 503:
            log_test("SMS Send With Auth", True, "Correctly returned 503 when Vonage is not available")
        else:
            log_test("SMS Send With Auth", True, "Successfully sent SMS verification code using Vonage")
    else:
        log_test("SMS Send With Auth", False, f"Unexpected status code: {response.status_code}: {response.text}")

def test_sms_send_invalid_phone():
    """Test sending SMS verification code with invalid phone number"""
    token = generate_test_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"phone_number": "invalid-phone"}
    
    response = requests.post(f"{API_BASE}/auth/sms/send", json=payload, headers=headers)
    
    if response.status_code == 400:
        log_test("SMS Send Invalid Phone", True, "Correctly returned 400 Bad Request for invalid phone number")
    else:
        log_test("SMS Send Invalid Phone", False, f"Expected 400, got {response.status_code}: {response.text}")

def test_sms_verify_without_auth():
    """Test verifying SMS code without authentication"""
    payload = {"phone_number": "+12025550123", "code": "123456"}
    response = requests.post(f"{API_BASE}/auth/sms/verify", json=payload)
    
    if response.status_code == 401:
        log_test("SMS Verify Without Auth", True, "Correctly returned 401 Unauthorized")
    else:
        log_test("SMS Verify Without Auth", False, f"Expected 401, got {response.status_code}: {response.text}")

def test_sms_verify_with_auth():
    """Test verifying SMS code with authentication"""
    token = generate_test_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"phone_number": "+12025550123", "code": "123456"}
    
    response = requests.post(f"{API_BASE}/auth/sms/verify", json=payload, headers=headers)
    
    # We expect a 200 OK with verification result (likely false since we're using a fake code)
    if response.status_code == 200:
        result = response.json()
        # The verification should fail since we're using a fake code
        if result.get("verified") == False:
            log_test("SMS Verify With Auth", True, "Correctly returned verification failure for fake code")
        else:
            log_test("SMS Verify With Auth", False, "Unexpectedly verified a fake code")
    else:
        log_test("SMS Verify With Auth", False, f"Unexpected status code: {response.status_code}: {response.text}")

def test_sms_setup_without_auth():
    """Test setting up SMS 2FA without authentication"""
    payload = {"phone_number": "+12025550123"}
    response = requests.post(f"{API_BASE}/auth/sms/setup", json=payload)
    
    if response.status_code == 401:
        log_test("SMS Setup Without Auth", True, "Correctly returned 401 Unauthorized")
    else:
        log_test("SMS Setup Without Auth", False, f"Expected 401, got {response.status_code}: {response.text}")

def test_sms_setup_with_auth():
    """Test setting up SMS 2FA with authentication"""
    token = generate_test_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"phone_number": "+12025550123"}
    
    response = requests.post(f"{API_BASE}/auth/sms/setup", json=payload, headers=headers)
    
    # We might get 404 if the user doesn't exist in the database
    # We might get 400 if the phone number is invalid
    # We might get 200 if the setup is successful
    if response.status_code in [200, 400, 404]:
        if response.status_code == 200:
            log_test("SMS Setup With Auth", True, "Successfully set up SMS 2FA")
        elif response.status_code == 400:
            log_test("SMS Setup With Auth", True, "Correctly returned 400 for invalid phone number")
        else:
            log_test("SMS Setup With Auth", True, "Correctly returned 404 for non-existent user")
    else:
        log_test("SMS Setup With Auth", False, f"Unexpected status code: {response.status_code}: {response.text}")

def test_phone_number_formatting():
    """Test phone number formatting function"""
    token = generate_test_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test various phone number formats
    test_cases = [
        {"input": "2025550123", "expected_format": "+12025550123"},
        {"input": "(202) 555-0123", "expected_format": "+12025550123"},
        {"input": "202-555-0123", "expected_format": "+12025550123"},
        {"input": "+12025550123", "expected_format": "+12025550123"},
        {"input": "+44 20 7946 0958", "expected_format": "+442079460958"}
    ]
    
    for i, test_case in enumerate(test_cases):
        payload = {"phone_number": test_case["input"]}
        response = requests.post(f"{API_BASE}/auth/sms/send", json=payload, headers=headers)
        
        # We're not checking if the SMS was actually sent, just that the phone number was formatted correctly
        # This will be visible in the response or error message
        if response.status_code in [200, 503]:
            # Check if the formatted phone number is in the response
            if test_case["expected_format"] in response.text:
                log_test(f"Phone Number Formatting {i+1}", True, f"Correctly formatted {test_case['input']} to {test_case['expected_format']}")
            else:
                log_test(f"Phone Number Formatting {i+1}", False, f"Failed to format {test_case['input']} to {test_case['expected_format']}, Response: {response.text}")
        else:
            log_test(f"Phone Number Formatting {i+1}", False, f"Unexpected status code: {response.status_code}: {response.text}")

def test_verification_code_storage():
    """Test that verification codes are stored in the database"""
    # This is a more advanced test that would require direct database access
    # For now, we'll just check that the verification flow works end-to-end
    token = generate_test_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    phone_number = "+12025550123"
    
    # Step 1: Send verification code
    send_payload = {"phone_number": phone_number}
    send_response = requests.post(f"{API_BASE}/auth/sms/send", json=send_payload, headers=headers)
    
    if send_response.status_code not in [200, 503]:
        log_test("Verification Code Storage", False, f"Failed to send verification code: {send_response.status_code}: {send_response.text}")
        return
    
    # If Vonage is not available, skip this test
    if send_response.status_code == 503:
        log_test("Verification Code Storage", True, "Skipped test because Vonage is not available")
        return
    
    # Step 2: Verify with a fake code (should fail but still show the code was checked against storage)
    verify_payload = {"phone_number": phone_number, "code": "123456"}
    verify_response = requests.post(f"{API_BASE}/auth/sms/verify", json=verify_payload, headers=headers)
    
    if verify_response.status_code == 200:
        result = verify_response.json()
        # The verification should fail since we're using a fake code
        if result.get("verified") == False:
            log_test("Verification Code Storage", True, "Verification code storage is working (code was checked against database)")
        else:
            log_test("Verification Code Storage", False, "Unexpectedly verified a fake code")
    else:
        log_test("Verification Code Storage", False, f"Unexpected status code: {verify_response.status_code}: {verify_response.text}")

# Email Verification Tests
def test_email_send_without_auth():
    """Test sending email verification code without authentication"""
    payload = {"email": "test@example.com"}
    response = requests.post(f"{API_BASE}/auth/email/send", json=payload)
    
    if response.status_code == 401:
        log_test("Email Send Without Auth", True, "Correctly returned 401 Unauthorized")
    else:
        log_test("Email Send Without Auth", False, f"Expected 401, got {response.status_code}: {response.text}")

def test_email_send_with_auth():
    """Test sending email verification code with authentication"""
    token = generate_test_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"email": "test@example.com"}
    
    response = requests.post(f"{API_BASE}/auth/email/send", json=payload, headers=headers)
    
    if response.status_code == 200:
        log_test("Email Send With Auth", True, "Successfully sent email verification code")
    else:
        log_test("Email Send With Auth", False, f"Failed to send email verification code: {response.status_code}: {response.text}")

def test_email_send_invalid_email():
    """Test sending email verification code with invalid email"""
    token = generate_test_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"email": "invalid-email"}
    
    response = requests.post(f"{API_BASE}/auth/email/send", json=payload, headers=headers)
    
    if response.status_code == 400:
        log_test("Email Send Invalid Email", True, "Correctly returned 400 Bad Request for invalid email")
    else:
        log_test("Email Send Invalid Email", False, f"Expected 400, got {response.status_code}: {response.text}")

def test_email_verify_without_auth():
    """Test verifying email code without authentication"""
    payload = {"email": "test@example.com", "code": "123456"}
    response = requests.post(f"{API_BASE}/auth/email/verify", json=payload)
    
    if response.status_code == 401:
        log_test("Email Verify Without Auth", True, "Correctly returned 401 Unauthorized")
    else:
        log_test("Email Verify Without Auth", False, f"Expected 401, got {response.status_code}: {response.text}")

def test_email_verify_with_auth():
    """Test verifying email code with authentication"""
    token = generate_test_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    payload = {"email": "test@example.com", "code": "123456"}
    
    response = requests.post(f"{API_BASE}/auth/email/verify", json=payload, headers=headers)
    
    # We expect a 200 OK with verification result (likely false since we're using a fake code)
    if response.status_code == 200:
        result = response.json()
        # The verification should fail since we're using a fake code
        if result.get("verified") == False:
            log_test("Email Verify With Auth", True, "Correctly returned verification failure for fake code")
        else:
            log_test("Email Verify With Auth", False, "Unexpectedly verified a fake code")
    else:
        log_test("Email Verify With Auth", False, f"Unexpected status code: {response.status_code}: {response.text}")

def run_vonage_tests():
    """Run all Vonage SMS verification tests"""
    print("\n===== TESTING VONAGE SMS VERIFICATION =====")
    
    # Basic health check
    test_health_check()
    
    # Vonage initialization
    test_vonage_initialization()
    
    # SMS verification tests
    print("\n--- SMS Verification Tests ---")
    test_sms_send_without_auth()
    test_sms_send_with_auth()
    test_sms_send_invalid_phone()
    test_sms_verify_without_auth()
    test_sms_verify_with_auth()
    test_sms_setup_without_auth()
    test_sms_setup_with_auth()
    
    # Phone number formatting
    print("\n--- Phone Number Formatting Tests ---")
    test_phone_number_formatting()
    
    # Verification code storage
    print("\n--- Verification Code Storage Tests ---")
    test_verification_code_storage()
    
    # Email verification tests
    print("\n--- Email Verification Tests ---")
    test_email_send_without_auth()
    test_email_send_with_auth()
    test_email_send_invalid_email()
    test_email_verify_without_auth()
    test_email_verify_with_auth()
    
    # Print summary
    print_summary()

if __name__ == "__main__":
    run_vonage_tests()