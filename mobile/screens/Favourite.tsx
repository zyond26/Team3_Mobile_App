import FontAwesome from '@expo/vector-icons/build/FontAwesome';
import { router } from 'expo-router';
import React, { ReactNode, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Linking } from 'react-native';
import TripleRingLoader from '@/components/TripleRingLoader';
import { Ionicons } from '@expo/vector-icons';
import { addToFavorites, removeFromFavorites } from '@/constants';
import { Alert } from 'react-native';


interface FavoriteProduct {
  favorite_id: number;
  user_id: number;
  product_platform_id: number;
  added_at: string;
  product_platform: {
    price: number;
    discount: number;
    discount_percentage: number;
    shipping_fee: number;
    rating: number;
    review_count: number;
    product_url: string;
    is_official: boolean;
    platform: {
      name: string;
      logo_url: string;
    };
    product: {
      product_id: number;
      name: string;
      image_url: string;
    };
  };
}

const { width } = Dimensions.get('window');

export default function YeuThichScreen() {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  const handleTabPress = (label: string) => {
    navigation.navigate(label as never);
  };

  useEffect(() => {
    const fetchUserIdAndFavorites = async () => {
      try {
        const userIdString = await AsyncStorage.getItem('user_id');
        if (!userIdString) {
          console.warn('Không tìm thấy user_id trong AsyncStorage');
          setLoading(false);
          return;
        }

        const userId = parseInt(userIdString);
        const response = await fetch(`${BASE_URL}/favorites/user/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setFavorites(data);
          const ids = new Set(data.map(item => item.product_platform_id));
          setFavoriteIds(ids);
        } else {
          console.error('API lỗi:', response.status, data);
        }
      } catch (error) {
        console.error('Lỗi fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserIdAndFavorites();
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
        setFavoriteIds(prev => {
          const updated = new Set(prev);
          updated.delete(productPlatformId);
          return updated;
        });
        setFavorites(prev => prev.filter(f => f.product_platform_id !== productPlatformId));
        Alert.alert("Đã xoá khỏi yêu thích");
      } else {
        await addToFavorites(productId, userId, productPlatformId);
        setFavoriteIds(prev => new Set(prev).add(productPlatformId));
        Alert.alert("Đã thêm vào yêu thích");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý yêu thích:", error);
      Alert.alert("Lỗi", "Không thể xử lý yêu thích.");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TripleRingLoader />
        <Text style={{ marginTop: 10 }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, favorites.length > 0 && styles.whiteBackground]}>
      {favorites.length === 0 && (
        <Image
          source={require('../assets/images/background.jpg')}
          style={styles.backgroundImage}
        />
      )}

      <View style={favorites.length === 0 ? styles.overlayEmpty : styles.overlayFilled}>
        {favorites.length === 0 ? (
          <>
           <View style={styles.heartBox}>
            <View style={styles.heartIcon}>
              <Image
                source={require('../assets/images/heart_icon.jpg')}
                style={{ width: 70, height: 70, resizeMode: 'contain' }}
              />
            </View>
            <Text style={styles.heartText}>Sản phẩm yêu thích</Text>
          </View>

          <Text style={styles.messageText}>
            Hiện tại chưa có sản phẩm, hãy cùng{' '}
            <Text
              style={{ fontWeight: 'bold', textDecorationLine: 'underline', color: 'black' }}
              onPress={() => router.push('/drawer/explore')}
            >
              Khám phá
            </Text>
            {' '}các sản phẩm 
          </Text>
          </>
        ) : (
         <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.fullWidthCenter}>
              <Text style={styles.resultTitle}>Danh sách sản phẩm yêu thích</Text>
            </View>
            <View style={styles.rowWrap}>
              {favorites.map(item => {
                const pf = item.product_platform;
                const total = pf.price + (pf.shipping_fee || 0);

                return (
                  <View key={item.favorite_id} style={styles.card}>
                    <View>
                      <Image source={{ uri: pf.product.image_url }} style={styles.image} />
                      <Image source={{ uri: pf.platform.logo_url }} style={styles.platformLogo} />
                    </View>

                    <Text style={styles.cardTitle}>{pf.product.name}</Text>

                    <Text style={styles.discount}>
                      {pf.price.toLocaleString()}₫ - {pf.discount_percentage}%
                    </Text>

                    <Text style={styles.originalPrice}>
                      {(pf.price + pf.discount).toLocaleString()}₫
                    </Text>

                    <Text style={styles.cardSubtitle}>
                      Phí ship: {pf.shipping_fee?.toLocaleString() || 0}₫
                    </Text>

                    <Text style={styles.cardSubtitle}>
                      Tổng: {total.toLocaleString()}₫
                    </Text>

                    <Text style={styles.status}>
                      Trạng thái: <Text style={styles.statusValue}>Còn hàng</Text>
                    </Text>

                    <Text style={styles.cardSubtitle}>
                      ⭐ {pf.rating} ({pf.review_count} đánh giá)
                    </Text>

                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        style={styles.buyButtonFlex}
                        onPress={() => Linking.openURL(pf.product_url)}
                      >
                        <FontAwesome name="shopping-cart" size={16} color="#fff" />
                        <Text style={styles.buyButtonText}>Tới nơi bán</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.heartButton}
                        onPress={() => toggleFavorite(item.product_platform.product.product_id, item.product_platform_id)}
                      >

                        <Ionicons
                          name={favoriteIds.has(item.product_platform_id) ? 'heart' : 'heart-outline'}
                          size={24}
                          color={favoriteIds.has(item.product_platform_id) ? 'red' : 'gray'}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlayEmpty: {
    flex: 1,
    marginTop: '40%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  overlayFilled: {
    flex: 1,
    alignItems: 'center',
    marginTop: '8%',
  },
  heartBox: {
    backgroundColor: '#EAAE99',
    padding: 50,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: '22%',
  },
  heartText: {
    marginTop: 10,
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  heartIcon: {
    width: 80,
    height: 80,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    marginBottom: 10,
  },
  messageText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#EAAE99',
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    width: width,
  },
  tab: {
    alignItems: 'center',
  },
  tabText: {
    marginTop: 4,
    fontSize: 12,
    color: '#000',
  },
  whiteBackground: {
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingBottom: 80,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    width: (width - 30) / 2, 
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 16,

    // Shadow
    shadowColor: '#000',
    marginHorizontal: 2,
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
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    marginBottom: 8,
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
    fontWeight: 'bold',
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  buyButtonFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  heartButton: {
    padding: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  platformLogo: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
    zIndex: 1,
  },
  fullWidthCenter: {
    width: '100%',
    alignItems: 'center',
  },
});
