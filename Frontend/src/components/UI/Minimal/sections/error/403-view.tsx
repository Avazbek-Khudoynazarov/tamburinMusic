import { m } from 'framer-motion';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from '@/components/UI/Minimal/routes/components';

import { SimpleLayout } from '@/components/UI/Minimal/layouts/simple';
import { ForbiddenIllustration } from '@/components/UI/Minimal/assets/illustrations';

import { varBounce, MotionContainer } from '@/components/UI/Minimal/components/animate';

// ----------------------------------------------------------------------

export function View403() {
  return (
    <SimpleLayout content={{ compact: true }}>
      <Container component={MotionContainer}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            No permission
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            The page you’re trying to access has restricted access. Please refer to your system
            administrator.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration sx={{ my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button component={RouterLink} href="/" size="large" variant="contained">
          Go to home
        </Button>
      </Container>
    </SimpleLayout>
  );
}
