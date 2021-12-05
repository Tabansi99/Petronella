import {
  Flex,
  FlexProps,
  IconButton,
  Text,
  HStack,
  VStack,
  Menu,
  MenuButton,
  Avatar,
  Box,
  MenuList,
  MenuItem,
  MenuDivider,
  Link,
} from '@chakra-ui/react';
import React from 'react';
import { FiChevronDown, FiMenu } from 'react-icons/fi';

interface MobileProps extends FlexProps {
  onOpen: () => void;
  firstN: string;
  lastN: string;
  userName: string;
  email: string;
}

export const MobileNav = ({ onOpen, firstN, lastN, userName, email, ...rest }: MobileProps) => {
  const deleteCookie = async () => {
    await fetch('/api/users/', { method: 'DELETE' })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Failed');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={'white'}
      borderBottomWidth="1px"
      borderBottomColor={'gray.200'}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text display={{ base: 'flex', md: 'none' }} fontSize="2xl" fontWeight="bold">
        American Visualization
      </Text>

      <HStack spacing={{ base: '0', md: '1' }}>
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar size={'sm'} />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{firstN + ' ' + lastN}</Text>
                  <Text fontSize="xs" color="gray.600">
                    {userName}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>

            <MenuList bg={'white'} borderColor={'gray.200'}>
              <Link href="/app/user/dashboard" style={{ textDecoration: 'none' }}>
                <MenuItem>Home</MenuItem>
              </Link>

              <Link href="/app/user/settings" style={{ textDecoration: 'none' }}>
                <MenuItem>Settings</MenuItem>
              </Link>

              <MenuDivider />

              <Link href="/app/login" style={{ textDecoration: 'none' }}>
                <MenuItem onClick={deleteCookie}>Sign out</MenuItem>
              </Link>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );
};
