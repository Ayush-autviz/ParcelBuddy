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
import { FileText } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { ProfileHeader, Card } from '../../components';
import { ProfileStackParamList } from '../../navigation/ProfileNavigator';

type TermsAndPolicyScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'TermsAndPolicy'>;

const TermsAndPolicyScreen: React.FC = () => {
  const navigation = useNavigation<TermsAndPolicyScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
    <ProfileHeader title="Terms & Conditions" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <Card style={styles.titleCard} padding={20}>
          {/* <View style={styles.titleIconContainer}>
            <FileText size={32} color={Colors.primaryCyan} />
          </View> */}
          {/* <Text style={styles.mainTitle}>Terms & Conditions</Text> */}
          {/* <Text style={styles.subtitle}>Terms and Conditions</Text> */}
          {/* <View style={styles.divider} /> */}
          <Text style={styles.introText}>
            Please read these terms carefully. By using our platform, you agree to be bound by these terms and conditions.
          </Text>
        </Card>

        {/* Table of Contents */}
        {/* <Card style={styles.tocCard} padding={20}>
          <Text style={styles.tocTitle}>TABLE OF CONTENTS</Text>
          <View style={styles.tocContent}>
            <Text style={styles.tocItem}>1. Definitions</Text>
            <Text style={styles.tocItem}>2. Acceptance; Scope; Amendment</Text>
            <Text style={styles.tocItem}>3. Eligibility & User Representations</Text>
            <Text style={styles.tocItem}>4. Nature of Service; No Carrier; Disclaimer</Text>
            <Text style={styles.tocItem}>5. Account Registration, Authentication & KYC</Text>
            <Text style={styles.tocItem}>6. User Responsibilities (Travelers & Senders)</Text>
            <Text style={styles.tocItem}>7. Prohibited Goods & Activities</Text>
            <Text style={styles.tocItem}>8. Fees, Subscriptions, Payments & Billing</Text>
            <Text style={styles.tocItem}>9. Refunds, Cancellations & Chargebacks</Text>
            <Text style={styles.tocItem}>10. Intellectual Property Rights</Text>
            <Text style={styles.tocItem}>11. Privacy, Data Protection & Data Security</Text>
            <Text style={styles.tocItem}>12. Logs, Audit Trails, Records & Cooperation with Authorities</Text>
            <Text style={styles.tocItem}>13. Messages, Content & Moderation</Text>
            <Text style={styles.tocItem}>14. Warranties & Disclaimers</Text>
            <Text style={styles.tocItem}>15. Limitation of Liability; Caps; Remedies</Text>
            <Text style={styles.tocItem}>16. Indemnity</Text>
            <Text style={styles.tocItem}>17. Insurance & Risk Allocation</Text>
            <Text style={styles.tocItem}>18. Suspension, Termination & Consequences</Text>
            <Text style={styles.tocItem}>19. Force Majeure</Text>
            <Text style={styles.tocItem}>20. Governing Law, Dispute Resolution & Jurisdiction</Text>
            <Text style={styles.tocItem}>21. Notices & Grievance Redressal</Text>
            <Text style={styles.tocItem}>22. Miscellaneous (Assignment, Severability, Non-Waiver, Third-Party Rights)</Text>
            <Text style={styles.tocItem}>Annexure A – Privacy Policy (DPDP-compliant)</Text>
            <Text style={styles.tocItem}>Annexure B – Refund & Cancellation Policy</Text>
            <Text style={styles.tocItem}>Annexure C – KYC, AML & Data Sharing Policy</Text>
            <Text style={styles.tocItem}>Annexure D – Subscription Plans & Terms</Text>
            <Text style={styles.tocItem}>Annexure E – Takedown / Complaints Procedure</Text>
          </View>
        </Card> */}

        {/* Section 1: Definitions */}
        <Card style={styles.sectionCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>1</Text>
            </View>
            <Text style={styles.sectionTitle}>DEFINITIONS (FULLY ELABORATED)</Text>
          </View>
          <View style={styles.sectionDivider} />
          <Text style={styles.subsectionTitle}>1.1 "App / Platform"</Text>
          <Text style={styles.sectionText}>
            – The ParcelBuddy mobile applications, websites, dashboards, APIs, plugins, widgets, microservices, software, servers, interfaces, updates, patches, content management systems, and all ancillary services provided by the Company, including future enhancements or features.
          </Text>
          <Text style={styles.subsectionTitle}>1.2 "Company", "we", "us"</Text>
          <Text style={styles.sectionText}>
            – Huvina Technologies LLP, its affiliates, subsidiaries, employees, officers, directors, agents, representatives, contractors, and any permitted successors or assigns.
          </Text>
          <Text style={styles.subsectionTitle}>1.3 "User", "you"</Text>
          <Text style={styles.sectionText}>
            – Any natural person, legal entity, firm, or company accessing or using the App. This includes all Travelers and Senders, whether registered or unregistered, who interact with the Services.
          </Text>
          <Text style={styles.subsectionTitle}>1.4 "Traveler"</Text>
          <Text style={styles.sectionText}>
            – A User who, during the ordinary course of travel, offers to carry lawful Goods for another User. Travelers must comply with all domestic and international laws related to transport, customs, aviation, insurance, safety, and statutory obligations.
          </Text>
          <Text style={styles.subsectionTitle}>1.5 "Sender"</Text>
          <Text style={styles.sectionText}>
            – A User who requests a Traveler to carry Goods. Senders warrant that all Goods are lawful, safe to transport, and comply with domestic and international regulations, including labelling, documentation, and licensing requirements.
          </Text>
          <Text style={styles.subsectionTitle}>1.6 "Goods"</Text>
          <Text style={styles.sectionText}>
            – Tangible property, parcels, or items lawfully permitted for transport under applicable domestic and international laws, excluding prohibited items under Section 7.
          </Text>
          <Text style={styles.subsectionTitle}>1.7 "Services"</Text>
          <Text style={styles.sectionText}>
            – Any functionality, feature, or benefit provided via the App, including but not limited to booking, notifications, messaging, subscription benefits, analytics, support, and future enhancements.
          </Text>
          <Text style={styles.subsectionTitle}>1.8 "KYC Data"</Text>
          <Text style={styles.sectionText}>
            – All identity, verification, and compliance information submitted for KYC, anti-money laundering, or other legal compliance purposes.
          </Text>
          <Text style={styles.subsectionTitle}>1.9 "DPDP Act"</Text>
          <Text style={styles.sectionText}>
            – Digital Personal Data Protection Act, 2023, including rules, regulations, and amendments issued thereunder.
          </Text>
          <Text style={styles.subsectionTitle}>1.10 "IT Rules"</Text>
          <Text style={styles.sectionText}>
            – Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, including amendments.
          </Text>
          <Text style={styles.subsectionTitle}>1.11 "Payment Provider"</Text>
          <Text style={styles.sectionText}>
            – Any third-party payment gateway, aggregator, or bank integrated for subscription, payment, or financial transactions through the App.
          </Text>
          <Text style={styles.subsectionTitle}>1.12 "Force Majeure"</Text>
          <Text style={styles.sectionText}>
            – Any event beyond reasonable control including, but not limited to, natural disasters, pandemics, strikes, terrorism, war, cyberattacks, government action, or other unforeseeable circumstances preventing performance.
          </Text>
          <Text style={styles.subsectionTitle}>1.13 "User Account"</Text>
          <Text style={styles.sectionText}>
            – means an account with the App opened by a user and used in order to access the Service provided by ParcelBuddy through the App.
          </Text>
        </Card>

        {/* Section 2: Acceptance; Scope; Amendment */}
        <Card style={styles.sectionCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>2</Text>
            </View>
            <Text style={styles.sectionTitle}>ACCEPTANCE; SCOPE; AMENDMENT</Text>
          </View>
          <View style={styles.sectionDivider} />
          <Text style={styles.subsectionTitle}>2.1 Acceptance</Text>
          <Text style={styles.sectionText}>
            – By accessing or using the App, you agree unconditionally to these Terms and all annexures. Partial acceptance or selective compliance is prohibited.
          </Text>
          <Text style={styles.subsectionTitle}>2.2 Modification of Terms</Text>
          <Text style={styles.sectionText}>
            – The Company may amend, modify, or supplement these Terms at any time. Updates are effective upon posting. Continued use constitutes acceptance of the revised Terms. The App / the Company may also, at its sole discretion, change the App's features, functionality, and user interface without prior notice or liability.
          </Text>
          <Text style={styles.sectionText}>
            All users agree to comply with the Conditions and accept that their personal data may be processed in accordance with the Privacy Policy. If a User breaches these Conditions, the Company may, at its discretion, immediately suspend or terminate the User's Account and access to all Services.
          </Text>
          <Text style={styles.subsectionTitle}>2.3 Scope of Services</Text>
          <Text style={styles.sectionText}>
            – ParcelBuddy acts solely as a technology intermediary. For the avoidance of doubt, the Company's role is limited to providing the Platform; the Company is not a party to and does not assume responsibility for any contract, transaction, service or arrangement made between Users (Travelers and Senders).
          </Text>
          <Text style={styles.sectionText}>
            The Company:
          </Text>
          <Text style={styles.listItem}>• Does not physically transport or store Goods.</Text>
          <Text style={styles.listItem}>• does not provide transportation, carriage, or delivery services, and does not issue waybills, bills of lading, or consignment notes or arrange shipments. We do not handle, store, or transport goods.</Text>
          <Text style={styles.listItem}>• does not guarantee or endorse the reliability, legality, or solvency of any User.</Text>
          <Text style={styles.listItem}>• is not a logistics service provider, freight forwarder, courier company, or Goods Transport Agency (GTA)</Text>
          <Text style={styles.listItem}>• does not control, endorse, or take part in any agreements or transactions that may arise between Travelers and Users.</Text>
          <Text style={styles.sectionText}>
            The platform is a technology tool designed to connect individuals who:
          </Text>
          <Text style={styles.listItem}>o (a) are traveling domestic / intercity / intracity / internationally and may have excess luggage capacity ("Traveler"), and</Text>
          <Text style={styles.listItem}>o (b) are seeking to connect with such travelers for the purpose of interacting, sharing, or potentially sending lawful goods ("User").</Text>
          <Text style={styles.subsectionTitle}>2.4 Consequences of Non-Compliance</Text>
          <Text style={styles.sectionText}>
            – Violations may result in account suspension, termination, restriction of access, reporting to authorities, or civil and criminal liability.
          </Text>
          <Text style={styles.subsectionTitle}>2.5 Binding Legal Effect</Text>
          <Text style={styles.sectionText}>
            – These Terms create enforceable rights and obligations under Indian Contract Act, 1872, read with applicable laws like Customs Act, DGCA regulations, and IT Act, 2000.
          </Text>
        </Card>

        {/* Section 3: Eligibility & User Representations */}
        <Card style={styles.sectionCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>3</Text>
            </View>
            <Text style={styles.sectionTitle}>ELIGIBILITY & USER REPRESENTATIONS</Text>
          </View>
          <View style={styles.sectionDivider} />
          <Text style={styles.subsectionTitle}>3.1 Minimum Age</Text>
          <Text style={styles.sectionText}>
            – Users must be 18 years or older and legally competent to contract.
          </Text>
          <Text style={styles.subsectionTitle}>3.2 Authority</Text>
          <Text style={styles.sectionText}>
            – Users registering on behalf of a legal entity represent and warrant authority to bind the entity.
          </Text>
          <Text style={styles.subsectionTitle}>3.3 Compliance with Law</Text>
          <Text style={styles.sectionText}>
            – Users shall comply with:
          </Text>
          <Text style={styles.listItem}>• Domestic and international transport laws (road, air, rail).</Text>
          <Text style={styles.listItem}>• Customs and import/export regulations.</Text>
          <Text style={styles.listItem}>• Aviation and safety laws.</Text>
          <Text style={styles.listItem}>• Data privacy laws (DPDP Act, 2023).</Text>
          <Text style={styles.listItem}>• Any other applicable local, national, or international regulations.</Text>
          <Text style={styles.subsectionTitle}>3.4 Accuracy of Information</Text>
          <Text style={styles.sectionText}>
            – All personal, identification, and transactional information must be accurate, complete, and updated. Misrepresentation constitutes a material breach.
          </Text>
          <Text style={styles.subsectionTitle}>3.5 Legal Purpose</Text>
          <Text style={styles.sectionText}>
            – Users shall not use the App for unlawful purposes, including smuggling, trafficking, or facilitation of illegal activities.
          </Text>
        </Card>

        {/* Section 4: Nature of Service; Disclaimer */}
        <Card style={styles.sectionCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>4</Text>
            </View>
            <Text style={styles.sectionTitle}>NATURE OF SERVICE; DISCLAIMER</Text>
          </View>
          <View style={styles.sectionDivider} />
          <Text style={styles.subsectionTitle}>4.1 Intermediary Role</Text>
          <Text style={styles.sectionText}>
            – ParcelBuddy is a technology platform connecting Travelers and Senders. The Company is solely a technology intermediary and does not provide carriage, warehousing, logistics, or courier services.
          </Text>
          <Text style={styles.subsectionTitle}>4.2 No Custody or Bailment</Text>
          <Text style={styles.sectionText}>
            – The Company does not accept custody, possession, or responsibility for Goods. Travelers and Senders are solely responsible for lawful transfer. Any physical handling, carriage or custody of Goods is strictly between the relevant Users.
          </Text>
          <Text style={styles.subsectionTitle}>4.3 No Endorsement</Text>
          <Text style={styles.sectionText}>
            – The Company and ParcelBuddy does not guarantee the reliability, integrity, or capability of any User. The Company does not endorse the reliability, solvency, honesty or fitness of any Traveller or Sender and makes no representations regarding the quality, legality or safety of any Good.
          </Text>
          <Text style={styles.subsectionTitle}>4.4 Compliance Responsibility</Text>
          <Text style={styles.sectionText}>
            – Travelers and Senders are responsible for compliance with customs, aviation, insurance, and all regulatory obligations. The Company does not provide insurance, bailment or custodial services. Users are responsible for their own insurance and risk mitigation.
          </Text>
          <Text style={styles.subsectionTitle}>4.5 Booking Service</Text>
          <Text style={styles.sectionText}>
            – ParcelBuddy facilitates the creation of agreements between Travelers and Senders. Once a booking is confirmed, the agreement exists solely between the parties; ParcelBuddy is not a party. ParcelBuddy reserves the right not to offer the Booking Service to a Trip due to: (i) changes to applicable law, changes in the practice of regulatory authorities or changes in case law, (ii) changes to market practices or technology changes, (iii) changes of business considerations underlying the Booking Services, and (iv) other important and valid reasons
          </Text>
          <Text style={styles.subsectionTitle}>4.6 International Trips and International Bookings</Text>
          <Text style={styles.sectionText}>
            – Users must ensure compliance with foreign country laws, customs, and transport regulations. User's insurance must cover international carriage. The Company will not be liable for non-compliance by a User with customs, aviation or other laws (domestic and international); such compliance is the sole responsibility of the User. Bookings may be made through the App for international Trips. An International Trip means any Trip which includes any travel outside of India. If a booking is made for an International Trip the Traveler must ensure that their insurance covers travel outside of India. The Traveler must also ensure that their luggage is compliant with all relevant rules and restrictions applicable in any overseas country.
          </Text>
          <Text style={styles.subsectionTitle}>4.7 How to book a parcel / goods sending / receiving for a Trip:</Text>
          <Text style={styles.sectionText}>
            The Traveler provides details of his or her Trip on the App, specifying date and time for departure and destination points, the capacity / weight of the parcel / goods that he/she can carry and all other relevant travel conditions.
          </Text>
          <Text style={styles.sectionText}>
            The Sender connects with one or more travelers for that Trip from the App.
          </Text>
          <Text style={styles.sectionText}>
            ParcelBuddy will send a notification to each of the Traveler and the Sender confirming the Booking (hereinafter, the "Booking Confirmation"). Once a Booking Confirmation has been sent, the Booking is complete and a separate binding agreement for goods sending / receiving relating to theTrip shall be formed between the Traveler and Sender.
          </Text>
          <Text style={styles.sectionText}>
            Due to the peer-to-peer nature of the Service, Users acknowledge that the Company is not liable for transactional disputes, including but not limited to, trip cancellations, non-arrival of parties, or payment failures.
          </Text>
          <Text style={styles.sectionText}>
            ParcelBuddy will not contact either party and will take no steps whatsoever to manage the booking. The operation of the Trip is solely managed by the respective Traveler and the Sender.
          </Text>
          <Text style={styles.sectionText}>
            Please note that ParcelBuddy reserves the right to change any aspect of the App or the Service which may include adding new services (which may require payment) or withdrawing any existing Services. ParcelBuddy does not guarantee that the App will be functional at all times and Services may be suspended during such period when the App is not in operation. ParcelBuddy will not be liable to any of the users in case where the Site is non-operational.
          </Text>
        </Card>

        {/* Section 5: Account Creation, Authentication & KYC */}
        <Card style={styles.sectionCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>5</Text>
            </View>
            <Text style={styles.sectionTitle}>ACCOUNT CREATION, AUTHENTICATION & KYC</Text>
          </View>
          <View style={styles.sectionDivider} />
          <Text style={styles.sectionText}>
            By accepting the terms and conditions contained herein, every user or any person who wishes to register as a user hereby agrees and consents to the fact that ParcelBuddy may collect IDs / documents belonging to them including but not limited to passport, PAN card and Aadhaar card for the purpose of verification of the information contained in such IDs / documents by third party service providers.
          </Text>
          <Text style={styles.sectionText}>
            In order to increase trustworthiness, prevent typos and wrong numbers, Users may verify their mobile number. The users may do this by providing ParcelBuddy with their mobile phone number, after which the users will receive a SMS with a code which can be validated on the Site. This service is free of charge, except for the possible cost levied by a user's mobile phone operator for receiving the SMS.
          </Text>
          <Text style={styles.subsectionTitle}>5.1 Account Registration</Text>
          <Text style={styles.sectionText}>
            – All Users must create a User Account providing accurate, verifiable, and complete information. Users shall not register multiple accounts to circumvent App limitations or for fraudulent purposes. In order to use the Services each user must create a User Account and agree to provide any personal information requested by ParcelBuddy. In particular, users will be required to provide their first name, last name, age, title, valid telephone number and email address. Use of the App is limited to those over the age of 18 years at the time of registration.
          </Text>
          <Text style={styles.subsectionTitle}>5.2 Authentication & Security</Text>
          <Text style={styles.sectionText}>
            – Users are required to secure their accounts via OTP, 2-factor authentication (2FA), and/or biometric verification where required. Users are solely responsible for safeguarding their credentials.
          </Text>
          <Text style={styles.subsectionTitle}>5.3 KYC Compliance</Text>
          <Text style={styles.sectionText}>
            – Certain features may require Know Your Customer (KYC) verification including Aadhaar, PAN, Passport, or other government-issued IDs. Failure to complete KYC may result in suspension or restricted access to high-value services.
          </Text>
          <Text style={styles.subsectionTitle}>5.4 Fraud Prevention</Text>
          <Text style={styles.sectionText}>
            – The Company may undertake background checks, credit verification, and risk assessments to prevent misuse, illegal activity, or financial fraud.
          </Text>
          <Text style={styles.subsectionTitle}>5.5 User Responsibility</Text>
          <Text style={styles.sectionText}>
            – ParcelBuddy does not independently verify user-provided information beyond KYC checks. Users remain liable for any false, misleading, or incomplete information they submit. The Company does not independently confirm the accuracy of User-provided data beyond standard KYC. The Company is not liable for losses resulting from any User providing false or inaccurate information.
          </Text>
          <Text style={styles.subsectionTitle}>5.6 Status of ParcelBuddy</Text>
          <Text style={styles.sectionText}>
            – Neither ParcelBuddy nor the Company (Huvina Technologies LLP) provides any transport services. The App is a communications platform for users to transact with one another. ParcelBuddy does not interfere with Trips, destinations or timings. The agreement for taking/sending the parcel/goods is between the Traveler and Sender. ParcelBuddy is not a party to any agreement or transaction between the users, nor is ParcelBuddy liable in respect of any matter arising which relates to a booking between the users. ParcelBuddy is not and will not act as an agent for any user.
          </Text>
          <Text style={styles.sectionText}>
            Any breach of these Terms and Conditions will give rise to immediate suspension of such user's User Account and they may be restricted from accessing any further Services.
          </Text>
        </Card>

        {/* Section 6: User Responsibilities */}
        <Card style={styles.sectionCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>6</Text>
            </View>
            <Text style={styles.sectionTitle}>USER RESPONSIBILITIES (TRAVELERS & SENDERS)</Text>
          </View>
          <View style={styles.sectionDivider} />
          <Text style={styles.subsectionTitle}>6.1 Traveler Obligations</Text>
          <Text style={styles.listItem}>• Travelers shall act as independent individuals, not agents, employees, or contractors of ParcelBuddy.</Text>
          <Text style={styles.listItem}>• Trips shall not be used for illegal or criminal purposes.</Text>
          <Text style={styles.listItem}>• That the Trip shall not be for any fraudulent, unlawful or criminal activity.</Text>
          <Text style={styles.listItem}>• That the Travelers shall not accept Goods which are prohibited or undeclared. Travelers shall require opening and inspection of packages when reasonably necessary.</Text>
          <Text style={styles.listItem}>• Travelers must immediately notify Senders of any changes to scheduled Trips. Consent from affected Senders must be obtained for changes; refusal entitles Senders to a full refund.</Text>
          <Text style={styles.listItem}>• Travelers shall comply with all domestic and international laws including airline baggage rules, aviation regulations, customs, quarantine and immigration laws of origin, transit and destination.</Text>
          <Text style={styles.listItem}>• Travelers shall inspect Goods when reasonably required to ensure legality and safety.</Text>
          <Text style={styles.listItem}>• Travelers shall not hold ParcelBuddy responsible for fines, detentions, or legal proceedings arising from carriage.</Text>
          <Text style={styles.subsectionTitle}>6.2 Sender Obligations</Text>
          <Text style={styles.listItem}>• Senders shall ensure Goods are lawful, non-hazardous, accurately described, and properly documented.</Text>
          <Text style={styles.listItem}>• Senders shall cooperate with Travelers for lawful carriage, customs clearance, and provide all necessary permits, licenses, or labels.</Text>
          <Text style={styles.listItem}>• Senders indemnify Travelers and ParcelBuddy against claims arising from misdescription, concealment, or prohibited items.</Text>
          <Text style={styles.listItem}>• Sender to ensure that the Trip shall not be for any fraudulent, unlawful or criminal activity.</Text>
          <Text style={styles.listItem}>• Sender ensures that they will immediately inform the Traveler if they are required to cancel a Trip.</Text>
          <Text style={styles.subsectionTitle}>6.3 Joint Responsibilities</Text>
          <Text style={styles.listItem}>• Both parties shall maintain records and communication to support compliance and dispute resolution.</Text>
          <Text style={styles.listItem}>• Users shall act in good faith to ensure safe, legal, and efficient transport of Goods.</Text>
        </Card>

        {/* Section 7: Prohibited Goods & Activities */}
        <Card style={styles.sectionCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>7</Text>
            </View>
            <Text style={styles.sectionTitle}>PROHIBITED GOODS & ACTIVITIES</Text>
          </View>
          <View style={styles.sectionDivider} />
          <Text style={styles.subsectionTitle}>7.1 Prohibited Goods</Text>
          <Text style={styles.sectionText}>
            include (but are not limited to): narcotics, firearms, explosives, radioactive materials, counterfeit goods, endangered species, human biological materials, currency in violation of law, and goods prohibited by Customs Act, DGCA, IATA, or other applicable laws.
          </Text>
          <Text style={styles.subsectionTitle}>7.2 Prohibited Activities</Text>
          <Text style={styles.sectionText}>
            – Users shall not use the App for illegal trade, trafficking, money laundering, evasion of customs law, or facilitation of unlawful acts.
          </Text>
          <Text style={styles.subsectionTitle}>7.3 Enforcement</Text>
          <Text style={styles.sectionText}>
            – Breach constitutes material violation, subject to immediate account suspension, reporting to authorities, civil or criminal liability, and forfeiture of payments.
          </Text>
          <Text style={styles.subsectionTitle}>7.4 App / The Company</Text>
          <Text style={styles.sectionText}>
            – No user will hold the app / the company responsible or will file a legal case against the app or the company incase any of the users (Traveler or Sender) violates the above rules.
          </Text>
        </Card>

        {/* Section 8: Fees, Subscriptions, Payments & Billing */}
        <Card style={styles.sectionCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>8</Text>
            </View>
            <Text style={styles.sectionTitle}>FEES, SUBSCRIPTIONS, PAYMENTS & BILLING</Text>
          </View>
          <View style={styles.sectionDivider} />
          <Text style={styles.subsectionTitle}>8.1 Subscription Plans</Text>
          <Text style={styles.sectionText}>
            – Tiered subscriptions (Silver, Gold, Diamond) are offered, with features, billing cycles, and trial periods specified in Annexure D.
          </Text>
          <Text style={styles.subsectionTitle}>8.2 Payment Providers</Text>
          <Text style={styles.sectionText}>
            – All payments are processed through authorized Payment Providers. Users accept provider terms at checkout.
          </Text>
          <Text style={styles.subsectionTitle}>8.3 Automatic Renewal</Text>
          <Text style={styles.sectionText}>
            – Paid subscriptions auto-renew unless cancelled in advance. Fees are subject to prevailing taxes.
          </Text>
          <Text style={styles.subsectionTitle}>8.4 Non-Refundable Nature</Text>
          <Text style={styles.sectionText}>
            – Except as specified in Annexure B, subscription fees are non-refundable.
          </Text>
          <Text style={styles.subsectionTitle}>8.5 Non-escrow Role</Text>
          <Text style={styles.sectionText}>
            – ParcelBuddy does not act as escrow or custodian unless explicitly indicated. Users remain responsible for settlement between themselves.
          </Text>
        </Card>

        {/* Section 9: Refunds, Cancellations & Chargebacks */}
        <Card style={styles.sectionCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>9</Text>
            </View>
            <Text style={styles.sectionTitle}>REFUNDS, CANCELLATIONS & CHARGEBACKS</Text>
          </View>
          <View style={styles.sectionDivider} />
          <Text style={styles.subsectionTitle}>9.1 Refund Eligibility</Text>
          <Text style={styles.sectionText}>
            – Generally, subscription fees are non-refundable. Exceptions include duplicate charges, billing errors, or Company error.
          </Text>
          <Text style={styles.subsectionTitle}>9.2 Chargebacks</Text>
          <Text style={styles.sectionText}>
            – Unauthorized chargebacks may result in suspension and liability for fees.
          </Text>
          <Text style={styles.subsectionTitle}>9.3 Dispute Resolution</Text>
          <Text style={styles.sectionText}>
            – Refund disputes must be submitted in writing within thirty (30) days to contact@parcelbuddys.com, with supporting evidence.
          </Text>
        </Card>

        {/* Section 10: Intellectual Property Rights */}
        <Card style={styles.sectionCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>10</Text>
            </View>
            <Text style={styles.sectionTitle}>INTELLECTUAL PROPERTY RIGHTS</Text>
          </View>
          <View style={styles.sectionDivider} />
          <Text style={styles.subsectionTitle}>10.1 Company IP</Text>
          <Text style={styles.sectionText}>
            – ParcelBuddy owns all software, designs, trademarks, logos, and associated content.
          </Text>
          <Text style={styles.subsectionTitle}>10.2 Limited License</Text>
          <Text style={styles.sectionText}>
            – Users receive a revocable, non-transferable, non-exclusive license to access and use the App for permitted purposes.
          </Text>
          <Text style={styles.subsectionTitle}>10.3 User Content</Text>
          <Text style={styles.sectionText}>
            – Any user content submitted grants ParcelBuddy a worldwide, royalty-free license for operation, promotion, and legal compliance.
          </Text>
          <Text style={styles.subsectionTitle}>10.4 Restrictions</Text>
          <Text style={styles.sectionText}>
            – Users shall not copy, reverse engineer, or modify the App or remove proprietary notices.
          </Text>
        </Card>

        {/* Section 11: Privacy, Data Protection & Security */}
        <Card style={styles.sectionCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>11</Text>
            </View>
            <Text style={styles.sectionTitle}>PRIVACY, DATA PROTECTION & SECURITY (DPDP ACT)</Text>
          </View>
          <View style={styles.sectionDivider} />
          <Text style={styles.subsectionTitle}>11.1 Privacy Policy</Text>
          <Text style={styles.sectionText}>
            – Data collection, storage, transfer of personal data and processing of data are governed by Annexure A, compliant with DPDP Act, 2023.
          </Text>
          <Text style={styles.subsectionTitle}>11.2 Lawful Basis</Text>
          <Text style={styles.sectionText}>
            – Processing is based on consent, contractual necessity, legal obligation, or legitimate interest.
          </Text>
          <Text style={styles.subsectionTitle}>11.3 Purpose Limitation</Text>
          <Text style={styles.sectionText}>
            – Data is used strictly for KYC, fraud prevention, service delivery, analytics, dispute resolution, and regulatory compliance.
          </Text>
          <Text style={styles.subsectionTitle}>11.4 Data Sharing</Text>
          <Text style={styles.sectionText}>
            – Data may be shared with KYC providers, Payment Providers, hosting, analytics vendors, and government authorities where legally required.
          </Text>
          <Text style={styles.subsectionTitle}>11.5 Data Retention</Text>
          <Text style={styles.sectionText}>
            – Data retained for account activity plus six (6) months, or longer where required by law.
          </Text>
          <Text style={styles.subsectionTitle}>11.6 Security Measures</Text>
          <Text style={styles.sectionText}>
            – Reasonable safeguards, including encryption and access controls, are applied; absolute security is not guaranteed.
          </Text>
          <Text style={styles.subsectionTitle}>11.7 Cross-Border Transfer</Text>
          <Text style={styles.sectionText}>
            – Data may be processed outside India with adequate safeguards.
          </Text>
        </Card>

        {/* Section 12: Logs, Audit Trails & Cooperation with Authorities */}
        <Card style={styles.sectionCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>12</Text>
            </View>
            <Text style={styles.sectionTitle}>LOGS, AUDIT TRAILS & COOPERATION WITH AUTHORITIES</Text>
          </View>
          <View style={styles.sectionDivider} />
          <Text style={styles.subsectionTitle}>12.1 Record-Keeping</Text>
          <Text style={styles.sectionText}>
            – Tamper-evident logs, transaction history, KYC records, and audit trails maintained in compliance with applicable laws.
          </Text>
          <Text style={styles.subsectionTitle}>12.2 Evidence Preservation</Text>
          <Text style={styles.sectionText}>
            – Records may be preserved and disclosed upon subpoena or court order.
          </Text>
          <Text style={styles.subsectionTitle}>12.3 Cooperation</Text>
          <Text style={styles.sectionText}>
            – Company will cooperate with law enforcement, regulatory authorities, and courts in investigations.
          </Text>
        </Card>

        {/* Section 13: Messages, Content & Moderation */}
        <Card style={styles.sectionCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>13</Text>
            </View>
            <Text style={styles.sectionTitle}>MESSAGES, CONTENT & MODERATION</Text>
          </View>
          <View style={styles.sectionDivider} />
          <Text style={styles.subsectionTitle}>13.1 Message Monitoring</Text>
          <Text style={styles.sectionText}>
            – ParcelBuddy may review, analyze, and moderate messages exchanged on the platform for fraud prevention, compliance, and safety.
          </Text>
          <Text style={styles.subsectionTitle}>13.2 User Undertakings</Text>
          <Text style={styles.sectionText}>
            – Users shall not send messages that:
          </Text>
          <Text style={styles.listItem}>• Violate third-party rights</Text>
          <Text style={styles.listItem}>• Are obscene, defamatory, harassing, or harmful to minors</Text>
          <Text style={styles.listItem}>• Contain malware, viruses, or unauthorized scripts</Text>
          <Text style={styles.listItem}>• Threaten public safety, national security, or foreign relations</Text>
          <Text style={styles.listItem}>• Circumvent booking system or legal obligations</Text>
          <Text style={styles.subsectionTitle}>13.3 Enforcement</Text>
          <Text style={styles.sectionText}>
            – Violations may result in message deletion, account suspension, or termination.
          </Text>
          <Text style={styles.subsectionTitle}>13.4 Messages between users</Text>
          <Text style={styles.sectionText}>
            – ParcelBuddy may review, scan, and moderate the messages the users exchange with each others through the App in particular for fraud prevention, customer support purposes, enforcement of the contracts entered into with ParcelBuddy's users (such as the Conditions) and ensure compliance with applicable law. For example, in order to prevent the circumventing of its Booking Service, ParcelBuddy may scan and analyse messages sent through the platform to check that they do not include any contact details or references to other websites.
          </Text>
          <Text style={styles.sectionText}>
            By using the Site and accepting the T&C's, the users agree that ParcelBuddy, in its sole discretion, may review, analyse and moderate the messages exchanged through the App.
          </Text>
          <Text style={styles.sectionText}>
            By using the messaging feature of the App, the Users undertake not to write and/or send any message prohibited by applicable law. In particular the users undertakes to refrain from writing/sending any message which content:
          </Text>
          <Text style={styles.listItem}>• belongs to another person and to which the users does not have any right to;</Text>
          <Text style={styles.listItem}>• is grossly harmful, harassing, blasphemous defamatory, obscene, pornographic;</Text>
          <Text style={styles.listItem}>• harms minors in any way;</Text>
          <Text style={styles.listItem}>• infringes any patent, trademark, copyright or other proprietary rights;</Text>
          <Text style={styles.listItem}>• violates any law for the time being in force;</Text>
          <Text style={styles.listItem}>• deceives or misleads the addressee about the origin of such messages or communicates any information which is grossly offensive or menacing in nature;</Text>
          <Text style={styles.listItem}>• impersonates another person;</Text>
          <Text style={styles.listItem}>• contains software viruses that limit the functionality of any computer resource; and</Text>
          <Text style={styles.listItem}>• threatens the unity, integrity, defense, security or sovereignty of India, friendly relations with foreign states, or public order or causes incitement to the commission of any cognizable offence or prevents investigation of any offence or is insulting any other nation.</Text>
          <Text style={styles.sectionText}>
            In addition, the users undertake to send messages only with respect to the booking of goods sending / receiving and in line with the purposes of this App. The users undertake to refrain from using the messages for private or confidential communications.
          </Text>
          <Text style={styles.sectionText}>
            ParcelBuddy reserves the right to filter or delete the messages and suspend or terminate the User Account of the users and the access of the users to the App if it appears during the moderation of the messages sent by the users that s/he does not comply with the Conditions and/or applicable law.
          </Text>
          <Text style={styles.subsectionTitle}>13.5 Contacting users</Text>
          <Text style={styles.sectionText}>
            – By accepting the terms and conditions contained herein, every user hereby agrees and gives consent to ParcelBuddy and its partners to communicate via phone calls, sms, email and such other means as ParcelBuddy may deem fit. Such communications to users may be recorded through technical support provided by third parties for the purpose of training, quality and for regularly updating the users about the services of ParcelBuddy.
          </Text>
          <Text style={styles.subsectionTitle}>13.6 DISCLAIMER OF LIABILITY</Text>
          <Text style={styles.sectionText}>
            – Members may access the Services on the App at their own risk and using their best and prudent judgment before entering into any arrangements with other users through the App. ParcelBuddy / The Company is not liable for any acts, omissions, or breaches of these Terms by other Users. All liability arising from User interactions is expressly disclaimed.
          </Text>
          <Text style={styles.sectionText}>
            ParcelBuddy expressly disclaims any warranties or representations (express or implied) in respect of Trips, accuracy, reliability and completeness of information provided by users, or the content (including details of the Trip and Cost Contribution) on the App. While ParcelBuddy will take precautions to avoid inaccuracies in content of the App, all content and information, are provided on an as is where is basis, without warranty of any kind. ParcelBuddy does not implicitly or explicitly support or endorse any of the users availing Services from the App.
          </Text>
          <Text style={styles.sectionText}>
            ParcelBuddy is not a party to any agreement between a Traveler and Sender and will not be liable to either the Traveler or Sender unless the loss or damage incurred arises due to ParcelBuddy's negligence. ParcelBuddy shall not be liable for any loss or damage arising as a result of:
          </Text>
          <Text style={styles.listItem}>• A false, misleading, inaccurate or incomplete information being provided by a user;</Text>
          <Text style={styles.listItem}>• The cancellation of a Trip by a Traveler or Sender;</Text>
          <Text style={styles.listItem}>• Any failure to make payment of a Cost Contribution (for the free service without booking);</Text>
          <Text style={styles.listItem}>• Any fraud, fraudulent misrepresentation or breach of duty or breach of any of these conditions by a Traveler or Sender before, during or after a Trip.</Text>
          <Text style={styles.sectionText}>
            ParcelBuddy will not be liable to any user for any business, financial or economic loss or for any consequential or indirect loss such as lost reputation, lost bargain, lost profit, lost of anticipated savings or lost opportunity arising as a result of the services provided by ParcelBuddy (whether suffered or incurred as a result of the ParcelBuddy's negligence or otherwise) except in the case of fraud, wilful concealment or theft.
          </Text>
          <Text style={styles.sectionText}>
            ParcelBuddy will not be liable to any user in relation to any Trip.
          </Text>
          <Text style={styles.sectionText}>
            Given that Travelers are required to hold valid insurance to cover a Trip and given that ParcelBuddy's service is limited to putting Travelers and Senders in touch with each other and cannot oversee any Trip, users accept that the limitations on the ParcelBuddy's liability set out above are reasonable.
          </Text>
        </Card>

        {/* Section 14: Warranties & Disclaimers */}
        <Card style={styles.sectionCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>14</Text>
            </View>
            <Text style={styles.sectionTitle}>WARRANTIES & DISCLAIMERS</Text>
          </View>
          <View style={styles.sectionDivider} />
          <Text style={styles.subsectionTitle}>14.1 No Warranty</Text>
          <Text style={styles.sectionText}>
            – The App and Services are provided "as is" without warranty of merchantability, fitness for purpose, or non-infringement.
          </Text>
          <Text style={styles.subsectionTitle}>14.2 Third-Party Services</Text>
          <Text style={styles.sectionText}>
            – ParcelBuddy is not liable for third-party service acts, including airlines, Payment Providers, or customs.
          </Text>
          <Text style={styles.subsectionTitle}>14.3 User Warranty</Text>
          <Text style={styles.sectionText}>
            – Users warrant lawful use and compliance with Terms.
          </Text>
        </Card>

        {/* Section 15: Limitation of Liability */}
        <Card style={styles.sectionCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>15</Text>
            </View>
            <Text style={styles.sectionTitle}>LIMITATION OF LIABILITY; CAPS; REMEDIES</Text>
          </View>
          <View style={styles.sectionDivider} />
          <Text style={styles.subsectionTitle}>15.1 Liability Cap</Text>
          <Text style={styles.sectionText}>
            – Aggregate liability capped at total subscription fees paid in preceding 12 months or INR [●], whichever is lower.
          </Text>
          <Text style={styles.subsectionTitle}>15.2 Excluded Damages</Text>
          <Text style={styles.sectionText}>
            – No liability for indirect, special, incidental, or consequential losses, including loss of profit, opportunity, or reputation.
          </Text>
          <Text style={styles.subsectionTitle}>15.3 Non-excludable Liabilities</Text>
          <Text style={styles.sectionText}>
            – Liability for death or personal injury due to gross negligence or willful misconduct is not excluded.
          </Text>
          <Text style={styles.subsectionTitle}>15.4 Exclusive Remedy</Text>
          <Text style={styles.sectionText}>
            – Repair, replacement, or refund in accordance with Annexure B.
          </Text>
        </Card>

        {/* Section 16: Indemnity */}
        <Card style={styles.sectionCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>16</Text>
            </View>
            <Text style={styles.sectionTitle}>INDEMNITY</Text>
          </View>
          <View style={styles.sectionDivider} />
          <Text style={styles.subsectionTitle}>16.1 User Indemnity</Text>
          <Text style={styles.sectionText}>
            – Users indemnify the App and the Company against claims, damages, losses, costs (including legal fees) arising from:
          </Text>
          <Text style={styles.listItem}>• Violation of Terms</Text>
          <Text style={styles.listItem}>• Carriage of prohibited Goods</Text>
          <Text style={styles.listItem}>• Negligence, misrepresentation, or unlawful acts</Text>
          <Text style={styles.listItem}>• Disputes with other Users</Text>
          <Text style={styles.sectionText}>
            The User shall indemnify and hold harmless the App and the Company and its officers, employees, agents and affiliates against any and all claims, losses, damages, liabilities, costs and expenses (including reasonable legal fees) arising out of or relating to: (a) User's breach of these Terms; (b) User's violation of applicable law; (c) carriage or attempted carriage of prohibited Goods; (d) any user-to-user dispute; or (e) User's negligence or willful misconduct.
          </Text>
          <Text style={styles.subsectionTitle}>16.2 Procedure</Text>
          <Text style={styles.sectionText}>
            – Company will notify Users promptly; Users shall defend and settle at their cost, with Company consent.
          </Text>
        </Card>

        {/* Section 17: Insurance & Risk Allocation */}
        <Card style={styles.sectionCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>17</Text>
            </View>
            <Text style={styles.sectionTitle}>INSURANCE & RISK ALLOCATION</Text>
          </View>
          <View style={styles.sectionDivider} />
          <Text style={styles.subsectionTitle}>17.1 No Company Insurance</Text>
          <Text style={styles.sectionText}>
            – ParcelBuddy does not insure personal property or liabilities.
          </Text>
          <Text style={styles.subsectionTitle}>17.2 User Insurance Recommendation</Text>
          <Text style={styles.sectionText}>
            – Users are advised to maintain appropriate insurance for Goods and travel risks.
          </Text>
          <Text style={styles.subsectionTitle}>17.3 Risk Transfer</Text>
          <Text style={styles.sectionText}>
            – Custody and risk of Goods remain with the responsible User at all times; the Company bears no risk.
          </Text>
        </Card>

        {/* Section 18: Suspension, Termination & Consequences */}
        <Card style={styles.sectionCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>18</Text>
            </View>
            <Text style={styles.sectionTitle}>SUSPENSION, TERMINATION & CONSEQUENCES</Text>
          </View>
          <View style={styles.sectionDivider} />
          <Text style={styles.subsectionTitle}>18.1 Suspension</Text>
          <Text style={styles.sectionText}>
            – Company may suspend access for suspected breaches, fraud, safety concerns, or legal process.
          </Text>
          <Text style={styles.subsectionTitle}>18.2 Termination</Text>
          <Text style={styles.sectionText}>
            – Accounts may be terminated for repeated or material violations without affecting accrued rights.
          </Text>
          <Text style={styles.subsectionTitle}>18.3 Survival</Text>
          <Text style={styles.sectionText}>
            – Obligations for payments, indemnities, IP, data retention, and liability limitations survive termination.
          </Text>
        </Card>

        {/* Section 19: Force Majeure */}
        <Card style={styles.sectionCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>19</Text>
            </View>
            <Text style={styles.sectionTitle}>FORCE MAJEURE</Text>
          </View>
          <View style={styles.sectionDivider} />
          <Text style={styles.subsectionTitle}>19.1 Definition</Text>
          <Text style={styles.sectionText}>
            – Events beyond reasonable control: natural disasters, pandemics, strikes, cyberattacks, government actions.
          </Text>
          <Text style={styles.subsectionTitle}>19.2 Effect</Text>
          <Text style={styles.sectionText}>
            – Performance delayed or excused; parties must make reasonable efforts to resume.
          </Text>
          <Text style={styles.subsectionTitle}>19.3 Termination Option</Text>
          <Text style={styles.sectionText}>
            – If force majeure persists >90 days, either party may terminate with written notice.
          </Text>
        </Card>

        {/* Section 20: Governing Law, Dispute Resolution & Jurisdiction */}
        <Card style={styles.sectionCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>20</Text>
            </View>
            <Text style={styles.sectionTitle}>GOVERNING LAW, DISPUTE RESOLUTION & JURISDICTION</Text>
          </View>
          <View style={styles.sectionDivider} />
          <Text style={styles.subsectionTitle}>20.1 Governing Law</Text>
          <Text style={styles.sectionText}>
            – Indian law, including Indian Contract Act, 1872; IT Act, 2000; DPDP Act, 2023; DGCA and Customs regulations.
          </Text>
          <Text style={styles.subsectionTitle}>20.2 Pre-Litigation & ADR</Text>
          <Text style={styles.sectionText}>
            – Parties shall attempt good faith negotiation for 30 days. If unresolved, mediation or arbitration under Arbitration & Conciliation Act, 1996.
          </Text>
          <Text style={styles.subsectionTitle}>20.3 Jurisdiction</Text>
          <Text style={styles.sectionText}>
            – Courts of Mohali, Punjab, India shall have exclusive jurisdiction
          </Text>
          <Text style={styles.subsectionTitle}>20.4 Management of Disputes Between Users</Text>
          <Text style={styles.sectionText}>
            – ParcelBuddy may at its sole discretion provide its users with an online service for resolving disputes. This service is non-binding. ParcelBuddy is under no obligation to seek to resolve disputes and this service is offered at ParcelBuddy's sole discretion and may be withdrawn at any time.
          </Text>
        </Card>

        {/* Section 21: Notices & Grievance Redressal */}
        <Card style={styles.sectionCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>21</Text>
            </View>
            <Text style={styles.sectionTitle}>NOTICES & GRIEVANCE REDRESSAL</Text>
          </View>
          <View style={styles.sectionDivider} />
          <Text style={styles.subsectionTitle}>21.1 Notices</Text>
          <Text style={styles.sectionText}>
            – To Company: registered office or contact@parcelbuddys.com; To Users: registered email or in-app messaging.
          </Text>
          <Text style={styles.subsectionTitle}>21.2 Grievance Procedure</Text>
          <Text style={styles.sectionText}>
            – Complaints under IT Rules or DPDP sent to Grievance Officer; acknowledgement within 4 working days; resolution as per Annexure E.
          </Text>
          <Text style={styles.subsectionTitle}>21.3 Emergency Disclosure</Text>
          <Text style={styles.sectionText}>
            – Company may disclose User data in legal or emergency circumstances.
          </Text>
        </Card>

        {/* Section 22: Miscellaneous */}
        <Card style={styles.sectionCard} padding={20}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionNumber}>
              <Text style={styles.sectionNumberText}>22</Text>
            </View>
            <Text style={styles.sectionTitle}>MISCELLANEOUS</Text>
          </View>
          <View style={styles.sectionDivider} />
          <Text style={styles.subsectionTitle}>22.1 Assignment</Text>
          <Text style={styles.sectionText}>
            – Company may assign rights; Users may not without prior written consent.
          </Text>
          <Text style={styles.subsectionTitle}>22.2 Severability</Text>
          <Text style={styles.sectionText}>
            – Invalid provision does not affect the remainder of Terms.
          </Text>
          <Text style={styles.subsectionTitle}>22.3 Non-Waiver</Text>
          <Text style={styles.sectionText}>
            – Failure to enforce a right does not constitute waiver.
          </Text>
          <Text style={styles.subsectionTitle}>22.4 Third-Party Rights</Text>
          <Text style={styles.sectionText}>
            – No third-party beneficiaries unless expressly stated.
          </Text>
        </Card>

        {/* Annexure A: Privacy & Cookies Policy */}
        <Card style={styles.annexureCard} padding={20}>
          <View style={styles.annexureHeader}>
            <View style={styles.annexureBadge}>
              <Text style={styles.annexureBadgeText}>A</Text>
            </View>
            <Text style={styles.annexureTitle}>PRIVACY & COOKIES POLICY</Text>
          </View>
          <Text style={styles.annexureSubtitle}>(Comprehensive DPDP & IT Rules Compliant)</Text>
          <View style={styles.sectionDivider} />
          <Text style={styles.subsectionTitle}>1. Purpose & Applicability</Text>
          <Text style={styles.sectionText}>
            This Privacy & Cookies Policy governs all personal data processed by ParcelBuddy through its mobile and web platforms. It outlines the lawful basis, purpose of processing, user rights, retention, security, and cookie usage as per the Digital Personal Data Protection Act, 2023, Information Technology Act, 2000, and IT (Intermediary Guidelines & Digital Media Ethics Code) Rules, 2021.
          </Text>
          <Text style={styles.subsectionTitle}>2. Lawful Basis of Processing</Text>
          <Text style={styles.sectionText}>
            ParcelBuddy processes personal data based on:
          </Text>
          <Text style={styles.listItem}>• User consent (collected through app forms and pop-ups);</Text>
          <Text style={styles.listItem}>• Contractual necessity for account creation, booking, and KYC;</Text>
          <Text style={styles.listItem}>• Legal obligations under KYC, AML, and tax laws;</Text>
          <Text style={styles.listItem}>• Legitimate interest for security, fraud detection, and analytics.</Text>
          <Text style={styles.subsectionTitle}>3. Categories of Data Collected and Processing of Information</Text>
          <Text style={styles.sectionText}>
            • Identification Data: Name, contact details, ID proofs (Aadhaar, PAN, Passport).
          </Text>
          <Text style={styles.sectionText}>
            • Transactional Data: Payment details, transaction IDs, invoices.
          </Text>
          <Text style={styles.sectionText}>
            • Device & Log Data: IP address, device type, cookies, browser data, session time.
          </Text>
          <Text style={styles.sectionText}>
            • Communication Data: Messages, emails, and feedback shared via the App.
          </Text>
          <Text style={styles.sectionText}>
            • Location Data: Optional location access for route mapping and security verification.
          </Text>
          <Text style={styles.sectionText}>
            We may collect and process the following categories of data concerning you, which may include Personal Information and other information that, individually or combined, may uniquely identify you ("Identifiable Data"):
          </Text>
          <Text style={styles.listItem}>a. Identification and Verification Data: Documentation and associated details required for registration or service access, including, but not limited to, your name, residential address (including postal codes), date of birth, Passport, PAN card, AADHAR card, Driver's License, or any other government issues id.</Text>
          <Text style={styles.listItem}>b. Account Credentials: Your electronic mail address and password necessary for secure access.</Text>
          <Text style={styles.listItem}>c. Contact Information: A mobile telephone number and email address.</Text>
          <Text style={styles.listItem}>d. Communications Record: A documented record of all correspondence and communications exchanged between you and us.</Text>
          <Text style={styles.listItem}>e. Transactional History (Platform): A record of any bookings executed or advertisements placed by you on or through the app.</Text>
          <Text style={styles.listItem}>f. Research Data: Your responses and feedback to any surveys, questionnaires, or similar instruments utilized by us for research and analytical purposes.</Text>
          <Text style={styles.listItem}>g. Financial and Payment Data: Details pertaining to accounting or financial transactions, including those executed via the app or other channels. This shall encompass, but not be limited to, your credit card, debit card, UPI id or bank account details, and records of all Trips (as defined in our Conditions) booked or offered via the app.</Text>
          <Text style={styles.listItem}>h. Usage and Access Details: Specific details concerning your visits to and interaction with the app, including the resources and functionality you access.</Text>
          <Text style={styles.listItem}>i. Technical Support Data: Information required from you when reporting any issue or malfunction encountered with the app.</Text>
          <Text style={styles.listItem}>j. Third-Party Data: Information concerning you that we may lawfully obtain or receive from other third-party sources.</Text>
          <Text style={styles.sectionText}>
            Voluntary Submission and Obligation - We shall only collect the aforementioned information when you elect to provide it to us. You retain the right to withhold any Personal Information; however, such withholding may preclude you from utilizing or accessing the entirety of the services offered by us.
          </Text>
          <Text style={styles.sectionText}>
            Non-Voluntary Data Collection - Data is also aggregated without your active submission through the application of various technologies and methodologies, such as Internet Protocol (IP) addresses and cookies. These methodologies are designed not to collect or retain Personal Information.
          </Text>
          <Text style={styles.sectionText}>
            Definition and Nature of IP Addresses - An IP address is a unique numerical identifier assigned to your computing device by your Internet Service Provider (ISP) to enable Internet access. It is generally regarded as non-personally identifiable information because, in the majority of instances, it can only be traced back to your ISP or the organizational entity responsible for your internet access.
          </Text>
          <Text style={styles.sectionText}>
            Utilization of IP Addresses - We utilize your IP address for essential technical functions, including, but not limited to: diagnosing server-side issues, reporting aggregated operational metrics, determining the most efficient connection route for your device, and the general administration and improvement of the app.
          </Text>
          <Text style={styles.subsectionTitle}>4. Purpose of Collection</Text>
          <Text style={styles.sectionText}>
            Data is collected and processed for:
          </Text>
          <Text style={styles.listItem}>• Account creation, verification & KYC compliance.</Text>
          <Text style={styles.listItem}>• Subscription, billing, and payment processing.</Text>
          <Text style={styles.listItem}>• Booking management between Travelers and Senders.</Text>
          <Text style={styles.listItem}>• Safety, fraud prevention, and dispute resolution.</Text>
          <Text style={styles.listItem}>• Improving app performance and user experience.</Text>
          <Text style={styles.listItem}>• Regulatory, tax, and legal compliance.</Text>
          <Text style={styles.subsectionTitle}>5. Data Sharing & Disclosure</Text>
          <Text style={styles.sectionText}>
            Data may be shared with:
          </Text>
          <Text style={styles.listItem}>• KYC/AML providers, payment gateways, and hosting services;</Text>
          <Text style={styles.listItem}>• Analytics tools (e.g., Firebase, Google Analytics) for performance optimization;</Text>
          <Text style={styles.listItem}>• Regulatory or law enforcement authorities when legally mandated;</Text>
          <Text style={styles.listItem}>• Affiliates and contractors under strict confidentiality agreements.</Text>
          <Text style={styles.sectionText}>
            ParcelBuddy does not sell, rent, or trade personal data to third parties for marketing.
          </Text>
          <Text style={styles.subsectionTitle}>6. Cookies Policy</Text>
          <Text style={styles.sectionText}>
            Like nearly all websites, we use cookies in order to provide you with a more personalized service. We are unable to operate all of the functionality of the site without using cookies. In compliance with prevailing regulatory requirements, we are obligated to secure your consent for the processing of data via cookies. Your confirmation and acceptance of our Terms and Conditions at the point of user account registration shall constitute your full and informed consent to the use of all cookies detailed herein. ParcelBuddy uses cookies and similar technologies to:
          </Text>
          <Text style={styles.listItem}>• Remember user preferences and login sessions;</Text>
          <Text style={styles.listItem}>• Improve functionality and speed;</Text>
          <Text style={styles.listItem}>• Measure traffic, performance, and analytics.</Text>
          <Text style={styles.sectionText}>
            A cookie is a small file stored on your mobile device / computer that holds data about your online activity but does not contain any personal information you submit to our app. We use cookies to track your journey through our app so we can make improvements based on how people use it. Cookies also keep you logged in to our services, helping us give you a better, more customized experience. Our access to the cookie ends as soon as you close your browser. Your web browser is usually set to accept cookies automatically, but you can change your advanced settings at any time if you prefer to decline cookies.
          </Text>
          <Text style={styles.sectionText}>
            Types of Cookies Used:
          </Text>
          <Text style={styles.listItem}>• Essential Cookies: Required for site operation and login security.</Text>
          <Text style={styles.listItem}>• Analytical Cookies: Track usage trends (via Google Analytics).</Text>
          <Text style={styles.listItem}>• Functional Cookies: Remember settings, preferences, and location.</Text>
          <Text style={styles.listItem}>• Advertising Cookies: (if applicable) used only with user consent.</Text>
          <Text style={styles.sectionText}>
            Users can manage or delete cookies anytime via browser settings. Consent banners are displayed on first visit as per DPDP consent requirements.
          </Text>
          <Text style={styles.subsectionTitle}>7. Data Retention & Storage</Text>
          <Text style={styles.listItem}>• Active account data is retained during account lifetime plus six (6) months post-deletion.</Text>
          <Text style={styles.listItem}>• KYC and transaction data retained for a minimum 5 years or as per statutory mandate.</Text>
          <Text style={styles.listItem}>• Backup data retained securely and purged in regular cycles.</Text>
          <Text style={styles.subsectionTitle}>8. Security Safeguards</Text>
          <Text style={styles.sectionText}>
            ParcelBuddy implements:
          </Text>
          <Text style={styles.listItem}>• Data encryption (AES-256 standard) for all storage and transfer;</Text>
          <Text style={styles.listItem}>• Role-based access control and audit trails;</Text>
          <Text style={styles.listItem}>• Secure cloud infrastructure (ISO 27001 certified);</Text>
          <Text style={styles.listItem}>• Regular vulnerability assessments and penetration testing.</Text>
          <Text style={styles.sectionText}>
            Absolute security cannot be guaranteed; however, best industry practices are followed.
          </Text>
          <Text style={styles.sectionText}>
            This app may contain links and references to other websites. Please be aware that this Privacy Policy does not apply to those websites. We cannot be responsible for the privacy policies and practices of sites that are not operated by us, even if you access them via the app. We recommend that you check the policy of each site you visit and contact its owner or operator if you have any concerns or questions. In addition, if you came to this app via a third party site, we cannot be responsible for the privacy policies and practices of the owners or operators of that third party site and recommend that you check the policy of that third party site and contact its owner or operator if you have any concerns or questions.
          </Text>
          <Text style={styles.subsectionTitle}>9. User Rights under DPDP Act</Text>
          <Text style={styles.sectionText}>
            Users may exercise the following rights via contact@parcelbuddys.com:
          </Text>
          <Text style={styles.listItem}>• Right to access, confirm, and correct data;</Text>
          <Text style={styles.listItem}>• Right to withdraw consent;</Text>
          <Text style={styles.listItem}>• Right to erasure (subject to legal retention obligations);</Text>
          <Text style={styles.listItem}>• Right to grievance redressal and data portability where applicable.</Text>
          <Text style={styles.sectionText}>
            Requests are acknowledged within 4 working days and resolved within 30 days as per DPDP timelines.
          </Text>
          <Text style={styles.subsectionTitle}>10. Cross-Border Data Transfer</Text>
          <Text style={styles.sectionText}>
            Data may be transferred to secure servers outside India for processing or storage with adequate protection measures in line with the DPDP Act, 2023. We may also share information with other equivalent national bodies, which may be located in countries worldwide. If you use the Site while you are outside India, your information may be transferred outside India in order to provide you with those services. By submitting your personal information to us you agree to the transfer, storing or processing of your information within and outside India.
          </Text>
          <Text style={styles.subsectionTitle}>11. Breach Notification</Text>
          <Text style={styles.sectionText}>
            In the event of a personal data breach, the Company will:
          </Text>
          <Text style={styles.listItem}>• Notify affected users and the Data Protection Board (if constituted);</Text>
          <Text style={styles.listItem}>• Undertake immediate remedial and containment steps;</Text>
          <Text style={styles.listItem}>• Maintain records of breach reports and actions taken.</Text>
          <Text style={styles.subsectionTitle}>12. Updates to this Policy</Text>
          <Text style={styles.sectionText}>
            ParcelBuddy may update this Privacy & Cookies Policy from time to time. Revised versions will be published on the App. Continued use after updates constitutes acceptance.
          </Text>
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
  // Title Card Styles
  titleCard: {
    backgroundColor: Colors.backgroundWhite,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryCyan + '20',
  },
  titleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryCyan + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: Fonts.xxl,
    fontWeight: Fonts.weightBold,
    color: Colors.primaryCyan,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightMedium,
    color: Colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 16,
  },
  introText: {
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
  },
  // Table of Contents Card
  tocCard: {
    backgroundColor: Colors.backgroundGray,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tocTitle: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightBold,
    color: Colors.primaryCyan,
    marginBottom: 16,
    textAlign: 'center',
  },
  tocContent: {
    gap: 8,
  },
  tocItem: {
    fontSize: Fonts.sm,
    color: Colors.textPrimary,
    lineHeight: 20,
    paddingLeft: 8,
  },
  // Section Card Styles
  sectionCard: {
    backgroundColor: Colors.backgroundWhite,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryCyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionNumberText: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightBold,
    color: Colors.textWhite,
  },
  sectionTitle: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    flex: 1,
  },
  sectionDivider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.borderLight,
    marginBottom: 16,
  },
  sectionText: {
    fontSize: Fonts.base,
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: 12,
  },
  listContainer: {
    marginTop: 8,
    paddingLeft: 8,
  },
  listItem: {
    fontSize: Fonts.base,
    color: Colors.textPrimary,
    lineHeight: 24,
    marginBottom: 10,
    paddingLeft: 4,
  },
  subsectionTitle: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.primaryCyan,
    marginTop: 16,
    marginBottom: 8,
  },
  // Annexure Card Styles
  annexureCard: {
    backgroundColor: Colors.backgroundGray,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.primaryCyan + '30',
  },
  annexureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  annexureBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryCyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  annexureBadgeText: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightBold,
    color: Colors.textWhite,
  },
  annexureTitle: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightBold,
    color: Colors.primaryCyan,
    flex: 1,
  },
  annexureSubtitle: {
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 12,
    paddingLeft: 52,
  },
});

export default TermsAndPolicyScreen;

