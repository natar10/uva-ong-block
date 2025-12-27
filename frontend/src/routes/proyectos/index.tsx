import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Divider from '@mui/material/Divider';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import VerifiedIcon from '@mui/icons-material/Verified';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import { alpha } from '@mui/material/styles';
import AppTheme from '../../shared-theme/AppTheme';

export const Route = createFileRoute('/proyectos/')({
  component: ProyectosPage,
});

// Enum para estados del proyecto (debe coincidir con el contrato)
enum EstadoProyecto {
  Activo = 0,
  Completado = 1,
  Cancelado = 2,
}

interface Proyecto {
  id: string;
  descripcion: string;
  responsable: string;
  cantidadRecaudada: string;
  cantidadValidada: string;
  estado: EstadoProyecto;
  votos: string;
}

// Mock data temporal (en producción se obtendría del contrato)
const mockProyectos: Proyecto[] = [
  {
    id: 'EDU-2024-001',
    descripcion: 'Educación para niños en comunidades rurales - Construcción de biblioteca y provisión de materiales educativos',
    responsable: '0x1234567890123456789012345678901234567890',
    cantidadRecaudada: '8.5',
    cantidadValidada: '6.2',
    estado: EstadoProyecto.Activo,
    votos: '145',
  },
  {
    id: 'ALIM-2024-002',
    descripcion: 'Alimentación para familias en situación vulnerable - Comedores comunitarios y distribución de alimentos',
    responsable: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    cantidadRecaudada: '12.3',
    cantidadValidada: '12.3',
    estado: EstadoProyecto.Completado,
    votos: '203',
  },
  {
    id: 'SALUD-2024-003',
    descripcion: 'Atención médica en zonas de bajos recursos - Clínica móvil y medicamentos esenciales',
    responsable: '0x9876543210987654321098765432109876543210',
    cantidadRecaudada: '15.7',
    cantidadValidada: '10.5',
    estado: EstadoProyecto.Activo,
    votos: '287',
  },
  {
    id: 'VIV-2024-004',
    descripcion: 'Viviendas dignas para familias desplazadas - Reconstrucción de hogares',
    responsable: '0x5555555555555555555555555555555555555555',
    cantidadRecaudada: '3.2',
    cantidadValidada: '1.8',
    estado: EstadoProyecto.Activo,
    votos: '78',
  },
  {
    id: 'AGUA-2024-005',
    descripcion: 'Acceso a agua potable en comunidades aisladas',
    responsable: '0x7777777777777777777777777777777777777777',
    cantidadRecaudada: '5.0',
    cantidadValidada: '0',
    estado: EstadoProyecto.Cancelado,
    votos: '42',
  },
  {
    id: 'TECH-2024-006',
    descripcion: 'Alfabetización digital para adultos mayores - Talleres y equipamiento tecnológico',
    responsable: '0x3333333333333333333333333333333333333333',
    cantidadRecaudada: '6.8',
    cantidadValidada: '4.2',
    estado: EstadoProyecto.Activo,
    votos: '156',
  },
];

