# database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import urllib.parse
import config

DATABASE_URL = (
    f"mssql+pyodbc://{config.DB_USER}:{config.DB_PASSWORD}"
    f"@{config.DB_SERVER}/{config.DB_NAME}?driver={urllib.parse.quote_plus(config.DB_DRIVER)}"
)

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
