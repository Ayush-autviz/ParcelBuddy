import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Image,
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
import { getLuggageRequests } from '../../services/api/luggage';
import { getPublishedRides } from '../../services/api/ride';
import GradientButton from '../../components/GradientButton';
import { SvgXml } from 'react-native-svg';
import { ProfileUserIcon } from '../../assets/icons/svg/profileIcon';
import { getLuggageRequestsForRide } from '../../services/api/luggage';
import { useToast } from '../../components/Toast';
import { ChevronRight } from 'lucide-react-native';
import { useCreateRating } from '../../hooks/useRating';
import { useQueryClient } from '@tanstack/react-query';
import { getPublishedRideById } from '../../services/api/ride';

type TabType = 'Booked' | 'Published';
type TrackScreenNavigationProp = StackNavigationProp<ExtendedTrackStackParamList, 'TrackList'>;

// Luggage Request data type
interface LuggageRequest {
  id: string;
  senderName: string;
  senderProfilePhoto: string | null;
  status: string;
  itemCount: number;
  sender?: {
    id: string;
    first_name?: string;
    last_name?: string;
    profile?: {
      profile_photo?: string | null;
    };
  };
  ride?: {
    traveler?: {
      id: string;
    };
  };
  // Store full request data for API calls
  fullData?: any;
}

