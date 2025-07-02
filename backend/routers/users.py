from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, auth

router = APIRouter()

@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter_by(email=user.email).first():
        raise HTTPException(status_code=400, detail="Email đã tồn tại")
    hashed = auth.hash_password(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        password_hash=hashed
    )
    db.add(db_user)
    db.commit()
    return {"msg": "Tạo tài khoản thành công"}

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter_by(email=user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Sai email hoặc mật khẩu")
    token = auth.create_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/users/me", response_model=schemas.UserOut)
def get_user_me(token: str, db: Session = Depends(get_db)):
    email = auth.decode_token(token)
    if not email:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")
    db_user = db.query(models.User).filter_by(email=email).first()
    return db_user
