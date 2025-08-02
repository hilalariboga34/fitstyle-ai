from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database import get_db_session, engine, Base
from models import Product as ProductModel
from schemas import Product
from ai_models.kombin_generator import generate_kombin_recipe
from ai_models.kombin_rules import ANAHTAR_KELİMELER, KOMBİN_KURALLARI, KATEGORILER, RENK_UYUMU_KURALLARI
from pydantic import BaseModel

app = FastAPI()

# CORS middleware ekle
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Frontend URL'leri
    allow_credentials=True,
    allow_methods=["*"],  # Tüm HTTP metodlarına izin ver
    allow_headers=["*"],  # Tüm header'lara izin ver
)

# Veritabanı tablolarını oluştur
Base.metadata.create_all(bind=engine)

# Test verileri ekle
def add_test_data():
    db = next(get_db_session())
    try:
        # Eğer ürün yoksa test verileri ekle
        if db.query(ProductModel).count() == 0:
            test_products = [
                ProductModel(
                    name="Klasik Beyaz Gömlek",
                    description="Klasik kesim beyaz gömlek, ofis ve günlük kullanım için ideal",
                    price=150.0,
                    category="Gömlek"
                ),
                ProductModel(
                    name="Siyah Kot Pantolon",
                    description="Rahat kesim siyah kot pantolon, her türlü kombin için uygun",
                    price=200.0,
                    category="Pantolon"
                ),
                ProductModel(
                    name="Mavi Blazer Ceket",
                    description="Şık mavi blazer ceket, resmi ve yarı resmi ortamlar için",
                    price=350.0,
                    category="Ceket"
                ),
                ProductModel(
                    name="Kırmızı Elbise",
                    description="Göz alıcı kırmızı elbise, özel günler için mükemmel",
                    price=280.0,
                    category="Elbise"
                )
            ]
            db.add_all(test_products)
            db.commit()
            print("Test verileri eklendi!")
        else:
            print("Test verileri zaten mevcut!")
    except Exception as e:
        print(f"Test verileri eklenirken hata: {e}")
    finally:
        db.close()

# Uygulama başladığında test verilerini ekle
@app.on_event("startup")
async def startup_event():
    print("Uygulama başlatılıyor...")
    add_test_data()

@app.get("/test")
def test_endpoint():
    """Test endpoint'i - veritabanı bağlantısını kontrol eder"""
    db = next(get_db_session())
    try:
        count = db.query(ProductModel).count()
        return {"message": f"Veritabanında {count} ürün var"}
    except Exception as e:
        return {"error": str(e)}
    finally:
        db.close()

@app.post("/add-test-data")
def add_test_data_endpoint():
    """Manuel olarak test verilerini ekler"""
    try:
        add_test_data()
        return {"message": "Test verileri eklendi!"}
    except Exception as e:
        return {"error": str(e)}

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
        intent_result = generate_kombin_recipe(
            cumle=request.text,
            anahtar_kelimeler_dict=ANAHTAR_KELİMELER,
            kombin_kurallari_dict=KOMBİN_KURALLARI,
            kategoriler_dict=KATEGORILER,
            renk_uyumu_dict=RENK_UYUMU_KURALLARI,
            cinsiyet="kadin"  # Varsayılan olarak kadın
        )
        
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
