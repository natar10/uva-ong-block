import Typography from '@mui/material/Typography';

export function DonarHero() {

  return (
    <>
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
        Haz tu Donación
      </Typography>
      <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 700 }}>
        Contribuye a proyectos que cambian vidas. Cada donación es
        registrada de forma transparente en blockchain.
      </Typography>
    </>
  );
}
