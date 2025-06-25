#!/usr/bin/env python3
import requests
import json
import jwt
import time
import uuid
from datetime import datetime, timedelta

# Configuration
# Get the backend URL from the frontend .env file
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

# Test functions
def test_health_check():
    """Test the health check endpoint"""
    response = requests.get(f"{API_BASE}/health")
    
    if response.status_code == 200 and response.json().get("status") == "healthy":
        log_test("Health Check Endpoint", True)
    else:
        log_test("Health Check Endpoint", False, f"Status code: {response.status_code}, Response: {response.text}")

# Multi-Network Crypto Tests
def test_get_supported_networks():
    """Test the GET /api/crypto/networks endpoint"""
    response = requests.get(f"{API_BASE}/crypto/networks")
    
    if response.status_code != 200:
        log_test("GET Supported Networks", False, f"Status code: {response.status_code}, Response: {response.text}")
        return
    
    data = response.json()
    
    # Check if we have the expected networks
    if "networks" in data:
        networks = data["networks"]
        expected_networks = ["ethereum", "polygon", "bsc"]
        
        if all(network in networks for network in expected_networks):
            log_test("GET Supported Networks", True, f"Found all expected networks: {', '.join(expected_networks)}")
        else:
            log_test("GET Supported Networks", False, f"Missing expected networks. Expected: {expected_networks}, Got: {list(networks.keys())}")
            return
        
        # Check network details
        ethereum_details = networks.get("ethereum", {})
        polygon_details = networks.get("polygon", {})
        bsc_details = networks.get("bsc", {})
        
        # Verify Ethereum details
        if (ethereum_details.get("chain_id") == 1 and 
            ethereum_details.get("currency") == "ETH" and
            ethereum_details.get("avg_fee_usd") == 25):
            log_test("GET Supported Networks - Ethereum Details", True, "Ethereum network details are correct")
        else:
            log_test("GET Supported Networks - Ethereum Details", False, f"Ethereum network details are incorrect: {ethereum_details}")
        
        # Verify Polygon details
        if (polygon_details.get("chain_id") == 137 and 
            polygon_details.get("currency") == "MATIC" and
            polygon_details.get("avg_fee_usd") == 0.01):
            log_test("GET Supported Networks - Polygon Details", True, "Polygon network details are correct")
        else:
            log_test("GET Supported Networks - Polygon Details", False, f"Polygon network details are incorrect: {polygon_details}")
        
        # Verify BSC details
        if (bsc_details.get("chain_id") == 56 and 
            bsc_details.get("currency") == "BNB" and
            bsc_details.get("avg_fee_usd") == 0.20):
            log_test("GET Supported Networks - BSC Details", True, "BSC network details are correct")
        else:
            log_test("GET Supported Networks - BSC Details", False, f"BSC network details are incorrect: {bsc_details}")
    else:
        log_test("GET Supported Networks", False, f"Missing networks field. Got: {list(data.keys())}")

