# routers/favorite_router.py

from typing import List
from fastapi import APIRouter, Body, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.db import get_db
from models.favorite_product import FavoriteProduct
from models.product import Product  # nếu cần kiểm tra tồn tại
from schemas.schemas import FavoriteProductResponse, FavoriteCreate

router = APIRouter(prefix="/favorites", tags=["Favorites"])

# ✅ Thêm sản phẩm vào yêu thích
# @router.post("/add", status_code=status.HTTP_201_CREATED)
# def add_to_favorites(fav: FavoriteCreate, db: Session = Depends(get_db)):
#     exists = db.query(FavoriteProduct).filter_by(
#         user_id=fav.user_id,
#         product_id=fav.product_id
#     ).first()

#     if exists:
#         raise HTTPException(status_code=400, detail="Sản phẩm đã có trong yêu thích")

#     new_fav = FavoriteProduct(user_id=fav.user_id, product_id=fav.product_id)
#     db.add(new_fav)
#     db.commit()
#     db.refresh(new_fav)
#     return {"message": "Đã thêm vào yêu thích", "favorite_id": new_fav.favorite_id}

@router.post("/add", status_code=status.HTTP_201_CREATED)
def add_to_favorites(fav: FavoriteCreate, db: Session = Depends(get_db)):
    exists = db.query(FavoriteProduct).filter_by(
        user_id=fav.user_id,
        product_platform_id=fav.product_platform_id
    ).first()

    if exists:
        raise HTTPException(status_code=400, detail="Sản phẩm đã có trong yêu thích")

    new_fav = FavoriteProduct(
        user_id=fav.user_id,
        product_id=fav.product_id,  # thêm dòng này
        product_platform_id=fav.product_platform_id
    )
    db.add(new_fav)
    db.commit()
    db.refresh(new_fav)
    return {"message": "Đã thêm vào yêu thích", "favorite_id": new_fav.favorite_id}

# ❌ Xóa sản phẩm khỏi yêu thích
# @router.delete("/remove", status_code=status.HTTP_200_OK)
# def remove_from_favorites(fav: FavoriteCreate, db: Session = Depends(get_db)):
#     favorite = db.query(FavoriteProduct).filter_by(
#         user_id=fav.user_id,
#         product_id=fav.product_id,
#         product_platform_id=fav.product_platform_id 
#     ).first()

#     if not favorite:
#         raise HTTPException(status_code=404, detail="Không tìm thấy yêu thích để xóa")

#     db.delete(favorite)
#     db.commit()
#     return {"message": "Đã xóa khỏi yêu thích"}

@router.delete("/remove", status_code=status.HTTP_200_OK)
def remove_from_favorites(
    user_id: int,
    product_id: int,
    product_platform_id: int,
    db: Session = Depends(get_db)
):
    favorite = db.query(FavoriteProduct).filter_by(
        user_id=user_id,
        product_id=product_id,
        product_platform_id=product_platform_id
    ).first()

    if not favorite:
        raise HTTPException(status_code=404, detail="Không tìm thấy yêu thích để xóa")

    db.delete(favorite)
    db.commit()
    return {"message": "Đã xóa khỏi yêu thích"}

# 🔍 Lấy danh sách yêu thích theo user_id
@router.get("/user/{user_id}", response_model=List[FavoriteProductResponse])
def get_favorites_by_user(user_id: int, db: Session = Depends(get_db)):
    favorites = db.query(FavoriteProduct).filter(FavoriteProduct.user_id == user_id).all()
    return favorites


