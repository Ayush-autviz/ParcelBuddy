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
    <Card style={styles.card}>
      <View style={styles.content}>
        <Icon size={64} color={Colors.primaryTeal} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default EmptyStateCard;

