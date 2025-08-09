import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import NavigationBar from '../components/NavigationBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/constants';

export default function ProfileScreen() {
  const [userInfo, setUserInfo] = useState<{ fullName: string , email: string} | null>(null);
  const router = useRouter();

  // const handleTabPress = (label: string) => {
  //   router.push(`/${label}`);
  // };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id');
        if (!userId) return;

        const response = await fetch(`${BASE_URL}/api/user/${userId}`);
        const data = await response.json();

        setUserInfo({
          fullName: data.full_name || 'Người dùng',
          email: data.email || 'Email',
        });
      } catch (error) {
        console.error('Lỗi khi tải user info:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hồ sơ</Text>
          <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        </View>

        {/* Thông tin người dùng */}
        <TouchableOpacity style={styles.profileSection}>
          <Image source={require('../assets/images/avatar.png')} style={styles.avatar} />
          <View>
            <Text style={styles.name}>{userInfo?.fullName || 'Đang tải...'}</Text>
            <Text>{userInfo?.email || 'Đang tải...'}</Text>
          </View>
          {/* <FontAwesome name="angle-right" size={24} color="gray" style={{ marginLeft: 'auto' }} /> */}
        </TouchableOpacity>

        <Text style={styles.settingsTitle}>Cài đặt tài khoản</Text>

        {/* Các mục cài đặt */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push('/profile/information')}
        >
          <FontAwesome name="user" size={22} color="#333" style={styles.icon} />
          <Text style={styles.itemText}>Thông tin cá nhân</Text>
          <FontAwesome name="angle-right" size={22} color="gray" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push('/profile/history')}
        >
          <FontAwesome name="history" size={22} color="#333" style={styles.icon} />
          <Text style={styles.itemText}>Lịch sử tìm kiếm</Text>
          <FontAwesome name="angle-right" size={22} color="gray" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push('/profile/about_us')}
        >
          <FontAwesome name="users" size={22} color="#333" style={styles.icon} />
          <Text style={styles.itemText}>Đội ngũ phát triển</Text>
          <FontAwesome name="angle-right" size={22} color="gray" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>

       <TouchableOpacity
          style={styles.item}
          onPress={() => {
            Alert.alert(
              'Xác nhận',
              'Bạn có chắc chắn muốn đăng xuất không?',
              [
                {
                  text: 'Huỷ',
                  style: 'cancel',
                },
                {
                  text: 'Đăng xuất',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await AsyncStorage.multiRemove(['access_token', 'user_id', 'remember_email', 'remember_password']);
                      router.replace('/');
                      Alert.alert('Đăng xuất thành công!');
                    } catch (err) {
                      Alert.alert('Lỗi', 'Không thể đăng xuất. Vui lòng thử lại.');
                      console.error('Logout error:', err);
                    }
                  },
                },
              ]
            );
          }}
        >
          <FontAwesome name="sign-out" size={22} color="#333" style={styles.icon1} />
          <Text style={styles.itemText1}>Đăng xuất</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            Alert.alert(
              "Xác nhận xoá",
              "Bạn có chắc chắn muốn xoá tài khoản? Hành động này không thể hoàn tác.",
              [
                { text: "Huỷ", style: "cancel" },
                {
                  text: "Xoá",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      const userId = await AsyncStorage.getItem('user_id');
                      if (!userId) return;

                      const res = await fetch(`${BASE_URL}/users/${userId}`, {
                        method: "DELETE",
                      });

                      if (!res.ok) {
                        const err = await res.json();
                        throw new Error(err.detail || "Không thể xoá tài khoản.");
                      }

                      await AsyncStorage.clear();
                      Alert.alert("Đã xoá tài khoản thành công.");
                      router.replace('/');
                    } catch (error: any) {
                      Alert.alert("Lỗi", error.message || "Đã có lỗi xảy ra.");
                    }
                  },
                },
              ]
            );
          }}
        >
          <FontAwesome name="trash" size={22} color="red" style={styles.icon1} />
          <Text style={[styles.itemText1, { color: 'red' }]}>Xoá tài khoản</Text>
        </TouchableOpacity>

        {/* Khoảng trống để tránh che mất bởi NavigationBar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  logo: { width: 40, height: 40 },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  name: { fontSize: 16, fontWeight: '600' },
  subtitle: { fontSize: 12, color: '#666' },
  settingsTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  icon: { marginRight: 10 },
  itemText: { fontSize: 14, color: '#333' },
  bottomTabContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  itemText1: {
    fontSize: 15,
    color: 'red',
  },
  icon1: {
    marginRight: 14,
    color: 'red',
  },
});
