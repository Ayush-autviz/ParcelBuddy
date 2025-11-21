import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Shield, Check } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { ProfileHeader, GradientButton } from '../../components';
import { ProfileStackParamList } from '../../navigation/ProfileNavigator';

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
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$7.99/month',
    isCurrent: false,
    features: [
      { text: 'Create up to 2 rides/month.' },
      { text: 'Search rides unlimited.' },
      { text: 'Send requests to 20 travellers/month.' },
      { text: 'Email support.' },
    ],
  },
  {
    id: 'silver',
    name: 'Silver',
    price: '$14.99/month',
    isCurrent: true,
    features: [
      { text: 'Create up to 10 rides/month.' },
      { text: 'Search rides unlimited.' },
      { text: 'Send requests to 40 travelers/month.' },
      { text: 'Email support.' },
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: '$19.99/month',
    isCurrent: false,
    features: [
      { text: 'Create up to 30 rides/month.' },
      { text: 'Search rides unlimited.' },
      { text: 'Send requests to 100 travelers/month.' },
      { text: 'Email support.' },
    ],
  },
];

const SubscriptionScreen: React.FC = () => {
  const navigation = useNavigation<SubscriptionScreenNavigationProp>();
  const currentPlan = subscriptionPlans.find((plan) => plan.isCurrent);

  const handleUpgrade = (planId: string) => {
    // TODO: Implement upgrade functionality
    console.log('Upgrade to:', planId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader title="Subscription" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
          {subscriptionPlans.map((plan) => (
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
                  <GradientButton
                    title="Upgrade"
                    onPress={() => handleUpgrade(plan.id)}
                    style={styles.upgradeButton}
                  />
                </View>
              )}
            </View>
          ))}
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
    paddingBottom: 100,
  },
  currentPlanIndicator: {
    backgroundColor: Colors.primaryCyan + '20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.primaryCyan + '30',
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
    fontSize: Fonts.xl,
    fontWeight: Fonts.weightBold,
    color: Colors.primaryCyan,
  },
  planNameActive: {
    fontSize: Fonts.xl,
    fontWeight: Fonts.weightBold,
    color: Colors.textWhite,
  },
  planPrice: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.primaryCyan,
  },
  planPriceActive: {
    fontSize: Fonts.base,
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
    fontSize: Fonts.base,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 22,
  },
  featureTextActive: {
    fontSize: Fonts.base,
    color: Colors.textWhite,
    flex: 1,
    lineHeight: 22,
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
});

export default SubscriptionScreen;

