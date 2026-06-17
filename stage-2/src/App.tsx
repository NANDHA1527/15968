import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, Box, CssBaseline, Drawer, AppBar, Toolbar, List, Typography, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ListAltIcon from '@mui/icons-material/ListAlt';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { NotificationProvider } from './context/NotificationContext';
import { AllNotifications } from './pages/AllNotifications';
import { PriorityInbox } from './pages/PriorityInbox';
import { ErrorBoundary } from './components/ErrorBoundary';
import { loggingMiddleware } from './middleware/loggingMiddleware';

const drawerWidth = 240;

// Reusable Route Change Logger (Logging Middleware)
const RouteChangeLogger: React.FC = () => {
  const location = useLocation();
  const [prevPath, setPrevPath] = useState(location.pathname);

  useEffect(() => {
    if (prevPath !== location.pathname) {
      loggingMiddleware.logRouteChange(prevPath, location.pathname);
      setPrevPath(location.pathname);
    }
  }, [location, prevPath]);

  return null;
};

// Custom dark modern theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00e5ff', // cyan
    },
    secondary: {
      main: '#e91e63', // pink
    },
    background: {
      default: '#0a0e17', // dark navy blue
      paper: '#121824',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0a0e17 0%, #161f38 100%)',
          minHeight: '100vh',
          backgroundAttachment: 'fixed',
        },
      },
    },
  },
});

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    loggingMiddleware.logClick('mobile-drawer-toggle-btn');
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: '#00e5ff', letterSpacing: 0.5 }}>
          Afford Medical
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
      <List sx={{ px: 1.5, py: 2 }}>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            component={Link}
            to="/"
            onClick={() => {
              if (isMobile) setMobileOpen(false);
              loggingMiddleware.logClick('nav-all-notifications-btn');
            }}
            sx={{
              borderRadius: '8px',
              '&:hover': { background: 'rgba(0, 229, 255, 0.08)' },
              '&.Mui-selected': { background: 'rgba(0, 229, 255, 0.15)' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ListAltIcon sx={{ color: '#00e5ff' }} />
            </ListItemIcon>
            <ListItemText primary="All Notifications" primaryTypographyProps={{ fontWeight: '500' }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/priority"
            onClick={() => {
              if (isMobile) setMobileOpen(false);
              loggingMiddleware.logClick('nav-priority-inbox-btn');
            }}
            sx={{
              borderRadius: '8px',
              '&:hover': { background: 'rgba(0, 229, 255, 0.08)' },
              '&.Mui-selected': { background: 'rgba(0, 229, 255, 0.15)' }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <StarBorderIcon sx={{ color: '#ffb74d' }} />
            </ListItemIcon>
            <ListItemText primary="Priority Inbox" primaryTypographyProps={{ fontWeight: '500' }} />
          </ListItemButton>
        </ListItem>
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.3)' }}>
          Assessment v1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <HashRouter>
          <RouteChangeLogger />
          <Box sx={{ display: 'flex' }}>
            <AppBar
              position="fixed"
              sx={{
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                ml: { sm: `${drawerWidth}px` },
                background: 'rgba(10, 14, 23, 0.7)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                boxShadow: 'none',
              }}
            >
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: 'none' } }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" noWrap component="div" fontWeight="bold">
                  Notification Center
                </Typography>
              </Toolbar>
            </AppBar>
            <Box
              component="nav"
              sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
              aria-label="mailbox folders"
            >
              <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                  display: { xs: 'block', sm: 'none' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, background: '#121824', borderRight: '1px solid rgba(255,255,255,0.08)' },
                }}
              >
                {drawer}
              </Drawer>
              <Drawer
                variant="permanent"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, background: '#121824', borderRight: '1px solid rgba(255,255,255,0.08)' },
                }}
                open
              >
                {drawer}
              </Drawer>
            </Box>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                minHeight: '100vh',
                mt: '64px',
              }}
            >
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<AllNotifications />} />
                  <Route path="/priority" element={<PriorityInbox />} />
                </Routes>
              </ErrorBoundary>
            </Box>
          </Box>
        </HashRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
}
