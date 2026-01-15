import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import TokenIcon from '@mui/icons-material/Token';
import { alpha } from '@mui/material/styles';
import ninosManos from '../../assets/ninos-manos.jpg';

interface IncentivoVotacionProps {
  tokens: string;
  isRegistered: boolean;
}

export function IncentivoVotacion({
  tokens,
  isRegistered,
}: IncentivoVotacionProps) {
  const tokensNumber = parseFloat(tokens);
  const tieneTokens = tokensNumber > 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Card
        sx={{
          overflow: 'hidden',
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #1a237e 0%, #4a148c 100%)',
        }}
      >
        <Grid container>
          {/* Imagen */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                height: { xs: 200, md: '100%' },
                minHeight: { md: 280 },
                backgroundImage: `url(${ninosManos})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </Grid>

          {/* Contenido */}
          <Grid size={{ xs: 12, md: 8 }}>
            <CardContent sx={{ p: { xs: 3, md: 4 }, color: 'white' }}>
              <Stack spacing={3}>
                <Box>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mb: 1 }}
                  >
                    <HowToVoteIcon sx={{ fontSize: 28 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Tu voz importa
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body1"
                    sx={{ opacity: 0.9, lineHeight: 1.7 }}
                  >
                    Como parte de nuestra comunidad, tienes el poder de decidir
                    que proyectos educativos merecen apoyo. Cada donación te
                    otorga tokens de gobernanza que puedes usar para votar y
                    dar forma al futuro de la educacion.
                  </Typography>
                </Box>

                {/* Balance de tokens */}
                <Box
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.common.white, 0.15),
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    justifyContent="space-between"
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TokenIcon sx={{ fontSize: 24 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Tus Tokens de Gobernanza
                      </Typography>
                    </Stack>

                    {isRegistered ? (
                      <Chip
                        label={`${tokensNumber.toFixed(0)} TKN4GOOD`}
                        size='medium'
                        icon={<TokenIcon />}
                        sx={{
                          bgcolor: tieneTokens ? 'success.main' : 'grey.600',
                          color: 'white',
                          fontWeight: 700,
                          py: 2,
                          px: 1,
                          '& .MuiChip-label': {
                            fontSize: '1.5em',
                          },
                        }}
                      />
                    ) : (
                      <Chip
                        label="Sin registrar"
                        sx={{
                          bgcolor: 'warning.main',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Stack>

                  {isRegistered && !tieneTokens && (
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, opacity: 0.8 }}
                    >
                      Realiza una donación para obtener tokens y participar en
                      las votaciones.
                    </Typography>
                  )}

                  {isRegistered && tieneTokens && (
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, opacity: 0.8 }}
                    >
                      Usa tus tokens para votar por proyectos propuestos o
                      expresar tu opinion sobre proyectos activos.
                    </Typography>
                  )}

                  {!isRegistered && (
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, opacity: 0.8 }}
                    >
                      Conecta tu wallet y realiza tu primera donacion para
                      unirte a nuestra comunidad de gobernanza.
                    </Typography>
                  )}
                </Box>

                {/* Mensaje motivacional */}
                <Typography
                  variant="body2"
                  sx={{
                    fontStyle: 'italic',
                    opacity: 0.85,
                    borderLeft: '3px solid',
                    borderColor: 'rgba(255,255,255,0.5)',
                    pl: 2,
                  }}
                >
                  "Juntos decidimos como transformar la educacion. Tu
                  participacion hace la diferencia."
                </Typography>
              </Stack>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}
