from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text, Boolean
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

# 🧑‍💼 Người dùng
class User(Base):
    __tablename__ = "User"
    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True)
    password_hash = Column(String(256), nullable=False)
    full_name = Column(String(100))
    phone_number = Column(String(20))
    address = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)

    favorites = relationship("FavoriteProduct", back_populates="user")
    search_history = relationship("SearchHistory", back_populates="user")


# 📦 Nền tảng bán hàng (Shopee, Lazada,...)
class Platform(Base):
    __tablename__ = 'Platform'
    platform_id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)

    product_platforms = relationship("Product_Platform", back_populates="platform")


# 📱 Sản phẩm chính (tên, mô tả, ảnh...)
class Product(Base):
    __tablename__ = "Product"
    product_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category_id = Column(Integer)
    description = Column(Text)
    image_url = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime)

    platforms = relationship("Product_Platform", back_populates="product")
    favorites = relationship("FavoriteProduct", back_populates="product")


# 🧩 Thông tin 1 sản phẩm trên từng nền tảng
class Product_Platform(Base):
    __tablename__ = 'Product_Platform'
    product_id = Column(Integer, ForeignKey('Product.product_id'), primary_key=True)
    platform_id = Column(Integer, ForeignKey('Platform.platform_id'), primary_key=True)

    price = Column(Float)
    discount = Column(Float)
    discount_percentage = Column(Float)
    rating = Column(Float)
    review_count = Column(Integer)
    product_url = Column(String)
    shipping_fee = Column(Float)
    estimated_delivery_time = Column(String)
    is_official = Column(Boolean)

    product = relationship("Product", back_populates="platforms")
    platform = relationship("Platform", back_populates="product_platforms")


# ❤️ Danh sách sản phẩm yêu thích của người dùng
class FavoriteProduct(Base):
    __tablename__ = "Favorite_Product"
    favorite_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("User.user_id"))
    product_id = Column(Integer, ForeignKey("Product.product_id"))
    added_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="favorites")
    product = relationship("Product", back_populates="favorites")


# 🔍 Lịch sử tìm kiếm sản phẩm
class SearchHistory(Base):
    __tablename__ = "Search_History"
    search_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("User.user_id"))
    query = Column(String(255))
    search_time = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="search_history")
