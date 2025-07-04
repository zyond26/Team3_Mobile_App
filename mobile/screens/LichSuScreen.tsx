import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHistory } from '../API/api';

type HistoryItem = {
  query: string;
  time: string | number | Date;
};

export default function LichSuScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (!token) return;

      try {
        const res = await getHistory(token);
        setHistory(res.data);
      } catch (err) {
        console.log('Lỗi khi tải lịch sử:', err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Lịch sử tìm kiếm</Text>
      {history.length === 0 ? (
        <Text style={styles.text}>Chưa có lịch sử nào.</Text>
      ) : (
        history.map((item, index) => (
          <Text key={index} style={styles.text}>
            • {item.query} ({new Date(item.time).toLocaleString()})
          </Text>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 50 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  text: { fontSize: 16, marginBottom: 10 },
});
