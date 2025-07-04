import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { register } from '../API/api';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [errors, setErrors] = useState<{
    username?: string;
    fullName?: string;
    email?: string;
    password?: string;
    confirm?: string;
  }>({});

  const handleSignUp = async () => {
    const newErrors: typeof errors = {};

    if (!fullName) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!username) newErrors.username = 'Vui lòng nhập tên đăng nhập';
    if (!email) newErrors.email = 'Vui lòng nhập email';
    if (!password) newErrors.password = 'Vui lòng nhập mật khẩu';
    else if (password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    if (!confirm) newErrors.confirm = 'Vui lòng xác nhận lại mật khẩu';
    if (password && confirm && password !== confirm) newErrors.confirm = 'Mật khẩu không khớp';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!agreed) {
      Alert.alert("Thông báo", "Bạn phải đồng ý với điều khoản và dịch vụ!");
      return;
    }

    try {
      const res = await register({
        username,
        password,
        email,
        full_name: fullName,
        phone_number: '',
        address: '',
      });
      if (res.data && res.data.user_id) {
        await AsyncStorage.setItem('user_id', res.data.user_id.toString());
        Alert.alert("Thành công", res.data.msg || "Tài khoản đã được tạo!", [
          {
            text: "OK",
            onPress: () => router.replace('/signin'),
          },
        ]);
      } else {
        Alert.alert("Lỗi", "Không nhận được user_id từ server.");
      }
    } catch (err: any) {
      Alert.alert("Lỗi đăng ký", err.response?.data?.detail || 'Không thể đăng ký, vui lòng thử lại.');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Đăng ký</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập họ và tên"
        placeholderTextColor="grey"
        value={fullName}
        onChangeText={(text) => {
          setFullName(text);
          setErrors({ ...errors, fullName: undefined });
        }}
      />
      {errors.fullName && <Text style={styles.error}>{errors.fullName}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Nhập tên đăng nhập"
        placeholderTextColor="grey"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          setErrors({ ...errors, username: undefined });
        }}
      />
      {errors.username && <Text style={styles.error}>{errors.username}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Nhập địa chỉ email"
        placeholderTextColor="grey"
        keyboardType="email-address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors({ ...errors, email: undefined });
        }}
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu"
          placeholderTextColor="grey"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrors({ ...errors, password: undefined });
          }}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.icon}>
          <FontAwesome name={passwordVisible ? 'eye-slash' : 'eye'} size={20} />
        </TouchableOpacity>
      </View>
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập lại mật khẩu"
          placeholderTextColor="grey"
          secureTextEntry={!confirmVisible}
          value={confirm}
          onChangeText={(text) => {
            setConfirm(text);
            setErrors({ ...errors, confirm: undefined });
          }}
        />
        <TouchableOpacity onPress={() => setConfirmVisible(!confirmVisible)} style={styles.icon}>
          <FontAwesome name={confirmVisible ? 'eye-slash' : 'eye'} size={20} />
        </TouchableOpacity>
      </View>
      {errors.confirm && <Text style={styles.error}>{errors.confirm}</Text>}

      <TouchableOpacity style={styles.agreeContainer} onPress={() => setAgreed(!agreed)}>
        <FontAwesome
          name={agreed ? 'check-square' : 'square-o'}
          size={20}
          style={styles.checkbox}
        />
        <Text style={styles.agreeText}>Tôi đồng ý với điều khoản và dịch vụ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { opacity: agreed ? 1 : 0.6 }]}
        disabled={!agreed}
        onPress={handleSignUp}
      >
        <Text style={styles.buttonText}>Đăng ký</Text>
      </TouchableOpacity>

      <Text style={styles.socialText}>Hoặc bạn có thể đăng ký bằng</Text>
      <View style={styles.separator} />
      <View style={styles.socialButtons}>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="apple" size={40} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="google" size={40} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <FontAwesome name="facebook" size={40} color="#3b5998" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, alignItems: 'center' },
  logo: { width: 100, height: 100, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  input: {
    width: '100%', height: 50, backgroundColor: '#f0f0f0',
    borderRadius: 10, marginBottom: 20, paddingHorizontal: 10,
    borderWidth: 1, borderColor: '#aaa'
  },
  passwordContainer: { width: '100%', position: 'relative' },
  icon: { position: 'absolute', right: 15, top: 12 },
  agreeContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10, alignSelf: 'flex-start' },
  checkbox: { marginRight: 10, color: '#D17842' },
  agreeText: { fontSize: 14 },
  button: {
    backgroundColor: '#D17842', paddingVertical: 15, paddingHorizontal: 30,
    borderRadius: 10, width: '100%', alignItems: 'center', marginVertical: 10
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  socialText: { marginTop: 15, fontSize: 14, color: '#444' },
  separator: { height: 1, width: '100%', backgroundColor: '#ccc', marginVertical: 10 },
  socialButtons: { flexDirection: 'row', marginTop: 10, width: '100%', justifyContent: 'space-between' },
  socialButton: { flex: 1, alignItems: 'center', marginHorizontal: 5 },
  error: {
    color: 'red',
    fontSize: 12,
    marginTop: -15,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
});