import React, { useState, useEffect } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import axios from 'axios';
import { BASE_URL } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';

const CreateProduct = () => {
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    image_url: '',
    category_id: '',
  });

  const [platformForm, setPlatformForm] = useState({
    platform_id: '',
    product_id: '',
    price: '',
    discount: '',
    discount_percentage: '',
    rating: '',
    review_count: '',
    product_url: '',
    shipping_fee: '',
    estimated_delivery_time: '',
    is_official: false,
  });

  const [platforms, setPlatforms] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchPlatforms = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/platforms/`);
      setPlatforms(res.data);
    } catch (err) {
      console.error('Lỗi lấy danh sách platform:', err);
      Alert.alert('Lỗi', 'Không thể tải danh sách nền tảng');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/categories/`);
      setCategories(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh mục:", err);
    }
  };

  const handleSubmit = async () => {
    try {
      // 1. Tạo Product
      const res = await axios.post(`${BASE_URL}/products/`, {
        name: productForm.name,
        description: productForm.description,
        image_url: productForm.image_url,
        category_id: parseInt(productForm.category_id),
      });

      const product_id = res.data.product_id;

      // 2. Gán vào ProductPlatform
      // await axios.post(`${BASE_URL}/product-platforms/`, {
      //   product_id: product_id,
      //   platform_id: parseInt(platformForm.platform_id),
      //   price: parseFloat(platformForm.price),
      //   discount: parseFloat(platformForm.discount) || 0,
      //   discount_percentage: parseFloat(platformForm.discount_percentage) || 0,
      //   rating: parseFloat(platformForm.rating) || 0,
      //   review_count: parseInt(platformForm.review_count) || 0,
      //   product_url: platformForm.product_url,
      //   shipping_fee: parseFloat(platformForm.shipping_fee) || 0,
      //   estimated_delivery_time: platformForm.estimated_delivery_time,
      //   is_official: platformForm.is_official,
      // });
      await axios.post(`${BASE_URL}/product-platforms/`, {
        product_id: parseInt(platformForm.product_id),
        platform_id: parseInt(platformForm.platform_id),
        price: parseFloat(platformForm.price),
        discount: parseFloat(platformForm.discount) || 0,
        discount_percentage: parseFloat(platformForm.discount_percentage) || 0,
        rating: parseFloat(platformForm.rating) || 0,
        review_count: parseInt(platformForm.review_count) || 0,
        product_url: platformForm.product_url,
        shipping_fee: parseFloat(platformForm.shipping_fee) || 0,
        estimated_delivery_time: platformForm.estimated_delivery_time,
        is_official: platformForm.is_official,
      });

      Alert.alert('Thành công', 'Đã tạo sản phẩm mới');
      router.back();
    } catch (err) {
      console.error('Lỗi tạo sản phẩm:', err);
      Alert.alert('Lỗi', 'Không thể tạo sản phẩm');
    }
  };

  useEffect(() => {
    fetchPlatforms();
    fetchCategories();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, padding: 10 }}>
      <ScrollView style={{ padding: 10 }}>
        <Text style={styles.sectionTitle}>🛒 Thông tin sản phẩm</Text>

        <Text>Mã sản phẩm</Text>
        <TextInput
          value={platformForm.product_id}
          onChangeText={(t) => setPlatformForm({ ...platformForm, product_id: t })}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text>Tên sản phẩm</Text>
        <TextInput
          value={productForm.name}
          onChangeText={(t) => setProductForm({ ...productForm, name: t })}
          style={styles.input}
        />

        <Text>Mô tả</Text>
        <TextInput
          value={productForm.description}
          onChangeText={(t) => setProductForm({ ...productForm, description: t })}
          style={styles.input}
        />

        <Text>Link ảnh</Text>
        <TextInput
          value={productForm.image_url}
          onChangeText={(t) => setProductForm({ ...productForm, image_url: t })}
          style={styles.input}
        />

        <Text>Chọn danh mục</Text>
        <View style={styles.input}>
          <Picker
            selectedValue={productForm.category_id}
            onValueChange={(value) => setProductForm({ ...productForm, category_id: value })}
            style={{ height: 50 }}
          >
            <Picker.Item label="-- Chọn danh mục --" value="" />
            {categories.map((c: any) => (
              <Picker.Item key={c.category_id} label={c.name} value={c.category_id.toString()} />
            ))}
          </Picker>
        </View>


        <Text style={styles.sectionTitle}>📦 Nền tảng bán</Text>

        <Text>Chọn nền tảng</Text>
        <View style={styles.input}>
          <Picker
            selectedValue={platformForm.platform_id}
            onValueChange={(value) => setPlatformForm({ ...platformForm, platform_id: value })}
            style={{ height: 50 }}
          >
            <Picker.Item label="-- Chọn nền tảng --" value="" />
            {platforms.map((p: any) => (
              <Picker.Item key={p.platform_id} label={p.name} value={p.platform_id.toString()} />
            ))}
          </Picker>
        </View>

        <Text>Giá (₫)</Text>
        <TextInput
          value={platformForm.price}
          onChangeText={(t) => setPlatformForm({ ...platformForm, price: t })}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text>Giảm giá</Text>
        <TextInput
          value={platformForm.discount}
          onChangeText={(t) => setPlatformForm({ ...platformForm, discount: t })}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text>Phần trăm giảm</Text>
        <TextInput
          value={platformForm.discount_percentage}
          onChangeText={(t) => setPlatformForm({ ...platformForm, discount_percentage: t })}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text>Đánh giá</Text>
        <TextInput
          value={platformForm.rating}
          onChangeText={(t) => setPlatformForm({ ...platformForm, rating: t })}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text>Lượt đánh giá</Text>
        <TextInput
          value={platformForm.review_count}
          onChangeText={(t) => setPlatformForm({ ...platformForm, review_count: t })}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text>Link sản phẩm</Text>
        <TextInput
          value={platformForm.product_url}
          onChangeText={(t) => setPlatformForm({ ...platformForm, product_url: t })}
          style={styles.input}
        />

        <Text>Phí vận chuyển</Text>
        <TextInput
          value={platformForm.shipping_fee}
          onChangeText={(t) => setPlatformForm({ ...platformForm, shipping_fee: t })}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text>Thời gian giao hàng</Text>
        <TextInput
          value={platformForm.estimated_delivery_time}
          onChangeText={(t) =>
            setPlatformForm({ ...platformForm, estimated_delivery_time: t })
          }
          style={styles.input}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Text>Chính hãng:</Text>
          <Switch
            value={platformForm.is_official}
            onValueChange={(val) => setPlatformForm({ ...platformForm, is_official: val })}
          />
        </View>

        {/* <Button title="➕ Tạo sản phẩm" onPress={handleSubmit} /> */}
        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>➕ Tạo sản phẩm</Text>
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
  button: {
    backgroundColor: '#D17842',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginVertical: 10,
  }
};

export default CreateProduct;
