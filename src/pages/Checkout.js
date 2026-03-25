import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Input,
  FormControl,
  FormLabel,
  Icon,
  Divider,
  useToast,
  Radio,
  RadioGroup,
  Stack,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FiCreditCard, FiMapPin, FiLock } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, paymentAPI } from '../services/api';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
    } else {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(window.Razorpay);
      document.body.appendChild(script);
    }
  });
};

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user, addLoyaltyPoints, addOrderToHistory } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form state
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });

  // Prices from database are already in paise (₹), convert to rupees for display
  // e.g., 1078 paise = ₹10.78
  const toINR = (paise) => (paise / 100).toFixed(2);
  const formatINR = (amount) => `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  const deliveryFee = cart.length > 0 ? 40 : 0; // ₹40 delivery fee
  const subtotalPaise = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const subtotalINR = Number(toINR(subtotalPaise));
  const tax = Number((subtotalINR * 0.08).toFixed(2)); // 8% tax
  const totalINR = (Number(subtotalINR) + deliveryFee + tax);
  const totalPaise = Math.round(totalINR * 100); // Convert back to paise for Razorpay
  const pointsEarned = Math.floor(totalINR / 100);

  const canProceed = () => {
    return deliveryAddress.street && deliveryAddress.city && 
           deliveryAddress.state && deliveryAddress.zip;
  };

  // Initialize Razorpay
  useEffect(() => {
    loadRazorpayScript();
  }, []);

  // Razorpay is loaded via loadRazorpayScript in useEffect

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    try {
      if (paymentMethod === 'razorpay') {
        // Create Razorpay order - use totalPaise (already in paise)
        const orderResponse = await paymentAPI.createOrder(totalPaise, 'INR');
        
        if (!orderResponse.success) {
          throw new Error(orderResponse.error || 'Failed to create payment order');
        }

        // Open Razorpay checkout
        const razorpay = window.Razorpay;
        // Fetch Razorpay key from backend
        const keyResponse = await paymentAPI.getKey();
        const rzp = new razorpay({
          key: keyResponse.keyId || keyResponse.data?.key,
          amount: orderResponse.amount,
          currency: 'INR',
          name: 'NutriCart',
          description: 'Order Payment',
          order_id: orderResponse.orderId,
          handler: async (response) => {
            try {
              // Verify payment
              const verifyResponse = await paymentAPI.verifyPayment(
                response.razorpay_order_id,
                response.razorpay_payment_id,
                response.razorpay_signature
              );

              if (verifyResponse.success) {
                await createOrder();
              } else {
                throw new Error('Payment verification failed');
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              toast({
                title: 'Payment verification failed',
                description: 'Please contact support',
                status: 'error',
                duration: 5000,
              });
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
          },
          theme: {
            color: '#2F855A',
          },
        });

        rzp.open();
      } else {
        // COD payment
        await createOrder();
      }
    } catch (error) {
      console.error('Order error:', error);
      toast({
        title: 'Payment failed',
        description: error.message || 'Please try again',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const createOrder = async () => {
    // Create order in MongoDB
    const orderItems = cart.map(item => ({
      mealId: item._id || item.id,
      quantity: item.quantity,
      price: Number(toINR(item.price))
    }));

    await ordersAPI.create({
      userId: user._id,
      items: orderItems,
      totalAmount: totalINR,
      deliveryAddress: {
        street: deliveryAddress.street,
        city: deliveryAddress.city,
        zipCode: deliveryAddress.zip
      }
    });
    
    // Add loyalty points
    addLoyaltyPoints(pointsEarned);
    
    // Add to order history
    addOrderToHistory(cart.map(item => item.id));
    
    // Clear cart
    clearCart();
    
    toast({
      title: 'Order placed successfully!',
      description: `You earned ${pointsEarned} loyalty points!`,
      status: 'success',
      duration: 3000,
    });

    navigate('/order-confirmation');
  };

  return (
    <Box minH="calc(100vh - 64px)" bg="gray.50" py={8}>
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
          {/* Main Content */}
          <Box gridColumn={{ lg: "span 2" }}>
            <VStack spacing={6} align="stretch">
              {/* Progress Steps */}
              <HStack spacing={4} justify="center" mb={4}>
                {[
                  { num: 1, label: 'Address' },
                  { num: 2, label: 'Payment' },
                  { num: 3, label: 'Review' }
                ].map((s) => (
                  <HStack key={s.num} spacing={2}>
                    <Box
                      w={8}
                      h={8}
                      borderRadius="full"
                      bg={step >= s.num ? 'brand.500' : 'gray.200'}
                      color="white"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                    >
                      {s.num}
                    </Box>
                    <Text fontWeight={step === s.num ? 'bold' : 'normal'} color={step >= s.num ? 'brand.500' : 'gray.500'}>
                      {s.label}
                    </Text>
                    {s.num < 3 && <Box w={8} h={1} bg={step > s.num ? 'brand.500' : 'gray.200'} />}
                  </HStack>
                ))}
              </HStack>

              {/* Delivery Address */}
              {step === 1 && (
                <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
                  <HStack mb={6}>
                    <Icon as={FiMapPin} color="brand.500" />
                    <Heading size="md">Delivery Address</Heading>
                  </HStack>

                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Street Address</FormLabel>
                      <Input
                        placeholder="123 Main Street"
                        value={deliveryAddress.street}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                      />
                    </FormControl>

                    <SimpleGrid columns={2} spacing={4} w="full">
                      <FormControl isRequired>
                        <FormLabel>City</FormLabel>
                        <Input
                          placeholder="Mumbai"
                          value={deliveryAddress.city}
                          onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>State</FormLabel>
                        <Input
                          placeholder="Maharashtra"
                          value={deliveryAddress.state}
                          onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                        />
                      </FormControl>
                    </SimpleGrid>

                    <FormControl isRequired>
                      <FormLabel>PIN Code</FormLabel>
                      <Input
                        placeholder="400001"
                        value={deliveryAddress.zip}
                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, zip: e.target.value })}
                      />
                    </FormControl>

                    <Button
                      colorScheme="brand"
                      size="lg"
                      w="full"
                      onClick={() => setStep(2)}
                      isDisabled={!canProceed()}
                    >
                      Continue to Payment
                    </Button>
                  </VStack>
                </Box>
              )}

              {/* Payment Method */}
              {step === 2 && (
                <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
                  <HStack mb={6}>
                    <Icon as={FiCreditCard} color="brand.500" />
                    <Heading size="md">Payment Method</Heading>
                  </HStack>

                  <RadioGroup value={paymentMethod} onChange={setPaymentMethod}>
                    <Stack spacing={4}>
                      <Radio value="razorpay" colorScheme="brand">
                        <HStack>
                          <Icon as={FaRupeeSign} />
                          <Text>Pay with Razorpay (UPI, Cards, Net Banking)</Text>
                        </HStack>
                      </Radio>
                      <Radio value="cod" colorScheme="brand">
                        <Text>Cash on Delivery</Text>
                      </Radio>
                    </Stack>
                  </RadioGroup>

                  {paymentMethod === 'razorpay' && (
                    <Alert status="info" mt={4} borderRadius="md">
                      <AlertIcon />
                      <Box>
                        <Text fontWeight="bold">Secure Payment via Razorpay</Text>
                        <Text fontSize="sm">Accepts UPI, Debit/Credit Cards, Net Banking, Wallets</Text>
                      </Box>
                    </Alert>
                  )}

                  <HStack mt={6} spacing={4}>
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Back
                    </Button>
                    <Button
                      colorScheme="brand"
                      size="lg"
                      flex={1}
                      onClick={() => setStep(3)}
                    >
                      Review Order
                    </Button>
                  </HStack>
                </Box>
              )}

              {/* Order Review */}
              {step === 3 && (
                <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
                  <Heading size="md" mb={6}>Review Your Order</Heading>

                  <VStack spacing={4} align="stretch" divider={<Divider />}>
                    <Box>
                      <Text fontWeight="600" mb={2}>Delivery Address</Text>
                      <Text color="gray.600">
                        {deliveryAddress.street}<br />
                        {deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zip}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontWeight="600" mb={2}>Payment Method</Text>
                      <Text color="gray.600" textTransform="capitalize">
                        {paymentMethod === 'razorpay' ? 'Razorpay (Online Payment)' : 'Cash on Delivery'}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontWeight="600" mb={2}>Order Items</Text>
                      {cart.map(item => (
                        <HStack key={item.id} justify="space-between">
                          <HStack>
                            <Text color="gray.500">{item.quantity}x</Text>
                            <Text>{item.name}</Text>
                          </HStack>
                          <Text fontWeight="600">{formatINR(Number(toINR(item.price * item.quantity)))}</Text>
                        </HStack>
                      ))}
                    </Box>
                  </VStack>

                  <HStack mt={6} spacing={4}>
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button
                      colorScheme="brand"
                      size="lg"
                      flex={1}
                      onClick={handlePlaceOrder}
                      isLoading={isProcessing}
                      loadingText="Processing..."
                      leftIcon={paymentMethod === 'razorpay' ? <FaRupeeSign /> : undefined}
                    >
                      {paymentMethod === 'razorpay' ? `Pay ${formatINR(totalINR)}` : 'Place Order'}
                    </Button>
                  </HStack>
                </Box>
              )}
            </VStack>
          </Box>

          {/* Order Summary Sidebar */}
          <Box>
            <Box
              bg="white"
              p={6}
              borderRadius="xl"
              boxShadow="md"
              position="sticky"
              top="80px"
            >
              <Heading size="md" mb={4}>Order Summary</Heading>

              {/* Items Preview */}
              <VStack spacing={2} align="stretch" mb={4}>
                {cart.slice(0, 3).map(item => (
                  <HStack key={item.id} justify="space-between">
                    <HStack>
                      <Image
                        src={item.image}
                        alt={item.name}
                        boxSize={12}
                        objectFit="cover"
                        borderRadius="md"
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontWeight="500" noOfLines={1}>{item.name}</Text>
                        <Text fontSize="xs" color="gray.500">Qty: {item.quantity}</Text>
                      </VStack>
                    </HStack>
                    <Text fontSize="sm" fontWeight="600">{formatINR(Number(toINR(item.price * item.quantity)))}</Text>
                  </HStack>
                ))}
                {cart.length > 3 && (
                  <Text fontSize="sm" color="gray.500">+{cart.length - 3} more items</Text>
                )}
              </VStack>

              <Divider my={4} />

              <VStack spacing={2} align="stretch">
                <HStack justify="space-between">
                  <Text color="gray.600">Subtotal</Text>
                  <Text>{formatINR(subtotalINR)}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Delivery</Text>
                  <Text>{formatINR(deliveryFee)}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text color="gray.600">Tax (8%)</Text>
                  <Text>{formatINR(tax)}</Text>
                </HStack>
                <Divider />
                <HStack justify="space-between">
                  <Text fontWeight="600">Total</Text>
                  <Text fontWeight="bold" fontSize="xl" color="brand.600">
                    {formatINR(totalINR)}
                  </Text>
                </HStack>
              </VStack>

              {/* Points Earned */}
              <Box mt={4} p={3} bg="brand.50" borderRadius="lg">
                <HStack>
                  <Icon as={FiLock} color="brand.500" />
                  <Text fontSize="sm" color="brand.600">
                    You'll earn <strong>{pointsEarned}</strong> loyalty points!
                  </Text>
                </HStack>
              </Box>

              {/* Currency Note */}
              <Box mt={4} p={3} bg="gray.50" borderRadius="lg">
                <HStack justify="center">
                  <Icon as={FaRupeeSign} color="green.500" />
                  <Text fontSize="sm" color="gray.600">
                    All prices in Indian Rupees (INR)
                  </Text>
                </HStack>
              </Box>
            </Box>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Checkout;
