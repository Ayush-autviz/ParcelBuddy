import React, { useState, useEffect, useRef } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { ProfileHeader, Card, EmptyStateCard, GradientButton } from '../../components';
import { ProfileStackParamList } from '../../navigation/ProfileNavigator';
import { useTransactionHistory, TransactionResponse } from '../../hooks/useSubscription';
import { getTransactionHistory } from '../../services/api/subscription';

type PaymentHistoryScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'PaymentHistory'>;

interface PaymentEntry {
  id: string;
  planName: string;
  date: string;
  amount: string;
  status: string;
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  } catch (error) {
    return dateString || 'Date not available';
  }
};

// Helper function to capitalize first letter
const capitalizeFirst = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const PaymentHistoryScreen: React.FC = () => {
  const navigation = useNavigation<PaymentHistoryScreenNavigationProp>();
  const { data: transactionData, isLoading, isError, isFetching, refetch } = useTransactionHistory();
  
  // State for pagination
  const [allTransactions, setAllTransactions] = useState<TransactionResponse[]>([]);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const initializedRef = useRef(false);
  const initialPageSizeRef = useRef(0);
  const lastDataRef = useRef<string | null>(null);

  // Initialize data
  useEffect(() => {
    if (transactionData?.transactions && !initializedRef.current) {
      setAllTransactions(transactionData.transactions);
      setNextPageUrl(transactionData.pagination?.next_page || null);
      initializedRef.current = true;
    }
  }, [transactionData]);

  // Handle refresh - update only first page if data changes
  useEffect(() => {
    if (transactionData?.transactions && initializedRef.current) {
      if (initialPageSizeRef.current === 0) {
        initialPageSizeRef.current = transactionData.transactions.length;
      }
      const dataHash = transactionData.transactions.map(t => t.id).join(',');
      if (lastDataRef.current !== dataHash) {
        lastDataRef.current = dataHash;
        const initialPageSize = initialPageSizeRef.current;
        setAllTransactions(prev => {
          if (prev.length > initialPageSize) {
            const additionalPages = prev.slice(initialPageSize);
            return [...transactionData.transactions, ...additionalPages];
          } else {
            return transactionData.transactions;
          }
        });
        setNextPageUrl(transactionData.pagination?.next_page || null);
      }
    }
  }, [transactionData]);

  const handleLoadMore = async () => {
    if (!nextPageUrl || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const response = await getTransactionHistory(nextPageUrl);
      const hasPagination = response?.pagination && response?.results;
      const newTransactions = hasPagination
        ? response.results
        : (Array.isArray(response) ? response : (response?.data || response?.results || []));

      if (Array.isArray(newTransactions) && newTransactions.length > 0) {
        setAllTransactions(prev => [...prev, ...newTransactions]);
        setNextPageUrl(hasPagination ? response.pagination.next_page : null);
      } else {
        setNextPageUrl(null);
      }
    } catch (error) {
      console.error('Error loading more transactions:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Transform API data to PaymentEntry format
  const paymentEntries: PaymentEntry[] = allTransactions.map((transaction: TransactionResponse) => ({
    id: transaction.id,
    planName: capitalizeFirst(transaction.subscription_plan_name || 'Plan'),
    date: formatDate(transaction.created_on),
    amount: `${transaction.currency} ${transaction.amount}`,
    status: capitalizeFirst(transaction.status || ''),
  }));

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader title="Payment History" />

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

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primaryCyan} />
            <Text style={styles.loadingText}>Loading transactions...</Text>
          </View>
        ) : isError ? (
          <View style={styles.emptyContainer}>
            <EmptyStateCard
              title="Error loading transactions"
              description="Failed to load payment history. Please try again."
            />
          </View>
        ) : paymentEntries.length > 0 ? (
          <>
            {/* Payment Entries */}
            <View style={styles.paymentsContainer}>
              {paymentEntries.map((payment) => (
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

            {/* View More Button */}
            {nextPageUrl && (
              <View style={styles.viewMoreContainer}>
                {/* <GradientButton
                  title={isLoadingMore ? 'Loading...' : 'View More'}
                  onPress={handleLoadMore}
                  style={styles.viewMoreButton}
                  loading={isLoadingMore}
                  disabled={isLoadingMore}
                /> */}
                <TouchableOpacity onPress={handleLoadMore} style={styles.viewMoreButton}>
                  {isLoadingMore ? (
                    <ActivityIndicator size="small" color={Colors.textPrimary} />
                  ) : (
                    <Text style={{color: Colors.textPrimary, fontSize: Fonts.base, fontWeight: Fonts.weightSemiBold}}>View More</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <EmptyStateCard
              title="No transactions yet"
              description="You haven't made any payments yet."
            />
          </View>
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
  viewMoreContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  viewMoreButton: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: Colors.backgroundGray,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
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
});

export default PaymentHistoryScreen;

