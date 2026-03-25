import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
  useToast,
  Divider,
  Icon,
} from '@chakra-ui/react';
import { FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
        status: 'success',
        duration: 3000,
      });
      navigate(from, { replace: true });
    } else {
      toast({
        title: 'Login failed',
        description: result.error || 'Invalid email or password',
        status: 'error',
        duration: 4000,
      });
    }
    
    setIsLoading(false);
  };

  const handleDemoLogin = async () => {
    setEmail('john@example.com');
    setPassword('password123');
    setIsLoading(true);
    
    const result = await login('john@example.com', 'password123');
    
    if (result.success) {
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
        status: 'success',
        duration: 3000,
      });
      navigate(from, { replace: true });
    } else {
      toast({
        title: 'Login failed',
        description: result.error || 'Invalid email or password',
        status: 'error',
        duration: 4000,
      });
    }
    
    setIsLoading(false);
  };

  const handleDemo2Login = async () => {
    setEmail('demo@nutricart.com');
    setPassword('demo123');
    setIsLoading(true);
    
    const result = await login('demo@nutricart.com', 'demo123');
    
    if (result.success) {
      toast({
        title: 'Welcome back, Demo User!',
        description: 'You have successfully logged in.',
        status: 'success',
        duration: 3000,
      });
      navigate(from, { replace: true });
    } else {
      toast({
        title: 'Login failed',
        description: 'Demo account 2 not found. Please seed the database.',
        status: 'error',
        duration: 4000,
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Box minH="calc(100vh - 64px)" bg="gray.50" py={12}>
      <Container maxW="md">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={2} textAlign="center">
            <Heading size="xl" color="brand.600">Welcome Back</Heading>
            <Text color="gray.600">
              Sign in to continue your healthy journey
            </Text>
          </VStack>

          {/* Login Form */}
          <Box bg="white" p={8} borderRadius="xl" boxShadow="md">
            <form onSubmit={handleSubmit}>
              <VStack spacing={5}>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <HStack
                    borderWidth="1px"
                    borderRadius="lg"
                    px={3}
                    focusWithin={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #2F855A' }}
                  >
                    <Icon as={FiMail} color="gray.400" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      border="none"
                      _focus={{ boxShadow: 'none' }}
                    />
                  </HStack>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <HStack
                    borderWidth="1px"
                    borderRadius="lg"
                    px={3}
                    focusWithin={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #2F855A' }}
                  >
                    <Icon as={FiLock} color="gray.400" />
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      border="none"
                      _focus={{ boxShadow: 'none' }}
                    />
                  </HStack>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  w="full"
                  isLoading={isLoading}
                  loadingText="Signing in..."
                >
                  Sign In
                </Button>
              </VStack>
            </form>

            <Divider my={6} />

            <VStack spacing={4}>
              <Text color="gray.600" fontSize="sm">
                Try the demo accounts:
              </Text>
              <Button
                variant="outline"
                colorScheme="brand"
                size="sm"
                w="full"
                onClick={handleDemoLogin}
              >
                Demo Account 1 (John)
              </Button>
              <Button
                variant="outline"
                colorScheme="purple"
                size="sm"
                w="full"
                onClick={handleDemo2Login}
              >
                Demo Account 2 (Demo User)
              </Button>
            </VStack>
          </Box>

          {/* Sign Up Link */}
          <Text textAlign="center" color="gray.600">
            Don't have an account?{' '}
            <RouterLink to="/signup">
              <Text as="span" color="brand.500" fontWeight="600">
                Sign up
              </Text>
            </RouterLink>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default Login;
