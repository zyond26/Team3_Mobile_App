// components/ProductCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons'; // hoặc react-native-vector-icons/Ionicons


interface ProductCardProps {
  productId: number;
  productPlatformId: number;
  productName: string;
  platformLogo: string;
  productImage: string;
  currentPrice: string;
  originalPrice: string;
  discountPercentage: string;
  shippingFee: string;
  totalPrice: string;
  isAvailable: boolean;
  rating: string;
  productUrl: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productId,
  productPlatformId,
  productName,
  platformLogo,
  productImage,
  currentPrice,
  originalPrice,
  discountPercentage,
  shippingFee,
  totalPrice,
  isAvailable,
  rating,
  productUrl,
  isFavorite,
  onToggleFavorite,
}) => {
  return (
    <View style={styles.card}>
      {/* Top Icons */}
      <View style={styles.topIcons}>
        <Image source={{ uri: platformLogo }} style={styles.logo1} />

        <TouchableOpacity onPress={onToggleFavorite} style={styles.favouriteButton}>
          <Ionicons
          style={{color:'red'}}
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={28}
            color={isFavorite ? 'red' : 'gray'}
          />
        </TouchableOpacity>
        
      </View>

      {/* Image Section */}
      <Image source={{ uri: productImage }} style={styles.image} />

      {/* Product Name */}
      <Text style={styles.productName}>{productName}</Text>

      {/* Price Section */}
      <Text style={styles.currentPrice}>{currentPrice}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.originalPrice}>{originalPrice}</Text>
        <Text style={styles.discount}>{discountPercentage}</Text>
      </View>

      {/* Details Section */}
      <View style={styles.details}>
        <Text>Phí VC: {shippingFee}</Text>
        <Text>Tổng: {totalPrice}</Text>
        <Text style={styles.status}>
          Trạng thái: <Text style={[styles.statusValue, { color: isAvailable ? 'green' : 'red' }]}>
            {isAvailable ? 'Còn hàng' : 'Hết hàng'}
          </Text>
        </Text>
        <Text style={styles.rating}>⭐ {rating}</Text>
      </View>

      {/* Nút mua và nút yêu thích */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <TouchableOpacity style={styles.buyButton} onPress={() => Linking.openURL(productUrl)}>
          <Icon name="shopping-cart" size={18} color="white" style={styles.cartIcon} />
          <Text style={styles.buyButtonText}>Tới nơi bán</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

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
    height:100,
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
    width: 205,
    alignItems: 'center',
    backgroundColor: 'white',
    marginLeft: 0,
    marginRight:10,
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
    marginBottom: 3,
  },
  logo1: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  image: {
    width: 150,
    height: 170,
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
    width: '5%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1, 
  },
  buyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  favoriteButton:{
    backgroundColor: '#f0f0f0',
    color: 'white',
    fontWeight: 'bold',
    marginRight: 2,
    padding: 5,
    borderRadius: 5,
    
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
});

export default ProductCard;
