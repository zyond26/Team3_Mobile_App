# main.py

from fastapi import FastAPI
from database import Base, engine
from routers import users, products, favorites, history
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS để kết nối với frontend React Native
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load các router
app.include_router(users.router)
app.include_router(products.router)
app.include_router(favorites.router)
app.include_router(history.router)


