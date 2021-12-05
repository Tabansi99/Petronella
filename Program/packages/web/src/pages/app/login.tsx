import {
  ThemeProvider,
  theme,
  CSSReset,
  Box,
  Flex,
  Heading,
  Link,
  FormControl,
  Input,
  Button,
  CircularProgress,
} from '@chakra-ui/react';
import { AppLayout } from '../../components/Layout';
import React, { useState } from 'react';

const VARIANT_COLOR = 'blue';

const Login = () => {
  return (
    <AppLayout>
      <ThemeProvider theme={theme}>
        <CSSReset />
        <LoginArea />
      </ThemeProvider>
    </AppLayout>
  );
};

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const registerUser = async (event: React.SyntheticEvent) => {
    setIsLoading(true);
  };

  return (
    <Box my={8} textAlign="left">
      <form action="/api/users/login" onSubmit={registerUser} method="post">
        <FormControl>
          <Input name="username" type="username" placeholder="Username" variant="filled" required />
        </FormControl>

        <FormControl mt={4}>
          <Input name="password" type="password" placeholder="Password" variant="filled" required />
        </FormControl>

        <Button
          type="submit"
          bg={'blue.400'}
          color={'white'}
          _hover={{
            bg: 'blue.500',
          }}
          width="full"
          mt={4}
        >
          {isLoading ? (
            <CircularProgress isIndeterminate size="24px" color={VARIANT_COLOR} />
          ) : (
            'Sign In'
          )}
        </Button>
      </form>
      <Link width="full" mt={4} href="create">
        Not a User? Sign Up
      </Link>
    </Box>
  );
};

const LoginArea = () => {
  return (
    <Flex minHeight="100vh" width="full" align="center" justifyContent="center">
      <ThemeSelector />
      <Box p={4}>
        <LoginHeader />
        <LoginForm />
      </Box>
    </Flex>
  );
};

const ThemeSelector = () => {
  return <Box textAlign="right" py={4}></Box>;
};

const LoginHeader = () => {
  return (
    <Box textAlign="center">
      <Heading>American Visualization</Heading>
    </Box>
  );
};

export default Login;
