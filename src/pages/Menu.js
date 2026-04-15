import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Image,
  Badge,
  Icon,
  Card,
  CardBody,
  CardFooter,
  IconButton,
  Select,
  Spinner,
  Center,
  Button,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FiStar, FiShoppingCart, FiFilter } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { mealsAPI, vendorsAPI } from '../services/api';
import { GOALS, DIETARY_FILTERS } from '../data/mockData';
import { meals as mockMeals, vendors as mockVendors } from '../data/mockData';

const MealCard = ({ meal, vendor, onAddToCart }) => {
  return (
    <Card
      overflow="hidden"
      variant="outline"
      borderColor="gray.100"
      _hover={{ boxShadow: 'lg', transform: 'translateY(-4px)' }}
      transition="all 0.3s"
    >
      <Box position="relative">
        <Image
          src={meal.image}
          alt={meal.name}
          h={40}
          w="full"
          objectFit="cover"
        />
        {meal.trending && (
          <Badge
            position="absolute"
            top={2}
            left={2}
            colorScheme="orange"
          >
            Trending
          </Badge>
        )}
        <IconButton
          aria-label="Add to cart"
          icon={<FiShoppingCart />}
          position="absolute"
          top={2}
          right={2}
          size="sm"
          colorScheme="brand"
          borderRadius="full"
          onClick={() => onAddToCart(meal)}
        />
      </Box>

      <CardBody pb={2}>
        <VStack align="stretch" spacing={1}>
          <Text fontWeight="600" fontSize="md" noOfLines={1}>
            {meal.name}
          </Text>
          {vendor && (
            <Text fontSize="sm" color="gray.500">
              {vendor.name}
            </Text>
          )}
          <Text fontSize="sm" color="gray.600" noOfLines={2}>
            {meal.description}
          </Text>
          <HStack spacing={2} mt={1}>
            <Badge colorScheme="green" variant="subtle" fontSize="xs">
              {meal.calories} cal
            </Badge>
            <Badge colorScheme="purple" variant="subtle" fontSize="xs">
              {meal.protein}g protein
            </Badge>
          </HStack>
        </VStack>
      </CardBody>

      <CardFooter pt={2}>
        <HStack justify="space-between" w="full">
          <HStack spacing={1}>
            <Icon as={FiStar} color="yellow.400" fill="currentColor" />
            <Text fontWeight="600">{meal.rating}</Text>
          </HStack>
          <Text fontWeight="bold" color="brand.600" fontSize="lg">
            ₹{(meal.price / 100).toFixed(2)}
          </Text>
        </HStack>
      </CardFooter>
    </Card>
  );
};

const Menu = () => {
  const [searchParams] = useSearchParams();
  const goalFilter = searchParams.get('goal');
  
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [vendors, setVendors] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedGoal, setSelectedGoal] = useState(goalFilter || '');
  const [selectedDietary, setSelectedDietary] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mealsData, vendorsData] = await Promise.all([
          mealsAPI.getAll(),
          vendorsAPI.getAll()
        ]);
        
        if (mealsData && mealsData.length > 0) {
          setMeals(mealsData);
          setFilteredMeals(mealsData);
        } else {
          // Fallback to mock data if empty
          setMeals(mockMeals);
          setFilteredMeals(mockMeals);
        }
        
        // Create vendor lookup map
        if (vendorsData && vendorsData.length > 0) {
          const vendorMap = {};
          vendorsData.forEach(v => {
            vendorMap[v._id] = v;
          });
          setVendors(vendorMap);
        } else {
          // Fallback to mock vendors
          const vendorMap = {};
          mockVendors.forEach(v => {
            vendorMap[v.id] = v;
          });
          setVendors(vendorMap);
        }
        
        // Apply goal filter from URL
        if (goalFilter) {
          setSelectedGoal(goalFilter);
        }
      } catch (error) {
        console.error('Error fetching meals, using mock data:', error);
        // Use mock data as fallback
        setMeals(mockMeals);
        setFilteredMeals(mockMeals);
        
        const vendorMap = {};
        mockVendors.forEach(v => {
          vendorMap[v.id] = v;
        });
        setVendors(vendorMap);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [goalFilter]);

  useEffect(() => {
    let filtered = [...meals];
    
    if (selectedGoal) {
      filtered = filtered.filter(meal => 
        meal.goals?.includes(selectedGoal)
      );
    }
    
    if (selectedDietary) {
      filtered = filtered.filter(meal => 
        meal.dietary?.includes(selectedDietary)
      );
    }
    
    if (selectedVendor) {
      filtered = filtered.filter(meal => 
        meal.vendorId === selectedVendor
      );
    }
    
    setFilteredMeals(filtered);
  }, [selectedGoal, selectedDietary, selectedVendor, meals]);

  const clearFilters = () => {
    setSelectedGoal('');
    setSelectedDietary('');
    setSelectedVendor('');
  };

  if (loading) {
    return (
      <Center py={20}>
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Our Menu</Heading>
          <Text color="gray.600">
            Discover delicious healthy meals tailored to your goals
          </Text>
        </Box>

        {/* Filters */}
        <Box p={4} bg="white" borderRadius="lg" boxShadow="sm">
          <HStack spacing={4} mb={4}>
            <Icon as={FiFilter} />
            <Text fontWeight="600">Filters:</Text>
            {(selectedGoal || selectedDietary || selectedVendor) && (
              <Button size="sm" variant="ghost" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </HStack>
          
          <Wrap spacing={4}>
            <WrapItem>
              <Select
                placeholder="All Goals"
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                maxW="200px"
              >
                {GOALS.map(goal => (
                  <option key={goal.id} value={goal.id}>
                    {goal.icon} {goal.name}
                  </option>
                ))}
              </Select>
            </WrapItem>
            <WrapItem>
              <Select
                placeholder="All Dietary"
                value={selectedDietary}
                onChange={(e) => setSelectedDietary(e.target.value)}
                maxW="200px"
              >
                {DIETARY_FILTERS.map(diet => (
                  <option key={diet.id} value={diet.id}>
                    {diet.icon} {diet.name}
                  </option>
                ))}
              </Select>
            </WrapItem>
            <WrapItem>
              <Select
                placeholder="All Vendors"
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                maxW="200px"
              >
                {Object.values(vendors).map(vendor => (
                  <option key={vendor._id} value={vendor._id}>
                    {vendor.name}
                  </option>
                ))}
              </Select>
            </WrapItem>
          </Wrap>
        </Box>

        {/* Meals Grid */}
        <Text color="gray.500" fontSize="sm">
          Showing {filteredMeals.length} meals
        </Text>
        
        {filteredMeals.length === 0 ? (
          <Center py={10}>
            <VStack>
              <Text fontSize="lg" color="gray.500">No meals found</Text>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </VStack>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {filteredMeals.map(meal => (
              <MealCard
                key={meal._id || meal.id}
                meal={meal}
                vendor={vendors[meal.vendorId] || vendors[`v${meal.vendorId?.replace('v1', 'v1').replace('v2', 'v2').replace('v3', 'v3').replace('v4', 'v4')}`]}
                onAddToCart={addToCart}
              />
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Container>
  );
};

export default Menu;
