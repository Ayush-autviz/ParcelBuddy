import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Search, X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, EmptyStateCard } from '../../components';
import { AvailableRideCard, SearchCriteriaCard } from '../../components/search';
import { RootStackParamList } from '../../navigation/types';
import { AvailableRideData } from '../../components/search/AvailableRideCard';
import { Package } from 'lucide-react-native';
import { useToast } from '../../components/Toast';
import { useRequestRaise } from '../../hooks/useRideMutations';
import { useSearchRides } from '../../hooks/useSearchRides';

type AvailableRidesScreenRouteProp = RouteProp<RootStackParamList, 'AvailableRides'>;
type AvailableRidesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AvailableRides'>;

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
    toLongitude,
  } = route.params;
  const [searchQuery, setSearchQuery] = React.useState(`${from} to ${to}`);
  const { showSuccess } = useToast();
  const requestRaiseMutation = useRequestRaise();
  const searchRidesMutation = useSearchRides();

  const [localRides, setLocalRides] = React.useState<AvailableRideData[] | undefined>(rides);
  const [isLoading, setIsLoading] = React.useState(!rides);

  React.useEffect(() => {
    if (!rides) {
      setIsLoading(true);
      const searchParams = {
        origin: from,
        destination: to,
        origin_lat: fromLatitude,
        origin_lng: fromLongitude,
        destination_lat: toLatitude,
        destination_lng: toLongitude,
        date_from: date,
        max_price: 10,
        ordering: '-travel_date',
      };

      searchRidesMutation.mutate(searchParams, {
        onSuccess: (response) => {
          const transformedRides = (response || []).map((item: any) => {
            const profileId = item.traveler?.profile?.id;
            return {
              id: item.id,
              traveler: {
                first_name: item.traveler?.first_name || '',
                last_name: item.traveler?.last_name || '',
                profile: {
                  profile_photo: item.traveler?.profile?.profile_photo,
                  average_rating: item.traveler?.profile?.average_rating,
                  id: item.traveler?.profile?.id,
                },
              },
              profileId: profileId,
              travel_date: item.travel_date,
              origin_name: item.origin_name,
              destination_name: item.destination_name,
              available_weight_kg: item.available_weight_kg,
              price_per_kg: item.price_per_kg,
              rating: item.traveler?.profile?.average_rating || 0,
              review_count: item.traveler?.total_rating || 128,
              notes: item.notes,
            };
          });
          setLocalRides(transformedRides);
          setIsLoading(false);
        },
        onError: (error) => {
          console.error('AvailableRidesScreen search error:', error);
          setLocalRides([]);
          setIsLoading(false);
        }
      });
    }
  }, [rides, from, to, date, fromLatitude, fromLongitude, toLatitude, toLongitude]);




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
    // Replace the root stack with MainApp and navigate deep into Search's SendRequest screen
    navigation.replace('MainApp', {
      screen: 'Search',
      params: {
        screen: 'SendRequest',
        params: { ride }
      }
    } as any);
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

    console.log('Request Raise Payload:', payload);

    requestRaiseMutation.mutate(payload, {
      onSuccess: (response) => {
        console.log('Request Raise Response:', response);
        showSuccess('Request raised successfully! You will be notified when a ride is available.');
        navigation.goBack();
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

      {/* {rides.length > 0 && (
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
      )} */}

      {/* Available Rides List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primaryTeal} />
          <Text style={styles.loadingText}>Searching matching rides...</Text>
        </View>
      ) : localRides && localRides.length > 0 ? (
        <FlatList
          data={localRides}
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
            description="You will receive notifications whenever new rides become available for this month. You can cancel the request anytime, or it will automatically expire at the end of the month."
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
    // paddingBottom: 16,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: Fonts.base,
    color: Colors.textTertiary,
    marginTop: 16,
  },
});

export default AvailableRidesScreen;

