import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Package } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import Card from '../Card';

interface EmptyStateCardProps {
  icon?: React.ComponentType<{ size: number; color: string }>;
  title: string;
  description: string;
  style?: ViewStyle;
}

const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  icon: Icon = Package,
  title,
  description,
  style,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon size={40} color={Colors.primaryTeal} strokeWidth={1.5} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 32,
    backgroundColor: Colors.backgroundGray,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 12,

  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    backgroundColor: Colors.backgroundWhite,
    width: 80,
    height: 80,
    shadowColor: Colors.textLight,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  title: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
    marginHorizontal: 30,
  },
});

export default EmptyStateCard;

