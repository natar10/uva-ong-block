import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Badge from '@mui/material/Badge';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AppTheme from '../../shared-theme/AppTheme';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { ProyectoCard } from '../../components/proyectos/ProyectoCard';
import {
  useProyectos,
  EstadoProyecto,
  type Proyecto,
} from '../../hooks/useProyectos';
import { useDonante } from '@/hooks/useDonante';
import { ProyectoHero } from '@/components/proyectos/HeroProyectos';
import { StatsProyectos } from '@/components/proyectos/StatsProyectos';
import { InfoProyectos } from '@/components/proyectos/InfoProyectos';
import { ErrorWallet } from '@/components/proyectos/ErrorWallet';
import { VerificandoWallet } from '@/components/proyectos/VerificandoWallet';
import { IncentivoVotacion } from '@/components/proyectos/IncentivoVotacion';
import { useTokensGobernanza } from '@/hooks/useTokensGobernanza';
import {
  VotacionDialog,
  type TipoVotacion,
} from '@/components/proyectos/VotacionDialog';
import {
  useVotarAprobacion,
  useVotarCancelacion,
} from '@/hooks/useVotarProyecto';

export const Route = createFileRoute('/proyectos/')({
  component: ProyectosPage,
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`proyectos-tabpanel-${index}`}
      aria-labelledby={`proyectos-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function ProyectosPage() {
  const [tabValue, setTabValue] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [checkingWallet, setCheckingWallet] = useState(true);

  // Estado para el dialog de votacion
  const [dialogOpen, setDialogOpen] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<Proyecto | null>(null);
  const [tipoVotacion, setTipoVotacion] = useState<TipoVotacion>('aprobacion');

  const { proyectos, stats, loading, error } = useProyectos();
  const { donante, isRegistered, loading: loadingDonante } = useDonante(
    walletConnected ? walletAddress : null
  );
  const { tokens } = useTokensGobernanza(
    walletConnected ? walletAddress : null
  );

  // Hooks de votacion
  const votarAprobacion = useVotarAprobacion();
  const votarCancelacion = useVotarCancelacion();

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

  // Efecto para verificar si la billetera está conectada y el donante cargado
  useEffect(() => {
    if (walletConnected && !loadingDonante) {
      setCheckingWallet(false);
    }
  }, [walletConnected, loadingDonante, isRegistered, donante]);

  // Filtrar proyectos por estado
  const proyectosPropuestos = proyectos.filter(
    (p) => p.estado === EstadoProyecto.Propuesto
  );
  const proyectosActivos = proyectos.filter(
    (p) => p.estado === EstadoProyecto.Activo
  );
  const proyectosCancelados = proyectos.filter(
    (p) => p.estado === EstadoProyecto.Cancelado
  );

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleVotarAprobacion = (proyecto: Proyecto) => {
    setProyectoSeleccionado(proyecto);
    setTipoVotacion('aprobacion');
    votarAprobacion.reset();
    setDialogOpen(true);
  };

  const handleVotarCancelacion = (proyecto: Proyecto) => {
    setProyectoSeleccionado(proyecto);
    setTipoVotacion('cancelacion');
    votarCancelacion.reset();
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setProyectoSeleccionado(null);
  };

  const handleConfirmarVotacion = (proyectoId: string, cantidadVotos: number) => {
    if (tipoVotacion === 'aprobacion') {
      votarAprobacion.votar({ proyectoId, cantidadVotos });
    } else {
      votarCancelacion.votar({ proyectoId, cantidadVotos });
    }
  };

  // Obtener el estado actual de la votacion segun el tipo
  const votacionActual = tipoVotacion === 'aprobacion' ? votarAprobacion : votarCancelacion;

  const renderProyectosList = (
    proyectosList: Proyecto[],
    emptyMessage: string
  ) => {
    if (proyectosList.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            {emptyMessage}
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {proyectosList.map((proyecto) => (
          <Grid size={{ xs: 12 }} key={proyecto.id}>
            <ProyectoCard
              proyecto={proyecto}
              onVotarAprobacion={handleVotarAprobacion}
              onVotarCancelacion={handleVotarCancelacion}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  if (checkingWallet) {
    return (
      <VerificandoWallet />
    );
  }

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Header />
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)',
          py: 8,
        }}
      >
        
        {/* Hero */}
        <ProyectoHero />

        {/* Estadisticas Generales */}
        <StatsProyectos stats={stats} />

        {/* Lista de Proyectos con Tabs */}
        <Container maxWidth="lg">
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                Cargando proyectos desde blockchain...
              </Typography>
              <LinearProgress sx={{ mt: 2, maxWidth: 400, mx: 'auto' }} />
            </Box>
          ) : error ? (
            <ErrorWallet error={error} />
          ) : (
            <Card>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="proyectos por estado"
                  variant="fullWidth"
                >
                  <Tab
                    icon={
                      <Badge
                        badgeContent={proyectosPropuestos.length}
                        color="warning"
                      >
                        <HourglassEmptyIcon />
                      </Badge>
                    }
                    label="Propuestos"
                    id="proyectos-tab-0"
                    aria-controls="proyectos-tabpanel-0"
                  />
                  <Tab
                    icon={
                      <Badge
                        badgeContent={proyectosActivos.length}
                        color="success"
                      >
                        <CheckCircleIcon />
                      </Badge>
                    }
                    label="Activos"
                    id="proyectos-tab-1"
                    aria-controls="proyectos-tabpanel-1"
                  />
                  <Tab
                    icon={
                      <Badge
                        badgeContent={proyectosCancelados.length}
                        color="error"
                      >
                        <CancelIcon />
                      </Badge>
                    }
                    label="Cancelados"
                    id="proyectos-tab-2"
                    aria-controls="proyectos-tabpanel-2"
                  />
                </Tabs>
              </Box>

              <CardContent>
                <TabPanel value={tabValue} index={0}>
                  {renderProyectosList(
                    proyectosPropuestos,
                    'No hay proyectos propuestos esperando aprobacion'
                  )}
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  {renderProyectosList(
                    proyectosActivos,
                    'No hay proyectos activos actualmente'
                  )}
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  {renderProyectosList(
                    proyectosCancelados,
                    'No hay proyectos cancelados'
                  )}
                </TabPanel>
              </CardContent>
            </Card>
          )}
        </Container>

        {/* Incentivo para votar */}
        <IncentivoVotacion tokens={tokens} isRegistered={isRegistered} />

        {/* Informacion adicional */}
        <InfoProyectos />
      
      </Box>

      {/* Dialog de Votacion */}
      <VotacionDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        proyecto={proyectoSeleccionado}
        tipoVotacion={tipoVotacion}
        tokensDisponibles={parseFloat(tokens)}
        onConfirmar={handleConfirmarVotacion}
        isLoading={votacionActual.isLoading}
        isSuccess={votacionActual.isSuccess}
        isError={votacionActual.isError}
        error={votacionActual.error}
        resultMessage={votacionActual.data?.message}
      />

      <Footer />
    </AppTheme>
  );
}
