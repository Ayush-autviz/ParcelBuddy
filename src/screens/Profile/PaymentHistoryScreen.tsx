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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, Card } from '../../components';
import { ProfileStackParamList } from '../../navigation/ProfileNavigator';

type PaymentHistoryScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'PaymentHistory'>;

interface PaymentEntry {
  id: string;
  planName: string;
  date: string;
  amount: string;
  status: string;
}

const paymentData: PaymentEntry[] = [
  {
    id: '1',
    planName: 'Silver Plan',
    date: 'Dec 15, 2024',
    amount: '$14.99',
    status: 'Free',
  },
  {
    id: '2',
    planName: 'Silver Plan',
    date: 'Nov 15, 2024',
    amount: '$14.99',
    status: 'Free',
  },
  {
    id: '3',
    planName: 'Free Plan',
    date: 'Oct 15, 2024',
    amount: '$0.00',
    status: 'Free',
  },
];

const PaymentHistoryScreen: React.FC = () => {
  const navigation = useNavigation<PaymentHistoryScreenNavigationProp>();

  const handleViewAllTransactions = () => {
    // TODO: Navigate to all transactions screen or show more
    console.log('View all transactions');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Payment History" showBackButton />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Title */}
        <Text style={styles.sectionTitle}>Payment History</Text>

        {/* Payment Entries */}
        <View style={styles.paymentsContainer}>
          {paymentData.map((payment) => (
            <Card key={payment.id} style={styles.paymentCard} padding={20}>
              <View style={styles.paymentContent}>
                <View style={styles.paymentLeft}>
                  <Text style={styles.planName}>{payment.planName}</Text>
                  <Text style={styles.paymentDate}>{payment.date}</Text>
                </View>
                <View style={styles.paymentRight}>
                  <Text style={styles.paymentAmount}>{payment.amount}</Text>
                  <Text style={styles.paymentStatus}>{payment.status}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>

        {/* View All Transactions Button */}
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={handleViewAllTransactions}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllButtonText}>View All Transactions</Text>
        </TouchableOpacity>
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
  sectionTitle: {
    fontSize: Fonts.xxl,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  paymentsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  paymentCard: {
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
  paymentContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLeft: {
    flex: 1,
  },
  planName: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  paymentDate: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  paymentStatus: {
    fontSize: Fonts.sm,
    color: Colors.primaryCyan,
    fontWeight: Fonts.weightMedium,
  },
  viewAllButton: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundWhite,
  },
  viewAllButtonText: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.primaryCyan,
  },
});

export default PaymentHistoryScreen;

