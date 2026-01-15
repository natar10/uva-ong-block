import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Container } from '@mui/material';

export function ProyectoHero() {

  return (
    <Container maxWidth="lg" sx={{ mb: 6 }}>
      <Stack spacing={3} alignItems="center" textAlign="center">
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            background: (theme) =>
              theme.palette.mode === 'light'
                ? 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)'
                : 'linear-gradient(90deg, #90caf9 0%, #42a5f5 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Proyectos de la ONG
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ maxWidth: 700 }}
        >
          Transparencia total en cada proyecto. Todas las donaciones y
          validaciones registradas en blockchain.
        </Typography>
      </Stack>
    </Container>
  );
}
