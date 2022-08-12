/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NativeBaseProvider} from 'native-base';
import HomeScreen from './src/screens/Home';
import SignIn from './src/screens/SignIn';
import Login from './src/screens/LogIn';
import OrdersScreen from './src/screens/Orders';

const App = () => {
  // const [open, setOpen] = React.useState(false);

  // const client = new ApolloClient({
  //   uri: `https://${'https://javisaacmv.myshopify.com/'}.myshopify.com/api/2022-07/graphql.json`,
  //   cache: new InMemoryCache(),
  // });

  const httpLink = createHttpLink({
    uri: `https://${'javisaacmv'}.myshopify.com/api/2022-07/graphql.json`,
  });

  const Stack = createNativeStackNavigator();

  const authLink = setContext((_, {headers}) => {
    // get the authentication token from local storage if it exists

    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        'X-Shopify-Storefront-Access-Token': 'ffc2d23de55953ebfbe64f6ec058611c',
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <NativeBaseProvider>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Orders" component={OrdersScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </ApolloProvider>
    </NativeBaseProvider>
  );
};

export default App;
