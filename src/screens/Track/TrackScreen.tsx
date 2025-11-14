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
import { TrackStackParamList } from '../../navigation/TrackNavigator';
import { usePublishedRides } from '../../hooks/useRides';

type TabType = 'Booked' | 'Published';
type TrackScreenNavigationProp = StackNavigationProp<TrackStackParamList, 'TrackList'>;

const TrackScreen: React.FC = () => {
  const navigation = useNavigation<TrackScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('Published');

  // Fetch published rides from API
  const { data: publishedRides, isLoading, isFetching, isError, refetch, failureReason } = usePublishedRides();

  console.log('publishedRides', publishedRides);
  console.log('isError', isError);
  console.log('failureReason', failureReason);

  // Mock booked rides (to be replaced with API when available)
  const bookedRides: RideCardData[] = [];

  const rides = activeTab === 'Booked' ? bookedRides : publishedRides;

  const handleRidePress = (ride: RideCardData) => {
    // Format date for display (convert from "Oct 03" to "Tue, 23 Apr" format)
    // For now, using a simple conversion - you may want to enhance this
    const formattedDate = ride.date; // You can enhance this date formatting
    
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
      ) : rides.length > 0 ? (
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
