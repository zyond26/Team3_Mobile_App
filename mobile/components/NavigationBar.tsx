import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { usePathname, router } from 'expo-router'
import { FontAwesome } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'

export default function NavigationBar() {
  const pathname = usePathname()

  const tabs = [
    { icon: 'home', label: 'Trang chủ', route: '/drawer/home' },
    { icon: 'search', label: 'Khám phá', route: '/drawer/explore' },
    { icon: 'heart', label: 'Yêu thích', route: '/drawer/favorites' },
    { icon: 'user', label: 'Cá nhân', route: '/drawer/profile' },
    { icon: 'cog', label: 'Admin', route: '/admin' }
  ]

  return (
    <View style={styles.bottomTabWrapper}>
      <View style={styles.bottomTab}>
        {tabs.map((tab, index) => {
          const isActive = pathname === tab.route
          return (
            <TouchableOpacity
              key={index}
              style={styles.tab}
              onPress={() => {
                if (pathname !== tab.route) {
                  router.push(tab.route);
                }
              }}
              activeOpacity={0.8}
            >
              <View style={{ alignItems: 'center' }}>
                <FontAwesome
                  name={tab.icon}
                  size={28}
                  color={isActive ? 'red' : '#888'}
                />
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bottomTabWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding:5,
    position: 'absolute',
    borderTopColor: '#ddd',
    borderRadius: 35,
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
    
  },
  tab: {
    alignItems: 'center',
    flex: 1,
  },
  tabText: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
    fontWeight: '500',
  },
  tabTextActive: {
    color: 'red',
    fontWeight: 'bold',
  },
})