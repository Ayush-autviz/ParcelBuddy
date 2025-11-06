import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

const TrackScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Track Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
  },
  text: {
    fontSize: Fonts.xl,
    color: Colors.textPrimary,
  },
});

export default TrackScreen;

