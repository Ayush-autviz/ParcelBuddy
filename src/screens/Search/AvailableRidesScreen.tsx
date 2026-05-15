import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Search, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, EmptyStateCard } from '../../components';
import { AvailableRideCard, SearchCriteriaCard } from '../../components/search';
import { SearchStackParamList } from '../../navigation/SearchNavigator';
import { AvailableRideData } from '../../components/search/AvailableRideCard';
import { Package } from 'lucide-react-native';
import { useToast } from '../../components/Toast';
import { useRequestRaise } from '../../hooks/useRideMutations';

type AvailableRidesScreenRouteProp = RouteProp<SearchStackParamList, 'AvailableRides'>;
type AvailableRidesScreenNavigationProp = StackNavigationProp<SearchStackParamList, 'AvailableRides'>;

const AvailableRidesScreen: React.FC = () => {
  const route = useRoute<AvailableRidesScreenRouteProp>();
  const navigation = useNavigation<AvailableRidesScreenNavigationProp>();
  const {
    rides,
    from,
    to,
    date,
    fromLatitude,
    fromLongitude,
    toLatitude,
    toLongitude
  } = route.params;
  const [searchQuery, setSearchQuery] = React.useState(`${from} to ${to}`);
  const { showSuccess } = useToast();
  const requestRaiseMutation = useRequestRaise();


  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month}, ${year}`;
  };

  const formattedDate = formatDate(date);

  const handleSendRequest = (ride: AvailableRideData) => {
    const availableWeight = parseFloat(ride.available_weight_kg).toFixed(0);
    if (availableWeight === '0') {
      return;
    }
    navigation.navigate('SendRequest', { ride });
  };

  const handleRidePress = (ride: AvailableRideData) => {
    // TODO: Navigate to ride detail screen
    console.log('Ride pressed:', ride.id);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleRequestRaise = () => {
    const payload = {
      destination_name: to,
      origin_name: from,
      travel_date: date,
      destination_lat: toLatitude || 0,
      destination_lng: toLongitude || 0,
      origin_lat: fromLatitude || 0,
      origin_lng: fromLongitude || 0,
    };

    requestRaiseMutation.mutate(payload, {
      onSuccess: (response) => {
        console.log('Request Raise Response:', response);
        showSuccess('Request raised successfully! You will be notified when a ride is available.');
      },
      onError: (error: any) => {
        console.error('Request Raise Error:', error?.response?.data || error.message);
      }
    });
  };

  const renderRideCard = ({ item }: { item: AvailableRideData }) => (
    <AvailableRideCard
      ride={item}
      onPress={() => handleRidePress(item)}
      onSendRequest={() => handleSendRequest(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Available Rides" showBackButton />

      {/* Search Bar */}
      {/* <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.textTertiary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="San Francisco to Los Angeles"
            placeholderTextColor={Colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearIcon}>
              <X size={18} color={Colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View> */}

      {/* Search Criteria Card */}
      <View style={styles.criteriaContainer}>
        <SearchCriteriaCard
          from={from}
          to={to}
          date={formattedDate}
        />
      </View>

      {rides.length > 0 && (
        <View style={styles.footerRequestContainer}>
          <View style={styles.footerRequestContent}>
            <Text style={styles.footerRequestTitle}>Didn't find a suitable ride?</Text>
            <Text style={styles.footerRequestSub}>We can notify you when new rides matching your search are posted.</Text>
          </View>
          <TouchableOpacity
            style={styles.footerRequestButton}
            onPress={handleRequestRaise}
            disabled={requestRaiseMutation.isPending}
          >
            <Text style={styles.footerRequestButtonText}>
              {requestRaiseMutation.isPending ? 'Requesting...' : 'Request Raise'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Available Rides List */}
      {rides.length > 0 ? (
        <FlatList
          data={rides}
          renderItem={renderRideCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyStateCard
            icon={Package}
            title="No rides found"
            description="You will get notification for the rides when someone post it"
            buttonLabel="Request Raise"
            onButtonPress={handleRequestRaise}
            loading={requestRaiseMutation.isPending}
            disabled={requestRaiseMutation.isPending}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: Fonts.base,
    color: Colors.textPrimary,
  },
  clearIcon: {
    padding: 4,
  },
  criteriaContainer: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  footerRequestContainer: {
    backgroundColor: Colors.backgroundWhite,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerRequestContent: {
    flex: 1,
  },
  footerRequestTitle: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  footerRequestSub: {
    fontSize: Fonts.xs,
    color: Colors.textTertiary,
  },
  footerRequestButton: {
    backgroundColor: Colors.primaryTeal,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 110,
    alignItems: 'center',
  },
  footerRequestButtonText: {
    color: Colors.backgroundWhite,
    fontSize: Fonts.sm,
    fontWeight: Fonts.weightSemiBold,
  },
});

export default AvailableRidesScreen;

