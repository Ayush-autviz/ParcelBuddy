import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {  Package } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, TabButton, SearchInput, SectionCard, TextArea, DatePickerInput, TimePickerInput, useToast } from '../../components';
import GradientButton from '../../components/GradientButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCreateFormStore } from '../../services/store';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '../../navigation/BottomTabNavigator';
import { useCreateRide } from '../../hooks/useRideMutations';
import { Alert } from 'react-native';
import { MapPinIcon, WeightIcon } from '../../assets/icons/svg/main';

type TabType = 'Domestic' | 'International';

type CreateScreenNavigationProp = BottomTabNavigationProp<BottomTabParamList, 'Create'>;

const CreateScreen: React.FC = () => {
  const navigation = useNavigation<CreateScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('Domestic');
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const [departureTime, setDepartureTime] = useState<Date | null>(null);
  const [arrivalDate, setArrivalDate] = useState<Date | null>(null);
  const [arrivalTime, setArrivalTime] = useState<Date | null>(null);
  const [maxWeight, setMaxWeight] = useState('');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const { showWarning, showSuccess } = useToast();

  // Use Zustand store for origin/destination
  const { 
    origin, 
    destination, 
    originLatitude, 
    originLongitude, 
    destinationLatitude, 
    destinationLongitude,
    setOrigin,
    setDestination,
    clearCreateForm
  } = useCreateFormStore();

  // Create ride mutation
  const createRideMutation = useCreateRide();

  const isDomestic = activeTab === 'Domestic';

  const handleOriginFocus = () => {
    // Navigate to PlacesSearchScreen through Search tab
    navigation.navigate('Search', {
      screen: 'PlacesSearch',
      params: {
        fieldType: 'origin',
        isDomestic,
        initialValue: origin,
        storeType: 'create',
      },
    });
  };

  const handleDestinationFocus = () => {
    // Navigate to PlacesSearchScreen through Search tab
    navigation.navigate('Search', {
      screen: 'PlacesSearch',
      params: {
        fieldType: 'destination',
        isDomestic,
        initialValue: destination,
        storeType: 'create',
      },
    });
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handlePublish = () => {
    // Validation
    if (!origin || !destination) {
      // Alert.alert('Error', 'Please select origin and destination');
      showWarning('Please select origin and destination');
      return;
    }

    if (!originLatitude || !originLongitude || !destinationLatitude || !destinationLongitude) {
      // Alert.alert('Error', 'Please select valid origin and destination locations');
      showWarning('Please select valid origin and destination locations');
      return;
    }

    if (!departureDate || !departureTime) {
      // Alert.alert('Error', 'Please select departure date and time');
      showWarning('Please select departure date and time');
      return;
    }

    if (!arrivalDate || !arrivalTime) {
      // Alert.alert('Error', 'Please select arrival date and time');
      showWarning('Please select arrival date and time');
      return;
    }

    if (!maxWeight || !height || !width || !length) {
      // Alert.alert('Error', 'Please fill in all luggage capacity fields');
      showWarning('Please fill in all luggage  fields');
      return;
    }

    // Prepare request data
    const requestData = {
      origin_name: origin,
      origin_lat: originLatitude,
      origin_lng: originLongitude,
      destination_name: destination,
      destination_lat: destinationLatitude,
      destination_lng: destinationLongitude,
      travel_date: formatDate(departureDate),
      travel_time: formatTime(departureTime),
      destination_date: formatDate(arrivalDate),
      destination_time: formatTime(arrivalTime),
      available_weight_kg: parseFloat(maxWeight),
      max_length_cm: parseFloat(length),
      max_width_cm: parseFloat(width),
      max_height_cm: parseFloat(height),
      price_per_kg: 5.00,
      is_price_negotiable: true,
      notes: additionalNotes || '',
      status: 'active',
    };

    // Call API
    createRideMutation.mutate(requestData, {
      onSuccess: (response) => {
        showSuccess('Ride created successfully!');
              clearCreateForm();
              setDepartureDate(null);
              setDepartureTime(null);
              setArrivalDate(null);
              setArrivalTime(null);
              setMaxWeight('');
              setHeight('');
              setWidth('');
              setLength('');
              setAdditionalNotes('');
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create ride';
        console.log('Create ride error:', error.response.data.error);
        Alert.alert('Error', errorMessage);
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header title="Create Ride" variant="centered" />

      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TabButton
            label="Domestic"
            active={activeTab === 'Domestic'}
            onPress={() => setActiveTab('Domestic')}
            isFirst={true}
          />
          <TabButton
            label="International"
            active={activeTab === 'International'}
            onPress={() => setActiveTab('International')}
            isLast={true}
          />
        </View>

        {/* Route Details Section */}
        <SectionCard title="Route Details">
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Origin</Text>
            <TouchableOpacity onPress={handleOriginFocus} activeOpacity={0.7}>
              <SearchInput
                icon={MapPinIcon}
                placeholder="Enter Pickup Location"
                value={origin}
                editable={false}
                pointerEvents="none"
                containerStyle={styles.input}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Destination</Text>
            <TouchableOpacity onPress={handleDestinationFocus} activeOpacity={0.7}>
              <SearchInput
                icon={MapPinIcon}
                placeholder="Enter Destination"
                value={destination}
                editable={false}
                pointerEvents="none"
                containerStyle={styles.input}
              />
            </TouchableOpacity>
          </View>
        </SectionCard>

        {/* Schedule Section */}
        <SectionCard title="Schedule">
          {/* Departure */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Departure</Text>
            <View style={styles.dateTimeRow}>
              <View style={styles.dateTimeItem}>
                <DatePickerInput
                  value={departureDate}
                  onChange={setDepartureDate}
                  placeholder="Select Date"
                  minimumDate={new Date()}
                  containerStyle={styles.input}
                />
              </View>
              <View style={styles.dateTimeItem}>
                <TimePickerInput
                  value={departureTime}
                  onChange={setDepartureTime}
                  placeholder="Select Time"
                  containerStyle={styles.input}
                />
              </View>
            </View>
          </View>
          
          {/* Arrival */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Arrival</Text>
            <View style={styles.dateTimeRow}>
              <View style={styles.dateTimeItem}>
                <DatePickerInput
                  value={arrivalDate}
                  onChange={setArrivalDate}
                  placeholder="Select Date"
                  minimumDate={departureDate || new Date()}
                  containerStyle={styles.input}
                />
              </View>
              <View style={styles.dateTimeItem}>
                <TimePickerInput
                  value={arrivalTime}
                  onChange={setArrivalTime}
                  placeholder="Select Time"
                  containerStyle={styles.input}
                />
              </View>
            </View>
          </View>
        </SectionCard>

        {/* Luggage Capacity Section */}
        <SectionCard title="Luggage">
          <View style={styles.fieldContainer}>
            <Text style={[styles.label]}>Maximum Weight (kg)</Text>
            <SearchInput
              icon={WeightIcon}
              placeholder="Enter max weight"
              value={maxWeight}
              onChangeText={setMaxWeight}
              keyboardType="numeric"
              containerStyle={styles.input}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label]}>Dimensions (cm)</Text>
            <View style={styles.dimensionsRow}>
              <View style={styles.dimensionItem}>
                <SearchInput
                  lucideIcon={Package}
                  placeholder="Height"
                  inputStyle={{fontSize: Fonts.sm}}
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                  containerStyle={styles.input}
                />
              </View>
              <View style={styles.dimensionItem}>
                <SearchInput
                  lucideIcon={Package}
                  placeholder="Width" 
                  inputStyle={{fontSize: Fonts.sm}}
                  value={width}
                  onChangeText={setWidth}
                  keyboardType="numeric"
                  containerStyle={styles.input}
                />
              </View>
              <View style={styles.dimensionItem}>
                <SearchInput
                  lucideIcon={Package}
                  placeholder="Length"
                  inputStyle={{fontSize: Fonts.sm}}
                  value={length}
                  onChangeText={setLength}
                  keyboardType="numeric"
                  containerStyle={styles.input}
                />
              </View>
            </View>
          </View>
        </SectionCard>

        {/* Additional Notes Section */}
        <SectionCard title="Additional Notes">
          <TextArea
            placeholder="Add any special instructions or requirements..."
            value={additionalNotes}
            onChangeText={setAdditionalNotes}
            containerStyle={styles.textArea}
          />
        </SectionCard>

              {/* Publish Ride Button */}
              <GradientButton
                title="Publish Ride"
                onPress={handlePublish}
                style={styles.publishButton}
                loading={createRideMutation.isPending}
                disabled={createRideMutation.isPending}
              />
      </KeyboardAwareScrollView>
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
    paddingBottom: 100,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gradientEnd,
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
  labelTeal: {
    color: Colors.primaryTeal,
  },
  input: {
    marginBottom: 0,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeItem: {
    flex: 1,
  },
  dimensionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dimensionItem: {
    flex: 1,
  },
  textArea: {
    marginTop: 0,
  },
  publishButton: {
    marginTop: 8,
    marginBottom: 24,
  },
});

export default CreateScreen;
