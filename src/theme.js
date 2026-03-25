import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#E6F2EB',
      100: '#C2DFCD',
      200: '#9CCBAE',
      300: '#76B78F',
      400: '#50A370',
      500: '#2F855A', // Primary green
      600: '#256B47',
      700: '#1B5134',
      800: '#113721',
      900: '#071D0E',
    },
    accent: {
      50: '#FFF5E6',
      100: '#FFE4BF',
      200: '#FFD299',
      300: '#FFC173',
      400: '#FFB04D',
      500: '#FF9F26', // Orange accent
      600: '#E68F1F',
      700: '#CC7F18',
      800: '#B36F11',
      900: '#995F0A',
    },
  },
  fonts: {
    heading: '"Poppins", sans-serif',
    body: '"Poppins", sans-serif',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: '600',
        borderRadius: 'lg',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
            _disabled: {
              bg: 'brand.500',
            },
          },
        },
        accent: {
          bg: 'accent.500',
          color: 'white',
          _hover: {
            bg: 'accent.600',
          },
        },
        outline: {
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: 'brand.50',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          overflow: 'hidden',
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
});

export default theme;
