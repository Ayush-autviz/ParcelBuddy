import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { User, ChevronRight, MessageCircle, Package } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, Card, GradientButton, SectionCard, SearchInput, ConfirmationModal } from '../../components';
import { ExtendedTrackStackParamList } from '../../navigation/TrackNavigator';
import { SvgXml } from 'react-native-svg';
import { MapPinIcon, WeightIcon } from '../../assets/icons/svg/main';
import { useToast } from '../../components/Toast';
import { useLuggageRequestDetail, useRespondToLuggageRequest } from '../../hooks/useLuggage';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateChatRoom } from '../../hooks/useChat';

type LuggageRequestDetailParams = {
  LuggageRequestDetail: {
    requestId: string;
  };
};

type LuggageRequestDetailScreenRouteProp = RouteProp<LuggageRequestDetailParams, 'LuggageRequestDetail'>;
type LuggageRequestDetailScreenNavigationProp = StackNavigationProp<ExtendedTrackStackParamList, 'LuggageRequestDetail'>;

const LuggageRequestDetailScreen: React.FC = () => {
  const route = useRoute<LuggageRequestDetailScreenRouteProp>();
  const navigation = useNavigation<LuggageRequestDetailScreenNavigationProp>();
  const { requestId } = route.params;
  const { showSuccess, showError } = useToast();
  const queryClient = useQueryClient();
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Respond to luggage request mutation
  const respondToRequestMutation = useRespondToLuggageRequest();
  
  // Create chat room mutation
  const createChatRoomMutation = useCreateChatRoom();

  // Fetch luggage request detail by ID
  const { 
    data: luggageRequestDetail, 
    isLoading, 
    isError,
    error,
    refetch: refetchRequestDetail
  } = useLuggageRequestDetail(requestId);

  console.log('luggageRequestDetail', luggageRequestDetail);


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


  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleConfirmReject = () => {
    setShowRejectModal(false);
    respondToRequestMutation.mutate(
      { requestId, status: 'rejected' },
      {
        onSuccess: () => {
          showSuccess('Luggage request rejected successfully');
          // Invalidate and refetch relevant queries
          queryClient.invalidateQueries({ queryKey: ['luggageRequestDetail', requestId] });
          queryClient.invalidateQueries({ queryKey: ['luggageRequests'] });
          queryClient.invalidateQueries({ queryKey: ['luggageRequests', luggageRequestDetail?.ride?.id] });
          // Refetch the detail to get updated status
          refetchRequestDetail();
        },
        onError: (error: any) => {
          showError(error?.response?.data?.message || error?.message || 'Failed to reject request. Please try again.');
        },
      }
    );
  };

  const handleCancelReject = () => {
    setShowRejectModal(false);
  };

  const handleChat = () => {
    if (!requestId) {
      showError('Unable to start chat. Request information is missing.');
      return;
    }

    createChatRoomMutation.mutate(
      { 
        luggage_request_id: requestId
      },
      {
        onSuccess: () => {
          showSuccess('Chat room created successfully');
          // Navigate to Chat tab via parent navigator
          const parent = navigation.getParent();
          if (parent) {
            parent.navigate('Chat');
          } else {
            // Fallback: try direct navigation
            navigation.navigate('Chat' as any);
          }
          // Invalidate chat list to refresh with new room
          queryClient.invalidateQueries({ queryKey: ['chatList'] });
        },
        onError: (error: any) => {
          showError(error?.response?.data?.message || error?.message || 'Failed to create chat room. Please try again.');
        },
      }
    );
  };

  const handleSenderPress = () => {
    // Navigate to sender profile
    const sender = luggageRequestDetail?.sender;
    if (sender) {
      const profileId = sender?.profile?.id;
      navigation.navigate('UserProfile', {
        traveler: sender,
        profileId: profileId,
      });
    }
  };

  // Extract data from luggage request
  const weight = luggageRequestDetail?.weight_kg ? String(luggageRequestDetail.weight_kg) : '';
  // Handle dimensions - can be 0, null, or undefined (show "0" if value is 0, empty string if null/undefined)
  const height = luggageRequestDetail?.height_cm !== undefined && luggageRequestDetail?.height_cm !== null 
    ? String(luggageRequestDetail.height_cm) 
    : '';
  const width = luggageRequestDetail?.width_cm !== undefined && luggageRequestDetail?.width_cm !== null 
    ? String(luggageRequestDetail.width_cm) 
    : '';
  const length = luggageRequestDetail?.length_cm !== undefined && luggageRequestDetail?.length_cm !== null 
    ? String(luggageRequestDetail.length_cm) 
    : '';
  const itemDescription = luggageRequestDetail?.item_description || '';
  const specialInstructions = luggageRequestDetail?.special_instructions || '';
  
  // Handle luggage_photo - array of objects with id and luggage_image
  const luggagePhotos = luggageRequestDetail?.luggage_photo || [];


  // Get ride data
  const rideData: any = luggageRequestDetail?.ride || {};
  const travelDate = rideData?.travel_date || '';
  const travelTime = rideData?.travel_time || null;
  const origin = rideData?.origin_name || rideData?.origin || 'Unknown Origin';
  const destination = rideData?.destination_name || rideData?.destination || 'Unknown Destination';
  const destinationTime = rideData?.destination_time || null;

  // Get sender data - sender has nested profile structure
  const sender = luggageRequestDetail?.sender;
  const senderFirstName = sender?.first_name || '';
  const senderLastName = sender?.last_name || '';
  const senderName = `${senderFirstName} ${senderLastName}`.trim() || 'Unknown Sender';
  const senderProfilePhoto = sender?.profile?.profile_photo;

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Luggage Detail" showBackButton />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primaryCyan} />
          <Text style={styles.loadingText}>Loading luggage details...</Text>
        </View>
      </SafeAreaView>
    );
  }

