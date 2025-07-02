import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');
const slideWidth = screenWidth - 40; 

interface SliderItem {
  id: number;
  image: any;
  title: string;
  link?: string;
}

interface HomeSliderProps {
  data: SliderItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  onItemPress?: (item: SliderItem) => void;
}

export default function HomeSlider({
  data,
  autoPlay = true,
  autoPlayInterval = 4000,
  onItemPress,
}: HomeSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  const startAutoPlay = () => {
    if (!autoPlay) return;
    
    autoPlayTimer.current = setInterval(() => {
      const nextIndex = (currentIndex + 1) % data.length;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * slideWidth,
        animated: true,
      });
    }, autoPlayInterval);
  };

  const stopAutoPlay = () => {
    if (autoPlayTimer.current) {
      clearInterval(autoPlayTimer.current);
      autoPlayTimer.current = null;
    }
  };

  useEffect(() => {
    if (autoPlay) {
      startAutoPlay();
    }
    return () => stopAutoPlay();
  }, [currentIndex, autoPlay]);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / slideWidth);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  const handleDotPress = (index: number) => {
    setCurrentIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * slideWidth,
      animated: true,
    });
  };

  const handleItemPress = (item: SliderItem) => {
    if (onItemPress) {
      onItemPress(item);
    }
  };

  const handlePrevPress = () => {
    const prevIndex = currentIndex === 0 ? data.length - 1 : currentIndex - 1;
    handleDotPress(prevIndex);
  };

  const handleNextPress = () => {
    const nextIndex = (currentIndex + 1) % data.length;
    handleDotPress(nextIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onScrollBeginDrag={stopAutoPlay}
        onScrollEndDrag={startAutoPlay}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {data.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.slideContainer}
            onPress={() => handleItemPress(item)}
            activeOpacity={0.9}
          >
            <Image
              source={item.image}
              style={styles.slideImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Navigation Dots */}
      <View style={styles.dotsContainer}>
        {data.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.activeDot,
            ]}
            onPress={() => handleDotPress(index)}
          >
            <View style={styles.dotInner} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Navigation Arrows */}
      <TouchableOpacity
        style={[styles.navButton, styles.prevButton]}
        onPress={handlePrevPress}
      >
        <FontAwesome name="chevron-left" size={20} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, styles.nextButton]}
        onPress={handleNextPress}
      >
        <FontAwesome name="chevron-right" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 200,
    marginVertical: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    alignItems: 'center',
  },
  slideContainer: {
    width: slideWidth,
    height: '100%',
    marginHorizontal: 0,
  },
  slideImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDot: {
    backgroundColor: '#D17842',
  },
  dotInner: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  prevButton: {
    left: 10,
  },
  nextButton: {
    right: 10,
  },
}); 