from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database.db import Base

# class Platform(Base):
#     __tablename__ = "Platform"
#     platform_id = Column(Integer, primary_key=True, index=True)
#     name = Column(String(50), nullable=False, unique=True)
#     url = Column(String(500))
#     logo_url = Column(String(500))

# class Product(Base):
#     __tablename__ = "Product"
#     product_id = Column(Integer, primary_key=True, index=True)
#     name = Column(String(255), nullable=False)
#     description = Column(String)
#     image_url = Column(String(255))
#     category_id = Column(Integer, ForeignKey('Category.category_id'), nullable=True)

#     created_at = Column(DateTime, server_default=func.now())
#     updated_at = Column(DateTime, onupdate=func.now())

#     category_id = Column(Integer, ForeignKey('Category.category_id'), nullable=True)
#     category = relationship("Category", backref="products")
#     product_platforms = relationship("ProductPlatform", back_populates="product")
#     platforms = relationship("ProductPlatform", back_populates="product")

class Product(Base):
    __tablename__ = "Product"
    product_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(String)
    image_url = Column(String(255))
    category_id = Column(Integer, ForeignKey('Category.category_id'), nullable=True)

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    category = relationship("Category", backref="products")
    product_platforms = relationship("ProductPlatform", back_populates="product")

class ProductPlatform(Base):
    __tablename__ = "Product_Platform"
    product_platform_id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("Product.product_id"), nullable=False)
    platform_id = Column(Integer, ForeignKey("Platform.platform_id"), nullable=False)

    price = Column(Float, nullable=False)
    discount = Column(Float)
    discount_percentage = Column(Float)
    rating = Column(Float)
    review_count = Column(Integer)
    product_url = Column(String(3000))
    shipping_fee = Column(Float)
    estimated_delivery_time = Column(String(50))
    is_official = Column(Boolean, default=False)
    last_updated = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Quan hệ ngược lại
    product = relationship("Product", back_populates="product_platforms")
    platform = relationship("Platform")

