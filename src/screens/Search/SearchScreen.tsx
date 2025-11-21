import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Card, Header, GradientButton, TabButton, SearchInput, SearchHistoryItem, PlaceResultItemData, DatePickerInput } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchStackParamList } from '../../navigation/SearchNavigator';
import { useSearchFormStore } from '../../services/store';
import { useSearchRides } from '../../hooks/useSearchRides';
import { useSearchHistory, SearchHistoryItem as SearchHistoryItemType } from '../../hooks/useSearchHistory';
import { useToast } from '../../components/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MapPinIcon } from '../../assets/icons/svg/main';

const { width } = Dimensions.get('window');

type TabType = 'Domestic' | 'International';

type SearchScreenNavigationProp = StackNavigationProp<SearchStackParamList, 'SearchList'>;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('Domestic');
  const [date, setDate] = useState<Date | null>(null);
  const shouldClearOnFocus = useRef(false);

  // Use Zustand store only for from/to values - data is stored directly in PlacesSearchScreen
  const { 
    from, 
    to, 
    selectedFrom, 
    selectedTo, 
    setFrom, 
    setTo,
    fromLatitude,
    fromLongitude,
    toLatitude,
    toLongitude,
    setFromCoordinates,
    setToCoordinates,
    clearSearchForm
  } = useSearchFormStore();

  // Search rides mutation
  const searchRidesMutation = useSearchRides();

  // Fetch search history from API
  const { data: searchHistory = [], isLoading: isHistoryLoading, refetch: refetchHistory } = useSearchHistory();

  // Toast hook
  const { showWarning } = useToast();

  // Clear form when screen comes into focus after a successful search
  // This ensures clearing happens when screen is active, not before navigation
  useFocusEffect(
    React.useCallback(() => {
      if (shouldClearOnFocus.current) {
        // Clear form data - both store and AsyncStorage
        clearSearchForm();
        setFrom('');
        setTo('');
        setDate(null);
        // Manually clear AsyncStorage to ensure persistence is cleared
        AsyncStorage.removeItem('search-form-storage').catch(console.error);
        shouldClearOnFocus.current = false;
      }
    }, [])
  );

  const isDomestic = activeTab === 'Domestic';

  const handleFromFocus = () => {
    navigation.navigate('PlacesSearch', {
      fieldType: 'from',
      isDomestic,
      initialValue: from,
      storeType: 'search', // Pass storeType to indicate it's from SearchScreen
    });
  };

  const handleToFocus = () => {
    navigation.navigate('PlacesSearch', {
      fieldType: 'to',
      isDomestic,
      initialValue: to,
      storeType: 'search', // Pass storeType to indicate it's from SearchScreen
    });
  };


  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSearch = () => {
    // Validation
    if (!from || !to) {
      showWarning('Please select origin and destination');
      return;
    }

    if (!fromLatitude || !fromLongitude || !toLatitude || !toLongitude) {
      showWarning('Please select valid origin and destination locations');
      return;
    }

    if (!date) {
      showWarning('Please select a date');
      return;
    }

    // Capture values before clearing (needed for navigation)
    const searchFrom = from;
    const searchTo = to;
    const searchDate = date;

    // Prepare search parameters
    const searchParams = {
      origin: from,
      destination: to,
      origin_lat: fromLatitude,
      origin_lng: fromLongitude,
      destination_lat: toLatitude,
      destination_lng: toLongitude,
      date_from: formatDate(date),
      max_price: 10, // Static price as requested
      ordering: '-travel_date', // Order by travel date descending
    };

    // Call search API
    searchRidesMutation.mutate(searchParams, {
      onSuccess: (response) => {
        console.log('🔍 [SEARCH SCREEN] Search rides response:', JSON.stringify(response, null, 2));
        
        // Transform API response to AvailableRideData format
        const transformedRides = (response || []).map((ride: any) => {
          const profileId = ride.traveler?.profile?.id;
          console.log('🔍 [SEARCH SCREEN] Processing ride:', ride.id);
          console.log('🔍 [SEARCH SCREEN] Traveler:', ride.traveler?.first_name, ride.traveler?.last_name);
          console.log('🔍 [SEARCH SCREEN] Profile object:', JSON.stringify(ride.traveler?.profile, null, 2));
          console.log('🔍 [SEARCH SCREEN] Extracted profileId:', profileId);
          
          return {
            id: ride.id,
            traveler: {
              first_name: ride.traveler?.first_name || '',
              last_name: ride.traveler?.last_name || '',
              profile: {
                profile_photo: ride.traveler?.profile?.profile_photo,
                rating: ride.traveler?.profile?.average_rating,
                id: ride.traveler?.profile?.id,
              },
            },
            profileId: profileId, // Extract profile ID separately for getProfileById API
            travel_date: ride.travel_date,
            origin_name: ride.origin_name,
            destination_name: ride.destination_name,
            available_weight_kg: ride.available_weight_kg,
            price_per_kg: ride.price_per_kg,
            // Rating and review_count would come from traveler profile if available
            rating: ride.traveler?.profile?.rating || 0,
            review_count: ride.traveler?.profile?.review_count || 128,
          };
        });
        
        console.log('🔍 [SEARCH SCREEN] Transformed rides:', JSON.stringify(transformedRides.map((r: any) => ({ id: r.id, profileId: r.profileId })), null, 2));
        
        // Set flag to clear form when screen comes back into focus
        // This ensures clearing happens when screen is active, not before navigation
        shouldClearOnFocus.current = true;
        
        // Refetch search history to include the new search
        refetchHistory();
        
        // Navigate to Available Rides screen with results
        navigation.navigate('AvailableRides', {
          rides: transformedRides,
          from: searchFrom,
          to: searchTo,
          date: formatDate(searchDate),
        });
      },
      onError: (error: any) => {
        console.error('Search rides error:', error);
        console.log('Error response:', error?.response?.data);
      },
    });
  };

  const handleHistoryPress = (item: SearchHistoryItemType) => {
    // Directly trigger search API without populating form fields
    if (
      item.from &&
      item.to &&
      item.origin_lat &&
      item.origin_lng &&
      item.destination_lat &&
      item.destination_lng &&
      item.travel_date
    ) {
      const searchParams = {
        origin: item.from,
        destination: item.to,
        origin_lat: item.origin_lat,
        origin_lng: item.origin_lng,
        destination_lat: item.destination_lat,
        destination_lng: item.destination_lng,
        date_from: item.travel_date,
        max_price: 10,
        ordering: '-travel_date',
      };
      
      searchRidesMutation.mutate(searchParams, {
        onSuccess: (response) => {
          console.log('🔍 [SEARCH SCREEN - HISTORY] Search rides response:', JSON.stringify(response, null, 2));
          
          // Transform API response to AvailableRideData format
          const transformedRides = (response || []).map((ride: any) => {
            const profileId = ride.traveler?.profile?.id;
            
            return {
              id: ride.id,
              traveler: {
                first_name: ride.traveler?.first_name || '',
                last_name: ride.traveler?.last_name || '',
                profile: {
                  profile_photo: ride.traveler?.profile?.profile_photo,
                  rating: ride.traveler?.profile?.average_rating,
                  id: ride.traveler?.profile?.id,
                },
              },
              profileId: profileId, // Extract profile ID separately for getProfileById API
              travel_date: ride.travel_date,
              origin_name: ride.origin_name,
              destination_name: ride.destination_name,
              available_weight_kg: ride.available_weight_kg,
              price_per_kg: ride.price_per_kg,
              rating: ride.traveler?.profile?.rating || 0,
              review_count: ride.traveler?.profile?.review_count || 128,
            };
          });
          
          console.log('🔍 [SEARCH SCREEN - HISTORY] Transformed rides:', JSON.stringify(transformedRides.map((r: any) => ({ id: r.id, profileId: r.profileId })), null, 2));
          
          // Set flag to clear form when screen comes back into focus
          shouldClearOnFocus.current = true;
          
          // Refetch search history to include the new search
          refetchHistory();
          
          // Navigate to Available Rides screen with results
          navigation.navigate('AvailableRides', {
            rides: transformedRides,
            from: item.from,
            to: item.to,
            date: item.travel_date,
          });
        },
        onError: (error: any) => {
          console.error('Search rides error:', error);
          console.log('Error response:', error?.response?.data);
        },
      });
    }
  };

  console.log('searchHistory', searchHistory);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header title="Search Rides" variant="centered" />
      
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Illustration Banner */}
        <View style={styles.bannerContainer}>
        <Image
        source={require('../../assets/images/Aeroplane.png')}
        style={styles.bannerPlaceholder}
        />
        </View>

        {/* Search Form Card */}
        <Card style={styles.searchCard} padding={20}>
          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TabButton
              label="Domestic"
              active={activeTab === 'Domestic'}
              onPress={() => setActiveTab('Domestic')}
              isFirst={true}
            />
            <TabButton
              label="International"
              active={activeTab === 'International'}
              onPress={() => setActiveTab('International')}
              isLast={true}
            />
          </View>

          {/* Input Fields */}
          <View style={styles.inputsContainer}>
            <TouchableOpacity onPress={handleFromFocus} activeOpacity={0.7}>
              <SearchInput
                icon={MapPinIcon}
                placeholder="From"
                value={from}
                editable={false}
                pointerEvents="none"
                containerStyle={styles.input}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleToFocus} activeOpacity={0.7}>
              <SearchInput
                icon={MapPinIcon}
                placeholder="To"
                value={to}
                editable={false}
                pointerEvents="none"
                containerStyle={styles.input}
              />
            </TouchableOpacity>
            <DatePickerInput
              value={date}
              onChange={setDate}
              placeholder="mm / yy"
              minimumDate={new Date()}
              containerStyle={styles.input}
              iconContainerStyle={styles.iconContainer}
            />
          </View>

          {/* Search Button */}
          <GradientButton
            title={searchRidesMutation.isPending ? "Searching..." : "Search Rides"}
            onPress={handleSearch}
            style={styles.searchButton}
            loading={searchRidesMutation.isPending}
            disabled={searchRidesMutation.isPending}
          />
        </Card>

        {/* Search History Section */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Search History</Text>
          {isHistoryLoading ? (
            <Text style={styles.loadingText}>Loading history...</Text>
          ) : searchHistory.length === 0 ? (
            <Text style={styles.emptyText}>No search history available</Text>
          ) : (
            searchHistory.map((item) => (
              <SearchHistoryItem
                key={item.id}
                from={item.from}
                to={item.to}
                date={item.date}
                onPress={() => handleHistoryPress(item)}
              />
            ))
          )}
        </View>
      </KeyboardAwareScrollView>
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
    paddingBottom: 100,
  },
  bannerContainer: {
    // width: width - 40,
    // marginHorizontal: 20,
    // marginBottom: 0,
    // borderRadius: 12,
    overflow: 'hidden',
  },
  bannerPlaceholder: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  searchCard: {
    marginHorizontal: 20,
    marginTop: -140,
    marginBottom: 24,
    zIndex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gradientEnd,
  },
  inputsContainer: {
    marginBottom: 0,
  },
  input: {
    marginBottom: 16,
  },
  searchButton: {
    marginTop: 4,
  },
  historySection: {
    paddingHorizontal: 20,
  },
  historyTitle: {
    fontSize: Fonts.lg,
    // fontWeight: Fonts.weightRegular,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: Fonts.base,
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: Fonts.base,
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingVertical: 20,
  },
  iconContainer: {
    marginRight: 16,
  },
});

export default SearchScreen;
