# routers/favorites.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, auth
from database import get_db
from typing import List

router = APIRouter()

@router.post("/favorites")
def add_favorite(fav: schemas.FavoriteCreate, token: str, db: Session = Depends(get_db)):
    username = auth.decode_token(token)
    user = db.query(models.User).filter_by(username=username).first()
    favorite = models.FavoriteProduct(user_id=user.user_id, product_id=fav.product_id)
    db.add(favorite)
    db.commit()
    return {"msg": "Added to favorites"}

@router.get("/favorites", response_model=List[schemas.ProductOut])
def get_favorites(token: str, db: Session = Depends(get_db)):
    username = auth.decode_token(token)
    user = db.query(models.User).filter_by(username=username).first()
    favs = db.query(models.FavoriteProduct).filter_by(user_id=user.user_id).all()
    product_ids = [f.product_id for f in favs]
    return db.query(models.Product).filter(models.Product.product_id.in_(product_ids)).all()

@router.delete("/favorites/{product_id}")
def remove_favorite(product_id: int, token: str, db: Session = Depends(get_db)):
    username = auth.decode_token(token)
    user = db.query(models.User).filter_by(username=username).first()
    fav = db.query(models.FavoriteProduct).filter_by(user_id=user.user_id, product_id=product_id).first()
    if fav:
        db.delete(fav)
        db.commit()
    return {"msg": "Removed"}
