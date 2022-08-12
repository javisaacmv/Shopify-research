import React from 'react';
import {
  WebView as WebViewAndroid,
  WebViewNavigation,
} from 'react-native-webview';
import parseQueryParameters from 'parse-url-query-params';
import {View} from 'react-native';

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

  const webviewProps = {
    onNavigationStateChange,
    javaScriptEnabled: true,
    originWhitelist: ['*'],
    source: {
      uri: 'https://www.colorindio.com/account/login?return_url=%2Faccount',
    },
  };

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={{width: 'auto', height: 800}}>
      <WebViewAndroid {...webviewProps} />
    </View>
  );
};

export default LoginWebView;
