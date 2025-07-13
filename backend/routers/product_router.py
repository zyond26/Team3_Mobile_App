# routes/products.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.category import Category
from database.db import get_db
from models.product import Product, ProductPlatform
from sqlalchemy.orm import joinedload
import models.product
import models, schemas
from typing import List
from sqlalchemy import func
from fastapi import HTTPException
from schemas.schemas import ProductCreate, ProductInfo, ProductPlatformCreate, ProductPlatformInfo

import schemas.schemas

router = APIRouter()

@router.get("/products/by-category/{category_id}")
def get_products_by_category(category_id: int, db: Session = Depends(get_db)):
    results = (
        db.query(Product, ProductPlatform)
        .join(ProductPlatform, Product.product_id == ProductPlatform.product_id)
        .filter(Product.category_id == category_id)
        .all()
    )

    return [
        {
            "product_id": product.product_id,
            "name": product.name,
            "image_url": product.image_url,
            "price": pp.price,
            "discount": pp.discount,
            "platform": pp.platform.name,
            "logo_url": pp.platform.logo_url,
            "shipping_fee": pp.shipping_fee,
            "product_platform_id": pp.product_platform_id
        }
        for product, pp in results
    ]

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@router.get("/products/{product_id}/compare")
def compare_product(product_id: int, db: Session = Depends(get_db)):
    results = (
        db.query(Product, ProductPlatform)
        .join(ProductPlatform, Product.product_id == ProductPlatform.product_id)
        .filter(Product.product_id == product_id)
        .all()
    )
    return [
        {
            "platform": platform.platform.name,
            "logo_url": platform.platform.logo_url,
            "price": platform.price,
            "discount": platform.discount,
            "discount_percentage": platform.discount_percentage,
            "rating": platform.rating,
            "review_count": platform.review_count,
            "shipping_fee": platform.shipping_fee,
            "estimated_delivery_time": platform.estimated_delivery_time,
            "is_official": platform.is_official,
            "product_url": platform.product_url,
            "image_url": product.image_url 
        }
        for product, platform in results
    ]

# @router.get("/search", response_model=List[schemas.schemas.ProductOut])
# def search_products(keyword: str, db: Session = Depends(get_db)):
#     keywords = keyword.strip().lower().split()
#     query = db.query(Product) 

#     for kw in keywords:
#         query = query.filter(func.lower(Product.name).like(f"%{kw}%"))

#     return query.all()

@router.get("/search", response_model=List[ProductInfo])
def search_products(keyword: str, db: Session = Depends(get_db)):
    keywords = keyword.strip().lower().split()

    products_query = db.query(Product).options(
        joinedload(Product.product_platforms).joinedload(ProductPlatform.platform)
    )

    for kw in keywords:
        products_query = products_query.filter(func.lower(Product.name).like(f"%{kw}%"))

    results = []
    for product in products_query.all():
        result = ProductInfo.from_orm(product)
        result.product_platforms = [
            ProductPlatformInfo.from_orm(pf) for pf in product.product_platforms
        ]
        results.append(result)

    return results


@router.post("/admin/products")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = Product(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.post("/admin/products/platform")
def create_product_platform(data: ProductPlatformCreate, db: Session = Depends(get_db)):
    # Kiểm tra tồn tại
    if not db.query(Product).filter_by(product_id=data.product_id).first():
        raise HTTPException(status_code=404, detail="Product not found")
    if not db.query(models.product.Platform).filter_by(platform_id=data.platform_id).first():
        raise HTTPException(status_code=404, detail="Platform not found")

    db_product_platform = ProductPlatform(**data.dict())
    db.add(db_product_platform)
    db.commit()
    db.refresh(db_product_platform)
    return db_product_platform