//   // Show error state
  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Luggage Detail" showBackButton />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load luggage details</Text>
          <Text style={styles.errorSubText}>{error?.message || 'Please try again'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Luggage Detail" showBackButton />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
            {/* {travelTime && (
              <Text style={styles.timeText}>{formatTime(travelTime)}</Text>
            )} */}
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
            {/* {destinationTime && (
              <Text style={styles.timeText}>{formatTime(destinationTime)}</Text>
            )} */}
          </View>
        </Card>

        {/* Sender Card */}
        {sender && (
          <View style={styles.senderCard}>
            <TouchableOpacity
              style={styles.senderRow}
              onPress={handleSenderPress}
              activeOpacity={0.7}
            >
              <View style={styles.senderLeft}>
                {senderProfilePhoto ? (
                  <Image source={{ uri: senderProfilePhoto }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <User size={20} color={Colors.primaryCyan} />
                  </View>
                )}
                <View style={styles.senderInfo}>
                  <Text style={styles.senderName}>{senderName}</Text>
                </View>
              </View>
              <ChevronRight size={20} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Luggage Details Section */}
        <SectionCard title="Luggage Details">
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Weight (KG)</Text>
            <SearchInput
              icon={WeightIcon}
              placeholder="Enter weight"
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
                placeholder="Height"
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
                placeholder="Width"
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
                placeholder="Length"
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
            {luggagePhotos.length > 0 ? (
              luggagePhotos.slice(0, 3).map((photo: any, index: number) => (
                <View key={photo.id || index} style={styles.imageCard}>
                  {photo.luggage_image ? (
                    <Image
                      source={{ uri: photo.luggage_image }}
                      style={styles.image}
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Package size={24} color={Colors.textTertiary} />
                    </View>
                  )}
                </View>
              ))
            ) : (
              <View style={styles.imageCard}>
                <View style={styles.imagePlaceholder}>
                  <Package size={24} color={Colors.textTertiary} />
                </View>
              </View>
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

        {/* Action Buttons */}
        {luggageRequestDetail?.status === 'pending' && (
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.declineButton,
              respondToRequestMutation.isPending && styles.buttonDisabled,
            ]}
            onPress={handleReject}
            activeOpacity={0.7}
            disabled={respondToRequestMutation.isPending}
          >
            {respondToRequestMutation.isPending ? (
              <ActivityIndicator size="small" color={Colors.primaryCyan} />
            ) : (
              <Text style={styles.declineButtonText}>Reject</Text>
            )}
          </TouchableOpacity>
          <GradientButton
            title="Chat"
            onPress={handleChat}
            style={styles.chatButton}
            icon={<MessageCircle size={20} color={Colors.textWhite} style={styles.chatIcon} />}
            disabled={respondToRequestMutation.isPending || createChatRoomMutation.isPending}
          />
        </View>
        )}
      </ScrollView>

      {/* Reject Confirmation Modal */}
      <ConfirmationModal
        visible={showRejectModal}
        title="Reject Request"
        message="Are you sure you want to reject this luggage request? This action cannot be undone."
        confirmText="Reject"
        cancelText="Cancel"
        onConfirm={handleConfirmReject}
        onCancel={handleCancelReject}
        type="destructive"
      />
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
    paddingBottom: 100,
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
    backgroundColor: Colors.backgroundGray,
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
  senderCard: {
    marginBottom: 24,
    padding: 8,
    borderRadius: 12,
    backgroundColor: Colors.backgroundGray,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  senderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  senderLeft: {
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
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: Colors.backgroundGray,
  },
  senderInfo: {
    flex: 1,
  },
  senderName: {
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
    minWidth: 0,
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
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  declineButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    backgroundColor: Colors.backgroundWhite,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineButtonText: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.primaryCyan,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  chatButton: {
    flex: 1,
    marginTop: 0,
  },
  chatIcon: {
    marginRight: 8,
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

export default LuggageRequestDetailScreen;

