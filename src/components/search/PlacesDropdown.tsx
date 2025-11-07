import React from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/colors';
import PlaceResultItem, { PlaceResultItemData } from './PlaceResultItem';

interface PlacesDropdownProps {
  places: PlaceResultItemData[];
  onSelectPlace: (place: PlaceResultItemData) => void;
  isLoading?: boolean;
  style?: any;
}

const PlacesDropdown: React.FC<PlacesDropdownProps> = ({
  places,
  onSelectPlace,
  isLoading = false,
  style,
}) => {
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, style]}>
        <ActivityIndicator size="small" color={Colors.primaryTeal} />
      </View>
    );
  }

  if (places.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PlaceResultItem place={item} onPress={() => onSelectPlace(item)} />
        )}
        style={styles.list}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  list: {
    flexGrow: 0,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PlacesDropdown;

