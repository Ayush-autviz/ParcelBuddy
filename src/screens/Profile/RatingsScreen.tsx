import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Star } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { ProfileHeader, Card, GradientButton, EmptyStateCard } from '../../components';
import { ProfileStackParamList } from '../../navigation/ProfileNavigator';
import { useMyRatings, useRatingsGivenByMe, useRatingChart, RatingResponse } from '../../hooks/useRating';
import { ProfileUserIcon } from '../../assets/icons/svg/profileIcon';
import { SvgXml } from 'react-native-svg';
import { getMyRating, getRatingGivenByMe } from '../../services/api/rating';

type RatingsScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'Ratings'>;

type TabType = 'Received' | 'Given';

interface Review {
  id: string;
  reviewerName: string;
  timeAgo: string;
  rating: number;
  reviewText: string;
  userId?: string; // Store user ID for potential profile fetching
}

interface RatingDistribution {
  stars: number;
  percentage: number;
}

// Helper function to format time ago
const formatTimeAgo = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    if (diffWeeks < 4) return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
    if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
    return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
  } catch {
    return 'Recently';
  }
};


//   if (total === 0) {
//     return [
//       { stars: 5, percentage: 0 },
//       { stars: 4, percentage: 0 },
//       { stars: 3, percentage: 0 },
//       { stars: 2, percentage: 0 },
//       { stars: 1, percentage: 0 },
//     ];
//   }

//   ratings.forEach((rating) => {
//     const stars = Math.floor(rating.rating);
//     if (stars >= 1 && stars <= 5) {
//       distribution[stars as keyof typeof distribution]++;
//     }
//   });

//   return [5, 4, 3, 2, 1].map((stars) => ({
//     stars,
//     percentage: Math.round((distribution[stars as keyof typeof distribution] / total) * 100),
//   }));
// };

