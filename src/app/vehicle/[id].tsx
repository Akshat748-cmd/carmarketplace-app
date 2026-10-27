import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_VEHICLES } from '@/data/mockVehicles';
import { useAppTheme } from '@/context/ThemeContext';
import { useSaved } from '@/context/SavedContext';
import { Spacing, Radius } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();
  const { isSaved, toggleSave } = useSaved();

  const vehicle = MOCK_VEHICLES.find((v) => v.id === id) || MOCK_VEHICLES[0];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const saved = isSaved(vehicle.id);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${vehicle.title} on VehicleSpot! ${
          vehicle.priceAED ? `Price: AED ${vehicle.priceAED.toLocaleString()}` : ''
        }`,
      });
    } catch (err) {
      console.warn('Share error', err);
    }
  };

  const handleContactAction = (type: 'whatsapp' | 'call') => {
    Alert.alert(
      `${type === 'whatsapp' ? 'WhatsApp' : 'Call'} Inquiry`,
      `Inquiry for ${vehicle.title} with seller ${vehicle.seller.name}. Contact details: ${
        type === 'whatsapp' ? vehicle.seller.whatsapp : vehicle.seller.phone
      }`,
      [{ text: 'Close', style: 'cancel' }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Floating Back & Share Navigation */}
      <View style={[styles.floatingNav, { top: insets.top + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.navIconBtn}
          accessibilityLabel="Back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.navRightButtons}>
          <TouchableOpacity
            onPress={() => toggleSave(vehicle.id)}
            style={styles.navIconBtn}
            accessibilityLabel={saved ? 'Remove from saved' : 'Save vehicle'}
            accessibilityRole="button"
          >
            <Ionicons
              name={saved ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={saved ? colors.accent : '#FFFFFF'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleShare}
            style={styles.navIconBtn}
            accessibilityLabel="Share vehicle"
            accessibilityRole="button"
          >
            <Ionicons name="share-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Media Gallery Banner */}
        <View style={styles.galleryContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const slide = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveImageIndex(slide);
            }}
            scrollEventThrottle={16}
          >
            {vehicle.mediaUrls.map((url, idx) => (
              <Image
                key={idx}
                source={{ uri: url }}
                style={[styles.galleryImage, { width }]}
                contentFit="cover"
              />
            ))}
          </ScrollView>

          {/* Dots Indicator */}
          {vehicle.mediaUrls.length > 1 && (
            <View style={styles.galleryDots}>
              {vehicle.mediaUrls.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.galleryDot,
                    {
                      backgroundColor:
                        i === activeImageIndex ? colors.accent : 'rgba(255, 255, 255, 0.5)',
                      width: i === activeImageIndex ? 18 : 6,
                    },
                  ]}
                />
              ))}
            </View>
          )}

          {/* Listing badge */}
          <View style={[styles.galleryBadge, { backgroundColor: 'rgba(0, 0, 0, 0.65)' }]}>
            <Ionicons
              name={vehicle.mediaType === 'video' ? 'videocam' : 'camera'}
              size={12}
              color={colors.accent}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.galleryBadgeText}>
              {vehicle.mediaType === 'video'
                ? `Video Reel • ${vehicle.videoDuration || '0:30'}`
                : `Photo Tour (${vehicle.mediaUrls.length} shots)`}
            </Text>
          </View>
        </View>

        {/* Vehicle Header Info */}
        <View style={[styles.contentSection, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
          <View style={styles.tagRow}>
            <View style={[styles.typePill, { backgroundColor: colors.accentLight }]}>
              <Text style={[styles.typePillText, { color: colors.accent }]}>
                {vehicle.listingType === 'listing' ? 'FOR SALE' : 'COMMUNITY SHOWCASE'}
              </Text>
            </View>
            <View style={[styles.locationPill, { backgroundColor: colors.surfaceElevated }]}>
              <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
              <Text style={[styles.locationText, { color: colors.textSecondary }]}>
                {vehicle.location}
              </Text>
            </View>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>{vehicle.title}</Text>

          {vehicle.priceAED && (
            <View style={styles.priceRow}>
              <Text style={[styles.priceValue, { color: colors.accent }]}>
                AED {vehicle.priceAED.toLocaleString()}
              </Text>
              <Text style={[styles.vatText, { color: colors.textSecondary }]}>
                Est. AED {Math.round(vehicle.priceAED * 0.018).toLocaleString()} / mo*
              </Text>
            </View>
          )}
        </View>

        {/* Specifications Grid */}
        <View style={[styles.contentSection, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>Vehicle Specifications</Text>

          <View style={styles.specsGrid}>
            <View style={[styles.specBox, { backgroundColor: colors.surfaceElevated }]}>
              <Ionicons name="speedometer-outline" size={20} color={colors.accent} />
              <Text style={[styles.specBoxLabel, { color: colors.textSecondary }]}>Horsepower</Text>
              <Text style={[styles.specBoxVal, { color: colors.text }]}>{vehicle.specs.horsepower}</Text>
            </View>

            <View style={[styles.specBox, { backgroundColor: colors.surfaceElevated }]}>
              <Ionicons name="flash-outline" size={20} color={colors.accent} />
              <Text style={[styles.specBoxLabel, { color: colors.textSecondary }]}>0 - 100 km/h</Text>
              <Text style={[styles.specBoxVal, { color: colors.text }]}>{vehicle.specs.acceleration}</Text>
            </View>

            <View style={[styles.specBox, { backgroundColor: colors.surfaceElevated }]}>
              <Ionicons name="hardware-chip-outline" size={20} color={colors.accent} />
              <Text style={[styles.specBoxLabel, { color: colors.textSecondary }]}>Engine</Text>
              <Text style={[styles.specBoxVal, { color: colors.text }]} numberOfLines={1}>
                {vehicle.specs.engine.split(' ')[0]}
              </Text>
            </View>

            <View style={[styles.specBox, { backgroundColor: colors.surfaceElevated }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.accent} />
              <Text style={[styles.specBoxLabel, { color: colors.textSecondary }]}>Regional Spec</Text>
              <Text style={[styles.specBoxVal, { color: colors.text }]}>{vehicle.specs.regionalSpecs}</Text>
            </View>
          </View>

          {/* Detailed Spec List */}
          <View style={styles.specList}>
            <View style={styles.specListRow}>
              <Text style={[styles.specListKey, { color: colors.textSecondary }]}>Transmission</Text>
              <Text style={[styles.specListVal, { color: colors.text }]}>{vehicle.specs.transmission}</Text>
            </View>
            <View style={styles.specListRow}>
              <Text style={[styles.specListKey, { color: colors.textSecondary }]}>Exterior Color</Text>
              <Text style={[styles.specListVal, { color: colors.text }]}>{vehicle.specs.exteriorColor}</Text>
            </View>
            <View style={styles.specListRow}>
              <Text style={[styles.specListKey, { color: colors.textSecondary }]}>Interior</Text>
              <Text style={[styles.specListVal, { color: colors.text }]}>{vehicle.specs.interiorColor}</Text>
            </View>
            <View style={styles.specListRow}>
              <Text style={[styles.specListKey, { color: colors.textSecondary }]}>Warranty</Text>
              <Text style={[styles.specListVal, { color: colors.text }]}>{vehicle.specs.warranty}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={[styles.contentSection, { backgroundColor: colors.surface, borderBottomColor: colors.borderSubtle }]}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>Overview</Text>
          <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
            {vehicle.description}
          </Text>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {vehicle.tags.map((tag, i) => (
              <View key={i} style={[styles.tagPill, { backgroundColor: colors.surfaceElevated }]}>
                <Text style={[styles.tagText, { color: colors.text }]}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Seller Card */}
        <View style={[styles.contentSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>Seller Information</Text>

          <View style={[styles.sellerCard, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
            <Image source={{ uri: vehicle.seller.avatar }} style={styles.sellerAvatar} contentFit="cover" />
            <View style={{ flex: 1, gap: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={[styles.sellerName, { color: colors.text }]}>{vehicle.seller.name}</Text>
                {vehicle.seller.verified && (
                  <Ionicons name="checkmark-circle" size={16} color={colors.verified} />
                )}
              </View>
              <Text style={[styles.sellerSub, { color: colors.textSecondary }]}>
                {vehicle.seller.dealershipName || vehicle.seller.location}
              </Text>
              <View style={[styles.sellerBadgePill, { backgroundColor: colors.accentLight }]}>
                <Text style={[styles.sellerBadgeText, { color: colors.accent }]}>
                  {vehicle.seller.badgeText || 'Verified Partner'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View
        style={[
          styles.bottomStickyBar,
          {
            paddingBottom: Math.max(insets.bottom, 14),
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.actionButtonOutline, { borderColor: colors.accent }]}
          onPress={() => handleContactAction('call')}
          accessibilityRole="button"
          accessibilityLabel="Call seller"
        >
          <Ionicons name="call-outline" size={18} color={colors.accent} style={{ marginRight: 6 }} />
          <Text style={[styles.actionButtonOutlineText, { color: colors.accent }]}>Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButtonFilled, { backgroundColor: colors.accent }]}
          onPress={() => handleContactAction('whatsapp')}
          accessibilityRole="button"
          accessibilityLabel="Chat on WhatsApp"
        >
          <Ionicons
            name="logo-whatsapp"
            size={20}
            color={isDark ? '#121214' : '#FFFFFF'}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.actionButtonFilledText, { color: isDark ? '#121214' : '#FFFFFF' }]}>
            WhatsApp Inquiry
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingNav: {
    position: 'absolute',
    left: Spacing.four,
    right: Spacing.four,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 30,
  },
  navIconBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  navRightButtons: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  galleryContainer: {
    height: 320,
    position: 'relative',
    backgroundColor: '#000000',
  },
  galleryImage: {
    height: 320,
  },
  galleryDots: {
    position: 'absolute',
    bottom: Spacing.three,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  galleryDot: {
    height: 6,
    borderRadius: 3,
  },
  galleryBadge: {
    position: 'absolute',
    bottom: Spacing.three,
    left: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  galleryBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  contentSection: {
    padding: Spacing.four,
    borderBottomWidth: 1,
    gap: Spacing.three,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  typePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  typePillText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  locationText: {
    fontSize: 11,
    fontWeight: '500',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.three,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '900',
  },
  vatText: {
    fontSize: 12,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: Spacing.one,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  specBox: {
    width: (width - 48) / 2,
    padding: Spacing.three,
    borderRadius: Radius.md,
    gap: 2,
  },
  specBoxLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  specBoxVal: {
    fontSize: 14,
    fontWeight: '800',
  },
  specList: {
    marginTop: Spacing.two,
    gap: Spacing.two,
  },
  specListRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  specListKey: {
    fontSize: 13,
  },
  specListVal: {
    fontSize: 13,
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: Spacing.two,
  },
  tagPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.three,
  },
  sellerAvatar: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
  },
  sellerName: {
    fontSize: 15,
    fontWeight: '800',
  },
  sellerSub: {
    fontSize: 12,
  },
  sellerBadgePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    marginTop: 2,
  },
  sellerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  bottomStickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    borderTopWidth: 1,
    gap: Spacing.three,
  },
  actionButtonOutline: {
    flex: 1,
    height: 48,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonOutlineText: {
    fontSize: 14,
    fontWeight: '800',
  },
  actionButtonFilled: {
    flex: 2,
    height: 48,
    borderRadius: Radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonFilledText: {
    fontSize: 14,
    fontWeight: '800',
  },
});