def test_get_networks_for_token():
    """Test the GET /api/crypto/networks/{token} endpoint"""
    user_id = f"crypto_test_{uuid.uuid4()}"
    token = generate_test_jwt(user_id)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test for USDC
    response = requests.get(f"{API_BASE}/crypto/networks/USDC", headers=headers)
    
    if response.status_code != 200:
        log_test("GET Networks for USDC", False, f"Status code: {response.status_code}, Response: {response.text}")
    else:
        data = response.json()
        
        if "token" in data and "available_networks" in data and "count" in data:
            if data["token"] == "USDC":
                log_test("GET Networks for USDC - Token Field", True, "Token field is correct")
            else:
                log_test("GET Networks for USDC - Token Field", False, f"Expected token USDC, got {data['token']}")
            
            networks = data["available_networks"]
            expected_networks = ["ethereum", "polygon", "bsc"]
            network_names = [network.get("network") for network in networks]
            
            if all(network in network_names for network in expected_networks):
                log_test("GET Networks for USDC - Available Networks", True, f"Found all expected networks: {', '.join(expected_networks)}")
            else:
                log_test("GET Networks for USDC - Available Networks", False, f"Missing expected networks. Expected: {expected_networks}, Got: {network_names}")
            
            if data["count"] == len(networks):
                log_test("GET Networks for USDC - Count Field", True, f"Count field ({data['count']}) matches number of networks ({len(networks)})")
            else:
                log_test("GET Networks for USDC - Count Field", False, f"Count field ({data['count']}) doesn't match number of networks ({len(networks)})")
        else:
            log_test("GET Networks for USDC - Response Structure", False, f"Missing expected fields. Got: {list(data.keys())}")
    
    # Test for USDT
    response = requests.get(f"{API_BASE}/crypto/networks/USDT", headers=headers)
    
    if response.status_code != 200:
        log_test("GET Networks for USDT", False, f"Status code: {response.status_code}, Response: {response.text}")
    else:
        data = response.json()
        
        if "token" in data and "available_networks" in data and "count" in data:
            if data["token"] == "USDT":
                log_test("GET Networks for USDT - Token Field", True, "Token field is correct")
            else:
                log_test("GET Networks for USDT - Token Field", False, f"Expected token USDT, got {data['token']}")
            
            networks = data["available_networks"]
            expected_networks = ["ethereum", "polygon", "bsc"]
            network_names = [network.get("network") for network in networks]
            
            if all(network in network_names for network in expected_networks):
                log_test("GET Networks for USDT - Available Networks", True, f"Found all expected networks: {', '.join(expected_networks)}")
            else:
                log_test("GET Networks for USDT - Available Networks", False, f"Missing expected networks. Expected: {expected_networks}, Got: {network_names}")
            
            if data["count"] == len(networks):
                log_test("GET Networks for USDT - Count Field", True, f"Count field ({data['count']}) matches number of networks ({len(networks)})")
            else:
                log_test("GET Networks for USDT - Count Field", False, f"Count field ({data['count']}) doesn't match number of networks ({len(networks)})")
        else:
            log_test("GET Networks for USDT - Response Structure", False, f"Missing expected fields. Got: {list(data.keys())}")

def test_get_deposit_address_for_network():
    """Test the GET /api/crypto/deposit-address/{token}/{network} endpoint"""
    user_id = f"crypto_test_{uuid.uuid4()}"
    token = generate_test_jwt(user_id)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test all combinations of tokens and networks
    tokens = ["USDC", "USDT"]
    networks = ["ethereum", "polygon", "bsc"]
    expected_address = "0x1cB7111eBBF79Af5E941eB89B8eAFC67830be8a4"
    
    for crypto_token in tokens:
        for network in networks:
            response = requests.get(f"{API_BASE}/crypto/deposit-address/{crypto_token}/{network}", headers=headers)
            
            if response.status_code != 200:
                log_test(f"GET Deposit Address - {crypto_token} on {network}", False, f"Status code: {response.status_code}, Response: {response.text}")
                continue
            
            data = response.json()
            
            # Check if we have the expected fields
            expected_fields = ["token", "network", "network_name", "chain_id", "address", "qr_code_data", "explorer_url", "avg_fee_usd", "target_region"]
            missing_fields = [field for field in expected_fields if field not in data]
            
            if not missing_fields:
                log_test(f"GET Deposit Address - {crypto_token} on {network} - Fields", True, "Response contains all expected fields")
            else:
                log_test(f"GET Deposit Address - {crypto_token} on {network} - Fields", False, f"Missing fields: {missing_fields}")
                continue
            
            # Check if token and network match the request
            if data["token"] == crypto_token and data["network"] == network:
                log_test(f"GET Deposit Address - {crypto_token} on {network} - Token/Network Match", True, "Token and network match the request")
            else:
                log_test(f"GET Deposit Address - {crypto_token} on {network} - Token/Network Match", False, f"Expected token {crypto_token} on network {network}, got token {data['token']} on network {data['network']}")
            
            # Check if address matches the expected address
            if data["address"] == expected_address:
                log_test(f"GET Deposit Address - {crypto_token} on {network} - Address Match", True, f"Address matches expected: {expected_address}")
            else:
                log_test(f"GET Deposit Address - {crypto_token} on {network} - Address Match", False, f"Expected address {expected_address}, got {data['address']}")
            
            # Check if QR code data is properly formatted
            if data["qr_code_data"].startswith("ethereum:"):
                log_test(f"GET Deposit Address - {crypto_token} on {network} - QR Code Format", True, "QR code data has correct format")
            else:
                log_test(f"GET Deposit Address - {crypto_token} on {network} - QR Code Format", False, f"QR code data has incorrect format: {data['qr_code_data']}")
            
            # Check if explorer URL is properly formatted
            if data["explorer_url"].startswith(f"{data['explorer_url'].split('/address/')[0]}/address/"):
                log_test(f"GET Deposit Address - {crypto_token} on {network} - Explorer URL Format", True, "Explorer URL has correct format")
            else:
                log_test(f"GET Deposit Address - {crypto_token} on {network} - Explorer URL Format", False, f"Explorer URL has incorrect format: {data['explorer_url']}")

