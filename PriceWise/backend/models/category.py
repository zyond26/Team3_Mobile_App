from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database.db import Base 

class Category(Base):
    __tablename__ = "Category"

    category_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    parent_category_id = Column(Integer, ForeignKey('Category.category_id'), nullable=True)

    # Quan hệ đệ quy
    parent = relationship("Category", remote_side=[category_id], backref="children")
