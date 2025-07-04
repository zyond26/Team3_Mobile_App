import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Image, TextInput, TouchableOpacity,
  ScrollView, Modal, Button, Linking,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { search, addToFavorites } from '../API/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ResultItem = {
  product_id: string | number;
  platform_id: string | number;
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

type PlatformLogos = {
  [platformName: string]: string;
};

const PLATFORM_LOGOS: PlatformLogos = {
  Tiki: 'https://brandlogos.net/wp-content/uploads/2022/03/tiki-logo-brandlogos.net_.png',
  Shopee: 'https://cdn.freelogovectors.net/wp-content/uploads/2023/04/shopeelogo-freelogovectors.net_.png',
  Lazada: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBOnqSiSQmTu6-HHdvmZJPorfOoNam02mQ8w&s',
};

import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  trangchu: undefined;
  explore: undefined;
  favorite: undefined;
  profile: undefined;
};

export default function Explore() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<ResultItem[]>([]);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { id: 'fashion', label: ' Thời trang & phụ kiện' },
    { id: 'beauty', label: ' Mỹ phẩm & làm đẹp' },
    { id: 'mobile', label: ' Điện thoại di động' },
    { id: 'laptop', label: ' Laptop & máy tính bảng' },
    { id: 'sport', label: ' Thiết bị thể thao' },
    { id: 'stationery', label: ' Đồ dùng học tập' },
  ];



  const handleSearch = async () => {
    try {
      const res = await search(searchText);
      const data = res.data;

      // Flatten mỗi platform thành 1 card riêng
      const allCards: ResultItem[] = data.flatMap((product: { platforms: any[]; product_id: any; image_url: any; }) => {
        if (!product.platforms || product.platforms.length === 0) return [];

        return product.platforms.map((pf) => ({
          product_id: product.product_id,
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

      // Lọc theo khoảng giá
      const filtered = allCards.filter(
        (item) => item.price >= minPrice && item.price <= maxPrice
      );

      setResults(filtered);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleToggleFavorite = async (productId: number) => {
    const userId = await AsyncStorage.getItem('user_id');
    if (!userId) {
      Alert.alert("Lỗi", "Không tìm thấy user_id, vui lòng đăng nhập lại.");
      return;
    }
    const key = productId.toString();

    try {
      const res = await addToFavorites(userId, productId);
      Alert.alert('Thành công', res.data.msg || 'Đã thêm sản phẩm vào yêu thích!');
    } catch (err: any) {
      // ✅ Xử lý lỗi cụ thể nếu đã yêu thích
      if (err.response?.data?.detail === "Sản phẩm đã được yêu thích.") {
        Alert.alert("Thông báo", "Sản phẩm này đã có trong danh sách yêu thích.");
      } else {
        Alert.alert("Lỗi", `Không thể thêm vào yêu thích: ${err.response?.data?.detail || 'Vui lòng thử lại.'}`);
      }
    }

  };

  const handleTabPress = (label: keyof RootStackParamList) => {
    navigation.navigate(label);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Tìm kiếm </Text>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Tìm sản phẩm..."
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch}>
          <Text style={styles.cancelText}>Tìm</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterBox} onPress={() => setShowPriceFilter(true)}>
          <FontAwesome name="filter" size={16} color="#333" />
          <Text style={styles.filterText}> Từ {minPrice.toLocaleString()}đ đến {maxPrice.toLocaleString()}đ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterBox} onPress={() => setShowCategoryFilter(true)}>
          <FontAwesome name="tags" size={16} color="#333" />
          <Text style={styles.filterText}>
            Danh mục: {selectedCategory ? selectedCategory : 'Chọn'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showPriceFilter} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chọn khoảng giá</Text>
            <Text>Giá từ: {minPrice.toLocaleString()} đ</Text>
            <Slider
              minimumValue={0}
              maximumValue={50000000}
              step={1000000}
              value={minPrice}
              onValueChange={value => setMinPrice(value)}
            />
            <Text>Đến: {maxPrice.toLocaleString()} đ</Text>
            <Slider
              minimumValue={0}
              maximumValue={50000000}
              step={1000000}
              value={maxPrice}
              onValueChange={value => setMaxPrice(value)}
            />
            <Button title="Áp dụng" onPress={() => setShowPriceFilter(false)} />
          </View>
        </View>
      </Modal>

      <Modal visible={showCategoryFilter} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}> Chọn danh mục</Text>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryOption, selectedCategory === cat.label && styles.selectedCategory]}
                onPress={() => {
                  setSelectedCategory(cat.label);
                  setShowCategoryFilter(false);
                }}>
                <Text
                  style={[styles.categoryText, selectedCategory === cat.label && styles.selectedText]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
            <Button title="Đóng" onPress={() => setShowCategoryFilter(false)} />
          </View>
        </View>
      </Modal>

      <ScrollView>
        <Text style={styles.resultsText}>{results.length} kết quả cho  "{searchText}"</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {results.map((item, index) => (
            <View key={`${item.product_id}-${item.platform_id}`} style={styles.card}>
              <Image
                source={{ uri: PLATFORM_LOGOS[item.platform.name] }}
                style={styles.platformLogo}
              />
              <TouchableOpacity
                style={styles.favoriteIcon}
                onPress={() => handleToggleFavorite(Number(item.product_id))}
              >
                <FontAwesome
                  name={favorites.has(item.product_id.toString()) ? 'heart' : 'heart-o'}
                  size={20}
                  color="red"
                />
              </TouchableOpacity>

              <Image source={{ uri: item.product.image_url }} style={styles.productImage} />
              <Text style={styles.price}>{item.price.toLocaleString()} đ</Text>
              {index === 0 && <Text style={styles.recommend}>Đề xuất</Text>}
              <Text style={styles.seller}>{item.platform.name}</Text>
              <Text style={styles.ship}>
                {item.shipping_fee === 0 ? 'freeship' : `shipping_fee: ${item.shipping_fee.toLocaleString()} đ`}
              </Text>
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => Linking.openURL(item.product_url)}
              >
                <Text style={styles.buyButtonText}>Tới nơi bán</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomTab}>
        {(
          [
            { icon: 'home', label: 'trangchu', text: 'Trang chủ' },
            { icon: 'search', label: 'explore', text: 'Khám phá' },
            { icon: 'heart', label: 'favorite', text: 'Yêu thích' },
            { icon: 'user', label: 'profile', text: 'Cá nhân' },
          ] as { icon: 'home' | 'search' | 'heart' | 'user', label: keyof RootStackParamList, text: string }[]
        ).map((tab, index) => (
          <TouchableOpacity key={index} style={styles.tab} onPress={() => handleTabPress(tab.label)}>
            <FontAwesome name={tab.icon} size={28} color="#000" />
            <Text style={styles.tabText}>{tab.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 16,
    marginTop: 10
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  cancelText: {
    color: '#007AFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  filterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
    borderRadius: 8,
    padding: 8,
    marginLeft: 10
  },
  filterText: {
    fontSize: 14,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  card: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e53935',
    marginBottom: 4,
  },
  recommend: {
    backgroundColor: 'lightgreen',
    color: 'black',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  seller: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  ship: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  buyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  buyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
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
  tab: {
    alignItems: 'center',
    flex: 1,
  },
  tabText: {
    fontSize: 12,
    marginTop: 2,
    color: '#000',
  },
  platformLogo: {
    width: 24,
    height: 24,
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});