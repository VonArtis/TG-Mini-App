#!/bin/bash
# VonVault Health Check Script
# Run this before every git commit

echo "🔍 VonVault Health Check Starting..."

# Frontend TypeScript Check
echo "📝 Checking TypeScript..."
cd /app/frontend
npx tsc --noEmit
if [ $? -ne 0 ]; then
    echo "❌ TypeScript errors found!"
    exit 1
fi

# Frontend Build Test
echo "🏗️ Testing Frontend Build..."
yarn build > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

# Backend Python Check
echo "🐍 Checking Backend..."
cd /app/backend
python -m py_compile server.py
if [ $? -ne 0 ]; then
    echo "❌ Backend Python errors!"
    exit 1
fi

# Service Restart Test
echo "🔄 Testing Fresh Restart..."
sudo supervisorctl restart all > /dev/null 2>&1
sleep 10

# Health Check
curl -s http://localhost:3000 > /dev/null
if [ $? -ne 0 ]; then
    echo "❌ Frontend not responding!"
    exit 1
fi

curl -s http://localhost:8001/api/status > /dev/null
if [ $? -ne 0 ]; then
    echo "❌ Backend not responding!"
    exit 1
fi

echo "✅ All checks passed! Safe to commit."
echo "🚀 Frontend: ✅ | Backend: ✅ | Build: ✅ | TypeScript: ✅"