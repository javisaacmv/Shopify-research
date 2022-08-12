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
  Center,
  Modal,
  FormControl,
  Input,
} from 'native-base';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {
  CAR_CREATE,
  CHECKOUT_COMPLETE_FREE,
  CREATE_CHECKOUT,
} from '../graphql/mutations';
import {GET_PRODUCTS} from '../graphql/queries';
import Realm from 'realm';
import {
  BuyerIdentitySchema,
  CheckoutSchema,
  LineItemsSchema,
  ShippingAddressSchema,
} from '../schemas';

const OrdersScreen = () => {
  const {loading, error, data} = useQuery(GET_PRODUCTS, {
    variables: {first: 20},
  });

  const [createCartMutation] = useMutation(CAR_CREATE);
  const [onSetShipping, setOnSetShipping] = React.useState<any | null>(null);
  const [shippingAddress, setShippingAddress] = React.useState<any | null>(
    null,
  );
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

  const [orders, setOrders] = React.useState([]);

  const getOrders = async () => {
    try {
      const realm = await Realm.open({
        path: 'myrealm',
        schemaVersion: 2,
        schema: [
          CheckoutSchema,
          BuyerIdentitySchema,
          LineItemsSchema,
          ShippingAddressSchema,
        ],
      });
      const ords = realm.objects('Checkout');
      console.log(ords);
      setOrders(ords);
    } catch (err) {
      console.error('Failed to open the realm', err.message);
    }
  };

  const [createCheckoutMutation] = useMutation(CREATE_CHECKOUT);
  const [completeCheckoutMutation] = useMutation(CHECKOUT_COMPLETE_FREE);

  const updateCheckout = async (checkout: any) => {
    console.log(checkout);
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

    let newCheckout;
    realm.write(() => {
      newCheckout = realm.create(
        'Checkout',
        {...checkout, shippingAddress, _id: checkout['_id']},
        'modified',
      );

      console.log(newCheckout);
    });

    setOnSetShipping(false);
  };

  const createCheckout = async (order: any) => {
    const {_id, ...checkoutCreateInfo} = order;
    const check = await createCheckoutMutation({
      variables: {input: checkoutCreateInfo},
    });
    const checkoutId = check?.data?.checkoutCreate?.checkout.id;

    const complete = await completeCheckoutMutation({variables: {checkoutId}});
    console.log('CHECK:', check?.data?.checkoutCreate?.checkout);
    console.log(complete?.data?.checkoutCompleteFree.checkout);
  };

  React.useEffect(() => {
    getOrders();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }
  if (error) {
    return <Text>`Error! ${error.message}`;</Text>;
  }

  // console.log(onSetShipping);

  return (
    <Box>
      <Center>
        <Modal isOpen={!!onSetShipping} onClose={() => setOnSetShipping(null)}>
          <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Contact Us</Modal.Header>
            <Modal.Body>
              <FormControl>
                <FormControl.Label>Address</FormControl.Label>
                <Input
                  value={shippingAddress?.address1 || ''}
                  onChangeText={text =>
                    setShippingAddress({
                      ...shippingAddress,
                      address1: text,
                    })
                  }
                />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>City</FormControl.Label>
                <Input
                  value={shippingAddress?.city || ''}
                  onChangeText={text =>
                    setShippingAddress({
                      ...shippingAddress,
                      city: text,
                    })
                  }
                />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Country</FormControl.Label>
                <Input
                  value={shippingAddress?.country || ''}
                  onChangeText={text =>
                    setShippingAddress({
                      ...shippingAddress,
                      country: text,
                    })
                  }
                />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>First name</FormControl.Label>
                <Input
                  value={shippingAddress?.firstName || ''}
                  onChangeText={text =>
                    setShippingAddress({
                      ...shippingAddress,
                      firstName: text,
                    })
                  }
                />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Last name</FormControl.Label>
                <Input
                  value={shippingAddress?.lastName || ''}
                  onChangeText={text =>
                    setShippingAddress({
                      ...shippingAddress,
                      lastName: text,
                    })
                  }
                />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>Phone</FormControl.Label>
                <Input
                  value={shippingAddress?.phone || ''}
                  onChangeText={text =>
                    setShippingAddress({
                      ...shippingAddress,
                      phone: text,
                    })
                  }
                />
              </FormControl>
              <FormControl mt="3">
                <FormControl.Label>ZIP</FormControl.Label>
                <Input
                  value={shippingAddress?.zip || ''}
                  onChangeText={text =>
                    setShippingAddress({
                      ...shippingAddress,
                      zip: text,
                    })
                  }
                />
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <Button.Group space={2}>
                <Button
                  variant="ghost"
                  colorScheme="blueGray"
                  onPress={() => {
                    setOnSetShipping(false);
                  }}>
                  Cancel
                </Button>
                <Button onPress={() => updateCheckout(onSetShipping)}>
                  Save
                </Button>
              </Button.Group>
            </Modal.Footer>
          </Modal.Content>
        </Modal>
      </Center>
      <FlatList
        height={'80%'}
        data={orders || []}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <Box
            borderBottomWidth="1"
            _dark={{
              borderColor: 'gray.600',
            }}
            borderColor="coolGray.200"
            pl="4"
            pr="5"
            py="2">
            <HStack space={3} justifyContent="space-between">
              <VStack>
                <Text
                  _dark={{
                    color: 'warmGray.50',
                  }}
                  color="coolGray.800"
                  bold>
                  {`buyer: ${item.email}`}
                </Text>
                <Text
                  color="coolGray.600"
                  _dark={{
                    color: 'warmGray.200',
                  }}>
                  {`number of products: ${item.lineItems[0].quantity}`}
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
                {`Address: ${item.shippingAddress.address1}`}
              </Text>
            </HStack>
            <HStack>
              <Button
                style={{margin: 5}}
                onPress={() => setOnSetShipping(item)}>
                add address
              </Button>
              <Button
                style={{margin: 5}}
                onPress={() => createCheckout(item)}
                disabled={!item.shippingAddress.address1}>
                checkout
              </Button>
            </HStack>
          </Box>
        )}
        keyExtractor={item => item['_id']}
      />
    </Box>
  );
};

export default OrdersScreen;
