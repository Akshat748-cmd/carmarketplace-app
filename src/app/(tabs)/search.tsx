import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_VEHICLES } from '@/data/mockVehicles';
import { useAppTheme } from '@/context/ThemeContext';
import { useSaved } from '@/context/SavedContext';
import { SearchFilters, Vehicle } from '@/types';
import { FilterModal } from '@/components/search/FilterModal';
import { Spacing, Radius } from '@/constants/theme';

const CATEGORIES = ['All', 'Supercars', 'Luxury SUV', 'Off-Road', 'Electric', 'Under 500K'];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();
  const { isSaved, toggleSave } = useSaved();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'All',
    listingType: 'all',
    mediaType: 'all',
    priceRange: 'all',
    verifiedOnly: false,
  });

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.listingType !== 'all') count++;
    if (filters.mediaType !== 'all') count++;
    if (filters.priceRange !== 'all') count++;
    if (filters.verifiedOnly) count++;
    return count;
  }, [filters]);

  const filteredVehicles = useMemo(() => {
    return MOCK_VEHICLES.filter((item) => {
      // Text Query Match
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesMake = item.make.toLowerCase().includes(q);
        const matchesLocation = item.location.toLowerCase().includes(q);
        const matchesTag = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesMake && !matchesLocation && !matchesTag) {
          return false;
        }
      }

      // Category Pill Match
      if (selectedCategory !== 'All') {
        if (selectedCategory === 'Supercars') {
          if (!item.tags.includes('Supercar') && !item.tags.includes('Hypercar')) return false;
        } else if (selectedCategory === 'Luxury SUV') {
          if (!item.tags.includes('Luxury SUV') && !item.tags.includes('Super SUV')) return false;
        } else if (selectedCategory === 'Off-Road') {
          if (!item.tags.includes('Off-Road') && !item.tags.includes('Desert Run')) return false;
        } else if (selectedCategory === 'Electric') {
          if (!item.tags.includes('Electric') && !item.tags.includes('Hybrid')) return false;
        } else if (selectedCategory === 'Under 500K') {
          if (!item.priceAED || item.priceAED > 500000) return false;
        }
      }

      // Listing Type Filter
      if (filters.listingType !== 'all' && item.listingType !== filters.listingType) {
        return false;
      }

      // Media Type Filter
      if (filters.mediaType !== 'all' && item.mediaType !== filters.mediaType) {
        return false;
      }

      // Price Range Filter
      if (filters.priceRange !== 'all') {
        if (!item.priceAED) return false;
        if (filters.priceRange === 'under300k' && item.priceAED >= 300000) return false;
        if (filters.priceRange === '300k-700k' && (item.priceAED < 300000 || item.priceAED > 700000)) return false;
        if (filters.priceRange === '700k-1.5m' && (item.priceAED < 700000 || item.priceAED > 1500000)) return false;
        if (filters.priceRange === '1.5m-plus' && item.priceAED < 1500000) return false;
      }

      // Verified Only Filter
      if (filters.verifiedOnly && !item.seller.verified) {
        return false;
      }

      return true;
    });
  }, [query, selectedCategory, filters]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Top Search & Filter Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8, borderBottomColor: colors.borderSubtle }]}>
        <View style={styles.searchRow}>
          <View
            style={[
              styles.inputWrap,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="search" size={18} color={colors.textSecondary} style={{ marginRight: 8 }} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Search Porsche, G63, Ferrari, Dubai..."
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} style={{ padding: 4 }}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter button with badge */}
          <TouchableOpacity
            style={[
              styles.filterBtn,
              {
                backgroundColor: activeFiltersCount > 0 ? colors.accent : colors.surfaceElevated,
                borderColor: activeFiltersCount > 0 ? colors.accent : colors.border,
              },
            ]}
            onPress={() => setShowFilterModal(true)}
            accessibilityLabel="Filter vehicles"
            accessibilityRole="button"
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={activeFiltersCount > 0 ? (isDark ? '#121214' : '#FFFFFF') : colors.text}
            />
            {activeFiltersCount > 0 && (
              <View style={[styles.filterBadge, { backgroundColor: isDark ? '#121214' : '#FFFFFF' }]}>
                <Text style={[styles.filterBadgeText, { color: colors.accent }]}>
                  {activeFiltersCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected ? colors.accent : colors.surfaceElevated,
                    borderColor: isSelected ? colors.accent : colors.border,
                  },
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: isSelected ? (isDark ? '#121214' : '#FFFFFF') : colors.text,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Results List */}
      <FlatList
        data={filteredVehicles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: insets.bottom + 90 },
        ]}
        renderItem={({ item }) => {
          const saved = isSaved(item.id);
          return (
            <TouchableOpacity
              style={[
                styles.vehicleCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              activeOpacity={0.92}
              onPress={() => router.push((`/vehicle/${item.id}`) as any)}
              accessibilityLabel={`View ${item.title}`}
              accessibilityRole="button"
            >
              {/* Image banner with badges */}
              <View style={styles.cardImageContainer}>
                <Image
                  source={{ uri: item.mediaUrls[0] }}
                  style={styles.cardImage}
                  contentFit="cover"
                  transition={200}
                />
                <View style={styles.cardTopOverlay}>
                  <View
                    style={[
                      styles.cardBadge,
                      {
                        backgroundColor:
                          item.listingType === 'listing'
                            ? 'rgba(0, 0, 0, 0.72)'
                            : 'rgba(29, 155, 240, 0.8)',
                      },
                    ]}
                  >
                    <Ionicons
                      name={item.mediaType === 'video' ? 'play-circle' : 'images'}
                      size={12}
                      color="#FFFFFF"
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.cardBadgeText}>
                      {item.listingType === 'listing'
                        ? item.mediaType === 'video'
                          ? 'REEL LISTING'
                          : 'PHOTO TOUR'
                        : 'COMMUNITY REEL'}
                    </Text>
                  </View>

                  {/* Quick Save button */}
                  <TouchableOpacity
                    style={[
                      styles.cardSaveBtn,
                      {
                        backgroundColor: saved ? colors.accent : 'rgba(0, 0, 0, 0.55)',
                      },
                    ]}
                    onPress={() => toggleSave(item.id)}
                    accessibilityLabel={saved ? 'Remove from saved' : 'Save vehicle'}
                    accessibilityRole="button"
                  >
                    <Ionicons
                      name={saved ? 'bookmark' : 'bookmark-outline'}
                      size={16}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                </View>

                {item.priceAED && (
                  <View style={[styles.cardPricePill, { backgroundColor: colors.accent }]}>
                    <Text style={[styles.cardPriceText, { color: isDark ? '#121214' : '#FFFFFF' }]}>
                      AED {item.priceAED.toLocaleString()}
                    </Text>
                  </View>
                )}
              </View>

              {/* Card Body */}
              <View style={styles.cardBody}>
                <View style={styles.cardHeaderRow}>
                  <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                </View>

                {/* Specs row */}
                <View style={styles.cardSpecsRow}>
                  <Text style={[styles.cardSpecText, { color: colors.textSecondary }]}>
                    {item.specs.horsepower}
                  </Text>
                  <Text style={[styles.cardSpecDot, { color: colors.textMuted }]}>•</Text>
                  {item.mileageKm && (
                    <>
                      <Text style={[styles.cardSpecText, { color: colors.textSecondary }]}>
                        {item.mileageKm.toLocaleString()} KM
                      </Text>
                      <Text style={[styles.cardSpecDot, { color: colors.textMuted }]}>•</Text>
                    </>
                  )}
                  <Text style={[styles.cardSpecText, { color: colors.textSecondary }]}>
                    {item.specs.regionalSpecs}
                  </Text>
                </View>

                {/* Seller & Location footer */}
                <View style={[styles.cardFooter, { borderTopColor: colors.borderSubtle }]}>
                  <View style={styles.cardSellerInfo}>
                    <Image source={{ uri: item.seller.avatar }} style={styles.cardSellerAvatar} />
                    <Text style={[styles.cardSellerName, { color: colors.text }]} numberOfLines={1}>
                      {item.seller.name}
                    </Text>
                    {item.seller.verified && (
                      <Ionicons name="checkmark-circle" size={13} color={colors.verified} />
                    )}
                  </View>
                  <View style={styles.cardLocation}>
                    <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
                    <Text style={[styles.cardLocationText, { color: colors.textSecondary }]}>
                      {item.location.split(',')[0]}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyStateContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: colors.surfaceElevated }]}>
              <Ionicons name="search-outline" size={38} color={colors.textSecondary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Vehicles Found</Text>
            <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
              We couldn't find any vehicles matching your criteria. Try adjusting your search query or reset your filters.
            </Text>
            <TouchableOpacity
              style={[styles.resetButton, { backgroundColor: colors.accent }]}
              onPress={() => {
                setQuery('');
                setSelectedCategory('All');
                setFilters({
                  query: '',
                  category: 'All',
                  listingType: 'all',
                  mediaType: 'all',
                  priceRange: 'all',
                  verifiedOnly: false,
                });
              }}
              accessibilityLabel="Reset all filters"
              accessibilityRole="button"
            >
              <Text style={[styles.resetButtonText, { color: isDark ? '#121214' : '#FFFFFF' }]}>
                Reset All Filters
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onApply={(updated) => setFilters(updated)}
        onReset={() =>
          setFilters({
            query: '',
            category: 'All',
            listingType: 'all',
            mediaType: 'all',
            priceRange: 'all',
            verifiedOnly: false,
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    borderBottomWidth: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  inputWrap: {
    flex: 1,
    height: 44,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    fontWeight: '900',
  },
  categoriesScroll: {
    gap: Spacing.two,
    paddingVertical: 2,
  },
  categoryChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 12,
  },
  listContainer: {
    padding: Spacing.four,
    gap: Spacing.four,
  },
  vehicleCard: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardImageContainer: {
    height: 200,
    position: 'relative',
    backgroundColor: '#1E1E1E',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardTopOverlay: {
    position: 'absolute',
    top: Spacing.three,
    left: Spacing.three,
    right: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  cardBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  cardSaveBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPricePill: {
    position: 'absolute',
    bottom: Spacing.three,
    left: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  cardPriceText: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  cardBody: {
    padding: Spacing.three,
  },
  cardHeaderRow: {
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSpecsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  cardSpecText: {
    fontSize: 12,
  },
  cardSpecDot: {
    marginHorizontal: 5,
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.two,
    borderTopWidth: 1,
  },
  cardSellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  cardSellerAvatar: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
  },
  cardSellerName: {
    fontSize: 12,
    fontWeight: '600',
    maxWidth: 140,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  cardLocationText: {
    fontSize: 11,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.nine,
    paddingHorizontal: Spacing.six,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.four,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: Spacing.two,
  },
  emptySub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.six,
  },
  resetButton: {
    paddingHorizontal: Spacing.six,
    paddingVertical: 12,
    borderRadius: Radius.full,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