def test_get_all_deposit_addresses():
    """Test the GET /api/crypto/deposit-addresses endpoint"""
    user_id = f"crypto_test_{uuid.uuid4()}"
    token = generate_test_jwt(user_id)
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{API_BASE}/crypto/deposit-addresses", headers=headers)
    
    if response.status_code != 200:
        log_test("GET All Deposit Addresses", False, f"Status code: {response.status_code}, Response: {response.text}")
        return
    
    data = response.json()
    
    # Check if we have the expected fields
    expected_fields = ["addresses", "supported_networks", "conversion_fee_percent"]
    missing_fields = [field for field in expected_fields if field not in data]
    
    if not missing_fields:
        log_test("GET All Deposit Addresses - Fields", True, "Response contains all expected fields")
    else:
        log_test("GET All Deposit Addresses - Fields", False, f"Missing fields: {missing_fields}")
        return
    
    # Check if we have addresses for both USDC and USDT
    addresses = data["addresses"]
    if "usdc" in addresses and "usdt" in addresses:
        log_test("GET All Deposit Addresses - Tokens", True, "Found addresses for both USDC and USDT")
    else:
        log_test("GET All Deposit Addresses - Tokens", False, f"Missing addresses for some tokens. Expected: usdc, usdt. Got: {list(addresses.keys())}")
        return
    
    # Check if we have addresses for all networks
    expected_networks = ["ethereum", "polygon", "bsc"]
    for token in ["usdc", "usdt"]:
        token_addresses = addresses[token]
        missing_networks = [network for network in expected_networks if network not in token_addresses]
        
        if not missing_networks:
            log_test(f"GET All Deposit Addresses - {token.upper()} Networks", True, f"Found addresses for all expected networks: {', '.join(expected_networks)}")
        else:
            log_test(f"GET All Deposit Addresses - {token.upper()} Networks", False, f"Missing addresses for networks: {missing_networks}")
    
    # Check if all addresses match the expected address
    expected_address = "0x1cB7111eBBF79Af5E941eB89B8eAFC67830be8a4"
    all_addresses_match = True
    mismatched_addresses = []
    
    for token in ["usdc", "usdt"]:
        for network in expected_networks:
            address_info = addresses[token].get(network)
            if address_info and address_info.get("address") != expected_address:
                all_addresses_match = False
                mismatched_addresses.append(f"{token.upper()} on {network}: {address_info.get('address')}")
    
    if all_addresses_match:
        log_test("GET All Deposit Addresses - Address Match", True, f"All addresses match expected: {expected_address}")
    else:
        log_test("GET All Deposit Addresses - Address Match", False, f"Some addresses don't match expected. Mismatched: {mismatched_addresses}")
    
    # Check if conversion fee is 3%
    if data["conversion_fee_percent"] == 3.0:
        log_test("GET All Deposit Addresses - Conversion Fee", True, "Conversion fee is correctly set to 3%")
    else:
        log_test("GET All Deposit Addresses - Conversion Fee", False, f"Expected conversion fee 3%, got {data['conversion_fee_percent']}%")

