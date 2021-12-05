import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Flex,
  VStack,
  Heading,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { ApplicationLayout } from '../../../components/utils/applicationLayout';

const Password = () => {
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
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordConfirmed, setPasswordConfirmed] = useState(true);

  const matchPassword = (checkPassword: string) => {
    setConfirmPassword(checkPassword);

    if (password === checkPassword) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  };

  const validatePassword = async (ePassword: string) => {
    if (ePassword.length !== 0) {
      await fetch('/api/validate/password/' + ePassword)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Failed');
          }
        })
        .then((data) => {
          setPasswordConfirmed(data.matches);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  function validateForm(event: React.SyntheticEvent) {
    if (password !== confirmPassword) {
      matchPassword(confirmPassword);
      alert('Ensure Passwords match before submitting.');
      event.preventDefault();
      return false;
    } else if (!passwordConfirmed) {
      matchPassword(confirmPassword);
      alert('Current Password is Incorrect.');
      event.preventDefault();
      return false;
    }
  }

  return (
    <Box rounded={'lg'} bg={'white'} boxShadow={'lg'} p={8}>
      <form
        data-testid="changePasswordForm"
        action="/api/users/update/password/true"
        onSubmit={validateForm}
        method="post"
      >
        <Stack spacing={4}>
          <VStack spacing={6}>
            <FormControl id="currentPassword">
              <FormLabel>Current Password</FormLabel>
              <Input
                type="password"
                onBlur={(event) => validatePassword(event.currentTarget.value)}
                required={true}
              />
              {passwordConfirmed ? (
                ''
              ) : (
                <p style={{ color: 'red' }}>Does not Match Current Password</p>
              )}
            </FormControl>

            <FormControl id="newPassword">
              <FormLabel>New Password</FormLabel>
              <Input
                name="password"
                type="password"
                onBlur={(event) => setPassword(event.currentTarget.value)}
                required={true}
              />
            </FormControl>

            <FormControl id="matchPassword">
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                onChange={(event) => matchPassword(event.currentTarget.value)}
                required={true}
              />
              {passwordMatch ? '' : <p style={{ color: 'red' }}>Password does not match</p>}
            </FormControl>

            <Box mt={2}>
              <Button
                type="submit"
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                width="full"
              >
                Change Password
              </Button>
            </Box>
          </VStack>
        </Stack>
      </form>
    </Box>
  );
};

export default Password;
