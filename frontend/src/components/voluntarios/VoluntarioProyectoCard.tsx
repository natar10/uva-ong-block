import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { alpha } from '@mui/material/styles';
import { EstadoProyecto, type Proyecto } from '../../data/query/proyectos';

interface VoluntarioProyectoCardProps {
  proyecto: Proyecto;
  onUtilizarFondos: (proyecto: Proyecto) => void;
  onValidarCompra: (proyecto: Proyecto) => void;
}

const getEstadoChip = (estado: EstadoProyecto) => {
  switch (estado) {
    case EstadoProyecto.Activo:
      return (
        <Chip
          label="Activo"
          color="success"
          size="small"
          icon={<CheckCircleIcon />}
        />
      );
    default:
      return null;
  }
};

export function VoluntarioProyectoCard({
  proyecto,
  onUtilizarFondos,
  onValidarCompra,
}: VoluntarioProyectoCardProps) {
  const fondosDisponibles = parseFloat(proyecto.cantidadRecaudada);
  const tieneFondos = fondosDisponibles > 0;

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
        <Stack spacing={3}>
          {/* Header con nombre y estado */}
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

          <Typography variant="body2" color="text.secondary">
            ID: {proyecto.id}
          </Typography>

          {/* Fondos disponibles */}
          <Box
            sx={{
              bgcolor: (theme) =>
                theme.palette.mode === 'light'
                  ? alpha(theme.palette.primary.main, 0.05)
                  : alpha(theme.palette.primary.dark, 0.1),
              borderRadius: 2,
              p: 2,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <AccountBalanceWalletIcon color="primary" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Fondos Disponibles
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: tieneFondos ? 'success.main' : 'text.secondary',
                  }}
                >
                  {proyecto.cantidadRecaudada} ETH
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Divider />

          {/* Botones de accion */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              startIcon={<ShoppingCartIcon />}
              onClick={() => onUtilizarFondos(proyecto)}
              disabled={!tieneFondos}
            >
              Utilizar Fondos
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<VerifiedIcon />}
              onClick={() => onValidarCompra(proyecto)}
            >
              Validar Compra
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
