import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
    const router = useRouter();
    useEffect(() => {
        setTimeout(() => {
        router.replace('/');
        }, 4500);
    }, []);

    return (
        <LinearGradient colors={['#FF6F61', '#FFC371']} style={styles.container}>
        <Animatable.View animation="zoomIn" duration={1500} style={styles.logoContainer}>
            <Image source={require('../assets/images/logo.png')} style={styles.logo} />
            <Text style={styles.title}>So Sánh Giá Thông Minh</Text>
        </Animatable.View>

        <View style={styles.brandsContainer}>
            <Animatable.Image
            animation="bounceInLeft"
            delay={500}
            source={require('../assets/images/tikiimg.png')}
            style={styles.brandIcon}
            />
            <Animatable.Image
            animation="bounceInUp"
            delay={1000}
            source={require('../assets/images/Shoppe.jpg')}
            style={styles.brandIcon}
            />
            <Animatable.Image
            animation="bounceInRight"
            delay={1500}
            source={require('../assets/images/lazada.png')}
            style={styles.brandIcon}
            />
        </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 180,
    height: 180,
    borderRadius: 20,
    marginBottom: 15
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center'
  },
  brandsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.8
  },
  brandIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 10
  }
});