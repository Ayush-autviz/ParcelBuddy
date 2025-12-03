import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RefreshCw, User, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, Card, GradientButton, SectionCard, SearchInput } from '../../components';
import { SearchStackParamList } from '../../navigation/SearchNavigator';
import { ExtendedTrackStackParamList } from '../../navigation/TrackNavigator';
import { SvgXml } from 'react-native-svg';
import { MapPinIcon, TimeIcon, WeightIcon } from '../../assets/icons/svg/main';
import { useToast } from '../../components/Toast';
import { useLuggageRequestDetail, useCancelLuggageRequest } from '../../hooks/useLuggage';
import { ActivityIndicator } from 'react-native';
import { Package } from 'lucide-react-native';
import { useQueryClient } from '@tanstack/react-query';

// Support both Search and Track navigators
type BookingRequestDetailParams = {
  BookingRequestDetail: {
    requestId?: string; // New: request ID to fetch
    bookingRequest?: any; // Keep for backward compatibility
    ride?: any; // Keep for backward compatibility
  };
};

type BookingRequestDetailScreenRouteProp = RouteProp<BookingRequestDetailParams, 'BookingRequestDetail'>;
// Use any for navigation to allow navigating to other screens in different navigators
type BookingRequestDetailScreenNavigationProp = any;

