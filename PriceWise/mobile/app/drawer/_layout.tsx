import { Slot } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import NavigationBar from '@/components/NavigationBar';

export default function DrawerLayout() {
  return (
    <View style={styles.container}>
      <Slot /> 
      <NavigationBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
