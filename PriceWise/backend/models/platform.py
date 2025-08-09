from sqlalchemy import Column, Integer, String
from database.db import Base

class Platform(Base):
    __tablename__ = "Platform"

    platform_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, unique=True)
    url = Column(String(500), nullable=True)
    logo_url = Column(String(500), nullable=True)