const BookingRequestDetailScreen: React.FC = () => {
  const route = useRoute<BookingRequestDetailScreenRouteProp>();
  const navigation = useNavigation<BookingRequestDetailScreenNavigationProp>();
  const { requestId, bookingRequest: paramBookingRequest, ride: paramRide } = route.params;
  const { showWarning, showSuccess, showError } = useToast();
  const queryClient = useQueryClient();

  // Get the actual request ID
  const actualRequestId = requestId || paramBookingRequest?.id;

  // Fetch luggage request detail by ID if requestId is provided
  const { 
    data: luggageRequestDetail, 
    isLoading, 
    isError,
    error,
    refetch: refetchRequestDetail
  } = useLuggageRequestDetail(actualRequestId);

  console.log('luggageRequestDetail booking request detail screen', luggageRequestDetail);

  // Cancel luggage request mutation
  const cancelRequestMutation = useCancelLuggageRequest();

  // Use fetched data if available, otherwise fall back to params
  const bookingRequest = luggageRequestDetail || paramBookingRequest;
  const ride = luggageRequestDetail?.ride || paramRide;


  // Format date: "2025-11-28" -> "Tue, 23 Apr"
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Invalid Date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const dayNum = date.getDate();
    return `${day}, ${dayNum} ${month}`;
  };

  // Format time: "18:00:00" -> "06:00 PM"
  const formatTime = (timeString: string | null): string => {
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

  // Get response deadline
  const getResponseDeadline = (): string => {
    const now = new Date();
    const hours = now.getHours();
    if (hours < 16) {
      return '4:00 today';
    }
    return '4:00 tomorrow';
  };

  const handleCancelRequest = () => {

    if (!actualRequestId) {
      showError('Request ID not available');
      return;
    }

    // Show confirmation before canceling
    // For now, directly cancel. You can add a confirmation modal if needed
    cancelRequestMutation.mutate(actualRequestId, {
      onSuccess: () => {
        showSuccess('Request cancelled successfully');
        // Invalidate and refetch relevant queries
        queryClient.invalidateQueries({ queryKey: ['luggageRequestDetail', actualRequestId] });
        queryClient.invalidateQueries({ queryKey: ['bookedRides'] });
        queryClient.invalidateQueries({ queryKey: ['luggageRequests'] });
        // Refetch the current request detail to update the UI
        refetchRequestDetail();
        // Navigate back after a short delay
        setTimeout(() => {
          navigation.goBack();
        }, 1500);
      },
      onError: (error: any) => {
        console.error('Cancel request error:', error?.response?.data?.error);
        showError(error?.response?.data?.error || error?.message || 'Failed to cancel request. Please try again.');
      },
    });
  };

  const handleTravelerPress = () => {
    // Try multiple sources for traveler data
    const travelerData = ride?.traveler || bookingRequest?.ride?.traveler || bookingRequest?.traveler;
    
    if (travelerData) {
      console.log('Navigating to UserProfile with traveler:', travelerData);
      navigation.navigate('UserProfile', {
        traveler: travelerData,
      });
    } else {
      console.warn('No traveler data available for navigation');
      showWarning('Traveler information not available');
    }
  };

  // Extract data from booking request (new API structure)
  const weight = bookingRequest?.weight_kg ? String(bookingRequest.weight_kg) : '';
  const height = bookingRequest?.height_cm ? String(bookingRequest.height_cm) : '';
  const width = bookingRequest?.width_cm ? String(bookingRequest.width_cm) : '';
  const length = bookingRequest?.length_cm ? String(bookingRequest.length_cm) : '';
  const itemDescription = bookingRequest?.item_description || '';
  const specialInstructions = bookingRequest?.special_instructions || '';
  
  // Handle luggage_photo (new API) or luggage_photos (old API)
  const luggagePhotos = bookingRequest?.luggage_photo 
    ? bookingRequest.luggage_photo.map((photo: any) => ({
        url: photo.luggage_image,
        uri: photo.luggage_image,
      }))
    : bookingRequest?.luggage_photos || [];
  const itemCount = luggagePhotos.length || 1; // Default to 1 if no photos

  // Get ride data - new API uses 'ride', old API uses 'ride_info'
  const rideData = ride || bookingRequest?.ride || bookingRequest?.ride_info || {};
  const travelDate = rideData?.travel_date || '';
  const travelTime = rideData?.travel_time || null;
  const origin = rideData?.origin_name || rideData?.origin || 'Unknown Origin';
  const destination = rideData?.destination_name || rideData?.destination || 'Unknown Destination';
  const destinationTime = rideData?.destination_time || null;
  const traveler = rideData?.traveler || bookingRequest?.traveler;
  const travelerName = traveler 
    ? `${traveler.first_name || ''} ${traveler.last_name || ''}`.trim() 
    : 'Unknown Traveler';
  const travelerProfilePhoto = traveler?.profile?.profile_photo;

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Booking Detail" showBackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primaryCyan} />
          <Text style={styles.loadingText}>Loading booking details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Booking Detail" showBackButton />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load booking details</Text>
          <Text style={styles.errorSubText}>{error?.message || 'Please try again'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Booking Detail" showBackButton />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}

        {luggageRequestDetail?.status === 'pending' && (
        <Card style={styles.statusCard} padding={16}>
          <View style={styles.statusContent}>
            <View style={styles.iconContainer}>
            <SvgXml xml={TimeIcon} height={24} width={24} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.statusMessage}>
                Your Booking is awaiting the traveller's approval.
              </Text>
              <Text style={styles.statusSubMessage}>
                The traveller will respond soon.
              </Text>
            </View>
          </View>
        </Card>
        )}

        {/* Date Card */}
        {travelDate && (
          <View style={styles.dateCard}>
            <Text style={styles.dateText}>{formatDate(travelDate)}</Text>
          </View>
        )}

        {/* Location Details Card */}
        <Card style={styles.locationCard} padding={20}>
          {/* Pickup */}
          <View style={[styles.locationRow, { marginBottom: 20 }]}>
            <View style={styles.locationLeft}>
              <View style={styles.iconWrapper}>
                <SvgXml xml={MapPinIcon} height={16} width={16} />
              </View>
              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>Pickup</Text>
                <Text style={styles.locationAddress}>{origin}</Text>
              </View>
            </View>
            {travelTime && (
              <Text style={styles.timeText}>{formatTime(travelTime)}</Text>
            )}
          </View>

          {/* Destination */}
          <View style={styles.locationRow}>
            <View style={styles.locationLeft}>
              <View style={styles.iconWrapper}>
                <SvgXml xml={MapPinIcon} height={16} width={16} />
              </View>
              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>Destination</Text>
                <Text style={styles.locationAddress}>{destination}</Text>
              </View>
            </View>
            {destinationTime && (
              <Text style={styles.timeText}>{formatTime(destinationTime)}</Text>
            )}
          </View>
        </Card>

        {/* Recipient/Traveller Card */}
        {traveler && (
          <View style={styles.travelerCard}>
            <TouchableOpacity
              style={styles.travelerRow}
              onPress={handleTravelerPress}
              activeOpacity={0.7}
            >
              <View style={styles.travelerLeft}>
                {travelerProfilePhoto ? (
                  <Image
                    source={{ uri: travelerProfilePhoto }}
                    style={styles.travelerAvatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <User size={20} color={Colors.primaryCyan} />
                  </View>
                )}
                <View style={styles.travelerInfo}>
                  <Text style={styles.travelerName}>{travelerName}</Text>
                  {/* <Text style={styles.itemCount}>({itemCount} {itemCount === 1 ? 'Item' : 'Items'})</Text> */}
                </View>
              </View>
              <ChevronRight size={20} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Luggage Details Section */}
        <SectionCard title="Luggage">
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Maximum Weight (kg)</Text>
            <SearchInput
              icon={WeightIcon}
              placeholder="Enter max weight"
              value={weight}
              editable={false}
              containerStyle={styles.input}
            />
          </View>
          <View style={styles.dimensionsRow}>
            <View style={styles.dimensionItem}>
              <Text style={styles.label}>Height (cm)</Text>
              <SearchInput
                lucideIcon={Package}
                placeholder="eg: 10"
                inputStyle={{fontSize: Fonts.sm}}
                value={height || ''}
                editable={false}
                containerStyle={styles.input}
              />
            </View>
            <View style={styles.dimensionItem}>
              <Text style={styles.label}>Width (cm)</Text>
              <SearchInput
                lucideIcon={Package}
                placeholder="eg: 10"
                inputStyle={{fontSize: Fonts.sm}}
                value={width || ''}
                editable={false}
                containerStyle={styles.input}
              />
            </View>
            <View style={styles.dimensionItem}>
              <Text style={styles.label}>Length (cm)</Text>
              <SearchInput
                lucideIcon={Package}
                placeholder="eg: 10"
                inputStyle={{fontSize: Fonts.sm}}
                value={length || ''}
                editable={false}
                containerStyle={styles.input}
              />
            </View>
          </View>
        </SectionCard>

        {/* Images Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Images</Text>
          <View style={styles.imagesGrid}>
            {luggagePhotos.length > 0 && (
              luggagePhotos.slice(0, 3).map((photo: any, index: number) => (
                <View key={index} style={styles.imageCard}>
                  {photo.url || photo.uri ? (
                    <Image
                      source={{ uri: photo.url || photo.uri }}
                      style={styles.image}
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Text style={styles.imagePlaceholderText}>Image {index + 1}</Text>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        </View>

        {/* Notes Section */}
        {itemDescription && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>
                {itemDescription}
              </Text>
            </View>
          </View>
        )}

        {specialInstructions && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Instructions</Text>
            <View style={styles.notesCard}>
              <Text style={styles.notesText}>
                {specialInstructions}
              </Text>
            </View>
          </View>
        )}

        {/* Cancel Request Button */}
        <GradientButton
          title="Cancel Request"
          onPress={handleCancelRequest}
          style={styles.cancelButton}
          disabled={cancelRequestMutation.isPending}
          loading={cancelRequestMutation.isPending}
        />
        {/* <Text style={styles.cancelNote}>
          (Allowed for 15 minutes only)
        </Text> */}
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  statusCard: {
    marginBottom: 16,
    backgroundColor: Colors.backgroundWhite,
    borderWidth: 1,
    borderColor: Colors.primaryCyan + '30',
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  statusMessage: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 4,
    lineHeight: 20,
  },
  statusSubMessage: {
    fontSize: Fonts.sm,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  dateCard: {
    marginBottom: 16,
    backgroundColor: Colors.backgroundGray,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  dateText: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightMedium,
    color: Colors.textPrimary,
  },
  locationCard: {
    marginBottom: 16,
    backgroundColor: Colors.backgroundWhite,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  locationDetails: {
    flex: 1,
  },
  locationLabel: {
    fontSize: Fonts.xs,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: Fonts.sm,
    fontWeight: Fonts.weightMedium,
    color: Colors.textPrimary,
  },
  timeText: {
    fontSize: Fonts.sm,
    fontWeight: Fonts.weightMedium,
    color: Colors.textLight,
    marginLeft: 12,
  },
  travelerCard: {
    marginBottom: 24,
    padding: 8,
    borderRadius: 12,
    backgroundColor: Colors.backgroundGray,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  travelerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  travelerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryCyan + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  travelerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundGray,
    marginRight: 12,
  },
  travelerInfo: {
    flex: 1,
  },
  travelerName: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  itemCount: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.primaryCyan,
    marginBottom: 8,
  },
  input: {
    marginBottom: 0,
    width: '100%',
  },
  dimensionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dimensionItem: {
    flex: 1,
    minWidth: 0, // Prevents flex items from overflowing
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 4,
  },
  imageCard: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.backgroundGray,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.backgroundGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: Fonts.xs,
    color: Colors.textTertiary,
  },
  notesCard: {
    backgroundColor: Colors.backgroundGray,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  notesText: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  cancelButton: {
    marginTop: 8,
    marginBottom: 8,
  },
  cancelNote: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: Fonts.base,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});

export default BookingRequestDetailScreen;

