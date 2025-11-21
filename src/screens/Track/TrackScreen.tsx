import React, { useState, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, ArrowLeft } from 'lucide-react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView, BottomSheetModal } from '@gorhom/bottom-sheet';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, TabButton, RideCard, RideCardData, EmptyStateCard } from '../../components';
import { ExtendedTrackStackParamList } from '../../navigation/TrackNavigator';
import { usePublishedRides } from '../../hooks/useRides';
import { useBookedRides, BookedRideCardData } from '../../hooks/useLuggage';
import GradientButton from '../../components/GradientButton';
import { SvgXml } from 'react-native-svg';
import { ProfileUserIcon } from '../../assets/icons/svg/profileIcon';

type TabType = 'Booked' | 'Published';
type TrackScreenNavigationProp = StackNavigationProp<ExtendedTrackStackParamList, 'TrackList'>;

// Profile data type
interface Profile {
  id: string;
  name: string;
}

const profiles: Profile[] = [
  { id: '1', name: 'Liam Carter' },
  { id: '2', name: 'Sophia Bennete' },
  { id: '3', name: 'Ethan Harper' },
  { id: '4', name: 'Olivia Reed' },
];

const TrackScreen: React.FC = () => {
  const navigation = useNavigation<TrackScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('Published');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  
  // Define snap points for bottom sheet - larger for rating screen
  const snapPoints = useMemo(() => ['50%', '75%'], []);

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

  console.log('bookedRides', bookedRides);
  console.log('publishedRides', publishedRides);


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
      status: ride.status,
    });
  };

  const handleRatePress = (ride: RideCardData) => {
    console.log('Rate pressed:', ride);
    setSelectedProfile(null);
    setRating(0);
    setFeedback('');
    bottomSheetModalRef.current?.present();
  };

  const handleProfileSelect = (profile: Profile) => {
    setSelectedProfile(profile);
    setRating(0);
    setFeedback('');
    // Snap to higher point for rating screen
    bottomSheetModalRef.current?.snapToIndex(1);
  };

  const handleSubmitRating = () => {
    if (selectedProfile && rating > 0) {
      console.log('Submit rating:', {
        profile: selectedProfile.name,
        rating,
        feedback,
      });
      // Add your rating submission logic here
      bottomSheetModalRef.current?.dismiss();
      setSelectedProfile(null);
      setRating(0);
      setFeedback('');
    }
  };

  // Render backdrop for bottom sheet
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

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

      {/* Bottom Sheet Modal */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
        index={0}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          {!selectedProfile ? (
            // Profile Selection Screen
            <>
              <Text style={styles.bottomSheetTitle}>Select profile to rate</Text>
              <View style={styles.profileList}>
                {profiles.map((profile) => (
                  <TouchableOpacity
                    key={profile.id}
                    style={styles.profileItem}
                    onPress={() => handleProfileSelect(profile)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.profileIconContainer}>
                      <SvgXml xml={ProfileUserIcon} height={24} width={24} />
                    </View>
                    <Text style={styles.profileName}>{profile.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            // Rating Screen
            <>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  setSelectedProfile(null);
                  bottomSheetModalRef.current?.snapToIndex(0);
                }}
              >
                <ArrowLeft size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.ratingTitle}>How was your experience with</Text>
              <View style={styles.ratingProfileContainer}>
                <View style={styles.ratingProfileIcon}>
                  <SvgXml xml={ProfileUserIcon} height={32} width={32} />
                </View>
                <Text style={styles.ratingProfileName}>{selectedProfile.name}</Text>
              </View>
              
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    activeOpacity={0.7}
                  >
                    <Star
                      size={32}
                      color={star <= rating ? '#FFD700' : '#E0E0E0'}
                      fill={star <= rating ? '#FFD700' : 'transparent'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              
              <TextInput
                style={styles.feedbackInput}
                placeholder="Write your feedback..."
                placeholderTextColor={Colors.textSecondary}
                value={feedback}
                onChangeText={setFeedback}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              
              <GradientButton
                title="Submit"
                onPress={handleSubmitRating}
                style={styles.submitButton}
              />
            </>
          )}
        </BottomSheetView>
      </BottomSheetModal>
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
  // Bottom Sheet Styles
  bottomSheetBackground: {
    backgroundColor: Colors.backgroundWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetIndicator: {
    backgroundColor: Colors.borderLight,
    width: 40,
    height: 4,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    padding: 4,
  },
  bottomSheetTitle: {
    fontSize: Fonts.xl,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 24,
  },
  profileList: {
    gap: 12,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  profileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileName: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightMedium,
    color: Colors.textPrimary,
    flex: 1,
  },
  // Rating Screen Styles
  ratingTitle: {
    fontSize: Fonts.xl,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  ratingProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingProfileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ratingProfileName: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  feedbackInput: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: Fonts.base,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    minHeight: 100,
    marginBottom: 24,
  },
  submitButton: {
    width: '100%',
    alignSelf: 'flex-end',
  },
});

export default TrackScreen;
