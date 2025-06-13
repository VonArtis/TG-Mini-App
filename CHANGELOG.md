# Changelog

All notable changes to the VonVault Telegram Mini App will be documented in this file.

---

## [1.0.0] - Initial Release

### Frontend
- Built responsive UI using React + Tailwind CSS
- Integrated Telegram WebApp SDK for secure auth
- Connected WalletConnect + ethers.js for self-custody wallets
- Integrated Covalent API for real-time token balances (ETH, USDC, DAI)
- Enabled Firebase Analytics tracking
- Added support for Ethereum, Polygon, and BSC

### Backend
- FastAPI setup with RESTful endpoints
- Telegram `initData` verification (`/auth/verify`)
- Firebase Firestore integration for investment and profile data
- Teller API integration for live banking data
- Signature verification endpoint for Ethereum messages
- Telegram notification service via Bot API
- JWT token-based route protection for sensitive APIs

### DevOps & Infra
- GitHub-ready project structure
- Vercel setup for frontend deployment
- Railway setup for backend deployment
- Provided `.env.template` for environment configuration
- Created tech stack visual diagram and PDF documentation

---

## [Next Release]
- NFT balance support via Covalent
- Admin dashboard for investments
- Scheduled Telegram alerts (webhook-based)
