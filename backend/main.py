from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import openai
import os


app = FastAPI()

# Allow frontend to access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:3000"] for strict mode
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


openai.api_key = os.getenv("OPENAI_API_KEY")

# Dummy data model
class Product(BaseModel):
    id: int
    name: str
    category: str
    rank: int
    country: str
    sales: int

# Dummy product data
products = [
    Product(id=1, name="iPhone 15", category="Electronics", rank=1, country="USA", sales=1200000),
    Product(id=2, name="Samsung Galaxy S24", category="Electronics", rank=2, country="South Korea", sales=900000),
]

@app.get("/")
def read_root():
    return {"message": "Welcome to TopProduct API"}

@app.get("/api/products", response_model=List[Product])
def get_products():
    return products

class AIRequest(BaseModel):
    prompt: str

@app.post("/api/ai/query")
def query_ai(data: AIRequest):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You're a helpful assistant about global products."},
                {"role": "user", "content": data.prompt},
            ]
        )  
        return {"answer": response.choices[0].message.content}
    except Exception as e:
        return {"error": str(e)}
