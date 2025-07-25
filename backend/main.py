from fastapi import FastAPI
from typing import List
from schemas import Product

app = FastAPI()

@app.get("/products", response_model=List[Product])
def get_products():
    return [] 