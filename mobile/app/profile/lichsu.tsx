import { View, Text, StyleSheet } from 'react-native';

export default function LichSu() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Trang Lịch Sử</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 }
});
