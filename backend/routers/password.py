from email.mime.text import MIMEText
from fastapi import APIRouter, Depends, Form, HTTPException
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from backend.core.config import BASE_URL
from backend.models.user import User
from database.session import get_db
from services.email_service import send_email

router = APIRouter()

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email không tồn tại")

    reset_link = f"${BASE_URL}/open-app/reset-password/{user.user_id}"

    body = f"""
    <p>Xin chào {user.username},</p>

    <p>Bạn đã yêu cầu khôi phục mật khẩu.</p>

    <p>
    👉 <a href="{reset_link}">Nhấn vào đây để đặt lại mật khẩu</a>
    </p>

    <p>(Nếu bạn không yêu cầu điều này, hãy bỏ qua email này.)</p>
    """
    msg = MIMEText(body, "html", "utf-8")

    send_email(to=data.email, subject="Khôi phục mật khẩu", body=body)
    return {"success": True, "message": "Đã gửi email khôi phục mật khẩu"}

@router.get("/reset-password/{user_id}", response_class=HTMLResponse)
def reset_password_form(user_id: int):
    return RedirectResponse(url=f"mobile://reset-password/{user_id}")

@router.post("/reset-password/{user_id}", response_class=HTMLResponse)
def reset_password_submit(user_id: int, new_password: str = Form(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại")
    user.password_hash = new_password
    db.commit()
    return HTMLResponse("<h3 class='text-success'>Mật khẩu đã được đặt lại thành công.</h3>")

from fastapi.responses import RedirectResponse



