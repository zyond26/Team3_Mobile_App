# routers/platforms.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models

router = APIRouter()

@router.get("/products/{product_id}/platforms")
def get_prices(product_id: int, db: Session = Depends(get_db)):
    results = db.query(models.Product_Platform).filter_by(product_id=product_id).all()
    if not results:
        raise HTTPException(status_code=404, detail="No pricing info")
    return results