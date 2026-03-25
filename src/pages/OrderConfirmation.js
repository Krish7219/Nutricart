import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  IconButton,
} from '@chakra-ui/react';
import { FiCheck, FiHome, FiShoppingBag, FiShare } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const OrderConfirmation = () => {
  const { user } = useAuth();

  return (
    <Box minH="calc(100vh - 64px)" bg="gray.50" py={12}>
      <Container maxW="md">
        <VStack spacing={8} textAlign="center">
          {/* Success Animation */}
          <Box
            w={24}
            h={24}
            bg="green.100"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            animation="pulse 2s infinite"
            sx={{
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)', opacity: 1 },
                '50%': { transform: 'scale(1.1)', opacity: 0.8 },
                '100%': { transform: 'scale(1)', opacity: 1 },
              },
            }}
          >
            <Icon as={FiCheck} boxSize={12} color="green.500" />
          </Box>

          <VStack spacing={2}>
            <Heading size="xl" color="brand.600">Order Confirmed!</Heading>
            <Text color="gray.600">
              Thank you for your order. Your healthy meals are on the way.
            </Text>
          </VStack>

          {/* Order Details Card */}
          <Box
            bg="white"
            p={6}
            borderRadius="xl"
            boxShadow="md"
            w="full"
          >
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text color="gray.500">Order Number</Text>
                <Text fontWeight="bold">#NC{Date.now().toString().slice(-6)}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text color="gray.500">Estimated Delivery</Text>
                <Text fontWeight="bold">25-35 minutes</Text>
              </HStack>
              <HStack justify="space-between">
                <Text color="gray.500">Loyalty Points Earned</Text>
                <Text fontWeight="bold" color="brand.500">
                  +{Math.floor(Math.random() * 50 + 20)} points
                </Text>
              </HStack>
            </VStack>
          </Box>

          {/* Loyalty Status */}
          {user && (
            <Box
              bg="brand.50"
              p={4}
              borderRadius="lg"
              w="full"
            >
              <HStack justify="space-between">
                <VStack align="start" spacing={0}>
                  <Text fontWeight="600">Your Loyalty Status</Text>
                  <Text fontSize="sm" color="gray.600">
                    {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)} Member
                  </Text>
                </VStack>
                <VStack align="end" spacing={0}>
                  <Text fontWeight="bold" fontSize="xl">{user.loyaltyPoints}</Text>
                  <Text fontSize="xs" color="gray.500">points</Text>
                </VStack>
              </HStack>
            </Box>
          )}

          {/* Actions */}
          <VStack spacing={4} w="full">
            <Button
              as={RouterLink}
              to="/menu"
              colorScheme="brand"
              size="lg"
              w="full"
              rightIcon={<FiShoppingBag />}
            >
              Order More Meals
            </Button>
            <Button
              as={RouterLink}
              to="/"
              variant="outline"
              w="full"
              leftIcon={<FiHome />}
            >
              Back to Home
            </Button>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default OrderConfirmation;
