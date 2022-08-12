import {useMutation, useQuery} from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Box,
  FlatList,
  Heading,
  HStack,
  VStack,
  Text,
  Spacer,
  Button,
} from 'native-base';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {CAR_CREATE} from '../graphql/mutations';
import {GET_PRODUCTS} from '../graphql/queries';
import Realm from 'realm';
import {
  BuyerIdentitySchema,
  CheckoutSchema,
  LineItemsSchema,
  ShippingAddressSchema,
} from '../schemas';
import {useNavigation} from '@react-navigation/native';

const HomeScreen = () => {
  const {loading, error, data} = useQuery(GET_PRODUCTS, {
    variables: {first: 20},
  });

  const [createCartMutation] = useMutation(CAR_CREATE);

  const createCart = async (prodInfo: any) => {
    const token = await AsyncStorage.getItem('customer_token');
    const email = await AsyncStorage.getItem('customer_email');
    const cartInput = {
      buyerIdentity: {
        countryCode: 'MX',
        customerAccessToken: token,
        email,
        phone: null,
      },

      lines: [
        {
          merchandiseId: prodInfo.variants.edges[0].node.id,
          quantity: 1,
          sellingPlanId: null,
        },
      ],
    };
    console.log(cartInput);
    const cart = await createCartMutation({variables: {input: cartInput}});
    console.log(cart?.data.cartCreate.cart);
  };

  const navigation = useNavigation();

  const createCheckout = async (prod: any) => {
    const realm = await Realm.open({
      path: 'myrealm',
      schema: [
        CheckoutSchema,
        BuyerIdentitySchema,
        LineItemsSchema,
        ShippingAddressSchema,
      ],
      schemaVersion: 2,
    });
    const email = await AsyncStorage.getItem('customer_email');
    const checkout = {
      _id: prod.variants.edges[0].node.id,
      allowPartialAddresses: false,
      buyerIdentity: {
        countryCode: 'MX',
      },
      email,
      lineItems: [
        {
          quantity: 1,
          variantId: prod.variants.edges[0].node.id,
        },
      ],
      shippingAddress: {
        address1: '',
        address2: '',
        city: '',
        company: '',
        country: '',
        firstName: '',
        lastName: '',
        phone: '',
        province: '',
        zip: '',
      },
    };
    let newCheckout;
    realm.write(() => {
      newCheckout = realm.create('Checkout', checkout);

      console.log(newCheckout);
    });
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>`Error! ${error.message}`;</Text>;
  }

  return (
    <Box>
      <Button onPress={() => navigation.navigate('Orders')}>To orders</Button>

      <FlatList
        height={'80%'}
        data={data?.products?.edges}
        renderItem={({item}) => (
          <Box
            borderBottomWidth="1"
            _dark={{
              borderColor: 'gray.600',
            }}
            borderColor="coolGray.200"
            pl="4"
            pr="5"
            py="2"
            key={item.node.id}>
            <TouchableOpacity onPress={() => createCheckout(item.node)}>
              <HStack space={3} justifyContent="space-between">
                <VStack>
                  <Text
                    _dark={{
                      color: 'warmGray.50',
                    }}
                    color="coolGray.800"
                    bold>
                    {item.node.title}
                  </Text>
                  <Text
                    color="coolGray.600"
                    _dark={{
                      color: 'warmGray.200',
                    }}>
                    {item.node.description}
                  </Text>
                </VStack>
                <Spacer />
                <Text
                  fontSize="xs"
                  _dark={{
                    color: 'warmGray.50',
                  }}
                  color="coolGray.800"
                  alignSelf="flex-start">
                  {`${item.node.variants.edges[0].node.priceV2.amount}MXN`}
                </Text>
              </HStack>
            </TouchableOpacity>
          </Box>
        )}
        keyExtractor={item => item.id}
      />
    </Box>
  );
};

export default HomeScreen;
