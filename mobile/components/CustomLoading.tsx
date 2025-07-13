import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';

const BOUNCE_DOT_COUNT = 3; 
const BOUNCE_HEIGHT = 10;
const DURATION = 300;

const CustomLoading = () => {
  const animations = useRef(
    [...Array(BOUNCE_DOT_COUNT)].map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    animations.forEach((anim, index) => {
      const bounce = () => {
        Animated.sequence([
          Animated.timing(anim, {
            toValue: -BOUNCE_HEIGHT,
            duration: DURATION,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: DURATION,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]);

        Animated.loop(
          Animated.sequence([
            Animated.delay(index * 150),
            Animated.sequence([
              Animated.timing(anim, {
                toValue: -BOUNCE_HEIGHT,
                duration: DURATION,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
              }),
              Animated.timing(anim, {
                toValue: 0,
                duration: DURATION,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
              }),
            ]),
          ])
        ).start();
      };

      bounce();
    });
  }, []);

  return (
    <View style={styles.container}>
      {animations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              transform: [{ translateY: anim }],
              marginLeft: index > 0 ? 8 : 0,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red', 
  },
});

export default CustomLoading;
