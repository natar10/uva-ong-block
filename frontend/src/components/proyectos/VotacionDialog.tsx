import { useState, useEffect } from 'react';
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
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import TokenIcon from '@mui/icons-material/Token';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { ethers } from 'ethers';
import { type Proyecto } from '../../data/query/proyectos';
import { useTokenApproval } from '../../hooks/useTokenApproval';

export type TipoVotacion = 'aprobacion' | 'cancelacion';

interface VotacionDialogProps {
  open: boolean;
  onClose: () => void;
  proyecto: Proyecto | null;
  tipoVotacion: TipoVotacion;
  tokensDisponibles: number;
  onConfirmar: (proyectoId: string, cantidadVotos: number) => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  resultMessage?: string;
}

export function VotacionDialog({
  open,
  onClose,
  proyecto,
  tipoVotacion,
  tokensDisponibles,
  onConfirmar,
  isLoading,
  isSuccess,
  isError,
  error,
  resultMessage,
}: VotacionDialogProps) {
  const [cantidadVotos, setCantidadVotos] = useState(1);
  const [paso, setPaso] = useState(0); // 0: seleccionar votos, 1: aprobar tokens, 2: votar
  const [tokensAprobados, setTokensAprobados] = useState(false);

  const { checkAllowance, approve, isApproving, error: approvalError } = useTokenApproval();

  const esAprobacion = tipoVotacion === 'aprobacion';
  const maxVotos = Math.floor(tokensDisponibles);
  const puedeVotar = maxVotos >= 1;

  // Verificar allowance al cambiar cantidad de votos
  useEffect(() => {
    const verificarAllowance = async () => {
      if (cantidadVotos > 0) {
        const amount = ethers.parseEther(cantidadVotos.toString());
        const aprobado = await checkAllowance(amount);
        setTokensAprobados(aprobado);
      }
    };
    verificarAllowance();
  }, [cantidadVotos, checkAllowance]);

  const handleAprobarTokens = async () => {
    const amount = ethers.parseEther(cantidadVotos.toString());
    const exito = await approve(amount);
    if (exito) {
      setTokensAprobados(true);
      setPaso(2);
    }
  };

  const handleConfirmar = () => {
    if (proyecto && cantidadVotos > 0) {
      if (!tokensAprobados) {
        // Ir al paso de aprobacion
        setPaso(1);
      } else {
        // Ya esta aprobado, votar directamente
        setPaso(2);
        onConfirmar(proyecto.id, cantidadVotos);
      }
    }
  };

  const handleVotar = () => {
    if (proyecto && cantidadVotos > 0) {
      onConfirmar(proyecto.id, cantidadVotos);
    }
  };

  const handleClose = () => {
    setCantidadVotos(1);
    setPaso(0);
    setTokensAprobados(false);
    onClose();
  };

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    setCantidadVotos(newValue as number);
  };

  if (!proyecto) return null;

  const pasos = ['Seleccionar votos', 'Aprobar tokens', 'Votar'];

  const renderPasoSeleccion = () => (
    <>
      {/* Info del proyecto */}
      <Box
        sx={{
          bgcolor: 'grey.100',
          borderRadius: 2,
          p: 2,
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          Proyecto
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {proyecto.descripcion}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ID: {proyecto.id}
        </Typography>
      </Box>

      {/* Mensaje segun tipo */}
      <Alert
        severity={esAprobacion ? 'info' : 'warning'}
        icon={esAprobacion ? <HowToVoteIcon /> : <ThumbDownIcon />}
      >
        {esAprobacion ? (
          <>
            Al votar por este proyecto, ayudas a que sea{' '}
            <strong>aprobado y pueda recibir donaciones</strong>. Se
            requieren {2} votos minimos para aprobar.
          </>
        ) : (
          <>
            Al votar para cancelar, expresas tu desacuerdo con este
            proyecto. Si alcanza {2} votos, sera{' '}
            <strong>cancelado y los fondos iran al fondo comun</strong>.
          </>
        )}
      </Alert>

      {/* Tokens disponibles */}
      <Box>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <TokenIcon color="primary" />
          <Typography variant="subtitle1">
            Tokens disponibles:{' '}
            <Chip
              label={`${maxVotos} TKN4GOOD`}
              color={puedeVotar ? 'success' : 'error'}
              size="small"
              sx={{
                py: 2,
                px: 1,
                '& .MuiChip-label': {
                  fontSize: '1.2em',
                },
              }}
            />
          </Typography>
        </Stack>

        {!puedeVotar && (
          <Alert severity="error" sx={{ mb: 2 }}>
            No tienes suficientes tokens para votar. Realiza una donacion
            para obtener tokens de gobernanza.
          </Alert>
        )}

        {puedeVotar && (
          <>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Cantidad de votos a usar (1 token = 1 voto):
            </Typography>

            <Stack spacing={2}>
              <Slider
                value={cantidadVotos}
                onChange={handleSliderChange}
                min={1}
                max={maxVotos}
                step={1}
                marks
                valueLabelDisplay="on"
                disabled={isLoading || isSuccess}
              />

              <TextField
                type="number"
                value={cantidadVotos}
                onChange={(e) => {
                  const val = Math.max(
                    1,
                    Math.min(maxVotos, parseInt(e.target.value) || 1)
                  );
                  setCantidadVotos(val);
                }}
                size="small"
                disabled={isLoading || isSuccess}
                slotProps={{
                  htmlInput: {
                    min: 1,
                    max: maxVotos,
                  },
                }}
              />
            </Stack>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: 'block' }}
            >
              Los tokens usados seran quemados permanentemente.
            </Typography>

            {tokensAprobados && (
              <Alert severity="success" sx={{ mt: 2 }} icon={<CheckCircleIcon />}>
                Tokens ya aprobados. Puedes votar directamente.
              </Alert>
            )}
          </>
        )}
      </Box>
    </>
  );

  const renderPasoAprobacion = () => (
    <>
      <Alert severity="info" sx={{ mb: 2 }}>
        Para votar, primero debes aprobar que el contrato pueda usar tus tokens de gobernanza.
        Esto es un requisito de seguridad de los tokens ERC20.
      </Alert>

      <Box
        sx={{
          bgcolor: 'grey.100',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
        }}
      >
        <LockOpenIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Aprobar {cantidadVotos} token{cantidadVotos > 1 ? 's' : ''}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Se abrira tu wallet para confirmar la aprobacion
        </Typography>
      </Box>

      {isApproving && (
        <Alert severity="info" icon={<CircularProgress size={20} />}>
          Aprobando tokens... Por favor confirma en tu wallet.
        </Alert>
      )}

      {approvalError && (
        <Alert severity="error">
          {approvalError.message}
        </Alert>
      )}
    </>
  );

  const renderPasoVotacion = () => (
    <>
      <Box
        sx={{
          bgcolor: 'grey.100',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
        }}
      >
        {esAprobacion ? (
          <HowToVoteIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        ) : (
          <ThumbDownIcon sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
        )}
        <Typography variant="h6" gutterBottom>
          {esAprobacion ? 'Votar para aprobar' : 'Votar para cancelar'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Proyecto: {proyecto.descripcion}
        </Typography>
        <Chip
          label={`${cantidadVotos} voto${cantidadVotos > 1 ? 's' : ''}`}
          color={esAprobacion ? 'primary' : 'error'}
          sx={{ mt: 2 }}
        />
      </Box>

      {/* Estado de la transaccion */}
      {isLoading && (
        <Alert severity="info" icon={<CircularProgress size={20} />}>
          Procesando votacion... Por favor confirma en tu wallet.
        </Alert>
      )}

      {isSuccess && (
        <Alert severity="success" icon={<CheckCircleIcon />}>
          {resultMessage || 'Voto registrado exitosamente'}
        </Alert>
      )}

      {isError && (
        <Alert severity="error">
          {error?.message || 'Error al procesar la votacion'}
        </Alert>
      )}
    </>
  );

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          {esAprobacion ? (
            <HowToVoteIcon color="primary" />
          ) : (
            <ThumbDownIcon color="error" />
          )}
          <Typography variant="h6">
            {esAprobacion ? 'Votar para Aprobar' : 'Votar para Cancelar'}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Stepper para mostrar progreso */}
          {paso > 0 && (
            <Stepper activeStep={paso} alternativeLabel>
              {pasos.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}

          {paso === 0 && renderPasoSeleccion()}
          {paso === 1 && renderPasoAprobacion()}
          {paso === 2 && renderPasoVotacion()}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={isLoading || isApproving}>
          {isSuccess ? 'Cerrar' : 'Cancelar'}
        </Button>

        {/* Boton paso 0: Continuar */}
        {paso === 0 && !isSuccess && (
          <Button
            variant="contained"
            color={esAprobacion ? 'primary' : 'error'}
            onClick={handleConfirmar}
            disabled={!puedeVotar || isLoading || cantidadVotos < 1}
            startIcon={tokensAprobados ? <HowToVoteIcon /> : <LockOpenIcon />}
          >
            {tokensAprobados
              ? `Votar con ${cantidadVotos} token${cantidadVotos > 1 ? 's' : ''}`
              : 'Continuar'}
          </Button>
        )}

        {/* Boton paso 1: Aprobar tokens */}
        {paso === 1 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleAprobarTokens}
            disabled={isApproving}
            startIcon={
              isApproving ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <LockOpenIcon />
              )
            }
          >
            {isApproving ? 'Aprobando...' : 'Aprobar tokens'}
          </Button>
        )}

        {/* Boton paso 2: Votar */}
        {paso === 2 && !isSuccess && (
          <Button
            variant="contained"
            color={esAprobacion ? 'primary' : 'error'}
            onClick={handleVotar}
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : esAprobacion ? (
                <HowToVoteIcon />
              ) : (
                <ThumbDownIcon />
              )
            }
          >
            {isLoading ? 'Procesando...' : 'Confirmar voto'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
