from sqlalchemy import Column, Integer, ForeignKey, DateTime, String
from sqlalchemy.orm import relationship
from datetime import datetime
from database.db import Base  

class FavoriteProduct(Base):
    __tablename__ = "Favorite_Product"

    favorite_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    product_id = Column(Integer, nullable=False)
    product_platform_id = Column(Integer, ForeignKey("Product_Platform.product_platform_id"), nullable=False)
    added_at = Column(DateTime, default=datetime.utcnow)

    product_platform = relationship("ProductPlatform", back_populates="favorites")


class ProductPlatform(Base):
    __tablename__ = "Product_Platform"

    product_platform_id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, nullable=False)
    platform_id = Column(Integer, ForeignKey("Platform.platform_id"))
    price = Column(Integer)
    discount = Column(Integer)
    discount_percentage = Column(Integer)
    rating = Column(Integer)
    review_count = Column(Integer)
    product_url = Column(String)
    shipping_fee = Column(Integer)
    estimated_delivery_time = Column(String)
    is_official = Column(Integer)
    last_updated = Column(DateTime)

    favorites = relationship("FavoriteProduct", back_populates="product_platform")


class Platform(Base):
    __tablename__ = "Platform"

    platform_id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    url = Column(String)
    logo_url = Column(String)
