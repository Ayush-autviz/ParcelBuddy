import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChevronRight, Upload, Calendar, Package } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, Card, GradientButton } from '../../components';
import { SearchStackParamList } from '../../navigation/SearchNavigator';
import { AvailableRideData } from '../../components/search/AvailableRideCard';
import { SvgXml } from 'react-native-svg';
import { MapPinIcon } from '../../assets/icons/svg/main';
import * as ImagePicker from 'react-native-image-picker';
import { User } from 'lucide-react-native';
import { useCreateLuggageRequest } from '../../hooks/useLuggage';
import { useToast } from '../../components/Toast';

type SendRequestScreenRouteProp = RouteProp<SearchStackParamList, 'SendRequest'>;
type SendRequestScreenNavigationProp = StackNavigationProp<SearchStackParamList, 'SendRequest'>;

const SendRequestScreen: React.FC = () => {
  const route = useRoute<SendRequestScreenRouteProp>();
  const navigation = useNavigation<SendRequestScreenNavigationProp>();
  const { ride } = route.params;
  const { showWarning, showError, showSuccess } = useToast();
  const createLuggageRequestMutation = useCreateLuggageRequest();

  const [weight, setWeight] = useState('');
  const [length, setLength] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [images, setImages] = useState<ImagePicker.Asset[]>([]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const dayNum = date.getDate();
    return `${day}, ${dayNum} ${month}`;
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const handleImagePicker = () => {
    const options: ImagePicker.ImageLibraryOptions = {
      mediaType: 'photo',
      quality: 0.8,
      selectionLimit: 5,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.assets && response.assets.length > 0) {
        const newAssets = response.assets.filter((asset): asset is ImagePicker.Asset => asset !== null && asset !== undefined);
        setImages((prev) => [...prev, ...newAssets].slice(0, 5));
      }
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBookNow = () => {
    // Validation
    if (!weight || !weight.trim()) {
      showWarning('Please enter weight');
      return;
    }

    if (!images || images.length === 0) {
      showWarning('Please upload at least one image');
      return;
    }

    if (!itemDescription || !itemDescription.trim()) {
      showWarning('Please enter item description');
      return;
    }

    // if (!specialInstructions || !specialInstructions.trim()) {
    //   showWarning('Please enter special instructions');
    //   return;
    // }

    // if (!length || !length.trim()) {
    //   showWarning('Please enter length');
    //   return;
    // }

    // if (!height || !height.trim()) {
    //   showWarning('Please enter height');
    //   return;
    // }

    // if (!width || !width.trim()) {
    //   showWarning('Please enter width');
    //   return;
    // }

    if (!itemDescription || !itemDescription.trim()) {
      showWarning('Please enter item description');
      return;
    }

    const weightNum = parseFloat(weight);
    const lengthNum = parseFloat(length);
    const heightNum = parseFloat(height);
    const widthNum = parseFloat(width);

    if (weight && weight.trim() !== '' && (isNaN(weightNum) || weightNum <= 0)) {
      showWarning('Please enter a valid weight');
      return;
    }

    if (length && length.trim() !== '' && (isNaN(lengthNum) || lengthNum <= 0)) {
      showWarning('Please enter a valid length');
      return;
    }

    if (height && height.trim() !== '' && (isNaN(heightNum) || heightNum <= 0)) {
      showWarning('Please enter a valid height');
      return;
    }

    if (width && width.trim() !== '' && (isNaN(widthNum) || widthNum <= 0)) {
      showWarning('Please enter a valid width');
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('ride', ride.id);
    formData.append('weight_kg', weightNum.toString());
    if (lengthNum) {
    formData.append('length_cm', lengthNum.toString());
    }
    if (widthNum) {
      formData.append('width_cm', widthNum.toString());
    }
    if (heightNum) {
    formData.append('height_cm', heightNum.toString());
    }
    formData.append('item_description', itemDescription.trim());
    
    if (specialInstructions.trim()) {
      formData.append('special_instructions', specialInstructions.trim());
    }
    
    formData.append('offered_price', '0');

    // Append luggage photos as array
    images.forEach((imageAsset) => {
      if (imageAsset.uri) {
        const fileExtension = imageAsset.uri.split('.').pop() || 'jpg';
        const fileName = imageAsset.fileName || `luggage_photo_${Date.now()}.${fileExtension}`;
        const fileType = imageAsset.type || `image/${fileExtension}`;
        
        formData.append('luggage_photos', {
          uri: imageAsset.uri,
          type: fileType,
          name: fileName,
        } as any);
      }
    });

    // Call API
    createLuggageRequestMutation.mutate(formData, {
      onSuccess: (response) => {
        showSuccess('Request sent successfully!');
        // Navigate back to available rides screen
        navigation.goBack();
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || error?.response?.data?.error || error?.message || 'Failed to send request';
        showError(errorMessage);
      },
    });
  };

  const driverName = `${ride.traveler.first_name} ${ride.traveler.last_name}`.trim();
  const formattedDate = formatDate(ride.travel_date);
  const rating = ride.rating || 4.8;
  const reviewCount = ride.review_count || 124;

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Send Request" showBackButton />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Selection Card */}
        <Card style={styles.dateCard} padding={16}>
          <View style={styles.dateRow}>
            <View style={styles.dateLeft}>
              <Calendar size={20} color={Colors.primaryCyan} />
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>
          </View>
        </Card>

        {/* Location Details Card */}
        <Card style={styles.locationCard} padding={20}>
          {/* Pickup */}
          <View style={[styles.locationRow, { marginBottom: 20 }]}>
            <View style={styles.locationLeft}>
              <View style={styles.iconContainer}>
                <SvgXml xml={MapPinIcon} height={16} width={16} />
              </View>
              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>Pickup</Text>
                <Text style={styles.locationAddress}>{ride.origin_name}</Text>
              </View>
            </View>
            {/* <Text style={styles.time}>{formatTime(ride.travel_date)}</Text> */}
          </View>

          {/* Destination */}
          <View style={styles.locationRow}>
            <View style={styles.locationLeft}>
              <View style={styles.iconContainer}>
                <SvgXml xml={MapPinIcon} height={16} width={16} />
              </View>
              <View style={styles.locationDetails}>
                <Text style={styles.locationLabel}>Destination</Text>
                <Text style={styles.locationAddress}>{ride.destination_name}</Text>
              </View>
            </View>
            {/* <Text style={styles.time}>{formatTime(ride.travel_date)}</Text> */}
          </View>
        </Card>

        {/* Driver Information Card */}
        <Card style={styles.driverCard} padding={16}>
          <TouchableOpacity 
            style={styles.driverRow} 
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate('UserProfile', {
                traveler: ride.traveler,
              });
            }}
          >
            <View style={styles.driverLeft}>
              <View style={styles.driverAvatar}>
                {ride.traveler.profile?.profile_photo ? (
                  <Image
                    source={{ uri: ride.traveler.profile.profile_photo }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <User size={20} color={Colors.primaryCyan} />
                  </View>
                )}
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{driverName}</Text>
                <Text style={styles.driverRating}>
                  {rating} ⭐ ({reviewCount})
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.textTertiary} />
          </TouchableOpacity>
        </Card>

        {/* Luggage Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Luggage Details</Text>
          <View style={styles.dimensionsRow}>
            <View style={styles.dimensionItem}>
              <Text style={styles.inputLabel}>Weight (KG)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 2.5"
                placeholderTextColor={Colors.textLight}
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.dimensionItem}>
              <Text style={styles.inputLabel}>Length (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 50"
                placeholderTextColor={Colors.textLight}
                value={length}
                onChangeText={setLength}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.dimensionItem}>
              <Text style={styles.inputLabel}>Width (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 35"
                placeholderTextColor={Colors.textLight}
                value={width}
                onChangeText={setWidth}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.dimensionItem}>
              <Text style={styles.inputLabel}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 25"
                placeholderTextColor={Colors.textLight}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        {/* Item Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Item Description</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="e.g. Books, documents and laptop"
            placeholderTextColor={Colors.textLight}
            value={itemDescription}
            onChangeText={setItemDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Images Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Images</Text>
          <TouchableOpacity
            style={styles.uploadArea}
            onPress={handleImagePicker}
            activeOpacity={0.7}
          >
            {images.length > 0 ? (
              <View style={styles.imagesGrid}>
                {images.map((imageAsset, index) => (
                  <View key={index} style={styles.imageWrapper}>
                    <Image 
                      source={{ uri: imageAsset.uri }} 
                      style={styles.uploadedImage} 
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Text style={styles.removeImageText}>×</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                {images.length < 5 && (
                  <TouchableOpacity
                    style={styles.addImageButton}
                    onPress={handleImagePicker}
                    activeOpacity={0.7}
                  >
                    <Upload size={24} color={Colors.primaryCyan} />
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View style={styles.uploadContent}>
                <Upload size={32} color={Colors.primaryCyan} />
                <Text style={styles.uploadText}>
                  Click to upload
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Special Instructions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="e.g. Please handle with care. Contains fragile electronics."
            placeholderTextColor={Colors.textLight}
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Book Now Button */}
        <GradientButton
          title="Book Now"
          onPress={handleBookNow}
          style={styles.bookButton}
          loading={createLuggageRequestMutation.isPending}
        />

        {/* Disclaimer Section */}
        <Card style={styles.disclaimerCard} padding={16}>
          <Text style={styles.disclaimerTitle}>Disclaimer:</Text>
          <View style={styles.disclaimerItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.disclaimerText}>
              Your booking won't be confirmed until the driver approves your request
            </Text>
          </View>
          <View style={styles.disclaimerItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.disclaimerText}>
              Luggage will be checked by the traveller before leaving.
            </Text>
          </View>
        </Card>
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
  dateCard: {
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightMedium,
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  locationCard: {
    marginBottom: 16,
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
  iconContainer: {
    backgroundColor: Colors.backgroundWhite,
    width: 36,
    height: 36,
    shadowColor: Colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    borderRadius: 100,
    alignItems: 'center',
    marginRight: 12,
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
  time: {
    fontSize: Fonts.sm,
    fontWeight: Fonts.weightMedium,
    color: Colors.textLight,
    marginLeft: 12,
  },
  driverCard: {
    marginBottom: 24,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  driverLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  driverAvatar: {
    marginRight: 12,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryCyan + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  driverRating: {
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
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
  dimensionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dimensionItem: {
    flex: 1,
  },
  inputLabel: {
    fontSize: Fonts.sm,
    fontWeight: Fonts.weightMedium,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    backgroundColor: Colors.backgroundWhite,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: Fonts.base,
    color: Colors.textPrimary,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: Colors.borderLight,
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: Colors.backgroundWhite,
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  uploadContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
  imagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageWrapper: {
    position: 'relative',
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.backgroundGray,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.backgroundWhite,
  },
  removeImageText: {
    color: Colors.backgroundWhite,
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundGray,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    backgroundColor: Colors.backgroundWhite,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: Fonts.base,
    color: Colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  bookButton: {
    marginBottom: 24,
  },
  disclaimerCard: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.backgroundGray,
  },
  disclaimerTitle: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  disclaimerItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textSecondary,
    marginTop: 6,
    marginRight: 12,
  },
  disclaimerText: {
    flex: 1,
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});

export default SendRequestScreen;

