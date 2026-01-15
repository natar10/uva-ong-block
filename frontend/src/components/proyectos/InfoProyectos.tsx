import Typography from '@mui/material/Typography';
import { Card, CardContent, Container, Grid } from '@mui/material';

export function InfoProyectos() {

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
            Sobre nuestros proyectos
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Transparencia Total
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cada donacion y validacion queda registrada en blockchain.
                Puedes verificar el uso de fondos en cualquier momento.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Validacion de Fondos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Los fondos validados son aquellos cuyo uso ha sido
                verificado y aprobado por la ONG tras evidencia de
                ejecucion.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                Gobernanza Comunitaria
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Los donantes reciben tokens de gobernanza y pueden votar
                sobre el estado y continuidad de los proyectos.
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
