import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, TabButton, RideCard, RideCardData, EmptyStateCard } from '../../components';
import { ExtendedTrackStackParamList } from '../../navigation/TrackNavigator';
import { usePublishedRides } from '../../hooks/useRides';
import { useBookedRides, BookedRideCardData } from '../../hooks/useLuggage';

type TabType = 'Booked' | 'Published';
type TrackScreenNavigationProp = StackNavigationProp<ExtendedTrackStackParamList, 'TrackList'>;

const TrackScreen: React.FC = () => {
  const navigation = useNavigation<TrackScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('Published');

  // Fetch published rides from API
  const { 
    data: publishedRides, 
    isLoading: isLoadingPublished, 
    isFetching: isFetchingPublished, 
    isError: isErrorPublished, 
    refetch: refetchPublished, 
    failureReason: failureReasonPublished 
  } = usePublishedRides();

  // Fetch booked rides (luggage requests) from API
  const { 
    data: bookedRides , 
    isLoading: isLoadingBooked, 
    isFetching: isFetchingBooked, 
    isError: isErrorBooked, 
    refetch: refetchBooked, 
    failureReason: failureReasonBooked 
  } = useBookedRides();


  const rides = activeTab === 'Booked' ? bookedRides : publishedRides;
  const isLoading = activeTab === 'Booked' ? isLoadingBooked : isLoadingPublished;
  const isFetching = activeTab === 'Booked' ? isFetchingBooked : isFetchingPublished;
  const isError = activeTab === 'Booked' ? isErrorBooked : isErrorPublished;
  const refetch = activeTab === 'Booked' ? refetchBooked : refetchPublished;

  const handleRidePress = (ride: RideCardData | BookedRideCardData) => {
    // If it's a booked ride, navigate to booking request detail screen
    if (activeTab === 'Booked' && 'bookingRequest' in ride && ride.bookingRequest) {
      const bookedRide = ride as BookedRideCardData;
      // Pass the request ID to fetch the full details
      if (bookedRide.bookingRequest?.id) {
        navigation.navigate('BookingRequestDetail', {
          requestId: bookedRide.bookingRequest.id,
        });
      }
      return;
    }
    
    // For published rides, navigate to ride detail screen
    const formattedDate = ride.date;
    navigation.navigate('RideDetail', {
      rideId: ride.id,
      date: formattedDate,
      origin: ride.origin,
      originTime: ride.originTime,
      destination: ride.destination,
      destinationTime: ride.destinationTime,
    });
  };

  const handleRatePress = (ride: RideCardData) => {
    // TODO: Implement rate functionality
    console.log('Rate pressed:', ride);
  };

  const renderRideCard = ({ item }: { item: RideCardData }) => (
    <RideCard
      ride={item}
      onPress={() => handleRidePress(item)}
      onRatePress={item.showRateButton ? () => handleRatePress(item) : undefined}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header title="My Rides" variant="centered" />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TabButton
          label="Booked"
          active={activeTab === 'Booked'}
          onPress={() => setActiveTab('Booked')}
          isFirst={true}
        />
        <TabButton
          label="Published"
          active={activeTab === 'Published'}
          onPress={() => setActiveTab('Published')}
          isLast={true}
        />
      </View>

      {/* Rides List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primaryTeal} />
          <Text style={styles.loadingText}>Loading rides...</Text>
        </View>
      ) : isError ? (
        <View style={styles.emptyContainer}>
          <EmptyStateCard
            title="Error loading rides"
            description="Failed to load your rides. Please try again."
          />
        </View>
      ) : rides && rides.length > 0 ? (
        <FlatList
          data={rides}
          renderItem={renderRideCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={isFetching}
          onRefresh={refetch}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <EmptyStateCard
            title={`No ${activeTab.toLowerCase()} rides yet`}
            description={
              activeTab === 'Published'
                ? "You haven't published any rides yet. Create your first ride to get started!"
                : "You haven't booked any rides yet."
            }
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
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gradientEnd,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Fonts.base,
    color: Colors.textTertiary,
    marginTop: 16,
  },
});

export default TrackScreen;
