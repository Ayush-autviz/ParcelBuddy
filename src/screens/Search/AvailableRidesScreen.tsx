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

type AvailableRidesScreenRouteProp = RouteProp<SearchStackParamList, 'AvailableRides'>;
type AvailableRidesScreenNavigationProp = StackNavigationProp<SearchStackParamList, 'AvailableRides'>;

const AvailableRidesScreen: React.FC = () => {
  const route = useRoute<AvailableRidesScreenRouteProp>();
  const navigation = useNavigation<AvailableRidesScreenNavigationProp>();
  const { rides, from, to, date } = route.params;
  const [searchQuery, setSearchQuery] = React.useState(`${from} to ${to}`);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${month}, ${year}`;
  };

  const formattedDate = formatDate(date);

  const handleSendRequest = (ride: AvailableRideData) => {
    // TODO: Implement send request functionality
    console.log('Send request for ride:', ride.id);
  };

  const handleRidePress = (ride: AvailableRideData) => {
    // TODO: Navigate to ride detail screen
    console.log('Ride pressed:', ride.id);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
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
            description="Try adjusting your search criteria to find more rides."
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
});

export default AvailableRidesScreen;

