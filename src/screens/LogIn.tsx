import {useMutation} from '@apollo/client';
import {
  Box,
  Button,
  Center,
  FormControl,
  Heading,
  Input,
  VStack,
} from 'native-base';
import React from 'react';
import {GET_CUSTOMER_TOKEN} from '../graphql/mutations';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');

  const [getToken] = useMutation(GET_CUSTOMER_TOKEN);
  const navigation = useNavigation();

  const onSubmit = async () => {
    if (pass && email) {
      try {
        const customer = await getToken({
          variables: {
            input: {
              email,
              password: pass,
            },
          },
        });
        console.log(
          customer.data.customerAccessTokenCreate.customerAccessToken
            .accessToken,
        );
        const token =
          customer.data.customerAccessTokenCreate.customerAccessToken
            .accessToken;
        await AsyncStorage.setItem('customer_token', token);
        await AsyncStorage.setItem('customer_email', email);
        navigation.navigate('Home');
      } catch (err: any) {
        console.log(err.message);
      }
    }
  };

  return (
    <Center w="100%">
      <Box safeArea p="2" w="90%" maxW="290" py="8">
        <Heading
          size="lg"
          color="coolGray.800"
          _dark={{
            color: 'warmGray.50',
          }}
          fontWeight="semibold">
          Welcome
        </Heading>
        <Heading
          mt="1"
          color="coolGray.600"
          _dark={{
            color: 'warmGray.200',
          }}
          fontWeight="medium"
          size="xs">
          Sign up to continue!
        </Heading>
        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>Email</FormControl.Label>
            <Input value={email} onChangeText={setEmail} />
          </FormControl>
          <FormControl>
            <FormControl.Label>Password</FormControl.Label>
            <Input type="password" value={pass} onChangeText={setPass} />
          </FormControl>

          <Button mt="2" colorScheme="indigo" onPress={onSubmit}>
            Sign up
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default Login;
