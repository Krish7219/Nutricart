import React from 'react';
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
  Button,
  Icon,
  Avatar,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Progress,
  Divider,
  Tag,
} from '@chakra-ui/react';
import { FiInstagram, FiTwitter, FiYoutube, FiUsers, FiHeart, FiMessageCircle, FiShare2, FiPlay } from 'react-icons/fi';

const influencers = [
  {
    id: 1,
    name: 'Fitness with Sarah',
    handle: '@fitness_sarah',
    platform: 'instagram',
    followers: 2500000,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    coverImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    bio: 'Certified fitness coach helping you achieve your dream body with healthy nutrition.',
    specialty: 'Fitness & Nutrition',
    collaboration: 'Brand Ambassador',
    testimonials: [
      { text: "NutriCart meals helped me maintain my protein intake during prep!", likes: 15420 }
    ],
    promotedMeals: ['Chicken Breast Power Bowl', 'Grilled Salmon with Asparagus']
  },
  {
    id: 2,
    name: 'Healthy Living with Mike',
    handle: '@healthy_mike',
    platform: 'youtube',
    followers: 1800000,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    coverImage: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800',
    bio: 'YouTube fitness coach with daily workout and meal prep videos.',
    specialty: 'Weight Loss',
    collaboration: 'Content Creator',
    testimonials: [
      { text: "My subscribers love the NutriCart meal plans I recommend!", likes: 23100 }
    ],
    promotedMeals: ['Mediterranean Quinoa Bowl', 'Acai Bowl']
  },
  {
    id: 3,
    name: 'Yoga & Wellness with Priya',
    handle: '@yogapriya',
    platform: 'instagram',
    followers: 1200000,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    bio: 'Yoga instructor promoting mindful eating and holistic health.',
    specialty: 'Mindful Eating',
    collaboration: 'Partner',
    testimonials: [
      { text: "NutriCart makes clean eating so convenient for my lifestyle", likes: 8900 }
    ],
    promotedMeals: ['Mediterranean Quinoa Bowl']
  },
  {
    id: 4,
    name: 'Muscle Max with Jake',
    handle: '@musclemax',
    platform: 'youtube',
    followers: 3500000,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    bio: 'Professional bodybuilder sharing his nutrition secrets.',
    specialty: 'Muscle Building',
    collaboration: 'Brand Ambassador',
    testimonials: [
      { text: "48g protein per meal - exactly what my muscles need!", likes: 45200 }
    ],
    promotedMeals: ['Chicken Breast Power Bowl', 'Grilled Salmon with Asparagus']
  },
  {
    id: 5,
    name: 'Plant Powered Lisa',
    handle: '@plantpowered_lisa',
    platform: 'instagram',
    followers: 850000,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    coverImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
    bio: 'Vegan athlete proving plant-based meals fuel performance.',
    specialty: 'Vegan Nutrition',
    collaboration: 'Partner',
    testimonials: [
      { text: "Even as a vegan athlete, I get all my protein from NutriCart!", likes: 12800 }
    ],
    promotedMeals: ['Mediterranean Quinoa Bowl', 'Acai Bowl']
  },
  {
    id: 6,
    name: 'Tech Fit Alex',
    handle: '@techfit_alex',
    platform: 'twitter',
    followers: 450000,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    coverImage: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800',
    bio: 'Tech professional sharing quick healthy meal solutions for busy lifestyles.',
    specialty: 'Convenience Health',
    collaboration: 'Affiliate',
    testimonials: [
      { text: "Healthy eating on the go is finally possible with NutriCart!", likes: 5600 }
    ],
    promotedMeals: ['Chicken Breast Power Bowl']
  }
];

const platformIcons = {
  instagram: FiInstagram,
  youtube: FiYoutube,
  twitter: FiTwitter,
};

