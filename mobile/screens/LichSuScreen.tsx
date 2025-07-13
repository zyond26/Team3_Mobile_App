import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LichSuScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch sử</Text>
      <Text>- Mua iPhone 15 Pro Max</Text>
      <Text>- Đặt laptop Acer</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
});
