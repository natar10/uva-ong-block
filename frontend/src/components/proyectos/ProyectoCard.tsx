import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { alpha } from '@mui/material/styles';
import { EstadoProyecto, type Proyecto } from '../../data/query/proyectos';

interface ProyectoCardProps {
  proyecto: Proyecto;
  onVotarAprobacion?: (proyecto: Proyecto) => void;
  onVotarCancelacion?: (proyecto: Proyecto) => void;
}

const getEstadoChip = (estado: EstadoProyecto) => {
  switch (estado) {
    case EstadoProyecto.Propuesto:
      return (
        <Chip
          label="Propuesto"
          color="warning"
          size="small"
          icon={<HourglassEmptyIcon />}
        />
      );
    case EstadoProyecto.Activo:
      return (
        <Chip
          label="Activo"
          color="success"
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

const formatearDireccion = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(38)}`;
};

const calcularPorcentajeValidado = (recaudado: string, validado: string) => {
  const rec = parseFloat(recaudado);
  const val = parseFloat(validado);
  if (rec === 0) return 0;
  return (val / rec) * 100;
};

export function ProyectoCard({
  proyecto,
  onVotarAprobacion,
  onVotarCancelacion,
}: ProyectoCardProps) {
  const porcentajeValidado = calcularPorcentajeValidado(
    proyecto.cantidadRecaudada,
    proyecto.cantidadValidada
  );

  const mostrarBotonVotar = proyecto.estado === EstadoProyecto.Propuesto;
  const mostrarBotonCancelar = proyecto.estado === EstadoProyecto.Activo;

  return (
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
          {/* Informacion Principal */}
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
                  {proyecto.descripcion}
                </Typography>
                {getEstadoChip(proyecto.estado)}
              </Box>

              <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                {proyecto.id}
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

              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                flexWrap="wrap"
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <HowToVoteIcon
                    sx={{ fontSize: 18, color: 'text.secondary' }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    <strong>Votos aprobacion:</strong> {proyecto.votosAprobacion}
                  </Typography>
                </Stack>

                {proyecto.estado !== EstadoProyecto.Propuesto && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Votos cancelacion:</strong> {proyecto.votosCancelacion}
                  </Typography>
                )}

                {mostrarBotonVotar && onVotarAprobacion && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<HowToVoteIcon />}
                    onClick={() => onVotarAprobacion(proyecto)}
                    sx={{ ml: 'auto' }}
                  >
                    Votar Proyecto
                  </Button>
                )}

                {mostrarBotonCancelar && onVotarCancelacion && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<ThumbDownIcon />}
                    onClick={() => onVotarCancelacion(proyecto)}
                    sx={{ ml: 'auto' }}
                  >
                    No me gusta este proyecto
                  </Button>
                )}
              </Stack>
            </Stack>
          </Grid>

          {/* Estadisticas del Proyecto */}
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
                        Progreso de validacion
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
  );
}
