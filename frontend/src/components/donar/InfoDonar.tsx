import Typography from '@mui/material/Typography';
import { Card, CardContent, Container, Grid } from '@mui/material';

export function InfoDonar() {

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Card
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            ¿Por qué donar con blockchain?
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                🔒 Seguridad Total
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tus transacciones están protegidas por la tecnología blockchain,
                garantizando máxima seguridad.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                👁️ Transparencia Absoluta
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Todas las donaciones son públicas y verificables. Puedes rastrear
                exactamente cómo se usa tu dinero.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                🗳️ Poder de Decisión
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recibe tokens de gobernanza y participa en las decisiones sobre
                qué proyectos apoyar.
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
