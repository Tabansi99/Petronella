import { extendTheme, Theme, ThemeConfig, DeepPartial } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const config: ThemeConfig = {
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  styles: {
    global: (props) => ({
      body: {
        color: mode('gray.800', 'gray.800')(props),
        backgroundColor: mode('blue.100', 'blue.100')(props),
      },
    }),
  },
} as DeepPartial<Theme>);