const Influencers = () => {
  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'instagram': return 'pink.500';
      case 'youtube': return 'red.500';
      case 'twitter': return 'blue.400';
      default: return 'gray.500';
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  return (
    <Box minH="calc(100vh - 64px)" bg="gray.50" py={8}>
      <Container maxW="container.xl">
        {/* Hero Section */}
        <Box 
          bg="linear-gradient(135deg, #2F855A 0%, #276749 100%)" 
          p={12} 
          borderRadius="2xl" 
          mb={8}
          textAlign="center"
        >
          <Heading color="white" size="xl" mb={4}>
            💪 Our Fitness Partners & Ambassadors
          </Heading>
          <Text color="whiteAlpha.800" fontSize="lg" maxW="2xl" mx="auto">
            Join thousands of fitness influencers who trust NutriCart for their nutrition needs.
            See what our amazing partners have to say!
          </Text>
          <HStack justify="center" mt={6} spacing={4}>
            <Button colorScheme="whiteAlpha" size="lg">
              Become a Partner
            </Button>
            <Button bg="white" color="brand.500" size="lg" _hover={{ bg: 'gray.100' }}>
              View Collaboration Details
            </Button>
          </HStack>
        </Box>

        {/* Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} mb={8}>
          <Box bg="white" p={6} borderRadius="xl" textAlign="center" boxShadow="sm">
            <Icon as={FiUsers} boxSize={8} color="brand.500" mb={2} />
            <Text fontSize="3xl" fontWeight="bold" color="brand.500">50+</Text>
            <Text color="gray.500">Partner Influencers</Text>
          </Box>
          <Box bg="white" p={6} borderRadius="xl" textAlign="center" boxShadow="sm">
            <Text fontSize="3xl" fontWeight="bold" color="purple.500">12M+</Text>
            <Text color="gray.500">Total Reach</Text>
          </Box>
          <Box bg="white" p={6} borderRadius="xl" textAlign="center" boxShadow="sm">
            <Text fontSize="3xl" fontWeight="bold" color="orange.500">100K+</Text>
            <Text color="gray.500">Social Engagements</Text>
          </Box>
          <Box bg="white" p={6} borderRadius="xl" textAlign="center" boxShadow="sm">
            <Text fontSize="3xl" fontWeight="bold" color="green.500">4.9</Text>
            <Text color="gray.500">Average Rating</Text>
          </Box>
        </SimpleGrid>

        <Tabs colorScheme="brand" variant="enclosed">
          <TabList>
            <Tab fontWeight="600"><Icon as={FiInstagram} mr={2} />Instagram</Tab>
            <Tab fontWeight="600"><Icon as={FiYoutube} mr={2} />YouTube</Tab>
            <Tab fontWeight="600"><Icon as={FiTwitter} mr={2} />Twitter</Tab>
          </TabList>

          <TabPanels>
            {['instagram', 'youtube', 'twitter'].map((platform) => (
              <TabPanel px={0} key={platform}>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {influencers.filter(i => i.platform === platform).map((influencer) => (
                    <Box 
                      key={influencer.id} 
                      bg="white" 
                      borderRadius="xl" 
                      overflow="hidden" 
                      boxShadow="sm"
                      _hover={{ transform: 'translateY(-4px)', boxShadow: 'md' }}
                      transition="all 0.3s"
                    >
                      <Box position="relative">
                        <Image 
                          src={influencer.coverImage} 
                          alt={influencer.name} 
                          h={32} 
                          w="full" 
                          objectFit="cover"
                        />
                        <Box 
                          position="absolute" 
                          bottom={-10} 
                          left={4}
                        >
                          <Avatar 
                            size="xl" 
                            name={influencer.name} 
                            src={influencer.avatar} 
                            border="4px solid white"
                          />
                        </Box>
                        <Badge 
                          position="absolute" 
                          top={2} 
                          right={2}
                          colorScheme={influencer.collaboration === 'Brand Ambassador' ? 'purple' : 'green'}
                        >
                          {influencer.collaboration}
                        </Badge>
                      </Box>
                      
                      <Box pt={12} p={4}>
                        <HStack justify="space-between" mb={1}>
                          <Heading size="sm">{influencer.name}</Heading>
                          <Icon as={platformIcons[influencer.platform]} color={getPlatformColor(influencer.platform)} />
                        </HStack>
                        <Text color="gray.500" fontSize="sm" mb={2}>{influencer.handle}</Text>
                        
                        <HStack spacing={4} mb={3}>
                          <VStack spacing={0} align="start">
                            <Text fontWeight="bold" fontSize="lg">{formatNumber(influencer.followers)}</Text>
                            <Text fontSize="xs" color="gray.500">Followers</Text>
                          </VStack>
                          <VStack spacing={0} align="start">
                            <Text fontWeight="bold" fontSize="lg">{influencer.testimonials[0].likes.toLocaleString()}</Text>
                            <Text fontSize="xs" color="gray.500">Likes</Text>
                          </VStack>
                        </HStack>
                        
                        <Tag colorScheme="brand" size="sm" mb={3}>{influencer.specialty}</Tag>
                        
                        <Text fontSize="sm" color="gray.600" mb={3} noOfLines={2}>
                          "{influencer.testimonials[0].text}"
                        </Text>
                        
                        <Divider mb={3} />
                        
                        <Text fontSize="xs" fontWeight="600" mb={2}>Promoted Meals:</Text>
                        <HStack spacing={2} flexWrap="wrap">
                          {influencer.promotedMeals.map((meal, idx) => (
                            <Badge key={idx} variant="subtle" colorScheme="green" fontSize="xs">
                              {meal}
                            </Badge>
                          ))}
                        </HStack>
                        
                        <HStack mt={4} spacing={2}>
                          <Button size="sm" colorScheme="brand" flex={1} leftIcon={<FiMessageCircle />}>
                            Message
                          </Button>
                          <Button size="sm" variant="outline" flex={1} leftIcon={<FiShare2 />}>
                            Share
                          </Button>
                        </HStack>
                      </Box>
                    </Box>
                  ))}
                </SimpleGrid>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>

        {/* Become a Partner CTA */}
        <Box bg="white" p={8} borderRadius="xl" mt={8} boxShadow="sm">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} alignItems="center">
            <Box>
              <Heading size="lg" mb={4}>Want to Partner with Us?</Heading>
              <Text color="gray.600" mb={4}>
                Join our growing network of fitness influencers and content creators.
                Get exclusive benefits, free meals, and competitive commission rates.
              </Text>
              <VStack align="start" spacing={2}>
                <HStack><Icon as={FiHeart} color="red.500" /><Text>Free meal delivery every week</Text></HStack>
                <HStack><Icon as={FiUsers} color="brand.500" /><Text>Access to exclusive events</Text></HStack>
                <HStack><Icon as={FiPlay} color="purple.500" /><Text>YouTube partnership program</Text></HStack>
              </VStack>
            </Box>
            <Box textAlign="center">
              <Image 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400" 
                alt="Team collaboration"
                borderRadius="xl"
                mx="auto"
              />
              <Button colorScheme="brand" size="lg" mt={4}>
                Apply Now
              </Button>
            </Box>
          </SimpleGrid>
        </Box>

        {/* Featured Testimonials */}
        <Box mt={8}>
          <Heading size="lg" mb={6}>What Influencers Say</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {influencers.slice(0, 3).map((influencer) => (
              <Box key={influencer.id} bg="white" p={6} borderRadius="xl" boxShadow="sm">
                <HStack mb={4}>
                  <Avatar size="md" name={influencer.name} src={influencer.avatar} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">{influencer.name}</Text>
                    <Text fontSize="sm" color="gray.500">{influencer.handle}</Text>
                  </VStack>
                </HStack>
                <Text color="gray.600" mb={4}>"{influencer.testimonials[0].text}"</Text>
                <HStack justify="space-between">
                  <HStack color="red.500">
                    <Icon as={FiHeart} />
                    <Text fontSize="sm">{formatNumber(influencer.testimonials[0].likes)}</Text>
                  </HStack>
                  <Badge colorScheme="brand">{influencer.specialty}</Badge>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>
      </Container>
    </Box>
  );
};

export default Influencers;
