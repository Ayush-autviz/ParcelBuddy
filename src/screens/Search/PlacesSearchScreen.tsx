import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, RouteProp, StackActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabParamList } from '../../navigation/BottomTabNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, SearchInput, PlaceResultItem, PlaceResultItemData, Card } from '../../components';
import { usePlaces } from '../../hooks/usePlaces';
import { MapPin } from 'lucide-react-native';
import { SearchStackParamList } from '../../navigation/SearchNavigator';
import { useSearchFormStore, useCreateFormStore } from '../../services/store';
import { MapPinIcon } from '../../assets/icons/svg/main';

type PlacesSearchScreenRouteProp = RouteProp<SearchStackParamList, 'PlacesSearch'>;
type PlacesSearchScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<SearchStackParamList, 'PlacesSearch'>,
  BottomTabNavigationProp<BottomTabParamList>
>;

const PlacesSearchScreen: React.FC = () => {
  const route = useRoute<PlacesSearchScreenRouteProp>();
  const navigation = useNavigation<PlacesSearchScreenNavigationProp>();
  const { fieldType, isDomestic, initialValue = '', storeType = 'search' } = route.params;

  // Get store setters based on storeType
  const searchStore = useSearchFormStore();
  const createStore = useCreateFormStore();
  
  // Determine which store to use
  const isSearchStore = storeType === 'search';

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

  const handleBackPress = () => {
    if (!isSearchStore) {
      // If coming from Create screen, navigate back to Create tab
      const parent = navigation.getParent();
      if (parent) {
        // Pop to root of SearchNavigator stack (SearchList)
        navigation.dispatch(StackActions.popToTop());
        // Navigate to Create tab
        parent.navigate('Create');
      } else {
        // Fallback: just navigate to Create
        navigation.navigate('Create');
      }
    } else {
      // Default behavior: go back in current navigator
      navigation.goBack();
    }
  };

  // Handle device back button (Android hardware back button and iOS swipe gesture)
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Only handle if it's a back action (not programmatic navigation)
      if (e.data.action.type === 'GO_BACK') {
        if (!isSearchStore) {
          // Prevent default back action
          e.preventDefault();
          // Navigate back to Create tab
          const parent = navigation.getParent();
          if (parent) {
            // Pop to root of SearchNavigator stack (SearchList)
            navigation.dispatch(StackActions.popToTop());
            // Navigate to Create tab
            parent.navigate('Create');
          } else {
            // Fallback: just navigate to Create
            navigation.navigate('Create');
          }
        }
        // If isSearchStore, allow default behavior (navigation.goBack())
      }
    });

    return unsubscribe;
  }, [navigation, isSearchStore]);

  const handleSelectPlace = (place: PlaceResultItemData) => {
    // Store the selected place directly in the appropriate Zustand store
    const placeValue = place.address || place.name || '';
    
    if (isSearchStore) {
      // Use search store
      if (fieldType === 'from') {
        searchStore.setFrom(placeValue);
        searchStore.setSelectedFrom(place);
      } else if (fieldType === 'to') {
        searchStore.setTo(placeValue);
        searchStore.setSelectedTo(place);
      }
      // Navigate back to SearchScreen (same navigator)
      navigation.goBack();
    } else {
      // Use create store
      if (fieldType === 'origin') {
        createStore.setOrigin(placeValue);
        createStore.setSelectedOrigin(place);
      } else if (fieldType === 'destination') {
        createStore.setDestination(placeValue);
        createStore.setSelectedDestination(place);
      }
      // Navigate back to CreateScreen and reset SearchNavigator stack
      // First, pop to root of SearchNavigator (SearchList), then navigate to Create tab
      const parent = navigation.getParent();
      if (parent) {
        // Pop to root of SearchNavigator stack (SearchList)
        navigation.dispatch(StackActions.popToTop());
        // Navigate to Create tab
        parent.navigate('Create');
      } else {
        // Fallback: just navigate to Create
        navigation.navigate('Create');
      }
    }
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
          <MapPin size={64} color={Colors.primaryCyan} />
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
        title={
          fieldType === 'from' || fieldType === 'origin'
            ? 'Select Origin'
            : 'Select Destination'
        }
        showBackButton
        onBackPress={handleBackPress}
      />

      <View style={styles.searchContainer}>
        <SearchInput
          // lucideIcon={MapPin}
          icon={MapPinIcon}
          placeholder={
            fieldType === 'from' || fieldType === 'origin'
              ? 'Search origin...'
              : 'Search destination...'
          }
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
