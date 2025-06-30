#!/usr/bin/env python3
import requests
import json
import jwt
import uuid
from datetime import datetime, timedelta

# Configuration
# Get the backend URL from the frontend .env file
BACKEND_URL = "https://4c2ee1c4-632f-4a92-9825-bba940f8667f.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"
JWT_SECRET = "your-secret-key"  # Same as in server.py

# Test results tracking
test_results = {
    "total": 0,
    "passed": 0,
    "failed": 0,
    "tests": []
}

# Helper functions
def generate_test_jwt(user_id=None):
    """Generate a JWT token for testing"""
    if user_id is None:
        user_id = f"test_user_{uuid.uuid4()}"
    
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256"), user_id

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

def check_membership_level(token, expected_level):
    """Check if user has the expected membership level"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{API_BASE}/membership/status", headers=headers)
    
    if response.status_code != 200:
        return False, f"Failed to get membership status: {response.status_code} - {response.text}"
    
    data = response.json()
    actual_level = data.get("level")
    
    if actual_level == expected_level:
        return True, f"Membership level is {actual_level} as expected"
    else:
        return False, f"Expected membership level {expected_level}, got {actual_level}"

# Test functions
def test_first_investment_creation():
    """Test creating a first investment with $20,000 (Club minimum)"""
    print("\n===== Testing First Investment Creation =====")
    
    # Create a new test user
    token, user_id = generate_test_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Verify initial membership level is "none"
    success, details = check_membership_level(token, "none")
    log_test("Initial Membership Level", success, details)
    
    if not success:
        return
    
    # Try to create an investment with $20,000 (Club minimum)
    investment_data = {
        "user_id": user_id,
        "name": "First Investment",
        "amount": 20000,  # Club minimum
        "rate": 6.0,
        "term": 12  # 12 months (365 days)
    }
    
    response = requests.post(f"{API_BASE}/investments", json=investment_data, headers=headers)
    
    if response.status_code != 200:
        log_test("First Investment Creation", False, f"Failed to create first investment: {response.status_code} - {response.text}")
        return
    
    # Check response format
    data = response.json()
    if "investment" not in data or "message" not in data:
        log_test("First Investment Response Format", False, f"Response missing expected fields: {data}")
    else:
        log_test("First Investment Response Format", True, f"Response contains investment data and message: {data['message']}")
    
    # Verify user became Club member
    success, details = check_membership_level(token, "club")
    log_test("Membership Level After First Investment", success, details)
    
    # Test that subsequent investments work normally
    # First, get the available plans for this user
    plans_response = requests.get(f"{API_BASE}/investment-plans", headers=headers)
    if plans_response.status_code != 200:
        log_test("Get Available Plans", False, f"Failed to get available plans: {plans_response.status_code} - {plans_response.text}")
        return
    
    plans_data = plans_response.json()
    available_plans = plans_data.get("plans", [])
    
    if not available_plans:
        log_test("Available Plans", False, "No available plans found for user")
        return
    
    # Print available plans for debugging
    print(f"Available plans for user: {json.dumps(available_plans, indent=2)}")
    
    # Use the first available plan
    plan = available_plans[0]
    
    second_investment = {
        "user_id": user_id,
        "name": "Second Investment",
        "amount": 25000,
        "rate": plan.get("rate"),
        "term": plan.get("term_days") // 30  # Convert term_days to months
    }
    
    response = requests.post(f"{API_BASE}/investments", json=second_investment, headers=headers)
    
    if response.status_code != 200:
        log_test("Subsequent Investment", False, f"Failed to create subsequent investment: {response.status_code} - {response.text}")
    else:
        log_test("Subsequent Investment", True, "Successfully created subsequent investment")

def test_investment_amount_validation():
    """Test investment amount validation"""
    print("\n===== Testing Investment Amount Validation =====")
    
    # Create a new test user
    token, user_id = generate_test_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test investment below $20,000 (should fail)
    below_min_investment = {
        "user_id": user_id,
        "name": "Below Minimum Investment",
        "amount": 19999,  # Below Club minimum
        "rate": 6.0,
        "term": 12
    }
    
    response = requests.post(f"{API_BASE}/investments", json=below_min_investment, headers=headers)
    
    if response.status_code == 400 and "minimum investment" in response.text.lower():
        log_test("Below Minimum Investment", True, f"Correctly rejected investment below minimum: {response.text}")
    else:
        log_test("Below Minimum Investment", False, f"Expected 400 error for below minimum, got {response.status_code}: {response.text}")
    
    # Test investment exactly at $20,000 (should succeed for first investment)
    exact_min_investment = {
        "user_id": user_id,
        "name": "Exact Minimum Investment",
        "amount": 20000,  # Exactly Club minimum
        "rate": 6.0,
        "term": 12
    }
    
    response = requests.post(f"{API_BASE}/investments", json=exact_min_investment, headers=headers)
    
    if response.status_code != 200:
        log_test("Exact Minimum Investment", False, f"Failed to create investment at exact minimum: {response.status_code} - {response.text}")
    else:
        log_test("Exact Minimum Investment", True, "Successfully created investment at exact minimum")
    
    # Verify user became Club member
    success, details = check_membership_level(token, "club")
    log_test("Membership Level After Exact Minimum", success, details)
    
    # Create another user to test above minimum
    token2, user_id2 = generate_test_jwt()
    headers2 = {"Authorization": f"Bearer {token2}"}
    
    # Test investment above $20,000 (should succeed for first investment)
    above_min_investment = {
        "user_id": user_id2,
        "name": "Above Minimum Investment",
        "amount": 25000,  # Above Club minimum
        "rate": 6.0,
        "term": 12
    }
    
    response = requests.post(f"{API_BASE}/investments", json=above_min_investment, headers=headers2)
    
    if response.status_code != 200:
        log_test("Above Minimum Investment", False, f"Failed to create investment above minimum: {response.status_code} - {response.text}")
    else:
        log_test("Above Minimum Investment", True, "Successfully created investment above minimum")
    
    # Verify user became Club member
    success, details = check_membership_level(token2, "club")
    log_test("Membership Level After Above Minimum", success, details)

def test_api_response_format():
    """Test API response format"""
    print("\n===== Testing API Response Format =====")
    
    # Create a new test user
    token, user_id = generate_test_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create a first investment
    investment_data = {
        "user_id": user_id,
        "name": "Test Investment",
        "amount": 25000,
        "rate": 6.0,
        "term": 12
    }
    
    response = requests.post(f"{API_BASE}/investments", json=investment_data, headers=headers)
    
    if response.status_code != 200:
        log_test("Investment Creation for Response Format", False, f"Failed to create investment: {response.status_code} - {response.text}")
        return
    
    data = response.json()
    
    # Check if response contains investment data
    if "investment" not in data:
        log_test("Response Contains Investment Data", False, "Response missing investment data")
    else:
        investment = data["investment"]
        log_test("Response Contains Investment Data", True, f"Response contains investment data with ID: {investment.get('id')}")
    
    # Check if response contains success message
    if "message" not in data:
        log_test("Response Contains Success Message", False, "Response missing success message")
    else:
        log_test("Response Contains Success Message", True, f"Response contains success message: {data['message']}")
    
    # Check if investment data has correct fields
    required_fields = ["id", "user_id", "name", "amount", "rate", "term", "membership_level", "created_at"]
    missing_fields = [field for field in required_fields if field not in data.get("investment", {})]
    
    if missing_fields:
        log_test("Investment Data Fields", False, f"Investment data missing fields: {', '.join(missing_fields)}")
    else:
        log_test("Investment Data Fields", True, "Investment data contains all required fields")
    
    # Check if membership level is set to "club"
    if data.get("investment", {}).get("membership_level") != "club":
        log_test("Membership Level in Response", False, f"Expected membership_level 'club', got '{data.get('investment', {}).get('membership_level')}'")
    else:
        log_test("Membership Level in Response", True, "Membership level correctly set to 'club' in response")

def test_edge_cases():
    """Test edge cases for investment creation"""
    print("\n===== Testing Edge Cases =====")
    
    # Test multiple "first" investments
    token, user_id = generate_test_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create first investment
    first_investment = {
        "user_id": user_id,
        "name": "First Investment",
        "amount": 20000,
        "rate": 6.0,
        "term": 12
    }
    
    response = requests.post(f"{API_BASE}/investments", json=first_investment, headers=headers)
    
    if response.status_code != 200:
        log_test("First Edge Case Investment", False, f"Failed to create first investment: {response.status_code} - {response.text}")
        return
    
    # Try to create another investment below Club minimum
    below_min_investment = {
        "user_id": user_id,
        "name": "Below Minimum After First",
        "amount": 15000,  # Below Club minimum
        "rate": 6.0,
        "term": 12
    }
    
    response = requests.post(f"{API_BASE}/investments", json=below_min_investment, headers=headers)
    
    # This should now fail with a different error (not about first investment)
    if response.status_code == 400:
        log_test("Below Minimum After First", True, f"Correctly rejected investment below minimum after first: {response.text}")
    else:
        log_test("Below Minimum After First", False, f"Expected 400 error, got {response.status_code}: {response.text}")
    
    # Test investment creation after user already has Club membership
    # First, get the available plans for this user
    plans_response = requests.get(f"{API_BASE}/investment-plans", headers=headers)
    if plans_response.status_code != 200:
        log_test("Get Available Plans for Edge Case", False, f"Failed to get available plans: {plans_response.status_code} - {plans_response.text}")
        return
    
    plans_data = plans_response.json()
    available_plans = plans_data.get("plans", [])
    
    if not available_plans:
        log_test("Available Plans for Edge Case", False, "No available plans found for user")
        return
    
    # Use the first available plan
    plan = available_plans[0]
    
    valid_investment = {
        "user_id": user_id,
        "name": "Valid After First",
        "amount": 25000,
        "rate": plan.get("rate"),
        "term": plan.get("term_days") // 30  # Convert term_days to months
    }
    
    response = requests.post(f"{API_BASE}/investments", json=valid_investment, headers=headers)
    
    if response.status_code != 200:
        log_test("Valid Investment After First", False, f"Failed to create valid investment after first: {response.status_code} - {response.text}")
    else:
        log_test("Valid Investment After First", True, "Successfully created valid investment after first")
    
    # Test higher membership levels
    # Create enough investments to reach Premium level
    # First, get the available plans for this user again (should still be Club level)
    plans_response = requests.get(f"{API_BASE}/investment-plans", headers=headers)
    if plans_response.status_code != 200:
        log_test("Get Available Plans for Premium", False, f"Failed to get available plans: {plans_response.status_code} - {plans_response.text}")
        return
    
    plans_data = plans_response.json()
    available_plans = plans_data.get("plans", [])
    
    if not available_plans:
        log_test("Available Plans for Premium", False, "No available plans found for user")
        return
    
    # Use the first available plan
    plan = available_plans[0]
    
    premium_investment = {
        "user_id": user_id,
        "name": "Premium Level Investment",
        "amount": 30000,  # This should push total to 75000 (Premium level)
        "rate": plan.get("rate"),
        "term": plan.get("term_days") // 30  # Convert term_days to months
    }
    
    response = requests.post(f"{API_BASE}/investments", json=premium_investment, headers=headers)
    
    if response.status_code != 200:
        log_test("Premium Level Investment", False, f"Failed to create Premium level investment: {response.status_code} - {response.text}")
    else:
        log_test("Premium Level Investment", True, "Successfully created Premium level investment")
    
    # Verify user became Premium member
    success, details = check_membership_level(token, "premium")
    log_test("Upgrade to Premium Level", success, details)
    
    # Check if Premium member can access Premium plans
    response = requests.get(f"{API_BASE}/investment-plans", headers=headers)
    
    if response.status_code != 200:
        log_test("Premium Member Plans", False, f"Failed to get Premium member plans: {response.status_code} - {response.text}")
    else:
        data = response.json()
        plans = data.get("plans", [])
        
        if len(plans) == 2:  # Premium should have 2 plans
            rates = sorted([plan.get("rate") for plan in plans])
            if rates == [8.0, 10.0]:
                log_test("Premium Member Plans", True, "Premium member has correct plans (8% and 10% APY)")
            else:
                log_test("Premium Member Plans", False, f"Premium member has incorrect plan rates: {rates}")
        else:
            log_test("Premium Member Plans", False, f"Expected 2 plans for Premium member, got {len(plans)}")

def run_all_tests():
    """Run all test functions"""
    print("===== STARTING INVESTMENT CREATION FIX TESTS =====")
    
    test_first_investment_creation()
    test_investment_amount_validation()
    test_api_response_format()
    test_edge_cases()
    
    print_summary()

if __name__ == "__main__":
    run_all_tests()