def test_get_crypto_balances():
    """Test the GET /api/crypto/balances endpoint"""
    user_id = f"crypto_test_{uuid.uuid4()}"
    token = generate_test_jwt(user_id)
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{API_BASE}/crypto/balances", headers=headers)
    
    if response.status_code != 200:
        log_test("GET Crypto Balances", False, f"Status code: {response.status_code}, Response: {response.text}")
        return
    
    data = response.json()
    
    # Check if we have the expected fields
    expected_fields = ["balances", "totals", "conversion_fees", "supported_networks"]
    missing_fields = [field for field in expected_fields if field not in data]
    
    if not missing_fields:
        log_test("GET Crypto Balances - Fields", True, "Response contains all expected fields")
    else:
        log_test("GET Crypto Balances - Fields", False, f"Missing fields: {missing_fields}")
        return
    
    # Check if we have balances for vonvault_business wallet
    balances = data["balances"]
    if "vonvault_business" in balances:
        log_test("GET Crypto Balances - Business Wallet", True, "Found balances for vonvault_business wallet")
    else:
        log_test("GET Crypto Balances - Business Wallet", False, f"Missing balances for vonvault_business wallet. Got: {list(balances.keys())}")
        return
    
    # Check if we have balances for all token-network combinations
    business_balances = balances["vonvault_business"]
    expected_combinations = [
        "usdc_ethereum", "usdt_ethereum",
        "usdc_polygon", "usdt_polygon",
        "usdc_bsc", "usdt_bsc"
    ]
    
    missing_combinations = [combo for combo in expected_combinations if combo not in business_balances]
    
    if not missing_combinations:
        log_test("GET Crypto Balances - Token-Network Combinations", True, f"Found balances for all expected token-network combinations")
    else:
        log_test("GET Crypto Balances - Token-Network Combinations", False, f"Missing balances for combinations: {missing_combinations}")
    
    # Check if totals are calculated correctly
    totals = data["totals"]
    if "usdc" in totals and "usdt" in totals and "total_usd" in totals:
        total_usdc = totals["usdc"]
        total_usdt = totals["usdt"]
        total_usd = totals["total_usd"]
        
        if abs(total_usd - (total_usdc + total_usdt)) < 0.01:  # Allow for small floating point differences
            log_test("GET Crypto Balances - Totals Calculation", True, f"Totals calculated correctly: USDC ({total_usdc}) + USDT ({total_usdt}) = USD ({total_usd})")
        else:
            log_test("GET Crypto Balances - Totals Calculation", False, f"Totals calculated incorrectly: USDC ({total_usdc}) + USDT ({total_usdt}) != USD ({total_usd})")
    else:
        log_test("GET Crypto Balances - Totals Structure", False, f"Missing expected total fields. Got: {list(totals.keys())}")
    
    # Check if conversion fees are calculated correctly (3%)
    conversion_fees = data["conversion_fees"]
    if "usdc" in conversion_fees and "usdt" in conversion_fees and "total" in conversion_fees:
        usdc_fee = conversion_fees["usdc"]
        usdt_fee = conversion_fees["usdt"]
        total_fee = conversion_fees["total"]
        
        # Check if fee percent is 3%
        if (usdc_fee.get("fee_percent") == 3.0 and 
            usdt_fee.get("fee_percent") == 3.0 and 
            total_fee.get("fee_percent") == 3.0):
            log_test("GET Crypto Balances - Fee Percent", True, "All fee percentages are correctly set to 3%")
        else:
            log_test("GET Crypto Balances - Fee Percent", False, f"Fee percentages are incorrect: USDC ({usdc_fee.get('fee_percent')}%), USDT ({usdt_fee.get('fee_percent')}%), Total ({total_fee.get('fee_percent')}%)")
        
        # Check if fee amounts are calculated correctly
        usdc_amount = totals["usdc"]
        usdt_amount = totals["usdt"]
        total_amount = totals["total_usd"]
        
        expected_usdc_fee = usdc_amount * 0.03
        expected_usdt_fee = usdt_amount * 0.03
        expected_total_fee = total_amount * 0.03
        
        if (abs(usdc_fee.get("fee_amount") - expected_usdc_fee) < 0.01 and
            abs(usdt_fee.get("fee_amount") - expected_usdt_fee) < 0.01 and
            abs(total_fee.get("fee_amount") - expected_total_fee) < 0.01):
            log_test("GET Crypto Balances - Fee Amount Calculation", True, "Fee amounts are calculated correctly")
        else:
            log_test("GET Crypto Balances - Fee Amount Calculation", False, f"Fee amounts are calculated incorrectly")
        
        # Check if net amounts are calculated correctly
        expected_usdc_net = usdc_amount - expected_usdc_fee
        expected_usdt_net = usdt_amount - expected_usdt_fee
        expected_total_net = total_amount - expected_total_fee
        
        if (abs(usdc_fee.get("net_amount") - expected_usdc_net) < 0.01 and
            abs(usdt_fee.get("net_amount") - expected_usdt_net) < 0.01 and
            abs(total_fee.get("net_amount") - expected_total_net) < 0.01):
            log_test("GET Crypto Balances - Net Amount Calculation", True, "Net amounts are calculated correctly")
        else:
            log_test("GET Crypto Balances - Net Amount Calculation", False, f"Net amounts are calculated incorrectly")
    else:
        log_test("GET Crypto Balances - Conversion Fees Structure", False, f"Missing expected conversion fee fields. Got: {list(conversion_fees.keys())}")

