import React from 'react';
import { View, Text } from 'react-native';
import NavigationBar from '../components/NavigationBar';

export default function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Cài đặt</Text>
      <View style={{ height: 100, width: 100, backgroundColor: 'red' }}></View>
      <NavigationBar />
    </View>
  );
}