const TrackScreen: React.FC = () => {
  const navigation = useNavigation<TrackScreenNavigationProp>();
  const { showError, showSuccess } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>('Published');
  const [selectedLuggageRequest, setSelectedLuggageRequest] = useState<any | null>(null);
  const [luggageRequests, setLuggageRequests] = useState<any>([]);
  const [isLoadingLuggageRequests, setIsLoadingLuggageRequests] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  
  // Pagination state for booked rides
  const [allBookedRides, setAllBookedRides] = useState<BookedRideCardData[]>([]);
  const [nextPageUrlBooked, setNextPageUrlBooked] = useState<string | null>(null);
  const [isLoadingMoreBooked, setIsLoadingMoreBooked] = useState(false);
  
  // Pagination state for published rides
  const [allPublishedRides, setAllPublishedRides] = useState<RideCardData[]>([]);
  const [nextPageUrlPublished, setNextPageUrlPublished] = useState<string | null>(null);
  const [isLoadingMorePublished, setIsLoadingMorePublished] = useState(false);
  
  // Rating mutation
  const createRatingMutation = useCreateRating();
  
  // Define snap points for bottom sheet - larger for rating screen
  const snapPoints = useMemo(() => ['50%', '75%'], []);

  // Fetch published rides from API
  const { 
    data: publishedRidesData, 
    isLoading: isLoadingPublished, 
    isFetching: isFetchingPublished, 
    isError: isErrorPublished, 
    refetch: refetchPublished, 
    failureReason: failureReasonPublished 
  } = usePublishedRides();

  // Fetch booked rides (luggage requests) from API
  const { 
    data: bookedRidesData , 
    isLoading: isLoadingBooked, 
    isFetching: isFetchingBooked, 
    isError: isErrorBooked, 
    refetch: refetchBooked, 
    failureReason: failureReasonBooked 
  } = useBookedRides();

  // Update all booked rides and pagination when data changes or tab switches
  useEffect(() => {
    if (activeTab === 'Booked' && bookedRidesData?.rides) {
      // Reset and set initial data when switching to Booked tab
      setAllBookedRides(bookedRidesData.rides);
      setNextPageUrlBooked(bookedRidesData.pagination?.next_page || null);
    } else if (activeTab === 'Published' && publishedRidesData?.rides) {
      // Reset and set initial data when switching to Published tab
      setAllPublishedRides(publishedRidesData.rides);
      setNextPageUrlPublished(publishedRidesData.pagination?.next_page || null);
    }
  }, [activeTab, bookedRidesData, publishedRidesData]);

  const handleLoadMoreBooked = async () => {
    if (!nextPageUrlBooked || isLoadingMoreBooked) return;

    setIsLoadingMoreBooked(true);
    try {
      const response = await getLuggageRequests(nextPageUrlBooked);
      
      const hasPagination = response?.pagination && response?.results;
      const requestsArray = hasPagination 
        ? response.results 
        : (Array.isArray(response) ? response : (response?.data || response?.results || []));
      
      if (Array.isArray(requestsArray)) {
        // Format the new rides using the same logic as useBookedRides
        const formatDate = (dateString: string): string => {
          if (!dateString) return 'Invalid Date';
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return 'Invalid Date';
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const month = months[date.getMonth()];
          const day = date.getDate().toString().padStart(2, '0');
          return `${month} ${day}`;
        };

        const formatTime = (timeString: string | null | undefined): string => {
          if (!timeString) return '12:00 AM';
          const timeParts = timeString.split(':');
          const hours = timeParts[0] || '0';
          const minutes = timeParts[1] || '0';
          const hour = parseInt(hours, 10);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour % 12 || 12;
          const displayMinutes = minutes.padStart(2, '0');
          return `${displayHour}:${displayMinutes} ${ampm}`;
        };

        const newRides = requestsArray
          .filter((request: any) => request.status !== 'cancelled')
          .map((request: any) => ({
            id: request.id,
            status: request.status,
            date: formatDate(request.ride_info?.travel_date || ''),
            origin: request.ride_info?.origin || request.ride_info?.origin_name || 'Unknown Origin',
            originTime: formatTime(request.travel_time || request.ride_info?.travel_time),
            destination: request.ride_info?.destination || request.ride_info?.destination_name || 'Unknown Destination',
            destinationTime: formatTime(request.destination_time || request.ride_info?.destination_time),
            passengers: 0,
            showRateButton: request.ride_info?.ride_status === 'completed',
            bookingRequest: request,
          } as BookedRideCardData));

        setAllBookedRides(prev => [...prev, ...newRides]);
        setNextPageUrlBooked(hasPagination ? response.pagination.next_page : null);
      }
    } catch (error: any) {
      console.error('Error loading more booked rides:', error);
      showError(error?.response?.data?.message || error?.message || 'Failed to load more rides');
    } finally {
      setIsLoadingMoreBooked(false);
    }
  };

  const handleLoadMorePublished = async () => {
    if (!nextPageUrlPublished || isLoadingMorePublished) return;

    setIsLoadingMorePublished(true);
    try {
      const response = await getPublishedRides(nextPageUrlPublished);
      
      const hasPagination = response?.pagination && response?.results;
      const ridesArray = hasPagination 
        ? response.results 
        : (Array.isArray(response) ? response : (response?.data || response?.results || []));
      
      if (Array.isArray(ridesArray)) {
        // Format the new rides using the same logic as usePublishedRides
        const formatDate = (dateString: string): string => {
          if (!dateString) return 'Invalid Date';
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return 'Invalid Date';
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const month = months[date.getMonth()];
          const day = date.getDate().toString().padStart(2, '0');
          return `${month} ${day}`;
        };

        const formatTime = (timeString: string | null | undefined): string => {
          if (!timeString) return '12:00 AM';
          const timeParts = timeString.split(':');
          const hours = timeParts[0] || '0';
          const minutes = timeParts[1] || '0';
          const hour = parseInt(hours, 10);
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour % 12 || 12;
          const displayMinutes = minutes.padStart(2, '0');
          return `${displayHour}:${displayMinutes} ${ampm}`;
        };

        const newRides = ridesArray.map((ride: any) => ({
          id: ride.id || '',
          status: ride.status,
          date: formatDate(ride.travel_date),
          origin: ride.origin_name || 'Unknown Origin',
          originTime: formatTime(ride.travel_time),
          destination: ride.destination_name || 'Unknown Destination',
          destinationTime: formatTime(ride.destination_time),
          passengers: 0,
          showRateButton: ride.status === 'completed',
        } as RideCardData));

        setAllPublishedRides(prev => [...prev, ...newRides]);
        setNextPageUrlPublished(hasPagination ? response.pagination.next_page : null);
      }
    } catch (error: any) {
      console.error('Error loading more published rides:', error);
      showError(error?.response?.data?.message || error?.message || 'Failed to load more rides');
    } finally {
      setIsLoadingMorePublished(false);
    }
  };

  const rides = activeTab === 'Booked' ? allBookedRides : allPublishedRides;
  const nextPageUrl = activeTab === 'Booked' ? nextPageUrlBooked : nextPageUrlPublished;
  const isLoadingMore = activeTab === 'Booked' ? isLoadingMoreBooked : isLoadingMorePublished;
  const handleLoadMore = activeTab === 'Booked' ? handleLoadMoreBooked : handleLoadMorePublished;
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

  const handleRatePress = async (ride: RideCardData | BookedRideCardData) => {
    console.log('Rate pressed:', ride);

    setSelectedLuggageRequest(null);
    setRating(0);
    setFeedback('');
    setIsLoadingLuggageRequests(true);
    
    try {
      if (activeTab === 'Booked') {
        // For booked rides, rate the traveler
        const bookedRide = ride as BookedRideCardData;
        const bookingRequest = bookedRide.bookingRequest;
        
        if (!bookingRequest || !bookingRequest.ride_info) {
          showError('Ride information not found');
          setIsLoadingLuggageRequests(false);
          return;
        }

        // Try to get traveler from multiple sources
        let traveler = bookingRequest.ride_info?.traveler || bookingRequest.traveler;
        
        // If traveler not found in booking request, fetch ride details
        if (!traveler && bookingRequest.ride_info.id) {
          try {
            const rideDetails = await getPublishedRideById(bookingRequest.ride_info.id);
            traveler = rideDetails?.traveler;
          } catch (error) {
            console.error('Error fetching ride details:', error);
          }
        }

        if (!traveler) {
          showError('Traveler information not found');
          setIsLoadingLuggageRequests(false);
          return;
        }

        const firstName = traveler?.first_name || '';
        const lastName = traveler?.last_name || '';
        const travelerName = `${firstName} ${lastName}`.trim() || 'Unknown';
        const travelerProfilePhoto = traveler?.profile?.profile_photo || null;

        // Handle luggage_photo array (could be luggage_photo or luggage_photos)
        const luggagePhotos = bookingRequest.luggage_photo || bookingRequest.luggage_photos || [];
        const itemCount = Array.isArray(luggagePhotos) ? luggagePhotos.length : 1;

        // Create a LuggageRequest-like object for the traveler
        const travelerRequest: LuggageRequest = {
          id: bookingRequest.id,
          senderName: travelerName,
          senderProfilePhoto: travelerProfilePhoto,
          status: bookingRequest.status || 'approved',
          itemCount: itemCount,
          sender: {
            id: traveler.id,
            first_name: traveler.first_name,
            last_name: traveler.last_name,
            profile: {
              profile_photo: travelerProfilePhoto,
            },
          },
          ride: bookingRequest.ride_info,
          fullData: bookingRequest, // Store full booking request data for API calls
        };

        // For booked rides, directly show the rating screen (skip selection)
        setLuggageRequests([travelerRequest]);
        setSelectedLuggageRequest(travelerRequest);
        setSelectedRideId(bookingRequest.id);
        bottomSheetModalRef.current?.present();
        // Snap to rating screen directly
        setTimeout(() => {
          bottomSheetModalRef.current?.snapToIndex(1);
        }, 100);
      } else {
        // For published rides, show list of senders to rate
        setSelectedRideId(ride.id);
        const response = await getLuggageRequestsForRide(ride.id);
        console.log('Luggage requests response hehehehe:', response);
        
        let allRequests: LuggageRequest[] = [];
        if (response && response.luggageRequests && Array.isArray(response.luggageRequests)) {
          allRequests = response.luggageRequests;
          console.log('allRequests', allRequests);  console.log('allRequests', allRequests);
        } else if (Array.isArray(response)) {
          allRequests = response;
        }
        
        // Filter to show only approved requests and map to include full data
        const approvedRequests = allRequests
          .filter((request) => request.status?.toLowerCase() === 'approved')
          .map((request: any) => {
            const firstName = request.sender?.first_name || '';
            const lastName = request.sender?.last_name || '';
            const senderName = `${firstName} ${lastName}`.trim() || 'Unknown';
            const senderProfilePhoto = request.sender?.profile?.profile_photo || null;
            
            return {
              id: request.id,
              senderName,
              senderProfilePhoto,
              status: request.status,
              itemCount: request.luggage_photo?.length || 1,
              sender: request.sender,
              ride: request.ride,
              fullData: request, // Store full request data for API calls
            };
          });
        
        setLuggageRequests(approvedRequests);
        bottomSheetModalRef.current?.present();
      }
    } catch (error: any) {
      console.error('Error fetching data for rating:', error);
      showError(error?.response?.data?.message || error?.message || 'Failed to load data');
    } finally {
      setIsLoadingLuggageRequests(false);
    }
  };

  const handleLuggageRequestSelect = (request: LuggageRequest) => {
    setSelectedLuggageRequest(request);
    setRating(0);
    setFeedback('');
    // Snap to higher point for rating screen
    bottomSheetModalRef.current?.snapToIndex(1);
  };

  const handleSubmitRating = () => {
    if (!selectedLuggageRequest || rating <= 0) {
      showError('Please select a rating');
      return;
    }

    // Determine rating type based on active tab
    const ratingType = activeTab === 'Published' ? 'sender' : 'traveler';
    
    // Get the user ID to rate
    let ratedToId: string | undefined;
    if (ratingType === 'traveler') {
      // For published rides, rate the sender
      ratedToId = selectedLuggageRequest.sender?.id || selectedLuggageRequest.fullData?.sender?.id;
    } else {
      // For booked rides, sender is rating the traveler
      // For booked rides, we stored traveler info in the sender field
      ratedToId = selectedLuggageRequest.sender?.id || selectedLuggageRequest.fullData?.ride_info?.traveler?.id;
    }

    if (!ratedToId) {
      showError('Unable to find user to rate. Please try again.');
      return;
    }

    const luggageRequestId = selectedLuggageRequest.id || selectedLuggageRequest.fullData?.id;
    if (!luggageRequestId) {
      showError('Luggage request ID is missing');
      return;
    }

    // Submit rating
    createRatingMutation.mutate(
      {
        rating_type: ratingType,
        rated_to: ratedToId,
        luggage_request: luggageRequestId,
        rating: rating,
        review: feedback || '',
      },
      {
        onSuccess: (response: any) => {
          console.log('Rating submitted successfully!', response);
          showSuccess('Rating submitted successfully!');
          bottomSheetModalRef.current?.dismiss();
          setSelectedLuggageRequest(null);
          setRating(0);
          setFeedback('');
          setLuggageRequests([]);
          setSelectedRideId(null);
          
          // Invalidate queries to refresh data
          queryClient.invalidateQueries({ queryKey: ['publishedRides'] });
          queryClient.invalidateQueries({ queryKey: ['bookedRides'] });
          queryClient.invalidateQueries({ queryKey: ['ride-ratings'] });
        },
        onError: (error: any) => {
          console.error('Submit rating error:', error.response.data.error);
          showError(error?.response?.data?.error || 'Failed to submit rating. Please try again.');
        },
      }
    );
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

  const renderRideCard = ({ item }: { item: RideCardData | BookedRideCardData }) => (
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
        <>
          <FlatList
            data={rides}
            renderItem={renderRideCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshing={isFetching}
            onRefresh={refetch}
            ListFooterComponent={
              nextPageUrl ? (
                <View style={styles.loadMoreContainer}>
                  <GradientButton
                    title="View More"
                    onPress={handleLoadMore}
                    style={styles.loadMoreButton}
                    loading={isLoadingMore}
                    disabled={isLoadingMore}
                  />
                </View>
              ) : null
            }
          />
        </>
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
          {!selectedLuggageRequest ? (
            // Luggage Request Selection Screen
            <>
              <Text style={styles.bottomSheetTitle}>Select profile to rate</Text>
              {isLoadingLuggageRequests ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={Colors.primaryCyan} />
                  <Text style={styles.loadingText}>Loading luggage requests...</Text>
                </View>
              ) : luggageRequests.length === 0 ? (
                <View style={styles.emptyLuggageContainer}>
                  <Text style={styles.emptyText}>No luggage requests found</Text>
                </View>
              ) : (
                <FlatList
                  data={luggageRequests}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.profileItem}
                      onPress={() => handleLuggageRequestSelect(item)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.profileIconContainer}>
                        {item.senderProfilePhoto ? (
                          <Image source={{ uri: item.senderProfilePhoto }} style={styles.profileAvatar} />
                        ) : (
                          <SvgXml xml={ProfileUserIcon} height={24} width={24} />
                        )}
                      </View>
                      <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{item.sender?.first_name} {item.sender?.last_name}</Text>
                      </View>
                      <ChevronRight size={20} color={Colors.textTertiary} />
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.profileList}
                />
              )}
            </>
          ) : (
            // Rating Screen
            <>
              {activeTab === 'Published' && (
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    setSelectedLuggageRequest(null);
                    bottomSheetModalRef.current?.snapToIndex(0);
                  }}
                >
                  <ArrowLeft size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
              )}
              {activeTab === 'Booked' ? (
                <>
                  <Text style={styles.ratingTitle}>
                    Rate your traveller
                  </Text>
                  <Text style={styles.ratingSubtitle}>How was your experience with this ride?</Text>
                </>
              ) : (
                <Text style={styles.ratingTitle}>How was your experience with</Text>
              )}
              {activeTab === 'Published' && (
                <View style={styles.ratingProfileContainer}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={styles.ratingProfileIcon}>
                    {selectedLuggageRequest.senderProfilePhoto ? (
                      <Image source={{ uri: selectedLuggageRequest.senderProfilePhoto }} style={styles.ratingProfileAvatar} />
                    ) : (
                      <SvgXml xml={ProfileUserIcon} height={24} width={24} />
                    )}
                  </View>
                  <Text style={styles.ratingProfileName}>{selectedLuggageRequest.sender?.first_name} {selectedLuggageRequest.sender?.last_name}</Text>
                </View>
                </View>
              )}
              
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    activeOpacity={0.7}
                  >
                    <Star
                      size={24}
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
                loading={createRatingMutation.isPending}
                disabled={createRatingMutation.isPending || rating <= 0}
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
  emptyText: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  emptyLuggageContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: Fonts.lg,
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
    overflow: 'hidden',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightMedium,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  // Rating Screen Styles
  ratingTitle: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  ratingSubtitle: {
    fontSize: Fonts.base,
    color: Colors.textTertiary,
    marginBottom: 16,
  },
  ratingProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    overflow: 'hidden',
  },
  ratingProfileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  ratingProfileName: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    // marginBottom: 24,
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
    marginTop: 10
  },
  submitButton: {
    width: '100%',
    alignSelf: 'flex-end',
  },
  loadMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreButton: {
    width: '50%',
    alignSelf: 'center',
  },
});

export default TrackScreen;
