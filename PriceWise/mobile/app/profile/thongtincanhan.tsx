import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Alert,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/constants';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ThongTinCaNhan() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id');
        console.log("Fetched user_id from storage:", userId);

        if (!userId) {
          Alert.alert("Lỗi", "Không tìm thấy user_id trong bộ nhớ.");
          return;
        }

        const response = await fetch(`${BASE_URL}/api/user/${userId}`);
        if (!response.ok) throw new Error("Lỗi khi gọi API");

        const data = await response.json();
        console.log("Fetched user info:", data);

        setUserInfo({
          username: data.username,
          email: data.email,
          password: data.password_hash,
          fullName: data.full_name || '',
          phone: data.phone_number || '',
          address: data.address || '',
        });
      } catch (err) {
        console.error("Error fetching user info:", err);
        Alert.alert("Lỗi", "Không thể tải thông tin người dùng");
      }
    };
    
    fetchUser();
  }, []);

  const handleEdit = (field: string, value: string) => {
    setEditingField(field);
    setTempValue(value);
  };

  const handleSave = () => {
    setUserInfo({ ...userInfo, [editingField!]: tempValue });
    setEditingField(null);
  };

  if (!userInfo) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={{ marginTop: 10 }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thông Tin Cá Nhân</Text>

      {Object.entries(userInfo).map(([field, value]) => (
        <TouchableOpacity
          key={field}
          style={styles.infoBox}
          onPress={() => handleEdit(field, String(value))}
          activeOpacity={field === 'password' ? 1 : 0.7}
        >
          <Text style={styles.label}>{getLabel(field)}</Text>

          {editingField === field ? (
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={tempValue}
                onChangeText={setTempValue}
                onSubmitEditing={handleSave}
                autoFocus
                secureTextEntry={field === 'password' && !showPassword}
              />
              {field === 'password' && (
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#555" />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.inputWrapper}>
              <Text style={styles.value}>
                {field === 'password' && !showPassword ? '********' : String(value)}
              </Text>
              {field === 'password' && (
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#555" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </TouchableOpacity>
      

      ))}

      <View style={styles.logoutContainer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.push('/')}
          activeOpacity={0.8}
        >
          <FontAwesome name="sign-out" size={20} color="#fff" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
  </ScrollView>
  );
}

const getLabel = (field: string) => {
  switch (field) {
    case 'username': return 'Tên đăng nhập';
    case 'email': return 'Email';
    case 'password': return 'Mật khẩu';
    case 'fullName': return 'Họ và tên';
    case 'phone': return 'Số điện thoại';
    case 'address': return 'Địa chỉ';
    default: return field;
  }
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 100,
    paddingHorizontal: 20,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D17842',
    marginBottom: 30,
    textAlign: 'center',
  },
  infoBox: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  label: {
    fontSize: 13,
    color: '#999',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  input: {
    fontSize: 16,
    color: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#D17842',
    paddingVertical: 4,
  },
  saveButton: {
    backgroundColor: '#D17842',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -10 }],
  },

  logoutContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 95,
    borderRadius: 15,
    elevation: 5,
    minWidth: 200,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
