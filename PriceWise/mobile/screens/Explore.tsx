import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Button,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { BASE_URL, search, addToFavorites, removeFromFavorites } from '@/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RefreshWrapper from '@/components/RefreshWrapper';
import axios from 'axios';
import TripleRingLoader from '@/components/TripleRingLoader';
    
interface ProductItem {
  logo_url?: string;
  product_platform_id: number;
  product_id: number;
  name: string;
  image_url: string;
  price: number;
  platform: string;
}

type ResultItem = {
  product_id: number;
  product_platform_id: number;
  platform_id: number;
  price: number;
  shipping_fee: number;
  product_url: string;
  product: {
    image_url: string;
  };
  platform: {
    name: string;
  };
};

export default function Explore() {
  const { categoryId, categoryName } = useLocalSearchParams<{
    categoryId?: string;
    categoryName?: string;
  }>();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [selectedCategory, setSelectedCategory] = useState<{ id: string, label: string } | null>(null);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<ResultItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    { id: '1', label: ' Thời trang & phụ kiện' },
    { id: '2', label: ' Mỹ phẩm & làm đẹp' },
    { id: '3', label: ' Điện thoại di động' },
    { id: '4', label: ' Laptop & máy tính bảng' },
    { id: '5', label: ' Thiết bị thể thao' },
    { id: '6', label: ' Đồ dùng học tập' },
  ];

  useEffect(() => {
    if (searchText.trim()) {
      handleSearch();
    }
  }, [minPrice, maxPrice]);

  useEffect(() => {
  if (!categoryId) return;

  setLoading(true);

  setSelectedCategory({
    id: String(categoryId),
    label: categoryName || '',
  });

  fetch(`${BASE_URL}/products/by-category/${categoryId}`)
    .then((res) => res.json())
    .then((data) => {
      setProducts(data || []);
      setResults([]);
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      setProducts([]);
    })
    .finally(() => setLoading(false));
}, [categoryId, categoryName]);


  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userIdStr = await AsyncStorage.getItem('user_id');
        if (!userIdStr) return;

        const userId = parseInt(userIdStr);
        const res = await axios.get(`${BASE_URL}/favorites/user/${userId}`);
        const data = res.data;

        const favIds = new Set(data.map((f: any) => f.product_platform_id)); 
        setFavoriteIds(favIds);

      } catch (error) {
        console.error('Lỗi khi tải sản phẩm yêu thích:', error);
      }
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = async (productId: number, productPlatformId: number) => {
    const userIdStr = await AsyncStorage.getItem('user_id');
    if (!userIdStr) {
      Alert.alert("Thông báo", "Vui lòng đăng nhập để sử dụng chức năng yêu thích.");
      return;
    }

    const userId = parseInt(userIdStr);
    const isFav = favoriteIds.has(productPlatformId);

    try {
      if (isFav) {
        await removeFromFavorites(productId, userId, productPlatformId);
        setFavoriteIds((prev) => {
          const updated = new Set(prev);
          updated.delete(productPlatformId);
          return updated;
        });
        Alert.alert("Đã xoá khỏi yêu thích");
      } else {
        await addToFavorites(productId, userId, productPlatformId);
        setFavoriteIds((prev) => new Set(prev).add(productPlatformId));
        Alert.alert("Đã thêm vào yêu thích");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý yêu thích:", error);
      Alert.alert("Lỗi", "Không thể xử lý yêu thích.");
    }
  };

  const handleSearch = async () => {
    try {
      const userIdStr = await AsyncStorage.getItem('user_id');
      if (!userIdStr) {
        Alert.alert("Thông báo", "Vui lòng đăng nhập để sử dụng chức năng tìm kiếm.");
        return;
      }

      const userId = parseInt(userIdStr);

      setLoading(true); 

      // Gọi API tìm kiếm
      const res = await search(searchText);
      const data = res.data || [];

      // Gửi từ khóa vào Search History
      await axios.post(`${BASE_URL}/search-history/`, {
        query: searchText,
        user_id: userId,
      });

      // Hiển thị kết quả
      const allCards: ResultItem[] = data.flatMap((product) => {
        if (!product.product_platforms || product.product_platforms.length === 0) return [];

        return product.product_platforms.map((pf) => ({
          product_id: product.product_id,
          product_platform_id: pf.product_platform_id, 
          platform_id: pf.platform.platform_id,
          price: pf.price,
          shipping_fee: pf.shipping_fee,
          product_url: pf.product_url,
          product: {
            image_url: product.image_url || '',
          },
          platform: {
            name: pf.platform.name || '',
          },
        }));
      });

      const filtered = allCards.filter(
        (item) => item.price >= minPrice && item.price <= maxPrice
      );

      setResults(filtered);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert("Lỗi", "Không thể tìm kiếm sản phẩm.");
    } finally {
      setLoading(false); 
    }
  };
  
  const handleRefreshExplore = async () => {
    if (!categoryId) return;

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/products/by-category/${categoryId}`);
      const data = await res.json();
      setProducts(data || []);
      setResults([]);
    } catch (err) {
      console.error("Refresh error:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const renderProductCard = (
    productId: number,
    productPlatformId: number,
    imageUrl: string,
    name: string,
    price: number,
    platformName?: string
  ) => (
    <View key={`product-${productPlatformId}`} style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.productImage} />
      <Text style={styles.productName}>{name}</Text>
      <Text style={styles.price}>{price.toLocaleString()} đ</Text>
      <Text style={styles.seller}>{platformName || name}</Text>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.compareButton}
          onPress={() =>
            router.push({
              pathname: '/compare',
              params: {
                productId: productId.toString(),
              },
            })
          }
        >
          <FontAwesome name="exchange" size={14} color="#fff" />
          <Text style={styles.compareButtonText}>So sánh</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => toggleFavorite(productId, productPlatformId)}
          style={styles.favoriteButton}
        >
          <FontAwesome
            name={favoriteIds.has(productPlatformId) ? 'heart' : 'heart-o'}
            size={16}
            color={favoriteIds.has(productPlatformId) ? 'red' : '#333'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const displayProducts = results.length > 0
  ? results.map((item) =>
      renderProductCard(
        Number(item.product_id),
        Number(item.product_platform_id),
        item.product.image_url,
        '',
        item.price,
        item.platform.name
      )
    )
  : products
    .filter((p) => p.price >= minPrice && p.price <= maxPrice)
    .map((p) =>
      renderProductCard(
        p.product_id,
        p.product_platform_id,
        p.image_url,
        p.name,
        p.price,
        p.platform
      )
    );


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TripleRingLoader />
        <Text style={{ marginTop: 10 }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Danh mục: {categoryName}</Text>

      {/* Search input */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Tìm sản phẩm..."
          placeholderTextColor={'#9C9C9C'}
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
       <TouchableOpacity onPress={handleSearch}>
          <FontAwesome name="search" size={20} color="#333" style={{ marginLeft: 8, color: '#007BFF'}} />
        </TouchableOpacity>
      </View>

      {/* Filter options */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterBox} onPress={() => setShowPriceFilter(true)}>
          <FontAwesome name="filter" size={16} color="#333" />
          <Text style={styles.filterText}>
            Giá từ {minPrice.toLocaleString()}đ đến {maxPrice.toLocaleString()}đ
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterBox} onPress={() => setShowCategoryFilter(true)}>
          <FontAwesome name="tags" size={16} color="#333" />
          <Text style={styles.filterText}>
            Danh mục: {selectedCategory ? selectedCategory.label : 'Chọn'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Price Filter Modal */}
      <Modal visible={showPriceFilter} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn khoảng giá</Text>
            <Text>Giá từ: {minPrice.toLocaleString()} đ</Text>
            <Slider minimumValue={0} maximumValue={50000000} step={1000000} value={minPrice} onValueChange={setMinPrice} />
            <Text>Đến: {maxPrice.toLocaleString()} đ</Text>
            <Slider minimumValue={0} maximumValue={50000000} step={1000000} value={maxPrice} onValueChange={setMaxPrice} />
            <Text style={styles.filterText}>
              {minPrice.toLocaleString()}đ - {maxPrice.toLocaleString()}đ
            </Text>
           <Button
              title="Áp dụng"
              onPress={() => {
                setShowPriceFilter(false);

                // Nếu đang có tìm kiếm thì áp dụng lọc cho kết quả tìm kiếm
                if (searchText.trim()) {
                  handleSearch();
                }
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Category Filter Modal */}
      <Modal visible={showCategoryFilter} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn danh mục</Text>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryOption, selectedCategory?.id === cat.id && styles.selectedCategory]}
                onPress={() => {
                  setSelectedCategory(cat);
                  setShowCategoryFilter(false);
                  router.push({
                    pathname: "/drawer/explore",
                    params: {
                      categoryId: cat.id,
                      categoryName: cat.label,
                    },
                  });
                }}
              >
                <Text style={[styles.categoryText, selectedCategory?.id === cat.id && styles.selectedText]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
            <Button title="Đóng" onPress={() => setShowCategoryFilter(false)} />
          </View>
        </View>
      </Modal>

      {/* Results */}
      {/* <RefreshWrapper onRefresh={handleRefreshExplore} style={{ paddingBottom: 100 }}>
        {searchText ? (
          <Text style={styles.resultsText}>{results.length} kết quả cho "{searchText}"</Text>
        ) : null}
        <View style={styles.productRow}>{displayProducts}</View>
      </RefreshWrapper> */}
      <RefreshWrapper onRefresh={handleRefreshExplore} style={{ paddingBottom: 100 }}>
        {searchText ? (
          <Text style={styles.resultsText}>{results.length} kết quả cho "{searchText}"</Text>
        ) : null}

       {searchText && results.length === 0 ? (
        <View style={styles.emptyWrapper}>
            <View style={styles.emptyContent}>
              <FontAwesome name="search" size={64} color="#999" />
              <Text style={styles.emptyText}>Không tìm thấy kết quả nào</Text>
            </View>
        </View>

      ) : !searchText && results.length === 0 && products.length === 0 ? (
       <ImageBackground
        source={require('../assets/images/logo.png')}
        style={styles.fullBackgroundImage}
        imageStyle={{ opacity: 0.25 }} 
        resizeMode='contain'
      >
        <View style={styles.overlayContent}>
          <Text style={styles.suggestTitle}>Khám phá danh mục</Text>

          <View style={styles.suggestGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.suggestBox}
                onPress={() =>
                  router.push({
                    pathname: '/drawer/explore',
                    params: { categoryId: cat.id, categoryName: cat.label },
                  })
                }
              >
                <Text style={styles.suggestText}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ImageBackground>
      ) : (
        <View style={styles.productRow}>{displayProducts}</View>
      )}
      </RefreshWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8FF',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
  },
  cancelText: {
    marginLeft: 10,
    color: '#007AFF',
    fontWeight: '600'
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  filterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    flex: 1,
  },
  filterText: {
    marginLeft: 5,
    fontSize: 12,
  },
  resultsText: {
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '600'
  },
  productRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  card: {
    width: '45%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 16,
    marginHorizontal: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 6,
  },
  heartButton: {
    padding: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  price: {
    color: '#E53935',
    fontWeight: 'bold',
  },
  seller: {
    fontSize: 12,
    color: '#333',
  },
  ship: {
    fontSize: 10,
    color: 'green',
    marginBottom: 4,
  },
  buyButton: {
    backgroundColor: '#D17842',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  selectedCategory: {
    backgroundColor: '#D17842',
    borderColor: '#D17842',
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logo: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    position: 'absolute',
    top: 8,
    right: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  compareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  compareButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '600',
  },
  favoriteButton: {
    padding: 6,
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    marginRight: 12,
  },
  catText: {
    fontSize: 16,
    color: '#555',
  },
  emptyWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    height: 300,
    position: 'relative',
  },
  emptyBackground: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  emptyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  emptyText: {
    color: '#111',
    marginTop: 16,
    fontSize: 18,
    fontWeight: '500',
  },
  suggestionBackground: {
    marginTop: 10,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  suggestTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  suggestGrid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 18,
  },
  suggestBox: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    margin: 6,
    elevation: 2,
  },
  suggestText: {
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  fullBackgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlayContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  

});
