import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import { alpha } from '@mui/material/styles';
import AppTheme from '../../shared-theme/AppTheme';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export const Route = createFileRoute('/donar/')({
  component: DonarPage,
});

// Mock data de proyectos (esto vendría del contrato en producción)
const mockProyectos = [
  {
    id: 'proyecto-1',
    descripcion: 'Educación para niños en comunidades rurales',
    responsable: '0x1234...5678',
    cantidadRecaudada: '5.5',
    estado: 'Activo',
  },
  {
    id: 'proyecto-2',
    descripcion: 'Alimentación para familias en situación vulnerable',
    responsable: '0xabcd...efgh',
    cantidadRecaudada: '3.2',
    estado: 'Activo',
  },
  {
    id: 'proyecto-3',
    descripcion: 'Atención médica en zonas de bajos recursos',
    responsable: '0x9876...5432',
    cantidadRecaudada: '7.8',
    estado: 'Activo',
  },
];

function DonarPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [nombre, setNombre] = useState('');
  const [tipoDonante, setTipoDonante] = useState('0'); // 0: Individual, 1: Empresa
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState('');
  const [montoDonacion, setMontoDonacion] = useState('');

  const steps = ['Conectar Wallet', 'Registrarse', 'Seleccionar Proyecto', 'Donar'];

  const handleConnectWallet = async () => {
    // Simulación de conexión de wallet
    // En producción, aquí iría la lógica de ethers.js o web3.js
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Solicitar acceso a la cuenta
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        }) as string[];
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
        setActiveStep(1);
      } catch (error) {
        console.error('Error conectando wallet:', error);
      }
    } else {
      // Simulación para desarrollo sin MetaMask
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      setWalletAddress(mockAddress);
      setWalletConnected(true);
      setActiveStep(1);
    }
  };

  const handleRegistrar = () => {
    if (nombre.trim()) {
      // Aquí iría la llamada al contrato: registrarDonante(nombre, tipoDonante)
      setActiveStep(2);
    }
  };

  const handleSeleccionarProyecto = (proyectoId: string) => {
    setProyectoSeleccionado(proyectoId);
    setActiveStep(3);
  };

  const handleDonar = () => {
    if (montoDonacion && parseFloat(montoDonacion) > 0) {
      // Aquí iría la llamada al contrato: donar(proyectoSeleccionado) con value: montoDonacion
      alert(
        `¡Donación exitosa! Has donado ${montoDonacion} ETH al proyecto ${proyectoSeleccionado}`
      );
      // Reset
      setMontoDonacion('');
      setActiveStep(2);
    }
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
              Haz tu Donación
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 700 }}>
              Contribuye a proyectos que cambian vidas. Cada donación es
              registrada de forma transparente en blockchain.
            </Typography>
          </Stack>
        </Container>

        {/* Stepper */}
        <Container maxWidth="lg" sx={{ mb: 6 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Container>

        <Container maxWidth="lg">
          {/* Paso 1: Conectar Wallet */}
          {activeStep === 0 && (
            <Card sx={{ maxWidth: 600, mx: 'auto' }}>
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3} alignItems="center">
                  <AccountBalanceWalletIcon
                    sx={{ fontSize: 80, color: 'primary.main' }}
                  />
                  <Typography variant="h4" textAlign="center">
                    Conecta tu Wallet
                  </Typography>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    Necesitas conectar tu billetera de Ethereum para poder donar.
                    Recomendamos usar MetaMask.
                  </Typography>
                  {!walletConnected ? (
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleConnectWallet}
                      startIcon={<AccountBalanceWalletIcon />}
                      sx={{ px: 4, py: 1.5 }}
                    >
                      Conectar Wallet
                    </Button>
                  ) : (
                    <Alert severity="success" icon={<CheckCircleIcon />}>
                      Wallet conectada: {walletAddress.substring(0, 6)}...
                      {walletAddress.substring(38)}
                    </Alert>
                  )}
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Paso 2: Registrarse */}
          {activeStep === 1 && (
            <Card sx={{ maxWidth: 600, mx: 'auto' }}>
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <PersonAddIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                    <Typography variant="h4">Regístrate como Donante</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Ingresa tus datos para ser parte de nuestra comunidad
                    </Typography>
                  </Box>

                  <TextField
                    label="Nombre"
                    fullWidth
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Tu nombre o nombre de tu empresa"
                  />

                  <FormControl>
                    <FormLabel>Tipo de Donante</FormLabel>
                    <RadioGroup
                      value={tipoDonante}
                      onChange={(e) => setTipoDonante(e.target.value)}
                    >
                      <FormControlLabel
                        value="0"
                        control={<Radio />}
                        label="Donante Individual"
                      />
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label="Empresa / Organización"
                      />
                    </RadioGroup>
                  </FormControl>

                  <Alert severity="info">
                    Al registrarte, recibirás tokens de gobernanza que te permitirán
                    participar en decisiones sobre los proyectos.
                  </Alert>

                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleRegistrar}
                    disabled={!nombre.trim()}
                    startIcon={<PersonAddIcon />}
                  >
                    Registrarme
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          )}

          {/* Paso 3: Seleccionar Proyecto */}
          {activeStep === 2 && (
            <Box>
              <Typography variant="h4" textAlign="center" sx={{ mb: 4, color: 'black' }}>
                Selecciona un Proyecto
              </Typography>
              <Grid container spacing={3}>
                {mockProyectos.map((proyecto) => (
                  <Grid key={proyecto.id} size={{ xs: 12, md: 4 }}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: 6,
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Chip
                          label={proyecto.estado}
                          color="success"
                          size="small"
                          sx={{ mb: 2 }}
                        />
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          {proyecto.descripcion}
                        </Typography>
                        <Stack spacing={1}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>ID:</strong> {proyecto.id}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Responsable:</strong> {proyecto.responsable}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              mt: 2,
                            }}
                          >
                            <VolunteerActivismIcon
                              sx={{ fontSize: 20, color: 'primary.main' }}
                            />
                            <Typography variant="h6" color="primary.main">
                              {proyecto.cantidadRecaudada} ETH
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            Recaudado hasta ahora
                          </Typography>
                        </Stack>
                      </CardContent>
                      <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => handleSeleccionarProyecto(proyecto.id)}
                        >
                          Donar a este proyecto
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Paso 4: Realizar Donación */}
          {activeStep === 3 && (
            <Card sx={{ maxWidth: 600, mx: 'auto' }}>
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <VolunteerActivismIcon
                      sx={{ fontSize: 60, color: 'primary.main', mb: 2 }}
                    />
                    <Typography variant="h4">Realizar Donación</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Proyecto seleccionado: <strong>{proyectoSeleccionado}</strong>
                    </Typography>
                  </Box>

                  <Alert severity="info">
                    Tu donación será registrada en blockchain de forma inmutable y
                    recibirás tokens de gobernanza proporcionales a tu aporte.
                  </Alert>

                  <TextField
                    label="Monto de Donación"
                    fullWidth
                    type="number"
                    value={montoDonacion}
                    onChange={(e) => setMontoDonacion(e.target.value)}
                    placeholder="0.0"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">ETH</InputAdornment>
                      ),
                    }}
                    inputProps={{
                      min: 0,
                      step: 0.01,
                    }}
                  />

                  <Box
                    sx={{
                      bgcolor: (theme) =>
                        theme.palette.mode === 'light'
                          ? alpha(theme.palette.primary.main, 0.1)
                          : alpha(theme.palette.primary.dark, 0.2),
                      p: 2,
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Resumen de tu donación:</strong>
                    </Typography>
                    <Typography variant="body2">
                      Monto: {montoDonacion || '0'} ETH
                    </Typography>
                    <Typography variant="body2">
                      Proyecto: {proyectoSeleccionado}
                    </Typography>
                    <Typography variant="body2">
                      Wallet: {walletAddress.substring(0, 6)}...
                      {walletAddress.substring(38)}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      onClick={() => setActiveStep(2)}
                      sx={{ flex: 1 }}
                    >
                      Volver
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleDonar}
                      disabled={!montoDonacion || parseFloat(montoDonacion) <= 0}
                      startIcon={<VolunteerActivismIcon />}
                      sx={{ flex: 1 }}
                    >
                      Confirmar Donación
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
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
      </Box>
      <Footer />
    </AppTheme>
  );
}
