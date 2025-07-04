// import FontAwesome from '@expo/vector-icons/build/FontAwesome';
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   Dimensions,
//   Alert,
//   ScrollView,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getFavorites, addToFavorites } from '../API/api';

// const { width } = Dimensions.get('window');

// type FavoriteItem = {
//   product?: {
//     image_url?: string;
//     name?: string;
//   };
//   price?: number;
//   product_id?: number;
// };

// export default function Favourite() {
//   const navigation = useNavigation();
//   const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

//   useEffect(() => {
//     const fetchFavorites = async () => {
//       try {
//         const userId = await AsyncStorage.getItem('user_id');
//         if (!userId) return;

//         const res = await getFavorites(userId);
//         setFavorites(res.data);
//       } catch (error) {
//         console.log('❌ Lỗi khi tải danh sách yêu thích:', error);
//       }
//     };

//     fetchFavorites();
//   }, []);

//   const handleAddFavorite = async (productId: number) => {
//     const userId = await AsyncStorage.getItem('user_id');
//     if (!userId) return;

//     try {
//       const res = await addToFavorites(userId, productId);
//       Alert.alert('Thành công', res.data.msg || 'Đã thêm sản phẩm vào yêu thích!');

//       // Reload danh sách yêu thích từ server
//       const updated = await getFavorites(userId);
//       setFavorites(updated.data);
//     } catch (err: any) {
//       Alert.alert('Lỗi', `Không thể thêm vào yêu thích: ${err.response?.data?.detail || 'Vui lòng thử lại.'}`);
//     }
//   };

//   const handleTabPress = (label: string) => {
//     navigation.navigate(label as never);
//   };

//   return (
//     <View style={styles.container}>
//       <Image
//         source={require('../assets/images/background.jpg')}
//         style={styles.backgroundImage}
//       />

//       <ScrollView contentContainerStyle={styles.overlay}>
//         <View style={styles.heartBox}>
//           <FontAwesome name="heart" size={40} color="#fff" />
//           <Text style={styles.heartText}>Sản phẩm yêu thích</Text>
//         </View>

//         {favorites.length === 0 ? (
//           <Text style={styles.messageText}>
//             Hiện tại chưa có sản phẩm, hãy cùng{' '}
//             <Text style={{ fontWeight: 'bold' }}>Khám phá</Text> các sản phẩm ~
//           </Text>
//         ) : (
//           favorites.map((item, index) => (
//             <View key={index} style={styles.card}>
//               {item.product?.image_url ? (
//                 <Image source={{ uri: item.product.image_url }} style={styles.image} />
//               ) : (
//                 <View style={styles.imagePlaceholder}>
//                   <Text>Không có hình ảnh</Text>
//                 </View>
//               )}
//               <View style={styles.info}>
//                 <Text style={styles.name}>{item.product?.name || 'Không có tên'}</Text>
//                 <Text style={styles.price}>{item.price?.toLocaleString() || '0'} đ</Text>
//               </View>
//             </View>
//           ))
//         )}
//       </ScrollView>

//       <View style={styles.bottomTab}>
//         {[
//           { icon: 'home', label: 'trangchu', text: 'Trang chủ' },
//           { icon: 'search', label: 'explore', text: 'Khám phá' },
//           { icon: 'heart', label: 'favorite', text: 'Yêu thích' },
//           { icon: 'user', label: 'profile', text: 'Cá nhân' },
//         ].map((tab, index) => (
//           <TouchableOpacity
//             key={index}
//             style={styles.tab}
//             onPress={() => handleTabPress(tab.label)}
//           >
//             <FontAwesome name={tab.icon} size={24} color="#000" />
//             <Text style={styles.tabText}>{tab.text}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );
// }


import FontAwesome from '@expo/vector-icons/build/FontAwesome';
import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet,
  TouchableOpacity, Dimensions, ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFavorites } from '../API/api';

const { width } = Dimensions.get('window');

type FavoriteItem = {
  product?: {
    image_url?: string;
    name?: string;
  };
  price?: number;
};

export default function Favourite() {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userId = await AsyncStorage.getItem('user_id');
        if (!userId) return;

        const res = await getFavorites(userId);
        setFavorites(res.data);
      } catch (error) {
        console.log('❌ Lỗi khi tải danh sách yêu thích:', error);
      }
    };

    fetchFavorites();
  }, []);

  const handleTabPress = (label: string) => {
    navigation.navigate(label as never);
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/background.jpg')} style={styles.backgroundImage} />

      <ScrollView contentContainerStyle={styles.overlay}>
        <View style={styles.heartBox}>
          <FontAwesome name="heart" size={40} color="#fff" />
          <Text style={styles.heartText}>Sản phẩm yêu thích</Text>
        </View>

        {favorites.length === 0 ? (
          <Text style={styles.messageText}>
            Hiện tại chưa có sản phẩm, hãy cùng <Text style={{ fontWeight: 'bold' }}>Khám phá</Text> các sản phẩm ~
          </Text>
        ) : (
          favorites.map((item, index) => (
            <View key={index} style={styles.card}>
              {item.product?.image_url ? (
                <Image source={{ uri: item.product.image_url }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text>Không có hình ảnh</Text>
                </View>
              )}
              <View style={styles.info}>
                <Text style={styles.name}>{item.product?.name || 'Không có tên'}</Text>
                <Text style={styles.price}>{item.price?.toLocaleString() || '0'} đ</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.bottomTab}>
        {[
          { icon: 'home', label: 'trangchu', text: 'Trang chủ' },
          { icon: 'search', label: 'explore', text: 'Khám phá' },
          { icon: 'heart', label: 'favorite', text: 'Yêu thích' },
          { icon: 'user', label: 'profile', text: 'Cá nhân' },
        ].map((tab, index) => (
          <TouchableOpacity key={index} style={styles.tab} onPress={() => handleTabPress(tab.label)}>
            <FontAwesome name={tab.icon} size={24} color="#000" />
            <Text style={styles.tabText}>{tab.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    padding: 20,
    paddingBottom: 140,
  },
  heartBox: {
    backgroundColor: '#EAAE99',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  heartText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  messageText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#EAAE99',
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    width: width,
  },
  tab: { alignItems: 'center' },
  tabText: {
    marginTop: 4,
    fontSize: 12,
    color: '#000',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 14,
    color: '#E53935',
  },
});
