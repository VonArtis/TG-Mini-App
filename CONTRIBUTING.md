# Contributing to VonVault Telegram Mini App

We welcome contributions to the VonVault Telegram Mini App! Here's how you can help:

---

## 🛠 What You Can Work On

- 🔧 Fix bugs or UI issues
- ✨ Add support for new wallets or blockchains
- 💬 Improve Telegram bot features or commands
- 📊 Add new analytics tracking or backend endpoints
- 🧪 Write tests for existing API routes and components

---

## 📦 Project Structure

- `frontend/`: React + Tailwind app (Telegram Mini App interface)
- `backend/`: FastAPI app with Teller, Firebase, JWT, and Wallet integration

---

## 🔧 Setup Instructions

1. Clone the repo  
   `git clone https://github.com/HarryVonBot/TG-Mini_App.git`

2. Install dependencies and run:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

3. Add your `.env` based on `.env.template`

---

## ✅ Pull Request Guidelines

- Fork the repository and make your changes in a feature branch
- Ensure all code is formatted (Prettier, Black, etc.)
- Add clear commit messages and include a description in your PR
- Tag issues in your PR if applicable

---

## 🙌 Code of Conduct

Please be respectful and inclusive in all communications and pull requests.

Thank you for contributing! 🚀
