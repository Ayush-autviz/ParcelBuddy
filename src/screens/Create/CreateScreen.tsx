import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { MapPin, Calendar, Clock, Package } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, TabButton, SearchInput, SectionCard, TimeInput, TextArea } from '../../components';
import GradientButton from '../../components/GradientButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type TabType = 'Domestic' | 'International';

const CreateScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Domestic');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [dropoffTime, setDropoffTime] = useState('');
  const [maxWeight, setMaxWeight] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const handlePublish = () => {
    // TODO: Implement publish ride functionality
    console.log('Publish ride:', {
      type: activeTab,
      origin,
      destination,
      date,
      pickupTime,
      dropoffTime,
      maxWeight,
      additionalNotes,
    });
  };

  return (
    <View style={styles.container}>
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
            <SearchInput
              icon={MapPin}
              placeholder="Enter Pickup Location"
              value={origin}
              onChangeText={setOrigin}
              containerStyle={styles.input}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Destination</Text>
            <SearchInput
              icon={MapPin}
              placeholder="Enter Destination"
              value={destination}
              onChangeText={setDestination}
              containerStyle={styles.input}
            />
          </View>
        </SectionCard>

        {/* Schedule Section */}
        <SectionCard title="Schedule">
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Date</Text>
            <SearchInput
              icon={Calendar}
              placeholder="mm / yy"
              value={date}
              onChangeText={setDate}
              containerStyle={styles.input}
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Time</Text>
            <View style={styles.timeInputsContainer}>
              <TimeInput
                placeholder="--:-- --"
                value={pickupTime}
                onChangeText={setPickupTime}
                containerStyle={[styles.timeInput, styles.timeInputLeft]}
              />
              <TimeInput
                placeholder="--:-- --"
                value={dropoffTime}
                onChangeText={setDropoffTime}
                containerStyle={[styles.timeInput, styles.timeInputRight]}
              />
            </View>
          </View>
        </SectionCard>

        {/* Luggage Capacity Section */}
        <SectionCard title="Luggage Capacity">
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, styles.labelTeal]}>Maximum Weight (kg)</Text>
            <SearchInput
              icon={Package}
              placeholder="Enter max weight"
              value={maxWeight}
              onChangeText={setMaxWeight}
              keyboardType="numeric"
              containerStyle={styles.input}
            />
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
        />
      </KeyboardAwareScrollView>
    </View>
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
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  labelTeal: {
    color: Colors.primaryTeal,
  },
  input: {
    marginBottom: 0,
  },
  timeInputsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  timeInput: {
    marginBottom: 0,
  },
  timeInputLeft: {
    marginRight: 6,
  },
  timeInputRight: {
    marginLeft: 6,
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
