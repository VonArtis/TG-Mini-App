#!/usr/bin/env python3
import requests
import json
import jwt
import uuid
from datetime import datetime, timedelta

# Configuration
BACKEND_URL = "https://4c2ee1c4-632f-4a92-9825-bba940f8667f.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"
JWT_SECRET = "your-secret-key"  # Same as in server.py

def generate_test_jwt(user_id=None):
    """Generate a JWT token for testing"""
    if user_id is None:
        user_id = f"test_user_{uuid.uuid4()}"
    
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(hours=1)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256"), user_id

def check_membership_level(token):
    """Check user's membership level"""
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{API_BASE}/membership/status", headers=headers)
    
    if response.status_code != 200:
        return f"Failed to get membership status: {response.status_code} - {response.text}"
    
    data = response.json()
    return f"Membership level: {data.get('level')}, Level name: {data.get('level_name')}"

def test_first_investment_creation():
    """Test the critical fix for first investment creation"""
    print("\n===== Testing First Investment Creation Fix =====")
    
    # Create a new test user
    token, user_id = generate_test_jwt()
    headers = {"Authorization": f"Bearer {token}"}
    
    # Check initial membership level
    print("Initial membership status:")
    print(check_membership_level(token))
    
    # Try to create an investment with $20,000 (Club minimum)
    investment_data = {
        "user_id": user_id,
        "name": "First Investment",
        "amount": 20000,  # Club minimum
        "rate": 6.0,
        "term": 12  # 12 months (365 days)
    }
    
    print("\nCreating first investment with $20,000...")
    response = requests.post(f"{API_BASE}/investments", json=investment_data, headers=headers)
    
    print(f"Status code: {response.status_code}")
    print(f"Response: {response.text}")
    
    # Check membership level after investment
    print("\nMembership status after investment:")
    print(check_membership_level(token))
    
    # Try to create an investment below minimum (should fail)
    below_min_investment = {
        "user_id": user_id,
        "name": "Below Minimum Investment",
        "amount": 15000,  # Below Club minimum
        "rate": 6.0,
        "term": 12
    }
    
    print("\nTrying to create investment below minimum ($15,000)...")
    response = requests.post(f"{API_BASE}/investments", json=below_min_investment, headers=headers)
    
    print(f"Status code: {response.status_code}")
    print(f"Response: {response.text}")
    
    # Create a new user and try investment above minimum
    token2, user_id2 = generate_test_jwt()
    headers2 = {"Authorization": f"Bearer {token2}"}
    
    print("\nCreating new user for above-minimum test...")
    print("Initial membership status:")
    print(check_membership_level(token2))
    
    # Try to create an investment with $25,000 (above Club minimum)
    above_min_investment = {
        "user_id": user_id2,
        "name": "Above Minimum Investment",
        "amount": 25000,  # Above Club minimum
        "rate": 6.0,
        "term": 12
    }
    
    print("\nCreating first investment with $25,000...")
    response = requests.post(f"{API_BASE}/investments", json=above_min_investment, headers=headers2)
    
    print(f"Status code: {response.status_code}")
    print(f"Response: {response.text}")
    
    # Check membership level after investment
    print("\nMembership status after investment:")
    print(check_membership_level(token2))

if __name__ == "__main__":
    test_first_investment_creation()