import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Card, CardContent, Container, Grid } from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import VerifiedIcon from '@mui/icons-material/Verified';
import type { ProyectosStats } from '@/hooks/useProyectos';

interface StatsProyectosProps {
  stats: ProyectosStats;
}

export function StatsProyectos({stats}: StatsProyectosProps) {

  return (
    <Container maxWidth="lg" sx={{ mb: 6 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              background: (theme) =>
                theme.palette.mode === 'light'
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Total de Proyectos
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {stats.totalProyectos}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              background: (theme) =>
                theme.palette.mode === 'light'
                  ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                  : 'linear-gradient(135deg, #744210 0%, #c2410c 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <VolunteerActivismIcon />
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Total Recaudado
                  </Typography>
                </Stack>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {stats.totalRecaudado} ETH
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              background: (theme) =>
                theme.palette.mode === 'light'
                  ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                  : 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
              color: 'white',
            }}
          >
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <VerifiedIcon />
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Total Validado
                  </Typography>
                </Stack>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>
                  {stats.totalValidado} ETH
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
