// components/RefreshWrapper.tsx
import React, { useState, useCallback } from 'react';
import { ScrollView, RefreshControl, ViewStyle, StyleProp } from 'react-native';

interface RefreshWrapperProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void> | void;
  style?: StyleProp<ViewStyle>;
}

const RefreshWrapper: React.FC<RefreshWrapperProps> = ({ children, onRefresh, style }) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.resolve(onRefresh());
    setRefreshing(false);
  }, [onRefresh]);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={style}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {children}
    </ScrollView>
  );
};

export default RefreshWrapper;
