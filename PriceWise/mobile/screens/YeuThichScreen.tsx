import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NavigationBar from '../components/NavigationBar';

export default function YeuThichScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách yêu thích</Text>
      <Text>- iPhone 15 Pro Max</Text>
      <Text>- Son 3CE</Text>

      <NavigationBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
});
