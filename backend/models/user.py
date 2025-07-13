from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database.db import Base
from sqlalchemy import Unicode

class User(Base):
    __tablename__ = "User"
    __table_args__ = {'extend_existing': True}

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)

    full_name = Column(Unicode(100)) 
    phone_number = Column(String, nullable=True)
    address = Column(Unicode(100), nullable=True)
    created_at = Column(DateTime, server_default=func.now())


