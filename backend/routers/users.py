from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, auth
from fastapi.responses import JSONResponse
from fastapi import Body

router = APIRouter()

@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Thay print bằng kiểm tra và gửi thông báo qua phản hồi
    if db.query(models.User).filter_by(email=user.email).first():
        raise HTTPException(status_code=400, detail="Email đã tồn tại, vui lòng sử dụng email khác.")
    db_user = models.User(
        username=user.username,
        email=user.email if user.email else None,
        full_name=user.full_name if user.full_name else None,
        phone_number=user.phone_number if user.phone_number else None,
        address=user.address if user.address else None,
        password_hash=auth.hash_password(user.password)
    )
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return {"msg": "Tạo tài khoản thành công", "user_id": db_user.user_id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=422, detail=f"Lỗi khi tạo tài khoản: {str(e)}")

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    # Thay print bằng kiểm tra và gửi thông báo qua phản hồi
    db_user = db.query(models.User).filter_by(email=user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Sai email hoặc mật khẩu, vui lòng kiểm tra lại.")
    token = auth.create_token({"sub": db_user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": db_user.user_id,
        "msg": "Đăng nhập thành công"  # Thêm thông báo thành công
    }
# Lấy thông tin user
@router.get("/api/getUserInfo")
def get_user_info(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông tin người dùng.")
    return db_user

# Thêm sản phẩm yêu thích
class FavoriteCreate(BaseModel):
    product_id: int

@router.post("/api/favorite")
def add_favorite(favorite: FavoriteCreate, user_id: int, db: Session = Depends(get_db)):
    print("RECEIVED product_id:", favorite.product_id)
    print("RECEIVED user_id:", user_id)
    db_user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại.")

    db_product = db.query(models.Product).filter(models.Product.product_id == favorite.product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Sản phẩm không tồn tại.")

    existing_favorite = db.query(models.FavoriteProduct).filter_by(user_id=user_id, product_id=favorite.product_id).first()
    if existing_favorite:
        raise HTTPException(status_code=400, detail="Sản phẩm đã được yêu thích.")

    new_favorite = models.FavoriteProduct(user_id=user_id, product_id=favorite.product_id, added_at=datetime.utcnow())
    db.add(new_favorite)

    try:
        db.commit()
        return {"msg": "Thêm sản phẩm yêu thích thành công", "favorite_id": new_favorite.favorite_id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Lỗi khi thêm sản phẩm yêu thích: {str(e)}")

@router.get("/api/getFavorites")
def get_favorites(user_id: int, db: Session = Depends(get_db)):
    favorites = db.query(models.FavoriteProduct).filter(models.FavoriteProduct.user_id == user_id).all()
    result = []
    for fav in favorites:
        product = db.query(models.Product).filter(models.Product.product_id == fav.product_id).first()
        if product:
            result.append({
                "product": {
                    "image_url": product.image_url,
                    "name": product.name
                },
                "price": next((pp.price for pp in product.platforms if pp.price), 0)  # Giả định lấy giá từ Product_Platform
            })
    return result

@router.delete("/api/removeFavorite")
def remove_favorite(user_id: int, product_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại.")
    favorite = db.query(models.FavoriteProduct).filter_by(user_id=user_id, product_id=product_id).first()
    if not favorite:
        raise HTTPException(status_code=404, detail="Sản phẩm không nằm trong danh sách yêu thích.")
    db.delete(favorite)
    db.commit()
    return {"msg": "Xóa sản phẩm yêu thích thành công"}

UNEDITABLE_FIELDS = {'user_id', 'username', 'email', 'created_at', 'password_hash'}

@router.put("/users/{user_id}")
def update_user(user_id: int, user_data: dict = Body(...), db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại.")

    updated_fields = []
    for field, value in user_data.items():
        if field in UNEDITABLE_FIELDS:
            print(f"⚠️ Bỏ qua field không thể chỉnh sửa: {field}")
            continue
        if hasattr(db_user, field):
            setattr(db_user, field, value)
            updated_fields.append(field)

    try:
        db.commit()
        db.refresh(db_user)
        return {"msg": "Cập nhật thành công", "updated_fields": updated_fields}
    except Exception as e:
        db.rollback()
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Lỗi khi cập nhật: {str(e)}")
    
@router.post("/api/History")
def save_search_history(user_id: int, keyword: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại.")

    new_history = models.SearchHistory(
        user_id=user_id,
        keyword=keyword,
        searched_at=datetime.utcnow()
    )
    db.add(new_history)
    db.commit()
    return {"msg": "Đã lưu lịch sử tìm kiếm"}
