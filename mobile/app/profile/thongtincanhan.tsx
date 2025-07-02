import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';

export default function ThongTinCaNhan() {
  const [userInfo, setUserInfo] = useState({
    username: 'sam123',
    email: 'sam@example.com',
    password: '********',
    fullName: 'Nguyễn Văn Sam',
    phone: '0901234567',
    address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
  });

  const [editingField, setEditingField] = useState(null); // field đang được sửa
  const [tempValue, setTempValue] = useState(''); // giá trị nhập tạm thời

  const handleEdit = (field: string, value: string) => {
    setEditingField(field);
    setTempValue(value);
  };

  const handleSave = () => {
    setUserInfo({ ...userInfo, [editingField]: tempValue });
    setEditingField(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Thông Tin Cá Nhân</Text>

      {Object.entries(userInfo).map(([field, value]) => (
        <TouchableOpacity
          key={field}
          style={styles.infoBox}
          onPress={() => handleEdit(field, value)}
        >
          <Text style={styles.label}>{getLabel(field)}</Text>
          {editingField === field ? (
            <TextInput
              style={styles.input}
              value={tempValue}
              onChangeText={setTempValue}
              onSubmitEditing={handleSave}
              autoFocus
            />
          ) : (
            <Text style={styles.value}>{value}</Text>
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
