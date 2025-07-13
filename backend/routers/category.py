from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db import get_db
from models.product import Product, ProductPlatform
from models.category import Category

router = APIRouter()

@router.get("/{category_id}/products")
def get_products_by_category(category_id: int, db: Session = Depends(get_db)):
    products = (
        db.query(Product)
        .join(Category, Product.category_id == Category.category_id)
        .join(ProductPlatform, Product.product_id == ProductPlatform.product_id)
        .filter(Category.category_id == category_id)
        .all()
    )
    result = []
    for product in products:
        result.append({
            "product_id": product.product_id,
            "name": product.name,
            "description": product.description,
            "image_url": product.image_url,
            "price": product.platforms[0].price if product.platforms else None,
            "shipping_fee": product.platforms[0].shipping_fee if product.platforms else None,
            "platform": product.platforms[0].platform.name if product.platforms else None,
        })
    return result
