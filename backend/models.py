from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
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

class User(Base):
    """
    Veritabanındaki 'users' tablosunu temsil eden SQLAlchemy modeli.
    Kullanıcı bilgilerini saklar.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)  # Kullanıcı benzersiz ID'si
    email = Column(String, unique=True, index=True)     # Kullanıcı email adresi
    hashed_password = Column(String)                    # Şifrelenmiş parola

    # İlişkiler
    favorites = relationship("Favorite", back_populates="user")

class Favorite(Base):
    """
    Veritabanındaki 'favorites' tablosunu temsil eden SQLAlchemy modeli.
    Kullanıcıların favori ürünlerini saklar.
    """
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)  # Favori benzersiz ID'si
    user_id = Column(Integer, ForeignKey("users.id"))   # Kullanıcı ID'si
    product_id = Column(Integer, ForeignKey("products.id"))  # Ürün ID'si

    # İlişkiler
    user = relationship("User", back_populates="favorites")
    product = relationship("Product")
