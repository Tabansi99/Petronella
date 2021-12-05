import { useDisclosure } from '@chakra-ui/hooks';
import { Box } from '@chakra-ui/layout';
import { Drawer, DrawerContent } from '@chakra-ui/react';
import { ReactNode, useEffect, useState } from 'react';
import { MobileNav } from './mobileNav';
import { Sidebar } from './sidebar';

export const ApplicationLayout = ({ children }: { children: ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loggedIn, setLoggedIn] = useState(true);
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [first, setFirst] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);

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
          if (data.authenticated) {
            setfirstName(data.user.firstName);
            setlastName(data.user.lastName);
            setEmail(data.user.email);
            setUserName(data.user.userName);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchStuff();
  }, [first]);

  useEffect(() => {
    const sessionOver = async () => {
      await fetch('/api/users/')
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Failed');
          }
        })
        .then((data) => {
          if (!data.authenticated) {
            setLoggedIn(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    sessionOver();
  }, [isTimeout]);

  if (!loggedIn) {
    return <meta httpEquiv="refresh" content="0; url = /app/login" />;
  }

  setInterval(() => {
    setIsTimeout(!isTimeout);
  }, 3500000);

  return (
    <Box>
      <Sidebar onClose={onClose} display={{ base: 'none', md: 'block' }} />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <Sidebar onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav
        onOpen={onOpen}
        firstN={firstName}
        lastN={lastName}
        userName={userName}
        email={email}
      />
      <Box ml={{ base: 0, md: 60 }} p="5">
        {children}
      </Box>
    </Box>
  );
};
