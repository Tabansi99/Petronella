import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  CSSReset,
  Button,
  Heading,
  Text,
  ThemeProvider,
  CircularProgress,
  theme,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { AppLayout } from '../../components/Layout';

const Create = () => {
  return (
    <AppLayout>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <CreateAccountArea />
      </ThemeProvider>
    </AppLayout>
  );
};

const AccountForm = () => {
  const [isEmailInvalid, setEmailInvalid] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isUserNameInvalid, setUserNameInvalid] = useState(false);

  const checkUserName = async (uName: string) => {
    if (uName.length !== 0) {
      await fetch('/api/validate/user/' + uName)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Failed');
          }
        })
        .then((data) => {
          setUserNameInvalid(data.exists);
        })
        .catch((error) => {
          console.log(error);
          setUserNameInvalid(true);
        });
    }
  };

  const checkEmail = async (uEmail: string) => {
    if (uEmail.length !== 0) {
      await fetch('/api/validate/email/' + uEmail)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Failed');
          }
        })
        .then((data) => {
          setEmailInvalid(data.exists);
        })
        .catch((error) => {
          console.log(error);
          setEmailInvalid(true);
        });
    }
  };

  const matchPassword = async (checkPassword: string) => {
    setConfirmPassword(checkPassword);

    if (password === checkPassword) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  };

  function validateForm(event: React.SyntheticEvent) {
    if (isEmailInvalid) {
      alert('Email is already associated with an existing account.');
      event.preventDefault();
      return false;
    } else if (isUserNameInvalid) {
      alert('Please enter a new Username.');
      event.preventDefault();
      return false;
    } else if (password !== confirmPassword) {
      matchPassword(confirmPassword);
      alert('Ensure Passwords match before submitting.');
      event.preventDefault();
      return false;
    }

    setIsLoading(false);
  }

  return (
    <Box rounded={'lg'} bg="white" boxShadow={'lg'} p={8}>
      <form action="/api/users/new" onSubmit={validateForm} method="post">
        <Stack spacing={4}>
          <FormControl id="firstName">
            <FormLabel>First Name</FormLabel>
            <Input name="firstName" type="text" placeholder="e.g. John" variant="filled" required />
          </FormControl>
          <FormControl id="lastName">
            <FormLabel>Last Name</FormLabel>
            <Input name="lastName" type="text" placeholder="e.g. Doe" variant="filled" required />
          </FormControl>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              name="email"
              type="email"
              placeholder="e.g. johndoe@gmail.com"
              variant="filled"
              onBlur={(event) => checkEmail(event.currentTarget.value)}
              required
            />
            {isEmailInvalid ? (
              <p style={{ color: 'red' }}>Email associated with existing account</p>
            ) : (
              ''
            )}
          </FormControl>

          <FormControl id="userName">
            <FormLabel>Username</FormLabel>
            <Input
              name="userName"
              type="text"
              placeholder="e.g. JohnDoe99"
              variant="filled"
              onBlur={(event) => checkUserName(event.currentTarget.value)}
              required
            />
            {isUserNameInvalid ? <p style={{ color: 'red' }}>Username is taken</p> : ''}
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              name="password"
              type="password"
              onBlur={(event) => setPassword(event.currentTarget.value)}
              required
            />
          </FormControl>
          <FormControl id="matchPassword">
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              onChange={(event) => matchPassword(event.currentTarget.value)}
              required
            />
            {passwordMatch ? '' : <p style={{ color: 'red' }}>Password does not match</p>}
          </FormControl>
          <Stack spacing={10}>
            <Button
              type="submit"
              bg={'blue.400'}
              color={'white'}
              _hover={{
                bg: 'blue.500',
              }}
              width="full"
              mt={4}
              onClick={() => setIsLoading(true)}
            >
              {isLoading ? (
                <CircularProgress isIndeterminate size="24px" color="teal" />
              ) : (
                'Create Account'
              )}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};

const Headers = () => {
  return (
    <Box textAlign="center">
      <Heading fontSize={'4xl'}>Create your account</Heading>
      <Text fontSize={'lg'}>to take you on your next destination ✈️</Text>
    </Box>
  );
};

const CreateAccountArea = () => {
  return (
    <Flex minH={'100vh'} align={'center'} justify={'center'}>
      <Box p={4}>
        <Headers />
        <AccountForm />
      </Box>
    </Flex>
  );
};

export default Create;
