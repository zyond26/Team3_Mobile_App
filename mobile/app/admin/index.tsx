import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  Linking,
  Image,
  Button,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { BASE_URL } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import TripleRingLoader from '@/components/TripleRingLoader';

interface ProductPlatform {
  product_platform_id: number;
  price: number;
  product_url: string;
  rating: number;
  review_count: number;
  product: {
    name: string;
    image_url?: string;
    description?: string;
  };
  platform: {
    name: string;
  };
}

const AdminProductList = () => {
  const [products, setProducts] = useState<ProductPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      setLoading(true); 
      const res = await axios.get(`${BASE_URL}/product-platforms/`);
      setProducts(res.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách sản phẩm:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false); 
    }
  };

  const deleteProduct = async (id: number) => {
    Alert.alert('Xác nhận xoá', 'Bạn có chắc muốn xoá sản phẩm?', [
      { text: 'Huỷ' },
      {
        text: 'Xoá',
        onPress: async () => {
          try {
            await axios.delete(`${BASE_URL}/product-platforms/${id}`);
            fetchProducts();
          } catch (error) {
            console.error('Lỗi khi xoá sản phẩm:', error);
            Alert.alert('Lỗi', 'Không thể xoá sản phẩm');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TripleRingLoader />
        <Text style={{ marginTop: 10 }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      <Button title="➕ Thêm sản phẩm" onPress={() => router.push('/admin/create')} />

      <FlatList
        data={products}
        keyExtractor={(item) => item.product_platform_id.toString()}
        refreshing={loading} 
        onRefresh={fetchProducts}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, flexDirection: 'row' }}>
            {/* Ảnh sản phẩm */}
            <View style={{ marginRight: 10 }}>
              <Image
                source={{
                  uri: item.product.image_url || 'https://via.placeholder.com/80',
                }}
                style={{ width: 80, height: 80, borderRadius: 8 }}
                resizeMode="cover"
              />
            </View>

            {/* Thông tin sản phẩm */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.product.name}</Text>
              <Text style={{ marginTop: 4 }}>
                <Text style={{ fontWeight: '600' }}>Nền tảng:</Text> {item.platform.name}
              </Text>
              <Text>
                <Text style={{ fontWeight: '600' }}>Giá:</Text> {item.price.toLocaleString()}₫
              </Text>
              <Text>
                <Text style={{ fontWeight: '600' }}>Đánh giá:</Text> {item.rating} ⭐ (
                {item.review_count} lượt)
              </Text>

              {/* Nút chức năng */}
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: '/admin/[id]',
                      params: { id: item.product_platform_id.toString() },
                    })
                  }
                  style={{ marginRight: 15 }}
                >
                  <Text style={{ color: 'blue' }}>✏️ Sửa</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => deleteProduct(item.product_platform_id)}>
                  <Text style={{ color: 'red' }}>🗑 Xoá</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(item.product_url);
                  }}
                  style={{ marginLeft: 15 }}
                >
                  <Text style={{ color: 'green' }}>🔗 Mua</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default AdminProductList;
