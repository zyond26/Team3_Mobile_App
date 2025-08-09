from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Unicode
from sqlalchemy.sql import func
from database.db import Base

class SearchHistory(Base):
    __tablename__ = "Search_History"
    __table_args__ = {'extend_existing': True}

    search_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("User.user_id", ondelete="CASCADE"))
    query = Column(Unicode(100), nullable=False)
    search_time = Column(DateTime, server_default=func.now())
