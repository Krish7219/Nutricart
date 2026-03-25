import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Image,
  IconButton,
  Divider,
  Icon,
} from '@chakra-ui/react';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <Box
      bg="white"
      p={4}
      borderRadius="xl"
      boxShadow="sm"
      borderWidth="1px"
      borderColor="gray.100"
    >
      <HStack spacing={4}>
        <Image
          src={item.image}
          alt={item.name}
          w={20}
          h={20}
          objectFit="cover"
          borderRadius="lg"
        />
        
        <VStack align="start" spacing={1} flex={1}>
          <Text fontWeight="600" noOfLines={1}>{item.name}</Text>
          <Text fontSize="sm" color="gray.500">₹{(item.price / 100).toFixed(2)} each</Text>
        </VStack>

        <HStack spacing={2}>
          <IconButton
            icon={<FiMinus />}
            size="sm"
            variant="outline"
            borderRadius="full"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
          />
          <Text fontWeight="600" minW={6} textAlign="center">{item.quantity}</Text>
          <IconButton
            icon={<FiPlus />}
            size="sm"
            variant="outline"
            borderRadius="full"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          />
        </HStack>

        <Text fontWeight="bold" color="brand.600" minW={16} textAlign="right">
          ₹{((item.price * item.quantity) / 100).toFixed(2)}
        </Text>

        <IconButton
          icon={<FiTrash2 />}
          size="sm"
          variant="ghost"
          colorScheme="red"
          onClick={() => removeFromCart(item.id)}
          aria-label="Remove item"
        />
      </HStack>
    </Box>
  );
};

const Cart = () => {
  const { cart, cartTotal, itemCount, clearCart } = useCart();
  const navigate = useNavigate();

  // Prices are in paise, convert to rupees for display
  const subtotal = cartTotal / 100;
  const deliveryFee = cart.length > 0 ? 40 : 0; // ₹40 delivery fee
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <Box minH="calc(100vh - 64px)" bg="gray.50" py={12}>
        <Container maxW="container.md">
          <VStack spacing={6} textAlign="center">
            <Box
              w={24}
              h={24}
              bg="gray.100"
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FiShoppingBag} boxSize={10} color="gray.400" />
            </Box>
            <VStack spacing={2}>
              <Heading size="md">Your cart is empty</Heading>
              <Text color="gray.500">
                Looks like you haven't added any meals yet
              </Text>
            </VStack>
            <Button
              as={RouterLink}
              to="/menu"
              colorScheme="brand"
              size="lg"
              rightIcon={<FiArrowRight />}
            >
              Browse Menu
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="calc(100vh - 64px)" bg="gray.50" py={8}>
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
          {/* Cart Items */}
          <Box gridColumn={{ lg: "span 2" }}>
            <HStack justify="space-between" mb={6}>
              <Heading size="lg">Shopping Cart ({itemCount})</Heading>
              <Button variant="ghost" size="sm" onClick={clearCart}>
                Clear Cart
              </Button>
            </HStack>

            <VStack spacing={4} align="stretch">
              {cart.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </VStack>
          </Box>

          {/* Order Summary */}
          <Box>
            <Box
              bg="white"
              p={6}
              borderRadius="xl"
              boxShadow="md"
              position="sticky"
              top="80px"
            >
              <Heading size="md" mb={6}>Order Summary</Heading>

              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Text color="gray.600">Subtotal</Text>
                  <Text fontWeight="600">₹{(cartTotal / 100).toFixed(2)}</Text>
                </HStack>
                
                <HStack justify="space-between">
                  <Text color="gray.600">Delivery Fee</Text>
                  <Text fontWeight="600">₹{deliveryFee.toFixed(2)}</Text>
                </HStack>

                <HStack justify="space-between">
                  <Text color="gray.600">Tax (8%)</Text>
                  <Text fontWeight="600">₹{tax.toFixed(2)}</Text>
                </HStack>

                <Divider />

                <HStack justify="space-between">
                  <Text fontWeight="600" fontSize="lg">Total</Text>
                  <Text fontWeight="bold" fontSize="xl" color="brand.600">
                    ₹{total.toFixed(2)}
                  </Text>
                </HStack>

                <Button
                  colorScheme="brand"
                  size="lg"
                  w="full"
                  mt={4}
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  as={RouterLink}
                  to="/menu"
                  variant="outline"
                  w="full"
                >
                  Continue Shopping
                </Button>
              </VStack>

              {/* Promo Code */}
              <Box mt={6}>
                <Text fontWeight="600" mb={2}>Have a promo code?</Text>
                <HStack>
                  <input
                    type="text"
                    placeholder="Enter code"
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      outline: 'none',
                    }}
                  />
                  <Button colorScheme="brand" variant="outline" size="md">
                    Apply
                  </Button>
                </HStack>
              </Box>
            </Box>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Cart;
