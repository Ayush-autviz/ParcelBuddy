import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RefreshCw } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, Card, GradientButton } from '../../components';
import { SearchStackParamList } from '../../navigation/SearchNavigator';

type BookingStatusScreenRouteProp = RouteProp<SearchStackParamList, 'BookingStatus'>;
type BookingStatusScreenNavigationProp = StackNavigationProp<SearchStackParamList, 'BookingStatus'>;

const BookingStatusScreen: React.FC = () => {
  const route = useRoute<BookingStatusScreenRouteProp>();
  const navigation = useNavigation<BookingStatusScreenNavigationProp>();
  const { bookingRequest } = route.params;

  // Calculate response deadline (4:00 PM today as default, or use actual deadline if available)
  const getResponseDeadline = (): string => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // If it's before 4 PM, show "before 4:00 today"
    if (hours < 16) {
      return '4:00 today';
    }
    // If it's after 4 PM, show "before 4:00 tomorrow"
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return '4:00 tomorrow';
  };

  const handleSeeBookingRequest = () => {
    // Navigate to booking request details screen with request ID
    if (bookingRequest?.id) {
      navigation.navigate('BookingRequestDetail', {
        requestId: bookingRequest.id,
      });
    }
  };

  const handleBackToSearch = () => {
    // Navigate back to search screen
    navigation.navigate('SearchList', {});
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Booking Status" showBackButton />

      <View style={styles.content}>
        {/* Booking Status Card */}
        <Card style={styles.statusCard} padding={20}>
          <View style={styles.statusContent}>
            <View style={styles.iconContainer}>
              <RefreshCw size={32} color={Colors.primaryCyan} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.primaryMessage}>
                Your Booking is awaiting the traveller's approval.
              </Text>
              <Text style={styles.secondaryMessage}>
                The traveller will respond before {getResponseDeadline()}
              </Text>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <GradientButton
            title="See your Booking Request"
            onPress={handleSeeBookingRequest}
            style={styles.primaryButton}
          />

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleBackToSearch}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Back to Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'flex-start',
  },
  statusCard: {
    marginBottom: 24,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.primaryCyan,
    backgroundColor: Colors.primaryCyan + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  primaryMessage: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 8,
    lineHeight: 24,
  },
  secondaryMessage: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  buttonsContainer: {
    gap: 16,
  },
  primaryButton: {
    marginBottom: 0,
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.backgroundWhite,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textSecondary,
  },
});

export default BookingStatusScreen;

