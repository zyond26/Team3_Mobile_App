import { DrawerActions, useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Text, View, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


export default function Home() {
  const navigation = useNavigation();
  const Stack = createNativeStackNavigator();

  return (
    <View style={{ padding: 20 }}>
      <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <FontAwesome name="bars" size={24} color="black" />
      </TouchableOpacity>
      <Text style={{ marginTop: 20, fontSize: 18 }}>Trang chủ</Text>
    </View>
  );
}
