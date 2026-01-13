import { createFileRoute } from '@tanstack/react-router';
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
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useProyectos, EstadoProyecto, type Proyecto } from '../../hooks/useProyectos';
import { useDonante } from '../../hooks/useDonante';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Button from '@mui/material/Button';
import { useContract } from '@/hooks/useContract';


export const Route = createFileRoute('/proyectos/')({
  component: ProyectosPage,
});

export interface VotacionParams {
  proyectoId: string;
  votos:number;
}

export interface VotacionResult {
  success: boolean;
  transactionHash?: string;
  message: string;
}

export const realizarVotacion = async (
  getContract: () => Promise<any>,
  params : VotacionParams
): Promise<VotacionResult> =>{
  console.log('Votando al proyecto:', params);

  try {
    // Obtener contrato
    const contract = await getContract();

    // Llamar a la funcion de voatcion
    const tx = await contract.votarProyecto(params.proyectoId, params.votos);

    
    console.log('Transacción enviada:', tx.hash);

    // Esperar confirmación
    const receipt = await tx.wait();

    console.log('✓ Donación realizada exitosamente');
    return {
      success: true,
      transactionHash: receipt.hash,
      message: `Votacion realizada existosamente`,
    };
  }catch (error: any) {
    console.error('Error al realizar donación:', error);

    // Extraer mensaje de error más específico
    let errorMessage = 'Error al realizar la donación';

    if (error.code === 'ACTION_REJECTED') {
      errorMessage = 'Transacción rechazada por el usuario';
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
      errorMessage = 'Fondos insuficientes para realizar la donación';
    } else if (error.reason) {
      errorMessage = error.reason;
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
}

function ProyectosPage() {
  const [open, setOpen] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<Proyecto | null>(null);

  const handleOpen = (proyecto:Proyecto) => {
    setProyectoSeleccionado(proyecto);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false); 
    setProyectoSeleccionado(null);
  };

  const { getContract } = useContract(); // Contrato usado para las voatciones

  const { proyectos, stats, loading, error } = useProyectos();
  const [walletConnected, setWalletConnected] = useState(false);
  const [tokens, setTokens] = useState(1);
  const { donante, isRegistered, loading: loadingDonante } = useDonante(
      walletConnected ? walletAddress : null
    );

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
  
  const calcularTokensGobernanza = () => {
    if (!donante) return 0;
    return donante.tokensGobernanza;
  }

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
      <Header />
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
          ) : error ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Card
                sx={{
                  maxWidth: 600,
                  mx: 'auto',
                  bgcolor: 'error.light',
                  color: 'error.contrastText',
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Error al cargar proyectos
                  </Typography>
                  <Typography variant="body2">
                    {error}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
                    Asegúrate de tener MetaMask instalado y conectado a la red correcta.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ) : proyectos.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No hay proyectos registrados aún
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {proyectos.map((proyecto: Proyecto) => {
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

                                <button 
                                  variant="contained"
                                  sx={{ ml: 'auto' }}
                                  onClick={() =>handleOpen(proyecto)}
                                  style={{ marginLeft: 'auto' }}
                                >
                                  <Typography variant="body2">
                                    Votar Proyecto
                                  </Typography>
                                </button>
                                
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

      // Modal de confirmación del voto (aparece co clickar el botón "Votar Proyecto")

      
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>¿Cuántos tokens quieres utilizar en el proyecto {proyectoSeleccionado?.id} (cada token cuenta como un voto)?</DialogTitle>

        <DialogContent>
          <Typography>
            Tokens disponibles: {calcularTokensGobernanza()}
          </Typography>

          <Typography>
            Tokens a utilizar: 
            <input
              type="number"
              min={0}
              max={calcularTokensGobernanza()}
              value={tokens}
              onChange={(e) => setTokens(Number(e.target.value))}
              style={{ textAlign: "right" }}
            />
          </Typography>
          
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // TODO: lógica para votar
              realizarVotacion( getContract,{
                proyectoId: proyectoSeleccionado?.id,
                votos: tokens
              }).then((result)=>{
                console.log(result);
              })
              handleClose();
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>



      <Footer />
    </AppTheme>
  );
}
