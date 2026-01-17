import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { type Proyecto } from '../../data/query/proyectos';
import { type Compra } from '../../data/query/compras';

interface ValidarCompraModalProps {
  open: boolean;
  onClose: () => void;
  proyecto: Proyecto | null;
  compras: Compra[];
  isLoadingCompras: boolean;
  onValidar: (compraId: string) => void;
  isValidating: boolean;
  validatingCompraId: string | null;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
}

const formatearDireccion = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(38)}`;
};

export function ValidarCompraModal({
  open,
  onClose,
  proyecto,
  compras,
  isLoadingCompras,
  onValidar,
  isValidating,
  validatingCompraId,
  isSuccess,
  isError,
  error,
}: ValidarCompraModalProps) {
  const comprasPendientes = compras.filter((c) => !c.validada);
  const comprasValidadas = compras.filter((c) => c.validada);

  if (!proyecto) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <VerifiedIcon color="secondary" />
          <Typography variant="h6">Validar Compras</Typography>
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
          </Box>

          {/* Informacion sobre validacion */}
          <Alert severity="info">
            Al validar una compra, confirmas que el proveedor entrego los materiales
            correctamente. Esto transferira los fondos reservados al proveedor.
          </Alert>

          {isLoadingCompras ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : compras.length === 0 ? (
            <Alert severity="warning">
              No hay compras registradas para este proyecto.
            </Alert>
          ) : (
            <>
              {/* Compras pendientes */}
              {comprasPendientes.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    <PendingIcon
                      fontSize="small"
                      sx={{ verticalAlign: 'middle', mr: 1 }}
                      color="warning"
                    />
                    Compras Pendientes de Validar ({comprasPendientes.length})
                  </Typography>

                  <Stack spacing={2}>
                    {comprasPendientes.map((compra) => (
                      <Card key={compra.id} variant="outlined">
                        <CardContent>
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            justifyContent="space-between"
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            spacing={2}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 1 }}
                              >
                                <Typography variant="subtitle2" fontWeight={600}>
                                  {compra.id}
                                </Typography>
                                <Chip
                                  label="Pendiente"
                                  color="warning"
                                  size="small"
                                />
                              </Stack>

                              <Stack spacing={0.5}>
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Material:</strong> {compra.tipo} x{' '}
                                  {compra.cantidad}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Valor:</strong> {compra.valorEth} ETH
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Proveedor:</strong>{' '}
                                  {formatearDireccion(compra.proveedor)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Fecha:</strong> {compra.fechaFormateada}
                                </Typography>
                              </Stack>
                            </Box>

                            <Button
                              variant="contained"
                              color="success"
                              startIcon={
                                isValidating && validatingCompraId === compra.id ? (
                                  <CircularProgress size={20} color="inherit" />
                                ) : (
                                  <VerifiedIcon />
                                )
                              }
                              onClick={() => onValidar(compra.id)}
                              disabled={isValidating}
                            >
                              {isValidating && validatingCompraId === compra.id
                                ? 'Validando...'
                                : 'Validar'}
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* Compras validadas */}
              {comprasValidadas.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                    <CheckCircleIcon
                      fontSize="small"
                      sx={{ verticalAlign: 'middle', mr: 1 }}
                      color="success"
                    />
                    Compras Validadas ({comprasValidadas.length})
                  </Typography>

                  <Stack spacing={2}>
                    {comprasValidadas.map((compra) => (
                      <Card
                        key={compra.id}
                        variant="outlined"
                        sx={{ bgcolor: 'success.50', borderColor: 'success.200' }}
                      >
                        <CardContent>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 1 }}
                          >
                            <Typography variant="subtitle2" fontWeight={600}>
                              {compra.id}
                            </Typography>
                            <Chip
                              label="Validada"
                              color="success"
                              size="small"
                              icon={<CheckCircleIcon />}
                            />
                          </Stack>

                          <Stack spacing={0.5}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Material:</strong> {compra.tipo} x{' '}
                              {compra.cantidad}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Valor:</strong> {compra.valorEth} ETH
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Proveedor:</strong>{' '}
                              {formatearDireccion(compra.proveedor)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Fecha:</strong> {compra.fechaFormateada}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}
            </>
          )}

          {isSuccess && (
            <Alert severity="success" icon={<CheckCircleIcon />}>
              Compra validada exitosamente. Los fondos han sido transferidos al
              proveedor.
            </Alert>
          )}

          {isError && (
            <Alert severity="error">
              {error?.message || 'Error al validar la compra'}
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
