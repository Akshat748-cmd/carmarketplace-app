import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/ThemeContext';
import { Spacing, Radius } from '@/constants/theme';

interface BrandHeaderProps {
  activeTab: 'all' | 'listings' | 'reels';
  onSelectTab: (tab: 'all' | 'listings' | 'reels') => void;
}

export function BrandHeader({ activeTab, onSelectTab }: BrandHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();

  return (
    <View style={[styles.headerContainer, { top: Math.max(insets.top, 16) + 8, paddingLeft: Math.max(insets.left, Spacing.four), paddingRight: Math.max(insets.right, Spacing.four) }]}>
      {/* Brand mark */}
      <View style={styles.brandRow}>
        <View style={[styles.brandIconBox, { backgroundColor: colors.accent }]}>
          <Ionicons name="car-sport" size={16} color={isDark ? '#121214' : '#FFFFFF'} />
        </View>
        <Text style={styles.brandTitle}>VehicleSpot</Text>
      </View>

      {/* Feed Filters */}
      <View style={styles.filterPillsContainer}>
        <TouchableOpacity
          onPress={() => onSelectTab('all')}
          style={[styles.filterPill, activeTab === 'all' && styles.filterPillActive]}
          accessibilityLabel="For You feed"
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.filterPillText,
              activeTab === 'all' ? styles.filterPillTextActive : styles.filterPillTextInactive,
            ]}
          >
            For You
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSelectTab('listings')}
          style={[styles.filterPill, activeTab === 'listings' && styles.filterPillActive]}
          accessibilityLabel="For sale listings feed"
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.filterPillText,
              activeTab === 'listings' ? styles.filterPillTextActive : styles.filterPillTextInactive,
            ]}
          >
            For Sale
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSelectTab('reels')}
          style={[styles.filterPill, activeTab === 'reels' && styles.filterPillActive]}
          accessibilityLabel="Community reels feed"
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.filterPillText,
              activeTab === 'reels' ? styles.filterPillTextActive : styles.filterPillTextInactive,
            ]}
          >
            Reels
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search shortcut button */}
      <TouchableOpacity
        style={styles.searchShortcut}
        onPress={() => router.push('/(tabs)/search')}
        accessibilityLabel="Go to search"
        accessibilityRole="button"
      >
        <Ionicons name="search" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    zIndex: 30,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  brandIconBox: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowRadius: 6,
  },
  filterPillsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    padding: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  filterPill: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  filterPillActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  filterPillTextInactive: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  searchShortcut: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
});
