from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from schemas.schemas import UserOut, UserCreate
from models.user import User
from database.session import get_db
from fastapi import APIRouter, HTTPException, Depends
from google.oauth2 import id_token
from google.auth.transport import requests
from services.auth import create_access_token

router = APIRouter()

@router.post("/users/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email đã tồn tại")
    
    user_dict = user.dict()
    user_dict["password_hash"] = hash_password(user_dict.pop("password_hash")) 
    db_user = User(**user_dict)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

from services.auth import hash_password, verify_password
from services.auth import create_access_token

@router.post("/login")
def login(data: dict = Body(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.get("email")).first()
    if not user or not verify_password(data.get("password"), user.password_hash):
        raise HTTPException(status_code=401, detail="Sai tài khoản hoặc mật khẩu")
    
    token = create_access_token({"sub": str(user.user_id)})

    return {
        "success": True,
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.user_id,
            "email": user.email,
            "username": user.username
        }
    }

@router.post("/login/google")
def login_google(data: dict = Body(...), db: Session = Depends(get_db)):
    token = data.get("id_token")
    if not token:
        raise HTTPException(status_code=400, detail="Thiếu id_token")

    try:
        # Xác minh với Google
        id_info = id_token.verify_oauth2_token(token, requests.Request())
        email = id_info["email"]
        username = id_info.get("name", "GoogleUser")

        user = db.query(User).filter(User.email == email).first()

        if not user:
            # Tạo user mới nếu chưa có
            user = User(email=email, username=username, password_hash="google_auth")
            db.add(user)
            db.commit()
            db.refresh(user)

        access_token = create_access_token({"sub": str(user.user_id)})

        return {
            "success": True,
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.user_id,
                "email": user.email,
                "username": user.username
            }
        }

    except ValueError:
        raise HTTPException(status_code=400, detail="id_token không hợp lệ")