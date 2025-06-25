# 📡 VonVault API Documentation

> **Complete REST API reference for the VonVault DeFi Telegram Mini App**

---

## 🎯 **API Overview**

The VonVault API is a RESTful service built with FastAPI, providing secure access to DeFi investment, portfolio management, and financial operations. All endpoints require HTTPS and support real-time data with sub-second response times.

**Base URL:** `https://vonvault-backend.onrender.com/api`

---

## 💼 **Multi-Wallet Management**

### **Connect New Wallet**
Connect a new crypto wallet to the user's account.

```http
POST /wallets/connect?type=metamask&address=0x...&name=My%20MetaMask&networks=ethereum&networks=polygon
Authorization: Bearer <token>
```

**Parameters:**
- `type` (string): Wallet type - 'metamask', 'trustwallet', 'walletconnect', 'coinbase'
- `address` (string): Wallet address
- `name` (string, optional): Custom wallet name
- `networks` (array): Supported networks - 'ethereum', 'polygon', 'bsc'

**Response:**
```json
{
  "success": true,
  "wallet": {
    "id": "wallet_550e8400-e29b-41d4-a716-446655440000",
    "type": "metamask",
    "address": "0x742d35cc6577c7bb96d27d5e1d9f9c5d4e9b8c7a",
    "name": "My MetaMask",
    "is_primary": false,
    "networks": ["ethereum", "polygon"],
    "connected_at": "2025-06-18T12:00:00.000Z"
  },
  "message": "MetaMask wallet connected successfully"
}
```

### **Get All User Wallets**
Retrieve all connected wallets for the authenticated user.

```http
GET /wallets
Authorization: Bearer <token>
```

**Response:**
```json
{
  "wallets": [
    {
      "id": "wallet_550e8400-e29b-41d4-a716-446655440000",
      "type": "metamask",
      "address": "0x742d35cc6577c7bb96d27d5e1d9f9c5d4e9b8c7a",
      "name": "My MetaMask",
      "is_primary": true,
      "networks": ["ethereum", "polygon", "bsc"],
      "connected_at": "2025-06-18T12:00:00.000Z",
      "last_used": "2025-06-18T14:30:00.000Z"
    },
    {
      "id": "wallet_550e8400-e29b-41d4-a716-446655440001",
      "type": "trustwallet",
      "address": "0x1234567890123456789012345678901234567890",
      "name": "Trust Wallet",
      "is_primary": false,
      "networks": ["ethereum", "polygon"],
      "connected_at": "2025-06-17T10:00:00.000Z"
    }
  ],
  "primary_wallet_id": "wallet_550e8400-e29b-41d4-a716-446655440000",
  "count": 2
}
```

### **Update Wallet**
Update wallet properties like name.

```http
PUT /wallets/{wallet_id}?name=Updated%20Wallet%20Name
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Wallet updated successfully"
}
```

### **Remove Wallet**
Remove a connected wallet from the user's account.

```http
DELETE /wallets/{wallet_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Wallet removed successfully",
  "new_primary_wallet_id": "wallet_550e8400-e29b-41d4-a716-446655440001"
}
```

### **Set Primary Wallet**
Designate a wallet as the primary wallet for transactions.

```http
POST /wallets/{wallet_id}/primary
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "primary_wallet_id": "wallet_550e8400-e29b-41d4-a716-446655440000",
  "message": "Primary wallet updated successfully"
}
```

### **Get Wallet-Specific Deposit Addresses**
Get deposit addresses for a specific wallet across all networks.

```http
GET /crypto/deposit-addresses/{wallet_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "wallet_id": "wallet_550e8400-e29b-41d4-a716-446655440000",
  "wallet_address": "0x742d35cc6577c7bb96d27d5e1d9f9c5d4e9b8c7a",
  "addresses": {
    "ethereum": {
      "usdc": "0x1234567890123456789012345678901234567890",
      "usdt": "0x0987654321098765432109876543210987654321"
    },
    "polygon": {
      "usdc": "0x1111222233334444555566667777888899990000",
      "usdt": "0x0000999988887777666655554444333322221111"
    }
  },
  "supported_networks": ["ethereum", "polygon", "bsc"]
}
```

### **Get Wallet-Specific Balance**
Get cryptocurrency balance for a specific wallet.

