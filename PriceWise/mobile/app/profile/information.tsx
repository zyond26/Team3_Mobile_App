import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, TextInput, Alert,
  ActivityIndicator, Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/constants';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import TripleRingLoader from '@/components/TripleRingLoader';

export default function ThongTinCaNhan() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id');
        if (!userId) {
          Alert.alert("Lỗi", "Không tìm thấy user_id trong bộ nhớ.");
          return;
        }

        const response = await fetch(`${BASE_URL}/api/user/${userId}`);
        if (!response.ok) throw new Error("Lỗi khi gọi API");

        const data = await response.json();
        setUserInfo({
          username: data.username,
          email: data.email,
          password: '',
          fullName: data.full_name,
          phone: data.phone_number || 'Chưa cập nhật',
          address: data.address || 'Chưa cập nhật',
        });
        setLoading(false);
      } catch (err) {
        Alert.alert("Lỗi", "Không thể tải thông tin người dùng");
      }
    };
    fetchUser();
  }, []);

    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TripleRingLoader />
          <Text style={{ marginTop: 10 }}>Đang tải dữ liệu...</Text>
        </View>
      );
    }

  const handleChange = (field: string, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleEdit = (field: string, value: string) => {
    setEditingField(field);
    setTempValue(value);
  };

  const handleUpdateAll = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');

      const updatedPayload: any = {
        username: userInfo.username,
        email: userInfo.email,
        full_name: userInfo.fullName,
        phone_number: userInfo.phone,
        address: userInfo.address,
      };

      if (userInfo.password && userInfo.password.trim() !== '') {
        updatedPayload.password = userInfo.password; 
      }

      const response = await fetch(`${BASE_URL}/api/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(updatedPayload),
      });

      if (!response.ok) throw new Error("Lỗi cập nhật");

      Alert.alert("Thành công", "Thông tin đã được cập nhật.");
      router.push('/drawer/profile');
    } catch (err) {
      Alert.alert("Lỗi", "Không thể cập nhật thông tin");
    }
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.profileSection}>
            <Image
              source={require('../../assets/images/avatar.png')}
              style={styles.avatar}
            />
            <Text style={styles.name}>
              {userInfo?.fullName || 'Đang tải...'}
            </Text>

            <Text style={styles.email}>
              {userInfo?.email || 'Đang tải...'}
            </Text>
          </TouchableOpacity>

         {Object.entries(userInfo).map(([field, value]) => (
            <View key={field} style={styles.infoBox}>
              <Text style={styles.label}>{getLabel(field)}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={field === 'password' ? tempValue : String(value)}
                  placeholder={field === 'password' ? '***********' : ''}
                  secureTextEntry={field === 'password' && !showPassword}
                  keyboardType={field === 'phone' ? 'phone-pad' : 'default'}
                  onChangeText={text => {
                    if (field === 'password') {
                      setTempValue(text);
                      setUserInfo(prev => ({ ...prev, password: text }));
                    } else {
                      handleChange(field, text);
                    }
                  }}
                />
                {field === 'password' && (
                  <Text style={{ fontStyle: 'italic', color: '#888', marginTop: 5 }}>
                    Để trống nếu không muốn thay đổi mật khẩu
                  </Text>
                )}
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateAll}>
            <Text style={styles.updateButtonText}>Cập nhật</Text>
          </TouchableOpacity>

           <TouchableOpacity style={styles.backButton} onPress={() => router.push('/drawer/profile')}>
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
    paddingVertical: 1,
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
  saveBtn: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
  updateButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#D17842',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileSection: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  name: {
    fontSize: 25,
    fontWeight: '600',
    textAlign: 'center', 
    color: '#000'
  },
  email: {
    fontSize: 15,
    color: '#000',
  }
});
