import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Header } from '../../components';
import { ProfileStackParamList } from '../../navigation/ProfileNavigator';
import { Colors } from '../../constants/colors';

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

  const [loading, setLoading] = React.useState(true);

  // Log initial URL
  React.useEffect(() => {
    console.log('🌐 [KYC WebView] Initial URL:', url);
  }, [url]);

  const handleNavigationStateChange = (navState: any) => {
    console.log('🔄 [KYC WebView] Navigation State Changed:', {
      url: navState.url,
      title: navState.title,
      loading: navState.loading,
      canGoBack: navState.canGoBack,
      canGoForward: navState.canGoForward,
    });
    setLoading(navState.loading);
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
      <Header title="KYC Verification" showBackButton />
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

