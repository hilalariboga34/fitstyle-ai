from pydantic import BaseModel

class Product(BaseModel):
    """
    API üzerinden döndürülecek ürün nesnesinin şeması.
    Bu şema, veritabanından okunan verinin formatını ve API'den dönen yapıyı belirler.
    """
    id: int               # Ürün ID'si
    name: str             # Ürün adı
    description: str      # Ürün açıklaması
    price: float          # Ürün fiyatı
    image_url: str        # Ürün resim linki

    class Config:
        """
        Pydantic konfigürasyonu: Veritabanı objelerini JSON'a dönüştürürken kullanılır.
        orm_mode=True ile SQLAlchemy modelleri doğrudan kullanılabilir.
        """
        orm_mode = True
