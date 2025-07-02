import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';
import { router } from 'expo-router';

type FavoriteProduct = {
  product_id: number;
  name: string;
  image_url: string;
  platforms: {
    platform: {
      name: string;
    };
    price: number;
    product_url: string;
  }[];
};

export default function FavoriteScreen() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);

  useEffect(() => {
    axios.get('http://localhost:8000/favorites/1') // Thay bằng BASE_URL nếu dùng IP
      .then(res => setFavorites(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yêu thích</Text>

      <ScrollView>
        {favorites.length === 0 ? (
          <Text style={styles.empty}>Chưa có sản phẩm yêu thích</Text>
        ) : (
          favorites.map((item) => (
            <View key={item.product_id} style={styles.card}>
              <Image source={{ uri: item.image_url }} style={styles.image} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                {item.platforms.length > 0 && (
                  <>
                    <Text style={styles.price}>
                      {item.platforms[0].price.toLocaleString()} đ ({item.platforms[0].platform.name})
                    </Text>
                    <TouchableOpacity
                      onPress={() => Linking.openURL(item.platforms[0].product_url)}
                      style={styles.buyButton}
                    >
                      <Text style={styles.buyButtonText}>Tới nơi bán</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Bottom Tab Navigation */}
      <View style={styles.bottomTab}>
        {([
          { icon: 'home' as 'home', label: 'Trang chủ', route: '/home' as const },
          { icon: 'search' as 'search', label: 'Khám phá', route: '/explore' as const },
          { icon: 'heart' as 'heart', label: 'Yêu thích', route: '/favorite' as const },
          { icon: 'user' as 'user', label: 'Cá nhân', route: '/profile' as const },
        ]).map((tab, index) => (
          <TouchableOpacity key={index} style={styles.tab} onPress={() => router.push(tab.route)}>
            <FontAwesome name={tab.icon} size={24} color="#000" />
            <Text style={styles.tabText}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50, paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  empty: { textAlign: 'center', color: '#888', marginTop: 20 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  image: { width: 80, height: 80, marginRight: 12, borderRadius: 8 },
  name: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  price: { color: '#e53935', fontSize: 14, marginBottom: 6 },
  buyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  buyButtonText: { color: '#fff', fontWeight: 'bold' },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#D17842',
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    borderTopColor: '#ddd',
    borderRadius: 40,
  },
  tab: { alignItems: 'center' },
  tabText: { fontSize: 12, color: '#000', marginTop: 4 },
});
