from sqlalchemy import Column, Integer, String, Float
from database import Base

class Product(Base):
    """
    Veritabanındaki 'products' tablosunu temsil eden SQLAlchemy modeli.
    Her ürün satırı bu sınıfın bir örneği olarak tutulur.
    """
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)  # Ürün benzersiz ID'si
    name = Column(String, index=True)                  # Ürün adı
    description = Column(String)                       # Ürün açıklaması
    price = Column(Float)                              # Ürün fiyatı
    category = Column(String)                          # Ürün kategorisi
    image_url = Column(String)                         # Ürün resim linki
    # Not: Gerekirse burada yeni alanlar eklenebilir.
