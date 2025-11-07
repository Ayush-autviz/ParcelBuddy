import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import { MapPin, Edit, Trash2, Package } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Card, Header } from '../../components';
import { EmptyStateCard } from '../../components/track';
import LuggageRequestItem, { LuggageRequestItemData } from '../../components/track/LuggageRequestItem';
import { useLuggageRequestsForRide } from '../../hooks/useLuggage';

export type TrackStackParamList = {
  TrackList: undefined;
  RideDetail: {
    rideId: string;
    date: string;
    origin: string;
    originTime: string;
    destination: string;
    destinationTime: string;
  };
};

type RideDetailScreenRouteProp = RouteProp<TrackStackParamList, 'RideDetail'>;
type RideDetailScreenNavigationProp = StackNavigationProp<TrackStackParamList, 'RideDetail'>;

const RideDetailScreen: React.FC = () => {
  const route = useRoute<RideDetailScreenRouteProp>();
  const navigation = useNavigation<RideDetailScreenNavigationProp>();
  const { rideId, date, origin, originTime, destination, destinationTime } = route.params;

  // Fetch luggage requests from API
  const { data: luggageRequests = [], isLoading: isLoadingRequests, isError: isErrorRequests } = useLuggageRequestsForRide(rideId);

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit ride');
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Delete ride');
  };

  const handleRequestPress = (request: LuggageRequestItemData) => {
    // TODO: Implement request detail navigation
    console.log('Request pressed:', request);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Ride Detail" showBackButton />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ride Information Card */}
        <Card style={styles.rideCard} padding={20}>
          <Text style={styles.date}>{date}</Text>

          {/* Pickup Location */}
          <View style={styles.locationRow}>
            <View style={styles.locationLeft}>
              <View style={styles.iconContainer}>
                <MapPin size={20} color={Colors.primaryTeal} />
                <View style={styles.verticalLine} />
              </View>
              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>Pickup</Text>
                <Text style={styles.locationAddress}>{origin}</Text>
              </View>
            </View>
            <Text style={styles.time}>{originTime}</Text>
          </View>

          {/* Destination Location */}
          <View style={styles.locationRow}>
            <View style={styles.locationLeft}>
              <View style={styles.iconContainer}>
                <MapPin size={20} color={Colors.primaryTeal} />
              </View>
              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>Destination</Text>
                <Text style={styles.locationAddress}>{destination}</Text>
              </View>
            </View>
            <Text style={styles.time}>{destinationTime}</Text>
          </View>
        </Card>

        {/* Luggage Request Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Luggage Request (Incoming)</Text>
          {isLoadingRequests ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.primaryTeal} />
              <Text style={styles.loadingText}>Loading requests...</Text>
            </View>
          ) : isErrorRequests ? (
            <EmptyStateCard
              icon={Package}
              title="Error loading requests"
              description="Failed to load luggage requests. Please try again."
            />
          ) : luggageRequests.length > 0 ? (
            luggageRequests.map((request) => (
              <LuggageRequestItem
                key={request.id}
                request={request}
                onPress={() => handleRequestPress(request)}
              />
            ))
          ) : (
            <EmptyStateCard
              icon={Package}
              title="No requests yet"
              description="You'll see requests here once senders find your ride."
            />
          )}
        </View>

        {/* Manage Ride Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Manage Ride</Text>
          <View style={styles.manageButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEdit}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[Colors.gradientStart, Colors.gradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.editButtonGradient}
              >
                <Edit size={20} color={Colors.textWhite} style={styles.editIcon} />
                <Text style={styles.editButtonText}>Edit</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              activeOpacity={0.7}
            >
              <Trash2 size={20} color={Colors.textPrimary} style={styles.deleteIcon} />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingBottom: 100,
  },
  rideCard: {
    marginBottom: 24,
  },
  date: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  locationLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  verticalLine: {
    width: 2,
    height: 40,
    backgroundColor: Colors.borderLight,
    marginTop: 4,
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
    fontSize: Fonts.base,
    fontWeight: Fonts.weightMedium,
    color: Colors.textPrimary,
  },
  time: {
    fontSize: Fonts.sm,
    fontWeight: Fonts.weightMedium,
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  manageButtons: {
    flexDirection: 'row',
  },
  editButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
  },
  editButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  editIcon: {
    marginRight: 8,
  },
  editButtonText: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textWhite,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundWhite,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    paddingVertical: 14,
  },
  deleteIcon: {
    marginRight: 8,
  },
  deleteButtonText: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: Fonts.base,
    color: Colors.textTertiary,
    marginLeft: 12,
  },
});

export default RideDetailScreen;

