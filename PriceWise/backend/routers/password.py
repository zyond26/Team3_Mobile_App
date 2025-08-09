from email.mime.text import MIMEText
from fastapi import APIRouter, Depends, Form, HTTPException
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from passlib.hash import bcrypt

from core.config import BASE_URL
from models.user import User
from database.session import get_db
from services.email_service import send_email

router = APIRouter()

# ----------------- Pydantic Request -----------------
class ForgotPasswordRequest(BaseModel):
    email: EmailStr


# ----------------- API: Gửi email khôi phục -----------------
@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email không tồn tại")

    reset_link = f"{BASE_URL}/reset-password/{user.user_id}"

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


# ----------------- API: Form đặt lại mật khẩu -----------------
@router.get("/reset-password/{user_id}", response_class=HTMLResponse)
def reset_password_form(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        return HTMLResponse("<h3 style='color:red;'>Người dùng không tồn tại.</h3>")

    return f"""
    <html>
      <head>
        <title>Đặt lại mật khẩu</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {{
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #f4f6f8;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }}
          .container {{
            background: white;
            padding: 20px 25px;
            border-radius: 10px;
            box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
            width: 80%;
            max-width: 400px;
            text-align: center;
          }}
          h2 {{
            color: #333;
            margin-bottom: 20px;
            font-size: 20px;
          }}
          input {{
            width: 100%;
            padding: 12px;
            margin-top: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 14px;
          }}
          button {{
            width: 100%;
            padding: 12px;
            margin-top: 15px;
            border: none;
            border-radius: 6px;
            font-size: 15px;
            cursor: pointer;
            background: #007BFF;
            color: white;
            transition: background 0.3s;
          }}
          button:hover {{
            background: #0056b3;
          }}
          @media (max-width: 480px) {{
            .container {{
              padding: 15px 20px;
            }}
            h2 {{
              font-size: 18px;
            }}
            input, button {{
              font-size: 14px;
            }}
          }}
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Đặt lại mật khẩu cho <br>{user.username}</h2>
          <form method="post">
            <input type="password" name="new_password" placeholder="Nhập mật khẩu mới" required minlength="6">
            <button type="submit">Xác nhận</button>
          </form>
        </div>
      </body>
    </html>
    """


# ----------------- API: Xử lý đặt lại mật khẩu -----------------
@router.post("/reset-password/{user_id}", response_class=HTMLResponse)
def reset_password_submit(user_id: int, new_password: str = Form(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        return HTMLResponse("<h3 style='color:red;'>Người dùng không tồn tại.</h3>")

    # Hash mật khẩu mới
    hashed_password = bcrypt.hash(new_password)
    user.password_hash = hashed_password
    db.commit()

    return """
    <html>
      <head>
        <title>Đặt lại mật khẩu</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #f4f6f8;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .container {
            background: white;
            padding: 20px 25px;
            border-radius: 10px;
            box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
            width: 80%;
            max-width: 400px;
            text-align: center;
          }
          h3 {
            color: green;
            margin-bottom: 20px;
          }
          p {
            font-size: 16px;
            color: #333;
            margin-bottom: 20px;
            font-weight: 500;
          }
          @media (max-width: 480px) {
            .container {
              padding: 15px 20px;
            }
            h3 {
              font-size: 16px;
            }
            button {
              font-size: 14px;
            }
          }
        </style>
        <script>
          function closeWindow() {
            window.close();
          }
        </script>
      </head>
      <body>
        <div class="container">
          <h3>✅ Mật khẩu đã được đặt lại thành công.</h3>
          <p>Bạn có thể trở về ứng dụng và đăng nhập với mật khẩu mới!</p>
        </div>
      </body>
    </html>
    """
