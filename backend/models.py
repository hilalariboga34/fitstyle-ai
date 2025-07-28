from sqlalchemy import Column, Integer, String, Float
from database import Base

class Product(Base):
    """
    Veritabanındaki 'products' tablosunu temsil eden SQLAlchemy modeli.
    """
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)  # Ürün adı
    description = Column(String)       # Ürün açıklaması
    price = Column(Float)               # Ürün fiyatı
    image_url = Column(String)          # Ürün resim linki
