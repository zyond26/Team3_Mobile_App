import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { BASE_URL } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context'; 

interface PlatformData {
  platform: string;
  logo_url: string;
  price: number;
  discount: number;
  discount_percentage: number;
  rating: number;
  review_count: number;
  shipping_fee: number;
  estimated_delivery_time: string;
  is_official: boolean;
  product_url: string;
  image_url: string;
  color?: string;
}

export default function CompareProductScreen() {
  const [productData, setProductData] = useState<PlatformData[]>([]);
  const { productId } = useLocalSearchParams<{ productId?: string }>();

  useEffect(() => {
    if (!productId) return;

    fetch(`${BASE_URL}/products/${productId}/compare`)
      .then(res => res.json())
      .then(data => {
        const colors = ['#fff0f3', '#e0f7ff', '#f3f0ff'];
        const coloredData = data.map((item: PlatformData, index: number) => ({
          ...item,
          color: colors[index % colors.length],
        }));

        setProductData(coloredData);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setProductData([]);
      });
  }, [productId]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff8fc' }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>So sánh sản phẩm trên các sàn</Text>

        <View style={styles.cardContainer}>
          {productData.map((item, index) => (
            <View key={index} style={[styles.productCard, { backgroundColor: item.color }]}>
              <Text style={styles.platformBadge}>{item.platform}</Text>
              <Image
                source={{ uri: item.image_url }}
                style={styles.productImage}
              />
              {item.logo_url ? (
                <Image source={{ uri: item.logo_url }} style={styles.platformLogo} />
              ) : (
                <Text>No Logo</Text>
              )}
              <Text style={styles.price}>{item.price.toLocaleString()} đ</Text>
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => Linking.openURL(item.product_url)}
              >
              <Text style={styles.buyButtonText}>🛒 Xem ngay</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Bảng so sánh */}
        <Text style={styles.sectionTitle}>Bảng so sánh</Text>
        <View style={styles.table}>
          {/* Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.labelCell}>Tiêu chí</Text>
            {productData.map((item, i) => (
              <Text key={i} style={styles.valueCellHeader}>{item.platform}</Text>
            ))}
          </View>

          {/* Các dòng so sánh */}
          {[
            ['Giá bán', (item: PlatformData) => `${item.price.toLocaleString()} đ`],
            ['Giảm giá', (item: PlatformData) => `${item.discount.toLocaleString()} đ`],
            ['% KM', (item: PlatformData) => `${item.discount_percentage}%`],
            ['Đánh giá', (item: PlatformData) => `${item.rating}`],
            ['Lượt đánh giá', (item: PlatformData) => `${item.review_count}`],
            ['Phí ship', (item: PlatformData) => item.shipping_fee === 0 ? 'Miễn phí' : `${item.shipping_fee.toLocaleString()} đ`],
            ['Giao hàng', (item: PlatformData) => item.estimated_delivery_time],
            ['Chính hãng', (item: PlatformData) => item.is_official ? '✅' : '❌'],
          ].map(([label, getValue], idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.labelCell}>{label}</Text>
              {productData.map((item, i) => (
                <Text key={i} style={styles.valueCell}>{getValue(item)}</Text>
              ))}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#d63384',
    marginBottom: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  productCard: {
    width: '30%',
    alignItems: 'center',
    borderRadius: 14,
    padding: 10,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 2,
  },
  platformBadge: {
    backgroundColor: '#ff69b4',
    color: '#fff',
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 12,
    marginBottom: 6,
  },
  productImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  platformLogo: {
    width: 50,
    height: 20,
    resizeMode: 'contain',
    marginVertical: 6,
  },
  price: {
    color: '#dc3545',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buyButton: {
    marginTop: 8,
    backgroundColor: '#ff69b4',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 11,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#20c997',
  },
  table: {
    backgroundColor: '#fff5fb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f8d7da',
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#fce4ec',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: '#f3c6cb',
    paddingVertical: 12,
    alignItems: 'center',
  },
  labelCell: {
    flex: 1.6,
    fontWeight: '600',
    paddingHorizontal: 8,
    fontSize: 13,
    color: '#343a40',
  },
  valueCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    color: '#495057',
  },
  valueCellHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 'bold',
    color: '#d63384',
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f',
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});