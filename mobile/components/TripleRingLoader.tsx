import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const SIZE = 60;
const STROKE_WIDTHS = [5, 4, 3];
const RADII = [25, 18, 12];
const COLORS = ['red', '#FF6666', '#FFCCCC'];
const SPEEDS = [800, 1000, 1200];

const TripleRingLoader = () => {
  const rotate1 = useRef(new Animated.Value(0)).current;
  const rotate2 = useRef(new Animated.Value(0)).current;
  const rotate3 = useRef(new Animated.Value(0)).current;

  const createRotation = (animatedValue: Animated.Value, duration: number) => {
    return Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
  };

  useEffect(() => {
    createRotation(rotate1, SPEEDS[0]).start();
    createRotation(rotate2, SPEEDS[1]).start();
    createRotation(rotate3, SPEEDS[2]).start();
  }, []);

  const getRotationStyle = (anim: Animated.Value, reverse = false) => ({
    transform: [
      {
        rotate: anim.interpolate({
          inputRange: [0, 1],
          outputRange: reverse ? ['360deg', '0deg'] : ['0deg', '360deg'],
        }),
      },
    ],
  });

  const rings = [rotate1, rotate2, rotate3];

  return (
    <View style={styles.container}>
      {rings.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.ring,
            getRotationStyle(anim, index % 2 === 1),
            { position: 'absolute' },
          ]}
        >
          <Svg height={SIZE} width={SIZE}>
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADII[index]}
              stroke={COLORS[index]}
              strokeWidth={STROKE_WIDTHS[index]}
              strokeDasharray="90 45" 
              strokeDashoffset="0"
              fill="none"
              strokeLinecap="round"
            />
          </Svg>
        </Animated.View>
      ))}
    </View>
  );
};

export default TripleRingLoader;

const styles = StyleSheet.create({
  container: {
    height: SIZE,
    width: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  ring: {
    position: 'absolute',
  },
});
