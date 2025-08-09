# from pydantic import BaseModel, EmailStr
# from datetime import datetime
# from pydantic import BaseModel, EmailStr, Field
# from typing import List, Optional
# from datetime import datetime


# class UserCreate(BaseModel):
#     username: str
#     email: EmailStr
#     password_hash: str

# class UserUpdate(BaseModel):
#     username: str
#     email: str
#     password_hash: Optional[str] = None
#     full_name: Optional[str] = None
#     phone_number: Optional[str] = None
#     address: Optional[str] = None

# class UserOut(BaseModel):
#     user_id: int
#     username: str
#     email: str
#     password_hash: str
#     full_name: Optional[str]
#     phone_number: Optional[str]
#     address: Optional[str]
#     created_at: datetime

#     class Config:
#         orm_mode = True

# class ProductSchema(BaseModel):
#     product_id: int
#     name: str
#     image_url: Optional[str] = None
#     description: Optional[str] = None
#     created_at: datetime
#     updated_at: Optional[datetime]

#     class Config:
#         orm_mode = True

# class ProductCardOut(BaseModel):
#     productId: int
#     productPlatformId: int
#     platformLogo: str
#     productImage: str
#     currentPrice: str
#     originalPrice: str
#     discountPercentage: str
#     shippingFee: str
#     totalPrice: str
#     isAvailable: bool
#     rating: str
#     productUrl: str

#     class Config:
#         orm_mode = True


# class FavoriteProductSchema(BaseModel):
#     favorite_id: int
#     user_id: int
#     product_id: int
#     added_at: datetime

#     class Config:
#         orm_mode = True


# class PlatformInfo(BaseModel):
#     name: str
#     logo_url: Optional[str]
#     url: Optional[str]

# class ProductPlatformInfo(BaseModel):
#     price: float
#     discount: Optional[float]
#     discount_percentage: Optional[float]
#     rating: Optional[float]
#     review_count: Optional[int]
#     product_url: Optional[str]
#     shipping_fee: Optional[float]
#     estimated_delivery_time: Optional[str]
#     is_official: Optional[bool]
#     platform: PlatformInfo

#     class Config:
#         orm_mode = True

# class ProductInfo(BaseModel):
#     product_id: int
#     name: str
#     description: Optional[str]
#     image_url: Optional[str]
#     platforms: list[ProductPlatformInfo]

#     class Config:
#         orm_mode = True

# class FavoriteProductResponse(BaseModel):
#     favorite_id: int
#     user_id: int
#     added_at: datetime
#     product: ProductInfo

#     class Config:
#         orm_mode = True

# class PlatformOut(BaseModel):
#     platform_id: int
#     name: str
#     website_url: Optional[str] = None

#     class Config:
#         from_attributes = True

# class ProductPlatformOut(BaseModel):
#     product_platform_id: int 
#     platform: PlatformOut
#     price: float
#     discount: Optional[float] = None
#     discount_percentage: Optional[float] = None
#     rating: Optional[float] = None
#     review_count: Optional[int] = None
#     product_url: str
#     shipping_fee: float
#     estimated_delivery_time: Optional[str] = None
#     is_official: Optional[bool] = None

#     class Config:
#         from_attributes = True

# class ProductOut(BaseModel):
#     product_id: int
#     name: str
#     category_id: Optional[int] = None
#     description: Optional[str] = None
#     image_url: Optional[str] = None
#     created_at: datetime
#     updated_at: Optional[datetime] = None
#     platforms: List[ProductPlatformOut] = Field(default_factory=list)

#     class Config:
#         from_attributes = True


# class FavoriteCreate(BaseModel):
#     product_id: int
#     user_id: int
#     product_platform_id: int


# class PlatformOut(BaseModel):
#     name: str
#     logo_url: str

#     class Config:
#         orm_mode = True


# class ProductPlatformOut(BaseModel):
#     price: float
#     discount: float
#     discount_percentage: float
#     shipping_fee: float
#     rating: float
#     review_count: int
#     product_url: str
#     is_official: bool
#     platform: PlatformOut
#     product: ProductOut

#     class Config:
#         orm_mode = True


# class FavoriteProductResponse(BaseModel):
#     favorite_id: int
#     user_id: int
#     product_platform_id: int
#     added_at: datetime
#     product_platform: ProductPlatformOut

#     class Config:
#         orm_mode = True


# class SearchHistoryBase(BaseModel):
#     query: str
#     user_id: int

# class SearchHistoryCreate(SearchHistoryBase):
#     pass

# class SearchHistoryOut(SearchHistoryBase):
#     search_id: int
#     search_time: datetime

#     class Config:
#         orm_mode = True

