import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MapPin } from 'lucide-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Card, Header, GradientButton, TabButton, SearchInput, SearchHistoryItem, PlaceResultItemData, DatePickerInput } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchStackParamList } from '../../navigation/SearchNavigator';
import { useSearchFormStore } from '../../services/store';
import { useSearchRides } from '../../hooks/useSearchRides';

const { width } = Dimensions.get('window');

type TabType = 'Domestic' | 'International';

interface SearchHistory {
  id: string;
  from: string;
  to: string;
  date: string;
}

type SearchScreenNavigationProp = StackNavigationProp<SearchStackParamList, 'SearchList'>;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('Domestic');
  const [date, setDate] = useState<Date | null>(null);

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
    toLongitude
  } = useSearchFormStore();

  // Search rides mutation
  const searchRidesMutation = useSearchRides();

  const isDomestic = activeTab === 'Domestic';

  // Mock search history data
  const searchHistory: SearchHistory[] = [
    { id: '1', from: 'New York', to: 'Boston', date: 'Aug, 2025' },
    { id: '2', from: 'Boston', to: 'LA', date: 'Sep, 2025' },
    { id: '3', from: 'New York', to: 'Boston', date: 'Sep, 2025' },
  ];

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
      console.log('Please select origin and destination');
      return;
    }

    if (!fromLatitude || !fromLongitude || !toLatitude || !toLongitude) {
      console.log('Please select valid origin and destination locations');
      return;
    }

    if (!date) {
      console.log('Please select a date');
      return;
    }

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
        console.log('Search rides response:', response);
        
        // Transform API response to AvailableRideData format
        const transformedRides = (response || []).map((ride: any) => ({
          id: ride.id,
          traveler: {
            first_name: ride.traveler?.first_name || '',
            last_name: ride.traveler?.last_name || '',
            profile: {
              profile_photo: ride.traveler?.profile?.profile_photo,
            },
          },
          travel_date: ride.travel_date,
          origin_name: ride.origin_name,
          destination_name: ride.destination_name,
          available_weight_kg: ride.available_weight_kg,
          price_per_kg: ride.price_per_kg,
          // Rating and review_count would come from traveler profile if available
          rating: ride.traveler?.profile?.rating || 4.8,
          review_count: ride.traveler?.profile?.review_count || 128,
        }));
        
        // Navigate to Available Rides screen with results
        navigation.navigate('AvailableRides', {
          rides: transformedRides,
          from: from,
          to: to,
          date: formatDate(date),
        });
      },
      onError: (error: any) => {
        console.error('Search rides error:', error);
        console.log('Error response:', error?.response?.data);
      },
    });
  };

  const handleHistoryPress = (item: SearchHistory) => {
    setFrom(item.from);
    setTo(item.to);
  };


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
                icon={MapPin}
                placeholder="From"
                value={from}
                editable={false}
                pointerEvents="none"
                containerStyle={styles.input}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleToFocus} activeOpacity={0.7}>
              <SearchInput
                icon={MapPin}
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
              placeholder="Select Date"
              minimumDate={new Date()}
              containerStyle={styles.input}
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
          {searchHistory.map((item) => (
            <SearchHistoryItem
              key={item.id}
              from={item.from}
              to={item.to}
              date={item.date}
              onPress={() => handleHistoryPress(item)}
            />
          ))}
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
    height: 330,
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
    fontSize: Fonts.xl,
    // fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
});

export default SearchScreen;
