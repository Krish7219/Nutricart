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
  Card,
  CardBody,
  CardFooter,
  IconButton,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { FiArrowRight, FiStar, FiTrendingUp, FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { mealsAPI, vendorsAPI } from '../services/api';
import { GOALS } from '../data/mockData';

const MealCard = ({ meal, showVendor = true, vendorsList }) => {
  const { addToCart } = useCart();
  const vendor = vendorsList?.find(v => v._id === meal.vendorId || v.id === meal.vendorId);

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
            display="flex"
            alignItems="center"
            gap={1}
          >
            <FiTrendingUp /> Trending
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
          onClick={() => addToCart(meal)}
        />
      </Box>

      <CardBody pb={2}>
        <VStack align="stretch" spacing={1}>
          <Text fontWeight="600" fontSize="md" noOfLines={1}>
            {meal.name}
          </Text>
          {showVendor && vendor && (
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
            <Text color="gray.500" fontSize="sm">({meal.orderCount})</Text>
          </HStack>
          <Text fontWeight="bold" color="brand.600" fontSize="lg">
            ₹{(meal.price / 100).toFixed(2)}
          </Text>
        </HStack>
      </CardFooter>
    </Card>
  );
};

const VendorCard = ({ vendor }) => {
  return (
    <Card
      variant="outline"
      borderColor="gray.100"
      _hover={{ boxShadow: 'md' }}
      transition="all 0.2s"
    >
      <CardBody>
        <HStack spacing={4}>
          <Image
            src={vendor.image}
            alt={vendor.name}
            w={16}
            h={16}
            borderRadius="lg"
            objectFit="cover"
          />
          <VStack align="start" spacing={1} flex={1}>
            <Text fontWeight="600">{vendor.name}</Text>
            <HStack spacing={2}>
              <HStack spacing={1}>
                <Icon as={FiStar} color="yellow.400" boxSize={3} />
                <Text fontSize="sm">{vendor.rating}</Text>
              </HStack>
              <Text fontSize="sm" color="gray.500">•</Text>
              <Text fontSize="sm" color="gray.500">{vendor.deliveryTime}</Text>
            </HStack>
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );
};

const Home = () => {
  const { user } = useAuth();
  const [trendingMeals, setTrendingMeals] = useState([]);
  const [allMeals, setAllMeals] = useState([]);
  const [vendorsList, setVendorsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trending, meals, vendors] = await Promise.all([
          mealsAPI.getTrending(),
          mealsAPI.getAll(),
          vendorsAPI.getAll()
        ]);
        setTrendingMeals(trending);
        setAllMeals(meals);
        setVendorsList(vendors);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const recommendations = user && user.goals 
    ? allMeals.filter(meal => meal.goals?.some(g => user.goals.includes(g)))
    : allMeals.slice(0, 4);

  if (loading) {
    return (
      <Center py={20}>
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg="linear-gradient(135deg, #E6F2EB 0%, #C2DFCD 100%)"
        py={16}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} alignItems="center">
            <VStack align={{ base: 'center', lg: 'start' }} spacing={6} textAlign={{ base: 'center', lg: 'left' }}>
              <Box>
                <Badge colorScheme="brand" mb={2}>🥗 Fresh & Healthy</Badge>
                <Heading size="2xl" color="brand.700" lineHeight="1.2">
                  Delicious Meals,{' '}
                  <Text as="span" color="brand.500">Nutritious Living</Text>
                </Heading>
              </Box>
              <Text fontSize="lg" color="gray.600" maxW="lg">
                Discover chef-crafted healthy meals tailored to your goals. 
                From weight loss to muscle gain, find your perfect meal plan.
              </Text>
              <HStack spacing={4}>
                <Button
                  as={RouterLink}
                  to="/menu"
                  colorScheme="brand"
                  size="lg"
                  rightIcon={<FiArrowRight />}
                >
                  Explore Menu
                </Button>
                <Button
                  as={RouterLink}
                  to="/subscriptions"
                  variant="outline"
                  colorScheme="brand"
                  size="lg"
                >
                  View Plans
                </Button>
              </HStack>
            </VStack>

            <Box display={{ base: 'none', lg: 'block' }}>
              <Image
                src="https://images.unsplash.com/photo-1543362906-acfc16c67564?w=600"
                alt="Healthy food"
                borderRadius="2xl"
                boxShadow="xl"
              />
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      <Container maxW="container.xl" py={12}>
        {/* Goals Section */}
        <VStack spacing={6} mb={12}>
          <VStack spacing={2} textAlign="center">
            <Heading size="lg">Find Your Perfect Match</Heading>
            <Text color="gray.600">Filter meals by your health goals</Text>
          </VStack>
          
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} w="full">
            {GOALS.slice(0, 4).map(goal => (
              <Button
                key={goal.id}
                as={RouterLink}
                to={`/menu?goal=${goal.id}`}
                variant="outline"
                h="auto"
                py={4}
                flexDirection="column"
                gap={2}
                borderColor="gray.200"
                _hover={{ borderColor: 'brand.500', bg: 'brand.50' }}
              >
                <Text fontSize="2xl">{goal.icon}</Text>
                <Text fontWeight="600" fontSize="sm">{goal.name}</Text>
              </Button>
            ))}
          </SimpleGrid>
        </VStack>

        {/* Trending Meals */}
        <VStack spacing={6} mb={12}>
          <HStack justify="space-between" w="full">
            <VStack align="start" spacing={1}>
              <HStack>
                <Icon as={FiTrendingUp} color="brand.500" />
                <Heading size="md">Trending Now</Heading>
              </HStack>
              <Text color="gray.500">Most popular meals this week</Text>
            </VStack>
            <Button
              as={RouterLink}
              to="/menu"
              variant="ghost"
              rightIcon={<FiArrowRight />}
              size="sm"
            >
              View All
            </Button>
          </HStack>

          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6} w="full">
            {trendingMeals.slice(0, 4).map(meal => (
              <MealCard key={meal._id || meal.id} meal={meal} vendorsList={vendorsList} />
            ))}
          </SimpleGrid>
        </VStack>

        {/* Personalized Recommendations */}
        {user && recommendations.length > 0 && (
          <VStack spacing={6} mb={12}>
            <HStack justify="space-between" w="full">
              <VStack align="start" spacing={1}>
                <HStack>
                  <Icon as={FiHeart} color="brand.500" />
                  <Heading size="md">Recommended For You</Heading>
                </HStack>
                <Text color="gray.500">Based on your health goals</Text>
              </VStack>
            </HStack>

            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6} w="full">
              {recommendations.slice(0, 4).map(meal => (
                <MealCard key={meal._id || meal.id} meal={meal} vendorsList={vendorsList} />
              ))}
            </SimpleGrid>
          </VStack>
        )}

        {/* Popular Vendors */}
        <VStack spacing={6}>
          <Heading size="md">Popular Restaurants</Heading>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4} w="full">
            {vendorsList.map(vendor => (
              <VendorCard key={vendor._id} vendor={vendor} />
            ))}
          </SimpleGrid>
        </VStack>

        {/* CTA Section */}
        <Box
          mt={16}
          p={8}
          bg="brand.500"
          borderRadius="2xl"
          textAlign="center"
        >
          <VStack spacing={4}>
            <Heading size="md" color="white">
              Save More with Subscriptions
            </Heading>
            <Text color="whiteAlpha.800" maxW="lg">
              Get up to 20% off with our weekly or monthly meal plans. 
              Delivered fresh to your door.
            </Text>
            <Button
              as={RouterLink}
              to="/subscriptions"
              bg="white"
              color="brand.500"
              size="lg"
              _hover={{ bg: 'gray.100' }}
            >
              View Subscription Plans
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
