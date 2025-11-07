import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MapPin, Calendar } from 'lucide-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Card, Header, GradientButton, TabButton, SearchInput, SearchHistoryItem, PlaceResultItemData } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchStackParamList } from '../../navigation/SearchNavigator';
import { useSearchFormStore } from '../../services/store';

const { width } = Dimensions.get('window');

type TabType = 'Domestic' | 'International';

interface SearchHistory {
  id: string;
  from: string;
  to: string;
  date: string;
}

type SearchScreenNavigationProp = StackNavigationProp<SearchStackParamList, 'SearchList'>;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<TabType>('Domestic');
  const [date, setDate] = useState('');

  // Use Zustand store only for from/to values - data is stored directly in PlacesSearchScreen
  const { from, to, selectedFrom, selectedTo, setFrom, setTo } = useSearchFormStore();

  const isDomestic = activeTab === 'Domestic';

  // Mock search history data
  const searchHistory: SearchHistory[] = [
    { id: '1', from: 'New York', to: 'Boston', date: 'Aug, 2025' },
    { id: '2', from: 'Boston', to: 'LA', date: 'Sep, 2025' },
    { id: '3', from: 'New York', to: 'Boston', date: 'Sep, 2025' },
  ];

  const handleFromFocus = () => {
    navigation.navigate('PlacesSearch', {
      fieldType: 'from',
      isDomestic,
      initialValue: from,
    });
  };

  const handleToFocus = () => {
    navigation.navigate('PlacesSearch', {
      fieldType: 'to',
      isDomestic,
      initialValue: to,
    });
  };


  const handleSearch = () => {
    // TODO: Implement search functionality
  };

  const handleHistoryPress = (item: SearchHistory) => {
    setFrom(item.from);
    setTo(item.to);
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header title="Search Rides" variant="centered" />
      
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Illustration Banner */}
        <View style={styles.bannerContainer}>
        <Image
        source={require('../../assets/images/Aeroplane.png')}
        style={styles.bannerPlaceholder}
        />
        </View>

        {/* Search Form Card */}
        <Card style={styles.searchCard} padding={20}>
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

          {/* Input Fields */}
          <View style={styles.inputsContainer}>
            <TouchableOpacity onPress={handleFromFocus} activeOpacity={0.7}>
              <SearchInput
                icon={MapPin}
                placeholder="From"
                value={from}
                editable={false}
                pointerEvents="none"
                containerStyle={styles.input}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleToFocus} activeOpacity={0.7}>
              <SearchInput
                icon={MapPin}
                placeholder="To"
                value={to}
                editable={false}
                pointerEvents="none"
                containerStyle={styles.input}
              />
            </TouchableOpacity>
            <SearchInput
              icon={Calendar}
              placeholder="mm / yy"
              value={date}
              onChangeText={setDate}
              returnKeyType="done"
              onSubmitEditing={handleSearch}
              containerStyle={styles.input}
            />
          </View>

          {/* Search Button */}
          <GradientButton
            title="Search Rides"
            onPress={handleSearch}
            style={styles.searchButton}
          />
        </Card>

        {/* Search History Section */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Search History</Text>
          {searchHistory.map((item) => (
            <SearchHistoryItem
              key={item.id}
              from={item.from}
              to={item.to}
              date={item.date}
              onPress={() => handleHistoryPress(item)}
            />
          ))}
        </View>
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
    paddingBottom: 100,
  },
  bannerContainer: {
    // width: width - 40,
    // marginHorizontal: 20,
    // marginBottom: 0,
    // borderRadius: 12,
    overflow: 'hidden',
  },
  bannerPlaceholder: {
    width: '100%',
    height: 350,
    resizeMode: 'cover',
  },
  searchCard: {
    marginHorizontal: 20,
    marginTop: -140,
    marginBottom: 24,
    zIndex: 1,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gradientEnd,
  },
  inputsContainer: {
    marginBottom: 0,
  },
  input: {
    marginBottom: 16,
  },
  searchButton: {
    marginTop: 4,
  },
  historySection: {
    paddingHorizontal: 20,
  },
  historyTitle: {
    fontSize: Fonts.xl,
    // fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
});

export default SearchScreen;
