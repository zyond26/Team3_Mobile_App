import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import HomeSlider from '../components/HomeSlider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';

export default function HomeScreen() {
  const navigation = useNavigation();

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

  // Đặt biến trạng thái cho từng card trước phần return hoặc trong component
  const isAvailable1 = true;  // Card 1: còn hàng
  const isAvailable2 = true;  // Card 2: còn hàng
  const isAvailable3 = false; // Card 3: hết hàng
  const isAvailable4 = true;  // Card 4: còn hàng

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} style={[styles.container, { marginTop: 20 }]}>
        {/* Thanh tìm kiếm */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <FontAwesome name="bars" size={20} color="#333" />
          </TouchableOpacity>

          <View style={styles.searchBox}>
            <FontAwesome name="search" size={20} color="#D17842" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm"
              placeholderTextColor="#aaa"
            />
          </View>

          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
        </View>

        {/* Home Slider */}
        <HomeSlider
          data={sliderData}
          autoPlay={true}
          autoPlayInterval={4000}
          onItemPress={handleSliderItemPress}
        />

        <Text style={styles.sectionTitle}>Danh mục phổ biến</Text>

        {/* Grid Categories */}
        <View style={styles.categoryGrid}>
          {[
            {
              img: require('../assets/images/category.png'),
              label: 'Thời trang&Phụ kiện',
              link: ''
            },
            {
              img: require('../assets/images/comestic.png'),
              label: 'Mỹ phẩm & Làm đẹp',
              link: ''
            },
            {
              img: require('../assets/images/laptopmaytinhbang.png'),
              label: 'Laptop và Tablet',
              link: ''
            },
            {
              img: require('../assets/images/thietbithethao.png'),
              label: 'Thiết bị thể thao',
              link: ''
            },
            {
              img: require('../assets/images/dienthoaididong.jpg'),
              label: 'Điện thoại di động',
              link: ''
            },
            {
              img: require('../assets/images/dodunghoctap.png'),
              label: 'Đồ dùng học tập',
              link: ''
            },
          ].map((cat, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryGridItem}
              onPress={() => {
                // Xử lý khi nhấn vào category
                console.log('Category pressed:', cat.label);
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
        <Text style={styles.sectionTitle}>Sản phẩm nổi bật</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 16 }}>
          <View style={styles.card}>
            {/* Top Icons */}
            <View style={styles.topIcons}>
              <Image
                source={require('../assets/images/Shoppe.jpg')} // Replace with Shopee logo URL or local image
                style={styles.logo1}
              />
              <TouchableOpacity>
                {/* <Icon name="favorite-border" size={24} color="#FF2D55" /> */}
              </TouchableOpacity>
            </View>

            {/* Image Section */}
            <Image
              source={require('../assets/images/IP15.jpg')} // Replace with your image URL or local image
              style={styles.image}
            />

            {/* Price Section */}
            <Text style={styles.currentPrice}>32.990.000 đ</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.originalPrice}>34.490.000 đ</Text>
              <Text style={styles.discount}>-4%</Text>
            </View>


            {/* Details Section */}
            <View style={styles.details}>
              <Text>Phí VC: 0 đ</Text>
              <Text>Tổng: 32.990.000 đ</Text>
              <Text style={styles.status}>
                Trạng thái: <Text style={[styles.statusValue, { color: isAvailable1 ? 'green' : 'red' }]}>{isAvailable1 ? 'Còn hàng' : 'Hết hàng'}</Text>
              </Text>
              <Text style={styles.rating}>⭐ Chưa có đánh giá</Text>
            </View>

            {/* Buy Button with Cart Icon */}
            <TouchableOpacity style={styles.buyButton}>
              <Icon name="shopping-cart" size={18} color="white" style={styles.cartIcon} />
              <Text style={styles.buyButtonText}>Tới nơi bán</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {/* Top Icons */}
            <View style={styles.topIcons}>
              <Image
                source={require('../assets/images/Lazada.jpg')} // Replace with Shopee logo URL or local image
                style={styles.logo1}
              />
              <TouchableOpacity>
                {/* <Icon name="favorite-border" size={24} color="#FF2D55" /> */}
              </TouchableOpacity>
            </View>

            {/* Image Section */}
            <Image
              source={require('../assets/images/Nitendo.jpg')} // Replace with your image URL or local image
              style={styles.image}
            />

            {/* Price Section */}
            <Text style={styles.currentPrice}>13.499.000 đ</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.originalPrice}>15.000.000 đ</Text>
              <Text style={styles.discount}>-10%</Text>
            </View>


            {/* Details Section */}
            <View style={styles.details}>
              <Text>Phí VC: 0 đ</Text>
              <Text>Tổng: 13.499.000 đ</Text>
              <Text style={styles.status}>
                Trạng thái: <Text style={[styles.statusValue, { color: isAvailable2 ? 'green' : 'red' }]}>{isAvailable2 ? 'Còn hàng' : 'Hết hàng'}</Text>
              </Text>
              <Text style={styles.rating}>⭐ Chưa có đánh giá</Text>
            </View>

            {/* Buy Button with Cart Icon */}
            <TouchableOpacity style={styles.buyButton}>
              <Icon name="shopping-cart" size={18} color="white" style={styles.cartIcon} />
              <Text style={styles.buyButtonText}>Tới nơi bán</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {/* Top Icons */}
            <View style={styles.topIcons}>
              <Image
                source={require('../assets/images/Tiki.jpg')} // Replace with Shopee logo URL or local image
                style={styles.logo1}
              />
              <TouchableOpacity>
                {/* <Icon name="favorite-border" size={24} color="#FF2D55" /> */}
              </TouchableOpacity>
            </View>

            {/* Image Section */}
            <Image
              source={require('../assets/images/The_Village.jpg')} // Replace with your image URL or local image
              style={styles.image}
            />

            {/* Price Section */}
            <Text style={styles.currentPrice}>137.012 đ</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.originalPrice}>236.000 đ</Text>
              <Text style={styles.discount}>-42%</Text>
            </View>


            {/* Details Section */}
            <View style={styles.details}>
              <Text>Phí VC: 0 đ</Text>
              <Text>Tổng: 137.012  đ</Text>
              <Text style={styles.status}>
                Trạng thái: <Text style={[styles.statusValue, { color: isAvailable3 ? 'green' : 'red' }]}>{isAvailable3 ? 'Còn hàng' : 'Hết hàng'}</Text>
              </Text>
              <Text style={styles.rating}>⭐ Chưa có đánh giá</Text>
            </View>

            {/* Buy Button with Cart Icon */}
            <TouchableOpacity style={styles.buyButton}>
              <Icon name="shopping-cart" size={18} color="white" style={styles.cartIcon} />
              <Text style={styles.buyButtonText}>Tới nơi bán</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {/* Top Icons */}
            <View style={styles.topIcons}>
              <Image
                source={require('../assets/images/Shoppe.jpg')} // Replace with Shopee logo URL or local image
                style={styles.logo1}
              />
              <TouchableOpacity>
                {/* <Icon name="favorite-border" size={24} color="#FF2D55" /> */}
              </TouchableOpacity>
            </View>

            {/* Image Section */}
            <Image
              source={require('../assets/images/IP15.jpg')} // Replace with your image URL or local image
              style={styles.image}
            />

            {/* Price Section */}
            <Text style={styles.currentPrice}>32.990.000 đ</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.originalPrice}>34.490.000 đ</Text>
              <Text style={styles.discount}>-4%</Text>
            </View>


            {/* Details Section */}
            <View style={styles.details}>
              <Text>Phí VC: 0 đ</Text>
              <Text>Tổng: 32.990.000 đ</Text>
              <Text style={styles.status}>
                Trạng thái: <Text style={[styles.statusValue, { color: isAvailable4 ? 'green' : 'red' }]}>{isAvailable4 ? 'Còn hàng' : 'Hết hàng'}</Text>
              </Text>
              <Text style={styles.rating}>⭐ Chưa có đánh giá</Text>
            </View>

            {/* Buy Button with Cart Icon */}
            <TouchableOpacity style={styles.buyButton}>
              <Icon name="shopping-cart" size={18} color="white" style={styles.cartIcon} />
              <Text style={styles.buyButtonText}>Tới nơi bán</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* Khoảng cách giữa các section */}
        <Text style={styles.ratingTitle}>Đánh giá từ người dùng</Text>
        <View style={styles.userReviewsContainer}>

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
      <View style={styles.bottomTab}>
        {[
          { icon: 'home', label: 'Trang chủ', route: '/home' },
          { icon: 'search', label: 'Khám phá', route: '/explore' },
          { icon: 'heart', label: 'Yêu thích', route: '/favorite' },
          { icon: 'user', label: 'Cá nhân', route: '/profile' },
        ].map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => router.push(tab.route as '/home' | '/explore' | '/favorite' | '/profile')}
          >
            <FontAwesome name={tab.icon as any} size={24} color="#000" />
            <Text style={styles.tabText}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuButton: {
    marginRight: 10,
  },
  logo: {
    width: 40,
    height: 40,
    marginLeft: 10,
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
    height: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
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
    fontSize: 16,

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
    flex: 1,
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#D17842',
    paddingVertical: 10,
    position: 'absolute',
    borderTopColor: '#ddd',
    borderRadius: 40,
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  tab: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#000',
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
  adContainer: {
    width: '100%', // Để ảnh chiếm toàn bộ chiều rộng của màn hình
    alignItems: 'center', // Căn giữa ảnh
    marginTop: 1, // Khoảng cách từ trên xuống
    marginBottom: 1, // Khoảng cách từ dưới lên
  },
  adImage: {
    width: '100%', // Kích thước ảnh sẽ là 100% chiều rộng của màn hình
    height: undefined, // Để chiều cao tự động theo tỷ lệ
    aspectRatio: 1.77, // Tỷ lệ khung hình cho ảnh (ví dụ: 16:9)
    marginTop: -10, // Dịch ảnh lên trên
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
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

  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: 180,
    alignItems: 'center',
    backgroundColor: 'white',
    marginLeft: 0,
    marginRight: 10,
    // Drop shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    // Drop shadow for Android
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
  ratingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
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