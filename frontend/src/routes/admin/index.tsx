import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LockIcon from '@mui/icons-material/Lock';
import AppTheme from '../../shared-theme/AppTheme';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useIsOwner } from '../../hooks/useIsOwner';
import { useCrearProyecto } from '../../hooks/useCrearProyecto';

export const Route = createFileRoute('/admin/')({
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);

  // Form state
  const [proyectoId, setProyectoId] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [responsable, setResponsable] = useState('');

  // Verificar owner
  const { isOwner, loading: loadingOwner } = useIsOwner(walletAddress);

  // Hook para crear proyecto
  const {
    crearProyecto,
    isLoading: creandoProyecto,
    isSuccess,
    isError,
    error,
    reset,
  } = useCrearProyecto();

  // Conectar wallet al cargar
  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          }) as string[];
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setWalletConnected(true);
          }
        } catch (error) {
          console.error('Error checking wallet:', error);
        }
      }
    };

    checkWallet();

    // Escuchar cambios de cuenta
    if (window.ethereum?.on) {
      window.ethereum?.on('accountsChanged', (accounts: unknown) => {
        const accountList = accounts as string[];
        if (accountList.length > 0) {
          setWalletAddress(accountList[0]);
          setWalletConnected(true);
        } else {
          setWalletAddress(null);
          setWalletConnected(false);
        }
      });
    }
  }, []);

  const conectarWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        }) as string[];
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
      } catch (error) {
        console.error('Error conectando wallet:', error);
      }
    } else {
      alert('Por favor instala MetaMask');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!proyectoId || !descripcion || !responsable) {
      alert('Por favor completa todos los campos');
      return;
    }

    crearProyecto({
      id: proyectoId,
      descripcion,
      responsable,
    });
  };

  const limpiarFormulario = () => {
    setProyectoId('');
    setDescripcion('');
    setResponsable('');
    reset();
  };

  // Si no hay wallet conectada
  if (!walletConnected) {
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
            background: (theme) =>
              theme.palette.mode === 'light'
                ? 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)'
                : 'linear-gradient(180deg, #0a1929 0%, #001e3c 100%)',
          }}
        >
          <Card sx={{ maxWidth: 400, textAlign: 'center', p: 4 }}>
            <CardContent>
              <LockIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Conecta tu Wallet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Necesitas conectar tu wallet para acceder al panel de administracion.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={conectarWallet}
                fullWidth
              >
                Conectar MetaMask
              </Button>
            </CardContent>
          </Card>
        </Box>
        <Footer />
      </AppTheme>
    );
  }

  // Loading mientras verifica owner
  if (loadingOwner) {
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
          <Stack spacing={2} alignItems="center">
            <CircularProgress />
            <Typography>Verificando permisos...</Typography>
          </Stack>
        </Box>
        <Footer />
      </AppTheme>
    );
  }

  // Si no es owner
  if (!isOwner) {
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
            background: (theme) =>
              theme.palette.mode === 'light'
                ? 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)'
                : 'linear-gradient(180deg, #0a1929 0%, #001e3c 100%)',
          }}
        >
          <Card sx={{ maxWidth: 500, textAlign: 'center', p: 4 }}>
            <CardContent>
              <LockIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Acceso Denegado
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Solo el administrador del contrato puede acceder a esta seccion.
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  bgcolor: 'grey.100',
                  p: 1,
                  borderRadius: 1,
                  fontFamily: 'monospace',
                }}
              >
                Tu wallet: {walletAddress}
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 3 }}
                onClick={() => navigate({ to: '/' })}
              >
                Volver al Inicio
              </Button>
            </CardContent>
          </Card>
        </Box>
        <Footer />
      </AppTheme>
    );
  }

  // Panel de Admin (es owner)
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
            <AdminPanelSettingsIcon
              sx={{ fontSize: 60, color: 'primary.main' }}
            />
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
              Panel de Administracion
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Crea y gestiona los proyectos de la ONG
            </Typography>
          </Stack>
        </Container>

        {/* Formulario Crear Proyecto */}
        <Container maxWidth="md">
          <Card sx={{ p: 4 }}>
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                  <AddIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Crear Nuevo Proyecto
                </Typography>

                {isSuccess && (
                  <Alert severity="success" onClose={limpiarFormulario}>
                    Proyecto creado exitosamente. Puedes verlo en la seccion de Proyectos.
                  </Alert>
                )}

                {isError && (
                  <Alert severity="error" onClose={() => reset()}>
                    {error?.message || 'Error al crear el proyecto'}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label="ID del Proyecto"
                        placeholder="Ej: PROYECTO-001"
                        value={proyectoId}
                        onChange={(e) => setProyectoId(e.target.value)}
                        fullWidth
                        required
                        disabled={creandoProyecto}
                        helperText="Identificador unico del proyecto"
                      />
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label="Direccion del Responsable"
                        placeholder="0x..."
                        value={responsable}
                        onChange={(e) => setResponsable(e.target.value)}
                        fullWidth
                        required
                        disabled={creandoProyecto}
                        helperText="Wallet del responsable del proyecto"
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <TextField
                        label="Descripcion del Proyecto"
                        placeholder="Describe el objetivo y alcance del proyecto..."
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        fullWidth
                        required
                        multiline
                        rows={4}
                        disabled={creandoProyecto}
                        helperText="Explica de que trata el proyecto"
                      />
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                      <Stack direction="row" spacing={2} justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          onClick={limpiarFormulario}
                          disabled={creandoProyecto}
                        >
                          Limpiar
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={creandoProyecto}
                          startIcon={
                            creandoProyecto ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              <AddIcon />
                            )
                          }
                        >
                          {creandoProyecto ? 'Creando...' : 'Crear Proyecto'}
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </form>
              </Stack>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card sx={{ mt: 4, bgcolor: 'info.light' }}>
            <CardContent>
              <Typography variant="body2">
                <strong>Nota:</strong> Solo tu (el owner del contrato) puedes crear
                proyectos. La transaccion sera firmada con tu wallet actual:
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 1,
                  fontFamily: 'monospace',
                  bgcolor: 'background.paper',
                  p: 1,
                  borderRadius: 1,
                }}
              >
                {walletAddress}
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
      <Footer />
    </AppTheme>
  );
}
