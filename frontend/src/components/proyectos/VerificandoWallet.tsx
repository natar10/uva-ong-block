import Typography from '@mui/material/Typography';
import { Box, CircularProgress, CssBaseline, Stack } from '@mui/material';
import AppTheme from '@/shared-theme/AppTheme';
import { Footer, Header } from '../layout';

export function VerificandoWallet() {

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Header />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Verificando wallet...
          </Typography>
        </Stack>
      </Box>
      <Footer />
    </AppTheme>
  );
}
