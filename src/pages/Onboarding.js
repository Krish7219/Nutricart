import React, { useState } from 'react';
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
  Badge,
  Icon,
  Progress,
  useToast,
} from '@chakra-ui/react';
import { FiCheck, FiArrowRight, FiTrendingUp, FiHeart, FiZap } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { meals, getRecommendations } from '../data/mockData';

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const recommendations = user ? getRecommendations(user.id) : meals.slice(0, 4);

  const features = [
    {
      icon: FiTrendingUp,
      title: 'Personalized Recommendations',
      description: 'Meals tailored to your health goals and dietary preferences',
    },
    {
      icon: FiHeart,
      title: 'Loyalty Rewards',
      description: 'Earn points with every order and unlock exclusive benefits',
    },
    {
      icon: FiZap,
      title: 'Weekly Health Reports',
      description: 'Track your nutrition and progress every week',
    },
  ];

  const handleComplete = () => {
    updateUser({ onboardingComplete: true });
    toast({
      title: 'Welcome to NutriCart!',
      description: 'Your personalized healthy eating journey begins now.',
      status: 'success',
      duration: 3000,
    });
    navigate('/menu');
  };

  const steps = [
    // Welcome step
    <VStack key="welcome" spacing={8} py={8}>
      <Box
        w={24}
        h={24}
        bg="brand.100"
        borderRadius="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize="4xl">🎉</Text>
      </Box>
      <VStack spacing={3}>
        <Heading size="lg" textAlign="center">
          Welcome to NutriCart, {user?.name?.split(' ')[0]}!
        </Heading>
        <Text color="gray.600" textAlign="center" maxW="md">
          Your journey to healthier eating starts here. Let us show you how easy it can be.
        </Text>
      </VStack>
      <Button
        rightIcon={<FiArrowRight />}
        colorScheme="brand"
        size="lg"
        onClick={() => setStep(1)}
      >
        Get Started
      </Button>
    </VStack>,

    // Features step
    <VStack key="features" spacing={8} py={8}>
      <VStack spacing={3}>
        <Heading size="lg" textAlign="center">
          Your Personal Health Hub
        </Heading>
        <Text color="gray.600" textAlign="center" maxW="md">
          Everything you need to achieve your nutrition goals
        </Text>
      </VStack>
      
      <SimpleGrid columns={1} spacing={4} w="full" maxW="md">
        {features.map((feature, index) => (
          <Box
            key={index}
            p={5}
            bg="white"
            borderRadius="xl"
            boxShadow="sm"
            borderWidth="1px"
            borderColor="gray.100"
          >
            <HStack spacing={4}>
              <Box
                w={12}
                h={12}
                bg="brand.50"
                borderRadius="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={feature.icon} boxSize={6} color="brand.500" />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontWeight="600">{feature.title}</Text>
                <Text fontSize="sm" color="gray.500">{feature.description}</Text>
              </VStack>
            </HStack>
          </Box>
        ))}
      </SimpleGrid>

      <Button
        rightIcon={<FiArrowRight />}
        colorScheme="brand"
        size="lg"
        onClick={() => setStep(2)}
      >
        Continue
      </Button>
    </VStack>,

    // Recommendations step
    <VStack key="recommendations" spacing={6} py={8}>
      <VStack spacing={3}>
        <Heading size="lg" textAlign="center">
          Meals We Think You'll Love
        </Heading>
        <Text color="gray.600" textAlign="center" maxW="md">
          Based on your goals: {user?.goals?.map(g => g.replace('-', ' ')).join(', ') || 'Healthy Eating'}
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} w="full">
        {recommendations.map(meal => (
          <Box
            key={meal.id}
            bg="white"
            borderRadius="xl"
            overflow="hidden"
            boxShadow="sm"
          >
            <Image
              src={meal.image}
              alt={meal.name}
              h={32}
              w="full"
              objectFit="cover"
            />
            <Box p={3}>
              <Text fontWeight="600" fontSize="sm" noOfLines={1}>
                {meal.name}
              </Text>
              <HStack justify="space-between" mt={1}>
                <Text fontSize="sm" color="brand.600" fontWeight="600">
                  ₹{(meal.price / 100).toFixed(2)}
                </Text>
                <HStack spacing={1}>
                  <Text fontSize="xs" color="gray.500">{meal.calories} cal</Text>
                  <Text fontSize="xs" color="gray.400">•</Text>
                  <Text fontSize="xs" color="gray.500">{meal.protein}g protein</Text>
                </HStack>
              </HStack>
            </Box>
          </Box>
        ))}
      </SimpleGrid>

      <Button
        colorScheme="brand"
        size="lg"
        onClick={handleComplete}
        rightIcon={<FiCheck />}
      >
        Start Exploring
      </Button>
    </VStack>,
  ];

  return (
    <Box minH="calc(100vh - 64px)" bg="gray.50" py={12}>
      <Container maxW="lg">
        <Box bg="white" p={8} borderRadius="xl" boxShadow="md">
          {/* Progress */}
          <Progress
            value={(step / 2) * 100}
            colorScheme="brand"
            size="sm"
            borderRadius="full"
            mb={6}
          />

          {/* Step Content */}
          {steps[step]}

          {/* Step Indicators */}
          <HStack justify="center" spacing={2} mt={6}>
            {[0, 1, 2].map(i => (
              <Box
                key={i}
                w={3}
                h={3}
                borderRadius="full"
                bg={i === step ? 'brand.500' : 'gray.200'}
                cursor="pointer"
                onClick={() => i < step && setStep(i)}
                transition="all 0.2s"
              />
            ))}
          </HStack>
        </Box>
      </Container>
    </Box>
  );
};

export default Onboarding;