```http
GET /crypto/balances/{wallet_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "wallet_id": "wallet_550e8400-e29b-41d4-a716-446655440000",
  "wallet_address": "0x742d35cc6577c7bb96d27d5e1d9f9c5d4e9b8c7a",
  "balances": {
    "ethereum": {
      "usdc": 1500.50,
      "usdt": 750.25,
      "total": 2250.75
    },
    "polygon": {
      "usdc": 890.30,
      "usdt": 1200.00,
      "total": 2090.30
    }
  },
  "total_usd": 4341.05,
  "networks": ["ethereum", "polygon", "bsc"]
}
```

---

## 🔐 **Verification & Security**

### **Email Verification**
Send and verify email confirmation codes.

```http
POST /auth/email/send-verification
Content-Type: application/json
Authorization: Bearer <token>

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verification email sent",
  "expires_in": 900
}
```

```http
POST /auth/email/verify
Content-Type: application/json
Authorization: Bearer <token>

{
  "email": "user@example.com",
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "verified": true
}
```

### **SMS Verification**
Send and verify SMS confirmation codes.

```http
POST /auth/sms/send-verification
Content-Type: application/json
Authorization: Bearer <token>

{
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "SMS verification code sent",
  "expires_in": 300
}
```

```http
POST /auth/sms/verify
Content-Type: application/json
Authorization: Bearer <token>

{
  "phone": "+1234567890",
  "code": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Phone number verified successfully",
  "verified": true
}
```

### **Two-Factor Authentication (2FA)**
Setup and manage 2FA for enhanced security.

```http
POST /auth/2fa/setup/totp
Content-Type: application/json
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "secret": "JBSWY3DPEHPK3PXP",
  "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "backup_codes": ["12345678", "87654321", "11223344"]
}
```

```http
POST /auth/2fa/setup/sms
Content-Type: application/json
Authorization: Bearer <token>

{
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "SMS 2FA setup completed",
  "phone": "+1234567890"
}
```

```http
POST /auth/2fa/verify
Content-Type: application/json
Authorization: Bearer <token>

{
  "code": "123456",
  "method": "totp" // or "sms"
}
```

**Response:**
```json
{
  "success": true,
  "message": "2FA verification successful",
  "verified": true
}
```

---

## 🔐 **Authentication**

### **JWT Bearer Token**
All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

### **Obtain Authentication Token**

```http
POST /auth/telegram
Content-Type: application/json

{
  "user_id": "string"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "expires_in": 86400
}
```

---

## 🏥 **Health & Status**

### **Health Check**
Check API health and connectivity.

```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-06-18T12:00:00.000Z",
  "version": "1.0.0",
  "uptime": 3600
}
```

---

## 👤 **User Management**

### **Get User Profile**
Retrieve user profile and preferences.

```http
GET /profile/{user_id}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "preferences": {
    "theme": "dark",
    "onboarding_complete": true,
    "notifications_enabled": true
  },
  "created_at": "2025-06-18T12:00:00.000Z",
  "updated_at": "2025-06-18T12:00:00.000Z"
}
```

### **Update User Preferences**
Update user settings and preferences.

```http
POST /profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "theme": "dark",
  "onboarding_complete": true
}
```

**Response:**
```json
{
  "status": "saved",
  "preferences": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "theme": "dark",
    "onboarding_complete": true,
    "updated_at": "2025-06-18T12:00:00.000Z"
  }
}
```

---

## 📊 **Portfolio Management**

### **Get Portfolio Overview**
Retrieve complete portfolio data with real-time valuations.

```http
GET /portfolio
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "total_portfolio": 25948.50,
  "investments": {
    "total": 9500.00,
    "count": 3
  },
  "crypto": {
    "total": 7218.50
  },
  "bank": {
    "total": 9230.00
  },
  "breakdown": {
    "investments_percentage": 36.6,
    "crypto_percentage": 27.8,
    "cash_percentage": 35.6
  },
  "performance": {
    "daily_change": 2.3,
    "weekly_change": 5.7,
    "monthly_change": 12.4
  },
  "last_updated": "2025-06-18T12:00:00.000Z"
}
```

---

## 💰 **Investment Operations**

### **Get Investments**
Retrieve user's investment portfolio.

```http
GET /investments
Authorization: Bearer <token>
```

