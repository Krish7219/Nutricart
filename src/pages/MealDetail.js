import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Badge,
  Button,
  Icon,
  Grid,
  GridItem,
  Card,
  CardBody,
  Spinner,
  Center,
  Divider,
} from '@chakra-ui/react';
import { FiArrowLeft, FiStar, FiShoppingCart, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { mealsAPI, vendorsAPI } from '../services/api';

const MealDetail = () => {
  const { mealId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [meal, setMeal] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const mealData = await mealsAPI.getById(mealId);
        setMeal(mealData);
        
        if (mealData.vendorId) {
          const vendorData = await vendorsAPI.getById(mealData.vendorId);
          setVendor(vendorData);
        }
      } catch (error) {
        console.error('Error fetching meal:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeal();
  }, [mealId]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(meal);
    }
    navigate('/cart');
  };

  if (loading) {
    return (
      <Center py={20}>
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  if (!meal) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack>
          <Text>Meal not found</Text>
          <Button as={RouterLink} to="/menu">Back to Menu</Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Button
        leftIcon={<FiArrowLeft />}
        variant="ghost"
        mb={4}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
        <GridItem>
          <Image
            src={meal.image}
            alt={meal.name}
            borderRadius="xl"
            w="full"
            h={{ base: '300px', md: '400px' }}
            objectFit="cover"
          />
        </GridItem>

        <GridItem>
          <VStack align="stretch" spacing={4}>
            <Box>
              <HStack mb={2}>
                {meal.trending && (
                  <Badge colorScheme="orange" fontSize="sm">
                    Trending
                  </Badge>
                )}
                {meal.goals?.map(goal => (
                  <Badge key={goal} colorScheme="green" variant="subtle">
                    {goal}
                  </Badge>
                ))}
              </HStack>
              <Heading size="xl">{meal.name}</Heading>
              {vendor && (
                <Text color="gray.600" mt={1}>
                  by {vendor.name} • {vendor.deliveryTime}
                </Text>
              )}
            </Box>

            <HStack>
              <Icon as={FiStar} color="yellow.400" />
              <Text fontWeight="600">{meal.rating}</Text>
              <Text color="gray.500">({meal.orderCount} orders)</Text>
            </HStack>

            <Text color="gray.600">{meal.description}</Text>

            {/* Nutrition Info */}
            <Card variant="outline">
              <CardBody>
                <Heading size="sm" mb={3}>Nutrition Facts</Heading>
                <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                  <Box textAlign="center">
                    <Text fontWeight="bold" fontSize="lg">{meal.calories}</Text>
                    <Text fontSize="xs" color="gray.500">Calories</Text>
                  </Box>
                  <Box textAlign="center">
                    <Text fontWeight="bold" fontSize="lg">{meal.protein}g</Text>
                    <Text fontSize="xs" color="gray.500">Protein</Text>
                  </Box>
                  <Box textAlign="center">
                    <Text fontWeight="bold" fontSize="lg">{meal.carbs}g</Text>
                    <Text fontSize="xs" color="gray.500">Carbs</Text>
                  </Box>
                  <Box textAlign="center">
                    <Text fontWeight="bold" fontSize="lg">{meal.fat}g</Text>
                    <Text fontSize="xs" color="gray.500">Fat</Text>
                  </Box>
                </Grid>
              </CardBody>
            </Card>

            {/* Ingredients & Allergens */}
            <Box>
              <Heading size="sm" mb={2}>Ingredients</Heading>
              <Text color="gray.600">
                {meal.nutrition?.ingredients?.join(', ') || 'Contact vendor for details'}
              </Text>
            </Box>

            {meal.nutrition?.allergens?.length > 0 && (
              <Box>
                <Heading size="sm" mb={2}>Allergens</Heading>
                <HStack wrap="wrap">
                  {meal.nutrition.allergens.map(allergen => (
                    <Badge key={allergen} colorScheme="red">
                      {allergen}
                    </Badge>
                  ))}
                </HStack>
              </Box>
            )}

            <Divider />

            {/* Price & Add to Cart */}
            <HStack justify="space-between" align="center">
              <HStack>
                <Button
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <Text fontWeight="bold" minW="30px" textAlign="center">
                  {quantity}
                </Text>
                <Button
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </HStack>
              <HStack>
                <Text fontSize="2xl" fontWeight="bold" color="brand.600">
                  ₹{((meal.price * quantity) / 100).toFixed(2)}
                </Text>
                <Button
                  leftIcon={<FiShoppingCart />}
                  colorScheme="brand"
                  size="lg"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </HStack>
            </HStack>
          </VStack>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default MealDetail;
