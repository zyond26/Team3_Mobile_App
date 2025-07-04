from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(request: LoginRequest):
    # Logic tạm thời, thay bằng gọi tới users.py sau
    return {"message": "Login successful", "user_id": 1}  # Thay 1 bằng user_id thực tế

