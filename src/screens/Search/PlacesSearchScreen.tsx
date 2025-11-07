import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, SearchInput, PlaceResultItem, PlaceResultItemData, Card } from '../../components';
import { usePlaces } from '../../hooks/usePlaces';
import { MapPin } from 'lucide-react-native';
import { SearchStackParamList } from '../../navigation/SearchNavigator';
import { useSearchFormStore } from '../../services/store';

type PlacesSearchScreenRouteProp = RouteProp<SearchStackParamList, 'PlacesSearch'>;
type PlacesSearchScreenNavigationProp = StackNavigationProp<SearchStackParamList, 'PlacesSearch'>;

const PlacesSearchScreen: React.FC = () => {
  const route = useRoute<PlacesSearchScreenRouteProp>();
  const navigation = useNavigation<PlacesSearchScreenNavigationProp>();
  const { fieldType, isDomestic, initialValue = '' } = route.params;

  // Get store setters to save data directly
  const { setFrom, setTo, setSelectedFrom, setSelectedTo } = useSearchFormStore();

  const [query, setQuery] = useState(initialValue);
  const [searchQuery, setSearchQuery] = useState(''); // Query to actually search with

  const {
    data: places = [],
    isLoading,
    isFetching,
  } = usePlaces(searchQuery, isDomestic, searchQuery.length >= 2);

  const handleSearch = () => {
    if (query.trim().length >= 2) {
      setSearchQuery(query.trim());
    }
  };

  const handleSelectPlace = (place: PlaceResultItemData) => {
    // Store the selected place directly in Zustand store
    const placeValue = place.address || place.name || '';
    
    if (fieldType === 'from') {
      setFrom(placeValue);
      setSelectedFrom(place);
    } else if (fieldType === 'to') {
      setTo(placeValue);
      setSelectedTo(place);
    }
    
    // Navigate back to SearchScreen
    navigation.goBack();
  };

  const renderPlaceItem = ({ item }: { item: PlaceResultItemData }) => (
    <Card style={styles.resultCard} padding={0}>
      <PlaceResultItem place={item} onPress={() => handleSelectPlace(item)} />
    </Card>
  );

  const renderEmptyState = () => {
    if (isLoading || isFetching) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.primaryTeal} />
          <Text style={styles.emptyText}>Searching places...</Text>
        </View>
      );
    }

    if (searchQuery.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <MapPin size={64} color={Colors.textLight} />
          <Text style={styles.emptyTitle}>Search for places</Text>
          <Text style={styles.emptyDescription}>
            Type at least 2 characters and press Enter to search
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <MapPin size={64} color={Colors.textLight} />
        <Text style={styles.emptyTitle}>No places found</Text>
        <Text style={styles.emptyDescription}>
          Try a different search term
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={fieldType === 'from' ? 'Select Origin' : 'Select Destination'}
        showBackButton
      />

      <View style={styles.searchContainer}>
        <SearchInput
          icon={MapPin}
          placeholder={fieldType === 'from' ? 'Search origin...' : 'Search destination...'}
          value={query}
          onChangeText={setQuery}
          autoFocus
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
      </View>

      {places.length > 0 ? (
        <FlatList
          data={places}
          renderItem={renderPlaceItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
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
    backgroundColor: Colors.backgroundLight,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  resultCard: {
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: Fonts.xl,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginTop: 24,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: Fonts.base,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: Fonts.base,
    color: Colors.textTertiary,
    marginTop: 16,
  },
});

export default PlacesSearchScreen;
