import { extendTheme } from '@chakra-ui/react';
const theme = extendTheme({
  initialColorMode: 'dark',
  useSystemColorMode: false,
  components: {
    Heading: { color: 'white' },
  },
});
