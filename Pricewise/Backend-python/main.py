from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String, DECIMAL, DateTime, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship, declarative_base
from sqlalchemy.sql import func
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# Kết nối database (giữ nguyên)
SQL_SERVER = 'ZYOND\SQLEXPRESS'
DATABASE = 'pricewise'
USERNAME = 'dieu'
PASSWORD = '123'
DRIVER = 'ODBC Driver 17 for SQL Server'

DATABASE_URL = f"mssql+pyodbc://{USERNAME}:{PASSWORD}@{SQL_SERVER}/{DATABASE}?driver={DRIVER.replace(' ', '+')}"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ========== MODELS ==========
class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String(255), index=True)
    product_code = Column(String(100), unique=True)
    description = Column(String(1000))
    category_id = Column(Integer, ForeignKey('categories.id'))
    brand_id = Column(Integer, ForeignKey('brands.id'))
    rating = Column(DECIMAL(3, 2))
    review_count = Column(Integer, default=0)
    is_active = Column(Integer, default=1)
    last_updated = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    variants = relationship("ProductVariant", back_populates="product")
    category = relationship("Category")
    brand = relationship("Brand")

class ProductVariant(Base):
    __tablename__ = "product_variants"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey('products.id'))
    ecom_platform = Column(String(50))
    price = Column(DECIMAL(18, 2))
    original_price = Column(DECIMAL(18, 2))
    discount_percent = Column(DECIMAL(5, 2))
    shipping_fee = Column(DECIMAL(18, 2), default=0)
    seller_name = Column(String(255))
    seller_rating = Column(DECIMAL(3, 2))
    product_url = Column(String(2000))
    image_url = Column(String(2000))
    stock_status = Column(String(50), default='InStock')
    last_scraped = Column(DateTime, default=func.now())
    
    # Relationship
    product = relationship("Product", back_populates="variants")
    price_history = relationship("PriceHistory", back_populates="variant")

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    parent_id = Column(Integer, ForeignKey('categories.id'))

class Brand(Base):
    __tablename__ = "brands"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    logo_url = Column(String(2000))

class PriceHistory(Base):
    __tablename__ = "price_history"
    id = Column(Integer, primary_key=True, index=True)
    variant_id = Column(Integer, ForeignKey('product_variants.id'))
    price = Column(DECIMAL(18, 2))
    recorded_at = Column(DateTime, default=func.now())
    
    variant = relationship("ProductVariant", back_populates="price_history")

Base.metadata.create_all(bind=engine)

# ========== SCHEMAS ==========
class ProductVariantBase(BaseModel):
    ecom_platform: str
    price: float
    original_price: Optional[float] = None
    discount_percent: Optional[float] = None
    shipping_fee: float = 0
    seller_name: Optional[str] = None
    seller_rating: Optional[float] = None
    product_url: str
    image_url: Optional[str] = None
    stock_status: str = 'InStock'

class ProductBase(BaseModel):
    product_name: str
    product_code: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    rating: Optional[float] = None
    variants: List[ProductVariantBase] = []

    class Config:
        orm_mode = True

class ProductResponse(ProductBase):
    id: int
    last_updated: datetime
    variants: List[ProductVariantBase] = []

class SearchResult(BaseModel):
    product_name: str
    product_code: str
    variants: List[dict]

# ========== APP ==========
app = FastAPI(title="Pricewise API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========== ENDPOINTS ==========
@app.get("/products/search", response_model=List[SearchResult])
def search_products(name: str = Query(..., description="Tên sản phẩm để tìm kiếm")):
    db = SessionLocal()
    
    # Tìm sản phẩm và các biến thể của nó
    products = db.query(Product).filter(Product.product_name.ilike(f"%{name}%")).all()
    
    if not products:
        db.close()
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    
    results = []
    for product in products:
        variants = []
        for variant in product.variants:
            variants.append({
                "ecom_platform": variant.ecom_platform,
                "price": float(variant.price),
                "original_price": float(variant.original_price) if variant.original_price else None,
                "discount_percent": float(variant.discount_percent) if variant.discount_percent else None,
                "shipping_fee": float(variant.shipping_fee),
                "seller_name": variant.seller_name,
                "product_url": variant.product_url,
                "image_url": variant.image_url,
                "stock_status": variant.stock_status
            })
        
        results.append({
            "product_name": product.product_name,
            "product_code": product.product_code,
            "variants": variants
        })
    
    db.close()
    return results

@app.post("/products", response_model=ProductResponse)
def add_product(product: ProductBase):
    db = SessionLocal()
    
    # Tạo sản phẩm chính
    db_product = Product(
        product_name=product.product_name,
        product_code=product.product_code,
        description=product.description,
        category_id=product.category_id,
        brand_id=product.brand_id,
        rating=product.rating
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    # Thêm các biến thể
    for variant in product.variants:
        db_variant = ProductVariant(
            product_id=db_product.id,
            ecom_platform=variant.ecom_platform,
            price=variant.price,
            original_price=variant.original_price,
            discount_percent=variant.discount_percent,
            shipping_fee=variant.shipping_fee,
            seller_name=variant.seller_name,
            seller_rating=variant.seller_rating,
            product_url=variant.product_url,
            image_url=variant.image_url,
            stock_status=variant.stock_status
        )
        db.add(db_variant)
    
    db.commit()
    db.refresh(db_product)
    db.close()
    
    return db_product

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
    