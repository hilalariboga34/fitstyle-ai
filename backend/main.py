from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database import get_db_session, engine, Base
from models import Product as ProductModel, User as UserModel, Favorite as FavoriteModel
from schemas import Product
from ai_models.kombin_generator import generate_kombin_recipe
from ai_models.kombin_rules import ANAHTAR_KELİMELER, KOMBİN_KURALLARI, KATEGORILER, RENK_UYUMU_KURALLARI
from pydantic import BaseModel
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
from typing import Optional

app = FastAPI()

# Password hashing için context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT ayarları
SECRET_KEY = "your-secret-key-here"  # Güvenlik için değiştirin
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# JWT token oluşturma fonksiyonu
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# JWT token'dan kullanıcı alma fonksiyonu
def get_current_user(token: str = Depends(HTTPBearer()), db: Session = Depends(get_db_session)):
    """
    JWT token'dan kullanıcı bilgilerini çıkarır ve veritabanından kullanıcıyı döndürür.
    
    Args:
        token (str): JWT token
        db (Session): SQLAlchemy veritabanı oturumu
        
    Returns:
        UserModel: Mevcut kullanıcı
        
    Raises:
        HTTPException: Token geçersizse veya kullanıcı bulunamazsa
    """
    credentials_exception = HTTPException(
        status_code=401,
        detail="Geçersiz kimlik bilgileri",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Token'ı decode et
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    # Kullanıcıyı veritabanından bul
    user = db.query(UserModel).filter(UserModel.email == email).first()
    if user is None:
        raise credentials_exception
    
    return user

# Password hash'leme fonksiyonları
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# User schemas
class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    email: str

    class Config:
        orm_mode = True

class FavoriteCreate(BaseModel):
    product_id: int

class FavoriteResponse(BaseModel):
    message: str

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

@app.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db_session)):
    """
    Yeni kullanıcı kaydı oluşturur.
    
    Args:
        user (UserCreate): Kullanıcı bilgileri (email, password)
        db (Session): SQLAlchemy veritabanı oturumu
        
    Returns:
        UserResponse: Oluşturulan kullanıcı bilgileri
        
    Raises:
        HTTPException: Email zaten kullanılıyorsa veya başka bir hata olursa
    """
    try:
        # Email'in zaten kullanılıp kullanılmadığını kontrol et
        existing_user = db.query(UserModel).filter(UserModel.email == user.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Bu email adresi zaten kullanılıyor")
        
        # Şifreyi hash'le
        hashed_password = get_password_hash(user.password)
        
        # Yeni kullanıcı oluştur
        new_user = UserModel(
            email=user.email,
            hashed_password=hashed_password
        )
        
        # Veritabanına kaydet
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return new_user
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Kayıt işlemi başarısız: {str(e)}")

@app.post("/login", response_model=Token)
def login(user_credentials: UserLogin, db: Session = Depends(get_db_session)):
    """
    Kullanıcı girişi yapar ve JWT token döndürür.
    
    Args:
        user_credentials (UserLogin): Kullanıcı giriş bilgileri (email, password)
        db (Session): SQLAlchemy veritabanı oturumu
        
    Returns:
        Token: JWT access token
        
    Raises:
        HTTPException: Email veya şifre yanlışsa
    """
    try:
        # Kullanıcıyı email ile bul
        user = db.query(UserModel).filter(UserModel.email == user_credentials.email).first()
        
        if not user:
            raise HTTPException(status_code=401, detail="Email veya şifre yanlış")
        
        # Şifreyi doğrula
        if not verify_password(user_credentials.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Email veya şifre yanlış")
        
        # JWT token oluştur
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        
        return {"access_token": access_token, "token_type": "bearer"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Giriş işlemi başarısız: {str(e)}")

@app.post("/favorites", response_model=FavoriteResponse)
def add_to_favorites(
    favorite: FavoriteCreate, 
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """
    Kullanıcının favorilerine ürün ekler.
    
    Args:
        favorite (FavoriteCreate): Eklenecek ürün bilgileri (product_id)
        current_user (UserModel): JWT token'dan alınan mevcut kullanıcı
        db (Session): SQLAlchemy veritabanı oturumu
        
    Returns:
        FavoriteResponse: Başarı mesajı
        
    Raises:
        HTTPException: Ürün bulunamazsa veya zaten favorilerde varsa
    """
    try:
        # Ürünün var olup olmadığını kontrol et
        product = db.query(ProductModel).filter(ProductModel.id == favorite.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Ürün bulunamadı")
        
        # Ürünün zaten favorilerde olup olmadığını kontrol et
        existing_favorite = db.query(FavoriteModel).filter(
            FavoriteModel.user_id == current_user.id,
            FavoriteModel.product_id == favorite.product_id
        ).first()
        
        if existing_favorite:
            raise HTTPException(status_code=400, detail="Bu ürün zaten favorilerinizde")
        
        # Yeni favori kaydı oluştur
        new_favorite = FavoriteModel(
            user_id=current_user.id,
            product_id=favorite.product_id
        )
        
        # Veritabanına kaydet
        db.add(new_favorite)
        db.commit()
        
        return {"message": "Ürün favorilere eklendi"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Favori ekleme işlemi başarısız: {str(e)}")

@app.get("/favorites", response_model=List[Product])
def get_favorites(
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """
    Kullanıcının favori ürünlerini döndürür.
    
    Args:
        current_user (UserModel): JWT token'dan alınan mevcut kullanıcı
        db (Session): SQLAlchemy veritabanı oturumu
        
    Returns:
        List[Product]: Kullanıcının favori ürünlerinin listesi
    """
    try:
        # Kullanıcının favori ürünlerini join ile çek
        favorites = db.query(ProductModel).join(
            FavoriteModel, ProductModel.id == FavoriteModel.product_id
        ).filter(
            FavoriteModel.user_id == current_user.id
        ).all()
        
        return favorites
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Favori ürünler alınırken hata: {str(e)}")

@app.delete("/favorites/{product_id}")
def remove_from_favorites(
    product_id: int,
    current_user: UserModel = Depends(get_current_user),
    db: Session = Depends(get_db_session)
):
    """
    Kullanıcının favorilerinden ürün siler.
    
    Args:
        product_id (int): Silinecek ürünün ID'si
        current_user (UserModel): JWT token'dan alınan mevcut kullanıcı
        db (Session): SQLAlchemy veritabanı oturumu
        
    Returns:
        dict: Başarı mesajı
        
    Raises:
        HTTPException: Ürün favorilerde bulunamazsa
    """
    try:
        # Kullanıcının bu ürünü favorilerde olup olmadığını kontrol et
        favorite = db.query(FavoriteModel).filter(
            FavoriteModel.user_id == current_user.id,
            FavoriteModel.product_id == product_id
        ).first()
        
        if not favorite:
            raise HTTPException(status_code=404, detail="Bu ürün favorilerinizde bulunamadı")
        
        # Favori kaydını sil
        db.delete(favorite)
        db.commit()
        
        return {"message": "Ürün favorilerden silindi"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Favori silme işlemi başarısız: {str(e)}")

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
