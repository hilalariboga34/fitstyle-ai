from pydantic import BaseModel
from typing import Optional # Bu satırı ekliyoruz

class Product(BaseModel):
    id: int
    name: str
    description: str
    price: float
    category: str
    image_url: Optional[str] = None # image_url'i opsiyonel yapıyoruz

    class Config:
        from_attributes = True

