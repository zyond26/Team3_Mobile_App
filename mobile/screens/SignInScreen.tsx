import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// Update the import path if needed, or create the file if missing
import { login } from '../API/api'; // <-- gọi API login

export default function SignInScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    try {
      const response = await login({ email, password });

      if (!response || !response.data) {
        Alert.alert("Lỗi", "Phản hồi không hợp lệ từ máy chủ.");
        return;
      }

      console.log("Login response:", response.data);

      // Nếu có dùng token:
      // await AsyncStorage.setItem('token', response.data.access_token);

      Alert.alert("Đăng nhập thành công!", "", [
        {
          text: "OK",
          onPress: () => {
            try {
              router.replace('/home');
            } catch (e) {
              console.log("Lỗi khi chuyển trang:", e);
            }
          },
        },
      ]);
    } catch (err: any) {
      console.error("Lỗi đăng nhập:", err.message, err.response?.data);
      Alert.alert("Đăng nhập thất bại", err.response?.data?.detail || 'Lỗi không xác định.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Sign In</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#999"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)}
          style={styles.icon}
        >
          <FontAwesome
            name={passwordVisible ? 'eye-slash' : 'eye'}
            size={20}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => router.push('/forgot')}
      >
        <Text style={styles.forgotText}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.socialText}>hoặc bạn có thể đăng nhập bằng</Text>
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
    borderRadius: 10, marginBottom: 20, paddingHorizontal: 15,
    borderWidth: 1, borderColor: '#aaa', color: '#000'
  },
  passwordContainer: { width: '100%', position: 'relative' },
  icon: { position: 'absolute', right: 15, top: 15 },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText: { fontSize: 14, color: '#D17842', fontWeight: '600' },
  button: {
    backgroundColor: '#D17842', paddingVertical: 12, paddingHorizontal: 30,
    borderRadius: 10, width: '100%', alignItems: 'center', marginVertical: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  socialText: { marginTop: 15, fontSize: 14, color: '#444', textAlign: 'center' },
  separator: { height: 1, width: '100%', backgroundColor: '#ccc', marginVertical: 10 },
  socialButtons: {
    flexDirection: 'row', marginTop: 10, width: '100%', justifyContent: 'space-between',
  },
  socialButton: { flex: 1, alignItems: 'center', marginHorizontal: 5 },
});
