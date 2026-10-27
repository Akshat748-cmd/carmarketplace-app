import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/ThemeContext';
import { useSaved } from '@/context/SavedContext';
import { Spacing, Radius } from '@/constants/theme';

export interface CustomTabBarProps {
  state: {
    index: number;
    routes: Array<{
      key: string;
      name: string;
      params?: any;
    }>;
  };
  descriptors: Record<string, { options: any }>;
  navigation: {
    emit: (event: any) => any;
    navigate: (name: string, params?: any) => void;
  };
}

export function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();
  const { savedIds } = useSaved();

  const routes = state.routes;

  const getIcon = (routeName: string, isFocused: boolean) => {
    switch (routeName) {
      case 'index':
        return isFocused ? 'compass' : 'compass-outline';
      case 'search':
        return isFocused ? 'search' : 'search-outline';
      case 'create':
        return 'add';
      case 'saved':
        return isFocused ? 'bookmark' : 'bookmark-outline';
      case 'profile':
        return isFocused ? 'person' : 'person-outline';
      default:
        return 'ellipse';
    }
  };

  const getLabel = (routeName: string) => {
    switch (routeName) {
      case 'index':
        return 'Discover';
      case 'search':
        return 'Search';
      case 'create':
        return 'Create';
      case 'saved':
        return 'Saved';
      case 'profile':
        return 'Profile';
      default:
        return routeName;
    }
  };

  return (
    <View
      style={[
        styles.tabBarContainer,
        {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.tabBarBorder,
          paddingBottom: Math.max(insets.bottom, 12),
          paddingLeft: Math.max(insets.left, 8),
          paddingRight: Math.max(insets.right, 8),
        },
      ]}
    >
      {routes.map((route, index: number) => {
        const isFocused = state.index === index;
        const isCreateTab = route.name === 'create';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        if (isCreateTab) {
          return (
            <View key={route.key} style={styles.createTabWrapper}>
              <TouchableOpacity
                onPress={onPress}
                onLongPress={onLongPress}
                style={[
                  styles.createButton,
                  {
                    backgroundColor: colors.accent,
                    shadowColor: colors.accent,
                  },
                ]}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Create listing or post video"
                accessibilityState={isFocused ? { selected: true } : {}}
              >
                <Ionicons
                  name="add"
                  size={28}
                  color={isDark ? '#121214' : '#FFFFFF'}
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.createLabel,
                  { color: isFocused ? colors.accent : colors.tabInactive },
                ]}
              >
                Create
              </Text>
            </View>
          );
        }

        const iconName = getIcon(route.name, isFocused) as any;
        const label = getLabel(route.name);

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={`${label} tab`}
          >
            <View style={styles.iconContainer}>
              <Ionicons
                name={iconName}
                size={22}
                color={isFocused ? colors.accent : colors.tabInactive}
              />
              {route.name === 'saved' && savedIds.length > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.accent }]}>
                  <Text style={[styles.badgeText, { color: isDark ? '#121214' : '#FFFFFF' }]}>
                    {savedIds.length}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.tabLabel,
                {
                  color: isFocused ? colors.accent : colors.tabInactive,
                  fontWeight: isFocused ? '700' : '500',
                },
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  iconContainer: {
    position: 'relative',
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  createTabWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    top: -12,
  },
  createButton: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  createLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 3,
  },
});