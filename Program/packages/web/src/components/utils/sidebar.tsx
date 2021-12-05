import { BoxProps, Box, Flex, Button, CloseButton, FlexProps, Link, Icon } from '@chakra-ui/react';
import { ReactText } from 'react';
import { IconType } from 'react-icons';
import { FiCompass, FiHome, FiUser, FiFileText, FiSettings } from 'react-icons/fi';

interface LinkItemProps {
  name: string;
  icon: IconType;
  link: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Dashboard', icon: FiHome, link: '/app/user/dashboard' },
  { name: 'Recommendations', icon: FiFileText, link: '/app/user/recommendations' },
  { name: 'Flight History', icon: FiCompass, link: '/app/user/flightHistory' },
  { name: 'Settings', icon: FiSettings, link: '/app/user/settings' },
];

interface SidebarProps extends BoxProps {
  onClose: () => void;
}
export const Sidebar = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="3s ease"
      bg={'white'}
      borderRight="1px"
      borderRightColor={'gray.200'}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Link
          href="/app/user/dashboard"
          fontSize="2xl"
          fontWeight="bold"
          style={{ textDecoration: 'none' }}
        >
          American Visualization
        </Link>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} link={link.link}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  link: string;
  children: ReactText;
}
const NavItem = ({ icon, children, link, ...rest }: NavItemProps) => {
  return (
    <Link href={link} style={{ textDecoration: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="24"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};
