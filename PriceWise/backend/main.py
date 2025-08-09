import sys
import os

# Thêm thư mục gốc của project vào sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

# Import engine và Base từ db.py
from database.db import Base, engine

# Import toàn bộ models để SQLAlchemy nhận diện bảng
import models  # models/__init__.py phải import tất cả model: category, user, product_platform

# Import routers
from routers import auth, password, product_platform, user_router, category, product_router, favorite, search_history_router, admin_product_platform, admin_product, platform

app = FastAPI()

# CORS cấu hình
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

# Tạo bảng nếu chưa có
Base.metadata.create_all(bind=engine)

# Đăng ký routers
app.include_router(auth.router)
app.include_router(password.router)
app.include_router(product_platform.router)
app.include_router(user_router.router)
app.include_router(category.router, prefix="/categories")
app.include_router(product_router.router)
app.include_router(favorite.router)
app.include_router(search_history_router.router)
app.include_router(admin_product_platform.router)
app.include_router(admin_product.router)
app.include_router(platform.router)


# Deep link reset password
@app.get("/open-app/reset-password/{user_id}")
def open_app_reset(user_id: int):
    return RedirectResponse(url=f"pricewise://reset-password/{user_id}")
