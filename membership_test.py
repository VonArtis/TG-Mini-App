#!/usr/bin/env python3
import requests
import json
import jwt
from datetime import datetime, timedelta

# Configuration
BACKEND_URL = "https://eeb590eb-7848-4b96-8568-b422072548bb.preview.emergentagent.com"
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
def generate_test_jwt(user_id="test_admin"):
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

def test_membership_tiers_api():
    """Test the membership tiers API endpoint"""
    response = requests.get(f"{API_BASE}/membership/tiers")
    
    if response.status_code != 200:
        log_test("Membership Tiers API", False, f"Status code: {response.status_code}, Response: {response.text}")
        return
    
    data = response.json()
    tiers = data.get("tiers", {})
    
    # Check if all expected tiers are present
    expected_tiers = ["club", "premium", "vip", "elite"]
    if all(tier in tiers for tier in expected_tiers):
        log_test("Membership Tiers API - Tier Names", True, f"All expected tiers found: {', '.join(expected_tiers)}")
    else:
        log_test("Membership Tiers API - Tier Names", False, f"Not all expected tiers found. Expected: {expected_tiers}, Got: {list(tiers.keys())}")
        return
    
    # Verify tier ranges
    tier_ranges_correct = (
        tiers["club"]["min_amount"] == 20000 and tiers["club"]["max_amount"] == 49999 and
        tiers["premium"]["min_amount"] == 50000 and tiers["premium"]["max_amount"] == 99999 and
        tiers["vip"]["min_amount"] == 100000 and tiers["vip"]["max_amount"] == 249999 and
        tiers["elite"]["min_amount"] == 250000 and tiers["elite"]["max_amount"] is None
    )
    
    if tier_ranges_correct:
        log_test("Membership Tiers API - Tier Ranges", True, "All tier ranges are correct")
    else:
        log_test("Membership Tiers API - Tier Ranges", False, "Tier ranges do not match expected values")
    
    # Verify investment limits
    investment_limits_correct = (
        tiers["club"]["max_per_investment"] == 50000 and
        tiers["premium"]["max_per_investment"] == 100000 and
        tiers["vip"]["max_per_investment"] == 250000 and
        tiers["elite"]["max_per_investment"] == 250000
    )
    
    if investment_limits_correct:
        log_test("Membership Tiers API - Investment Limits", True, "All investment limits are correct")
    else:
        log_test("Membership Tiers API - Investment Limits", False, "Investment limits do not match expected values")

def test_investment_plans_api():
    """Test the investment plans API endpoint"""
    response = requests.get(f"{API_BASE}/investment-plans/all")
    
    if response.status_code != 200:
        log_test("Investment Plans API", False, f"Status code: {response.status_code}, Response: {response.text}")
        return
    
    data = response.json()
    plans = data.get("plans", [])
    
    if not plans:
        log_test("Investment Plans API - Plans Exist", False, "No investment plans found")
        return
    
    log_test("Investment Plans API - Plans Exist", True, f"Found {len(plans)} investment plans")
    
    # Check if plans for all membership levels exist
    membership_levels = set(plan.get("membership_level") for plan in plans)
    expected_levels = {"club", "premium", "vip", "elite"}
    
    if expected_levels.issubset(membership_levels):
        log_test("Investment Plans API - All Levels", True, f"Plans exist for all membership levels: {', '.join(expected_levels)}")
    else:
        log_test("Investment Plans API - All Levels", False, f"Missing plans for some membership levels. Expected: {expected_levels}, Got: {membership_levels}")
    
    # Verify APY rates for each membership level
    expected_rates = {
        "club": {"365": 6.0},
        "premium": {"180": 8.0, "365": 10.0},
        "vip": {"180": 12.0, "365": 14.0},
        "elite": {"180": 16.0, "365": 20.0}
    }
    
    for level, term_rates in expected_rates.items():
        level_plans = [p for p in plans if p.get("membership_level") == level]
        
        for term_days, expected_rate in term_rates.items():
            term_plans = [p for p in level_plans if str(p.get("term_days")) == term_days]
            
            if term_plans:
                actual_rate = term_plans[0].get("rate")
                if actual_rate == expected_rate:
                    log_test(f"Investment Plans API - {level.capitalize()} {term_days} Days APY", True, f"Correct APY rate of {expected_rate}%")
                else:
                    log_test(f"Investment Plans API - {level.capitalize()} {term_days} Days APY", False, f"Expected APY rate of {expected_rate}%, got {actual_rate}%")
            else:
                log_test(f"Investment Plans API - {level.capitalize()} {term_days} Days APY", False, f"No {level} plan found for {term_days} days")
    
    # Verify term days conversion
    for plan in plans:
        if "term_days" in plan and "term" in plan:
            expected_term = plan["term_days"] // 30
            if plan["term"] == expected_term:
                log_test(f"Investment Plans API - Term Conversion for {plan.get('name')}", True, f"Correct term conversion: {plan['term_days']} days -> {plan['term']} months")
            else:
                log_test(f"Investment Plans API - Term Conversion for {plan.get('name')}", False, f"Incorrect term conversion: {plan['term_days']} days -> {plan['term']} months (expected {expected_term})")

def run_tests():
    """Run all tests"""
    print("===== STARTING MEMBERSHIP SYSTEM TESTS =====")
    
    # Test membership tiers API
    test_membership_tiers_api()
    
    # Test investment plans API
    test_investment_plans_api()
    
    # Print summary
    print_summary()

if __name__ == "__main__":
    run_tests()