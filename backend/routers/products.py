# routers/products.py
from sqlalchemy.orm import joinedload
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from typing import List
from sqlalchemy import func

router = APIRouter()

@router.get("/products", response_model=List[schemas.ProductOut])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product)\
        .options(
            joinedload(models.Product.platforms).joinedload(models.Product_Platform.platform)
        )\
        .all()

@router.get("/search", response_model=List[schemas.ProductOut])
def search_products(keyword: str, db: Session = Depends(get_db)):
    keywords = keyword.strip().lower().split()
    query = db.query(models.Product)

    for kw in keywords:
        query = query.filter(func.lower(models.Product.name).like(f"%{kw}%"))

    return query.all()

from fastapi import HTTPException

@router.post("/favorites/{user_id}/{product_id}")
def add_to_favorites(user_id: int, product_id: int, db: Session = Depends(get_db)):
    existing = db.query(models.FavoriteProduct).filter_by(user_id=user_id, product_id=product_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Đã thêm vào yêu thích")

    fav = models.FavoriteProduct(user_id=user_id, product_id=product_id)
    db.add(fav)
    db.commit()
    return {"message": "Đã thêm vào yêu thích"}

@router.get("/favorites/{user_id}", response_model=List[schemas.ProductOut])
def get_favorites(user_id: int, db: Session = Depends(get_db)):
    favs = db.query(models.FavoriteProduct).filter_by(user_id=user_id).all()
    return [fav.product for fav in favs]




