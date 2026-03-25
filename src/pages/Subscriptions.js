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
  SimpleGrid,
  Badge,
  Icon,
  List,
  ListItem,
  ListIcon,
  useToast,
} from '@chakra-ui/react';
import { FiCheck, FiArrowRight, FiStar } from 'react-icons/fi';
import { subscriptions } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const SubscriptionCard = ({ subscription, onSubscribe }) => {
  const isPopular = subscription.popular;

  return (
    <Box
      position="relative"
      bg="white"
      p={8}
      borderRadius="2xl"
      boxShadow={isPopular ? 'xl' : 'md'}
      borderWidth={isPopular ? '2px' : '1px'}
      borderColor={isPopular ? 'brand.500' : 'gray.100'}
      transform={isPopular ? 'scale(1.05)' : 'none'}
      transition="all 0.3s"
      _hover={{ boxShadow: 'xl', transform: isPopular ? 'scale(1.07)' : 'translateY(-4px)' }}
    >
      {isPopular && (
        <Badge
          position="absolute"
          top={-3}
          left="50%"
          transform="translateX(-50%)"
          colorScheme="brand"
          px={4}
          py={1}
          borderRadius="full"
          fontSize="sm"
        >
          Most Popular
        </Badge>
      )}

      <VStack spacing={4} align="stretch">
        <Heading size="md">{subscription.name}</Heading>
        
        <HStack align="baseline">
          <Text fontSize="4xl" fontWeight="bold" color="brand.600">
            ₹{(subscription.price / 100).toFixed(2)}
          </Text>
          <Text color="gray.500">/month</Text>
        </HStack>

        <Text color="gray.600">{subscription.description}</Text>

        <Box bg="gray.50" p={4} borderRadius="lg">
          <HStack justify="space-between">
            <Text fontWeight="600">{subscription.mealsPerWeek} meals/week</Text>
            <Text fontSize="sm" color="gray.500">
              ₹{((subscription.price / subscription.mealsPerWeek) / 100).toFixed(2)}/meal
            </Text>
          </HStack>
        </Box>

        <List spacing={3}>
          {subscription.features.map((feature, index) => (
            <ListItem key={index} display="flex" alignItems="center">
              <ListIcon as={FiCheck} color="green.500" />
              <Text>{feature}</Text>
            </ListItem>
          ))}
        </List>

        <Button
          colorScheme={isPopular ? 'brand' : 'gray'}
          size="lg"
          w="full"
          mt={4}
          onClick={() => onSubscribe(subscription)}
        >
          Subscribe Now
        </Button>
      </VStack>
    </Box>
  );
};

const Subscriptions = () => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const handleSubscribe = (subscription) => {
    if (!isAuthenticated) {
      toast({
        title: 'Please login',
        description: 'You need to be logged in to subscribe',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    toast({
      title: 'Subscription selected',
      description: `You've selected the ${subscription.name} plan. Checkout coming soon!`,
      status: 'success',
      duration: 3000,
    });
  };

  return (
    <Box minH="calc(100vh - 64px)" bg="gray.50" py={12}>
      <Container maxW="container.xl">
        <VStack spacing={4} mb={12} textAlign="center">
          <Badge colorScheme="brand" fontSize="sm" px={3} py={1} borderRadius="full">
            Save up to 20%
          </Badge>
          <Heading size="2xl">Subscription Meal Plans</Heading>
          <Text color="gray.600" maxW="2xl">
            Get delicious healthy meals delivered regularly. Save money, 
            eat better, and never worry about meal prep again.
          </Text>
        </VStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} maxW="5xl" mx="auto">
          {subscriptions.map(subscription => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onSubscribe={handleSubscribe}
            />
          ))}
        </SimpleGrid>

        {/* FAQ Section */}
        <Box mt={16}>
          <Heading size="lg" mb={8} textAlign="center">Frequently Asked Questions</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} maxW="4xl" mx="auto">
            <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
              <Heading size="sm" mb={2}>Can I cancel anytime?</Heading>
              <Text color="gray.600">Yes, you can cancel your subscription at any time with no penalties.</Text>
            </Box>
            <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
              <Heading size="sm" mb={2}>How does delivery work?</Heading>
              <Text color="gray.600">We deliver fresh meals weekly. You can choose your delivery day and skip weeks if needed.</Text>
            </Box>
            <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
              <Heading size="sm" mb={2}>Are meals customizable?</Heading>
              <Text color="gray.600">Yes! You can select your preferences and we'll tailor meals to your dietary needs.</Text>
            </Box>
            <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
              <Heading size="sm" mb={2}>How are meals packaged?</Heading>
              <Text color="gray.600">Meals are packed in eco-friendly containers with ice packs to stay fresh.</Text>
            </Box>
          </SimpleGrid>
        </Box>

        {/* CTA */}
        <Box mt={16} bg="brand.500" p={8} borderRadius="2xl" textAlign="center">
          <VStack spacing={4}>
            <Heading color="white" size="md">Still have questions?</Heading>
            <Text color="whiteAlpha.800" maxW="lg">
              Our team is here to help you find the perfect meal plan for your lifestyle.
            </Text>
            <Button as={RouterLink} to="/contact" bg="white" color="brand.500" size="lg" rightIcon={<FiArrowRight />}>
              Contact Us
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default Subscriptions;