from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# ===================== USER =====================
class UserCreate(BaseModel):
    full_name: Optional[str] = None
    username: str
    email: EmailStr
    password_hash: str

class UserUpdate(BaseModel):
    username: str
    email: str
    password_hash: Optional[str] = None
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None

class UserOut(BaseModel):
    user_id: int
    username: str
    email: str
    password_hash: str
    full_name: Optional[str]
    phone_number: Optional[str]
    address: Optional[str]
    created_at: datetime

    class Config:
        orm_mode = True

# ===================== PLATFORM =====================
class PlatformOut(BaseModel):
    platform_id: Optional[int] = None  
    name: str
    logo_url: Optional[str] = None
    website_url: Optional[str] = None
    url: Optional[str] = None  
    class Config:
        orm_mode = True
        from_attributes = True

# ===================== PRODUCT =====================
class ProductOut(BaseModel):
    product_id: int
    name: str
    category_id: Optional[int] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
        from_attributes = True

class ProductSchema(ProductOut):
    pass  # Giữ để tương thích nếu bạn cần phân biệt

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    category_id: Optional[int] = None

class ProductPlatformCreate(BaseModel):
    product_id: int
    platform_id: int
    price: float
    discount: Optional[float] = 0
    discount_percentage: Optional[float] = 0
    rating: Optional[float] = 0
    review_count: Optional[int] = 0
    product_url: str
    shipping_fee: Optional[float] = 0
    estimated_delivery_time: Optional[str] = None
    is_official: Optional[bool] = False

# ===================== PRODUCT PLATFORM =====================
class ProductPlatformOut(BaseModel):
    product_platform_id: Optional[int] = None
    price: float
    discount: Optional[float] = None
    discount_percentage: Optional[float] = None
    shipping_fee: float
    rating: Optional[float] = None
    review_count: Optional[int] = None
    product_url: str
    estimated_delivery_time: Optional[str] = None
    is_official: Optional[bool] = None
    platform: PlatformOut
    product: Optional[ProductOut] = None 

    class Config:
        orm_mode = True
        from_attributes = True

# ===================== PRODUCT DETAIL WITH PLATFORMS =====================
# class ProductPlatformInfo(BaseModel):
#     price: float
#     discount: Optional[float]
#     discount_percentage: Optional[float]
#     rating: Optional[float]
#     review_count: Optional[int]
#     product_url: Optional[str]
#     shipping_fee: Optional[float]
#     estimated_delivery_time: Optional[str]
#     is_official: Optional[bool]
#     platform: PlatformOut

#     class Config:
#         orm_mode = True

# class ProductInfo(ProductOut):
#     product_platforms: List[ProductPlatformInfo] = Field(default_factory=list)

#     class Config:
#         orm_mode = True

class PlatformOut(BaseModel):
    platform_id: int
    name: str
    url: Optional[str]
    logo_url: Optional[str]

    class Config:
        from_attributes = True

class ProductPlatformInfo(BaseModel):
    product_platform_id: int
    price: float
    discount: Optional[float]
    discount_percentage: Optional[float]
    rating: Optional[float]
    review_count: Optional[int]
    product_url: Optional[str]
    shipping_fee: Optional[float]
    estimated_delivery_time: Optional[str]
    is_official: Optional[bool]
    platform: PlatformOut

    class Config:
        from_attributes = True


class ProductInfo(ProductOut):
    product_platforms: List[ProductPlatformInfo] = Field(default_factory=list)

    class Config:
        from_attributes = True

# ===================== FAVORITES =====================
class FavoriteCreate(BaseModel):
    product_id: int
    user_id: int
    product_platform_id: int

class FavoriteProductSchema(BaseModel):
    favorite_id: int
    user_id: int
    product_id: int
    added_at: datetime

    class Config:
        orm_mode = True

class FavoriteProductResponse(BaseModel):
    favorite_id: int
    user_id: int
    product_platform_id: int
    added_at: datetime
    product_platform: ProductPlatformOut

    class Config:
        orm_mode = True

# ===================== SEARCH HISTORY =====================
class SearchHistoryBase(BaseModel):
    query: str
    user_id: int

class SearchHistoryCreate(SearchHistoryBase):
    pass

class SearchHistoryOut(SearchHistoryBase):
    search_id: int
    search_time: datetime

    class Config:
        orm_mode = True

# ===================== PRODUCT CARD =====================
class ProductCardOut(BaseModel):
    productId: int
    productPlatformId: int
    platformLogo: str
    productImage: str
    currentPrice: str
    originalPrice: str
    discountPercentage: str
    shippingFee: str
    totalPrice: str
    isAvailable: bool
    rating: str
    productUrl: str

    class Config:
        orm_mode = True

