import { Link } from '@tanstack/react-router';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import MuiLink from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import HomeIcon from '@mui/icons-material/Home';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import FolderIcon from '@mui/icons-material/Folder';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === 'light' ? 'grey.100' : 'grey.900',
        pt: 6,
        pb: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: (theme) =>
                  theme.palette.mode === 'light'
                    ? 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)'
                    : 'linear-gradient(90deg, #90caf9 0%, #42a5f5 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              BlockChain4Good
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              La primera ONG descentralizada donde cada donación es trazable,
              verificable e inmutable en blockchain. Transformando vidas con
              transparencia total.
            </Typography>
          </Grid>

          {/* Navigation Links */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}
            >
              Navegación
            </Typography>
            <Stack spacing={1}>
              <MuiLink
                component={Link}
                to="/"
                underline="hover"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                <HomeIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2">Home</Typography>
              </MuiLink>
              <MuiLink
                component={Link}
                to="/donar"
                underline="hover"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                <VolunteerActivismIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2">Donar</Typography>
              </MuiLink>
              <MuiLink
                component={Link}
                to="/proyectos"
                underline="hover"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'primary.main',
                  },
                }}
              >
                <FolderIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2">Proyectos</Typography>
              </MuiLink>
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}
            >
              Fundadores
            </Typography>
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                Jorne Martin - Co-Fundador
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nataly Rocha - Co-Fundadora
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Loly Ureña - Co-Fundadora
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} BlockChain4Good - Transformando el mundo
            con tecnología blockchain
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Desarrollado con transparencia y amor
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
