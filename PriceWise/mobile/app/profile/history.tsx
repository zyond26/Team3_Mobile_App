import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
  TouchableOpacity, Dimensions, ActivityIndicator,
  Alert
} from 'react-native';
import { router, useRouter } from 'expo-router';
import NavigationBar from '@/components/NavigationBar';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/constants';
import TripleRingLoader from '@/components/TripleRingLoader';

type SearchHistoryItem = {
  search_id: number;
  user_id: number;
  query: string;
  search_time: string;
};

export default function LichSuDaXemScreen() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem('user_id');
      if (id) setUserId(parseInt(id));
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      axios.get(`${BASE_URL}/search-history/user/${userId}`)
        .then(res => setHistory(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [userId]);

  const handleClearHistory = async () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa toàn bộ lịch sử tìm kiếm?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              if (!userId) return;
              await axios.delete(`${BASE_URL}/search-history/search-history/user/${userId}`);
              Alert.alert("Thành công", "Đã xóa lịch sử tìm kiếm");
              setHistory([]);
            } catch (err) {
              console.error("Lỗi khi xoá lịch sử:", err);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Lịch sử tìm kiếm</Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity onPress={() => router.push('/drawer/profile')}>
            <Text style={styles.backButton}>Quay lại</Text>
          </TouchableOpacity>

          {history.length > 0 && (
            <TouchableOpacity onPress={handleClearHistory}>
              <Text style={styles.clearButton}>Xóa lịch sử</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

     {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TripleRingLoader />
          <Text style={{ marginTop: 10 }}>Đang tải dữ liệu...</Text>
        </View>
      ) : history.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <Image
            source={require('../../assets/images/history-background.jpg')}
            style={styles.backgroundImage}
          />
          <View style={styles.overlay} />

          <View style={styles.emptyContent}>
            <View style={styles.heartBox}>
              <View style={styles.heartIcon}>
                <Image
                  source={require('../../assets/images/history_icon.jpg')}
                  style={{ width: 60, height: 60, resizeMode: 'contain' }}
                />
              </View>
              <Text style={styles.heartText}>Chưa có lịch sử tìm kiếm</Text>
            </View>

            <Text style={styles.messageText}>
              Bạn chưa tìm kiếm sản phẩm nào. Hãy{' '}
              <Text
                style={styles.exploreLink}
                onPress={() => router.push('/drawer/explore')}
              >
                khám phá
              </Text>{' '}
              ngay bây giờ nhé!
            </Text>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {history.map((item) => (
            <View key={item.search_id} style={styles.historyItem}>
              <Text style={styles.queryText}>Đã tìm kiếm: {item.query}</Text>
              <Text style={styles.timeText}>
                {new Date(item.search_time).toLocaleString()}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 10,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  scrollContent: { paddingBottom: 100 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  price: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 16,
  },
  store: {
    color: '#555',
    fontSize: 14,
  },
  status: {
    color: 'green',
    fontSize: 13,
    marginVertical: 4,
  },
  button: {
    marginTop: 6,
    backgroundColor: '#d2691e',
    paddingVertical: 6,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    color: 'blue',
    marginRight: 10,
    marginTop: 30,
    fontWeight: '500',
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
     borderRadius: 30,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#D17842',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  tab: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 2,
  },
  historyItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  queryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  timeText: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  clearButton: {
    fontSize: 14,
    color: '#d11a2a',
    fontWeight: '500',
    paddingTop: 30,
  },
  heartBox: {
    backgroundColor: '#EAAE99',
    padding: 50,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: '30%',
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
  emptyWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  emptyContent: {
    position: 'absolute',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  messageText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    marginTop: 30,
    lineHeight: 22,
  },
  exploreLink: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#FFD700',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
