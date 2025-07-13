import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BASE_URL } from '@/constants';

export default function ResetPasswordScreen() {
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const router = useRouter();
  const { user_id } = useLocalSearchParams();

  const handleReset = async () => {
    if (!newPass || !confirm) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (newPass !== confirm) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/reset-password/${user_id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_password: newPass })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Lỗi đặt lại mật khẩu");

      Alert.alert("Thành công", "Mật khẩu đã được đặt lại!", [
        { text: "Đăng nhập", onPress: () => router.replace("/signin") }
      ]);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đặt lại mật khẩu</Text>
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới"
        secureTextEntry
        value={newPass}
        onChangeText={setNewPass}
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập lại mật khẩu"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />
      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#D17842',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