def test_get_crypto_transactions():
    """Test the GET /api/crypto/transactions endpoint"""
    user_id = f"crypto_test_{uuid.uuid4()}"
    token = generate_test_jwt(user_id)
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{API_BASE}/crypto/transactions", headers=headers)
    
    if response.status_code != 200:
        log_test("GET Crypto Transactions", False, f"Status code: {response.status_code}, Response: {response.text}")
        return
    
    data = response.json()
    
    # Check if we have transactions data
    if "transactions" in data:
        log_test("GET Crypto Transactions - Response Structure", True, "Response contains transactions array")
        
        # For a new user, the transactions array should be empty
        if isinstance(data["transactions"], list):
            log_test("GET Crypto Transactions - Array Type", True, "Transactions is an array")
        else:
            log_test("GET Crypto Transactions - Array Type", False, f"Transactions is not an array. Type: {type(data['transactions'])}")
    else:
        log_test("GET Crypto Transactions - Response Structure", False, f"Missing transactions field. Got: {list(data.keys())}")

def test_monitor_deposits():
    """Test the POST /api/crypto/monitor-deposits endpoint"""
    user_id = f"crypto_test_{uuid.uuid4()}"
    token = generate_test_jwt(user_id)
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.post(f"{API_BASE}/crypto/monitor-deposits", headers=headers)
    
    if response.status_code != 200:
        log_test("POST Monitor Deposits", False, f"Status code: {response.status_code}, Response: {response.text}")
        return
    
    data = response.json()
    
    # Check if we have the expected response structure
    if "new_deposits" in data and "count" in data and "message" in data:
        log_test("POST Monitor Deposits - Response Structure", True, "Response contains new_deposits, count, and message")
        
        # Check if new_deposits is an array
        if isinstance(data["new_deposits"], list):
            log_test("POST Monitor Deposits - Array Type", True, "new_deposits is an array")
            
            # Check if count matches the length of new_deposits
            if data["count"] == len(data["new_deposits"]):
                log_test("POST Monitor Deposits - Count Accuracy", True, f"Count ({data['count']}) matches new_deposits length ({len(data['new_deposits'])})")
            else:
                log_test("POST Monitor Deposits - Count Accuracy", False, f"Count ({data['count']}) doesn't match new_deposits length ({len(data['new_deposits'])})")
        else:
            log_test("POST Monitor Deposits - Array Type", False, f"new_deposits is not an array. Type: {type(data['new_deposits'])}")
    else:
        log_test("POST Monitor Deposits - Response Structure", False, f"Missing expected fields. Got: {list(data.keys())}")

