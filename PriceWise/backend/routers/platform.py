from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models.platform import Platform
from schemas.schemas import PlatformOut
from database.db import get_db

router = APIRouter(prefix="/platforms", tags=["Platform"])

@router.get("/", response_model=list[PlatformOut])
def get_platforms(db: Session = Depends(get_db)):
    return db.query(Platform).all()