**Response:**
```json
{
  "investments": [
    {
      "id": "inv_550e8400-e29b-41d4-a716-446655440000",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Growth Plus Plan",
      "amount": 5000.00,
      "rate": 7.5,
      "term": 12,
      "status": "active",
      "created_at": "2025-06-18T12:00:00.000Z",
      "maturity_date": "2026-06-18T12:00:00.000Z",
      "current_value": 5312.50,
      "projected_return": 5375.00
    },
    {
      "id": "inv_550e8400-e29b-41d4-a716-446655440001",
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Stable Income",
      "amount": 3000.00,
      "rate": 5.5,
      "term": 6,
      "status": "active",
      "created_at": "2025-06-15T12:00:00.000Z",
      "maturity_date": "2025-12-15T12:00:00.000Z",
      "current_value": 3082.50,
      "projected_return": 3165.00
    }
  ],
  "total_invested": 8000.00,
  "total_current_value": 8395.00,
  "total_projected_return": 8540.00
}
```

### **Create Investment**
Create a new investment with specified parameters.

```http
POST /investments
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Aggressive Growth",
  "amount": 2500.00,
  "rate": 12.0,
  "term": 24
}
```

**Response:**
```json
{
  "investment": {
    "id": "inv_550e8400-e29b-41d4-a716-446655440002",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Aggressive Growth",
    "amount": 2500.00,
    "rate": 12.0,
    "term": 24,
    "status": "active",
    "created_at": "2025-06-18T12:00:00.000Z",
    "maturity_date": "2027-06-18T12:00:00.000Z",
    "projected_return": 3100.00
  },
  "message": "Investment created successfully"
}
```

### **Get Investment Plans**
Retrieve available investment plans and their details.

```http
GET /investments/plans
```

**Response:**
```json
{
  "plans": [
    {
      "id": "growth_plus",
      "name": "Growth Plus Plan",
      "rate": 7.5,
      "term_months": 12,
      "minimum_amount": 1000.00,
      "maximum_amount": 50000.00,
      "risk_level": "moderate",
      "description": "Balanced growth strategy with moderate risk"
    },
    {
      "id": "stable_income",
      "name": "Stable Income",
      "rate": 5.5,
      "term_months": 6,
      "minimum_amount": 500.00,
      "maximum_amount": 25000.00,
      "risk_level": "low",
      "description": "Conservative strategy focused on stable returns"
    },
    {
      "id": "aggressive_growth",
      "name": "Aggressive Growth",
      "rate": 12.0,
      "term_months": 24,
      "minimum_amount": 2000.00,
      "maximum_amount": 100000.00,
      "risk_level": "high",
      "description": "High-risk, high-reward growth strategy"
    }
  ]
}
```

---

## 🪙 **Cryptocurrency Data**

### **Get Crypto Prices**
Retrieve real-time cryptocurrency prices.

```http
GET /prices
```

**Response:**
```json
{
  "ethereum": {
    "usd": 2000.50,
    "usd_24h_change": 2.3
  },
  "bitcoin": {
    "usd": 65000.25,
    "usd_24h_change": -1.5
  },
  "usd-coin": {
    "usd": 1.00,
    "usd_24h_change": 0.01
  },
  "chainlink": {
    "usd": 15.75,
    "usd_24h_change": 3.2
  },
  "uniswap": {
    "usd": 8.45,
    "usd_24h_change": -0.8
  },
  "last_updated": "2025-06-18T12:00:00.000Z"
}
```

### **Get Wallet Balance**
Retrieve cryptocurrency wallet balance for a specific address.

```http
GET /wallet/balance/{address}
```

**Response:**
```json
{
  "address": "0x742d35cc6577c7bb96d27d5e1d9f9c5d4e9b8c7a",
  "balances": [
    {
      "token": "ETH",
      "balance": "1.234567890123456789",
      "usd_value": 2468.50,
      "price_per_token": 2000.50
    },
    {
      "token": "USDC",
      "balance": "1500.000000",
      "usd_value": 1500.00,
      "price_per_token": 1.00
    },
    {
      "token": "WBTC",
      "balance": "0.050000000000000000",
      "usd_value": 3250.00,
      "price_per_token": 65000.25
    }
  ],
  "total_usd": 7218.50,
  "last_updated": "2025-06-18T12:00:00.000Z"
}
```

### **Verify Wallet Signature**
Verify Ethereum wallet signature for authentication.

```http
POST /wallet/verify-signature
Content-Type: application/json

{
  "message": "Sign this message to authenticate with VonVault: 1687084800",
  "signature": "0x7b9ea2e3f2c1d8a4b5c6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2",
  "address": "0x742d35cc6577c7bb96d27d5e1d9f9c5d4e9b8c7a"
}
```

