import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const createRipple = (delay: number, size: number, color: string) => {
  const radius = useSharedValue(0);
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    radius.value = withDelay(
      delay,
      withRepeat(withTiming(size * 1.5, { duration: 2000 }), -1, false)
    );
    opacity.value = withDelay(
      delay,
      withRepeat(withTiming(0, { duration: 2000 }), -1, false)
    );
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    r: radius.value,
    opacity: opacity.value,
  }));

  return (
    <AnimatedCircle
      key={delay}
      cx="100"
      cy="100"
      fill="none"
      stroke={color}
      strokeWidth="2"
      animatedProps={animatedProps}
    />
  );
};

const RippleEffect = ({ color = '#0077cc', size = 90 }) => {
  const delays = [0, 400, 800]; // nhiều gợn sóng

  return (
    <View style={[styles.container, { width: size * 2, height: size * 2 }]}>
      <Svg height="100%" width="100%" viewBox="0 0 200 200">
        {delays.map((d) => createRipple(d, size, color))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -45,
    left: -44,
    zIndex: -1,
  },
});

export default RippleEffect;
