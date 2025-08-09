from sqlalchemy.orm import Session
from backend.models.user import User
from backend.database.session import SessionLocal
from backend.services.auth import hash_password

def hash_existing_passwords():
    db: Session = SessionLocal()
    users = db.query(User).all()

    for user in users:
        if not user.password_hash.startswith("$2b$"): 
            print(f"🔐 Hashing password for user {user.email}...")
            user.password_hash = hash_password(user.password_hash)
    
    db.commit()
    print("✅ Đã hash toàn bộ mật khẩu.")

if __name__ == "__main__":
    hash_existing_passwords()
