import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, TabButton, RideCard, RideCardData } from '../../components';
import { TrackStackParamList } from '../../navigation/TrackNavigator';

type TabType = 'Booked' | 'Published';
type TrackScreenNavigationProp = StackNavigationProp<TrackStackParamList, 'TrackList'>;

const TrackScreen: React.FC = () => {
  const navigation = useNavigation<TrackScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('Published');

  // Mock ride data
  const bookedRides: RideCardData[] = [];
  
  const publishedRides: RideCardData[] = [
    {
      id: '1',
      status: 'new',
      date: 'Oct 03',
      origin: 'New York, NY',
      originTime: '3:30 PM',
      destination: 'Boston, MA',
      destinationTime: '7:30 PM',
      passengers: 4,
    },
    {
      id: '2',
      status: 'full',
      date: 'Nov 10',
      origin: 'New York, NY',
      originTime: '4:00 PM',
      destination: 'Boston, MA',
      destinationTime: '6:00 PM',
      passengers: 3,
    },
    {
      id: '3',
      status: 'completed',
      date: 'Sep 28',
      origin: 'New York, NY',
      originTime: '2:00 PM',
      destination: 'Boston, MA',
      destinationTime: '5:30 PM',
      passengers: 4,
      showRateButton: true,
    },
  ];

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
          <Text style={styles.emptyText}>No {activeTab.toLowerCase()} rides yet</Text>
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
  },
  emptyText: {
    fontSize: Fonts.lg,
    color: Colors.textTertiary,
    fontWeight: Fonts.weightMedium,
  },
});

export default TrackScreen;
