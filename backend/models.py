from pydantic import BaseModel
from typing import Optional

class Product(BaseModel):
    id: int
    name: str
    category: str
    description: Optional[str]
    image_url: Optional[str]
    rank: int
    country: str
    sales: int
