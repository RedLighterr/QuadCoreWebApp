from sqlalchemy import create_url
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

# SQLite veritabanı dosya yolu
SQLALCHEMY_DATABASE_URL = "sqlite:///./quadcore.db"

# connect_args={"check_same_thread": False} SQLite için özel bir ayardır, çoklu işlemlere izin verir.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Veritabanı oturumu bağımlılığı (Dependency Injection)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
