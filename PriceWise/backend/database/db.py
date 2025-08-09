import pyodbc
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    # Dùng cho pyodbc thuần
    raw_conn_str = os.getenv("PYODBC_CONN_STR")
    return pyodbc.connect(raw_conn_str)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Lấy chuỗi kết nối SQLAlchemy từ .env
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
