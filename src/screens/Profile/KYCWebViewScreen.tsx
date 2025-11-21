import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ProfileHeader } from '../../components';
import { ProfileStackParamList } from '../../navigation/ProfileNavigator';
import { Colors } from '../../constants/colors';
import { useToast } from '../../components/Toast';
import { useAuthStore } from '../../services/store';

type KYCWebViewScreenRouteProp = {
  key: string;
  name: 'KYCWebView';
  params: ProfileStackParamList['KYCWebView'];
};

type KYCWebViewScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'KYCWebView'>;

const KYCWebViewScreen: React.FC = () => {
  const route = useRoute<KYCWebViewScreenRouteProp>();
  const navigation = useNavigation<KYCWebViewScreenNavigationProp>();
  const { url } = route.params;
  const { showSuccess, showInfo } = useToast();
  const { user, setUser } = useAuthStore();

  const [loading, setLoading] = React.useState(true);
  const statusCheckedRef = React.useRef(false);

  // Log initial URL
  React.useEffect(() => {
    console.log('🌐 [KYC WebView] Initial URL:', url);
  }, [url]);

  // Check URL for status parameters
  const checkStatusInUrl = (urlToCheck: string) => {
    if (!urlToCheck || statusCheckedRef.current) return;
    
    console.log('🔍 [KYC WebView] Checking URL for status:', urlToCheck);
    
    // Check for status=In+Review or status=In%20Review (URL encoded)
    if (urlToCheck.includes('status=In+Review') || urlToCheck.includes('status=In%20Review')) {
      console.log('✅ [KYC WebView] Status detected: In Review');
      statusCheckedRef.current = true;
      showInfo('Your KYC verification is under review. We will notify you once it\'s processed.');
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
      return;
    }
    
    // Check for status=Approved
    if (urlToCheck.includes('status=Approved')) {
      console.log('✅ [KYC WebView] Status detected: Approved');
      statusCheckedRef.current = true;
      setUser({ ...user, is_kyc_verified: true });
      showSuccess('Your KYC verification has been approved!');
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
      return;
    }
  };

  const handleNavigationStateChange = (navState: any) => {
    console.log('🔄 [KYC WebView] Navigation State Changed:', {
      url: navState.url,
      title: navState.title,
      loading: navState.loading,
      canGoBack: navState.canGoBack,
      canGoForward: navState.canGoForward,
    });
    setLoading(navState.loading);
    
    // Check URL for status when navigation completes
    if (!navState.loading && navState.url) {
      checkStatusInUrl(navState.url);
    }
  };

  const handleLoadStart = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.log('📥 [KYC WebView] Load Start:', {
      url: nativeEvent.url,
      navigationType: nativeEvent.navigationType,
      target: nativeEvent.target,
    });
  };

  const handleLoadEnd = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.log('✅ [KYC WebView] Load End:', {
      url: nativeEvent.url,
      title: nativeEvent.title,
      loading: nativeEvent.loading,
    });
    
    // Check URL for status when page finishes loading
    if (nativeEvent.url) {
      checkStatusInUrl(nativeEvent.url);
    }
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('❌ [KYC WebView] Error:', {
      url: nativeEvent.url,
      code: nativeEvent.code,
      description: nativeEvent.description,
      domain: nativeEvent.domain,
    });
  };

  const handleHttpError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('🚫 [KYC WebView] HTTP Error:', {
      url: nativeEvent.url,
      statusCode: nativeEvent.statusCode,
      description: nativeEvent.description,
    });
  };

  const handleShouldStartLoadWithRequest = (request: any) => {
    console.log('🔍 [KYC WebView] Should Start Load:', {
      url: request.url,
      navigationType: request.navigationType,
      mainDocumentURL: request.mainDocumentURL,
    });
    
    // Check URL for status before allowing navigation
    if (request.url) {
      // If URL contains status parameter, block navigation and handle status
      if (request.url.includes('status=')) {
        console.log('🚫 [KYC WebView] URL contains status parameter, blocking navigation');
        checkStatusInUrl(request.url);
        return false; // Block navigation
      }
    }
    
    return true; // Allow navigation
  };

  const handleMessage = (event: any) => {
    console.log('💬 [KYC WebView] Message from Web:', {
      data: event.nativeEvent.data,
      url: event.nativeEvent.url,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ProfileHeader title="KYC Verification" />
      <View style={styles.webViewContainer}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primaryCyan} />
          </View>
        )}
        <WebView
          source={{ uri: url }}
          onNavigationStateChange={handleNavigationStateChange}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          onHttpError={handleHttpError}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          onMessage={handleMessage}
          style={styles.webView}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primaryCyan} />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
    backgroundColor: Colors.backgroundWhite,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundWhite,
  },
});

export default KYCWebViewScreen;

