import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Text,
  VStack,
  HStack,
  useToast,
  Badge,
  Avatar,
  Divider,
} from '@chakra-ui/react';
import { FiSend, FiX, FiMessageCircle, FiCpu, FiUser } from 'react-icons/fi';
import { chatbotAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'bot',
      content: 'Hi there! 👋 I\'m your NutriCart fitness assistant. Ask me anything about nutrition, fitness, meal planning, or healthy eating. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getUserContext = () => {
    if (user) {
      return `User: ${user.name}, Goals: ${user.goals?.join(', ') || 'Not set'}, Dietary preferences: ${user.dietaryPreferences?.join(', ') || 'None'}, Tier: ${user.tier}`;
    }
    return 'Guest user';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const context = getUserContext();
      const response = await chatbotAPI.sendMessage(inputMessage, context);

      if (response.success) {
        const botMessage = {
          id: Date.now() + 1,
          role: 'bot',
          content: response.response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to get response from AI assistant',
        status: 'error',
        duration: 3000,
      });
      
      const errorMessage = {
        id: Date.now() + 1,
        role: 'bot',
        content: 'Sorry, I\'m having trouble connecting right now. Please try again later or check that the Gemini API key is configured properly.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <IconButton
        icon={<FiMessageCircle size={24} />}
        aria-label="Open fitness chatbot"
        position="fixed"
        bottom="24px"
        right="24px"
        size="lg"
        colorScheme="brand"
        borderRadius="full"
        boxShadow="lg"
        onClick={() => setIsOpen(true)}
        zIndex={1000}
        _hover={{
          transform: 'scale(1.1)',
        }}
        transition="all 0.3s"
      />

      {/* Chat Window */}
      {isOpen && (
        <Box
          position="fixed"
          bottom="90px"
          right="24px"
          width="380px"
          height="520px"
          bg="white"
          borderRadius="xl"
          boxShadow="2xl"
          zIndex={1000}
          overflow="hidden"
          display="flex"
          flexDirection="column"
        >
          {/* Header */}
          <Flex
            p={4}
            bg="brand.500"
            color="white"
            align="center"
            justify="space-between"
          >
            <HStack spacing={3}>
              <Avatar size="sm" icon={<FiCpu />} bg="white" color="brand.500" />
              <Box>
                <Text fontWeight="bold" fontSize="md">Fitness Assistant</Text>
                <HStack spacing={1}>
                  <Badge colorScheme="green" fontSize="xs">Online</Badge>
                  <Text fontSize="xs" opacity={0.8}>AI Powered</Text>
                </HStack>
              </Box>
            </HStack>
            <IconButton
              icon={<FiX />}
              aria-label="Close chat"
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
              onClick={() => setIsOpen(false)}
              size="sm"
            />
          </Flex>

          {/* Messages */}
          <VStack
            flex={1}
            p={4}
            spacing={4}
            overflowY="auto"
            bg="gray.50"
            align="stretch"
          >
            {messages.map((msg) => (
              <Flex
                key={msg.id}
                justify={msg.role === 'user' ? 'flex-end' : 'flex-start'}
              >
                <HStack
                  align="flex-end"
                  spacing={2}
                  maxWidth="85%"
                  flexDirection={msg.role === 'user' ? 'row-reverse' : 'row'}
                >
                  <Avatar
                    size="xs"
                    icon={msg.role === 'user' ? <FiUser /> : <FiCpu />}
                    bg={msg.role === 'user' ? 'gray.600' : 'brand.500'}
                  />
                  <Box
                    p={3}
                    borderRadius="lg"
                    bg={msg.role === 'user' ? 'brand.500' : 'white'}
                    color={msg.role === 'user' ? 'white' : 'gray.800'}
                    boxShadow="sm"
                    fontSize="sm"
                    lineHeight="tall"
                  >
                    <Text whiteSpace="pre-wrap">{msg.content}</Text>
                    <Text
                      fontSize="xs"
                      opacity={0.6}
                      mt={1}
                      textAlign={msg.role === 'user' ? 'right' : 'left'}
                    >
                      {formatTime(msg.timestamp)}
                    </Text>
                  </Box>
                </HStack>
              </Flex>
            ))}
            {isLoading && (
              <Flex justify="flex-start">
                <HStack align="flex-end" spacing={2}>
                  <Avatar size="xs" icon={<FiCpu />} bg="brand.500" />
                  <Box p={3} borderRadius="lg" bg="white" boxShadow="sm">
                    <HStack spacing={1}>
                      <Box w={2} h={2} borderRadius="full" bg="brand.500" animation="pulse 1s infinite" />
                      <Box w={2} h={2} borderRadius="full" bg="brand.500" animation="pulse 1s infinite 0.2s" />
                      <Box w={2} h={2} borderRadius="full" bg="brand.500" animation="pulse 1s infinite 0.4s" />
                    </HStack>
                  </Box>
                </HStack>
              </Flex>
            )}
            <div ref={messagesEndRef} />
          </VStack>

          <Divider />

          {/* Input Area */}
          <Box p={3} bg="white">
            <HStack spacing={2}>
              <Input
                placeholder="Ask about fitness, nutrition..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                isDisabled={isLoading}
                borderRadius="full"
                size="md"
                _focus={{
                  borderColor: 'brand.500',
                  boxShadow: '0 0 0 1px #2F855A',
                }}
              />
              <IconButton
                icon={<FiSend />}
                aria-label="Send message"
                colorScheme="brand"
                borderRadius="full"
                onClick={handleSendMessage}
                isLoading={isLoading}
                isDisabled={!inputMessage.trim()}
              />
            </HStack>
          </Box>
        </Box>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default Chatbot;
