import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
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
import CircularProgress from '@mui/material/CircularProgress';
import { alpha } from '@mui/material/styles';
import AppTheme from '../../shared-theme/AppTheme';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useRegistrarDonante, TipoDonante } from '../../hooks/useRegistrarDonante';
import { useProyectos, EstadoProyecto } from '../../hooks/useProyectos';
import { useDonante } from '../../hooks/useDonante';
import { useRealizarDonacion } from '../../hooks/useRealizarDonacion';
import Divider from '@mui/material/Divider';
import { InfoDonar } from '@/components/donar/InfoDonar';
import { DonarHero } from '@/components/donar/DonarHero';
import { ConnectWallet } from '@/components/donar/VerifyingDonor';

export const Route = createFileRoute('/donar/')({
  component: DonarPage,
});

function DonarPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [nombre, setNombre] = useState('');
  const [tipoDonante, setTipoDonante] = useState<TipoDonante>(TipoDonante.Individual);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState('');
  const [montoDonacion, setMontoDonacion] = useState('');
  const [checkingWallet, setCheckingWallet] = useState(true);

  const { registrar, isLoading, isSuccess, isError, error, data, reset } = useRegistrarDonante();
  const { proyectos, loading: loadingProyectos, error: errorProyectos } = useProyectos();
  const { donante, isRegistered, loading: loadingDonante } = useDonante(
    walletConnected ? walletAddress : null
  );
  const {
    donar,
    isLoading: isDonating,
    isSuccess: donacionSuccess,
    isError: donacionError,
    error: donacionErrorMsg,
    data: donacionData,
    reset: resetDonacion,
  } = useRealizarDonacion();

  const steps = ['Conectar Wallet', 'Registrarse', 'Seleccionar Proyecto', 'Donar'];

  // Efecto para verificar si ya hay una wallet conectada al cargar
  useEffect(() => {
    const checkWallet = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Verificar si ya hay cuentas conectadas
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          }) as string[];

          if (accounts.length > 0) {
            console.log('Wallet ya conectada:', accounts[0]);
            setWalletAddress(accounts[0]);
            setWalletConnected(true);
            // No avanzamos el paso aún, esperamos verificar si está registrado
          } else {
            setCheckingWallet(false);
          }
        } catch (error) {
          console.error('Error verificando wallet:', error);
          setCheckingWallet(false);
        }
      } else {
        setCheckingWallet(false);
      }
    };

    checkWallet();
  }, []);

  // Efecto para verificar si el donante está registrado
  useEffect(() => {
    if (walletConnected && !loadingDonante) {
      setCheckingWallet(false);

      if (isRegistered && donante) {
        console.log('Donante ya registrado:', donante);
        // Llenar los datos del donante
        setNombre(donante.nombre);
        setTipoDonante(donante.tipoDonante);
        // Avanzar directamente al paso de selección de proyecto
        setActiveStep(2);
      } else {
        // Si no está registrado, ir al paso de registro
        setActiveStep(1);
      }
    }
  }, [walletConnected, loadingDonante, isRegistered, donante]);

  // Efecto para avanzar al siguiente paso cuando el registro sea exitoso
  useEffect(() => {
    if (isSuccess) {
      setActiveStep(2);
      // Resetear la mutación después de un tiempo
      setTimeout(() => {
        reset();
      }, 3000);
    }
  }, [isSuccess, reset]);

  // Efecto para manejar donación exitosa
  useEffect(() => {
    if (donacionSuccess) {
      // Resetear el formulario de donación
      setMontoDonacion('');
      // Redirigir a la página de proyectos
      setTimeout(() => {
        resetDonacion();
        navigate({ to: '/proyectos' });
      }, 800);
    }
  }, [donacionSuccess, resetDonacion, navigate]);

  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Solicitar acceso a la cuenta
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        }) as string[];
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
        // No avanzamos el paso aquí, el useEffect lo manejará
      } catch (error) {
        console.error('Error conectando wallet:', error);
        setCheckingWallet(false);
      }
    } else {
      // Simulación para desarrollo sin MetaMask
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      setWalletAddress(mockAddress);
      setWalletConnected(true);
    }
  };

  const handleRegistrar = () => {
    if (nombre.trim()) {
      registrar({
        nombre: nombre.trim(),
        tipo: tipoDonante,
      });
    }
  };

  const handleSeleccionarProyecto = (proyectoId: string) => {
    setProyectoSeleccionado(proyectoId);
    setActiveStep(3);
  };

  const handleDonar = () => {
    if (montoDonacion && parseFloat(montoDonacion) > 0) {
      donar({
        proyectoId: proyectoSeleccionado,
        monto: montoDonacion,
      });
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
            <DonarHero />

            <Card variant="highlighted">
              <Box sx={{ p: 2 }}>
                <Stack
                  direction="row"
                  gap={4}
                  sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <Typography gutterBottom variant="h5" component="div">
                    Tu wallet actual es: <u>{nombre}</u>
                  </Typography>
                  <Chip label={`${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}`} color="primary" />
                </Stack>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Tu tipo de donante: <Chip label={tipoDonante === TipoDonante.Individual ? 'Individual' : 'Empresa'} color="default" />
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Votos disponibles: <Chip label="TODO" color="default" />
                </Typography>
              </Box>
            </Card>

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
            <ConnectWallet 
              handleConnectWallet={handleConnectWallet} 
              walletAddress={walletAddress} 
              checkingWallet={checkingWallet} 
              walletConnected={walletConnected} 
              loadingDonante={loadingDonante} 
            />
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

                  {isRegistered && donante && (
                    <Alert severity="info" icon={<CheckCircleIcon />}>
                      Ya estás registrado como <strong>{donante.nombre}</strong>
                      <Button
                        size="small"
                        onClick={() => setActiveStep(2)}
                        sx={{ mt: 1, display: 'block' }}
                      >
                        Ir a seleccionar proyecto
                      </Button>
                    </Alert>
                  )}

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
                      value={tipoDonante.toString()}
                      onChange={(e) => setTipoDonante(parseInt(e.target.value) as TipoDonante)}
                    >
                      <FormControlLabel
                        value={TipoDonante.Individual.toString()}
                        control={<Radio />}
                        label="Donante Individual"
                      />
                      <FormControlLabel
                        value={TipoDonante.Empresa.toString()}
                        control={<Radio />}
                        label="Empresa / Organización"
                      />
                    </RadioGroup>
                  </FormControl>

                  {isSuccess && data && (
                    <Alert severity="success" icon={<CheckCircleIcon />}>
                      ¡Registro exitoso! {data.message}
                      {data.transactionHash && (
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          TX: {data.transactionHash.substring(0, 10)}...
                          {data.transactionHash.substring(data.transactionHash.length - 8)}
                        </Typography>
                      )}
                    </Alert>
                  )}

                  {isError && error && (
                    <Alert severity="error">
                      Error al registrar: {error.message}
                    </Alert>
                  )}

                  {!isSuccess && (
                    <Alert severity="info">
                      Al registrarte, recibirás tokens de gobernanza que te permitirán
                      participar en decisiones sobre los proyectos.
                    </Alert>
                  )}

                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleRegistrar}
                    disabled={!nombre.trim() || isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <PersonAddIcon />}
                  >
                    {isLoading ? 'Registrando...' : 'Registrarme'}
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

              {loadingProyectos ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <CircularProgress />
                  <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                    Cargando proyectos desde blockchain...
                  </Typography>
                </Box>
              ) : errorProyectos ? (
                <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
                  Error al cargar proyectos: {errorProyectos}
                </Alert>
              ) : proyectos.length === 0 ? (
                <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
                  No hay proyectos activos disponibles en este momento.
                </Alert>
              ) : (
                <Grid container spacing={3}>
                  {proyectos
                    .filter((p) => p.estado === EstadoProyecto.Activo)
                    .map((proyecto) => (
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
                              label="Activo"
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
                                <strong>Responsable:</strong>{' '}
                                {proyecto.responsable.substring(0, 6)}...
                                {proyecto.responsable.substring(38)}
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
              )}
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

                  {!donacionSuccess && !donacionError && (
                    <Alert severity="info">
                      Tu donación será registrada en blockchain de forma inmutable y
                      recibirás tokens de gobernanza proporcionales a tu aporte.
                    </Alert>
                  )}

                  {donacionSuccess && donacionData && (
                    <Alert severity="success" icon={<CheckCircleIcon />}>
                      ¡Donación exitosa! {donacionData.message}
                      {donacionData.transactionHash && (
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          TX: {donacionData.transactionHash.substring(0, 10)}...
                          {donacionData.transactionHash.substring(donacionData.transactionHash.length - 8)}
                        </Typography>
                      )}
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Serás redirigido a la selección de proyectos en unos segundos...
                      </Typography>
                    </Alert>
                  )}

                  {donacionError && donacionErrorMsg && (
                    <Alert severity="error">
                      Error al realizar la donación: {donacionErrorMsg.message}
                    </Alert>
                  )}

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
                      disabled={isDonating}
                      sx={{ flex: 1 }}
                    >
                      Volver
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleDonar}
                      disabled={!montoDonacion || parseFloat(montoDonacion) < 0.001 || isDonating}
                      startIcon={isDonating ? <CircularProgress size={20} /> : <VolunteerActivismIcon />}
                      sx={{ flex: 1 }}
                    >
                      {isDonating ? 'Procesando donación...' : 'Confirmar Donación'}
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Container>

        {/* Información adicional */}
        <InfoDonar />
      </Box>
      <Footer />
    </AppTheme>
  );
}
