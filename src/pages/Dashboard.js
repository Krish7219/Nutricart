import React, { useState, useEffect } from 'react';
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
  Image,
  Badge,
  Icon,
  Progress,
  Avatar,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { FiAward, FiTrendingUp, FiRefreshCw, FiArrowRight, FiHeart, FiZap, FiCheck, FiPlus, FiAlertTriangle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getRepeatOrders, meals } from '../data/mockData';
import { authAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const repeatOrders = user ? getRepeatOrders(user.id) : [];
  const recommendations = meals.slice(0, 4);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [todayIntake, setTodayIntake] = useState({ meals: [], totals: { calories: 0, protein: 0, carbs: 0, fat: 0 }, calorieLimit: 700, warning: null });
  const [newMeal, setNewMeal] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', type: 'meal' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?._id) {
      fetchTodayIntake();
    }
  }, [user?._id]);

  const fetchTodayIntake = async () => {
    try {
      const data = await authAPI.getTodayIntake(user._id);
      setTodayIntake(data);
    } catch (error) {
      console.error('Error fetching intake:', error);
    }
  };

  const handleAddMeal = async () => {
    if (!newMeal.name || !newMeal.calories) {
      toast({ title: 'Please fill in meal name and calories', status: 'warning' });
      return;
    }
    
    setLoading(true);
    try {
      const result = await authAPI.addDailyIntake(user._id, newMeal);
      await fetchTodayIntake();
      
      if (result.warning) {
        toast({
          title: 'Calorie Warning',
          description: result.warning,
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({ title: 'Meal logged successfully!', status: 'success' });
      }
      
      setNewMeal({ name: '', calories: '', protein: '', carbs: '', fat: '', type: 'meal' });
      onClose();
    } catch (error) {
      toast({ title: 'Error logging meal', description: error.message, status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxW="container.xl" py={12}>
        <VStack spacing={4}>
          <Heading>Please log in to view your dashboard</Heading>
          <Button as={RouterLink} to="/login" colorScheme="brand">Login</Button>
        </VStack>
      </Container>
    );
  }

  const weeklyReport = user.weeklyReport || {};
  const caloriesProgress = weeklyReport.caloriesConsumed ? (weeklyReport.caloriesConsumed / weeklyReport.caloriesGoal) * 100 : 0;
  const proteinProgress = weeklyReport.proteinConsumed ? (weeklyReport.proteinConsumed / weeklyReport.proteinGoal) * 100 : 0;
  
  const dailyCalorieProgress = todayIntake.totals.calories > 0 ? (todayIntake.totals.calories / todayIntake.calorieLimit) * 100 : 0;
  const isOverLimit = todayIntake.totals.calories > todayIntake.calorieLimit;

  return (
    <Box minH="calc(100vh - 64px)" bg="gray.50" py={8}>
      <Container maxW="container.xl">
        {/* Header */}
        <Box bg="linear-gradient(135deg, #2F855A 0%, #276749 100%)" p={8} borderRadius="2xl" mb={8}>
          <HStack justify="space-between" align="start">
            <HStack spacing={4}>
              <Avatar size="xl" name={user.name} src={user.avatar} border="4px solid white" />
              <VStack align="start" spacing={1}>
                <Text color="whiteAlpha.800" fontSize="sm">Welcome back,</Text>
                <Heading color="white" size="lg">{user.name}</Heading>
                <HStack>
                  <Badge colorScheme={user.tier === 'platinum' ? 'purple' : user.tier === 'gold' ? 'yellow' : 'orange'} textTransform="capitalize">
                    {user.tier} Member
                  </Badge>
                </HStack>
              </VStack>
            </HStack>
            <VStack align="end" spacing={1}>
              <HStack color="white">
                <Icon as={FiAward} />
                <Text fontWeight="bold" fontSize="2xl">{user.loyaltyPoints}</Text>
              </HStack>
              <Text color="whiteAlpha.700" fontSize="sm">Loyalty Points</Text>
            </VStack>
          </HStack>
        </Box>

        {/* Daily Intake Alert */}
        {todayIntake.warning && (
          <Alert status="warning" borderRadius="lg" mb={6}>
            <AlertIcon as={FiAlertTriangle} />
            <Box flex="1">
              <AlertTitle>Calorie Warning!</AlertTitle>
              <AlertDescription display="block">
                {todayIntake.warning}
              </AlertDescription>
            </Box>
          </Alert>
        )}

        <Tabs colorScheme="brand" variant="enclosed">
          <TabList>
            <Tab fontWeight="600"><Icon as={FiTrendingUp} mr={2} />Daily Tracker</Tab>
            <Tab fontWeight="600"><Icon as={FiRefreshCw} mr={2} />Weekly Report</Tab>
            <Tab fontWeight="600"><Icon as={FiAward} mr={2} />Rewards</Tab>
          </TabList>

          <TabPanels>
            {/* Daily Intake Tracker */}
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                {/* Today's Calories */}
                <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
                  <HStack justify="space-between" mb={4}>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="600">Today's Calories</Text>
                      <Text fontSize="sm" color="gray.500">Daily Limit: {todayIntake.calorieLimit} cal</Text>
                    </VStack>
                    <Icon as={FiZap} color="yellow.400" boxSize={6} />
                  </HStack>
                  <Progress 
                    value={Math.min(dailyCalorieProgress, 100)} 
                    colorScheme={isOverLimit ? 'red' : dailyCalorieProgress > 80 ? 'orange' : 'brand'} 
                    borderRadius="full" 
                    size="lg" 
                  />
                  <HStack justify="space-between" mt={2}>
                    <Text fontSize="sm" color="gray.500">{todayIntake.totals.calories} consumed</Text>
                    <Text fontSize="sm" fontWeight="600" color={isOverLimit ? 'red.500' : 'brand.500'}>
                      {Math.round(dailyCalorieProgress)}%
                    </Text>
                  </HStack>
                  {isOverLimit && (
                    <Text fontSize="sm" color="red.500" mt={2}>
                      ⚠️ You've exceeded your daily limit!
                    </Text>
                  )}
                </Box>

                {/* Today's Protein */}
                <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
                  <HStack justify="space-between" mb={4}>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="600">Today's Protein</Text>
                      <Text fontSize="sm" color="gray.500">Recommended: 50g+</Text>
                    </VStack>
                    <Icon as={FiHeart} color="purple.400" boxSize={6} />
                  </HStack>
                  <Progress 
                    value={Math.min((todayIntake.totals.protein / 50) * 100, 100)} 
                    colorScheme={todayIntake.totals.protein >= 50 ? 'green' : 'purple'} 
                    borderRadius="full" 
                    size="lg" 
                  />
                  <HStack justify="space-between" mt={2}>
                    <Text fontSize="sm" color="gray.500">{todayIntake.totals.protein}g consumed</Text>
                    <Text fontSize="sm" fontWeight="600" color={todayIntake.totals.protein >= 50 ? 'green.500' : 'purple.500'}>
                      {todayIntake.totals.protein >= 50 ? 'Goal Met!' : `${50 - todayIntake.totals.protein}g to go`}
                    </Text>
                  </HStack>
                </Box>

                {/* Today's Meals List */}
                <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" gridColumn={{ lg: "span 2" }}>
                  <HStack justify="space-between" mb={4}>
                    <Heading size="sm">Today's Meals</Heading>
                    <Button leftIcon={<FiPlus />} colorScheme="brand" size="sm" onClick={onOpen}>
                      Log Meal
                    </Button>
                  </HStack>
                  
                  {todayIntake.meals.length > 0 ? (
                    <VStack spacing={3} align="stretch">
                      {todayIntake.meals.map((meal, index) => (
                        <Box key={index} p={3} bg="gray.50" borderRadius="lg">
                          <HStack justify="space-between">
                            <VStack align="start" spacing={0}>
                              <HStack>
                                <Text fontWeight="600">{meal.name}</Text>
                                <Badge size="sm" colorScheme={meal.source === 'ordered' ? 'green' : 'blue'}>
                                  {meal.source === 'ordered' ? 'Ordered' : 'Home'}
                                </Badge>
                                <Badge size="sm" colorScheme="purple">{meal.type}</Badge>
                              </HStack>
                              <Text fontSize="sm" color="gray.500">
                                P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                              </Text>
                            </VStack>
                            <VStack align="end" spacing={0}>
                              <Text fontWeight="bold" color="brand.500">{meal.calories} cal</Text>
                            </VStack>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <Box textAlign="center" py={8}>
                      <Text color="gray.500">No meals logged today. Start tracking!</Text>
                      <Button colorScheme="brand" mt={4} onClick={onOpen}>Log Your First Meal</Button>
                    </Box>
                  )}
                  
                  {/* Daily Summary */}
                  <Divider my={4} />
                  <SimpleGrid columns={4} spacing={4}>
                    <Stat>
                      <StatLabel>Calories</StatLabel>
                      <StatNumber color="brand.500">{todayIntake.totals.calories}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Protein</StatLabel>
                      <StatNumber color="purple.500">{todayIntake.totals.protein}g</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Carbs</StatLabel>
                      <StatNumber color="orange.500">{todayIntake.totals.carbs}g</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Fat</StatLabel>
                      <StatNumber color="yellow.500">{todayIntake.totals.fat}g</StatNumber>
                    </Stat>
                  </SimpleGrid>
                </Box>
              </SimpleGrid>
            </TabPanel>

            {/* Weekly Report */}
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
                  <HStack justify="space-between" mb={4}>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="600">Weekly Calories</Text>
                      <Text fontSize="sm" color="gray.500">Goal: {weeklyReport.caloriesGoal?.toLocaleString() || 14000} cal</Text>
                    </VStack>
                    <Icon as={FiZap} color="yellow.400" boxSize={6} />
                  </HStack>
                  <Progress value={Math.min(caloriesProgress, 100)} colorScheme={caloriesProgress >= 100 ? 'green' : 'brand'} borderRadius="full" size="lg" />
                  <HStack justify="space-between" mt={2}>
                    <Text fontSize="sm" color="gray.500">{weeklyReport.caloriesConsumed?.toLocaleString() || 0} consumed</Text>
                    <Text fontSize="sm" fontWeight="600" color={caloriesProgress >= 100 ? 'green.500' : 'brand.500'}>{Math.round(caloriesProgress)}%</Text>
                  </HStack>
                </Box>

                <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
                  <HStack justify="space-between" mb={4}>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="600">Weekly Protein</Text>
                      <Text fontSize="sm" color="gray.500">Goal: {weeklyReport.proteinGoal || 400}g</Text>
                    </VStack>
                    <Icon as={FiHeart} color="purple.400" boxSize={6} />
                  </HStack>
                  <Progress value={Math.min(proteinProgress, 100)} colorScheme={proteinProgress >= 100 ? 'green' : 'purple'} borderRadius="full" size="lg" />
                  <HStack justify="space-between" mt={2}>
                    <Text fontSize="sm" color="gray.500">{weeklyReport.proteinConsumed || 0}g consumed</Text>
                    <Text fontSize="sm" fontWeight="600" color={proteinProgress >= 100 ? 'green.500' : 'purple.500'}>{Math.round(proteinProgress)}%</Text>
                  </HStack>
                </Box>

                <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" gridColumn={{ lg: "span 2" }}>
                  <Heading size="sm" mb={4}>This Week's Summary</Heading>
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                    <Stat>
                      <StatLabel>Meals Ordered</StatLabel>
                      <StatNumber color="brand.500">{weeklyReport.mealsOrdered || 0}</StatNumber>
                      <StatHelpText>this week</StatHelpText>
                    </Stat>
                    <Stat>
                      <StatLabel>Current Streak</StatLabel>
                      <StatNumber color="orange.400">{weeklyReport.streakDays || 0}</StatNumber>
                      <StatHelpText>days</StatHelpText>
                    </Stat>
                    <Stat>
                      <StatLabel>Favorite Category</StatLabel>
                      <StatNumber fontSize="lg">{weeklyReport.favoriteCategory || 'None'}</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Points Earned</StatLabel>
                      <StatNumber color="brand.500">+{(weeklyReport.mealsOrdered || 0) * 15}</StatNumber>
                      <StatHelpText>this week</StatHelpText>
                    </Stat>
                  </SimpleGrid>
                </Box>
              </SimpleGrid>
            </TabPanel>

            {/* Repeat Orders */}
            <TabPanel px={0}>
              <VStack spacing={4} align="stretch">
                <Heading size="md">Order Again</Heading>
                <Text color="gray.500">Quickly reorder your favorites</Text>
                {repeatOrders.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4}>
                    {repeatOrders.map(meal => (
                      <Box key={meal.id} bg="white" borderRadius="xl" overflow="hidden" boxShadow="sm">
                        <Image src={meal.image} alt={meal.name} h={32} w="full" objectFit="cover" />
                        <Box p={3}>
                          <Text fontWeight="600" fontSize="sm" noOfLines={1}>{meal.name}</Text>
                          <HStack justify="space-between" mt={2}>
                            <Text fontWeight="bold" color="brand.600">₹{(meal.price / 100).toFixed(2)}</Text>
                            <Button size="sm" colorScheme="brand" onClick={() => addToCart(meal)}>Add</Button>
                          </HStack>
                        </Box>
                      </Box>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Box bg="white" p={8} borderRadius="xl" textAlign="center">
                    <Text color="gray.500">No previous orders yet. Start exploring!</Text>
                    <Button as={RouterLink} to="/menu" colorScheme="brand" mt={4}>Browse Menu</Button>
                  </Box>
                )}
              </VStack>
            </TabPanel>

            {/* Rewards */}
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
                  <Heading size="md" mb={4}>Your Rewards</Heading>
                  <VStack spacing={4} align="stretch">
                    <Box p={4} bg="brand.50" borderRadius="lg">
                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="600" textTransform="capitalize">{user.tier} Member</Text>
                          <Text fontSize="sm" color="gray.500">
                            {user.tier === 'platinum' ? 'Unlimited benefits' : user.tier === 'gold' ? '500 more to platinum' : user.tier === 'silver' ? '500 more to gold' : '500 more to silver'}
                          </Text>
                        </VStack>
                        <Icon as={FiAward} color="brand.500" boxSize={8} />
                      </HStack>
                    </Box>
                    <Divider />
                    <VStack spacing={2} align="stretch">
                      <Text fontWeight="600">Tier Benefits</Text>
                      <HStack><Icon as={FiCheck} color="green.500" /><Text fontSize="sm">Earn points on every order</Text></HStack>
                      <HStack><Icon as={FiCheck} color="green.500" /><Text fontSize="sm">Access to exclusive deals</Text></HStack>
                      {user.tier !== 'bronze' && <HStack><Icon as={FiCheck} color="green.500" /><Text fontSize="sm">Free delivery on orders over $30</Text></HStack>}
                      {['gold', 'platinum'].includes(user.tier) && <HStack><Icon as={FiCheck} color="green.500" /><Text fontSize="sm">Priority customer support</Text></HStack>}
                      {user.tier === 'platinum' && <HStack><Icon as={FiCheck} color="green.500" /><Text fontSize="sm">Free birthday meal</Text></HStack>}
                    </VStack>
                  </VStack>
                </Box>

                <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
                  <Heading size="md" mb={4}>How to Earn More</Heading>
                  <VStack spacing={4} align="stretch">
                    <HStack p={3} bg="gray.50" borderRadius="lg" justify="space-between">
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="600">Complete your profile</Text>
                        <Text fontSize="sm" color="gray.500">+50 points</Text>
                      </VStack>
                      <Button size="sm" colorScheme="brand" as={RouterLink} to="/onboarding">Complete</Button>
                    </HStack>
                    <HStack p={3} bg="gray.50" borderRadius="lg" justify="space-between">
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="600">Order 5 meals this week</Text>
                        <Text fontSize="sm" color="gray.500">+100 bonus points</Text>
                      </VStack>
                      <Text fontSize="sm" color="gray.500">{weeklyReport.mealsOrdered || 0}/5</Text>
                    </HStack>
                    <HStack p={3} bg="gray.50" borderRadius="lg" justify="space-between">
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="600">Refer a friend</Text>
                        <Text fontSize="sm" color="gray.500">+200 points each</Text>
                      </VStack>
                      <Button size="sm" colorScheme="brand">Share</Button>
                    </HStack>
                  </VStack>
                </Box>
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Log Meal Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Log a Meal</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Meal Name</FormLabel>
                  <Input 
                    placeholder="e.g., Homemade Salad, Grilled Chicken" 
                    value={newMeal.name}
                    onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                  />
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel>Calories</FormLabel>
                  <NumberInput 
                    min={0} 
                    value={newMeal.calories}
                    onChange={(value) => setNewMeal({...newMeal, calories: value})}
                  >
                    <NumberInputField placeholder="e.g., 350" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                
                <SimpleGrid columns={2} spacing={4} w="full">
                  <FormControl>
                    <FormLabel>Protein (g)</FormLabel>
                    <NumberInput 
                      min={0}
                      value={newMeal.protein}
                      onChange={(value) => setNewMeal({...newMeal, protein: value})}
                    >
                      <NumberInputField placeholder="e.g., 25" />
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Carbs (g)</FormLabel>
                    <NumberInput 
                      min={0}
                      value={newMeal.carbs}
                      onChange={(value) => setNewMeal({...newMeal, carbs: value})}
                    >
                      <NumberInputField placeholder="e.g., 30" />
                    </NumberInput>
                  </FormControl>
                </SimpleGrid>
                
                <FormControl>
                  <FormLabel>Fat (g)</FormLabel>
                  <NumberInput 
                    min={0}
                    value={newMeal.fat}
                    onChange={(value) => setNewMeal({...newMeal, fat: value})}
                  >
                    <NumberInputField placeholder="e.g., 15" />
                  </NumberInput>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Meal Type</FormLabel>
                  <Select 
                    value={newMeal.type}
                    onChange={(e) => setNewMeal({...newMeal, type: e.target.value})}
                  >
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="meal">General</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
              <Button colorScheme="brand" onClick={handleAddMeal} isLoading={loading}>Log Meal</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
};

export default Dashboard;
