import React from 'react';
import { Box, Heading, Text, Button, VStack, Container } from '@chakra-ui/react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxW="container.md" py={20}>
          <VStack spacing={6} textAlign="center">
            <Heading size="xl" color="red.500">Something went wrong</Heading>
            <Text fontSize="lg" color="gray.600">
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>
            <Button colorScheme="brand" onClick={this.handleReload}>
              Reload Page
            </Button>
          </VStack>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
