import { Link, useLocation } from '@tanstack/react-router';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import FolderIcon from '@mui/icons-material/Folder';
import ListAlt from '@mui/icons-material/ListAlt';
import { useState } from 'react';

const menuItems = [
  { label: 'Home', path: '/', icon: <HomeIcon /> },
  { label: 'Donar', path: '/donar', icon: <VolunteerActivismIcon /> },
  { label: 'Proyectos', path: '/proyectos', icon: <FolderIcon /> },
  { label: 'Donaciones', path: '/donaciones', icon: <ListAlt /> },
];

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleDrawerToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(18, 18, 18, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ py: 1 }}>
            {/* Logo / Title */}
            <Box
              component={Link}
              to="/"
              sx={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                flexGrow: 1,
              }}
            >
              <Typography
                variant="h5"
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
                BlockChain4Good
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Stack
              direction="row"
              spacing={1}
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              {menuItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: isActive(item.path) ? 'primary.main' : 'text.primary',
                    fontWeight: isActive(item.path) ? 600 : 400,
                    px: 2,
                    borderBottom: isActive(item.path) ? 2 : 0,
                    borderColor: 'primary.main',
                    borderRadius: 0,
                    '&:hover': {
                      bgcolor: (theme) =>
                        theme.palette.mode === 'light'
                          ? 'rgba(25, 118, 210, 0.08)'
                          : 'rgba(144, 202, 249, 0.08)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>

            {/* Mobile Menu Button */}
            <IconButton
              edge="end"
              onClick={handleDrawerToggle}
              sx={{ display: { xs: 'flex', md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Menú
            </Typography>
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {menuItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={handleDrawerToggle}
                  selected={isActive(item.path)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: (theme) =>
                        theme.palette.mode === 'light'
                          ? 'rgba(25, 118, 210, 0.12)'
                          : 'rgba(144, 202, 249, 0.12)',
                      '&:hover': {
                        bgcolor: (theme) =>
                          theme.palette.mode === 'light'
                            ? 'rgba(25, 118, 210, 0.18)'
                            : 'rgba(144, 202, 249, 0.18)',
                      },
                    },
                  }}
                >
                  <Box sx={{ mr: 2, display: 'flex', color: 'primary.main' }}>
                    {item.icon}
                  </Box>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: isActive(item.path) ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
