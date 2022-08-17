import React from 'react';
import {
  WebView as WebViewAndroid,
  WebViewNavigation,
} from 'react-native-webview';
import parseQueryParameters from 'parse-url-query-params';
import {View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Multipassify from 'multipassify';

const LoginWebView: React.FC = () => {
  const onNavigationStateChange = (navigationState: WebViewNavigation) => {
    const url = navigationState.url;

    // parseURLParams is a pseudo function.
    // Make sure to write your own function or install a package
    const params = parseQueryParameters(url);
    console.log(navigationState);
    if (params.token) {
      console.log(params.token);
    }
  };

  const userEmail = AsyncStorage.getItem('customer_email');

  var multipassify = new Multipassify('SHOPIFY MULTIPASS SECRET');

  // Create your customer data hash
  var customerData = {email: userEmail};

  // Encode a Multipass token
  var token = multipassify.encode(customerData);

  // Generate a Shopify multipass URL to your shop
  var url = multipassify.generateUrl(
    customerData,
    'yourstorename.myshopify.com',
  );

  AsyncStorage.setItem('customer_multipass_token', token);

  const webviewProps = {
    onNavigationStateChange,
    javaScriptEnabled: true,
    originWhitelist: ['*'],
    source: {
      uri: url,
    },
  };

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{width: 'auto', height: 800}}>
      {url && <WebViewAndroid {...webviewProps} />}
    </View>
  );
};

export default LoginWebView;
