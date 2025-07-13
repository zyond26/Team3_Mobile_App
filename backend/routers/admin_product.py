from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from models.product import Product
from schemas.schemas import ProductCreate, ProductOut
from database.db import get_db

router = APIRouter(prefix="/products", tags=["Product"])

# 🔹 Lấy 1 sản phẩm
@router.get("/{id}", response_model=ProductOut)
def get_product(id: int, db: Session = Depends(get_db)):
    product = db.query(Product).get(id)
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    return product

# 🔹 Cập nhật sản phẩm
@router.put("/{id}", response_model=ProductOut)
def update_product(id: int, data: ProductCreate, db: Session = Depends(get_db)):
    product = db.query(Product).get(id)
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm")
    for key, value in data.dict().items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product

# 🔹 Tạo sản phẩm mới
@router.post("/", response_model=ProductOut)
def create_product(data: ProductCreate, db: Session = Depends(get_db)):
    new_product = Product(**data.dict())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product
