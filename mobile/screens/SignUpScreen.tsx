import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BASE_URL } from '@/constants';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();
  const handleSignUp = async () => {
    if (!agreed) {
      Alert.alert("Thông báo", "Bạn phải đồng ý với điều khoản và dịch vụ!");
      return;
    }
    if (!email || !password || !confirm) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,    
          email: email,
          username: email.split('@')[0],
          password_hash: password
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Lỗi đăng ký");
      }

      Alert.alert("Thành công", "Đăng ký thành công!", [
        {
          text: "Đăng nhập",
          onPress: () => router.replace('/signin'), 
        }
      ]);

    } catch (err) {
      const error = err as Error;
      Alert.alert("Lỗi", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Đăng Ký</Text>

     <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        placeholderTextColor="#333"
        keyboardType="default"
        autoCapitalize="words"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="Địa chỉ Email"
        placeholderTextColor="#333"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          placeholderTextColor="#333"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.icon}>
          <FontAwesome name={passwordVisible ? 'eye-slash' : 'eye'} size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Xác nhận mật khẩu"
          placeholderTextColor="#333"
          secureTextEntry={!confirmVisible}
          value={confirm}
          onChangeText={setConfirm}
        />
        <TouchableOpacity onPress={() => setConfirmVisible(!confirmVisible)} style={styles.icon}>
          <FontAwesome name={confirmVisible ? 'eye-slash' : 'eye'} size={20} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.agreeContainer} onPress={() => setAgreed(!agreed)}>
        <FontAwesome name={agreed ? 'check-square' : 'square-o'} size={20} style={styles.checkbox} />
        <Text style={styles.agreeText}>Tôi đồng ý với điều khoản và dịch vụ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { opacity: agreed ? 1 : 0.6 }]}
        disabled={!agreed}
        onPress={handleSignUp}
      >
        <Text style={styles.buttonText}>Đăng Ký</Text>
      </TouchableOpacity>

      <Text style={styles.socialText}>hoặc bạn có thể đăng ký bằng</Text>
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

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Bạn đã có tài khoản? </Text>
        <TouchableOpacity onPress={() => router.push('/signin')}>
          <Text style={[styles.signupText, { fontWeight: 'bold', color: '#007BFF' }]}>
            Đăng nhập ngay
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
     paddingTop: 90,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%', height: 50, backgroundColor: '#f0f0f0', borderRadius: 10,
    marginBottom: 20, paddingHorizontal: 10, borderWidth: 1, borderColor: '#aaa',
  },
  passwordContainer: { width: '100%', position: 'relative' },
  icon: { position: 'absolute', right: 15, top: 12 },
  agreeContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10, alignSelf: 'flex-start' },
  checkbox: { marginRight: 10, color: '#D17842' },
  agreeText: { fontSize: 14, color: '#D17842', fontWeight: 'bold' },
  button: {
    backgroundColor: '#D17842', paddingVertical: 15, paddingHorizontal: 30,
    borderRadius: 10, width: '100%', alignItems: 'center', marginVertical: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  socialText: { marginTop: 15, fontSize: 14, color: '#444' },
  separator: { height: 1, width: '100%', backgroundColor: '#ccc', marginVertical: 10 },
  socialButtons: { flexDirection: 'row', marginTop: 10, width: '100%', justifyContent: 'space-between' },
  socialButton: { flex: 1, alignItems: 'center', marginHorizontal: 5 },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    color: '#333',
  },
});
