import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  HStack,
  Link,
  Heading,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ApplicationLayout } from '../../../components/utils/applicationLayout';

const Settings = () => {
  return (
    <ApplicationLayout>
      <Box>
        <Heading align={'center'}>
          <Text as="i">Update your information</Text>
        </Heading>
      </Box>
      <Flex align={'center'} justify={'center'}>
        <Box p={6}>
          <UpdateForm />
        </Box>
      </Flex>
    </ApplicationLayout>
  );
};

const UpdateForm = () => {
  const [userName, setUserName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isUserNameInvalid, setUserNameInvalid] = useState(false);
  const [isEmailInvalid, setEmailInvalid] = useState(false);
  const [first, setFirst] = useState(false);

  useEffect(() => {
    const fetchStuff = async () => {
      await fetch('/api/users/')
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Failed');
          }
        })
        .then((data) => {
          setUserName(data.user.userName);
          setFirstName(data.user.firstName);
          setLastName(data.user.lastName);
          setEmail(data.user.email);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchStuff();
  }, [first]);

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

  function validateForm(event: React.SyntheticEvent) {
    if (isEmailInvalid) {
      alert('Email is already associated with an existing account.');
      event.preventDefault();
    } else if (isUserNameInvalid) {
      alert('Please enter a new Username.');
      event.preventDefault();
    }
  }

  return (
    <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
      <form action="/api/users/update/password/false" onSubmit={validateForm} method="post">
        <Stack spacing={4}>
          <HStack spacing={6}>
            <FormControl id="firstName">
              <FormLabel>First Name</FormLabel>
              <Input
                defaultValue={firstName}
                name="firstName"
                type="text"
                variant="filled"
                required
              />
            </FormControl>

            <FormControl id="lastName">
              <FormLabel>Last Name</FormLabel>
              <Input
                defaultValue={lastName}
                name="lastName"
                type="text"
                variant="filled"
                required
              />
            </FormControl>
          </HStack>

          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              defaultValue={email}
              name="email"
              type="email"
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
              defaultValue={userName}
              name="userName"
              type="text"
              variant="filled"
              onBlur={(event) => checkUserName(event.currentTarget.value)}
              required
            />
            {isUserNameInvalid ? <p style={{ color: 'red' }}>Username is taken</p> : ''}
          </FormControl>

          <Link color="blue.500" href="/app/user/password">
            Change Password
          </Link>

          <Stack spacing={10}>
            <Box mt={2}>
              <HStack spacing={2}>
                <Button
                  type="submit"
                  bg={'blue.400'}
                  color={'white'}
                  _hover={{
                    bg: 'blue.500',
                  }}
                  width="full"
                >
                  Submit Changes
                </Button>
              </HStack>
            </Box>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};

export default Settings;
