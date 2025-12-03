import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Shield, Check } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { ProfileHeader, GradientButton } from '../../components';
import { ProfileStackParamList } from '../../navigation/ProfileNavigator';
import { useSubscriptionPlans, useCreateSubscription } from '../../hooks/useSubscription';
import { useToast } from '../../components/Toast';
import { useAuthStore } from '../../services/store';

type SubscriptionScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'Subscription'>;

interface PlanFeature {
  text: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  features: PlanFeature[];
  isCurrent: boolean;
  showUpgrade: boolean;
}

const SubscriptionScreen: React.FC = () => {
  const navigation = useNavigation<SubscriptionScreenNavigationProp>();
  const { user } = useAuthStore();
  // Get region from user profile, fallback to empty string if not available
  const region = user?.profile?.country || '';
  const { data: plansData, isLoading, isError, isFetching, refetch } = useSubscriptionPlans(region);
  const createSubscriptionMutation = useCreateSubscription();
  const { showSuccess, showError } = useToast();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  // Refetch data when screen comes into focus (e.g., from deep link)
  useFocusEffect(
    useCallback(() => {
      // Refetch when screen comes into focus, even if data is fresh
      refetch({ cancelRefetch: false });
    }, [refetch])
  );

  // Also refetch when region changes (in case user data loads after screen mount)
  useEffect(() => {
    if (region) {
      refetch({ cancelRefetch: false });
    }
  }, [region, refetch]);

  // Transform API data to UI format
  const subscriptionPlans: SubscriptionPlan[] = useMemo(() => {
    if (!plansData?.plans) return [];
    
    // Check if any plan has is_current_plan: true
    const hasCurrentPlan = plansData.plans.some((plan) => plan.is_current_plan === true);
    
    return plansData.plans
      .filter((plan) => plan.is_active)
      .map((plan) => {
        // Format price
        const priceText = `${plan.currency} ${plan.price}/${plan.duration_days === 30 ? 'month' : `${plan.duration_days} days`}`;
        
        // Build features array
        const features: PlanFeature[] = [
          { text: `Create up to ${plan.rides_per_month} rides/month.` },
          { text: 'Search rides unlimited.' },
          { text: `Send requests to ${plan.requests_per_month} travellers/month.` },
          ...(plan.features || []).map((feature) => ({ text: feature })),
        ];

        return {
          id: plan.id,
          name: plan.name,
          price: priceText,
          features,
          isCurrent: plan.is_current_plan || false,
          showUpgrade: !hasCurrentPlan, // Only show upgrade if no plan is current
        };
      });
  }, [plansData]);

  const currentPlan = subscriptionPlans.find((plan) => plan.isCurrent);

  console.log('currentPlan', currentPlan);
  console.log('subscriptionPlans', subscriptionPlans);

  const handleUpgrade = (planId: string) => {
    setLoadingPlanId(planId);
    createSubscriptionMutation.mutate(
      { plan_id: planId },
      {
        onSuccess: (response) => {
          console.log('Subscription created successfully:', response);
          setLoadingPlanId(null); // Clear loading state
          if (response.checkout_url) {
            // Open checkout URL in device browser
            Linking.openURL(response.checkout_url).catch((err) => {
              console.error('Failed to open checkout URL:', err);
              showError('Failed to open checkout page. Please try again.');
            });
            showSuccess('Redirecting to checkout...');
          } else {
            showError('Checkout URL not received. Please try again.');
          }
        },
        onError: (error: any) => {
          console.error('Error creating subscription:', error);
          setLoadingPlanId(null); // Clear loading state on error
          const errorMessage = error?.response?.data?.message || 
                              error?.response?.data?.error || 
                              error?.message || 
                              'Failed to create subscription. Please try again.';
          showError(errorMessage);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ProfileHeader title="Subscription" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primaryCyan} />
          <Text style={styles.loadingText}>Loading plans...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <ProfileHeader title="Subscription" />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Failed to load subscription plans. Please try again.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader title="Subscription" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={refetch}
            colors={[Colors.primaryCyan]}
            tintColor={Colors.primaryCyan}
          />
        }
      >
        {/* Current Plan Indicator */}
        {currentPlan && (
          <View style={styles.currentPlanIndicator}>
            <View style={styles.currentPlanContent}>
              <View style={styles.shieldContainer}>
                <Shield size={24} color={Colors.primaryCyan} />
                <View style={styles.checkBadge}>
                  <Check size={12} color={Colors.textWhite} />
                </View>
              </View>
              <View style={styles.currentPlanTextContainer}>
                <Text style={styles.currentPlanLabel}>Current Plan</Text>
                <Text style={styles.currentPlanDescription}>
                  You are on the <Text style={styles.currentPlanName}>{currentPlan.name}</Text> Plan.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Subscription Plans */}
        <View style={styles.plansContainer}>
          {subscriptionPlans.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No subscription plans available</Text>
            </View>
          ) : (
            subscriptionPlans.map((plan) => (
            <View key={plan.id} style={styles.planCardWrapper}>
              {plan.isCurrent ? (
                <LinearGradient
                  colors={[Colors.gradientStart, Colors.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.planCardGradient}
                >
                  <View style={{ padding: 20 }}>
                  <View style={styles.planHeader}>
                    <Text style={styles.planNameActive}>{plan.name}</Text>
                    <Text style={styles.planPriceActive}>{plan.price}</Text>
                  </View>
                  <View style={styles.planFeatures}>
                    {plan.features.map((feature, index) => (
                      <View key={index} style={styles.featureRow}>
                        <Check size={18} color={Colors.textWhite} />
                        <Text style={styles.featureTextActive}>{feature.text}</Text>
                      </View>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={styles.currentPlanButton}
                    disabled={true}
                  >
                    <Text style={styles.currentPlanButtonText}>Current Plan</Text>
                  </TouchableOpacity>
                  </View>
                </LinearGradient>
              ) : (
                <View style={styles.planCard}>
                  <View style={styles.planHeader}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planPrice}>{plan.price}</Text>
                  </View>
                  <View style={styles.planFeatures}>
                    {plan.features.map((feature, index) => (
                      <View key={index} style={styles.featureRow}>
                        <Check size={18} color={Colors.textPrimary} />
                        <Text style={styles.featureText}>{feature.text}</Text>
                      </View>
                    ))}
                  </View>
                  {plan.showUpgrade && (
                    <GradientButton
                      title="Buy"
                      onPress={() => handleUpgrade(plan.id)}
                      style={styles.upgradeButton}
                      loading={loadingPlanId === plan.id}
                      disabled={loadingPlanId !== null}
                    />
                  )}
                </View>
              )}
            </View>
            ))
          )}
        </View>

        {/* Footer Disclaimer */}
        <Text style={styles.disclaimer}>
          All prices are exclusive of taxes and other fees. Payments are processed securely via Razorpay.
        </Text>
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
    paddingBottom: 30,
  },
  currentPlanIndicator: {
    backgroundColor: '#DFF1F2',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  currentPlanContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shieldContainer: {
    position: 'relative',
    marginRight: 12,
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primaryCyan,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.textWhite,
  },
  currentPlanTextContainer: {
    flex: 1,
  },
  currentPlanLabel: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  currentPlanDescription: {
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
  },
  currentPlanName: {
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
  },
  plansContainer: {
    gap: 16,
    marginBottom: 24,
  },
  planCardWrapper: {
    marginBottom: 4,
  },
  planCard: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 12,
    padding: 20,
    shadowColor: Colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  planCardGradient: {
    borderRadius: 12,
    // padding: 20,
    // paddingVertical: 20,
    shadowColor: Colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightBold,
    color: Colors.primaryCyan,
  },
  planNameActive: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightBold,
    color: Colors.textWhite,
  },
  planPrice: {
    fontSize: Fonts.sm,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.primaryCyan,
  },
  planPriceActive: {
    fontSize: Fonts.sm,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textWhite,
  },
  planFeatures: {
    marginBottom: 20,
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureText: {
    fontSize: Fonts.sm,
    color: Colors.textPrimary,
    flex: 1,
    // lineHeight: 22,
  },
  featureTextActive: {
    fontSize: Fonts.sm,
    color: Colors.textWhite,
    flex: 1,
    // lineHeight: 22,
  },
  upgradeButton: {
    marginTop: 0,
  },
  currentPlanButton: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentPlanButtonText: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.primaryCyan,
  },
  disclaimer: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  errorText: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
  },
});

export default SubscriptionScreen;

