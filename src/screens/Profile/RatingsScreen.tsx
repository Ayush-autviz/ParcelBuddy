import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Star } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, Card, GradientButton } from '../../components';
import { ProfileStackParamList } from '../../navigation/ProfileNavigator';

type RatingsScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'Ratings'>;

type TabType = 'Received' | 'Given';

interface Review {
  id: string;
  reviewerName: string;
  timeAgo: string;
  rating: number;
  reviewText: string;
}

interface RatingDistribution {
  stars: number;
  percentage: number;
}

const receivedReviews: Review[] = [
  {
    id: '1',
    reviewerName: 'Olivia Bennete',
    timeAgo: '2 weeks ago',
    rating: 5,
    reviewText: 'Amazing experience! Rajesh was very professional and handled my laptop bag with great care. He kept me updated throughout the journey and delivered it right on time.',
  },
  {
    id: '2',
    reviewerName: 'Christ Nolan',
    timeAgo: '1 month ago',
    rating: 4.5,
    reviewText: 'Good service overall. The traveller was punctual and my package arrived safely. Only minor issue was communication could have been better during transit.',
  },
  {
    id: '3',
    reviewerName: 'Olivia Bennete',
    timeAgo: '2 months ago',
    rating: 5,
    reviewText: 'Fantastic! I needed to send important documents to my family urgently and this service was a lifesaver.',
  },
];

const givenReviews: Review[] = [
  {
    id: '1',
    reviewerName: 'Olivia Bennete',
    timeAgo: '2 weeks ago',
    rating: 5,
    reviewText: 'Amazing experience! Rajesh was very professional and handled my laptop bag with great care. He kept me updated throughout the journey and delivered it right on time.',
  },
  {
    id: '2',
    reviewerName: 'Christ Nolan',
    timeAgo: '1 month ago',
    rating: 4.5,
    reviewText: 'Good service overall. The traveller was punctual and my package arrived safely. Only minor issue was communication could have been better during transit.',
  },
  {
    id: '3',
    reviewerName: 'Olivia Bennete',
    timeAgo: '2 months ago',
    rating: 5,
    reviewText: 'Fantastic! I needed to send important documents to my family urgently and this service was a lifesaver.',
  },
];

const ratingDistribution: RatingDistribution[] = [
  { stars: 5, percentage: 75 },
  { stars: 4, percentage: 15 },
  { stars: 3, percentage: 5 },
  { stars: 2, percentage: 3 },
  { stars: 1, percentage: 2 },
];

const RatingsScreen: React.FC = () => {
  const navigation = useNavigation<RatingsScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('Received');

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} size={16} color="#FFD700" fill="#FFD700" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <View key={i} style={styles.halfStarContainer}>
            <Star size={16} color="#FFD700" fill="#FFD700" />
            <View style={styles.halfStarOverlay} />
          </View>
        );
      } else {
        stars.push(
          <Star key={i} size={16} color="#E0E0E0" fill="#E0E0E0" />
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
            <Text style={styles.ratingNumber}>4.8</Text>
            <View style={styles.starsContainer}>
              {renderStars(4.8)}
            </View>
            <Text style={styles.reviewCount}>(127 reviews)</Text>
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
      <Header title="Ratings" showBackButton />

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
      >
        {/* Rating Summary (Only for Received tab) */}
        {renderRatingSummary()}

        {/* Reviews List */}
        <View style={styles.reviewsContainer}>
          {currentReviews.map((review) => (
            <Card key={review.id} style={styles.reviewCard} padding={20}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                  <Text style={styles.reviewerName}>{review.reviewerName}</Text>
                  <Text style={styles.reviewTime}>{review.timeAgo}</Text>
                </View>
                <View style={styles.starsRow}>
                  {renderStars(review.rating)}
                </View>
              </View>
              <Text style={styles.reviewText}>{review.reviewText}</Text>
            </Card>
          ))}
        </View>

        {/* View More Button */}
        <GradientButton
          title="View More"
          onPress={() => {
            // TODO: Navigate to all reviews or load more
            console.log('View more reviews');
          }}
          style={styles.viewMoreButton}
        />
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
    paddingBottom: 8,
    backgroundColor: Colors.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
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
    color: Colors.primaryCyan,
    fontWeight: Fonts.weightSemiBold,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.primaryCyan,
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
    fontSize: 48,
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
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  reviewTime: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  reviewText: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  viewMoreButton: {
    marginTop: 8,
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
    backgroundColor: Colors.backgroundWhite,
  },
});

export default RatingsScreen;

