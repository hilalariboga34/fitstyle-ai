from fastapi import FastAPI, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database import get_db_session  # Refactor: get_db yerine get_db_session kullanılıyor
from models import Product as ProductModel
from schemas import Product
from ai_models.intent_analyzer import analyze_prompt_intent
from pydantic import BaseModel

app = FastAPI()

# Request model for /recommend endpoint
class RecommendationRequest(BaseModel):
    """
    /recommend endpoint'i için gelen JSON isteğinin şeması.
    """
    text: str  # Kullanıcının girdiği metin

@app.get("/products", response_model=List[Product])
def get_products(db: Session = Depends(get_db_session)):
    """
    Veritabanındaki tüm ürünleri döndürür.
    Args:
        db (Session): SQLAlchemy veritabanı oturumu (dependency injection ile gelir)
    Returns:
        List[Product]: Tüm ürünlerin listesi
    """
    # Tüm ürünleri sorgula ve döndür
    return db.query(ProductModel).all()

@app.post("/recommend", response_model=List[Product])
def recommend_products(request: RecommendationRequest, db: Session = Depends(get_db_session)):
    """
    Kullanıcı metnine göre ürün önerisi yapar.
    
    Args:
        request (RecommendationRequest): Kullanıcının girdiği metin
        db (Session): SQLAlchemy veritabanı oturumu
        
    Returns:
        List[Product]: Önerilen ürünlerin listesi
        
    Raises:
        HTTPException: Metin analizi başarısız olursa
    """
    try:
        # Kullanıcı metninden stil ve tür etiketlerini çıkar
        intent_result = analyze_prompt_intent(request.text)
        
        # Çıkarılan etiketleri birleştir (stil + tür)
        search_terms = []
        search_terms.extend(intent_result.get('style', []))
        search_terms.extend(intent_result.get('type', []))
        
        # Eğer hiç etiket bulunamadıysa, tüm ürünleri döndür
        if not search_terms:
            return db.query(ProductModel).all()
        
        # Veritabanında description sütununda ILIKE sorgusu yap
        # Her bir etiket için OR koşulu kullan
        query = db.query(ProductModel)
        
        # ILIKE sorgularını oluştur (büyük/küçük harf duyarsız)
        ilike_conditions = []
        for term in search_terms:
            ilike_conditions.append(ProductModel.description.ilike(f'%{term}%'))
        
        # Tüm koşulları OR ile birleştir
        if ilike_conditions:
            query = query.filter(or_(*ilike_conditions))
        
        # Filtrelenmiş ürünleri döndür
        recommended_products = query.all()
        
        return recommended_products
        
    except Exception as e:
        # Hata durumunda 500 hatası döndür
        raise HTTPException(status_code=500, detail=f"Ürün önerisi oluşturulurken hata: {str(e)}")
