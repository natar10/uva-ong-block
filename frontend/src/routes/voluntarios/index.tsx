import { useState, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import {
  Button,
  TextField,
  Stack,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  CircularProgress,
  Container,
  InputAdornment,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import ReceiptIcon from '@mui/icons-material/Receipt';

import { useVoluntarios } from '../../hooks/useVoluntarios';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AppTheme from '../../shared-theme/AppTheme';

// --- Ruta /voluntarios
export const Route = createFileRoute('/voluntarios/')({
  component: VoluntariosPage,
});

// --- Componente Voluntarios
function VoluntariosPage() {
  const [projectId, setProjectId] = useState('');
  const [monto, setMonto] = useState('');
  const [filtroProyecto, setFiltroProyecto] = useState('');
  const { validarProyecto, retirarTodo, loading } = useVoluntarios();

  // Datos simulados (temporal, puedes reemplazar con blockchain real más adelante)
  const datosSimulados = useMemo(() => {
    return [
      { id: 'VOL1', proyectoId: '1', cantidadValidada: 0.01, fecha: '30 de diciembre de 2025, 16:29' },
      { id: 'VOL2', proyectoId: '1', cantidadValidada: 0.001, fecha: '30 de diciembre de 2025, 16:33' },
      { id: 'VOL3', proyectoId: '1', cantidadValidada: 0.01, fecha: '30 de diciembre de 2025, 16:35' },
      { id: 'VOL4', proyectoId: '1', cantidadValidada: 0.01, fecha: '3 de enero de 2026, 18:58' },
    ];
  }, []);

  // Filtrar voluntarios por proyecto
  const voluntariosFiltrados = useMemo(() => {
    return datosSimulados.filter((v) =>
      filtroProyecto ? v.proyectoId.includes(filtroProyecto) : true
    );
  }, [filtroProyecto, datosSimulados]);

  // Estadísticas
  const stats = useMemo(() => {
    const totalValidaciones = voluntariosFiltrados.length;
    const totalCantidad = voluntariosFiltrados.reduce((sum, v) => sum + v.cantidadValidada, 0);
    return { totalValidaciones, totalCantidad: totalCantidad.toFixed(4) };
  }, [voluntariosFiltrados]);

  const handleClearFilters = () => {
    setFiltroProyecto('');
  };

  return (
    <AppTheme>
      <Header />

      <Box sx={{ minHeight: '100vh', py: 8, background: '#f5f5f5' }}>
        {/* Hero */}
        <Stack spacing={3} alignItems="center" textAlign="center" sx={{ mb: 6 }}>
          <ReceiptIcon sx={{ fontSize: 60, color: 'primary.main' }} />
          <Typography variant="h2" sx={{ fontWeight: 800 }}>
            Registro de Voluntarios
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 700 }}>
            Transparencia total: Todas las validaciones registradas en blockchain
          </Typography>
        </Stack>

        {/* Estadísticas */}
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Validaciones</Typography>
              <Typography variant="h4" color="primary.main">{stats.totalValidaciones}</Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>Total Cantidad Validada</Typography>
              <Typography variant="h4" color="success.main">{stats.totalCantidad} ETH</Typography>
            </CardContent>
          </Card>
        </Stack>

        {/* Filtro por proyecto */}
        <Card sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Filtros</Typography>
              <TextField
                label="Filtrar por Proyecto"
                placeholder="ID del proyecto"
                value={filtroProyecto}
                onChange={(e) => setFiltroProyecto(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                  endAdornment: filtroProyecto && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleClearFilters}><ClearIcon /></IconButton>
                    </InputAdornment>
                  )
                }}
                fullWidth
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Tabla de voluntarios */}
        <Container maxWidth="lg">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>ID Proyecto</TableCell>
                  <TableCell align="right">Cantidad Validada (ETH)</TableCell>
                  <TableCell>Fecha</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {voluntariosFiltrados.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>{v.id}</TableCell>
                    <TableCell>{v.proyectoId}</TableCell>
                    <TableCell align="right">{v.cantidadValidada}</TableCell>
                    <TableCell>{v.fecha}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>

        {/* Información adicional */}
        <Container maxWidth="lg" sx={{ mt: 8 }}>
          <Card sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>Sobre la Transparencia en Blockchain</Typography>
            <Stack spacing={2}>
              <Typography>🔗 <strong>Inmutabilidad:</strong> Cada validación queda registrada permanentemente en blockchain.</Typography>
              <Typography>👁️ <strong>Visibilidad Total:</strong> Todas las acciones son verificables.</Typography>
              <Typography>⏱️ <strong>Tiempo Real:</strong> Los registros se actualizan instantáneamente.</Typography>
            </Stack>
          </Card>
        </Container>
      </Box>

      <Footer />
    </AppTheme>
  );
}
