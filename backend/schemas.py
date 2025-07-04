from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime



class UserCreate(BaseModel):
    username: str
    password: str = Field(..., min_length=6)
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None

    class Config:
        schema_extra = {
            "example": {
                "username": "testuser",
                "password": "strongpassword123",
                "email": "test@example.com",
                "full_name": "Test User",
                "phone_number": "123456789",
                "address": "123 Street"
            }
        }

class UserLogin(BaseModel):
    email: EmailStr  # Yêu cầu email, không còn tùy chọn
    password: str

class UserOut(BaseModel):
    user_id: int
    username: str
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ======= PLATFORM =======
class PlatformOut(BaseModel):
    platform_id: int
    name: str
    website_url: Optional[str] = None

    class Config:
        from_attributes = True


# ======= PRODUCT_PLATFORM =======
class ProductPlatformOut(BaseModel):
    platform: PlatformOut
    price: float
    discount: Optional[float]
    discount_percentage: Optional[float]
    rating: Optional[float]
    review_count: Optional[int]
    product_url: str
    shipping_fee: float
    estimated_delivery_time: Optional[str]
    is_official: Optional[bool]

    class Config:
        from_attributes = True


# ======= PRODUCT =======
class ProductOut(BaseModel):
    product_id: int
    name: str
    category_id: Optional[int]
    description: Optional[str]
    image_url: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]
    platforms: List[ProductPlatformOut] = []

    class Config:
        from_attributes = True


# ======= FAVORITE PRODUCT =======
class FavoriteCreate(BaseModel):
    product_id: int


class FavoriteOut(BaseModel):
    favorite_id: int
    user_id: int
    product_id: int
    added_at: datetime

    class Config:
        from_attributes = True


# ======= SEARCH HISTORY =======
class SearchQuery(BaseModel):
    keyword: str


class SearchHistoryOut(BaseModel):
    search_id: int
    user_id: int
    query: str
    search_time: datetime

    class Config:
        from_attributes = True
