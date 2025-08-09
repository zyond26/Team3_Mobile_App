import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BASE_URL } from '@/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TripleRingLoader from '@/components/TripleRingLoader';
import CustomLoading from '@/components/CustomLoading';

export default function SignInScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadRemembered = async () => {
      const savedEmail = await AsyncStorage.getItem('remember_email');
      const savedPassword = await AsyncStorage.getItem('remember_password');
      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    };
    loadRemembered();
  }, []);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        router.replace('/drawer/home');
      }
    };
    checkLogin();
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Lỗi đăng nhập");
      }

      const data = await response.json();

      if (data.success) {
        await AsyncStorage.setItem('access_token', data.access_token);
        await AsyncStorage.setItem('user_id', data.user.id.toString());

        if (rememberMe) {
          await AsyncStorage.setItem('remember_email', email);
          await AsyncStorage.setItem('remember_password', password);
        } else {
          await AsyncStorage.removeItem('remember_email');
          await AsyncStorage.removeItem('remember_password');
        }

        Alert.alert("Đăng nhập thành công", `Chào ${data.user.username}!`, [
          { text: "OK", onPress: () => router.replace('/drawer/home') }
        ]);
      }

    } catch (err) {
      const error = err as Error;
      Alert.alert("Lỗi", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* <TripleRingLoader /> */}
        <CustomLoading />
        <Text style={{ marginTop: 10 }}>Đang xác thực...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Đăng Nhập</Text>

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

      {/* Remember Me */}
      <View style={styles.rowContainer}>
        <TouchableOpacity style={styles.rememberMeGroup} onPress={() => setRememberMe(!rememberMe)}>
          <FontAwesome
            name={rememberMe ? 'check-square' : 'square-o'}
            size={20}
            style={styles.checkbox}
          />
          <Text style={styles.optionText}>Ghi nhớ đăng nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/forgot')}>
          <Text style={styles.optionText}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Đăng Nhập</Text>
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

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Bạn chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={[styles.signupText, { fontWeight: 'bold', color: '#007BFF' }]}>
            Đăng ký ngay
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
    alignItems: 'center',
    paddingTop: 90,
  },
  logo: { 
    width: 100, 
    height: 100,
    marginBottom: 20 
  },
  title: { 
    fontSize: 24,
    fontWeight: 'bold', 
    marginBottom: 30 
  },
  input: {
    width: '100%', 
    height: 50, 
    backgroundColor: '#f0f0f0',
    borderRadius: 10, 
    marginBottom: 20, 
    paddingHorizontal: 15,
    borderWidth: 1, 
    borderColor: '#aaa',
  },
  passwordContainer: { 
    width: '100%',
    position: 'relative' 
  },
  icon: {
    position: 'absolute',
    right: 15, 
    top: 15 
  },
  button: {
    backgroundColor: '#D17842',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10, 
    width: '100%', 
    alignItems: 'center', 
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 16 
  },
  socialText: {
    marginTop: 15,
    fontSize: 14, 
    color: '#444', 
    textAlign: 'center' 
  },
  separator: { 
    height: 1, 
    width: '100%', 
    backgroundColor: '#ccc',
    marginVertical: 10 
  },
  socialButtons: {
    flexDirection: 'row', 
    marginTop: 10, 
    width: '100%', 
    justifyContent: 'space-between',
  },
  socialButton: { 
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5 
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  checkbox: { 
    marginRight: 5, 
    color: '#D17842' 
  },
  rememberMeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checked: {
    width: 12,
    height: 12,
    backgroundColor: '#007BFF',
  },
  optionText: {
    fontSize: 14,
    color: '#D17842',
    fontWeight: 'bold',
  },
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
