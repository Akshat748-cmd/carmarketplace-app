import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  ViewToken,
  StatusBar,
} from 'react-native';
import { BrandHeader } from '@/components/ui/BrandHeader';
import { ReelItem } from '@/components/discover/ReelItem';
import { MOCK_VEHICLES } from '@/data/mockVehicles';
import { useAppTheme } from '@/context/ThemeContext';

export default function DiscoverScreen() {
  const { isDark } = useAppTheme();
  const { height } = useWindowDimensions();
  const [activeTab, setActiveTab] = useState<'all' | 'listings' | 'reels'>('all');
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredVehicles = useMemo(() => {
    if (activeTab === 'listings') {
      return MOCK_VEHICLES.filter((v) => v.listingType === 'listing');
    }
    if (activeTab === 'reels') {
      return MOCK_VEHICLES.filter((v) => v.listingType === 'social');
    }
    return MOCK_VEHICLES;
  }, [activeTab]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems && viewableItems.length > 0 && viewableItems[0].index !== null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 70,
  }).current;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Brand Header Overlay */}
      <BrandHeader activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Vertical Reels FlatList */}
      <FlatList
        data={filteredVehicles}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ReelItem
            vehicle={item}
            isActive={index === activeIndex}
            itemHeight={height}
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
