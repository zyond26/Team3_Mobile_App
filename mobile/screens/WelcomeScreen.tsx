import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Thêm dòng này để điều hướng

export default function WelcomeScreen() {
  const router = useRouter(); // Hook điều hướng

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome to <Text style={styles.bold}>PriceWise</Text>
      </Text>

      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <TouchableOpacity
        style={styles.signInButton}
        onPress={() => router.push('/signin')} // Điều hướng sang /signin
      >
        <Text style={styles.signInText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => router.push('/signup')} // Điều hướng sang /signup
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Đẩy nội dung vào giữa
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  logo: {
    width: 200, // Kích thước logo
    height: 200,
    marginBottom: 20,
  },
  signInButton: {
    backgroundColor: '#D19A6A', // Màu nâu nhạt cho nút Sign In
    padding: 15,
    borderRadius: 10, // Bo góc
    marginVertical: 10,
    width: '80%', // Chiều rộng nút
    alignItems: 'center',
  },
  signUpButton: {
    backgroundColor: '#fff', // Màu trắng cho nút Sign Up
    padding: 15,
    borderRadius: 10, // Bo góc
    marginVertical: 10,
    width: '80%', // Chiều rộng nút
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D19A6A', // Đường viền màu nâu nhạt
  },
  signInText: {
    color: '#fff', // Màu chữ cho nút Sign In
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    color: '#D19A6A', // Màu chữ cho nút Sign Up
    fontSize: 16,
    fontWeight: 'bold',
  },
});