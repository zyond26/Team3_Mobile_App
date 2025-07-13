import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeSlider from '../components/HomeSlider';
import { router, useLocalSearchParams } from 'expo-router'; 
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { addToFavorites, BASE_URL, removeFromFavorites } from '@/constants';
import NavigationBar from '@/components/NavigationBar';
import CustomLoading from '@/components/CustomLoading';
import TripleRingLoader from '@/components/TripleRingLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteStates, setFavoriteStates] = useState(products.map(() => false));
  const params = useLocalSearchParams();
  const selectedCategory = params.category;
  const [refreshing, setRefreshing] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  
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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Gọi API hoặc load lại dữ liệu ở đây
    setTimeout(() => {
      setRefreshing(false); // Kết thúc refresh
    }, 2000);
  }, []);

  // useEffect(() => {
  //   axios.get(`${BASE_URL}/api/products`)
  //     .then((res) => {
  //       setProducts(res.data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error('Error fetching data', err);
  //       setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      const userId = await AsyncStorage.getItem("user_id");
      if (!userId) return;

      const resProduct = await axios.get(`${BASE_URL}/api/products`);
      const resFav = await axios.get(`${BASE_URL}/favorites/user/${userId}`);

      const favoriteIds = new Set(resFav.data.map((fav) => fav.product_platform_id));
      setFavoriteIds(favoriteIds);
      setProducts(resProduct.data);
      setLoading(false);
    };

    fetchData();
  }, []);


  // if (loading) {
  //   return <ActivityIndicator size="large" color="#000" />;
  // }

  // if (loading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size="large" color="#007BFF" />
  //       <Text style={{ marginTop: 10 }}>Đang tải dữ liệu...</Text>
  //     </View>
  //   );
  // }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TripleRingLoader />
        <Text style={{ marginTop: 10 }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  // Dữ liệu slider
  const sliderData = [
    {
      id: 1,
      image: require('../assets/images/adver.png'),
      title: 'adver pressed',
      link: ''
    },
    {
      id: 2,
      image: require('../assets/images/category.png'),
      title: 'Thời trang và phụ kiện',
      link: ''
    },
    {
      id: 3,
      image: require('../assets/images/comestic.png'),
      title: 'Mỹ phẩm',
      link: ''
    },
  ];

  const handleSliderItemPress = (item: any) => {
    // Xử lý khi người dùng nhấn vào slide
    console.log('Slider item pressed:', item.title);
    // Có thể mở link hoặc navigate đến trang chi tiết
  };

  const handleToggleFavorite = (index) => {
    setFavoriteStates((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:'white',  }}>
      <StatusBar 
      barStyle={'dark-content'}
      backgroundColor={'red'}
      >

      </StatusBar>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} 
      style={styles.container} 
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        {/* Thanh tìm kiếm */}
        {/* <View style={styles.headerContainer}>

          <View style={styles.searchBox}>
            <FontAwesome name="search" size={20} color="#D17842" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm"
              placeholderTextColor="#aaa"
            />
          </View>

          <View style={styles.logoContainer}>
            <Image
                source={require('../assets/images/logo1.png')}
                style={styles.logo}
            />
          </View>
        </View> */}

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Trang chủ</Text>
          <Image source={require('../assets/images/logo.png')} style={styles.logoContainer} />
        </View>

        {/* Home Slider */}
        <HomeSlider 
          data={sliderData}
          autoPlay={true}
          autoPlayInterval={4000}
          onItemPress={handleSliderItemPress}
        />

        <Text style={styles.sectionTitle}>Danh mục phổ biến</Text>
       <View style={styles.categoryGrid}>
          {[
            { 
              img: require('../assets/images/category.png'), 
              label: 'Thời trang & Phụ kiện',
              id: 1
            },
            { 
              img: require('../assets/images/comestic.png'), 
              label: 'Mỹ phẩm & Làm đẹp',
              id: 2
            },
            { 
              img: require('../assets/images/laptopmaytinhbang.png'), 
              label: 'Laptop & Tablet',
              id: 4
            },
            { 
              img: require('../assets/images/thietbithethao.png'), 
              label: 'Thiết bị thể thao',
              id: 5
            },
            { 
              img: require('../assets/images/dienthoaididong.jpg'), 
              label: 'Điện thoại di động',
              id: 3
            },
            { 
              img: require('../assets/images/dodunghoctap.png'), 
              label: 'Đồ dùng học tập',
              id: 6
            },
          ].map((cat) => (
            <TouchableOpacity
              key={`category-${cat.id}`}
              style={styles.categoryGridItem}
              onPress={() => {
                router.push({
                  pathname: "/drawer/explore",
                  params: { 
                    categoryId: cat.id.toString(), 
                    categoryName: cat.label 
                  }
                });
              }}
            >
              <View style={styles.categoryGridInner}>
                <View style={styles.categoryGridImage}>
                  <Image source={cat.img} style={styles.categoryGridImageContent} />
                </View>
                <View style={styles.categoryGridTitle}>
                  <Text style={styles.categoryGridTitleText}>{cat.label}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Khoảng cách giữa các section */}
        <View style={styles.sectionSpacing} />
        <Text style={styles.sectionTitle2}>Sản phẩm nổi bật</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 16 }}>
          <View style={{ flexDirection: 'row' }}>
          {products.map((item, index) => (
              <ProductCard
                key={`${item.productId}-${item.productPlatformId}`} 
                productId={item.productId}
                productPlatformId={item.productPlatformId}
                productName={item.productName}
                platformLogo={item.platformLogo}
                productImage={item.productImage}
                currentPrice={item.currentPrice}
                originalPrice={item.originalPrice}
                discountPercentage={item.discountPercentage}
                shippingFee={item.shippingFee}
                totalPrice={item.totalPrice}
                isAvailable={item.isAvailable}
                rating={item.rating}
                productUrl={item.productUrl}
                isFavorite={favoriteIds.has(item.productPlatformId)}
                onToggleFavorite={() => toggleFavorite(item.productId, item.productPlatformId)}
              />
            ))}
          </View>
        </ScrollView>
        {/* Khoảng cách giữa các section */}
        <View style={styles.userReviewsContainer}>
          <Text style={styles.ratingTitle}>Đánh giá từ người dùng</Text>
          {/* Khoảng cách giữa các section */}
          <View style={styles.sectionSpacing} />
          {[
            {
              name: 'Minh Choco',
              avatar: require('../assets/images/avatar.png'),
              stars: 5,
              comment: 'Ứng dụng xịn sò dễ dùng cực luôn!',
            },
            {
              name: 'Thảo Milk',
              avatar: require('../assets/images/cat.jpg'),
              stars: 4,
              comment: 'Giao diện cute quá trời luôn, mỗi tội hơi lag tí.',
            },
            {
              name: 'Tuấn Dev',
              avatar: require('../assets/images/cat1.jpg'),
              stars: 5,
              comment: 'Quá tuyệt vời, tìm sản phẩm nhanh lẹ. Rất recommend!',
            },
            {
              name: 'Hà Lười',
              avatar: require('../assets/images/dog1.jpg'),
              stars: 3,
              comment: 'Tạm ổn nha, giao diện đẹp nhưng cần thêm sản phẩm ',
            },
            {
              name: 'Trang Mèo',
              avatar: require('../assets/images/dog2.jpg'),
              stars: 5,
              comment: 'App đáng yêu như chính tui vậy. Dùng là nghiện!',
            },
          ].map((user, index) => (
            <View key={index} style={styles.reviewItem}>
              <Image source={user.avatar} style={styles.reviewAvatar} />
              <View style={styles.reviewContent}>
                <Text style={styles.reviewerName}>{user.name}</Text>
                <View style={styles.starsRow}>
                  {[...Array(user.stars)].map((_, i) => (
                    <FontAwesome key={i} name="star" size={16} color="#FFD700" />
                  ))}
                </View>
                <Text style={styles.reviewText}>{user.comment}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Khoảng cách giữa các section */}
      <View style={styles.sectionSpacing} />

      {/* Thanh điều hướng dưới cùng */}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  //HEADER

  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#fff',
    marginTop:-30,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuButton: {
    marginRight: 10,
  },
  logoContainer: {
    width: 60, 
    height: 50, 
    overflow: 'hidden', 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    },
  logo: {
    width: '110%', 
    height: '100%', 
    resizeMode: 'contain', 
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 50,
    flex: 1,
  },
    sectionSpacing: {
    height: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
  },


  //BANNER

  adBanner: {
    backgroundColor: '#FF0000',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  adText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    height:100,
  },

 adContainer: {
    width: '100%', 
    alignItems: 'center', 
    marginTop: 1, 
    marginBottom: 1, 
  },
  adImage: {
    width: '100%', 
    height: undefined,
    aspectRatio: 1.77, 
    marginTop: -10, 
  },

  //DANH MỤC

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom: 20,
    color: '#333',
  },

  sectionTitle2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 7,
    color: '#333',
  },

  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryCard: {
    backgroundColor: '#FF9966',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    width: 200,
  },
  categoryImage: {
    width: 70,
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  categoryText: {
    textAlign: 'center',
    fontSize:16,
    
  },
  productCard: {
    backgroundColor: '#FF9966',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    width: 150,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex:1,
  },
 bottomTabContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#D17842',
    paddingVertical: 14,
    borderRadius: 20,
    width: 375,
    marginBottom:20,
    shadowColor: '#999',
   
  },
  tab: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    color: '#000',
    marginTop: 4,
  },
    productName: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 6,
  },
  productPrice: {
    fontSize: 13,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryGridItem: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  categoryGridInner: {
    width: '100%',
  },
  categoryGridImage: {
    width: '100%',
    height: 120,
    overflow: 'hidden',
  },
  categoryGridImageContent: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryGridTitle: {
    padding: 10,
    backgroundColor: '#9E1111',
  },
  categoryGridTitleText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    textAlign: 'center',
  },

 //SẢN PHẨM

    card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: 180,
    alignItems: 'center',
    backgroundColor: 'white',
    marginLeft: 0,
    marginRight:10,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,

    elevation: 6,
  },
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
    
  },
  logo1: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  image: {
    width: 140,
    height: 160,
    resizeMode: 'contain',
    
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    marginRight: 5,
  },
  discount: {
    color: 'red',
  },
  currentPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
  details: {
    marginVertical: 10,
  },
  rating: {
    color: '#888',
  },
  buyButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  cartIcon: {
    marginRight: 5,
  },
  status: {
    marginBottom: 2,
    color: '#000',
  },
  statusValue: {
    fontWeight: 'bold',
    color: 'green',
  },
  // style đánh giá
  ratingTitle:{
    fontSize: 20,
  },
 userReviewsContainer: {
  marginTop: 24,
  padding: 16,
  backgroundColor: '#fff0f5',
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#f5c6da',
},
reviewItem: {
  flexDirection: 'row',
  marginBottom: 16,
},
reviewAvatar: {
  width: 40,
  height: 40,
  borderRadius: 20,
  marginRight: 12,
},
reviewContent: {
  flex: 1,
},
reviewerName: {
  fontWeight: 'bold',
  fontSize: 14,
},
reviewText: {
  fontSize: 13,
  marginTop: 4,
  color: '#333',
},
starsRow: {
  flexDirection: 'row',
  marginTop: 2,
},

});