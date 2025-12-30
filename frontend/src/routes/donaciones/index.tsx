import { createFileRoute } from '@tanstack/react-router';
import { useState, useMemo } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AppTheme from '../../shared-theme/AppTheme';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { useDonaciones } from '../../hooks/useDonaciones';

export const Route = createFileRoute('/donaciones/')({
  component: DonacionesPage,
});

function DonacionesPage() {
  const { donaciones, loading, error, isRefetching } = useDonaciones();
  const [filtroDonante, setFiltroDonante] = useState('');
  const [filtroProyecto, setFiltroProyecto] = useState('');

  // Filtrar donaciones basado en los filtros
  const donacionesFiltradas = useMemo(() => {
    return donaciones.filter((donacion) => {
      const matchDonante = filtroDonante
        ? donacion.donante.toLowerCase().includes(filtroDonante.toLowerCase())
        : true;
      const matchProyecto = filtroProyecto
        ? donacion.proyectoId.toLowerCase().includes(filtroProyecto.toLowerCase())
        : true;
      return matchDonante && matchProyecto;
    });
  }, [donaciones, filtroDonante, filtroProyecto]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const total = donacionesFiltradas.reduce(
      (sum, d) => sum + parseFloat(d.cantidadEth),
      0
    );
    return {
      totalDonaciones: donacionesFiltradas.length,
      totalRecaudado: total.toFixed(4),
    };
  }, [donacionesFiltradas]);

  const handleClearFilters = () => {
    setFiltroDonante('');
    setFiltroProyecto('');
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
            <ReceiptIcon sx={{ fontSize: 60, color: 'primary.main' }} />
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
              Registro de Donaciones
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 700 }}>
              Transparencia total: Todas las donaciones registradas en blockchain
            </Typography>
          </Stack>
        </Container>

        {/* Stats Cards */}
        {!loading && (
          <Container maxWidth="lg" sx={{ mb: 4 }}>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Card sx={{ minWidth: 200 }}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total Donaciones
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {stats.totalDonaciones}
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ minWidth: 200 }}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total Recaudado
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {stats.totalRecaudado} ETH
                  </Typography>
                </CardContent>
              </Card>
            </Stack>
          </Container>
        )}

        {/* Filters */}
        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Filtros
                </Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label="Filtrar por Donante"
                    placeholder="Dirección del donante"
                    fullWidth
                    value={filtroDonante}
                    onChange={(e) => setFiltroDonante(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: filtroDonante && (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setFiltroDonante('')}
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    label="Filtrar por Proyecto"
                    placeholder="ID del proyecto"
                    fullWidth
                    value={filtroProyecto}
                    onChange={(e) => setFiltroProyecto(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: filtroProyecto && (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={() => setFiltroProyecto('')}
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Stack>
                {(filtroDonante || filtroProyecto) && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Filtros activos:
                    </Typography>
                    {filtroDonante && (
                      <Chip
                        label={`Donante: ${filtroDonante.substring(0, 10)}...`}
                        onDelete={() => setFiltroDonante('')}
                        size="small"
                      />
                    )}
                    {filtroProyecto && (
                      <Chip
                        label={`Proyecto: ${filtroProyecto}`}
                        onDelete={() => setFiltroProyecto('')}
                        size="small"
                      />
                    )}
                    <Chip
                      label="Limpiar todos"
                      onClick={handleClearFilters}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Container>

        {/* Donations Table */}
        <Container maxWidth="lg">
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CircularProgress size={60} />
              <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                Cargando donaciones desde blockchain...
              </Typography>
            </Box>
          ) : error ? (
            <Alert severity="error">Error al cargar donaciones: {error}</Alert>
          ) : donacionesFiltradas.length === 0 ? (
            <Alert severity="info">
              {donaciones.length === 0
                ? 'No hay donaciones registradas en este momento.'
                : 'No se encontraron donaciones con los filtros aplicados.'}
            </Alert>
          ) : (
            <Card>
              <CardContent sx={{ p: 0 }}>
                {isRefetching && (
                  <Box sx={{ p: 2, bgcolor: 'action.hover' }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CircularProgress size={16} />
                      <Typography variant="body2">Actualizando...</Typography>
                    </Stack>
                  </Box>
                )}
                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: 'action.hover' }}>
                        <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Donante</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>ID Proyecto</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">
                          Monto (ETH)
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {donacionesFiltradas.map((donacion) => (
                        <TableRow
                          key={donacion.id}
                          sx={{
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                          }}
                        >
                          <TableCell>
                            <Chip label={donacion.id} size="small" color="primary" />
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: 'monospace',
                                fontSize: '0.875rem',
                              }}
                            >
                              {donacion.donante.substring(0, 6)}...
                              {donacion.donante.substring(38)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={donacion.proyectoId}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600, color: 'success.main' }}
                            >
                              {donacion.cantidadEth} ETH
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {donacion.fechaFormateada}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </Container>

        {/* Info Section */}
        <Container maxWidth="lg" sx={{ mt: 8 }}>
          <Card
            sx={{
              bgcolor: (theme) =>
                theme.palette.mode === 'light' ? 'grey.50' : 'grey.900',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                Sobre la Transparencia en Blockchain
              </Typography>
              <Stack spacing={2}>
                <Typography variant="body1" color="text.secondary">
                  🔗 <strong>Inmutabilidad:</strong> Cada donación queda registrada
                  permanentemente en la blockchain, sin posibilidad de alteración.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  👁️ <strong>Visibilidad Total:</strong> Cualquier persona puede
                  verificar las donaciones y rastrear el uso de los fondos.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  ⏱️ <strong>Tiempo Real:</strong> Las transacciones se registran
                  instantáneamente y son visibles para todos.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Container>
      </Box>
      <Footer />
    </AppTheme>
  );
}
