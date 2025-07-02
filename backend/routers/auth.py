from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/signin")
def login(request: LoginRequest):
    # Xác thực tạm thời (cho phép mọi người đăng nhập)
    return {"message": "Login successful"}
