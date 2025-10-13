import { m } from 'framer-motion';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from '@/components/UI/Minimal/routes/components';

import { SimpleLayout } from '@/components/UI/Minimal/layouts/simple';
import { PageNotFoundIllustration } from '@/components/UI/Minimal/assets/illustrations';

import { varBounce, MotionContainer } from '@/components/UI/Minimal/components/animate';

// ----------------------------------------------------------------------

export function NotFoundView() {
  return (
    <SimpleLayout content={{ compact: true }}>
      <Container component={MotionContainer}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
					죄송합니다, 페이지를 찾을 수 없습니다!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
					죄송하지만 찾으시는 페이지를 찾을 수 없습니다. URL을 잘못 입력하셨을 수 있습니다. URL이 정확한지 확인해 주세요.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <PageNotFoundIllustration sx={{ my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button component={RouterLink} href="/" size="large" variant="contained">
          돌아가기
        </Button>
      </Container>
    </SimpleLayout>
  );
}
