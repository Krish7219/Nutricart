import React from 'react';
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Container,
  Text,
  Avatar,
  Badge,
  VStack,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { FiShoppingCart, FiUser, FiLogOut, FiPackage, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Logo = () => (
  <RouterLink to="/">
    <HStack spacing={2}>
      <Box
        w={8}
        h={8}
        bg="brand.500"
        borderRadius="lg"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="white" fontWeight="bold" fontSize="lg">N</Text>
      </Box>
      <Text
        fontWeight="bold"
        fontSize="xl"
        color="brand.600"
      >
        NutriCart
      </Text>
    </HStack>
  </RouterLink>
);

const NavLink = ({ to, children, onClick }) => (
  <RouterLink to={to} onClick={onClick}>
    <Button variant="ghost" color="gray.600" fontWeight="500">
      {children}
    </Button>
  </RouterLink>
);

const Layout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <Box bg="white" boxShadow="sm" position="sticky" top={0} zIndex="sticky">
        <Container maxW="container.xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            <IconButton
              size="md"
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label="Open Menu"
              display={{ md: 'none' }}
              onClick={isOpen ? onClose : onOpen}
            />
            
            {/* Desktop Logo */}
            <Box display={{ base: 'none', md: 'block' }}>
              <Logo />
            </Box>

            {/* Desktop Nav */}
            <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
              <NavLink to="/">Home</NavLink>
              <NavLink to="/menu">Menu</NavLink>
              <NavLink to="/subscriptions">Subscriptions</NavLink>
              <NavLink to="/influencers">Influencers</NavLink>
              <NavLink to="/contact">Contact Us</NavLink>
            </HStack>

            {/* Right Side */}
            <HStack spacing={3}>
              <RouterLink to="/cart">
                <IconButton
                  icon={
                    <Box position="relative">
                      <FiShoppingCart size={20} />
                      {itemCount > 0 && (
                        <Badge
                          position="absolute"
                          top="-2"
                          right="-2"
                          colorScheme="orange"
                          borderRadius="full"
                          fontSize="xs"
                          minW={4}
                        >
                          {itemCount}
                        </Badge>
                      )}
                    </Box>
                  }
                  variant="ghost"
                  aria-label="Cart"
                />
              </RouterLink>

              {isAuthenticated ? (
                <Menu>
                  <MenuButton
                    as={Button}
                    variant="ghost"
                    p={1}
                  >
                    <HStack>
                      <Avatar size="sm" name={user?.name} src={user?.avatar} />
                      <Text display={{ base: 'none', md: 'block' }} fontWeight="500">
                        {user?.name?.split(' ')[0]}
                      </Text>
                    </HStack>
                  </MenuButton>
                  <MenuList>
                    <MenuItem icon={<FiUser />} onClick={() => navigate('/dashboard')}>
                      My Dashboard
                    </MenuItem>
                    <MenuItem icon={<FiPackage />} onClick={() => navigate('/subscriptions')}>
                      Subscriptions
                    </MenuItem>
                    <MenuItem icon={<FiTrendingUp />} onClick={() => navigate('/vendor-dashboard')}>
                      Vendor Dashboard
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <HStack spacing={2}>
                  <Button
                    as={RouterLink}
                    to="/login"
                    variant="ghost"
                    size="sm"
                  >
                    Login
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/signup"
                    colorScheme="brand"
                    size="sm"
                  >
                    Sign Up
                  </Button>
                </HStack>
              )}
            </HStack>
          </Flex>

          {/* Mobile Menu */}
          {isOpen && (
            <Box pb={4} display={{ md: 'none' }}>
              <VStack spacing={3} align="stretch">
                <RouterLink to="/" onClick={onClose}>
                  <Button w="full" variant="ghost" justifyContent="flex-start">Home</Button>
                </RouterLink>
                <RouterLink to="/menu" onClick={onClose}>
                  <Button w="full" variant="ghost" justifyContent="flex-start">Menu</Button>
                </RouterLink>
                <RouterLink to="/subscriptions" onClick={onClose}>
                  <Button w="full" variant="ghost" justifyContent="flex-start">Subscriptions</Button>
                </RouterLink>
                <RouterLink to="/influencers" onClick={onClose}>
                  <Button w="full" variant="ghost" justifyContent="flex-start">Influencers</Button>
                </RouterLink>
                <RouterLink to="/contact" onClick={onClose}>
                  <Button w="full" variant="ghost" justifyContent="flex-start">Contact Us</Button>
                </RouterLink>
                {!isAuthenticated && (
                  <HStack spacing={2} pt={2}>
                    <Button as={RouterLink} to="/login" variant="outline" flex={1}>
                      Login
                    </Button>
                    <Button as={RouterLink} to="/signup" colorScheme="brand" flex={1}>
                      Sign Up
                    </Button>
                  </HStack>
                )}
              </VStack>
            </Box>
          )}
        </Container>
      </Box>
      <Outlet />
    </>
  );
};

export default Layout;
