import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  useWindowDimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Vehicle } from '@/types';
import { useAppTheme } from '@/context/ThemeContext';
import { useSaved } from '@/context/SavedContext';
import { Spacing, Radius } from '@/constants/theme';
import { CommentsSheet } from './CommentsSheet';

interface ReelItemProps {
  vehicle: Vehicle;
  isActive: boolean;
  itemHeight: number;
}

export function ReelItem({ vehicle, isActive, itemHeight }: ReelItemProps) {
  const { colors, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isSaved, toggleSave, isLiked, toggleLike, getLikesCount } = useSaved();

  const [isMuted, setIsMuted] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const saved = isSaved(vehicle.id);
  const liked = isLiked(vehicle.id);
  const likesCount = getLikesCount(vehicle);

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

  const currentMediaUrl =
    vehicle.mediaUrls && vehicle.mediaUrls.length > 0
      ? vehicle.mediaUrls[photoIndex % vehicle.mediaUrls.length]
      : 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80';

  const formatPrice = (price?: number) => {
    if (!price) return null;
    return `AED ${price.toLocaleString()}`;
  };

  return (
    <View style={[styles.container, { height: itemHeight, width }]}>
      {/* Background Media */}
      <Image
        source={{ uri: currentMediaUrl }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={300}
      />

      {/* Dark gradient simulation overlay */}
      <View style={[styles.darkOverlay, { backgroundColor: 'rgba(0,0,0,0.38)' }]} />
      <View style={styles.bottomGradientOverlay} />

      {/* Top Bar Indicators */}
      <View style={[styles.topControls, { top: insets.top + 56 }]}>
        {/* Content Type Badge */}
        <View style={styles.badgeRow}>
          {vehicle.listingType === 'listing' ? (
            <View style={[styles.typeBadge, { backgroundColor: 'rgba(0, 0, 0, 0.65)' }]}>
              <View style={[styles.liveDot, { backgroundColor: colors.accent }]} />
              <Text style={styles.typeBadgeText}>FOR SALE</Text>
            </View>
          ) : (
            <View style={[styles.typeBadge, { backgroundColor: 'rgba(29, 155, 240, 0.75)' }]}>
              <Ionicons name="sparkles" size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.typeBadgeText}>COMMUNITY REEL</Text>
            </View>
          )}

          {/* Honest Prototype Asset Badge */}
          <View style={[styles.honestBadge, { backgroundColor: 'rgba(0, 0, 0, 0.6)' }]}>
            <Ionicons
              name={vehicle.mediaType === 'video' ? 'videocam-outline' : 'images-outline'}
              size={12}
              color="#DFBE88"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.honestBadgeText}>
              {vehicle.mediaType === 'video'
                ? `4K Reel • ${vehicle.videoDuration || '0:30'} (Sample)`
                : `Photo Gallery (${vehicle.mediaUrls.length})`}
            </Text>
          </View>
        </View>

        {/* Audio Toggle button */}
        {vehicle.mediaType === 'video' && (
          <TouchableOpacity
            style={styles.audioButton}
            onPress={() => setIsMuted(!isMuted)}
            accessibilityLabel={isMuted ? 'Unmute audio' : 'Mute audio'}
            accessibilityRole="button"
          >
            <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={18} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Photo carousel dots indicator for multi-photo */}
      {vehicle.mediaType === 'photo' && vehicle.mediaUrls.length > 1 && (
        <View style={[styles.carouselIndicators, { top: insets.top + 98 }]}>
          {vehicle.mediaUrls.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setPhotoIndex(i)}
              style={[
                styles.carouselDot,
                { backgroundColor: i === photoIndex ? '#FFFFFF' : 'rgba(255, 255, 255, 0.4)' },
              ]}
            />
          ))}
        </View>
      )}

      {/* Right-side Social Action Stack (Instagram-style) */}
      <View style={[styles.rightActions, { bottom: insets.bottom + 90 }]}>
        {/* Seller Avatar */}
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => {
            if (vehicle.listingType === 'listing') {
              router.push(`/vehicle/${vehicle.id}` as any);
            }
          }}
          accessibilityLabel={`Seller ${vehicle.seller.name}`}
          accessibilityRole="button"
        >
          <Image source={{ uri: vehicle.seller.avatar }} style={styles.avatarImg} contentFit="cover" />
          {vehicle.seller.verified && (
            <View style={[styles.avatarVerifiedBadge, { backgroundColor: colors.verified }]}>
              <Ionicons name="checkmark" size={10} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>

        {/* Like Button */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => toggleLike(vehicle.id)}
          accessibilityLabel="Like this vehicle"
          accessibilityRole="button"
        >
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={30}
            color={liked ? '#FF3040' : '#FFFFFF'}
          />
          <Text style={styles.actionText}>{likesCount}</Text>
        </TouchableOpacity>

        {/* Comment Button */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setShowComments(true)}
          accessibilityLabel="Open comments"
          accessibilityRole="button"
        >
          <Ionicons name="chatbubble-outline" size={28} color="#FFFFFF" />
          <Text style={styles.actionText}>{vehicle.commentsCount}</Text>
        </TouchableOpacity>

        {/* Save / Bookmark Button */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => toggleSave(vehicle.id)}
          accessibilityLabel="Save vehicle"
          accessibilityRole="button"
        >
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={28}
            color={saved ? colors.accent : '#FFFFFF'}
          />
          <Text style={[styles.actionText, saved && { color: colors.accent }]}>
            {saved ? 'Saved' : 'Save'}
          </Text>
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={handleShare}
          accessibilityLabel="Share vehicle"
          accessibilityRole="button"
        >
          <Ionicons name="paper-plane-outline" size={26} color="#FFFFFF" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Content Info Overlay */}
      <View style={[styles.bottomContent, { bottom: insets.bottom + 80 }]}>
        {/* Seller Info Row */}
        <View style={styles.sellerRow}>
          <Text style={styles.sellerName}>@{vehicle.seller.handle}</Text>
          {vehicle.seller.verified && (
            <View style={styles.verifiedRow}>
              <Ionicons name="checkmark-circle" size={14} color={colors.verified} />
              <Text style={[styles.sellerTypeTag, { color: colors.accent }]}>
                {vehicle.seller.badgeText || 'Verified'}
              </Text>
            </View>
          )}
        </View>

        {/* Vehicle Title */}
        <Text style={styles.vehicleTitle} numberOfLines={2}>
          {vehicle.title}
        </Text>

        {/* Price & Location Row */}
        {vehicle.priceAED ? (
          <View style={styles.priceRow}>
            <Text style={[styles.priceTag, { color: colors.accent }]}>
              {formatPrice(vehicle.priceAED)}
            </Text>
            <View style={styles.locationPill}>
              <Ionicons name="location-sharp" size={12} color="#FFFFFF" style={{ marginRight: 3 }} />
              <Text style={styles.locationText}>{vehicle.location}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.locationPill}>
            <Ionicons name="location-sharp" size={12} color="#FFFFFF" style={{ marginRight: 3 }} />
            <Text style={styles.locationText}>{vehicle.location}</Text>
          </View>
        )}

        {/* Specs Pills */}
        <View style={styles.specsRow}>
          <View style={styles.specPill}>
            <Text style={styles.specPillText}>{vehicle.specs.horsepower}</Text>
          </View>
          {vehicle.mileageKm && (
            <View style={styles.specPill}>
              <Text style={styles.specPillText}>{vehicle.mileageKm.toLocaleString()} KM</Text>
            </View>
          )}
          <View style={styles.specPill}>
            <Text style={styles.specPillText}>{vehicle.specs.regionalSpecs}</Text>
          </View>
        </View>

        {/* Primary CTA: "View car" */}
        {vehicle.listingType === 'listing' ? (
          <TouchableOpacity
            style={[styles.viewCarButton, { backgroundColor: colors.accent }]}
            onPress={() => router.push(`/vehicle/${vehicle.id}` as any)}
            activeOpacity={0.88}
            accessibilityLabel={`View full details for ${vehicle.title}`}
            accessibilityRole="button"
          >
            <Text style={[styles.viewCarButtonText, { color: isDark ? '#121214' : '#FFFFFF' }]}>
              View Car Details
            </Text>
            <Ionicons
              name="arrow-forward"
              size={18}
              color={isDark ? '#121214' : '#FFFFFF'}
              style={{ marginLeft: 6 }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.viewCarButton, { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}
            onPress={() => setShowComments(true)}
            activeOpacity={0.88}
            accessibilityLabel="Join discussion"
            accessibilityRole="button"
          >
            <Text style={[styles.viewCarButtonText, { color: '#FFFFFF' }]}>
              Join Discussion ({vehicle.commentsCount})
            </Text>
            <Ionicons name="chatbubble" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        )}
      </View>

      {/* Interactive Comments Modal */}
      <CommentsSheet
        visible={showComments}
        onClose={() => setShowComments(false)}
        vehicle={vehicle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFill,
  },
  bottomGradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 380,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  topControls: {
    position: 'absolute',
    left: Spacing.four,
    right: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    marginRight: 6,
  },
  typeBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  honestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  honestBadgeText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 10,
    fontWeight: '600',
  },
  audioButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  carouselIndicators: {
    position: 'absolute',
    left: Spacing.four,
    flexDirection: 'row',
    gap: 6,
    zIndex: 10,
  },
  carouselDot: {
    width: 22,
    height: 3,
    borderRadius: 2,
  },
  rightActions: {
    position: 'absolute',
    right: Spacing.three,
    alignItems: 'center',
    gap: Spacing.four,
    zIndex: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.one,
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarVerifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#000000',
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  bottomContent: {
    position: 'absolute',
    left: Spacing.four,
    right: 80,
    zIndex: 20,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.one,
    gap: Spacing.two,
  },
  sellerName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowRadius: 4,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  sellerTypeTag: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  vehicleTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
    marginBottom: Spacing.one,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowRadius: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  priceTag: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowRadius: 4,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  specsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  specPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    paddingHorizontal: Spacing.two,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  specPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  viewCarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    paddingHorizontal: Spacing.four,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  viewCarButtonText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});