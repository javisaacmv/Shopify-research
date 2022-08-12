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
import {CREATE_CUSTOMER} from '../graphql/mutations';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = () => {
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [confirmPass, setConfirmPass] = React.useState('');
  const navigation = useNavigation();
  const [createCustomer] = useMutation(CREATE_CUSTOMER);

  const onSubmit = async () => {
    if (pass === confirmPass) {
      try {
        const customer = await createCustomer({
          variables: {
            input: {
              email,
              password: pass,
            },
          },
        });
        console.log(customer.data.customerCreate);
      } catch (err: any) {
        console.log(err.message);
      }
    }
    navigation.navigate('Login');
  };

  const getToken = async () => {
    const token = await AsyncStorage.getItem('customer_token');
    if (token) {
      navigation.navigate('Home');
    }
  };

  React.useEffect(() => {
    getToken();
  }, []);

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
          <FormControl>
            <FormControl.Label>Confirm Password</FormControl.Label>
            <Input
              type="password"
              value={confirmPass}
              onChangeText={setConfirmPass}
            />
          </FormControl>
          <Button mt="2" colorScheme="indigo" onPress={onSubmit}>
            Sign up
          </Button>
          <Button
            mt="2"
            variant="link"
            onPress={() => navigation.navigate('Login')}>
            go to Login
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default SignIn;
