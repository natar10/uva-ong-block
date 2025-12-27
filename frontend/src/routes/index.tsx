import { createFileRoute, Link } from '@tanstack/react-router';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import AppTheme from '../shared-theme/AppTheme';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PublicIcon from '@mui/icons-material/Public';
import TimelineIcon from '@mui/icons-material/Timeline';
import GroupsIcon from '@mui/icons-material/Groups';
import heroImage from '../assets/ninos-manos.jpg';
import parallaxImage from '../assets/adultos-ong.jpg';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Box
        sx={{
          minHeight: '100vh',
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)'
              : 'linear-gradient(180deg, #0a1929 0%, #001e3c 100%)',
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            pt: { xs: 8, md: 12 },
            pb: { xs: 8, md: 12 },
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? 'rgba(255, 255, 255, 0.45)'
                  : 'rgba(0, 0, 0, 0.7)',
              zIndex: 1,
            },
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
            <Stack spacing={4} alignItems="center" textAlign="center">
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
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
                BlockChain4Good
              </Typography>
              <Typography
                variant="h5"
                color="black"
                sx={{
                  maxWidth: 800,
                  fontSize: { xs: '1.1rem', md: '1.5rem' },
                  textShadow: '1px 2px 3px rgba(255, 255, 255, 0.8), 0 0 7px rgba(255, 255, 255, 0.6), 0 0 6px rgba(255, 255, 255, 0.4)',
                  fontWeight: 500,
                }}
              >
                Transformando vidas con transparencia total. La primera ONG
                descentralizada donde cada donación es trazable, verificable e
                inmutable en blockchain.
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mt: 4 }}
              >
                <Button
                  component={Link}
                  to="/dashboard"
                  variant="contained"
                  size="large"
                  startIcon={<VolunteerActivismIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: 3,
                  }}
                >
                  Donar Ahora
                </Button>
                <Button
                  component={Link}
                  to="/dashboard"
                  variant="outlined"
                  size="large"
                  sx={{ px: 4, py: 1.5, fontSize: '1.1rem', fontWeight: 600 }}
                >
                  Ver Proyectos
                </Button>
              </Stack>
            </Stack>
          </Container>
        </Box>

        {/* Benefits Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Typography
            variant="h3"
            textAlign="center"
            sx={{ mb: 2, fontWeight: 700 }}
          >
            ¿Por qué BlockChain4Good?
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}
          >
            La tecnología blockchain garantiza que tu ayuda llegue donde más se
            necesita
          </Typography>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                      mb: 2,
                    }}
                  >
                    <VerifiedUserIcon
                      sx={{ fontSize: 32, color: 'primary.main' }}
                    />
                  </Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    100% Transparente
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Cada donación queda registrada en la blockchain de forma
                    inmutable. Puedes verificar en tiempo real dónde y cómo se
                    utilizan los fondos.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                      mb: 2,
                    }}
                  >
                    <AccountBalanceIcon
                      sx={{ fontSize: 32, color: 'success.main' }}
                    />
                  </Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    Sin Intermediarios
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    La descentralización elimina costos administrativos
                    innecesarios. Más del 95% de tu donación llega directamente
                    a los proyectos.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                      mb: 2,
                    }}
                  >
                    <PublicIcon sx={{ fontSize: 32, color: 'info.main' }} />
                  </Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    Gobernanza Participativa
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Como donante, recibes tokens de gobernanza que te permiten
                    votar y decidir qué proyectos deben ser prioritarios.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Impact Section */}
        <Box py={8} px={6} bgcolor="black">
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              textAlign="center"
              sx={{ mb: 6, fontWeight: 700 }}
            >
              Nuestro Impacto
            </Typography>

            <Grid container spacing={4}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Stack alignItems="center" spacing={1}>
                  <TimelineIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    1,234
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Donaciones Realizadas
                  </Typography>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Stack alignItems="center" spacing={1}>
                  <GroupsIcon sx={{ fontSize: 48, color: 'success.main' }} />
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    567
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Donantes Activos
                  </Typography>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Stack alignItems="center" spacing={1}>
                  <VolunteerActivismIcon
                    sx={{ fontSize: 48, color: 'info.main' }}
                  />
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    42
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Proyectos Activos
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Parallax Section */}
        <Box
          sx={{
            height: '250px',
            backgroundImage: `url(${parallaxImage})`,
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
            },
          }}
        />

        {/* How it Works Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Typography
            variant="h3"
            textAlign="center"
            sx={{ mb: 2, fontWeight: 700, color: 'primary.main' }}
          >
            ¿Cómo Funciona?
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}
          >
            Tres simples pasos para cambiar el mundo
          </Typography>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ height: '100%', background: 'black !important' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1.5rem',
                      mb: 3,
                    }}
                  >
                    1
                  </Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    Regístrate
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Conecta tu wallet de Ethereum o crea una nueva. El proceso
                    es rápido y seguro.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ height: '100%', background: 'black !important' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1.5rem',
                      mb: 3,
                    }}
                  >
                    2
                  </Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    Elige un Proyecto
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Explora nuestros proyectos activos y elige aquel que más te
                    inspire. Todos están verificados.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Card variant="outlined" sx={{ height: '100%', background: 'black !important' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '1.5rem',
                      mb: 3,
                    }}
                  >
                    3
                  </Box>
                  <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                    Dona y Gobierna
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Realiza tu donación y recibe tokens de gobernanza para
                    participar en decisiones futuras.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* CTA Section */}
        <Box
          sx={{
            background: (theme) =>
              theme.palette.mode === 'light'
                ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
                : `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
            py: { xs: 8, md: 12 },
          }}
        >
          <Container maxWidth="md">
            <Stack spacing={4} alignItems="center" textAlign="center">
              <Typography
                variant="h2"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '3rem' },
                }}
              >
                Sé Parte del Cambio
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: 'rgba(255, 255, 255, 0.9)', maxWidth: 600 }}
              >
                Cada donación cuenta. Únete a nuestra comunidad y ayuda a
                construir un futuro más transparente y solidario.
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ mt: 2 }}
              >
                <Button
                  component={Link}
                  to="/dashboard"
                  variant="contained"
                  size="large"
                  startIcon={<VolunteerActivismIcon />}
                  sx={{
                    px: 5,
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                    },
                  }}
                >
                  Registrarme y Donar
                </Button>
                <Button
                  component={Link}
                  to="/dashboard"
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 5,
                    py: 2,
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  Conocer Más
                </Button>
              </Stack>
              
            </Stack>
          </Container>
        </Box>

        {/* Founders Section */}
        <Box
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === 'light'
                ? alpha(theme.palette.primary.main, 0.03)
                : alpha(theme.palette.primary.dark, 0.1),
            py: { xs: 6, md: 10 },
          }}
        >
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              textAlign="center"
              sx={{ mb: 2, fontWeight: 700 }}
            >
              Nuestros Fundadores
            </Typography>
            <Typography
              variant="h6"
              textAlign="center"
              color="text.secondary"
              sx={{ mb: 6, maxWidth: 700, mx: 'auto' }}
            >
              El equipo visionario detrás de BlockChain4Good
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Stack alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: 'primary.main',
                      fontSize: '2.5rem',
                      fontWeight: 600,
                    }}
                  >
                    JM
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Jorne Martin
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Co-Fundador
                  </Typography>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Stack alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: 'success.main',
                      fontSize: '2.5rem',
                      fontWeight: 600,
                    }}
                  >
                    NR
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Nataly Rocha
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Co-Fundadora
                  </Typography>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Stack alignItems="center" spacing={2}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: 'info.main',
                      fontSize: '2.5rem',
                      fontWeight: 600,
                    }}
                  >
                    LU
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Loly Ureña
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Co-Fundadora
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === 'light' ? 'grey.100' : 'grey.900',
            py: 4,
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} BlockChain4Good - Transformando el
              mundo con tecnología blockchain
            </Typography>
          </Container>
        </Box>
      </Box>
    </AppTheme>
  );
}
