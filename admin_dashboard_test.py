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
def generate_test_jwt(user_id="test_user_123", email="test@example.com", is_admin=False):
    """Generate a JWT token for testing"""
    payload = {
        "user_id": user_id,
        "email": email,
        "is_admin": is_admin,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def generate_admin_jwt(user_id="admin_user", email="admin@vonvault.com"):
    """Generate an admin JWT token for testing"""
    return generate_test_jwt(user_id, email, True)

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

# Admin Authentication Tests
def test_admin_auth_with_admin_email():
    """Test admin authentication with admin email"""
    # Generate token with admin email
    token = generate_admin_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Try to access admin overview endpoint
    response = requests.get(f"{API_BASE}/admin/overview", headers=headers)
    
    if response.status_code == 200:
        log_test("Admin Auth with Admin Email", True, "Successfully accessed admin endpoint with admin email")
    else:
        log_test("Admin Auth with Admin Email", False, f"Status code: {response.status_code}, Response: {response.text}")

def test_admin_auth_with_harry_email():
    """Test admin authentication with harry@vonvault.com email"""
    # Generate token with harry@vonvault.com email
    token = generate_test_jwt(email="harry@vonvault.com")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Try to access admin overview endpoint
    response = requests.get(f"{API_BASE}/admin/overview", headers=headers)
    
    if response.status_code == 200:
        log_test("Admin Auth with Harry Email", True, "Successfully accessed admin endpoint with harry@vonvault.com email")
    else:
        log_test("Admin Auth with Harry Email", False, f"Status code: {response.status_code}, Response: {response.text}")

def test_admin_auth_with_non_admin_email():
    """Test admin authentication with non-admin email"""
    # Generate token with non-admin email
    token = generate_test_jwt(email="regular@example.com")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Try to access admin overview endpoint
    response = requests.get(f"{API_BASE}/admin/overview", headers=headers)
    
    if response.status_code == 403:
        log_test("Admin Auth with Non-Admin Email", True, "Correctly rejected non-admin user")
    else:
        log_test("Admin Auth with Non-Admin Email", False, f"Expected 403, got {response.status_code}: {response.text}")

def test_admin_auth_without_token():
    """Test admin authentication without token"""
    # Try to access admin overview endpoint without token
    response = requests.get(f"{API_BASE}/admin/overview")
    
    if response.status_code in [401, 403]:
        log_test("Admin Auth without Token", True, f"Correctly rejected request without token with {response.status_code}")
    else:
        log_test("Admin Auth without Token", False, f"Expected 401 or 403, got {response.status_code}: {response.text}")

def test_admin_auth_with_invalid_token():
    """Test admin authentication with invalid token"""
    # Try to access admin overview endpoint with invalid token
    headers = {"Authorization": "Bearer invalid_token"}
    response = requests.get(f"{API_BASE}/admin/overview", headers=headers)
    
    if response.status_code == 401:
        log_test("Admin Auth with Invalid Token", True, "Correctly rejected invalid token")
    else:
        log_test("Admin Auth with Invalid Token", False, f"Expected 401, got {response.status_code}: {response.text}")

# Admin Dashboard Endpoint Tests
def test_admin_overview_endpoint():
    """Test the admin overview endpoint"""
    token = generate_admin_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{API_BASE}/admin/overview", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        
        # Check if all required sections are present
        required_sections = ["users", "investments", "membership_distribution", "verification_rate"]
        missing_sections = [section for section in required_sections if section not in data]
        
        if not missing_sections:
            # Check if user metrics are present
            user_metrics = ["total", "verified", "with_investments", "recent_signups"]
            missing_user_metrics = [metric for metric in user_metrics if metric not in data["users"]]
            
            if not missing_user_metrics:
                # Check if investment metrics are present
                investment_metrics = ["total_amount", "total_count", "recent_count"]
                missing_investment_metrics = [metric for metric in investment_metrics if metric not in data["investments"]]
                
                if not missing_investment_metrics:
                    log_test("Admin Overview Endpoint", True, "Successfully retrieved admin overview with all required data")
                else:
                    log_test("Admin Overview Endpoint", False, f"Missing investment metrics: {missing_investment_metrics}")
            else:
                log_test("Admin Overview Endpoint", False, f"Missing user metrics: {missing_user_metrics}")
        else:
            log_test("Admin Overview Endpoint", False, f"Missing sections: {missing_sections}")
    else:
        log_test("Admin Overview Endpoint", False, f"Status code: {response.status_code}, Response: {response.text}")

def test_admin_users_endpoint():
    """Test the admin users endpoint"""
    token = generate_admin_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test with default parameters
    response = requests.get(f"{API_BASE}/admin/users", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        
        # Check if users and pagination are present
        if "users" in data and "pagination" in data:
            # Check pagination structure
            pagination = data["pagination"]
            pagination_fields = ["current_page", "total_pages", "total_count", "per_page"]
            missing_pagination = [field for field in pagination_fields if field not in pagination]
            
            if not missing_pagination:
                log_test("Admin Users Endpoint - Default", True, f"Successfully retrieved {len(data['users'])} users with pagination")
                
                # Test with pagination parameters
                page2_response = requests.get(f"{API_BASE}/admin/users?page=2&limit=10", headers=headers)
                
                if page2_response.status_code == 200:
                    page2_data = page2_response.json()
                    
                    if page2_data["pagination"]["current_page"] == 2 and page2_data["pagination"]["per_page"] == 10:
                        log_test("Admin Users Endpoint - Pagination", True, "Pagination parameters working correctly")
                    else:
                        log_test("Admin Users Endpoint - Pagination", False, f"Pagination parameters not working correctly: {page2_data['pagination']}")
                else:
                    log_test("Admin Users Endpoint - Pagination", False, f"Status code: {page2_response.status_code}, Response: {page2_response.text}")
                
                # Test with search parameter
                search_response = requests.get(f"{API_BASE}/admin/users?search=test", headers=headers)
                
                if search_response.status_code == 200:
                    log_test("Admin Users Endpoint - Search", True, "Search parameter working correctly")
                else:
                    log_test("Admin Users Endpoint - Search", False, f"Status code: {search_response.status_code}, Response: {search_response.text}")
                
                # Test with filter_verified parameter
                verified_response = requests.get(f"{API_BASE}/admin/users?filter_verified=true", headers=headers)
                
                if verified_response.status_code == 200:
                    log_test("Admin Users Endpoint - Filter Verified", True, "Filter verified parameter working correctly")
                else:
                    log_test("Admin Users Endpoint - Filter Verified", False, f"Status code: {verified_response.status_code}, Response: {verified_response.text}")
            else:
                log_test("Admin Users Endpoint - Default", False, f"Missing pagination fields: {missing_pagination}")
        else:
            log_test("Admin Users Endpoint - Default", False, f"Missing 'users' or 'pagination' in response: {data.keys()}")
    else:
        log_test("Admin Users Endpoint - Default", False, f"Status code: {response.status_code}, Response: {response.text}")

def test_admin_user_details_endpoint():
    """Test the admin user details endpoint"""
    token = generate_admin_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    
    # First, get a list of users to find a valid user_id
    users_response = requests.get(f"{API_BASE}/admin/users", headers=headers)
    
    if users_response.status_code == 200:
        users = users_response.json().get("users", [])
        
        if users:
            # Use the first user's ID
            user_id = users[0].get("user_id")
            
            if user_id:
                # Test user details endpoint
                response = requests.get(f"{API_BASE}/admin/users/{user_id}", headers=headers)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # Check if all required sections are present
                    required_sections = ["user", "investments", "crypto_transactions", "membership"]
                    missing_sections = [section for section in required_sections if section not in data]
                    
                    if not missing_sections:
                        # Check user data structure
                        user_fields = ["user_id", "email", "email_verified", "phone_verified", "connected_wallets"]
                        missing_user_fields = [field for field in user_fields if field not in data["user"]]
                        
                        if not missing_user_fields:
                            log_test("Admin User Details Endpoint", True, "Successfully retrieved user details with all required data")
                        else:
                            log_test("Admin User Details Endpoint", False, f"Missing user fields: {missing_user_fields}")
                    else:
                        log_test("Admin User Details Endpoint", False, f"Missing sections: {missing_sections}")
                else:
                    log_test("Admin User Details Endpoint", False, f"Status code: {response.status_code}, Response: {response.text}")
            else:
                log_test("Admin User Details Endpoint", False, "No user_id found in users list")
        else:
            log_test("Admin User Details Endpoint", False, "No users found to test with")
    else:
        log_test("Admin User Details Endpoint", False, f"Failed to get users list: {users_response.status_code}, {users_response.text}")

def test_admin_investments_endpoint():
    """Test the admin investments endpoint"""
    token = generate_admin_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{API_BASE}/admin/investments", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        
        # Check if all required sections are present
        required_sections = ["investments_by_level", "daily_investments", "top_investors"]
        missing_sections = [section for section in required_sections if section not in data]
        
        if not missing_sections:
            log_test("Admin Investments Endpoint", True, "Successfully retrieved investment analytics with all required data")
        else:
            log_test("Admin Investments Endpoint", False, f"Missing sections: {missing_sections}")
    else:
        log_test("Admin Investments Endpoint", False, f"Status code: {response.status_code}, Response: {response.text}")

def test_admin_crypto_endpoint():
    """Test the admin crypto endpoint"""
    token = generate_admin_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{API_BASE}/admin/crypto", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        
        # Check if all required sections are present
        required_sections = ["users_with_crypto", "wallet_distribution", "business_balances", "recent_transactions"]
        missing_sections = [section for section in required_sections if section not in data]
        
        if not missing_sections:
            log_test("Admin Crypto Endpoint", True, "Successfully retrieved crypto analytics with all required data")
        else:
            log_test("Admin Crypto Endpoint", False, f"Missing sections: {missing_sections}")
    else:
        log_test("Admin Crypto Endpoint", False, f"Status code: {response.status_code}, Response: {response.text}")

def test_admin_system_endpoint():
    """Test the admin system endpoint"""
    token = generate_admin_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{API_BASE}/admin/system", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        
        # Check if all required sections are present
        required_sections = ["database", "uptime", "recent_errors", "last_updated"]
        missing_sections = [section for section in required_sections if section not in data]
        
        if not missing_sections:
            # Check database structure
            if "size_mb" in data["database"] and "collections" in data["database"]:
                # Check collections
                required_collections = ["users", "investments", "crypto_transactions"]
                missing_collections = [collection for collection in required_collections if collection not in data["database"]["collections"]]
                
                if not missing_collections:
                    log_test("Admin System Endpoint", True, "Successfully retrieved system health with all required data")
                else:
                    log_test("Admin System Endpoint", False, f"Missing collections: {missing_collections}")
            else:
                log_test("Admin System Endpoint", False, "Missing 'size_mb' or 'collections' in database section")
        else:
            log_test("Admin System Endpoint", False, f"Missing sections: {missing_sections}")
    else:
        log_test("Admin System Endpoint", False, f"Status code: {response.status_code}, Response: {response.text}")

def run_admin_dashboard_tests():
    """Run all admin dashboard tests"""
    print("\n===== TESTING ADMIN DASHBOARD ENDPOINTS =====")
    
    # Basic health check
    test_health_check()
    
    # Admin Authentication Tests
    test_admin_auth_with_admin_email()
    test_admin_auth_with_harry_email()
    test_admin_auth_with_non_admin_email()
    test_admin_auth_without_token()
    test_admin_auth_with_invalid_token()
    
    # Admin Dashboard Endpoint Tests
    test_admin_overview_endpoint()
    test_admin_users_endpoint()
    test_admin_user_details_endpoint()
    test_admin_investments_endpoint()
    test_admin_crypto_endpoint()
    test_admin_system_endpoint()
    
    # Print summary
    print_summary()

if __name__ == "__main__":
    run_admin_dashboard_tests()