function ProyectosPage() {
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [totalProyectos, setTotalProyectos] = useState(0);
  const [totalRecaudado, setTotalRecaudado] = useState('0');
  const [totalValidado, setTotalValidado] = useState('0');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos del contrato
    // En producción, aquí se llamarían las funciones del contrato:
    // - obtenerTotalProyectos()
    // - Para cada proyecto: obtenerProyecto(id)

    const cargarProyectos = async () => {
      setLoading(true);

      // Simulación de delay de red
      await new Promise(resolve => setTimeout(resolve, 800));

      setProyectos(mockProyectos);
      setTotalProyectos(mockProyectos.length);

      // Calcular totales
      const recaudado = mockProyectos.reduce(
        (sum, p) => sum + parseFloat(p.cantidadRecaudada),
        0
      );
      const validado = mockProyectos.reduce(
        (sum, p) => sum + parseFloat(p.cantidadValidada),
        0
      );

      setTotalRecaudado(recaudado.toFixed(2));
      setTotalValidado(validado.toFixed(2));
      setLoading(false);
    };

    cargarProyectos();
  }, []);

  const getEstadoChip = (estado: EstadoProyecto) => {
    switch (estado) {
      case EstadoProyecto.Activo:
        return (
          <Chip
            label="Activo"
            color="success"
            size="small"
            icon={<HourglassEmptyIcon />}
          />
        );
      case EstadoProyecto.Completado:
        return (
          <Chip
            label="Completado"
            color="primary"
            size="small"
            icon={<CheckCircleIcon />}
          />
        );
      case EstadoProyecto.Cancelado:
        return (
          <Chip
            label="Cancelado"
            color="error"
            size="small"
            icon={<CancelIcon />}
          />
        );
    }
  };

  const calcularPorcentajeValidado = (recaudado: string, validado: string) => {
    const rec = parseFloat(recaudado);
    const val = parseFloat(validado);
    if (rec === 0) return 0;
    return (val / rec) * 100;
  };

  const formatearDireccion = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  };

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
          py: 8,
        }}
      >
        {/* Hero Section */}
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
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 700 }}>
              Transparencia total en cada proyecto. Todas las donaciones y validaciones
              registradas en blockchain.
            </Typography>
          </Stack>
        </Container>

        {/* Estadísticas Generales */}
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
                      {totalProyectos}
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
                      {totalRecaudado} ETH
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
                      {totalValidado} ETH
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Lista de Proyectos */}
        <Container maxWidth="lg">
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 600, color: 'black' }}>
            Todos los Proyectos
          </Typography>

          {loading ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                Cargando proyectos desde blockchain...
              </Typography>
              <LinearProgress sx={{ mt: 2, maxWidth: 400, mx: 'auto' }} />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {proyectos.map((proyecto) => {
                const porcentajeValidado = calcularPorcentajeValidado(
                  proyecto.cantidadRecaudada,
                  proyecto.cantidadValidada
                );

                return (
                  <Grid size={{ xs: 12 }} key={proyecto.id}>
                    <Card
                      sx={{
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 6,
                        },
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Grid container spacing={3}>
                          {/* Información Principal */}
                          <Grid size={{ xs: 12, md: 8 }}>
                            <Stack spacing={2}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  flexWrap: 'wrap',
                                  gap: 1,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  sx={{ fontWeight: 600, color: 'primary.main' }}
                                >
                                  {proyecto.id}
                                </Typography>
                                {getEstadoChip(proyecto.estado)}
                              </Box>

                              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                                {proyecto.descripcion}
                              </Typography>

                              <Stack direction="row" spacing={1} alignItems="center">
                                <AccountBalanceWalletIcon
                                  sx={{ fontSize: 18, color: 'text.secondary' }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Responsable:</strong>{' '}
                                  {formatearDireccion(proyecto.responsable)}
                                </Typography>
                              </Stack>

                              <Stack direction="row" spacing={1} alignItems="center">
                                <HowToVoteIcon
                                  sx={{ fontSize: 18, color: 'text.secondary' }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Votos recibidos:</strong> {proyecto.votos}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Grid>

                          {/* Estadísticas del Proyecto */}
                          <Grid size={{ xs: 12, md: 4 }}>
                            <Box
                              sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                bgcolor: (theme) =>
                                  theme.palette.mode === 'light'
                                    ? alpha(theme.palette.primary.main, 0.05)
                                    : alpha(theme.palette.primary.dark, 0.1),
                                borderRadius: 2,
                                p: 2,
                              }}
                            >
                              <Stack spacing={2}>
                                <Box>
                                  <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                  >
                                    <Typography variant="body2" color="text.secondary">
                                      Recaudado
                                    </Typography>
                                    <Typography
                                      variant="h6"
                                      sx={{ fontWeight: 700, color: 'primary.main' }}
                                    >
                                      {proyecto.cantidadRecaudada} ETH
                                    </Typography>
                                  </Stack>
                                </Box>

                                <Divider />

                                <Box>
                                  <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                  >
                                    <Typography variant="body2" color="text.secondary">
                                      Validado
                                    </Typography>
                                    <Typography
                                      variant="h6"
                                      sx={{ fontWeight: 700, color: 'success.main' }}
                                    >
                                      {proyecto.cantidadValidada} ETH
                                    </Typography>
                                  </Stack>

                                  <Box sx={{ mt: 1 }}>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        mb: 0.5,
                                      }}
                                    >
                                      <Typography variant="caption" color="text.secondary">
                                        Progreso de validación
                                      </Typography>
                                      <Typography variant="caption" fontWeight={600}>
                                        {porcentajeValidado.toFixed(0)}%
                                      </Typography>
                                    </Box>
                                    <LinearProgress
                                      variant="determinate"
                                      value={porcentajeValidado}
                                      sx={{
                                        height: 8,
                                        borderRadius: 1,
                                        bgcolor: (theme) =>
                                          alpha(theme.palette.success.main, 0.1),
                                        '& .MuiLinearProgress-bar': {
                                          bgcolor: 'success.main',
                                          borderRadius: 1,
                                        },
                                      }}
                                    />
                                  </Box>
                                </Box>
                              </Stack>
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>

        {/* Información adicional */}
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
                    📊 Transparencia Total
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cada donación y validación queda registrada en blockchain. Puedes
                    verificar el uso de fondos en cualquier momento.
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    ✅ Validación de Fondos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Los fondos validados son aquellos cuyo uso ha sido verificado y
                    aprobado por la ONG tras evidencia de ejecución.
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    🗳️ Gobernanza Comunitaria
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Los donantes reciben tokens de gobernanza y pueden votar sobre el
                    estado y continuidad de los proyectos.
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </AppTheme>
  );
}
