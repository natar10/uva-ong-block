import { Alert, Box, Button, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ConectWalletDonorProps {
  handleConnectWallet: () => void;
}

export function ConectWallet({handleConnectWallet}: ConectWalletDonorProps) {
  return (
    <Button
      variant="contained"
      size="large"
      onClick={handleConnectWallet}
      startIcon={<AccountBalanceWalletIcon />}
      sx={{ px: 4, py: 1.5 }}
    >
      Conectar Wallet
    </Button>
  );
}


interface VerifyingWalletProps {
  walletAddress: string;
}

export function VerifyingWallet({walletAddress}: VerifyingWalletProps) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <CircularProgress />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Verificando registro de donante...
      </Typography>
      <Alert severity="info" sx={{ mt: 2 }}>
        Wallet conectada: {walletAddress.substring(0, 6)}...
        {walletAddress.substring(38)}
      </Alert>
    </Box>
  );
}



interface ConnectWalletProps {
  handleConnectWallet: () => void;
  walletAddress: string;
  checkingWallet: boolean;
  walletConnected: boolean;
  loadingDonante: boolean;
}

export function ConnectWallet({
  walletAddress, 
  handleConnectWallet, 
  checkingWallet, 
  walletConnected, 
  loadingDonante
}: ConnectWalletProps) {
  return (
    <Card sx={{ maxWidth: 600, mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3} alignItems="center">
          <AccountBalanceWalletIcon
            sx={{ fontSize: 80, color: 'primary.main' }}
          />
          <Typography variant="h4" textAlign="center">
            Conecta tu Wallet
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Necesitas conectar tu billetera de Ethereum para poder donar.
            Recomendamos usar MetaMask.
          </Typography>

          {checkingWallet ? (
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Verificando wallet...
              </Typography>
            </Box>
          ) : !walletConnected ? (
            <ConectWallet handleConnectWallet={handleConnectWallet} />
          ) : loadingDonante ? (
            <VerifyingWallet walletAddress={walletAddress} />
          ) : (
            <Alert severity="success" icon={<CheckCircleIcon />}>
              Wallet conectada: {walletAddress.substring(0, 6)}...
              {walletAddress.substring(38)}
            </Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
