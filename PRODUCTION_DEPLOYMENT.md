# 🚀 VonVault Production Deployment Guide

## Overview
This guide will help you deploy your enhanced VonVault DeFi Telegram Mini App to production at vonartis.app.

## 🎯 Prerequisites

### Required Services
- ✅ **Render Account** (for both frontend and backend deployment)
- ✅ **MongoDB Atlas** (for database)
- ✅ **Domain** (vonartis.app - already configured)

### Required API Keys
- 🔑 **Telegram Bot Token** (from @BotFather)
- 🔑 **MongoDB Connection String** (from MongoDB Atlas)
- 🔑 **Teller API Key** (optional - for banking features)
- 🔑 **CoinGecko API Key** (optional - for crypto prices)

## 📱 Step 1: Create Telegram Bot

### 1.1 Setup Bot with BotFather
```
1. Open Telegram and message @BotFather
2. Send /newbot command
3. Choose bot name: "VonVault DeFi Bot"
4. Choose username: "vonvault_defi_bot" (or similar)
5. Save the bot token: XXXXXXXXX:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 1.2 Configure WebApp
```
1. Message @BotFather
2. Send /mybots
3. Select your bot
4. Choose "Bot Settings" → "Menu Button"
5. Set Menu Button URL: https://vonartis.app
6. Set Menu Button Text: "Open VonVault"
```

## 🔧 Step 2: Backend Deployment (Render)

### 2.1 Connect GitHub to Render
```
1. Login to Render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select repository: "HarryVonBot/TG-Mini-App"
5. Select branch: "main"
6. Root Directory: "backend"
```

### 2.2 Configure Render Settings
```
Name: vonvault-backend
Environment: Python 3
Build Command: pip install -r requirements.txt
Start Command: python server.py
```

### 2.3 Set Environment Variables in Render
```bash
# Database
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/vonvault?retryWrites=true&w=majority

# Authentication
JWT_SECRET=vonvault-super-secure-jwt-secret-2025-production
JWT_ALGORITHM=HS256

# Telegram
TELEGRAM_BOT_TOKEN=1234567890:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# External APIs (Optional)
TELLER_API_KEY=your-teller-api-key
COINGECKO_API_KEY=your-coingecko-api-key

# Application
ENVIRONMENT=production
PORT=10000
CORS_ORIGINS=https://vonartis.app,https://www.vonartis.app
```

### 2.4 Deploy Backend
```
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL: https://vonvault-backend.onrender.com
4. Test health endpoint: https://vonvault-backend.onrender.com/api/health
```

## 🌐 Step 3: Frontend Deployment (Render)

### 3.1 Connect GitHub to Render
```
1. Login to Render.com  
2. Click "New +" → "Static Site"
3. Connect your GitHub account
4. Select repository: "HarryVonBot/TG-Mini-App"
5. Select branch: "main"
6. Root Directory: "frontend"
```

### 3.2 Configure Render Settings
```
Build Command: yarn install && yarn build
Publish Directory: build
Auto-Deploy: Yes
```

### 3.3 Set Environment Variables in Render
```bash
# Backend API
REACT_APP_BACKEND_URL=https://vonvault-backend.onrender.com

# Application
REACT_APP_ENVIRONMENT=production
REACT_APP_APP_NAME=VonVault
REACT_APP_VERSION=2.0.0

# Telegram
REACT_APP_TELEGRAM_BOT_TOKEN=1234567890:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Features
REACT_APP_ENABLE_MEMBERSHIP_TIERS=true
REACT_APP_ENABLE_ANIMATIONS=true

# Performance
GENERATE_SOURCEMAP=false
NODE_VERSION=18
```

### 3.4 Configure Custom Domain
```
1. In Render project settings
2. Go to "Custom Domains"
3. Add domain: "vonartis.app"
4. Add domain: "www.vonartis.app"
5. Follow DNS configuration instructions
```

### 3.5 Deploy Frontend
```
1. Click "Manual Deploy" or push to GitHub
2. Wait for deployment to complete
3. Verify at: https://vonartis.app
```

## 🗄️ Step 4: Database Setup (MongoDB Atlas)

### 4.1 Create Database
```
1. Login to MongoDB Atlas
2. Create new cluster (if not exists)
3. Create database: "vonvault"
4. Create collections:
   - users
   - investments
   - investment_plans
   - user_preferences
```

### 4.2 Configure Network Access
```
1. Go to "Network Access"
2. Add IP Address: 0.0.0.0/0 (allow all - for Render)
3. Or add specific Render IP ranges
```

### 4.3 Get Connection String
```
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Copy connection string
4. Replace <password> with your database password
5. Use in MONGO_URL environment variable
```

## 🧪 Step 5: Testing

### 5.1 Test Backend
```bash
# Health check
curl https://vonvault-backend.onrender.com/api/health

# Membership tiers
curl https://vonvault-backend.onrender.com/api/membership/tiers

# Investment plans
curl https://vonvault-backend.onrender.com/api/investment-plans/all
```

### 5.2 Test Frontend
```
1. Visit https://vonartis.app
2. Verify app loads correctly
3. Check all 17 screens are accessible
4. Test membership system functionality
```

### 5.3 Test Telegram Integration
```
1. Open your bot in Telegram
2. Click the menu button
3. Verify VonVault opens within Telegram
4. Test authentication flow
5. Verify all membership features work
```

## 🎯 Step 6: Final Configuration

### 6.1 Update Bot Settings
```
1. Message @BotFather
2. Send /mybots
3. Select your bot
4. Update description and about text
5. Add commands:
   /start - Start VonVault
   /help - Get help
   /portfolio - View portfolio
```

### 6.2 Security Checklist
```
✅ HTTPS enabled on vonartis.app
✅ Environment variables secured
✅ Database access restricted
✅ JWT secret is strong and unique
✅ API endpoints properly authenticated
✅ CORS configured correctly
```

## 🎉 Deployment Complete!

Your VonVault DeFi Telegram Mini App is now live at:
- 🌐 **Web**: https://vonartis.app
- 📱 **Telegram**: Through your bot's menu button

### Key Features Deployed:
- 🏆 **4-Tier Membership System** (Club → Premium → VIP → Elite)
- 💎 **Dynamic APY Rates** (6% - 20% based on membership)
- 🎨 **Premium UI** with tier-specific animations
- 📱 **17 Professional Screens**
- 🔐 **Telegram Authentication**
- 📊 **Real-time Investment Tracking**

## 🆘 Troubleshooting

### Common Issues:

**Frontend won't load:**
- Check Render deployment logs
- Verify environment variables
- Ensure REACT_APP_BACKEND_URL is correct

**Backend errors:**
- Check Render logs
- Verify MongoDB connection string
- Ensure all environment variables are set

**Telegram bot not working:**
- Verify bot token is correct
- Check webhook URL configuration
- Ensure domain has valid SSL certificate

**Authentication fails:**
- Check JWT_SECRET is set
- Verify Telegram bot token
- Test init data validation

### Support:
- 📧 deployment@vonvault.com
- 📚 Check deployment logs in Render/Render
- 🔍 Monitor application health endpoints

## 🚀 Next Steps:
1. **Monitor Performance** - Set up analytics
2. **User Testing** - Get feedback from real users
3. **Feature Enhancement** - Add more premium features
4. **Scaling** - Optimize for higher user loads

Your VonVault DeFi platform is now production-ready! 🎉