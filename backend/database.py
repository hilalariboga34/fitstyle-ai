from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Veritabanı bağlantı URL'si (SQLite - test için)
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

# SQLAlchemy engine: Veritabanı bağlantısını yönetir
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# Veritabanı session sınıfı: Veritabanı ile etkileşim kurar
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base sınıfı: SQLAlchemy modelleri için temel yapı
Base = declarative_base()

# Yardımcı fonksiyon: Veritabanı oturumu oluşturur ve kapatır
# Bu fonksiyon, FastAPI dependency olarak kullanılabilir.
def get_db_session():
    """
    Yeni bir veritabanı oturumu (session) oluşturur ve iş bitiminde kapatır.
    Kullanımı:
        with get_db_session() as db:
            ...
    Yada FastAPI dependency olarak:
        db: Session = Depends(get_db_session)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()  
