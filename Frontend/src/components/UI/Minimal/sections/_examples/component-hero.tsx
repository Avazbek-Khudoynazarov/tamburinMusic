import type { BoxProps } from '@mui/material/Box';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';

import * as CONFIG from '@/config';
import { varAlpha, bgGradient } from '@/components/UI/Minimal/theme/styles';

// ----------------------------------------------------------------------

export function ComponentHero({ children, sx, ...other }: BoxProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: 5,
        minHeight: 240,
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        ...sx,
      }}
      {...other}
    >
      <Container>{children}</Container>

      <Box
        sx={{
          ...bgGradient({
            color: `0deg, ${varAlpha(theme.vars.palette.background.defaultChannel, 0.9)}, ${varAlpha(theme.vars.palette.background.defaultChannel, 0.9)}`,
            imgUrl: `/assets/background/background-3-blur.webp`,
          }),
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          zIndex: -1,
          position: 'absolute',
          transform: 'scaleX(-1)',
        }}
      />
    </Box>
  );
}
