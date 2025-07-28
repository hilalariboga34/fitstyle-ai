from fastapi import FastAPI, Depends
from typing import List
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Product as ProductModel
from schemas import Product

app = FastAPI()

def get_db():
    """
    Veritabanı bağlantısını yöneten dependency.
    Her endpoint için otomatik olarak oturum açar ve kapatır.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/products", response_model=List[Product])
def get_products(db: Session = Depends(get_db)):
    """
    Veritabanındaki tüm ürünleri döndürür.
    """
    return db.query(ProductModel).all()