**Response:**
```json
{
  "valid": true,
  "address": "0x742d35cc6577c7bb96d27d5e1d9f9c5d4e9b8c7a",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 🏦 **Banking Operations**

### **Get Bank Accounts**
Retrieve linked bank accounts and their information.

```http
GET /bank/accounts
Authorization: Bearer <token>
```

**Response:**
```json
{
  "accounts": [
    {
      "id": "acc_checking_001",
      "account_name": "Checking Account",
      "account_type": "checking",
      "bank_name": "Chase Bank",
      "balance": {
        "available": "5250.00",
        "current": "5250.00"
      },
      "currency": "USD",
      "last_updated": "2025-06-18T12:00:00.000Z",
      "masked_number": "****1234"
    },
    {
      "id": "acc_savings_001",
      "account_name": "Savings Account",
      "account_type": "savings",
      "bank_name": "Chase Bank",
      "balance": {
        "available": "12480.00",
        "current": "12480.00"
      },
      "currency": "USD",
      "last_updated": "2025-06-18T12:00:00.000Z",
      "masked_number": "****5678"
    }
  ],
  "total_balance": 17730.00
}
```

### **Get Bank Balance Summary**
Retrieve total bank balance across all accounts.

```http
GET /bank/balance
Authorization: Bearer <token>
```

**Response:**
```json
{
  "total_balance": 17730.00,
  "accounts": 2,
  "currency": "USD",
  "last_updated": "2025-06-18T12:00:00.000Z",
  "breakdown": [
    {
      "account_type": "checking",
      "balance": 5250.00
    },
    {
      "account_type": "savings",
      "balance": 12480.00
    }
  ]
}
```

---

## 💸 **Financial Transactions**

### **Transfer Funds**
Initiate a fund transfer to another user or external account.

```http
POST /transactions/transfer
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipient": "user@example.com",
  "amount": 250.00,
  "currency": "USD",
  "message": "Payment for services"
}
```

**Response:**
```json
{
  "transaction_id": "txn_550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "recipient": "user@example.com",
  "amount": 250.00,
  "currency": "USD",
  "fee": 2.50,
  "total_amount": 252.50,
  "estimated_completion": "2025-06-18T12:05:00.000Z",
  "created_at": "2025-06-18T12:00:00.000Z"
}
```

### **Withdraw Funds**
Withdraw funds to a linked bank account.

```http
POST /transactions/withdraw
Authorization: Bearer <token>
Content-Type: application/json

