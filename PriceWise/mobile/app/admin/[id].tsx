import { useLocalSearchParams, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Alert,
  ScrollView,
  Text,
  Switch,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { BASE_URL } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import TripleRingLoader from '@/components/TripleRingLoader';

const EditProduct = () => {
  const { id } = useLocalSearchParams();
  const [form, setForm] = useState<any>(null);
  const [categories, setCategories] = useState<{ category_id: number, name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      setLoading(true); 
      const res = await axios.get(`${BASE_URL}/product-platforms/${id}`);
      setForm(res.data);
    } catch (err) {
      console.error('Lỗi lấy dữ liệu sản phẩm:', err);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu sản phẩm');
    } finally {
      setLoading(false); 
    }
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${BASE_URL}/categories`);
    setCategories(res.data);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true); 
      await axios.put(`${BASE_URL}/product-platforms/${id}`, {
        product_id: form.product?.product_id,
        platform_id: form.platform?.platform_id,
        price: form.price,
        discount: form.discount,
        discount_percentage: form.discount_percentage,
        rating: form.rating,
        review_count: form.review_count,
        product_url: form.product_url,
        shipping_fee: form.shipping_fee,
        estimated_delivery_time: form.estimated_delivery_time,
        is_official: form.is_official,
      });

      await axios.put(`${BASE_URL}/products/${form.product.product_id}`, {
        name: form.product.name,
        description: form.product.description,
        image_url: form.product.image_url,
        category_id: form.product.category_id,
      });

      Alert.alert('Thành công', 'Đã cập nhật sản phẩm');
      router.back();
    } catch (err) {
      console.error('Lỗi khi cập nhật:', err.response?.data || err.message);
      Alert.alert('Lỗi', 'Không thể cập nhật sản phẩm');
    } finally {
      setLoading(false); 
    }
  };

  const updateProductField = (key: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      product: {
        ...prev.product,
        [key]: value,
      },
    }));
  };

  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, []);

  if (!form) return null;

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
      <ScrollView style={{ padding: 10 }}>
        <Text style={styles.sectionTitle}>🛒 Thông tin sản phẩm (Product)</Text>

        <Text style={styles.label}>Tên sản phẩm</Text>
        <TextInput
          value={form.product?.name || ''}
          onChangeText={(t) => updateProductField('name', t)}
          style={styles.input}
        />

        <Text style={styles.label}>Mô tả</Text>
        <TextInput
          value={form.product?.description || ''}
          onChangeText={(t) => updateProductField('description', t)}
          multiline
          numberOfLines={4}
          style={styles.input}
        />

        <Text style={styles.label}>Ảnh URL</Text>
        <TextInput
          value={form.product?.image_url || ''}
          onChangeText={(t) => updateProductField('image_url', t)}
          style={styles.input}
        />

        <Text style={styles.label}>Danh mục</Text>
        <View style={styles.input}>
          <Picker
            selectedValue={form.product?.category_id}
            onValueChange={(itemValue) => updateProductField('category_id', itemValue)}
            style={{ fontSize: 16 }}
          >
            {categories.map((c) => (
              <Picker.Item key={c.category_id} label={c.name} value={c.category_id} />
            ))}
          </Picker>
        </View>

        <Text style={styles.sectionTitle}>📦 Thông tin nền tảng (ProductPlatform)</Text>

        <Text style={styles.label}>Giá</Text>
        <TextInput
          value={form.price?.toString() || ''}
          onChangeText={(t) => setForm({ ...form, price: parseFloat(t) || 0 })}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Giảm giá</Text>
        <TextInput
          value={form.discount?.toString() || ''}
          onChangeText={(t) => setForm({ ...form, discount: parseFloat(t) || 0 })}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Phần trăm giảm</Text>
        <TextInput
          value={form.discount_percentage?.toString() || ''}
          onChangeText={(t) => setForm({ ...form, discount_percentage: parseFloat(t) || 0 })}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Phí ship</Text>
        <TextInput
          value={form.shipping_fee?.toString() || ''}
          onChangeText={(t) => setForm({ ...form, shipping_fee: parseFloat(t) || 0 })}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Đánh giá</Text>
        <TextInput
          value={form.rating?.toString() || ''}
          onChangeText={(t) => setForm({ ...form, rating: parseFloat(t) || 0 })}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Lượt đánh giá</Text>
        <TextInput
          value={form.review_count?.toString() || ''}
          onChangeText={(t) => setForm({ ...form, review_count: parseInt(t) || 0 })}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Link sản phẩm</Text>
        <TextInput
          value={form.product_url || ''}
          onChangeText={(t) => setForm({ ...form, product_url: t })}
          style={styles.input}
        />

        <Text style={styles.label}>Thời gian giao hàng</Text>
        <TextInput
          value={form.estimated_delivery_time || ''}
          onChangeText={(t) => setForm({ ...form, estimated_delivery_time: t })}
          style={styles.input}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Text style={styles.label}>Chính hãng:</Text>
          <Switch
            value={form.is_official}
            onValueChange={(value) => setForm({ ...form, is_official: value })}
          />
        </View>

        <Button title="💾 Cập nhật sản phẩm" onPress={handleUpdate} />
        <TouchableOpacity
          style={{
            marginTop: 10,
            padding: 10,
            backgroundColor: 'red',
            borderRadius: 2,
            marginBottom: 40,
          }}
          onPress={() => router.back()}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>❌ HỦY</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    fontSize: 15,
  },
};

export default EditProduct;
