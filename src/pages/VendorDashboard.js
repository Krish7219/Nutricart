import React, { useState } from 'react';
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
  Select,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { FiTrendingUp, FiShoppingBag, FiStar, FiDollarSign, FiUsers, FiActivity, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { meals, vendors } from '../data/mockData';

const VendorDashboard = () => {
  const [selectedVendor, setSelectedVendor] = useState(vendors[0]);
  
  const vendorMeals = meals.filter(meal => meal.vendorId === selectedVendor.id);
  const popularMeals = vendorMeals.sort((a, b) => b.orderCount - a.orderCount).slice(0, 5);

  // Calculate stats
  const totalOrders = vendorMeals.reduce((sum, meal) => sum + meal.orderCount, 0);
  const avgRating = (vendorMeals.reduce((sum, meal) => sum + meal.rating, 0) / vendorMeals.length).toFixed(1);
  const totalRevenue = totalOrders * (vendorMeals.reduce((sum, meal) => sum + meal.price, 0) / vendorMeals.length);
  const avgCalories = Math.round(vendorMeals.reduce((sum, meal) => sum + meal.calories, 0) / vendorMeals.length);

  return (
    <Box minH="calc(100vh - 64px)" bg="gray.50" py={8}>
      <Container maxW="container.xl">
        {/* Header */}
        <HStack justify="space-between" mb={8}>
          <VStack align="start" spacing={1}>
            <Heading size="xl">Vendor Dashboard</Heading>
            <Text color="gray.500">Manage your restaurant and track performance</Text>
          </VStack>
          <Select
            value={selectedVendor.id}
            onChange={(e) => setSelectedVendor(vendors.find(v => v.id === e.target.value))}
            bg="white"
            w="200px"
          >
            {vendors.map(vendor => (
              <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
            ))}
          </Select>
        </HStack>

        {/* Stats Overview */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} mb={8}>
          <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
            <HStack justify="space-between" mb={2}>
              <Icon as={FiShoppingBag} color="brand.500" boxSize={6} />
              <Icon as={FiArrowUp} color="green.500" />
            </HStack>
            <Stat>
              <StatLabel>Total Orders</StatLabel>
              <StatNumber>{totalOrders}</StatNumber>
              <StatHelpText><StatArrow type="increase" />12% from last week</StatHelpText>
            </Stat>
          </Box>

          <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
            <HStack justify="space-between" mb={2}>
              <Icon as={FiDollarSign} color="green.500" boxSize={6} />
              <Icon as={FiArrowUp} color="green.500" />
            </HStack>
            <Stat>
              <StatLabel>Revenue</StatLabel>
              <StatNumber>${totalRevenue.toFixed(0)}</StatNumber>
              <StatHelpText><StatArrow type="increase" />8% from last week</StatHelpText>
            </Stat>
          </Box>

          <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
            <HStack justify="space-between" mb={2}>
              <Icon as={FiStar} color="yellow.500" boxSize={6} />
            </HStack>
            <Stat>
              <StatLabel>Average Rating</StatLabel>
              <StatNumber>{avgRating}</StatNumber>
              <StatHelpText>Based on {totalOrders} reviews</StatHelpText>
            </Stat>
          </Box>

          <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
            <HStack justify="space-between" mb={2}>
              <Icon as={FiUsers} color="purple.500" boxSize={6} />
            </HStack>
            <Stat>
              <StatLabel>Customers</StatLabel>
              <StatNumber>{selectedVendor.totalOrders}</StatNumber>
              <StatHelpText><StatArrow type="increase" />15% new customers</StatHelpText>
            </Stat>
          </Box>
        </SimpleGrid>

        <Tabs colorScheme="brand">
          <TabList>
            <Tab fontWeight="600">Popular Items</Tab>
            <Tab fontWeight="600">Menu Performance</Tab>
            <Tab fontWeight="600">Demand Insights</Tab>
          </TabList>

          <TabPanels>
            {/* Popular Items */}
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
                  <Heading size="md" mb={4}>Top Performing Meals</Heading>
                  <VStack spacing={4} align="stretch">
                    {popularMeals.map((meal, index) => (
                      <HStack key={meal.id} justify="space-between" p={3} bg="gray.50" borderRadius="lg">
                        <HStack spacing={4}>
                          <Text fontWeight="bold" color={index < 3 ? 'brand.500' : 'gray.500'} w={6}>
                            #{index + 1}
                          </Text>
                          <Image src={meal.image} alt={meal.name} w={12} h={12} borderRadius="lg" objectFit="cover" />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="600" noOfLines={1}>{meal.name}</Text>
                            <HStack spacing={2}>
                              <Badge colorScheme="green" fontSize="xs">{meal.orderCount} orders</Badge>
                              <Badge colorScheme="yellow" fontSize="xs">⭐ {meal.rating}</Badge>
                            </HStack>
                          </VStack>
                        </HStack>
                        <VStack align="end" spacing={0}>
                          <Text fontWeight="bold" color="brand.600">₹{(meal.price / 100).toFixed(2)}</Text>
                          <Text fontSize="xs" color="gray.500">₹{((meal.price * meal.orderCount) / 100).toFixed(0)} revenue</Text>
                        </VStack>
                      </HStack>
                    ))}
                  </VStack>
                </Box>

                <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
                  <Heading size="md" mb={4}>Popular Categories</Heading>
                  <VStack spacing={4} align="stretch">
                    {['High Protein', 'Vegan', 'Low Carb', 'Weight Loss'].map((category, index) => (
                      <Box key={category}>
                        <HStack justify="space-between" mb={1}>
                          <Text fontWeight="500">{category}</Text>
                          <Text fontSize="sm" color="gray.500">{Math.round(40 - index * 8)}% of orders</Text>
                        </HStack>
                        <Progress value={40 - index * 8} colorScheme="brand" borderRadius="full" size="sm" />
                      </Box>
                    ))}
                  </VStack>

                  <Box mt={6}>
                    <Heading size="sm" mb={4}>Customer Demand Trend</Heading>
                    <HStack spacing={4}>
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                        <VStack key={day} spacing={1}>
                          <Box w={8} h={`${30 + Math.random() * 50}px`} bg={index === new Date().getDay() - 1 ? 'brand.500' : 'brand.200'} borderRadius="md" />
                          <Text fontSize="xs" color="gray.500">{day}</Text>
                        </VStack>
                      ))}
                    </HStack>
                  </Box>
                </Box>
              </SimpleGrid>
            </TabPanel>

            {/* Menu Performance */}
            <TabPanel px={0}>
              <Box bg="white" borderRadius="xl" boxShadow="sm" overflow="hidden">
                <Table variant="simple">
                  <Thead bg="gray.50">
                    <Tr>
                      <Th>Meal</Th>
                      <Th>Price</Th>
                      <Th isNumeric>Orders</Th>
                      <Th isNumeric>Rating</Th>
                      <Th isNumeric>Revenue</Th>
                      <Th>Performance</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {vendorMeals.sort((a, b) => b.orderCount - a.orderCount).map(meal => (
                      <Tr key={meal.id}>
                        <Td>
                          <HStack>
                            <Image src={meal.image} alt={meal.name} w={10} h={10} borderRadius="md" objectFit="cover" />
                            <Text fontWeight="500" noOfLines={1}>{meal.name}</Text>
                          </HStack>
                        </Td>
                        <Td>₹{(meal.price / 100).toFixed(2)}</Td>
                        <Td isNumeric>{meal.orderCount}</Td>
                        <Td isNumeric>
                          <Badge colorScheme={meal.rating >= 4.5 ? 'green' : 'yellow'}>
                            ⭐ {meal.rating}
                          </Badge>
                        </Td>
                        <Td isNumeric>₹{((meal.price * meal.orderCount) / 100).toFixed(2)}</Td>
                        <Td>
                          <Badge colorScheme={meal.orderCount > 200 ? 'green' : meal.orderCount > 150 ? 'yellow' : 'red'}>
                            {meal.orderCount > 200 ? 'Excellent' : meal.orderCount > 150 ? 'Good' : 'Needs Improvement'}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>

            {/* Demand Insights */}
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
                <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
                  <Heading size="md" mb={4}>Demand-Based Recommendations</Heading>
                  <VStack spacing={4} align="stretch">
                    <Box p={4} bg="green.50" borderRadius="lg" borderLeft="4px solid green.500">
                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="600">High Demand Items</Text>
                          <Text fontSize="sm" color="gray.600">Consider increasing stock</Text>
                        </VStack>
                        <Badge colorScheme="green">{popularMeals.slice(0, 2).map(m => m.name.split(' ')[0]).join(', ')}</Badge>
                      </HStack>
                    </Box>
                    <Box p={4} bg="yellow.50" borderRadius="lg" borderLeft="4px solid yellow.500">
                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="600">Growing Categories</Text>
                          <Text fontSize="sm" color="gray.600">Keto meals up 23% this month</Text>
                        </VStack>
                        <Badge colorScheme="yellow">📈 +23%</Badge>
                      </HStack>
                    </Box>
                    <Box p={4} bg="red.50" borderRadius="lg" borderLeft="4px solid red.500">
                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="600">Low Performance</Text>
                          <Text fontSize="sm" color="gray.600">Consider redesigning or removing</Text>
                        </VStack>
                        <Badge colorScheme="red">{vendorMeals.sort((a, b) => a.orderCount - b.orderCount)[0]?.name?.split(' ').slice(0, 2).join(' ')}</Badge>
                      </HStack>
                    </Box>
                  </VStack>
                </Box>

                <Box bg="white" p={6} borderRadius="xl" boxShadow="sm">
                  <Heading size="md" mb={4}>Market Insights</Heading>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between" p={3} borderBottom="1px" borderColor="gray.100">
                      <Text>Average order value</Text>
                      <Text fontWeight="bold">$14.50</Text>
                    </HStack>
                    <HStack justify="space-between" p={3} borderBottom="1px" borderColor="gray.100">
                      <Text>Peak ordering hours</Text>
                      <Text fontWeight="bold">12pm - 2pm</Text>
                    </HStack>
                    <HStack justify="space-between" p={3} borderBottom="1px" borderColor="gray.100">
                      <Text>Most popular day</Text>
                      <Text fontWeight="bold">Wednesday</Text>
                    </HStack>
                    <HStack justify="space-between" p={3} borderBottom="1px" borderColor="gray.100">
                      <Text>Repeat customer rate</Text>
                      <Text fontWeight="bold">68%</Text>
                    </HStack>
                    <HStack justify="space-between" p={3}>
                      <Text>Avg calories per meal</Text>
                      <Text fontWeight="bold">{avgCalories}</Text>
                    </HStack>
                  </VStack>
                </Box>
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
};

export default VendorDashboard;