def test_get_user_balance():
    """Test the GET /api/crypto/user-balance/{address} endpoint"""
    user_id = f"crypto_test_{uuid.uuid4()}"
    token = generate_test_jwt(user_id)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test with valid address on different networks
    address = "0x1cB7111eBBF79Af5E941eB89B8eAFC67830be8a4"
    networks = ["ethereum", "polygon", "bsc"]
    
    for network in networks:
        response = requests.get(f"{API_BASE}/crypto/user-balance/{address}?network={network}", headers=headers)
        
        if response.status_code != 200:
            log_test(f"GET User Balance - {network}", False, f"Status code: {response.status_code}, Response: {response.text}")
            continue
        
        data = response.json()
        
        # Check if we have the expected response structure
        expected_fields = ["address", "network", "network_name", "balances", "total_usd", "conversion_fee_info"]
        missing_fields = [field for field in expected_fields if field not in data]
        
        if not missing_fields:
            log_test(f"GET User Balance - {network} - Fields", True, "Response contains all expected fields")
        else:
            log_test(f"GET User Balance - {network} - Fields", False, f"Missing fields: {missing_fields}")
            continue
        
        # Check if address and network match the request
        if data["address"] == address and data["network"] == network:
            log_test(f"GET User Balance - {network} - Address/Network Match", True, "Address and network match the request")
        else:
            log_test(f"GET User Balance - {network} - Address/Network Match", False, f"Expected address {address} on network {network}, got address {data['address']} on network {data['network']}")
        
        # Check if balances include both USDC and USDT
        balances = data["balances"]
        tokens = [balance["token"] for balance in balances]
        
        if "USDC" in tokens and "USDT" in tokens:
            log_test(f"GET User Balance - {network} - Token Types", True, "Balances include both USDC and USDT")
        else:
            log_test(f"GET User Balance - {network} - Token Types", False, f"Missing expected tokens. Got: {tokens}")
        
        # Check if total_usd is the sum of USDC and USDT balances
        usdc_balance = next((balance["balance"] for balance in balances if balance["token"] == "USDC"), 0)
        usdt_balance = next((balance["balance"] for balance in balances if balance["token"] == "USDT"), 0)
        
        if abs(data["total_usd"] - (usdc_balance + usdt_balance)) < 0.01:  # Allow for small floating point differences
            log_test(f"GET User Balance - {network} - Total Calculation", True, f"Total USD ({data['total_usd']}) matches sum of USDC ({usdc_balance}) and USDT ({usdt_balance})")
        else:
            log_test(f"GET User Balance - {network} - Total Calculation", False, f"Total USD ({data['total_usd']}) doesn't match sum of USDC ({usdc_balance}) and USDT ({usdt_balance})")
        
        # Check if conversion fee is calculated correctly (3%)
        conversion_fee_info = data["conversion_fee_info"]
        
        if conversion_fee_info.get("fee_percent") == 3.0:
            log_test(f"GET User Balance - {network} - Fee Percent", True, "Fee percentage is correctly set to 3%")
        else:
            log_test(f"GET User Balance - {network} - Fee Percent", False, f"Expected fee percentage 3%, got {conversion_fee_info.get('fee_percent')}%")
        
        # Check if fee amount is calculated correctly
        total_usd = data["total_usd"]
        expected_fee = total_usd * 0.03
        
        if abs(conversion_fee_info.get("fee_amount") - expected_fee) < 0.01:
            log_test(f"GET User Balance - {network} - Fee Amount Calculation", True, "Fee amount is calculated correctly")
        else:
            log_test(f"GET User Balance - {network} - Fee Amount Calculation", False, f"Expected fee amount {expected_fee}, got {conversion_fee_info.get('fee_amount')}")
        
        # Check if net amount is calculated correctly
        expected_net = total_usd - expected_fee
        
        if abs(conversion_fee_info.get("net_amount") - expected_net) < 0.01:
            log_test(f"GET User Balance - {network} - Net Amount Calculation", True, "Net amount is calculated correctly")
        else:
            log_test(f"GET User Balance - {network} - Net Amount Calculation", False, f"Expected net amount {expected_net}, got {conversion_fee_info.get('net_amount')}")
    
    # Test with invalid address
    invalid_address = "0xinvalid"
    response = requests.get(f"{API_BASE}/crypto/user-balance/{invalid_address}", headers=headers)
    
    if response.status_code == 400:
        log_test("GET User Balance - Invalid Address", True, "Correctly rejected invalid address format")
    else:
        log_test("GET User Balance - Invalid Address", False, f"Expected 400 error for invalid address, got {response.status_code}: {response.text}")
    
    # Test with invalid network
    response = requests.get(f"{API_BASE}/crypto/user-balance/{address}?network=invalid", headers=headers)
    
    if response.status_code == 400:
        log_test("GET User Balance - Invalid Network", True, "Correctly rejected invalid network")
    else:
        log_test("GET User Balance - Invalid Network", False, f"Expected 400 error for invalid network, got {response.status_code}: {response.text}")

def test_crypto_authentication():
    """Test authentication for crypto endpoints"""
    # Test without authentication
    response = requests.get(f"{API_BASE}/crypto/deposit-addresses")
    
    if response.status_code == 401 or response.status_code == 403:
        log_test("Crypto Endpoints - Authentication Required", True, f"Correctly requires authentication (status code: {response.status_code})")
    else:
        log_test("Crypto Endpoints - Authentication Required", False, f"Expected 401/403 error without authentication, got {response.status_code}: {response.text}")
    
    # Test with invalid token
    headers = {"Authorization": "Bearer invalid_token"}
    response = requests.get(f"{API_BASE}/crypto/deposit-addresses", headers=headers)
    
    if response.status_code == 401 or response.status_code == 403:
        log_test("Crypto Endpoints - Invalid Token", True, f"Correctly rejects invalid token (status code: {response.status_code})")
    else:
        log_test("Crypto Endpoints - Invalid Token", False, f"Expected 401/403 error with invalid token, got {response.status_code}: {response.text}")

def run_all_tests():
    """Run all test functions"""
    print("===== STARTING VONVAULT DEFI MULTI-NETWORK CRYPTO API TESTS =====")
    
    # Basic health check
    test_health_check()
    
    # Multi-Network Crypto Tests
    test_get_supported_networks()
    test_get_networks_for_token()
    test_get_deposit_address_for_network()
    test_get_all_deposit_addresses()
    test_get_crypto_balances()
    test_get_crypto_transactions()
    test_monitor_deposits()
    test_get_user_balance()
    test_crypto_authentication()
    
    # Print summary
    print_summary()

if __name__ == "__main__":
    run_all_tests()