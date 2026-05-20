import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Clipboard,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gift, Copy, Share2, Calendar } from 'lucide-react-native';
import Share from 'react-native-share';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { ProfileHeader, Card, Button, GradientButton } from '../../components';
import { useToast } from '../../components/Toast';
import { useMyRewards } from '../../hooks/useProfile';

interface PromoCodeData {
  code: string;
  title: string;
  description: string;
  expiry: string;
  discount: string;
}

const PromoCodesScreen: React.FC = () => {
  const navigation = useNavigation();
  const { showSuccess } = useToast();
  const [promoData, setPromoData] = useState<PromoCodeData | null>(null);

  // Fetch API rewards data
  const { data: rewardsData, isLoading: isRewardsLoading, isFetching, refetch } = useMyRewards();

  useEffect(() => {
    // Console log the response as requested
    console.log('🎁 [PromoCodesScreen] Rewards API Response:', JSON.stringify(rewardsData, null, 2));

    // Map API fields if available, otherwise fall back to reference values
    const apiCode = rewardsData?.referral_code;
    const rawDiscount = rewardsData?.discount_percentage || '20%';
    const apiDiscount = rawDiscount.includes('OFF') ? rawDiscount : `${rawDiscount} OFF`;
    const apiTitle = 'Referral Reward';
    const apiDesc = rewardsData?.description || 'Share this exclusive promo code with your friends and fellow travelers to give them 20% off their next subscription purchase.';
    const apiExpiry = 'Valid until Dec 31, 2026';

    setPromoData({
      code: apiCode,
      title: apiTitle,
      description: apiDesc,
      expiry: apiExpiry,
      discount: apiDiscount,
    });
  }, [rewardsData]);

  const handleCopyCode = () => {
    if (!promoData?.code) return;
    Clipboard.setString(promoData.code);
    showSuccess('Promo code copied to clipboard');
  };

  const handleShareCode = async () => {
    if (!promoData?.code) return;
    try {
      await Share.open({
        title: 'Share Referral Code',
        message: `Use my exclusive code ${promoData.code} on ParcelBuddy to get awesome discounts!`,
      });
    } catch (error) {
      console.log('Share dismissed or error:', error);
    }
  };

  const isLoading = isRewardsLoading;

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader title="Promo Codes" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            colors={[Colors.primaryCyan]}
            tintColor={Colors.primaryCyan}
          />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primaryCyan} />
            <Text style={styles.loadingText}>Fetching your promo code...</Text>
          </View>
        ) : promoData ? (
          <View style={styles.contentContainer}>
            {/* Main Presentation Card */}
            <Card style={styles.mainCard} padding={24}>
              {/* {promoData.description ? (
                <Text style={styles.minimalDescription}>{promoData.description}</Text>
              ) : null} */}

              {/* Code Display Box */}
              <View style={styles.codeContainer}>
                <Text style={styles.codeLabel}>YOUR PROMO CODE</Text>
                <View style={styles.codeDisplayWrapper}>
                  <Text style={styles.codeText}>{promoData.code}</Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountBadgeText}>{promoData.discount}</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsRow}>
                <Button
                  title="Copy Code"
                  variant="secondary"
                  onPress={handleCopyCode}
                  style={styles.copyBtn}
                // textStyle={styles.copyBtnText}
                />
                {/* <Button
                  title="Share Code"
                  variant="primary"
                  onPress={handleShareCode}
                  style={styles.shareBtn}
                /> */}
                <GradientButton
                  title="Share Code"
                  onPress={handleShareCode}
                  style={styles.shareBtn}
                />
              </View>
            </Card>

            {/* Rewards Cards List Section */}
            {rewardsData?.rewards && Array.isArray(rewardsData.rewards) && rewardsData.rewards.length > 0 ? (
              <View style={styles.rewardsSectionContainer}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Your Rewards</Text>
                  <View style={styles.rewardsStatsBadge}>
                    <Text style={styles.rewardsStatsText}>
                      {rewardsData.active_count ?? rewardsData.rewards.length} Active
                    </Text>
                  </View>
                </View>

                <View style={styles.rewardsCardsList}>
                  {rewardsData.rewards.map((reward: any) => {
                    const isActive = reward.status?.toLowerCase() === 'active';
                    const isRedeemed = reward.status?.toLowerCase() === 'redeemed';
                    const rawDiscount = reward.discount_percentage || '20%';
                    const formattedDiscount = rawDiscount.includes('OFF') ? rawDiscount : `${rawDiscount} OFF`;

                    const formatRewardDate = (dateStr?: string | null) => {
                      if (!dateStr) return 'N/A';
                      try {
                        const parts = dateStr.split('T')[0].split('-');
                        if (parts.length === 3) {
                          const year = parts[0];
                          const monthIdx = parseInt(parts[1], 10) - 1;
                          const day = parseInt(parts[2], 10);
                          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                          return `${months[monthIdx]} ${day}, ${year}`;
                        }
                        return dateStr;
                      } catch {
                        return dateStr;
                      }
                    };

                    return (
                      <Card
                        key={reward.id || Math.random().toString()}
                        style={[styles.rewardCardWrapper, !isActive && styles.rewardCardInactive]}
                        padding={16}
                      >
                        <View style={styles.rewardCardTopRow}>
                          <View style={styles.discountRow}>
                            <View style={[styles.rewardIconBadge, !isActive && { backgroundColor: Colors.backgroundGray }]}>
                              <Gift size={18} color={isActive ? Colors.primaryCyan : Colors.textLight} />
                            </View>
                            <Text style={[styles.rewardDiscountValue, !isActive && { color: Colors.textLight }]}>
                              {formattedDiscount}
                            </Text>
                          </View>

                          <View
                            style={[
                              styles.rewardStatusBadge,
                              isActive
                                ? styles.statusBadgeActive
                                : isRedeemed
                                  ? styles.statusBadgeRedeemed
                                  : styles.statusBadgeExpired,
                            ]}
                          >
                            <Text
                              style={[
                                styles.rewardStatusText,
                                isActive
                                  ? styles.statusTextActive
                                  : isRedeemed
                                    ? styles.statusTextRedeemed
                                    : styles.statusTextExpired,
                              ]}
                            >
                              {reward.status ? reward.status.toUpperCase() : 'ACTIVE'}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.rewardDivider} />

                        <View style={styles.datesGrid}>
                          {reward.created_at ? (
                            <View style={styles.dateItem}>
                              <Text style={styles.dateItemLabel}>Earned</Text>
                              <View style={styles.dateValueRow}>
                                <Calendar size={12} color={Colors.textTertiary} />
                                <Text style={styles.dateItemValue}>{formatRewardDate(reward.created_at)}</Text>
                              </View>
                            </View>
                          ) : null}

                          {reward.expires_at ? (
                            <View style={styles.dateItem}>
                              <Text style={styles.dateItemLabel}>Valid Until</Text>
                              <View style={styles.dateValueRow}>
                                <Calendar size={12} color={Colors.textTertiary} />
                                <Text style={styles.dateItemValue}>{formatRewardDate(reward.expires_at)}</Text>
                              </View>
                            </View>
                          ) : null}

                          {reward.redeemed_at ? (
                            <View style={styles.dateItem}>
                              <Text style={styles.dateItemLabel}>Redeemed</Text>
                              <View style={styles.dateValueRow}>
                                <Calendar size={12} color={Colors.textTertiary} />
                                <Text style={styles.dateItemValue}>{formatRewardDate(reward.redeemed_at)}</Text>
                              </View>
                            </View>
                          ) : null}
                        </View>
                      </Card>
                    );
                  })}
                </View>
              </View>
            ) : null}

            {/* How to use section */}
            <View style={styles.instructionsSection}>
              <Text style={styles.sectionTitle}>How It Works</Text>

              <View style={styles.stepItem}>
                <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepTextContainer}>
                  <Text style={styles.stepTitle}>Share with friends</Text>
                  <Text style={styles.stepDescription}>Send your unique promo code to peers who need a traveler assistance app.</Text>
                </View>
              </View>

              <View style={styles.stepItem}>
                <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.stepTextContainer}>
                  <Text style={styles.stepTitle}>They apply the code</Text>
                  <Text style={styles.stepDescription}>Your friends apply this code during their subscription purchase checkout.</Text>
                </View>
              </View>

              <View style={styles.stepItem}>
                <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <View style={styles.stepTextContainer}>
                  <Text style={styles.stepTitle}>Enjoy your rewards</Text>
                  <Text style={styles.stepDescription}>Unlock special 20% discount on your subscription.</Text>
                </View>
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  contentContainer: {
    gap: 24,
  },
  mainCard: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DFF1F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  minimalDescription: {
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  codeContainer: {
    width: '100%',
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  codeLabel: {
    fontSize: Fonts.xs,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textTertiary,
    marginBottom: 8,
    letterSpacing: 1,
  },
  codeDisplayWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  codeText: {
    fontSize: Fonts.xxl,
    fontWeight: Fonts.weightBold,
    color: Colors.primaryCyan,
    letterSpacing: 1.5,
  },
  discountBadge: {
    backgroundColor: Colors.success + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  discountBadgeText: {
    fontSize: Fonts.xs,
    fontWeight: Fonts.weightBold,
    color: Colors.success,
  },
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginBottom: 16,
  },
  copyBtn: {
    // flex: 1,
    width: '48%',
  },
  shareBtn: {
    // flex: 1,
    width: '48%',
  },
  expiryText: {
    fontSize: Fonts.xs,
    color: Colors.textLight,
  },
  instructionsSection: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sectionTitle: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  stepNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.backgroundGray,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: Fonts.sm,
    fontWeight: Fonts.weightBold,
    color: Colors.primaryCyan,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
    lineHeight: 20,
  },
  rewardsSectionContainer: {
    gap: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  rewardsStatsBadge: {
    backgroundColor: Colors.primaryCyan + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rewardsStatsText: {
    fontSize: Fonts.xs,
    fontWeight: Fonts.weightBold,
    color: Colors.primaryCyan,
  },
  rewardsCardsList: {
    gap: 16,
  },
  rewardCardWrapper: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  rewardCardInactive: {
    backgroundColor: Colors.backgroundGray,
    borderColor: Colors.borderLight + '80',
    opacity: 0.85,
  },
  rewardCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rewardIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryCyan + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardDiscountValue: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightBold,
    color: Colors.primaryCyan,
  },
  rewardStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusBadgeActive: {
    backgroundColor: Colors.success + '12',
    borderColor: Colors.success,
  },
  statusBadgeRedeemed: {
    backgroundColor: Colors.info + '12',
    borderColor: Colors.info,
  },
  statusBadgeExpired: {
    backgroundColor: Colors.textTertiary + '12',
    borderColor: Colors.borderLight,
  },
  rewardStatusText: {
    fontSize: Fonts.xs,
    fontWeight: Fonts.weightBold,
    letterSpacing: 0.5,
  },
  statusTextActive: {
    color: Colors.success,
  },
  statusTextRedeemed: {
    color: Colors.info,
  },
  statusTextExpired: {
    color: Colors.textTertiary,
  },
  rewardDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 14,
  },
  datesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  dateItem: {
    flex: 1,
    minWidth: 90,
  },
  dateItemLabel: {
    fontSize: Fonts.xs,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  dateValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateItemValue: {
    fontSize: Fonts.xs,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
  },
});

export default PromoCodesScreen;
