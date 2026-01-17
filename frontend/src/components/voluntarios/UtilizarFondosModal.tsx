import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { type Proyecto } from '../../data/query/proyectos';
import {
  materialesQueryOptions,
  fetchProveedor,
  type Proveedor,
} from '../../data/query/compras';
import { useContract } from '../../hooks/useContract';

export interface RealizarCompraParams {
  compraId: string;
  proyectoId: string;
  proveedor: string;
  tipoMaterial: string;
  cantidad: number;
}

interface UtilizarFondosModalProps {
  open: boolean;
  onClose: () => void;
  proyecto: Proyecto | null;
  onConfirmar: (params: RealizarCompraParams) => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
}

export function UtilizarFondosModal({
  open,
  onClose,
  proyecto,
  onConfirmar,
  isLoading,
  isSuccess,
  isError,
  error,
}: UtilizarFondosModalProps) {
  const { getContract } = useContract();

  const [compraId, setCompraId] = useState('');
  const [proveedorAddress, setProveedorAddress] = useState('');
  const [tipoMaterial, setTipoMaterial] = useState('');
  const [cantidad, setCantidad] = useState(1);

  // Estado para proveedores verificados
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loadingProveedores, setLoadingProveedores] = useState(false);
  const [nuevoProveedor, setNuevoProveedor] = useState('');
  const [errorProveedor, setErrorProveedor] = useState<string | null>(null);

  // Query para obtener materiales
  const { data: materiales = [], isLoading: loadingMateriales } = useQuery({
    ...materialesQueryOptions(getContract),
    enabled: open,
  });

  const materialSeleccionado = materiales.find((m) => m.nombre === tipoMaterial);
  const costoTotalWei = materialSeleccionado ? materialSeleccionado.valorNumber * cantidad : 0;
  const costoTotalEth = costoTotalWei > 0 ? ethers.formatEther(BigInt(costoTotalWei)) : '0';

  const fondosDisponibles = proyecto ? parseFloat(proyecto.cantidadRecaudada) : 0;

  const formValido =
    compraId.trim() !== '' &&
    proveedorAddress !== '' &&
    tipoMaterial !== '' &&
    cantidad > 0;

  // Verificar y agregar proveedor
  const handleAgregarProveedor = async () => {
    if (!nuevoProveedor || !nuevoProveedor.startsWith('0x')) {
      setErrorProveedor('Direccion invalida');
      return;
    }

    // Verificar si ya esta en la lista
    if (proveedores.some((p) => p.direccion.toLowerCase() === nuevoProveedor.toLowerCase())) {
      setErrorProveedor('Proveedor ya agregado');
      return;
    }

    setLoadingProveedores(true);
    setErrorProveedor(null);

    try {
      const proveedor = await fetchProveedor(getContract, nuevoProveedor);
      if (proveedor) {
        setProveedores((prev) => [...prev, proveedor]);
        setNuevoProveedor('');
      } else {
        setErrorProveedor('Proveedor no registrado en el contrato');
      }
    } catch {
      setErrorProveedor('Error al verificar proveedor');
    } finally {
      setLoadingProveedores(false);
    }
  };

  const handleConfirmar = () => {
    if (proyecto && formValido) {
      onConfirmar({
        compraId,
        proyectoId: proyecto.id,
        proveedor: proveedorAddress,
        tipoMaterial,
        cantidad,
      });
    }
  };

  const handleClose = () => {
    setCompraId('');
    setProveedorAddress('');
    setTipoMaterial('');
    setCantidad(1);
    setNuevoProveedor('');
    setErrorProveedor(null);
    onClose();
  };

  // Limpiar al cerrar
  useEffect(() => {
    if (!open) {
      setProveedores([]);
    }
  }, [open]);

  if (!proyecto) return null;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <ShoppingCartIcon color="primary" />
          <Typography variant="h6">Realizar Compra</Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Info del proyecto */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Proyecto
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {proyecto.descripcion}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
              <AccountBalanceWalletIcon fontSize="small" color="success" />
              <Typography variant="body2" color="success.main" fontWeight={600}>
                Fondos disponibles: {fondosDisponibles} ETH
              </Typography>
            </Stack>
          </Box>

          {isSuccess ? (
            <Alert severity="success" icon={<CheckCircleIcon />}>
              Compra realizada exitosamente
            </Alert>
          ) : (
            <>
              {/* ID de la compra */}
              <TextField
                label="ID de la Compra"
                placeholder="Ej: COMPRA-001"
                value={compraId}
                onChange={(e) => setCompraId(e.target.value)}
                fullWidth
                required
                disabled={isLoading}
                helperText="Identificador unico para esta compra"
              />

              {/* Agregar proveedor */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Verificar Proveedor
                </Typography>
                <Stack direction="row" spacing={1}>
                  <TextField
                    label="Direccion del Proveedor"
                    placeholder="0x..."
                    value={nuevoProveedor}
                    onChange={(e) => setNuevoProveedor(e.target.value)}
                    fullWidth
                    size="small"
                    disabled={isLoading || loadingProveedores}
                    error={!!errorProveedor}
                    helperText={errorProveedor}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAgregarProveedor}
                    disabled={isLoading || loadingProveedores || !nuevoProveedor}
                  >
                    {loadingProveedores ? <CircularProgress size={20} /> : 'Verificar'}
                  </Button>
                </Stack>
              </Box>

              {/* Seleccionar proveedor */}
              <TextField
                select
                label="Proveedor"
                value={proveedorAddress}
                onChange={(e) => setProveedorAddress(e.target.value)}
                fullWidth
                required
                disabled={isLoading || proveedores.length === 0}
                helperText={
                  proveedores.length === 0
                    ? 'Agrega un proveedor primero verificando su direccion'
                    : undefined
                }
              >
                {proveedores.map((prov) => (
                  <MenuItem key={prov.direccion} value={prov.direccion}>
                    {prov.id} - {prov.descripcion} ({prov.direccion.substring(0, 10)}...)
                  </MenuItem>
                ))}
              </TextField>

              {/* Seleccionar material */}
              {loadingMateriales ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2">Cargando materiales...</Typography>
                </Box>
              ) : (
                <TextField
                  select
                  label="Tipo de Material"
                  value={tipoMaterial}
                  onChange={(e) => setTipoMaterial(e.target.value)}
                  fullWidth
                  required
                  disabled={isLoading || materiales.length === 0}
                >
                  {materiales.map((mat) => (
                    <MenuItem key={mat.nombre} value={mat.nombre}>
                      {mat.nombre} - {mat.valor} wei/unidad
                    </MenuItem>
                  ))}
                </TextField>
              )}

              {/* Cantidad */}
              <TextField
                label="Cantidad"
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                fullWidth
                required
                disabled={isLoading}
                slotProps={{
                  htmlInput: { min: 1 },
                }}
              />

              {/* Resumen del costo */}
              {materialSeleccionado && (
                <Box
                  sx={{
                    bgcolor: 'primary.50',
                    borderRadius: 2,
                    p: 2,
                    border: '1px solid',
                    borderColor: 'primary.200',
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    Resumen de la compra
                  </Typography>
                  <Stack spacing={1} sx={{ mt: 1 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Material:</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {tipoMaterial}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Cantidad:</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {cantidad} unidades
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Precio unitario:</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {materialSeleccionado.valor} wei
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider' }}
                    >
                      <Typography variant="body1" fontWeight={600}>
                        Total (wei):
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {costoTotalWei} wei
                      </Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{
                        pt: 1,
                        mt: 1,
                        borderTop: '2px solid',
                        borderColor: 'primary.main',
                        bgcolor: 'primary.100',
                        mx: -2,
                        px: 2,
                        py: 1,
                        mb: -2,
                        borderRadius: '0 0 8px 8px',
                      }}
                    >
                      <Typography variant="h6" fontWeight={700}>
                        Total (ETH):
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="primary.main">
                        {costoTotalEth} ETH
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              )}

              {isError && (
                <Alert severity="error">
                  {error?.message || 'Error al realizar la compra'}
                </Alert>
              )}

              {isLoading && (
                <Alert severity="info" icon={<CircularProgress size={20} />}>
                  Procesando compra... Por favor confirma en tu wallet.
                </Alert>
              )}
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          {isSuccess ? 'Cerrar' : 'Cancelar'}
        </Button>
        {!isSuccess && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmar}
            disabled={!formValido || isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <ShoppingCartIcon />
              )
            }
          >
            {isLoading ? 'Procesando...' : 'Realizar Compra'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
