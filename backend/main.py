from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordRequestForm
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import or_  # Bu satır önemli
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
import logging # Loglama için eklendi

# Basit bir loglama yapılandırması
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


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
    credentials_exception = HTTPException(
        status_code=401,
        detail="Geçersiz kimlik bilgileri",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
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
        from_attributes = True

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
        if db.query(ProductModel).count() == 0:
            test_products = [
                ProductModel(
                    name="Klasik Beyaz Gömlek",
                    description="Klasik kesim beyaz gömlek, ofis ve günlük kullanım için ideal",
                    price=150.0,
                    category="Gömlek",
                    image_url="https://i.pinimg.com/474x/29/37/56/293756786197dce80c9e2dadfbb63a31.jpg"
                ),
                ProductModel(
                    name="Siyah Kot Pantolon",
                    description="Rahat kesim siyah kot pantolon, her türlü kombin için uygun",
                    price=200.0,
                    category="Pantolon",
                    image_url="https://d1fufvy4xao6k9.cloudfront.net/feed/img/man_jeans/217871/front.png"
                ),
                ProductModel(
                    name="Mavi Blazer Ceket",
                    description="Şık mavi blazer ceket, resmi ve yarı resmi ortamlar için",
                    price=350.0,
                    category="Ceket",
                    image_url="https://i.pinimg.com/736x/70/45/64/704564ceb308951c8a2d4de83f8eda9c.jpg"
                ),
                ProductModel(
                    name="Kırmızı Elbise",
                    description="Göz alıcı kırmızı elbise, özel günler için mükemmel",
                    price=280.0,
                    category="Elbise",
                    image_url="https://png.pngtree.com/png-clipart/20190906/original/pngtree-red-dress-clothing-png-image_4548315.jpg"
                ),
                ProductModel(
                    name="Gri Triko Kazak",
                    description="Sıcak ve şık gri triko kazak, kış ayları için ideal",
                    price=120.0,
                    category="Kazak",
                    image_url="https://assets.theplace.com/image/upload/t_pdp_img_m,f_auto,q_auto/v1/ecom/assets/products/snj/3048615/3048615_1362.png"
                ),
                ProductModel(
                    name="Bej Deri Ceket",
                    description="Vintage tarz bej deri ceket, casual kombinler için",
                    price=450.0,
                    category="Ceket",
                    image_url="https://d3lazpv835634a.cloudfront.net/product-media/45ZU/1005/1985/Persueder-Champagne-Faux-Suede-Biker-Jacket-Champagne.jpg"
                ),
                ProductModel(
                    name="Siyah Mini Etek",
                    description="Klasik siyah mini etek, her yaş grubu için uygun",
                    price=180.0,
                    category="Etek",
                    image_url="https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTExL3Jhd3BpeGVsX29mZmljZV8yNV9sZWF0aGVyX21pbmlfc2tpcnRfaXNvbGF0ZWRfd2hpdGVfYmFja2dyb3VuZF82OGE1ZmEyNS1mY2NmLTQwYmItYWQzNi1mMDMwYmRhMTYzY2YucG5n.png"
                ),
                ProductModel(
                    name="Beyaz Sneaker",
                    description="Rahat ve şık beyaz sneaker, günlük kullanım için",
                    price=220.0,
                    category="Sneaker",
                    image_url="https://d1fufvy4xao6k9.cloudfront.net/feed/img/man_sneaker/1050847/side.png"
                ),
                ProductModel(
                    name="Mavi Gömlek",
                    description="Açık mavi gömlek, ofis ve günlük kombinler için",
                    price=140.0,
                    category="Gömlek",
                    image_url="https://png.pngtree.com/png-vector/20241001/ourmid/pngtree-modern-blue-shirt-png-image_13996708.png"
                ),
                ProductModel(
                    name="Siyah Deri Çanta",
                    description="Elegant siyah deri çanta, her kombinle uyumlu",
                    price=320.0,
                    category="Çanta",
                    image_url="https://burkely.com/en/wp-content/uploads/2025/02/1001111.65.10_2_STRA-455x500.png"
                ),
                ProductModel(
                    name="Pembe Bluz",
                    description="Pastel pembe bluz, bahar ayları için ideal",
                    price=95.0,
                    category="Bluz",
                    image_url="https://www.rinascimento.com/media/catalog/product/c/f/c/0/CFC0122867003B528_det_4_03280220.jpg"
                ),
                ProductModel(
                    name="Kahverengi Deri Ayakkabı",
                    description="Klasik kahverengi deri ayakkabı, resmi ortamlar için",
                    price=280.0,
                    category="Ayakkabı",
                    image_url="https://cdn1.incorio.com/4673-large_default/arthur-cognac-leather-leather-sole.jpg"
                ),
                ProductModel(
                    name="Siyah Triko Hırka",
                    description="Sıcak siyah triko hırka, soğuk havalar için",
                    price=160.0,
                    category="Hırka",
                    image_url="https://media.high-everydaycouture.com/media/catalog/product/S/5/S5518390W98-199_999_2.png"
                ),
                ProductModel(
                    name="Beyaz Elbise",
                    description="Minimalist beyaz elbise, yaz ayları için ideal",
                    price=240.0,
                    category="Elbise",
                    image_url="https://e7.pngegg.com/pngimages/242/176/png-clipart-wedding-dress-sleeve-white-gown-first-communion-white-child-thumbnail.png"
                ),
                ProductModel(
                    name="Gri Pantolon",
                    description="Slim fit gri pantolon, ofis kombinleri için",
                    price=190.0,
                    category="Pantolon",
                    image_url="https://assets.riani.com/media/36/a0/d1/1721037807/473310-004272-912-2.1.png"
                ),
                ProductModel(
                    name="Kırmızı Triko Kazak",
                    description="Canlı kırmızı triko kazak, kış ayları için",
                    price=110.0,
                    category="Kazak",
                    image_url="https://static.vecteezy.com/system/resources/previews/055/778/982/non_2x/red-cable-knit-sweater-long-sleeves-winter-fashion-png.png"
                ),
                ProductModel(
                    name="Siyah Crop Top",
                    description="Modern siyah crop top, yaz kombinleri için",
                    price=85.0,
                    category="Üst Giyim",
                    image_url="https://www.bubago.com/image/cache/data/resimler/casall-comfort-crop-top-siyah-513-550x550h.png"
                ),
                ProductModel(
                    name="Mavi Kot Şort",
                    description="Rahat mavi kot şort, yaz ayları için ideal",
                    price=130.0,
                    category="Şort",
                    image_url="https://w7.pngwing.com/pngs/710/614/png-transparent-denim-jeans-shorts-paper-jeans-textile-fashion-active-shorts.png"
                ),
                ProductModel(
                    name="Pembe Triko Hırka",
                    description="Pastel pembe triko hırka, bahar ayları için",
                    price=170.0,
                    category="Hırka",
                    image_url="https://m.media-amazon.com/images/I/71LabRtn7FL._AC_SY445_.jpg"
                ),
                ProductModel(
                    name="Siyah Platform Ayakkabı",
                    description="Şık siyah platform ayakkabı, özel günler için",
                    price=290.0,
                    category="Ayakkabı",
                    image_url="https://d2q7r0rjkm1t8k.cloudfront.net/uplister/images/2a99ec674197464a4a00b3a611bd5fcd.png"
                ),
                ProductModel(
                    name="Beyaz Crop Bluz",
                    description="Minimalist beyaz crop bluz, günlük kullanım için",
                    price=75.0,
                    category="Bluz",
                    image_url="https://www.casall.com/storage/5FB479B7E91382931CEE7E0C3E2263DC904E8D9AFE77DB2593CB2A495F8183EE/38d6ad099e84490b8623517a38d0cf6d/png/media/67a1cf594c0a4fe3a957bcc90297bb93/22134C001_hover.png"
                ),
                ProductModel(
                    name="Kahverengi Deri Ceket",
                    description="Vintage kahverengi deri ceket, rock tarzı kombinler için",
                    price=520.0,
                    category="Ceket",
                    image_url="https://png.pngtree.com/png-vector/20240416/ourmid/pngtree-a-brown-leather-jacket-with-the-word-on-front-png-image_11974101.png"
                ),
                ProductModel(
                    name="Mavi Midi Etek",
                    description="Elegant mavi midi etek, ofis kombinleri için",
                    price=210.0,
                    category="Etek",
                    image_url="https://w7.pngwing.com/pngs/978/488/png-transparent-pencil-skirt-clothing-dress-ruffle-dress-blue-midi-party.png"
                ),
                ProductModel(
                    name="Siyah Crop Pantolon",
                    description="Modern siyah crop pantolon, yaz kombinleri için",
                    price=180.0,
                    category="Pantolon",
                    image_url="https://e7.pngegg.com/pngimages/96/103/png-clipart-t-shirt-pants-clothing-pajamas-loose-pants-adidas-black-thumbnail.png"
                ),
                ProductModel(
                    name="Beyaz Triko Kazak",
                    description="Temiz beyaz triko kazak, her kombinle uyumlu",
                    price=100.0,
                    category="Kazak",
                    image_url="https://static.vecteezy.com/system/resources/previews/055/062/564/non_2x/a-white-sweater-on-a-transparent-background-free-png.png"
                ),
                ProductModel(
                    name="Kırmızı Deri Çanta",
                    description="Göz alıcı kırmızı deri çanta, özel günler için",
                    price=380.0,
                    category="Çanta",
                    image_url="https://w7.pngwing.com/pngs/546/465/png-transparent-tote-bag-chanel-red-handbag-leather-red-spotted-clothing-blue-luggage-bags-fashion.png"
                ),
                ProductModel(
                    name="Gri Crop Top",
                    description="Şık gri crop top, günlük kombinler için",
                    price=70.0,
                    category="Üst Giyim",
                    image_url="https://static.vecteezy.com/system/resources/previews/057/554/898/non_2x/elegant-abstract-crop-top-white-ribbed-transparent-background-cutout-png.png"
                ),
                ProductModel(
                    name="Siyah Midi Elbise",
                    description="Klasik siyah midi elbise, her ortam için uygun",
                    price=320.0,
                    category="Elbise",
                    image_url="https://png.pngtree.com/png-vector/20250114/ourmid/pngtree-a-tailored-midi-dress-png-image_15177262.png"
                ),
                ProductModel(
                    name="Mavi Triko Hırka",
                    description="Sıcak mavi triko hırka, kış ayları için",
                    price=150.0,
                    category="Hırka",
                    image_url="https://www.podyumplus.com/image/cache/catalog/ZENTON%C4%B0/LOO5CtbklFttJfICLm5ljCJ3eK2RUrvNlEtnTudt-600x315.png"
                ),
                ProductModel(
                    name="Beyaz Platform Sneaker",
                    description="Modern beyaz platform sneaker, günlük kullanım için",
                    price=250.0,
                    category="Sneaker",
                    image_url="https://static.nike.com/a/images/t_default/71d0d5ac-e6a2-4d7e-b4b7-ef1e60d4cb58/W+NIKE+COURT+VISION+ALTA+LTR.png"
                ),
                ProductModel(
                    name="Pembe Crop Bluz",
                    description="Pastel pembe crop bluz, bahar ayları için",
                    price=80.0,
                    category="Bluz",
                    image_url="https://www.dilvin.com.tr/productimages/121727/original/101a03687_koyu-pembe.jpg"
                ),
                ProductModel(
                    name="Siyah Deri Ceket",
                    description="Klasik siyah deri ceket, her tarzla uyumlu",
                    price=480.0,
                    category="Ceket",
                    image_url="https://e7.pngegg.com/pngimages/396/893/png-clipart-leather-jacket-coat-clothing-jacket.png"
                ),
                ProductModel(
                    name="Beyaz Midi Etek",
                    description="Minimalist beyaz midi etek, yaz kombinleri için",
                    price=190.0,
                    category="Etek",
                    image_url="https://cdn.dsmcdn.com/mnresize/500/-/ty1518/product/media/images/prod/QC/20240902/21/cc92e112-9714-3c8d-95ac-451699dd1f79/1_org.jpg"
                ),
                ProductModel(
                    name="Gri Crop Pantolon",
                    description="Modern gri crop pantolon, günlük kullanım için",
                    price=170.0,
                    category="Pantolon",
                    image_url="https://cdn.qukasoft.com/f/200208/bzR6YWFtNG0vcUp3ZUdGckg4OG5icmdQYmNFPQ/p/kadin-tas-palazzo-ince-pantolon-1006-2412-34016343-sw1200sh1800.png"
                ),
                ProductModel(
                    name="Kırmızı Crop Top",
                    description="Canlı kırmızı crop top, özel günler için",
                    price=90.0,
                    category="Üst Giyim",
                    image_url="https://cdn.dsmcdn.com/mnresize/420/620/ty1317/product/media/images/prod/QC/20240519/00/a9e09698-88f5-3f55-a0e0-bb5114eaa3ff/1_org_zoom.jpg"
                ),
                ProductModel(
                    name="Siyah Triko Hırka",
                    description="Sıcak siyah triko hırka, kış ayları için",
                    price=160.0,
                    category="Hırka",
                    image_url="https://www.podyumplus.com/image/catalog/ZENTON%C4%B0/FrWxdRiIOCmUzaiIv5JHmYhGJMuHmw3hqJZsfARX.jpg"
                ),
                ProductModel(
                    name="Beyaz Crop Top",
                    description="Temiz beyaz crop top, yaz kombinleri için",
                    price=65.0,
                    category="Üst Giyim",
                    image_url="https://static.ticimax.cloud/36598/uploads/urunresimleri/buyuk/beyaz-kitty-crop--e2e92.png"
                ),
                ProductModel(
                    name="Siyah Kot Şort",
                    description="Klasik siyah kot şort, yaz ayları için",
                    price=140.0,
                    category="Şort",
                    image_url="https://e7.pngegg.com/pngimages/236/386/png-clipart-t-shirt-topshop-clothing-jeans-shorts-t-shirt-sneakers-black.png"
                ),
                ProductModel(
                    name="Mavi Crop Bluz",
                    description="Açık mavi crop bluz, günlük kullanım için",
                    price=85.0,
                    category="Bluz",
                    image_url="https://w7.pngwing.com/pngs/870/875/png-transparent-t-shirt-crop-top-sweater-makeup-material-blue-fashion-woman.png"
                ),
                ProductModel(
                    name="Kahverengi Midi Etek",
                    description="Elegant kahverengi midi etek, ofis kombinleri için",
                    price=230.0,
                    category="Etek",
                    image_url="https://cdn.globalso.com/yashagarment/CVASV-1.png"
                ),
                ProductModel(
                    name="Beyaz Crop Pantolon",
                    description="Minimalist beyaz crop pantolon, yaz kombinleri için",
                    price=200.0,
                    category="Pantolon",
                    image_url="https://w7.pngwing.com/pngs/709/841/png-transparent-jeans-pants-jeans-white-bermuda-shorts-clothing.png"
                ),
                ProductModel(
                    name="Kırmızı Triko Hırka",
                    description="Canlı kırmızı triko hırka, kış ayları için",
                    price=180.0,
                    category="Hırka",
                    image_url="https://w7.pngwing.com/pngs/521/999/png-transparent-cardigan-clothing-sweater-jacket-button-jacket-fashion-woolen-sneakers.png"
                ),
                ProductModel(
                    name="Siyah Platform Ayakkabı",
                    description="Şık siyah platform ayakkabı, özel günler için",
                    price=310.0,
                    category="Ayakkabı",
                    image_url="https://w7.pngwing.com/pngs/106/281/png-transparent-quartier-pigalle-court-shoe-high-heeled-footwear-patent-leather-black-smooth-surface-high-heeled-shoes-black-hair-fashion-black-white.png"
                ),
                ProductModel(
                    name="Pembe Midi Elbise",
                    description="Pastel pembe midi elbise, bahar ayları için",
                    price=260.0,
                    category="Elbise",
                    image_url="https://png.pngtree.com/png-vector/20240803/ourlarge/pngtree-light-pink-silk-dress-isolated-on-transparent-background-png-image_13360501.png"
                ),
                ProductModel(
                    name="Gri Deri Çanta",
                    description="Elegant gri deri çanta, her kombinle uyumlu",
                    price=340.0,
                    category="Çanta",
                    image_url="https://e7.pngegg.com/pngimages/363/799/png-clipart-birkin-bag-hermxe8s-handbag-leather-hermes-hermes-elephant-gray-leather-handbags-blue-white-thumbnail.png"
                ),
                ProductModel(
                    name="Mavi Crop Top",
                    description="Açık mavi crop top, yaz kombinleri için",
                    price=75.0,
                    category="Üst Giyim",
                    image_url="https://i.pinimg.com/736x/37/33/41/373341e6986dd1d917a060d3f6f7b839.jpg"
                ),
                ProductModel(
                    name="Siyah Midi Etek",
                    description="Klasik siyah midi etek, her ortam için uygun",
                    price=220.0,
                    category="Etek",
                    image_url="https://png.pngtree.com/png-vector/20240429/ourmid/pngtree-pleated-black-skirt-with-cinched-waist-png-image_12339553.png"
                ),
                ProductModel(
                    name="Beyaz Triko Hırka",
                    description="Temiz beyaz triko hırka, kış ayları için",
                    price=170.0,
                    category="Hırka",
                    image_url="https://www.podyumplus.com/image/cache/catalog/VAN%C4%B0ZA_(%C3%96.A)/zeEC0dNHmBuZGMEFdluAoOGwuO90eIm0wfMcTDYv-600x315.png"
                ),
                ProductModel(
                    name="Kahverengi Platform Sneaker",
                    description="Vintage kahverengi platform sneaker, günlük kullanım için",
                    price=270.0,
                    category="Sneaker",
                    image_url="https://static.ticimax.cloud/40380/Uploads/UrunResimleri/thumb/run-star-hike-platform-weatherized-lea-a-9652.png"
                ),
                ProductModel(
                    name="Mavi Midi Elbise",
                    description="Elegant mavi midi elbise, özel günler için",
                    price=300.0,
                    category="Elbise",
                    image_url="https://www.ilaydakarakus.com/image/cache/catalog/Urunler/u10-615x923.png"
                ),
                ProductModel(
                    name="Siyah Crop Bluz",
                    description="Modern siyah crop bluz, günlük kullanım için",
                    price=90.0,
                    category="Bluz",
                    image_url="https://w7.pngwing.com/pngs/899/38/png-transparent-t-shirt-crop-top-sleeve-t-shirt-fashion-black-woman.png"
                ),
                ProductModel(
                    name="Gri Midi Etek",
                    description="Şık gri midi etek, ofis kombinleri için",
                    price=240.0,
                    category="Etek",
                    image_url="https://static.ticimax.cloud/cdn-cgi/image/width=-,quality=85/31315/uploads/urunresimleri/buyuk/tuvit-etek-c-9241.jpg"
                ),
                ProductModel(
                    name="Beyaz Crop Pantolon",
                    description="Minimalist beyaz crop pantolon, yaz kombinleri için",
                    price=210.0,
                    category="Pantolon",
                    image_url="https://w7.pngwing.com/pngs/870/693/png-transparent-bermuda-shorts-jeans-jeans-white-bermuda-shorts-clothing.png"
                ),
                ProductModel(
                    name="Kırmızı Platform Ayakkabı",
                    description="Göz alıcı kırmızı platform ayakkabı, özel günler için",
                    price=330.0,
                    category="Ayakkabı",
                    image_url="https://png.pngtree.com/png-vector/20250325/ourlarge/pngtree-red-high-heeled-shoes-png-image_15868529.png"
                ),
                ProductModel(
                    name="Siyah Midi Elbise",
                    description="Klasik siyah midi elbise, her ortam için uygun",
                    price=340.0,
                    category="Elbise",
                    image_url="https://png.pngtree.com/png-vector/20250114/ourmid/pngtree-a-tailored-midi-dress-png-image_15177262.png"
                ),
                ProductModel(
                    name="Mavi Deri Çanta",
                    description="Elegant mavi deri çanta, her kombinle uyumlu",
                    price=360.0,
                    category="Çanta",
                    image_url="https://w7.pngwing.com/pngs/449/169/png-transparent-handbag-leather-clothing-accessories-woman-bag-blue-white-luggage-bags.png"
                ),
                ProductModel(
                    name="Pembe Crop Top",
                    description="Pastel pembe crop top, bahar ayları için",
                    price=70.0,
                    category="Üst Giyim",
                    image_url="https://w7.pngwing.com/pngs/964/674/png-transparent-bra-crop-top-sleeveless-shirt-tanktop-tank-top-white-swimsuit-top-magenta-thumbnail.png"
                ),
                ProductModel(
                    name="Kahverengi Crop Pantolon",
                    description="Vintage kahverengi crop pantolon, günlük kullanım için",
                    price=190.0,
                    category="Pantolon",
                    image_url="https://cdn.qukasoft.com/f/864663/cG96YWFtNG0vcUp3ZUdGckg4OG5icmdQYmNFPQ/p/premium-modal-palazzo-pantolon-kahverengi-47535895-sw1400sh2100.png"
                ),
                ProductModel(
                    name="Beyaz Platform Sneaker",
                    description="Temiz beyaz platform sneaker, günlük kullanım için",
                    price=260.0,
                    category="Sneaker",
                    image_url="https://png.pngtree.com/png-clipart/20250428/original/pngtree-a-stylish-white-sneaker-with-chunky-sole-featuring-lace-up-design-png-image_20883668.png"
                ),
                ProductModel(
                    name="Gri Midi Elbise",
                    description="Elegant gri midi elbise, ofis kombinleri için",
                    price=280.0,
                    category="Elbise",
                    image_url="https://png.pngtree.com/png-clipart/20220706/ourmid/pngtree-monochrome-midi-dress-png-image_5722887.png"
                ),
                ProductModel(
                    name="Siyah Spor Ayakkabı",
                    description="Rahat siyah spor ayakkabı, günlük kullanım için ideal",
                    price=180.0,
                    category="Spor Ayakkabı",
                    image_url="https://png.pngtree.com/png-clipart/20250428/original/pngtree-a-stylish-black-sneaker-with-white-sole-featuring-lace-up-design-png-image_20883669.png"
                ),
                ProductModel(
                    name="Beyaz Spor Ayakkabı",
                    description="Temiz beyaz spor ayakkabı, her kombinle uyumlu",
                    price=200.0,
                    category="Spor Ayakkabı",
                    image_url="https://png.pngtree.com/png-clipart/20250428/original/pngtree-a-stylish-white-sneaker-with-chunky-sole-featuring-lace-up-design-png-image_20883668.png"
                ),
                ProductModel(
                    name="Gri Spor Ayakkabı",
                    description="Modern gri spor ayakkabı, casual kombinler için",
                    price=190.0,
                    category="Spor Ayakkabı",
                    image_url="https://png.pngtree.com/png-clipart/20250428/original/pngtree-a-stylish-gray-sneaker-with-white-sole-featuring-lace-up-design-png-image_20883670.png"
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
    return {"message": "Backend çalışıyor!"}

@app.get("/test-elegant")
def test_elegant_products():
    db = next(get_db_session())
    try:
        # Elegant kelimesi geçen ürünleri ara
        elegant_products = db.query(ProductModel).filter(
            ProductModel.description.like('%elegant%')
        ).all()
        
        elegant_list = []
        for product in elegant_products:
            elegant_list.append({
                "id": product.id,
                "name": product.name,
                "description": product.description,
                "category": product.category
            })
        
        # Elbise kategorisindeki ürünleri ara
        dress_products = db.query(ProductModel).filter(
            ProductModel.category.like('%elbise%')
        ).all()
        
        dress_list = []
        for product in dress_products:
            dress_list.append({
                "id": product.id,
                "name": product.name,
                "description": product.description,
                "category": product.category
            })
        
        return {
            "elegant_products": elegant_list,
            "dress_products": dress_list,
            "total_elegant": len(elegant_products),
            "total_dresses": len(dress_products)
        }
        
    finally:
        db.close()

@app.get("/test-spor-ayakkabi-debug")
def test_spor_ayakkabi_debug():
    db = next(get_db_session())
    try:
        # Spor ayakkabıları ara
        spor_ayakkabi_products = db.query(ProductModel).filter(
            ProductModel.category.like('%Spor Ayakkabı%')
        ).all()
        
        spor_ayakkabi_list = []
        for product in spor_ayakkabi_products:
            spor_ayakkabi_list.append({
                "id": product.id,
                "name": product.name,
                "description": product.description,
                "category": product.category
            })
        
        # Ayakkabı kategorisindeki tüm ürünleri ara
        ayakkabi_products = db.query(ProductModel).filter(
            ProductModel.category.like('%ayakkabı%')
        ).all()
        
        ayakkabi_list = []
        for product in ayakkabi_products:
            ayakkabi_list.append({
                "id": product.id,
                "name": product.name,
                "description": product.description,
                "category": product.category
            })
        
        # Spor kelimesi geçen ürünleri ara
        spor_products = db.query(ProductModel).filter(
            ProductModel.description.like('%spor%')
        ).all()
        
        spor_list = []
        for product in spor_products:
            spor_list.append({
                "id": product.id,
                "name": product.name,
                "description": product.description,
                "category": product.category
            })
        
        return {
            "spor_ayakkabi_products": spor_ayakkabi_list,
            "ayakkabi_products": ayakkabi_list,
            "spor_products": spor_list,
            "total_spor_ayakkabi": len(spor_ayakkabi_products),
            "total_ayakkabi": len(ayakkabi_products),
            "total_spor": len(spor_products)
        }
        
    finally:
        db.close()



@app.post("/add-test-data")
def add_test_data_endpoint():
    try:
        add_test_data()
        return {"message": "Test verileri eklendi!"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db_session)):
    try:
        existing_user = db.query(UserModel).filter(UserModel.email == user.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Bu email adresi zaten kullanılıyor")
        
        hashed_password = get_password_hash(user.password)
        
        new_user = UserModel(
            email=user.email,
            hashed_password=hashed_password
        )
        
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
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db_session)):
    try:
        user = db.query(UserModel).filter(UserModel.email == form_data.username).first()
        
        if not user:
            raise HTTPException(status_code=401, detail="Email veya şifre yanlış")
        
        if not verify_password(form_data.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Email veya şifre yanlış")
        
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
    try:
        product = db.query(ProductModel).filter(ProductModel.id == favorite.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Ürün bulunamadı")
        
        existing_favorite = db.query(FavoriteModel).filter(
            FavoriteModel.user_id == current_user.id,
            FavoriteModel.product_id == favorite.product_id
        ).first()
        
        if existing_favorite:
            raise HTTPException(status_code=400, detail="Bu ürün zaten favorilerinizde")
        
        new_favorite = FavoriteModel(
            user_id=current_user.id,
            product_id=favorite.product_id
        )
        
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
    try:
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
    try:
        favorite = db.query(FavoriteModel).filter(
            FavoriteModel.user_id == current_user.id,
            FavoriteModel.product_id == product_id
        ).first()
        
        if not favorite:
            raise HTTPException(status_code=404, detail="Bu ürün favorilerinizde bulunamadı")
        
        db.delete(favorite)
        db.commit()
        
        return {"message": "Ürün favorilerden silindi"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Favori silme işlemi başarısız: {str(e)}")

class RecommendationRequest(BaseModel):
    text: str

@app.get("/products", response_model=List[Product])
def get_products(db: Session = Depends(get_db_session)):
    return db.query(ProductModel).all()

# ===================================================================
# GELİŞTİRİLMİŞ /recommend FONKSİYONU - DAHA AKILLI ÖNERİLER
# ===================================================================
@app.post("/recommend", response_model=List[Product])
def recommend_products(request: RecommendationRequest, db: Session = Depends(get_db_session)):
    """
    Kullanıcı metnine göre akıllı ürün önerisi yapar.
    """
    try:
        logger.info(f"Gelen istek: {request.text}")
        
        # Kullanıcı metninden stil ve tür etiketlerini çıkar
        intent_result = generate_kombin_recipe(
            cumle=request.text,
            anahtar_kelimeler_dict=ANAHTAR_KELİMELER,
            kombin_kurallari_dict=KOMBİN_KURALLARI,
            kategoriler_dict=KATEGORILER,
            renk_uyumu_dict=RENK_UYUMU_KURALLARI,
            cinsiyet="kadin"
        )
        
        logger.info(f"AI sonucu: {intent_result}")
        logger.info(f"AI style listesi: {intent_result.get('style', [])}")
        logger.info(f"AI type listesi: {intent_result.get('type', [])}")
        logger.info(f"AI kombin_recetesi: {intent_result.get('kombin_recetesi', [])}")

        # Kombinasyon cümlesi tespiti
        kombin_cumlesi = False
        kombin_kelimeleri = ['var', 'ne giyeyim', 'ne giysem', 'üstüne', 'altına', 'ile', 'kombin']
        if any(kelime in request.text.lower() for kelime in kombin_kelimeleri):
            kombin_cumlesi = True
            logger.info("Kombinasyon cümlesi tespit edildi")
        
        # Stil tespiti - Öncelikli olarak stil arama yap
        stil = None
        if intent_result.get('style'):
            stil = intent_result['style'][0].lower()
            logger.info(f"AI modülünden gelen stil: {intent_result['style']}")
        
        # Kategori tespiti
        kategori = None
        if intent_result.get('type'):
            for t in intent_result['type']:
                if t.lower() in ['çanta', 'gömlek', 'pantolon', 'ceket', 'elbise', 'kazak', 'bluz', 'hırka', 'ayakkabı', 'sneaker', 'etek', 'üst giyim', 'şort']:
                    kategori = t.lower()
                    break
        
        # Eğer kategori tespit edilemezse, kullanıcı metninden direkt ara
        if not kategori:
            user_text_lower = request.text.lower()
            if 'ayakkabı' in user_text_lower:
                kategori = 'sneaker'  # Veritabanında 'Sneaker' kategorisi var
                logger.info("Kullanıcı metninden 'ayakkabı' kategorisi tespit edildi -> 'sneaker' olarak eşleştirildi")
            elif 'çanta' in user_text_lower:
                kategori = 'çanta'
                logger.info("Kullanıcı metninden 'çanta' kategorisi tespit edildi")
            elif 'gömlek' in user_text_lower:
                kategori = 'gömlek'
                logger.info("Kullanıcı metninden 'gömlek' kategorisi tespit edildi")
            elif 'pantolon' in user_text_lower:
                kategori = 'pantolon'
                logger.info("Kullanıcı metninden 'pantolon' kategorisi tespit edildi")
            elif 'ceket' in user_text_lower:
                kategori = 'ceket'
                logger.info("Kullanıcı metninden 'ceket' kategorisi tespit edildi")
            elif 'elbise' in user_text_lower:
                kategori = 'elbise'
                logger.info("Kullanıcı metninden 'elbise' kategorisi tespit edildi")
            elif 'kazak' in user_text_lower:
                kategori = 'kazak'
                logger.info("Kullanıcı metninden 'kazak' kategorisi tespit edildi")
            elif 'bluz' in user_text_lower:
                kategori = 'bluz'
                logger.info("Kullanıcı metninden 'bluz' kategorisi tespit edildi")
            elif 'hırka' in user_text_lower:
                kategori = 'hırka'
                logger.info("Kullanıcı metninden 'hırka' kategorisi tespit edildi")
            elif 'sneaker' in user_text_lower:
                kategori = 'sneaker'
                logger.info("Kullanıcı metninden 'sneaker' kategorisi tespit edildi")
            elif 'etek' in user_text_lower:
                kategori = 'etek'
                logger.info("Kullanıcı metninden 'etek' kategorisi tespit edildi")
            elif 'şort' in user_text_lower:
                kategori = 'şort'
                logger.info("Kullanıcı metninden 'şort' kategorisi tespit edildi")
        
        # Renk tespiti
        renk = None
        if intent_result.get('color'):
            renk = intent_result['color'][0].lower()
        
        logger.info(f"Tespit edilen stil: {stil}")
        logger.info(f"Tespit edilen kategori: {kategori}")
        logger.info(f"Tespit edilen renk: {renk}")
        logger.info(f"Tam intent_result: {intent_result}")
        
        # BASİT KELİME EŞLEŞTİRMESİ - ÖNCELİKLİ
        user_text_lower = request.text.lower()
        logger.info(f"Basit kelime eşleştirmesi yapılıyor: {user_text_lower}")
        
        # Direkt kelime eşleştirmeleri
        if 'spor' in user_text_lower and 'ayakkabı' in user_text_lower:
            logger.info("Spor ayakkabı eşleşmesi bulundu")
            spor_ayakkabi_urunleri = []
            for product in db.query(ProductModel).all():
                product_text = f"{product.name} {product.description} {product.category}".lower()
                if 'sneaker' in product_text:
                    spor_ayakkabi_urunleri.append(product)
                    logger.info(f"Sneaker bulundu: {product.name}")
            if spor_ayakkabi_urunleri:
                return spor_ayakkabi_urunleri
        
        elif 'elegant' in user_text_lower and 'elbise' in user_text_lower:
            logger.info("Elegant elbise eşleşmesi bulundu")
            elegant_elbise_urunleri = []
            for product in db.query(ProductModel).all():
                product_text = f"{product.name} {product.description} {product.category}".lower()
                if 'elegant' in product_text and 'elbise' in product_text:
                    elegant_elbise_urunleri.append(product)
                    logger.info(f"Elegant elbise bulundu: {product.name}")
            if elegant_elbise_urunleri:
                return elegant_elbise_urunleri
        
        elif 'vintage' in user_text_lower and 'ceket' in user_text_lower:
            logger.info("Vintage ceket eşleşmesi bulundu")
            vintage_ceket_urunleri = []
            for product in db.query(ProductModel).all():
                product_text = f"{product.name} {product.description} {product.category}".lower()
                if 'vintage' in product_text and 'ceket' in product_text:
                    vintage_ceket_urunleri.append(product)
                    logger.info(f"Vintage ceket bulundu: {product.name}")
            if vintage_ceket_urunleri:
                return vintage_ceket_urunleri
        
        elif 'casual' in user_text_lower and 'gömlek' in user_text_lower:
            logger.info("Casual gömlek eşleşmesi bulundu")
            casual_gomlek_urunleri = []
            for product in db.query(ProductModel).all():
                product_text = f"{product.name} {product.description} {product.category}".lower()
                if 'gömlek' in product_text:
                    casual_gomlek_urunleri.append(product)
                    logger.info(f"Gömlek bulundu: {product.name}")
            if casual_gomlek_urunleri:
                return casual_gomlek_urunleri
        
        elif 'ofis' in user_text_lower and 'gömlek' in user_text_lower:
            logger.info("Ofis gömlek eşleşmesi bulundu")
            ofis_gomlek_urunleri = []
            for product in db.query(ProductModel).all():
                product_text = f"{product.name} {product.description} {product.category}".lower()
                if 'gömlek' in product_text:
                    ofis_gomlek_urunleri.append(product)
                    logger.info(f"Gömlek bulundu: {product.name}")
            if ofis_gomlek_urunleri:
                return ofis_gomlek_urunleri
        
        elif 'siyah' in user_text_lower and 'pantolon' in user_text_lower:
            logger.info("Siyah pantolon eşleşmesi bulundu")
            siyah_pantolon_urunleri = []
            for product in db.query(ProductModel).all():
                product_text = f"{product.name} {product.description} {product.category}".lower()
                if 'siyah' in product_text and 'pantolon' in product_text:
                    siyah_pantolon_urunleri.append(product)
                    logger.info(f"Siyah pantolon bulundu: {product.name}")
            if siyah_pantolon_urunleri:
                return siyah_pantolon_urunleri
        
        # Eski stil bazlı arama (fallback)
        if stil:
            logger.info(f"Stil bazlı arama yapılıyor: {stil}")
            
            # Stil-ürün eşleştirmeleri
            stil_urunleri = {
                'vintage': ['etek', 'bluz', 'hırka', 'elbise', 'ceket'],
                'casual': ['jean', 'tişört', 'sneaker', 'hırka'],
                'elegant': ['elbise', 'ceket', 'topuklu ayakkabı', 'bluz'],
                'spor': ['tayt', 'sweatshirt', 'tişört', 'spor ayakkabı', 'ayakkabı'],
                'ofis': ['gömlek', 'pantolon', 'ceket', 'topuklu ayakkabı'],
                'minimalist': ['gömlek', 'pantolon', 'sneaker', 'çanta'],
                'bohem': ['elbise', 'hırka', 'çanta', 'ayakkabı'],
                'klasik': ['gömlek', 'pantolon', 'ceket', 'elbise'],
                'modern': ['bluz', 'pantolon', 'sneaker', 'çanta'],
                'romantik': ['elbise', 'bluz', 'hırka', 'çanta'],
                'rock': ['jean', 'tişört', 'ceket', 'ayakkabı'],
                'preppy': ['gömlek', 'pantolon', 'ceket', 'sneaker'],
                'girly': ['elbise', 'bluz', 'hırka', 'çanta'],
                'androgynous': ['gömlek', 'pantolon', 'ceket', 'sneaker']
            }
            
            logger.info(f"Stil '{stil}' için hedef ürünler: {stil_urunleri.get(stil, [])}")
            
            if stil in stil_urunleri:
                hedef_urunler = stil_urunleri[stil]
                stil_urunleri_listesi = []
                
                # Eğer kategori de varsa, sadece o kategoriyi ara
                if kategori:
                    logger.info(f"Stil + Kategori kombinasyonu: {stil} + {kategori}")
                    
                    # Önce stil kelimesi açıklamada geçen VE kategori eşleşen ürünleri bul
                    logger.info("Stil + Kategori eşleşmesi aranıyor...")
                    for product in db.query(ProductModel).all():
                        product_text = f"{product.name} {product.description} {product.category}".lower()
                        if (stil in product_text and 
                            (kategori in product.category.lower() or kategori in product.name.lower())):
                            stil_urunleri_listesi.append(product)
                            logger.info(f"Stil+Kategori eşleşmesi bulundu: {product.name} - {product.description}")
                    
                    # Eğer stil+kategori eşleşmesi bulunamazsa, sadece kategoriyi ara
                    if not stil_urunleri_listesi:
                        logger.info("Stil+Kategori eşleşmesi bulunamadı, sadece kategori aranıyor...")
                        for product in db.query(ProductModel).all():
                            product_text = f"{product.name} {product.description} {product.category}".lower()
                            if (kategori in product.category.lower() or kategori in product.name.lower()):
                                stil_urunleri_listesi.append(product)
                                logger.info(f"Kategori eşleşmesi bulundu: {product.name} - {product.category}")
                    
                    # Eğer hala bulunamazsa, özel durumlar için kontrol et
                    if not stil_urunleri_listesi:
                        logger.info("Özel durumlar kontrol ediliyor...")
                        if stil == 'spor' and kategori == 'sneaker':
                            # Spor ayakkabıları için özel arama
                            for product in db.query(ProductModel).all():
                                product_text = f"{product.name} {product.description} {product.category}".lower()
                                if 'sneaker' in product_text:
                                    stil_urunleri_listesi.append(product)
                                    logger.info(f"Sneaker bulundu: {product.name} - {product.category}")
                        elif stil == 'elegant' and kategori == 'elbise':
                            # Elegant elbiseler için özel arama
                            for product in db.query(ProductModel).all():
                                product_text = f"{product.name} {product.description} {product.category}".lower()
                                if 'elegant' in product_text and 'elbise' in product_text:
                                    stil_urunleri_listesi.append(product)
                                    logger.info(f"Elegant elbise bulundu: {product.name} - {product.category}")
                        elif stil == 'vintage' and kategori == 'ceket':
                            # Vintage ceketler için özel arama
                            for product in db.query(ProductModel).all():
                                product_text = f"{product.name} {product.description} {product.category}".lower()
                                if 'vintage' in product_text and 'ceket' in product_text:
                                    stil_urunleri_listesi.append(product)
                                    logger.info(f"Vintage ceket bulundu: {product.name} - {product.category}")
                
                else:
                    # Sadece stil arama (eski mantık)
                    logger.info("Sadece stil arama yapılıyor...")
                    
                    # Önce stil kelimesi açıklamada geçen ürünleri bul
                    logger.info("Açıklamada stil kelimesi aranıyor...")
                    for product in db.query(ProductModel).all():
                        product_text = f"{product.name} {product.description} {product.category}".lower()
                        if stil in product_text:
                            stil_urunleri_listesi.append(product)
                            logger.info(f"Stil kelimesi bulundu: {product.name} - {product.description}")
                    
                    # Sonra hedef ürün kategorilerini ara
                    logger.info("Hedef ürün kategorileri aranıyor...")
                    for hedef_urun in hedef_urunler:
                        for product in db.query(ProductModel).all():
                            product_text = f"{product.name} {product.description} {product.category}".lower()
                            if hedef_urun in product_text and product not in stil_urunleri_listesi:
                                stil_urunleri_listesi.append(product)
                                logger.info(f"Hedef kategori bulundu: {product.name} - {hedef_urun}")
                
                if stil_urunleri_listesi:
                    logger.info(f"{stil} stili için {len(stil_urunleri_listesi)} ürün bulundu")
                    return stil_urunleri_listesi
                else:
                    logger.info(f"{stil} stili için hiç ürün bulunamadı")
            else:
                logger.info(f"Stil '{stil}' için tanımlı hedef ürün yok")
        
        # AI modülünün kombinasyon reçetesi varsa, onu kullan (stil arama çalışmadıysa)
        if 'kombin_recetesi' in intent_result and intent_result['kombin_recetesi']:
            logger.info("AI modülünün kombinasyon reçetesi kullanılıyor")
            kombin_recetesi = intent_result['kombin_recetesi']
            
            recommended_products = []
            
            for recete_parcasi in kombin_recetesi:
                tur = recete_parcasi.get('tur')
                renk_onerisi = recete_parcasi.get('renk_onerisi', [])
                
                if tur:
                    logger.info(f"Reçete parçası aranıyor: {tur}")
                    
                    # Bu türdeki ürünleri bul
                    tur_urunleri = []
                    for product in db.query(ProductModel).all():
                        product_text = f"{product.name} {product.description} {product.category}".lower()
                        if tur.lower() in product_text:
                            tur_urunleri.append(product)
                    
                    # Eğer bulunamazsa, benzer kategorilerde ara
                    if not tur_urunleri:
                        logger.info(f"{tur} bulunamadı, benzer kategorilerde aranıyor")
                        
                        # Benzer kategori eşleştirmeleri
                        benzer_kategoriler = {
                            'tayt': ['pantolon', 'şort'],
                            'sweatshirt': ['kazak', 'hırka', 'tişört'],
                            'hoodie': ['kazak', 'hırka'],
                            'sırt çantası': ['çanta'],
                            'spor ayakkabı': ['sneaker', 'ayakkabı'],
                            'topuklu ayakkabı': ['ayakkabı'],
                            'kargo pantolon': ['pantolon'],
                            'jean': ['pantolon'],
                            'bluz': ['gömlek', 'tişört'],
                            'tişört': ['gömlek', 'bluz'],
                            'crop top': ['bluz', 'tişört', 'gömlek'],
                            'midi etek': ['etek', 'pantolon'],
                            'mini etek': ['etek', 'pantolon']
                        }
                        
                        if tur.lower() in benzer_kategoriler:
                            benzer_turler = benzer_kategoriler[tur.lower()]
                            for benzer_tur in benzer_turler:
                                for product in db.query(ProductModel).all():
                                    product_text = f"{product.name} {product.description} {product.category}".lower()
                                    if benzer_tur in product_text:
                                        tur_urunleri.append(product)
                                if tur_urunleri:
                                    logger.info(f"Benzer kategori {benzer_tur} bulundu")
                                    break
                    
                    # Renk uyumlu olanları öne al
                    if renk_onerisi:
                        logger.info(f"Renk uyumu aranıyor: {renk_onerisi}")
                        uyumlu_renkli_urunler = []
                        diger_urunler = []
                        
                        for product in tur_urunleri:
                            product_text = f"{product.name} {product.description}".lower()
                            if any(renk in product_text for renk in renk_onerisi):
                                uyumlu_renkli_urunler.append(product)
                            else:
                                diger_urunler.append(product)
                        
                        # Uyumlu renkli olanları öne al
                        tur_urunleri = uyumlu_renkli_urunler + diger_urunler
                    
                    # En uygun 2 ürünü ekle
                    if tur_urunleri:
                        recommended_products.extend(tur_urunleri[:2])
                        logger.info(f"{tur} için {len(tur_urunleri[:2])} ürün eklendi")
                    else:
                        logger.info(f"{tur} için hiç ürün bulunamadı")
            
            if recommended_products:
                logger.info(f"Kombinasyon reçetesinden toplam {len(recommended_products)} ürün bulundu")
                return recommended_products
        
        # Kombinasyon cümlesi tespit edildi ama AI reçetesi yoksa, manuel kombinasyon mantığı
        elif kombin_cumlesi:
            logger.info("Manuel kombinasyon mantığı kullanılıyor")
            
            # Mevcut ürün tespiti
            mevcut_urun = None
            mevcut_renk = None
            
            # Renk tespiti
            if intent_result.get('color'):
                mevcut_renk = intent_result['color'][0].lower()
            
            # Ürün türü tespiti
            if intent_result.get('type'):
                for t in intent_result['type']:
                    if t.lower() in ['etek', 'pantolon', 'crop top', 'bluz', 'gömlek', 'tişört', 'elbise']:
                        mevcut_urun = t.lower()
                        break
            
            logger.info(f"Mevcut ürün: {mevcut_urun}, Renk: {mevcut_renk}")
            
            # Kombinasyon kuralları
            kombinasyon_kurallari = {
                'etek': ['bluz', 'gömlek', 'tişört', 'kazak', 'hırka', 'ceket'],
                'pantolon': ['bluz', 'gömlek', 'tişört', 'kazak', 'hırka', 'ceket'],
                'crop top': ['pantolon', 'etek', 'şort'],
                'crop bluz': ['pantolon', 'etek', 'şort'],
                'bluz': ['pantolon', 'etek', 'şort'],
                'gömlek': ['pantolon', 'etek', 'şort'],
                'tişört': ['pantolon', 'etek', 'şort'],
                'kazak': ['pantolon', 'etek', 'şort'],
                'hırka': ['pantolon', 'etek', 'şort'],
                'elbise': ['ceket', 'hırka', 'çanta', 'ayakkabı']
            }
            
            if mevcut_urun and mevcut_urun in kombinasyon_kurallari:
                uyumlu_kategoriler = kombinasyon_kurallari[mevcut_urun]
                recommended_products = []
                
                for kategori in uyumlu_kategoriler:
                    kategori_urunleri = []
                    for product in db.query(ProductModel).all():
                        if kategori in product.category.lower() or kategori in product.name.lower():
                            kategori_urunleri.append(product)
                    
                    # Renk uyumlu olanları öne al
                    if mevcut_renk and kategori_urunleri:
                        renkli_olanlar = []
                        digerleri = []
                        
                        for product in kategori_urunleri:
                            product_text = f"{product.name} {product.description}".lower()
                            if mevcut_renk in product_text:
                                renkli_olanlar.append(product)
                            else:
                                digerleri.append(product)
                        
                        kategori_urunleri = renkli_olanlar + digerleri
                    
                    if kategori_urunleri:
                        recommended_products.extend(kategori_urunleri[:2])
                        logger.info(f"{kategori} kategorisinden {len(kategori_urunleri[:2])} ürün eklendi")
                
                if recommended_products:
                    logger.info(f"Manuel kombinasyon mantığından toplam {len(recommended_products)} ürün bulundu")
                    return recommended_products

        # Normal arama mantığı (stil arama çalışmadıysa)
        logger.info("Normal arama mantığı kullanılıyor")
        
        # 1. Öncelik: Kategori + Renk tam eşleşme
        if kategori and renk:
            logger.info(f"Kategori ve renk eşleşmesi aranıyor: {kategori} + {renk}")
            tam_eslesenler = []
            for product in db.query(ProductModel).all():
                if (kategori in product.category.lower() and 
                    (renk in product.name.lower() or renk in product.description.lower())):
                    tam_eslesenler.append(product)
            
            if tam_eslesenler:
                logger.info(f"{len(tam_eslesenler)} adet tam eşleşen bulundu")
                return tam_eslesenler
        
        # 2. Öncelik: Sadece kategori eşleşmesi
        if kategori:
            logger.info(f"Sadece kategori eşleşmesi aranıyor: {kategori}")
            kategori_urunleri = []
            for product in db.query(ProductModel).all():
                if kategori in product.category.lower():
                    kategori_urunleri.append(product)
            
            if kategori_urunleri:
                # Eğer renk de varsa, önce renkli olanları öne al
                if renk:
                    renkli_olanlar = [p for p in kategori_urunleri if (renk in p.name.lower() or renk in p.description.lower())]
                    digerleri = [p for p in kategori_urunleri if p not in renkli_olanlar]
                    sonuc = renkli_olanlar + digerleri
                    logger.info(f"{len(sonuc)} adet kategori ürünü bulundu")
                    return sonuc
                else:
                    logger.info(f"{len(kategori_urunleri)} adet kategori ürünü bulundu")
                    return kategori_urunleri
        
        # 3. Son çare: Varsayılan öneriler
        logger.info("Varsayılan öneriler döndürülüyor")
        return db.query(ProductModel).limit(5).all()
        
    except Exception as e:
        logger.error(f"Öneri oluşturulurken hata: {e}", exc_info=True)
        return db.query(ProductModel).limit(5).all()