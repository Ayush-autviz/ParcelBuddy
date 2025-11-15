import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Copy } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clipboard } from 'react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, Card } from '../../components';
import { ProfileStackParamList } from '../../navigation/ProfileNavigator';
import { useToast } from '../../components/Toast';

type SupportScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'Support'>;

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'How do I send a parcel using the app?',
    answer: 'Go to the "Search Rides" section, enter your destination, choose a traveler, and send a request.',
  },
  {
    question: 'How can I become a traveler?',
    answer: 'Simply create a ride by entering your route, travel date, and available luggage space.',
  },
  {
    question: 'How do I verify my account (KYC)?',
    answer: 'Go to Settings → Verification → Upload your ID and address proof. Once approved, you\'ll receive a verified badge.',
  },
];

const SupportScreen: React.FC = () => {
  const navigation = useNavigation<SupportScreenNavigationProp>();
  const { showSuccess } = useToast();

  const handleCopyEmail = () => {
    const email = 'ParcelBuddy@support';
    Clipboard.setString(email);
    showSuccess('Email copied to clipboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Support" showBackButton />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* We're Here to Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.sectionTitle}>We're Here to Help</Text>

          {faqData.map((faq, index) => (
            <Card key={index} style={styles.faqCard} padding={20}>
              <Text style={styles.question}>
                Q{index + 1}. {faq.question}
              </Text>
              <Text style={styles.answer}>Ans: {faq.answer}</Text>
            </Card>
          ))}
        </View>

        {/* Contact Us Section */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>
            Didn't find the answer you're looking for?
          </Text>

          <TouchableOpacity
            style={styles.contactCard}
            onPress={handleCopyEmail}
            activeOpacity={0.7}
          >
            <View style={styles.contactContent}>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>Contact Us:</Text>
                <Text style={styles.contactEmail}>ParcelBuddy@support</Text>
              </View>
              <View style={styles.copyIconContainer}>
                <Copy size={20} color={Colors.textPrimary} />
              </View>
            </View>
          </TouchableOpacity>
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
  helpSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: Fonts.xxl,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  faqCard: {
    marginBottom: 16,
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 12,
    shadowColor: Colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  question: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  answer: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  contactSection: {
    marginTop: 8,
  },
  contactCard: {
    backgroundColor: Colors.primaryCyan + '20',
    borderRadius: 12,
    padding: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.primaryCyan + '30',
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactTextContainer: {
    flex: 1,
  },
  contactLabel: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  contactEmail: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
  },
  copyIconContainer: {
    marginLeft: 16,
    padding: 8,
  },
});

export default SupportScreen;

