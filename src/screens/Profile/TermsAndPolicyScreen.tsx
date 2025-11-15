import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header } from '../../components';
import { ProfileStackParamList } from '../../navigation/ProfileNavigator';

type TermsAndPolicyScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'TermsAndPolicy'>;

const TermsAndPolicyScreen: React.FC = () => {
  const navigation = useNavigation<TermsAndPolicyScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Term & Policy" showBackButton />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title and Update Date */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Terms of Service</Text>
          <Text style={styles.updateDate}>Last updated: September 26, 2025</Text>
        </View>

        {/* Introductory Paragraph */}
        <Text style={styles.introText}>
          These Terms of Service govern your use of the ParcelBuddy platform and services. By accessing or using our platform, you agree to comply with these terms. Please read them carefully before proceeding.
        </Text>

        {/* Section 1: Acceptance of Terms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.sectionText}>
            By accessing or using the ParcelBuddy platform, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use our services. We reserve the right to modify these terms at any time, and your continued use of the platform after such modifications constitutes acceptance of the updated terms.
          </Text>
        </View>

        {/* Section 2: User Accounts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. User Accounts</Text>
          <Text style={styles.sectionText}>
            To access certain features of the ParcelBuddy platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </Text>
        </View>

        {/* Section 3: Prohibited Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Prohibited Activities</Text>
          <Text style={styles.sectionText}>
            You agree not to engage in any of the following prohibited activities:
          </Text>
          <View style={styles.listContainer}>
            <Text style={styles.listItem}>
              (i) copying, distributing, or disclosing any part of the service in any medium;
            </Text>
            <Text style={styles.listItem}>
              (ii) using any automated system, including "robots," "spiders," "offline readers," etc., to access the service;
            </Text>
            <Text style={styles.listItem}>
              (iii) transmitting spam, chain letters, or other unsolicited email.
            </Text>
          </View>
        </View>

        {/* Section 4: Termination */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Termination</Text>
          <Text style={styles.sectionText}>
            We may terminate or suspend your access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will cease immediately.
          </Text>
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
  titleSection: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: Fonts.xxl,
    fontWeight: Fonts.weightBold,
    color: Colors.primaryCyan,
    marginBottom: 8,
  },
  updateDate: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
  },
  introText: {
    fontSize: Fonts.base,
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  sectionText: {
    fontSize: Fonts.base,
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: 8,
  },
  listContainer: {
    marginTop: 8,
    paddingLeft: 8,
  },
  listItem: {
    fontSize: Fonts.base,
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: 8,
  },
});

export default TermsAndPolicyScreen;

