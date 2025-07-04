// screens/ThongTinCaNhan.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserInfo, updateUserInfo } from '@/API/api';

export default function thongtincanhan() {
  const [userInfo, setUserInfo] = useState<any>({
    username: '',
    email: '',
    full_name: '',
    phone_number: '',
    address: ''
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = await AsyncStorage.getItem('user_id');
      if (!userId) {
        Alert.alert("Lỗi", "Không tìm thấy user_id. Vui lòng đăng nhập lại.");
        return;
      }

      try {
        const res = await getUserInfo(Number(userId));
        setUserInfo(res.data);
      } catch (err: any) {
        Alert.alert("Lỗi", `Không thể tải thông tin người dùng: ${err.response?.data?.detail || 'Vui lòng thử lại.'}`);
      }
    };

    fetchUserInfo();
  }, []);

  const handleEdit = (field: string, value: string) => {
    setEditingField(field);
    setTempValue(value);
  };

  const handleSave = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    if (!userId || !editingField) return;
    if (editingField === 'phone_number' && !/^\d{9,11}$/.test(tempValue)) {
      Alert.alert("Lỗi", "Số điện thoại phải có từ 9 đến 11 chữ số.");
      return;
    }

    try {
      // Gửi field cần cập nhật
      await updateUserInfo(Number(userId), { [editingField]: tempValue });

      // ✅ Sau khi cập nhật thành công, gọi lại API để lấy dữ liệu mới
      const res = await getUserInfo(Number(userId));
      setUserInfo(res.data);

      setEditingField(null);
      Alert.alert("Thành công", "Thông tin đã được cập nhật.");
    } catch (err: any) {
      Alert.alert("Lỗi", `Không thể cập nhật thông tin: ${err.response?.data?.detail || 'Vui lòng thử lại.'}`);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thông Tin Cá Nhân</Text>

      {[
        ['username', userInfo.username],
        ['email', userInfo.email],
        ['full_name', userInfo.full_name],
        ['phone_number', userInfo.phone_number],
        ['address', userInfo.address],
      ].map(([field, value]) => (
        <TouchableOpacity
          key={field}
          style={styles.infoBox}
          onPress={() => handleEdit(field, value || '')}
          disabled={field === 'username' || field === 'email'}
        >
          <Text style={styles.label}>{getLabel(field)}</Text>
          {editingField === field ? (
            <TextInput
              style={styles.input}
              value={tempValue}
              keyboardType={field === 'phone_number' ? 'numeric' : 'default'}
              onChangeText={(text) => {
                if (field === 'phone_number') {
                  const onlyNumbers = text.replace(/[^0-9]/g, '');
                  setTempValue(onlyNumbers);
                } else {
                  setTempValue(text);
                }
              }}
              onSubmitEditing={handleSave}
              autoFocus
            />

          ) : (
            <Text style={styles.value}>{value || 'Chưa có'}</Text>
          )}
        </TouchableOpacity>
      ))}

      {editingField && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const getLabel = (field: string) => {
  switch (field) {
    case 'username': return 'Tên đăng nhập';
    case 'email': return 'Email';
    case 'full_name': return 'Họ và tên';
    case 'phone_number': return 'Số điện thoại';
    case 'address': return 'Địa chỉ';
    default: return field;
  }
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
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
  }
});
