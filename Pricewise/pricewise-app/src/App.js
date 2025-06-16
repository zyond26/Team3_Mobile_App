import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    FiSearch, FiFilter, FiStar, FiShoppingCart, FiHeart, FiTrendingUp, FiClock
} from "react-icons/fi";

function App() {
    const [searchTerm, setSearchTerm] = useState("");
    const [products, setProducts] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [filters, setFilters] = useState({
        minPrice: "",
        maxPrice: "",
        platform: "all",
        sortBy: "totalPrice",
    });
    const [trendingProducts, setTrendingProducts] = useState([]);

    const apiUrl = "http://127.0.0.1:8000/products/search";

    // Lấy sản phẩm trending khi component mount

    // Thêm hàm reset trang vào component
    const resetHomepage = () => {
        setSearchTerm('');
        setProducts([]);
    };


    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const response = await axios.get(apiUrl, { params: { name: "a" } });
                setTrendingProducts(response.data.slice(0, 4));
            } catch (error) {
                console.error("Error fetching trending:", error);
            }
        };
        fetchTrending();
    }, []);


    // Gợi ý tìm kiếm khi nhập
    useEffect(() => {
        if (searchTerm.length > 2) {
            const timer = setTimeout(() => {
                axios.get(apiUrl, { params: { name: searchTerm } })
                    .then(res => setSuggestions(res.data.map(p => p.product_name)))
                    .catch(err => console.error(err));
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setSuggestions([]);
        }
    }, [searchTerm]);

    const searchProducts = async () => {
        if (!searchTerm.trim()) return;
        try {
            const response = await axios.get(apiUrl, { params: { name: searchTerm } });
            setProducts(response.data);
        } catch (error) {
            console.error("Error:", error);
            alert("Không tìm thấy sản phẩm hoặc lỗi kết nối");
            setProducts([]);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const calculateDiscount = (originalPrice, currentPrice) => {
        if (!originalPrice || originalPrice <= currentPrice) return 0;
        return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    };

    const calculateTotalPrice = (price, shippingFee) => {
        return parseFloat(price) + parseFloat(shippingFee || 0);
    };

    const applyFilters = () => {
        return products.map(product => {
            let filteredVariants = product.variants;

            // Lọc theo khoảng giá
            if (filters.minPrice) {
                filteredVariants = filteredVariants.filter(v => v.price >= parseFloat(filters.minPrice));
            }
            if (filters.maxPrice) {
                filteredVariants = filteredVariants.filter(v => v.price <= parseFloat(filters.maxPrice));
            }

            // Lọc theo sàn
            if (filters.platform !== "all") {
                filteredVariants = filteredVariants.filter(v => v.ecom_platform.toLowerCase() === filters.platform);
            }

            // Sắp xếp
            filteredVariants = [...filteredVariants].sort((a, b) => {
                const totalA = calculateTotalPrice(a.price, a.shipping_fee);
                const totalB = calculateTotalPrice(b.price, b.shipping_fee);

                switch (filters.sortBy) {
                    case "totalPrice": return totalA - totalB;
                    case "rating": return (b.seller_rating || 0) - (a.seller_rating || 0);
                    case "discount":
                        return calculateDiscount(b.original_price, b.price) - calculateDiscount(a.original_price, a.price);
                    default: return 0;
                }
            });

            return { ...product, variants: filteredVariants };
        });
    };

    const filteredProducts = applyFilters();

    // --------------------- Thêm state lịch sử xem -------------------------

    const [viewedProducts, setViewedProducts] = useState([]);

    // Hàm thêm sản phẩm vào lịch sử
    const addToViewedHistory = (product) => {
        setViewedProducts(prev => {
            // Loại bỏ nếu đã tồn tại
            const filtered = prev.filter(p => p.product_code !== product.product_code);
            // Giới hạn tối đa 5 sản phẩm
            return [product, ...filtered].slice(0, 5);
        });
    };

    // Sửa hàm searchProducts để tự động lưu khi xem chi tiết
    const searchProductsWithHistory = async () => {
        if (!searchTerm.trim()) return;
        try {
            const response = await axios.get(apiUrl, { params: { name: searchTerm } });
            setProducts(response.data);
            // Lưu sản phẩm đầu tiên vào lịch sử
            if (response.data.length > 0) {
                addToViewedHistory(response.data[0]);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Không tìm thấy sản phẩm hoặc lỗi kết nối");
            setProducts([]);
        }
    };

    return (
        <div className="app" style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: 20,
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            backgroundColor: "#f8f9fa"
        }}>


            {/*-------------------- Header  -------------------------*/}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 30,
                paddingBottom: 20,
                borderBottom: '1px solid #e0e0e0'
            }}>
                <h1
                    style={{
                        color: '#2a52be',
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        cursor: 'pointer'
                    }}
                    onClick={resetHomepage}
                >
                    <FiTrendingUp size={28} /> Pricewise
                </h1>
                <div style={{ position: 'relative', width: '50%' }}>
                    <div style={{ display: 'flex' }}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                padding: '10px 15px',
                                width: '100%',
                                border: '1px solid #ddd',
                                borderRadius: '4px 0 0 4px',
                                fontSize: 16
                            }}
                            onKeyDown={(e) => { if (e.key === 'Enter') searchProductsWithHistory(); }}
                        />
                        <button
                            onClick={searchProductsWithHistory}
                            style={{
                                padding: 15,
                                width: 150,
                                backgroundColor: '#2a52be',
                                color: 'white',
                                border: 'none',
                                borderRadius: 3,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                fontWeight: 'bold',
                                fontSize: 13


                            }}
                        >
                            <FiSearch size={20} /> Tìm kiếm
                        </button>
                    </div>

                    {/* ---------------Gợi ý tìm kiếm ----------------*/}
                    {suggestions.length > 0 && (
                        <ul style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            backgroundColor: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '0 0 4px 4px',
                            marginTop: 0,
                            padding: 0,
                            zIndex: 100,
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            {suggestions.slice(0, 5).map((suggestion, index) => (
                                <li
                                    key={index}
                                    style={{
                                        padding: '10px 15px',
                                        cursor: 'pointer',
                                        listStyle: 'none',
                                        borderBottom: '1px solid #eee',
                                        ':hover': {
                                            backgroundColor: '#f5f5f5'
                                        }
                                    }}
                                    onClick={() => {
                                        setSearchTerm(suggestion);
                                        setSuggestions([]);
                                    }}
                                >
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </header>

            {/*----------------- Lịch sử xem sản phẩm -------------------------*/}

            {/* Kiểm tra nếu có sản phẩm đã xem và hiển thị */}
            {viewedProducts.length > 0 && (
                <div style={{ marginBottom: 30 }}>
                    <h3 style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        color: '#333',
                        marginBottom: 15
                    }}>
                        <FiClock size={20} /> Sản phẩm đã xem
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: 15
                    }}>
                        {viewedProducts.map((product, index) => (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: 8,
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    ':hover': {
                                        transform: 'translateY(-5px)'
                                    }
                                }}
                                onClick={() => {
                                    setSearchTerm(product.product_name);
                                    searchProducts();
                                }}
                            >
                                {product.variants[0]?.image_url && (
                                    <img
                                        src={product.variants[0].image_url}
                                        alt={product.product_name}
                                        style={{
                                            width: '100%',
                                            height: 120,
                                            objectFit: 'cover',
                                            borderBottom: '1px solid #eee'
                                        }}
                                    />
                                )}
                                <div style={{ padding: 10 }}>
                                    <h4 style={{
                                        margin: '5px 0',
                                        fontSize: 14,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {product.product_name}
                                    </h4>
                                    <p style={{
                                        margin: 0,
                                        fontWeight: 'bold',
                                        color: '#d70018',
                                        fontSize: 14
                                    }}>
                                        {formatPrice(Math.min(...product.variants.map(v => v.price)))}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}


            {/*----------------- Bộ lọc sản phẩm -------------------------*/}

            <div style={{
                backgroundColor: 'white',
                padding: '15px 20px',
                borderRadius: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginBottom: 25,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 15,
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FiFilter size={18} color="#666" />
                    <span style={{ fontWeight: 500 }}>Bộ lọc:</span>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <label>Giá từ</label>
                    <input
                        type="number"
                        placeholder="Tối thiểu"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                        style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, width: 100 }}
                    />
                    <span>đến</span>
                    <input
                        type="number"
                        placeholder="Tối đa"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                        style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4, width: 100 }}
                    />
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <label>Sàn:</label>
                    <select
                        value={filters.platform}
                        onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
                        style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4 }}
                    >
                        <option value="all">Tất cả</option>
                        <option value="shopee">Shopee</option>
                        <option value="lazada">Lazada</option>
                        <option value="tiki">Tiki</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <label>Sắp xếp:</label>
                    <select
                        value={filters.sortBy}
                        onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                        style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4 }}
                    >
                        <option value="totalPrice">Giá tốt nhất</option>
                        <option value="rating">Đánh giá cao</option>
                        <option value="discount">Giảm giá nhiều</option>
                    </select>
                </div>
            </div>

            {/*---------------------- Sản phẩm trending ----------------- */}
            {products.length === 0 && (
                <div style={{ marginBottom: 30 }}>
                    <h3 style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        color: '#333',
                        marginBottom: 15
                    }}>
                        <FiTrendingUp size={20} /> Sản phẩm phổ biến
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: 20
                    }}>
                        {trendingProducts.map((product) => (
                            <div
                                key={product.product_code}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: 8,
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s',
                                    ':hover': {
                                        transform: 'translateY(-5px)'
                                    }
                                }}
                                onClick={() => {
                                    setSearchTerm(product.product_name);
                                    searchProductsWithHistory();
                                }}
                            >
                                {product.variants[0]?.image_url && (
                                    <img
                                        src={product.variants[0].image_url}
                                        alt={product.product_name}
                                        style={{
                                            width: '100%',
                                            height: 180,
                                            objectFit: 'cover',
                                            borderBottom: '1px solid #eee'
                                        }}
                                    />
                                )}
                                <div style={{ padding: 15 }}>
                                    <h4 style={{
                                        margin: '0 0 10px',
                                        fontSize: 16,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {product.product_name}
                                    </h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{
                                            fontWeight: 'bold',
                                            color: '#d70018',
                                            fontSize: 16
                                        }}>
                                            {formatPrice(Math.min(...product.variants.map(v => v.price)))}
                                        </span>
                                        {product.variants.some(v => v.original_price > v.price) && (
                                            <span style={{
                                                backgroundColor: '#d70018',
                                                color: 'white',
                                                padding: '2px 6px',
                                                borderRadius: 10,
                                                fontSize: 12,
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 3
                                            }}>
                                                <FiStar size={12} />
                                                {Math.max(...product.variants.map(v =>
                                                    calculateDiscount(v.original_price, v.price)
                                                ))}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ----------------Kết quả tìm kiếm------------------ */}

            {filteredProducts.length > 0 && (
                <div>
                    <h3 style={{ color: '#333', marginBottom: 15 }}>
                        {filteredProducts.length} kết quả cho "{searchTerm}"
                    </h3>

                    {filteredProducts.map((product) => (
                        <div
                            key={product.product_code}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: 8,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                marginBottom: 25,
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{
                                padding: '15px 20px',
                                borderBottom: '1px solid #eee',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>{product.product_name}</h3>
                                    <p style={{
                                        margin: '5px 0 0',
                                        color: '#666',
                                        fontSize: 14
                                    }}>
                                        Mã SP: {product.product_code} | Đánh giá: {product.rating} ★ ({product.review_count} lượt)
                                    </p>
                                </div>
                                <button style={{
                                    backgroundColor: '#f0f0f0',
                                    border: 'none',
                                    borderRadius: 20,
                                    padding: '8px 15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 5,
                                    cursor: 'pointer'
                                }}>
                                    <FiHeart size={16} /> Theo dõi
                                </button>
                            </div>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: 0
                            }}>
                                {product.variants.map((variant, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            padding: 15,
                                            borderRight: '1px solid #eee',
                                            borderBottom: '1px solid #eee',
                                            position: 'relative',
                                            backgroundColor: index === 0 ? '#f9f9ff' : 'white'
                                        }}
                                    >
                                        {index === 0 && (
                                            <div style={{
                                                position: 'absolute',
                                                width: '80px',
                                                height: 26,
                                                right: -6,
                                                left: 100,
                                                top: 1,
                                                borderRadius: '0 0 0 20px',
                                                color: 'white',
                                                fontSize: 12,
                                                lineHeight: '20px',
                                                textAlign: 'center',
                                                backgroundColor: '#3cb312',
                                                fontWeight: 'bold',
                                            }}>
                                                Đề xuất
                                            </div>
                                        )}

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: 10
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 5
                                            }}>
                                                <img
                                                    src={`https://logo.clearbit.com/${variant.ecom_platform.toLowerCase()}.com`}
                                                    alt={variant.ecom_platform}
                                                    style={{ width: 20, height: 20 }}
                                                />
                                                <span style={{ fontWeight: 'bold' }}>{variant.ecom_platform}</span>
                                            </div>
                                            {variant.stock_status === 'OutOfStock' ? (
                                                <span style={{ color: 'red', fontSize: 14 }}>Hết hàng</span>
                                            ) : (
                                                <span style={{ color: 'green', fontSize: 14 }}>Còn hàng</span>
                                            )}
                                        </div>

                                        {variant.image_url && (
                                            <img
                                                src={variant.image_url}
                                                alt={product.product_name}
                                                style={{
                                                    width: '100%',
                                                    height: 120,
                                                    objectFit: 'contain',
                                                    margin: '10px 0'
                                                }}
                                            />
                                        )}

                                        <div style={{ margin: '10px 0' }}>
                                            <p style={{
                                                fontSize: 20,
                                                fontWeight: 'bold',
                                                color: '#d70018',
                                                margin: '5px 0'
                                            }}>
                                                {formatPrice(variant.price)}
                                            </p>

                                            {variant.original_price && variant.original_price > variant.price && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <p style={{
                                                        textDecoration: 'line-through',
                                                        color: '#666',
                                                        margin: '5px 0',
                                                        fontSize: 14
                                                    }}>
                                                        {formatPrice(variant.original_price)}
                                                    </p>
                                                    <span style={{
                                                        backgroundColor: '#d70018',
                                                        color: 'white',
                                                        padding: '2px 8px',
                                                        borderRadius: 10,
                                                        fontSize: 12,
                                                        fontWeight: 'bold'
                                                    }}>
                                                        -{calculateDiscount(variant.original_price, variant.price)}%
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ margin: '10px 0', fontSize: 14 }}>
                                            <p style={{ margin: '5px 0' }}>
                                                <span style={{ color: '#666' }}>Phí VC:</span> {formatPrice(variant.shipping_fee)}
                                            </p>
                                            <p style={{ margin: '5px 0' }}>
                                                <span style={{ color: '#666' }}>Tổng:</span> {formatPrice(variant.price + variant.shipping_fee)}
                                            </p>
                                            <p style={{ margin: '5px 0', display: 'flex', alignItems: 'center', gap: 5 }}>
                                                <FiStar color="#FFC107" /> {variant.seller_rating ? `${variant.seller_rating}/5` : 'Chưa có đánh giá'}
                                            </p>
                                        </div>

                                        <a
                                            href={variant.product_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: 'block',
                                                textAlign: 'center',
                                                backgroundColor: index === 0 ? '#2a52be' : '#ff5722',
                                                color: 'white',
                                                padding: '10px',
                                                borderRadius: 4,
                                                textDecoration: 'none',
                                                marginTop: 15,
                                                fontWeight: 'bold',
                                                transition: 'opacity 0.2s',
                                                ':hover': {
                                                    opacity: 0.9
                                                }
                                            }}
                                        >
                                            <FiShoppingCart style={{ marginRight: 8 }} />
                                            Tới nơi bán
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;