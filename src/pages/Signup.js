import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagRightIcon,
  Checkbox,
} from '@chakra-ui/react';
import { FiMail, FiLock, FiUser, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { GOALS, DIETARY_FILTERS } from '../data/mockData';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRobot, setIsRobot] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const toggleGoal = (goalId) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const toggleDietary = (dietaryId) => {
    setSelectedDietary(prev =>
      prev.includes(dietaryId)
        ? prev.filter(id => id !== dietaryId)
        : [...prev, dietaryId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isRobot) {
      toast({
        title: 'Verify required',
        description: 'Please confirm you are not a robot',
        status: 'warning',
        duration: 3000,
      });
      return;
    }
    
    setIsLoading(true);

    const result = await signup(name, email, password, selectedGoals, selectedDietary);
    
    if (result.success) {
      toast({
        title: 'Account created!',
        description: 'Welcome to NutriCart. Let\'s set up your preferences.',
        status: 'success',
        duration: 3000,
      });
      navigate('/onboarding');
    } else {
      toast({
        title: 'Signup failed',
        description: result.error || 'Please try again',
        status: 'error',
        duration: 4000,
      });
    }
    
    setIsLoading(false);
  };

  const canProceed = () => {
    if (step === 1) {
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSymbol = /[@$!%*?&]/.test(password);
      const hasMinLength = password.length >= 8;
      return name && email && hasUppercase && hasLowercase && hasNumber && hasSymbol && hasMinLength;
    }
    return true;
  };

  return (
    <Box minH="calc(100vh - 64px)" bg="gray.50" py={12}>
      <Container maxW="md">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={2} textAlign="center">
            <Heading size="xl" color="brand.600">Join NutriCart</Heading>
            <Text color="gray.600">
              {step === 1 ? 'Create your account' : 'Tell us about your health goals'}
            </Text>
            
            {/* Progress Indicator */}
            <HStack spacing={2} pt={2}>
              <Box
                w={8}
                h={2}
                borderRadius="full"
                bg={step >= 1 ? 'brand.500' : 'gray.200'}
                transition="all 0.3s"
              />
              <Box
                w={8}
                h={2}
                borderRadius="full"
                bg={step >= 2 ? 'brand.500' : 'gray.200'}
                transition="all 0.3s"
              />
            </HStack>
          </VStack>

          {/* Form */}
          <Box bg="white" p={8} borderRadius="xl" boxShadow="md">
            {step === 1 ? (
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <VStack spacing={5}>
                  <FormControl isRequired>
                    <FormLabel>Full Name</FormLabel>
                    <HStack
                      borderWidth="1px"
                      borderRadius="lg"
                      px={3}
                      focusWithin={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #2F855A' }}
                    >
                      <Icon as={FiUser} color="gray.400" />
                      <Input
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        border="none"
                        _focus={{ boxShadow: 'none' }}
                      />
                    </HStack>
                  </FormControl>

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
                        placeholder="Min 8 chars, 1 uppercase, 1 number, 1 symbol"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        border="none"
                        _focus={{ boxShadow: 'none' }}
                      />
                    </HStack>
                  </FormControl>

                  {/* Captcha - I am not robot */}
                  <FormControl>
                    <Box borderWidth="1px" borderRadius="md" p={3} bg="gray.50">
                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontSize="sm" color="gray.600">Verify you're human</Text>
                        </VStack>
                        <Checkbox
                          isChecked={isRobot}
                          onChange={(e) => setIsRobot(e.target.checked)}
                          colorScheme="brand"
                        >
                          <Text fontSize="sm">I'm not a robot</Text>
                        </Checkbox>
                      </HStack>
                    </Box>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    w="full"
                    isDisabled={!canProceed()}
                  >
                    Continue
                  </Button>

                  {/* Visible Captcha for Screenshot */}
                  <Box borderWidth="2px" borderRadius="lg" p={4} bg="white" borderStyle="dashed">
                    <VStack spacing={2}>
                      <Text fontWeight="bold" color="gray.700">CAPTCHA</Text>
                      <Box bg="gray.100" p={2} borderRadius="md" w="full" textAlign="center">
                        <Text fontFamily="mono" fontSize="xl" letterSpacing="4px" fontWeight="bold">
                          K9M4X
                        </Text>
                      </Box>
                      <Text fontSize="xs" color="gray.500">Enter the characters shown above</Text>
                      <Input placeholder="Enter CAPTCHA" size="sm" textAlign="center" />
                    </VStack>
                  </Box>
                </VStack>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <VStack spacing={6}>
                  <FormControl>
                    <FormLabel>What's your health goal?</FormLabel>
                    <Wrap spacing={3}>
                      {GOALS.map(goal => (
                        <WrapItem key={goal.id}>
                          <Tag
                            size="lg"
                            variant={selectedGoals.includes(goal.id) ? 'solid' : 'outline'}
                            colorScheme="brand"
                            cursor="pointer"
                            onClick={() => toggleGoal(goal.id)}
                            borderRadius="full"
                            px={4}
                          >
                            <TagLabel>{goal.icon} {goal.name}</TagLabel>
                            {selectedGoals.includes(goal.id) && <TagRightIcon as={FiCheck} ml={2} />}
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Dietary Preferences</FormLabel>
                    <Wrap spacing={3}>
                      {DIETARY_FILTERS.map(filter => (
                        <WrapItem key={filter.id}>
                          <Tag
                            size="md"
                            variant={selectedDietary.includes(filter.id) ? 'solid' : 'outline'}
                            colorScheme="green"
                            cursor="pointer"
                            onClick={() => toggleDietary(filter.id)}
                            borderRadius="full"
                          >
                            <TagLabel>{filter.icon} {filter.name}</TagLabel>
                            {selectedDietary.includes(filter.id) && <TagRightIcon as={FiCheck} ml={1} />}
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </FormControl>

                  <HStack spacing={4} w="full">
                    <Button
                      variant="outline"
                      size="lg"
                      flex={1}
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      colorScheme="brand"
                      size="lg"
                      flex={1}
                      isLoading={isLoading}
                      loadingText="Creating..."
                    >
                      Create Account
                    </Button>
                  </HStack>
                </VStack>
              </form>
            )}
          </Box>

          {/* Login Link */}
          <Text textAlign="center" color="gray.600">
            Already have an account?{' '}
            <RouterLink to="/login">
              <Text as="span" color="brand.500" fontWeight="600">
                Sign in
              </Text>
            </RouterLink>
          </Text>
        </VStack>
      </Container>
    </Box>
  );
};

export default Signup;
