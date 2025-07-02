# routers/history.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import models, schemas, auth
from database import get_db

router = APIRouter()

@router.post("/history")
def save_search(query: schemas.SearchQuery, token: str, db: Session = Depends(get_db)):
    username = auth.decode_token(token)
    user = db.query(models.User).filter_by(username=username).first()
    item = models.SearchHistory(user_id=user.user_id, query=query.query)
    db.add(item)
    db.commit()
    return {"msg": "Saved"}

@router.get("/history")
def get_history(token: str, db: Session = Depends(get_db)):
    username = auth.decode_token(token)
    user = db.query(models.User).filter_by(username=username).first()
    history = db.query(models.SearchHistory).filter_by(user_id=user.user_id).all()
    return [{"query": h.query, "time": h.search_time} for h in history]
