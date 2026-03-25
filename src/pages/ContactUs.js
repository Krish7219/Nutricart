import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
  Select,
  FormControl,
  FormLabel,
  useToast,
  Divider,
  Badge,
  Icon,
  Flex,
  Avatar,
} from '@chakra-ui/react';
import { FiPhone, FiMail, FiMapPin, FiStar, FiSend } from 'react-icons/fi';
import { vendorsAPI } from '../services/api';

const ContactUs = () => {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
    customerName: '',
    customerEmail: '',
  });
  const toast = useToast();

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const data = await vendorsAPI.getAll();
      setVendors(data);
      if (data.length > 0) {
        setSelectedVendor(data[0]._id);
      }
    } catch (error) {
      console.error('Error loading vendors:', error);
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    toast({
      title: 'Review Submitted!',
      description: 'Thank you for your feedback. We appreciate your suggestions!',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    setReviewData({
      rating: 5,
      comment: '',
      customerName: '',
      customerEmail: '',
    });
  };

  const currentVendor = vendors.find(v => v._id === selectedVendor);

  return (
    <Box minH="calc(100vh - 64px)" bg="gray.50" py={12}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading size="xl" color="brand.600" mb={2}>
              Contact Us
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Have questions or suggestions? We'd love to hear from you!
            </Text>
          </Box>

          {/* Vendor Contact Cards */}
          <Box>
            <Heading size="md" mb={4} color="gray.700">
              Our Vendors
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {vendors.map((vendor) => (
                <Card key={vendor._id} _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }} transition="all 0.2s">
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <HStack>
                        <Avatar size="sm" src={vendor.image} name={vendor.name} />
                        <Box>
                          <Text fontWeight="bold">{vendor.name}</Text>
                          <HStack spacing={1}>
                            <Icon as={FiStar} color="yellow.400" boxSize={3} />
                            <Text fontSize="sm" color="gray.600">{vendor.rating}</Text>
                          </HStack>
                        </Box>
                      </HStack>
                      <Divider />
                      <VStack align="start" spacing={1} w="full">
                        {vendor.phone && (
                          <HStack fontSize="sm" color="gray.600">
                            <Icon as={FiPhone} />
                            <Text>{vendor.phone}</Text>
                          </HStack>
                        )}
                        {vendor.email && (
                          <HStack fontSize="sm" color="gray.600">
                            <Icon as={FiMail} />
                            <Text>{vendor.email}</Text>
                          </HStack>
                        )}
                        {vendor.address && (
                          <HStack fontSize="sm" color="gray.600" align="start">
                            <Icon as={FiMapPin} mt={1} />
                            <Text>{vendor.address}</Text>
                          </HStack>
                        )}
                      </VStack>
                      <Badge colorScheme="green" mt={2}>
                        {vendor.deliveryTime}
                      </Badge>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>

          {/* Write Review Section */}
          <Box>
            <Heading size="md" mb={4} color="gray.700">
              Write a Review
            </Heading>
            <Card>
              <CardBody>
                <form onSubmit={handleSubmitReview}>
                  <VStack spacing={5} align="stretch">
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Your Name</FormLabel>
                        <Input
                          placeholder="Enter your name"
                          value={reviewData.customerName}
                          onChange={(e) => setReviewData({ ...reviewData, customerName: e.target.value })}
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={reviewData.customerEmail}
                          onChange={(e) => setReviewData({ ...reviewData, customerEmail: e.target.value })}
                        />
                      </FormControl>
                    </SimpleGrid>

                    <FormControl isRequired>
                      <FormLabel>Select Vendor</FormLabel>
                      <Select
                        value={selectedVendor}
                        onChange={(e) => setSelectedVendor(e.target.value)}
                      >
                        {vendors.map((vendor) => (
                          <option key={vendor._id} value={vendor._id}>
                            {vendor.name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Rating</FormLabel>
                      <HStack spacing={2}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Button
                            key={star}
                            variant="ghost"
                            onClick={() => setReviewData({ ...reviewData, rating: star })}
                            p={0}
                          >
                            <Icon
                              as={FiStar}
                              boxSize={6}
                              color={star <= reviewData.rating ? 'yellow.400' : 'gray.300'}
                              fill={star <= reviewData.rating ? 'yellow.400' : 'none'}
                            />
                          </Button>
                        ))}
                        <Text ml={2} color="gray.600">
                          {reviewData.rating} Star{reviewData.rating !== 1 ? 's' : ''}
                        </Text>
                      </HStack>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Your Review / Suggestions</FormLabel>
                      <Textarea
                        placeholder="Share your experience, suggestions, or feedback..."
                        rows={4}
                        value={reviewData.comment}
                        onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                      />
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="brand"
                      size="lg"
                      rightIcon={<FiSend />}
                    >
                      Submit Review
                    </Button>
                  </VStack>
                </form>
              </CardBody>
            </Card>
          </Box>

          {/* General Contact Info */}
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>
                General Inquiries
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <VStack align="start">
                  <HStack color="brand.500">
                    <Icon as={FiMail} boxSize={5} />
                    <Text fontWeight="bold">Email</Text>
                  </HStack>
                  <Text color="gray.600">support@nutricart.com</Text>
                </VStack>
                <VStack align="start">
                  <HStack color="brand.500">
                    <Icon as={FiPhone} boxSize={5} />
                    <Text fontWeight="bold">Phone</Text>
                  </HStack>
                  <Text color="gray.600">+1 (555) 000-1234</Text>
                </VStack>
                <VStack align="start">
                  <HStack color="brand.500">
                    <Icon as={FiMapPin} boxSize={5} />
                    <Text fontWeight="bold">Address</Text>
                  </HStack>
                  <Text color="gray.600">123 Healthy Way, Food City, FC 12345</Text>
                </VStack>
              </SimpleGrid>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
};

export default ContactUs;
