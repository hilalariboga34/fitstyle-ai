from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Product

# Veritabanı tablolarını oluştur
Base.metadata.create_all(bind=engine)

def seed_products():
    db = SessionLocal()
    
    # Örnek ürünler
    products = [
        {
            "name": "Klasik Beyaz Gömlek",
            "description": "Premium pamuktan üretilmiş, ofis ve günlük kullanım için ideal klasik beyaz gömlek. Rahat kesim ve dayanıklı kumaş.",
            "price": 89.99,
            "image_url": "https://placehold.co/400x500/ffffff/000000?text=Beyaz+Gomlek"
        },
        {
            "name": "Slim Fit Koyu Mavi Pantolon",
            "description": "Modern slim fit kesim, koyu mavi renk. İş ve günlük kullanım için mükemmel. %98 pamuk, %2 elastan.",
            "price": 129.99,
            "image_url": "https://placehold.co/400x500/1e3a8a/ffffff?text=Koyu+Mavi+Pantolon"
        },
        {
            "name": "Deri Sneaker",
            "description": "Gerçek deri üst yüzey, kauçuk taban. Günlük kullanım için rahat ve şık tasarım. Siyah renk.",
            "price": 199.99,
            "image_url": "https://placehold.co/400x500/000000/ffffff?text=Deri+Sneaker"
        },
        {
            "name": "Hafif Bomber Ceket",
            "description": "Hafif ve nefes alabilir kumaştan üretilmiş bomber ceket. Günlük kullanım için ideal. Gri renk.",
            "price": 159.99,
            "image_url": "https://placehold.co/400x500/6b7280/ffffff?text=Bomber+Ceket"
        },
        {
            "name": "Vintage Kot T-Shirt",
            "description": "Vintage görünümlü, yumuşak pamuklu kumaştan üretilmiş t-shirt. Rahat kesim ve dayanıklı yapı.",
            "price": 49.99,
            "image_url": "https://placehold.co/400x500/1e40af/ffffff?text=Vintage+T-Shirt"
        },
        {
            "name": "Formal Kravat",
            "description": "İpek kumaştan üretilmiş, koyu mavi desenli formal kravat. İş toplantıları ve özel günler için ideal.",
            "price": 79.99,
            "image_url": "https://placehold.co/400x500/1e3a8a/ffffff?text=Formal+Kravat"
        },
        {
            "name": "Spor Ayakkabı",
            "description": "Hafif ve esnek taban, nefes alabilir üst yüzey. Günlük spor aktiviteleri için mükemmel. Beyaz renk.",
            "price": 149.99,
            "image_url": "https://placehold.co/400x500/ffffff/000000?text=Spor+Ayakkabi"
        },
        {
            "name": "Kot Ceket",
            "description": "Klasik kot ceket, vintage görünüm. Günlük ve casual kullanım için ideal. Mavi renk.",
            "price": 119.99,
            "image_url": "https://placehold.co/400x500/3b82f6/ffffff?text=Kot+Ceket"
        },
        {
            "name": "Polo Gömlek",
            "description": "Premium pamuklu kumaştan üretilmiş polo gömlek. Rahat kesim ve şık tasarım. Lacivert renk.",
            "price": 69.99,
            "image_url": "https://placehold.co/400x500/1e40af/ffffff?text=Polo+Gomlek"
        },
        {
            "name": "Kargo Pantolon",
            "description": "Pratik cep detayları, rahat kesim. Günlük ve outdoor aktiviteler için ideal. Bej renk.",
            "price": 99.99,
            "image_url": "https://placehold.co/400x500/d97706/ffffff?text=Kargo+Pantolon"
        }
    ]
    
    try:
        # Mevcut ürünleri temizle (isteğe bağlı)
        db.query(Product).delete()
        
        # Yeni ürünleri ekle
        for product_data in products:
            product = Product(**product_data)
            db.add(product)
        
        db.commit()
        print(f"✅ {len(products)} adet ürün başarıyla veritabanına eklendi!")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Hata oluştu: {e}")
    
    finally:
        db.close()

if __name__ == "__main__":
    seed_products() 