from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session, joinedload
from models.product import ProductPlatform, Product
from schemas.schemas import ProductPlatformCreate, ProductPlatformOut, ProductCreate, ProductOut
from database.db import get_db

router = APIRouter(prefix="/product-platforms", tags=["ProductPlatform"])

# 🔹 Tạo mới
@router.post("/", response_model=ProductPlatformOut)
def create_product_platform(data: ProductPlatformCreate, db: Session = Depends(get_db)):
    pp = ProductPlatform(**data.dict())
    db.add(pp)
    db.commit()
    db.refresh(pp)
    return pp

# 🔹 Lấy tất cả (gồm cả quan hệ product & platform)
@router.get("/", response_model=list[ProductPlatformOut])
def get_all(db: Session = Depends(get_db)):
    return db.query(ProductPlatform).options(
        joinedload(ProductPlatform.product),
        joinedload(ProductPlatform.platform)
    ).all()

# 🔹 Lấy theo ID
@router.get("/{id}", response_model=ProductPlatformOut)
def get_by_id(id: int, db: Session = Depends(get_db)):
    pp = db.query(ProductPlatform).options(
        joinedload(ProductPlatform.product),
        joinedload(ProductPlatform.platform)
    ).get(id)
    if not pp:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm nền tảng")
    return pp

# 🔹 Cập nhật ProductPlatform
@router.put("/{id}", response_model=ProductPlatformOut)
def update(id: int, data: ProductPlatformCreate, db: Session = Depends(get_db)):
    pp = db.query(ProductPlatform).get(id)
    if not pp:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm nền tảng")
    for key, value in data.dict().items():
        setattr(pp, key, value)
    db.commit()
    db.refresh(pp)
    return pp

# 🔹 Xoá
@router.delete("/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    pp = db.query(ProductPlatform).get(id)
    if not pp:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm nền tảng")
    db.delete(pp)
    db.commit()
    return {"detail": "Đã xoá"}