const RatingsScreen: React.FC = () => {
  const navigation = useNavigation<RatingsScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('Received');

  // State for pagination
  const [allReceivedRatings, setAllReceivedRatings] = useState<RatingResponse[]>([]);
  const [nextPageUrlReceived, setNextPageUrlReceived] = useState<string | null>(null);
  const [isLoadingMoreReceived, setIsLoadingMoreReceived] = useState(false);

  const [allGivenRatings, setAllGivenRatings] = useState<RatingResponse[]>([]);
  const [nextPageUrlGiven, setNextPageUrlGiven] = useState<string | null>(null);
  const [isLoadingMoreGiven, setIsLoadingMoreGiven] = useState(false);

  const initializedTabsRef = useRef<Set<TabType>>(new Set());
  const initialPageSizeRef = useRef<{ received: number; given: number }>({ received: 0, given: 0 });
  const lastDataRef = useRef<{ received: string | null; given: string | null }>({ received: null, given: null });

  // Fetch ratings data
  const { 
    data: myRatingsData, 
    isLoading: isLoadingReceived, 
    isError: isErrorReceived,
    isFetching: isFetchingReceived,
    refetch: refetchReceived 
  } = useMyRatings();

  const { 
    data: ratingsGivenData, 
    isLoading: isLoadingGiven, 
    isError: isErrorGiven,
    isFetching: isFetchingGiven,
    refetch: refetchGiven 
  } = useRatingsGivenByMe();

  // Initialize data for each tab only once
  useEffect(() => {
    if (activeTab === 'Received' && myRatingsData?.ratings && !initializedTabsRef.current.has('Received')) {
      setAllReceivedRatings(myRatingsData.ratings);
      setNextPageUrlReceived(myRatingsData.pagination?.next_page || null);
      initializedTabsRef.current.add('Received');
    } else if (activeTab === 'Given' && ratingsGivenData?.ratings && !initializedTabsRef.current.has('Given')) {
      setAllGivenRatings(ratingsGivenData.ratings);
      setNextPageUrlGiven(ratingsGivenData.pagination?.next_page || null);
      initializedTabsRef.current.add('Given');
    }
  }, [activeTab, myRatingsData, ratingsGivenData]);

  // Handle refresh - update only first page if data changes
  useEffect(() => {
    if (activeTab === 'Received' && myRatingsData?.ratings && initializedTabsRef.current.has('Received')) {
      if (initialPageSizeRef.current.received === 0) {
        initialPageSizeRef.current.received = myRatingsData.ratings.length;
      }
      const dataHash = myRatingsData.ratings.map(r => r.id).join(',');
      if (lastDataRef.current.received !== dataHash) {
        lastDataRef.current.received = dataHash;
        const initialPageSize = initialPageSizeRef.current.received;
        setAllReceivedRatings(prev => {
          if (prev.length > initialPageSize) {
            const additionalPages = prev.slice(initialPageSize);
            return [...myRatingsData.ratings, ...additionalPages];
          } else {
            return myRatingsData.ratings;
          }
        });
        setNextPageUrlReceived(myRatingsData.pagination?.next_page || null);
      }
    } else if (activeTab === 'Given' && ratingsGivenData?.ratings && initializedTabsRef.current.has('Given')) {
      if (initialPageSizeRef.current.given === 0) {
        initialPageSizeRef.current.given = ratingsGivenData.ratings.length;
      }
      const dataHash = ratingsGivenData.ratings.map(r => r.id).join(',');
      if (lastDataRef.current.given !== dataHash) {
        lastDataRef.current.given = dataHash;
        const initialPageSize = initialPageSizeRef.current.given;
        setAllGivenRatings(prev => {
          if (prev.length > initialPageSize) {
            const additionalPages = prev.slice(initialPageSize);
            return [...ratingsGivenData.ratings, ...additionalPages];
          } else {
            return ratingsGivenData.ratings;
          }
        });
        setNextPageUrlGiven(ratingsGivenData.pagination?.next_page || null);
      }
    }
  }, [myRatingsData, ratingsGivenData, activeTab]);

  // Load more functions
  const handleLoadMoreReceived = async () => {
    if (!nextPageUrlReceived || isLoadingMoreReceived) return;

    setIsLoadingMoreReceived(true);
    try {
      const response = await getMyRating(nextPageUrlReceived);
      const hasPagination = response?.pagination && response?.results;
      const newRatings = hasPagination
        ? response.results
        : (Array.isArray(response) ? response : (response?.data || response?.results || []));

      if (Array.isArray(newRatings) && newRatings.length > 0) {
        setAllReceivedRatings(prev => [...prev, ...newRatings]);
        setNextPageUrlReceived(hasPagination ? response.pagination.next_page : null);
      } else {
        setNextPageUrlReceived(null);
      }
    } catch (error) {
      console.error('Error loading more received ratings:', error);
    } finally {
      setIsLoadingMoreReceived(false);
    }
  };

  const handleLoadMoreGiven = async () => {
    if (!nextPageUrlGiven || isLoadingMoreGiven) return;

    setIsLoadingMoreGiven(true);
    try {
      const response = await getRatingGivenByMe(nextPageUrlGiven);
      const hasPagination = response?.pagination && response?.results;
      const newRatings = hasPagination
        ? response.results
        : (Array.isArray(response) ? response : (response?.data || response?.results || []));

      if (Array.isArray(newRatings) && newRatings.length > 0) {
        setAllGivenRatings(prev => [...prev, ...newRatings]);
        setNextPageUrlGiven(hasPagination ? response.pagination.next_page : null);
      } else {
        setNextPageUrlGiven(null);
      }
    } catch (error) {
      console.error('Error loading more given ratings:', error);
    } finally {
      setIsLoadingMoreGiven(false);
    }
  };

  // Fetch rating chart data
  const { 
    data: ratingChartData,
    isLoading: isLoadingChart,
    isFetching: isFetchingChart,
    refetch: refetchChart 
  } = useRatingChart();

  // Transform API data to Review format
  const receivedReviews: Review[] = useMemo(() => {
    return allReceivedRatings.map((rating: RatingResponse) => ({
      id: rating.id.toString(),
      reviewerName: rating.rated_by_name?.trim() || 'User',
      timeAgo: formatTimeAgo(rating.created_on),
      rating: rating.rating,
      reviewText: rating.review || '',
      userId: rating.rated_by,
    }));
  }, [allReceivedRatings]);

  const givenReviews: Review[] = useMemo(() => {
    return allGivenRatings.map((rating: RatingResponse) => ({
      id: rating.id.toString(),
      reviewerName: rating.rated_to_name?.trim() || 'User',
      timeAgo: formatTimeAgo(rating.created_on),
      rating: rating.rating,
      reviewText: rating.review || '',
      userId: rating.rated_to,
    }));
  }, [allGivenRatings]);

  // Use API data for rating statistics from chart API
  const averageRating = useMemo(() => {
    return ratingChartData?.average_rating ?? 0;
  }, [ratingChartData]);

  const ratingDistribution = useMemo(() => {
    // Use API data from chart API
    if (ratingChartData?.percentages) {
      // Transform percentages object to array format
      return [5, 4, 3, 2, 1].map((stars) => ({
        stars,
        percentage: Math.round(ratingChartData.percentages[stars.toString()] || 0),
      }));
    }
    // Default empty distribution if API data not available
    return [5, 4, 3, 2, 1].map((stars) => ({
      stars,
      percentage: 0,
    }));
  }, [ratingChartData]);

  const totalReviews = useMemo(() => {
    return ratingChartData?.total_reviews ?? 0;
  }, [ratingChartData]);

  const isLoading = activeTab === 'Received' 
    ? (isLoadingReceived || isLoadingChart) 
    : isLoadingGiven;
  const isError = activeTab === 'Received' ? isErrorReceived : isErrorGiven;
  const refetch = activeTab === 'Received' 
    ? () => {
        refetchReceived();
        refetchChart();
      }
    : refetchGiven;
  const isRefetching = activeTab === 'Received' 
    ? (isFetchingReceived || isFetchingChart)
    : isFetchingGiven;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    // const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} size={14} color="#FFD700" fill="#FFD700" />
        );
      } else {
        stars.push(
          <Star key={i} size={14} color="#E0E0E0" fill="#E0E0E0" />
        );
      }
    }
    return stars;
  };

  const renderRatingSummary = () => {
    if (activeTab !== 'Received') return null;

    return (
      <View style={styles.ratingSummary}>
        <View style={styles.ratingHeader}>
          <View style={styles.ratingLeft}>
            <Text style={styles.ratingNumber}>{averageRating.toFixed(1)}</Text>
            <View style={styles.starsContainer}>
              {renderStars(averageRating)}
            </View>
            <Text style={styles.reviewCount}>
              ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
            </Text>
          </View>
          <View style={styles.ratingChart}>
            {ratingDistribution.map((item) => (
              <View key={item.stars} style={styles.chartRow}>
                <Text style={styles.chartStars}>{item.stars} stars</Text>
                <View style={styles.chartBarContainer}>
                  <View
                    style={[
                      styles.chartBar,
                      { width: `${item.percentage}%` },
                    ]}
                  />
                </View>
                <Text style={styles.chartPercentage}>{item.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const currentReviews = activeTab === 'Received' ? receivedReviews : givenReviews;

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader title="Ratings" />

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Received' && styles.activeTab]}
          onPress={() => setActiveTab('Received')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'Received' && styles.activeTabText,
            ]}
          >
            Received
          </Text>
          {activeTab === 'Received' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Given' && styles.activeTab]}
          onPress={() => setActiveTab('Given')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'Given' && styles.activeTabText,
            ]}
          >
            Given
          </Text>
          {activeTab === 'Given' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[Colors.primaryCyan]}
            tintColor={Colors.primaryCyan}
          />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primaryCyan} />
            <Text style={styles.loadingText}>Loading ratings...</Text>
          </View>
        ) : isError ? (
          <View style={styles.emptyContainer}>
            <EmptyStateCard
              title="Error loading ratings"
              description="Failed to load ratings. Please try again."
            />
          </View>
        ) : (
          <>
            {/* Rating Summary (Only for Received tab) */}
            {renderRatingSummary()}

            {/* Reviews List */}
            {currentReviews.length > 0 ? (
              <View style={styles.reviewsContainer}>
                {currentReviews.map((review) => (
                  <Card key={review.id} style={styles.reviewCard} padding={20}>
                    <View style={styles.reviewHeader}>
                      <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                        <View style={styles.reviewerAvatar}>
                          <SvgXml xml={ProfileUserIcon} height={20} width={20} />
                        </View>
                      <View style={styles.reviewerInfo}>
                        <Text style={styles.reviewerName}>{review.reviewerName}</Text>
                        <Text style={styles.reviewTime}>{review.timeAgo}</Text>
                      </View>
                      </View>
                    </View>
                    <View style={styles.starsRow}>
                        {renderStars(review.rating)}
                      </View>
                    {review.reviewText ? (
                      <Text style={styles.reviewText}>{review.reviewText}</Text>
                    ) : null}
                  </Card>
                ))}
                {/* View More Button */}
                {(activeTab === 'Received' ? nextPageUrlReceived : nextPageUrlGiven) && (
                  <View style={styles.viewMoreContainer}>
                    <GradientButton
                      title={
                        activeTab === 'Received'
                          ? isLoadingMoreReceived
                            ? 'Loading...'
                            : 'View More'
                          : isLoadingMoreGiven
                          ? 'Loading...'
                          : 'View More'
                      }
                      onPress={
                        activeTab === 'Received' ? handleLoadMoreReceived : handleLoadMoreGiven
                      }
                      style={styles.viewMoreButton}
                      loading={
                        activeTab === 'Received' ? isLoadingMoreReceived : isLoadingMoreGiven
                      }
                      disabled={
                        activeTab === 'Received' ? isLoadingMoreReceived : isLoadingMoreGiven
                      }
                    />
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <EmptyStateCard
                  title={`No ${activeTab.toLowerCase()} ratings yet`}
                  description={
                    activeTab === 'Received'
                      ? "You haven't received any ratings yet."
                      : "You haven't given any ratings yet."
                  }
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: Colors.backgroundLight,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  activeTab: {},
  tabText: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightMedium,
    color: Colors.textTertiary,
  },
  activeTabText: {
    color: Colors.primaryTeal,
    fontWeight: Fonts.weightSemiBold,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.primaryTeal,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  ratingSummary: {
    marginBottom: 24,
    backgroundColor: '#DFF1F2',
    borderRadius: 12,
    padding: 12
  },
  ratingHeader: {
    flexDirection: 'row',
    gap: 24,
  },
  ratingLeft: {
    alignItems: 'center',
    minWidth: 100,
  },
  ratingNumber: {
    fontSize: Fonts.xxxl,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  reviewCount: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
  },
  ratingChart: {
    flex: 1,
    gap: 8,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chartStars: {
    fontSize: Fonts.xs,
    color: Colors.textSecondary,
    width: 50,
  },
  chartBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 4,
    overflow: 'hidden',
  },
  chartBar: {
    height: '100%',
    backgroundColor: Colors.primaryCyan,
    borderRadius: 4,
  },
  chartPercentage: {
    fontSize: Fonts.xs,
    color: Colors.textSecondary,
    width: 40,
    textAlign: 'right',
  },
  reviewsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  reviewCard: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 12,
    shadowColor: Colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 1,
  },
  reviewTime: {
    fontSize: Fonts.xs,
    color: Colors.textTertiary,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  reviewText: {
    // fontSize: Fonts.base,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  viewMoreContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  viewMoreButton: {
    marginTop: 8,
    width: '50%',
    alignSelf: 'center',
  },
  halfStarContainer: {
    position: 'relative',
    width: 16,
    height: 16,
  },
  halfStarOverlay: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '50%',
    backgroundColor: Colors.backgroundLight,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  emptyContainer: {
    paddingVertical: 60,
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 100,
    backgroundColor: Colors.backgroundWhite,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default RatingsScreen;

