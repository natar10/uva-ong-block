import Typography from '@mui/material/Typography';
import { Box, Card, CardContent } from '@mui/material';

interface ErrorWalletProps {
  error: string;
}

export function ErrorWallet({error}: ErrorWalletProps) {

  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
        <Card
        sx={{
            maxWidth: 600,
            mx: 'auto',
            bgcolor: 'error.light',
            color: 'error.contrastText',
        }}
        >
        <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
            Error al cargar proyectos
            </Typography>
            <Typography variant="body2">{error}</Typography>
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.9 }}>
            Asegurate de tener MetaMask instalado y conectado a la red
            correcta.
            </Typography>
        </CardContent>
        </Card>
    </Box>
  );
}
