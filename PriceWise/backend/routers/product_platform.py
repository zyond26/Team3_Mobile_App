from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db import get_db
from models.product import ProductPlatform, Product
from schemas.schemas import ProductCardOut
from models.platform import Platform

router = APIRouter()

@router.get("/api/products", response_model=list[ProductCardOut])
def get_product_cards(db: Session = Depends(get_db)):
    results = db.query(ProductPlatform).join(Product).join(Platform).all()

    product_cards = []
    for item in results:
        product = item.product
        platform = item.platform

        product_cards.append(ProductCardOut(
            productId=product.product_id,                    
            productPlatformId=item.product_platform_id,                 
            platformLogo=platform.logo_url or "",
            productImage=product.image_url or "",
            currentPrice=f"{item.price:,.0f} đ",
            originalPrice=f"{item.price + (item.discount or 0):,.0f} đ" if item.discount else "",
            discountPercentage=f"-{int(item.discount_percentage)}%" if item.discount_percentage else "",
            shippingFee=f"{item.shipping_fee:,.0f} đ" if item.shipping_fee else "0 đ",
            totalPrice=f"{item.price + (item.shipping_fee or 0):,.0f} đ",
            isAvailable=True,
            rating=f"{item.rating:.1f} ({item.review_count} đánh giá)" if item.rating else "Chưa có đánh giá",
            productUrl=item.product_url or "#"
        ))

    return product_cards
