import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserInfo } from '../API/api';

export default function ProfileScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('Tài khoản');

  const fetchProfile = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    if (!userId) {
      Alert.alert("Lỗi", "Không tìm thấy user_id, vui lòng đăng nhập lại.");
      return;
    }
    try {
      const res = await getUserInfo(parseInt(userId));
      setUserName(res.data.full_name || res.data.username);
    } catch (err: any) {
      Alert.alert("Lỗi", `Không thể tải thông tin người dùng: ${err.response?.data?.detail || 'Vui lòng thử lại.'}`);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, []);

  const tabRoutes: Record<string, string> = {
    trangchu: '/home',
    explore: '/explore',
    favorite: '/favorite',
    profile: '/profile',
  };

  const handleTabPress = (label: string) => {
    const route = tabRoutes[label];
    if (route) {
      router.push(route as '/home' | '/explore' | '/favorite' | '/profile');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      </View>

      <TouchableOpacity style={styles.profileSection}>
        <Image source={require('../assets/images/avatar.png')} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.subtitle}>Show profile</Text>
        </View>
        <FontAwesome name="angle-right" size={20} color="gray" style={{ marginLeft: 'auto' }} />
      </TouchableOpacity>

      <Text style={styles.settingsTitle}>Cài đặt</Text>

      {([
        { label: 'Thông tin cá nhân', icon: 'user', path: '/profile/thongtincanhan' },
        { label: 'Lịch sử', icon: 'history', path: '/profile/lichsu' },
        { label: 'Yêu thích', icon: 'heart', path: '/profile/yeuthich' },
      ]).map((item, idx) => (
        <TouchableOpacity key={idx} style={styles.item} onPress={() => router.push(item.path as any)}>
          <FontAwesome name={item.icon} size={20} color="#333" style={styles.icon} />
          <Text style={styles.itemText}>{item.label}</Text>
          <FontAwesome name="angle-right" size={20} color="gray" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
      ))}

      <View style={styles.bottomTab}>
        {[
          { icon: 'home', label: 'trangchu', text: 'Trang chủ' },
          { icon: 'search', label: 'explore', text: 'Khám phá' },
          { icon: 'heart', label: 'favorite', text: 'Yêu thích' },
          { icon: 'user', label: 'profile', text: 'Cá nhân' },
        ].map((tab, index) => (
          <TouchableOpacity key={index} style={styles.tab} onPress={() => handleTabPress(tab.label)}>
            <FontAwesome name={tab.icon} size={28} color="#000" />
            <Text style={styles.tabText}>{tab.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  logo: { width: 40, height: 40 },
  profileSection: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#eee', padding: 12, borderRadius: 10, marginBottom: 20,
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  name: { fontSize: 16, fontWeight: '600' },
  subtitle: { fontSize: 12, color: '#666' },
  settingsTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  item: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderColor: '#ddd',
  },
  icon: { marginRight: 10 },
  itemText: { fontSize: 14, color: '#333' },
  bottomTab: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    backgroundColor: '#D17842', paddingVertical: 10,
    position: 'absolute', borderTopColor: '#ddd', borderRadius: 40,
    bottom: 0, left: 0, right: 0, height: 120,
  },
  tab: { alignItems: 'center' },
  tabText: { fontSize: 12, color: '#000' },
});