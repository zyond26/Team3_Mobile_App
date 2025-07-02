// mobile/screens/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  const handleSubmit = () => {
    if (!email.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập địa chỉ email!');
      return;
    }
    Alert.alert('Gửi thành công', 'Kiểm tra email để đặt lại mật khẩu!');
  };

  return (
    <View style={styles.container}>
      {/* Logo trên đầu */}
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logoTop}
        resizeMode="contain"
      />

      {/* Hình minh hoạ */}
      <Image
        source={require('../assets/images/forgotpass.png')}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Tiêu đề */}
      <Text style={styles.title}>Quên mật khẩu ?</Text>
      <Text style={styles.subtitle}>
        Đừng lo lắng. Vui lòng nhập{'\n'}địa chỉ email liên kết với tài khoản của bạn !
      </Text>

      {/* Input */}
      <TextInput
        style={styles.input}
        placeholder="E-mail address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Nút Submit */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTop: {
    width: 60,
    height: 60,
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
  },
  image: {
    width: 250,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 25,
  },
  input: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 14,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#D17842',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
