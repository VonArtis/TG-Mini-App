from fastapi import FastAPI
from routes import bank, profile, notify, wallet

app = FastAPI()
app.include_router(bank.router, prefix="/bank")
app.include_router(profile.router, prefix="/profile")
app.include_router(notify.router, prefix="/notify")
app.include_router(wallet.router, prefix="/wallet")