{
  "account_id": "acc_checking_001",
  "amount": 1000.00,
  "currency": "USD"
}
```

**Response:**
```json
{
  "transaction_id": "txn_550e8400-e29b-41d4-a716-446655440001",
  "status": "processing",
  "account_id": "acc_checking_001",
  "amount": 1000.00,
  "currency": "USD",
  "fee": 5.00,
  "net_amount": 995.00,
  "estimated_completion": "2025-06-19T12:00:00.000Z",
  "created_at": "2025-06-18T12:00:00.000Z"
}
```

### **Get Transaction History**
Retrieve user's transaction history with pagination.

```http
GET /transactions?page=1&limit=20&type=all
Authorization: Bearer <token>
```

**Response:**
```json
{
  "transactions": [
    {
      "id": "txn_550e8400-e29b-41d4-a716-446655440000",
      "type": "transfer",
      "status": "completed",
      "amount": 250.00,
      "currency": "USD",
      "description": "Transfer to user@example.com",
      "created_at": "2025-06-18T12:00:00.000Z",
      "completed_at": "2025-06-18T12:02:30.000Z"
    },
    {
      "id": "txn_550e8400-e29b-41d4-a716-446655440001",
      "type": "investment",
      "status": "completed",
      "amount": 2500.00,
      "currency": "USD",
      "description": "Investment in Aggressive Growth plan",
      "created_at": "2025-06-17T14:30:00.000Z",
      "completed_at": "2025-06-17T14:30:15.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

---

## 📈 **Analytics & Insights**

### **Get Portfolio Performance**
Retrieve detailed portfolio performance metrics.

```http
GET /analytics/portfolio/performance
Authorization: Bearer <token>
```

**Response:**
```json
{
  "performance": {
    "total_return": 1248.50,
    "total_return_percentage": 5.2,
    "daily_change": 45.30,
    "daily_change_percentage": 0.18,
    "weekly_change": 312.75,
    "weekly_change_percentage": 1.25,
    "monthly_change": 1248.50,
    "monthly_change_percentage": 5.2
  },
  "asset_performance": {
    "investments": {
      "return": 395.00,
      "return_percentage": 4.34
    },
    "crypto": {
      "return": 618.50,
      "return_percentage": 9.37
    },
    "cash": {
      "return": 235.00,
      "return_percentage": 2.61
    }
  },
  "period": "30_days",
  "last_updated": "2025-06-18T12:00:00.000Z"
}
```

### **Get Investment Analytics**
Retrieve detailed analytics for investment performance.

```http
GET /analytics/investments
Authorization: Bearer <token>
```

**Response:**
```json
{
  "overview": {
    "total_invested": 8000.00,
    "current_value": 8395.00,
    "unrealized_gain": 395.00,
    "unrealized_gain_percentage": 4.94,
    "average_apy": 8.33
  },
  "by_plan": [
    {
      "plan_name": "Growth Plus Plan",
      "invested": 5000.00,
      "current_value": 5312.50,
      "gain": 312.50,
      "gain_percentage": 6.25,
      "apy": 7.5,
      "days_invested": 30
    },
    {
      "plan_name": "Stable Income",
      "invested": 3000.00,
      "current_value": 3082.50,
      "gain": 82.50,
      "gain_percentage": 2.75,
      "apy": 5.5,
      "days_invested": 33
    }
  ],
  "projections": {
    "6_months": 8640.00,
    "1_year": 9200.00,
    "2_years": 10150.00
  }
}
```

---

## ⚠️ **Error Handling**

### **Error Response Format**

All API errors follow a consistent format:

```json
{
  "error": {
    "code": "INVALID_AMOUNT",
    "message": "Investment amount must be at least $500",
    "details": {
      "field": "amount",
      "provided": 250.00,
      "minimum": 500.00
    },
    "timestamp": "2025-06-18T12:00:00.000Z",
    "request_id": "req_550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### **HTTP Status Codes**

| Code | Description | Example |
|------|-------------|---------|
| `200` | Success | Request completed successfully |
| `201` | Created | Resource created successfully |
| `400` | Bad Request | Invalid input parameters |
| `401` | Unauthorized | Missing or invalid authentication |
| `403` | Forbidden | Insufficient permissions |
| `404` | Not Found | Resource not found |
| `422` | Validation Error | Input validation failed |
| `429` | Rate Limited | Too many requests |
| `500` | Server Error | Internal server error |

### **Common Error Codes**

| Code | Description |
|------|-------------|
| `INVALID_TOKEN` | JWT token is invalid or expired |
| `INSUFFICIENT_FUNDS` | Not enough balance for transaction |
| `INVALID_AMOUNT` | Amount is below minimum or above maximum |
| `RATE_LIMITED` | Too many requests from this client |
| `EXTERNAL_API_ERROR` | Third-party service unavailable |
| `VALIDATION_ERROR` | Input validation failed |
| `DUPLICATE_INVESTMENT` | Investment with same parameters exists |

---

## 🔄 **Rate Limiting**

API requests are rate-limited to ensure fair usage:

- **Public endpoints**: 100 requests per minute
- **Authenticated endpoints**: 1000 requests per minute
- **Trading operations**: 10 requests per minute

Rate limit headers are included in all responses:

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1687084860
```

---

## 📚 **SDKs & Examples**

### **JavaScript/TypeScript SDK**

```typescript
import { VonVaultAPI } from '@vonvault/sdk';

const api = new VonVaultAPI({
  baseURL: 'https://vonvault-backend.onrender.com/api',
  apiKey: 'your-api-key'
});

// Get portfolio
const portfolio = await api.portfolio.get();

// Create investment
const investment = await api.investments.create({
  name: 'Growth Plus Plan',
  amount: 5000,
  rate: 7.5,
  term: 12
});
```

### **Python SDK**

```python
from vonvault import VonVaultClient

client = VonVaultClient(
    base_url='https://vonvault-backend.onrender.com/api',
    api_key='your-api-key'
)

# Get portfolio
portfolio = await client.portfolio.get()

# Create investment
investment = await client.investments.create(
    name='Growth Plus Plan',
    amount=5000,
    rate=7.5,
    term=12
)
```

---

## 🧪 **Testing**

### **API Testing Environment**

**Test Base URL:** `https://vonvault-backend-staging.onrender.com/api`

### **Example Test Data**

Test user credentials:
```json
{
  "user_id": "test_user_123",
  "email": "test@vonvault.com",
  "password": "test_password"
}
```

### **Postman Collection**

Import our Postman collection for easy testing:
[Download VonVault API Collection](./postman/VonVault_API.postman_collection.json)

---

*API Documentation last updated: June 18, 2025*
*For support, contact: api-support@vonvault.com*