from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from models.search_history import SearchHistory
from schemas.schemas import SearchHistoryCreate, SearchHistoryOut

router = APIRouter(prefix="/search-history", tags=["Search History"])

@router.post("/", response_model=SearchHistoryOut)
def create_search_history(data: SearchHistoryCreate, db: Session = Depends(get_db)):
    record = SearchHistory(**data.dict())
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/user/{user_id}", response_model=list[SearchHistoryOut])
def get_user_search_history(user_id: int, db: Session = Depends(get_db)):
    return db.query(SearchHistory).filter(SearchHistory.user_id == user_id).order_by(SearchHistory.search_time.desc()).all()

@router.delete("/search-history/user/{user_id}")
def delete_search_history(user_id: int, db: Session = Depends(get_db)):
    db.query(SearchHistory).filter(SearchHistory.user_id == user_id).delete()
    db.commit()
    return {"message": "Đã xóa lịch sử tìm kiếm"}

