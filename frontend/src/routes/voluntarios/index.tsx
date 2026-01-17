import { useState, useMemo, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Stack,
  Typography,
  Box,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AppTheme from '../../shared-theme/AppTheme';
import { VoluntarioProyectoCard } from '../../components/voluntarios/VoluntarioProyectoCard';
import {
  UtilizarFondosModal,
  type RealizarCompraParams,
} from '../../components/voluntarios/UtilizarFondosModal';
import { ValidarCompraModal } from '../../components/voluntarios/ValidarCompraModal';

import { useContract } from '../../hooks/useContract';
import { type Proyecto, EstadoProyecto, proyectosQueryOptions } from '../../data/query/proyectos';
import { comprasPorProyectoQueryOptions } from '../../data/query/compras';
import {
  realizarCompraMutationOptions,
  validarCompraMutationOptions,
} from '../../data/mutations/compras';

// --- Ruta /voluntarios
export const Route = createFileRoute('/voluntarios/')({
  component: VoluntariosPage,
});

// --- Componente Voluntarios
function VoluntariosPage() {
  const { getContract } = useContract();
  const queryClient = useQueryClient();

  // Estado para wallet conectada
  const [walletConectada, setWalletConectada] = useState<string | null>(null);

  // Estado para modales
  const [modalUtilizarFondosOpen, setModalUtilizarFondosOpen] = useState(false);
  const [modalValidarCompraOpen, setModalValidarCompraOpen] = useState(false);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<Proyecto | null>(null);
  const [validandoCompraId, setValidandoCompraId] = useState<string | null>(null);

  // Obtener wallet conectada
  useEffect(() => {
    const getWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          }) as string[];
          if (accounts && accounts.length > 0) {
            setWalletConectada(accounts[0]);
          }
        } catch (error) {
          console.error('Error al obtener wallet:', error);
        }
      }
    };
    getWallet();

    // Escuchar cambios de cuenta
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: unknown) => {
        const accountsArray = accounts as string[];
        setWalletConectada(accountsArray[0] || null);
      });
    }
  }, []);

  // Query para obtener proyectos
  const {
    data: proyectosData,
    isLoading: loadingProyectos,
    error: errorProyectos,
  } = useQuery(proyectosQueryOptions(getContract));

  // Query para obtener compras del proyecto seleccionado
  const {
    data: comprasDelProyecto = [],
    isLoading: loadingCompras,
    refetch: refetchCompras,
  } = useQuery({
    ...comprasPorProyectoQueryOptions(getContract, proyectoSeleccionado?.id || ''),
    enabled: !!proyectoSeleccionado?.id && modalValidarCompraOpen,
  });

  // Mutation para realizar compra
  const realizarCompraMutation = useMutation({
    ...realizarCompraMutationOptions(getContract),
    onSuccess: () => {
      // Refrescar proyectos y compras
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
      if (proyectoSeleccionado) {
        queryClient.invalidateQueries({ queryKey: ['compras', proyectoSeleccionado.id] });
      }
    },
  });

  // Mutation para validar compra
  const validarCompraMutation = useMutation({
    ...validarCompraMutationOptions(getContract),
    onSuccess: () => {
      // Refrescar proyectos y compras
      queryClient.invalidateQueries({ queryKey: ['proyectos'] });
      if (proyectoSeleccionado) {
        queryClient.invalidateQueries({ queryKey: ['compras', proyectoSeleccionado.id] });
        refetchCompras();
      }
      setValidandoCompraId(null);
    },
    onError: () => {
      setValidandoCompraId(null);
    },
  });

  // Filtrar proyectos donde el usuario conectado es responsable
  const misProyectos = useMemo(() => {
    if (!walletConectada || !proyectosData?.proyectos) return [];
    return proyectosData.proyectos.filter(
      (p) =>
        p.responsable.toLowerCase() === walletConectada.toLowerCase() &&
        p.estado === EstadoProyecto.Activo
    );
  }, [walletConectada, proyectosData?.proyectos]);

  // Handlers para abrir modales
  const handleUtilizarFondos = (proyecto: Proyecto) => {
    setProyectoSeleccionado(proyecto);
    realizarCompraMutation.reset();
    setModalUtilizarFondosOpen(true);
  };

  const handleValidarCompra = (proyecto: Proyecto) => {
    setProyectoSeleccionado(proyecto);
    validarCompraMutation.reset();
    setModalValidarCompraOpen(true);
  };

  // Handler para realizar compra
  const handleConfirmarCompra = (params: RealizarCompraParams) => {
    realizarCompraMutation.mutate(params);
  };

  // Handler para validar compra
  const handleValidar = (compraId: string) => {
    setValidandoCompraId(compraId);
    validarCompraMutation.mutate({ compraId });
  };

  // Cerrar modales
  const handleCloseUtilizarFondos = () => {
    setModalUtilizarFondosOpen(false);
    setProyectoSeleccionado(null);
    realizarCompraMutation.reset();
  };

  const handleCloseValidarCompra = () => {
    setModalValidarCompraOpen(false);
    setProyectoSeleccionado(null);
    validarCompraMutation.reset();
  };

  return (
    <AppTheme>
      <Header />

      <Box sx={{ minHeight: '100vh', py: 8, background: '#f5f5f5' }}>
        {/* Hero */}
        <Stack spacing={3} alignItems="center" textAlign="center" sx={{ mb: 6 }}>
          <VolunteerActivismIcon sx={{ fontSize: 60, color: 'primary.main' }} />
          <Typography variant="h2" sx={{ fontWeight: 800, color: 'black' }}>
            Panel de Voluntario
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 700 }}>
            Gestiona los proyectos de los que eres responsable
          </Typography>
        </Stack>

        <Container maxWidth="lg">
          {/* Verificar wallet conectada */}
          {!walletConectada ? (
            <Alert severity="warning" sx={{ mb: 4 }}>
              Conecta tu wallet para ver los proyectos de los que eres responsable.
            </Alert>
          ) : (
            <Alert severity="info" sx={{ mb: 4 }}>
              Mostrando proyectos donde tu wallet ({walletConectada.substring(0, 10)}
              ...) es responsable.
            </Alert>
          )}

          {/* Loading */}
          {loadingProyectos && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Error */}
          {errorProyectos && (
            <Alert severity="error" sx={{ mb: 4 }}>
              Error al cargar proyectos: {errorProyectos.message}
            </Alert>
          )}

          {/* Lista de proyectos */}
          {!loadingProyectos && walletConectada && (
            <>
              {misProyectos.length === 0 ? (
                <Alert severity="warning">
                  No tienes proyectos asignados como responsable. Contacta al
                  administrador para ser asignado a un proyecto.
                </Alert>
              ) : (
                <Stack spacing={3}>
                  <Typography variant="h5" fontWeight={600}>
                    Mis Proyectos ({misProyectos.length})
                  </Typography>

                  {misProyectos.map((proyecto) => (
                    <VoluntarioProyectoCard
                      key={proyecto.id}
                      proyecto={proyecto}
                      onUtilizarFondos={handleUtilizarFondos}
                      onValidarCompra={handleValidarCompra}
                    />
                  ))}
                </Stack>
              )}
            </>
          )}
        </Container>
      </Box>

      {/* Modal Utilizar Fondos */}
      <UtilizarFondosModal
        open={modalUtilizarFondosOpen}
        onClose={handleCloseUtilizarFondos}
        proyecto={proyectoSeleccionado}
        onConfirmar={handleConfirmarCompra}
        isLoading={realizarCompraMutation.isPending}
        isSuccess={realizarCompraMutation.isSuccess}
        isError={realizarCompraMutation.isError}
        error={realizarCompraMutation.error}
      />

      {/* Modal Validar Compra */}
      <ValidarCompraModal
        open={modalValidarCompraOpen}
        onClose={handleCloseValidarCompra}
        proyecto={proyectoSeleccionado}
        compras={comprasDelProyecto}
        isLoadingCompras={loadingCompras}
        onValidar={handleValidar}
        isValidating={validarCompraMutation.isPending}
        validatingCompraId={validandoCompraId}
        isSuccess={validarCompraMutation.isSuccess}
        isError={validarCompraMutation.isError}
        error={validarCompraMutation.error}
      />

      <Footer />
    </AppTheme>
  );
}
