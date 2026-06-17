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
      main: '#0ea5e9', // Sky blue - highly professional & modern corporate accent
    },
    secondary: {
      main: '#0d9488', // Teal
    },
    background: {
      default: '#0f172a', // Slate 900 - sleek dark mode base
      paper: '#1e293b',   // Slate 800 - distinct card base
    },
    text: {
      primary: '#f8fafc', // slate-50 (off-white)
      secondary: '#94a3b8', // slate-400 (cool gray)
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          minHeight: '100vh',
          backgroundAttachment: 'fixed',
        },
      },
    },
  },
});

const NavigationLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    loggingMiddleware.logClick('mobile-drawer-toggle-btn');
    setMobileOpen(!mobileOpen);
  };

  const isAllSelected = location.pathname === '/' || location.pathname === '';
  const isPrioritySelected = location.pathname === '/priority';

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: '#0ea5e9', letterSpacing: 0.5 }}>
          Afford Medical
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
      <List sx={{ px: 1.5, py: 2 }}>
        <ListItem disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            component={Link}
            to="/"
            selected={isAllSelected}
            onClick={() => {
              if (isMobile) setMobileOpen(false);
              loggingMiddleware.logClick('nav-all-notifications-btn');
            }}
            sx={{
              borderRadius: '8px',
              '&:hover': { background: 'rgba(14, 165, 233, 0.08)' },
              '&.Mui-selected': { 
                background: 'rgba(14, 165, 233, 0.15)',
                color: '#0ea5e9',
                '& .MuiListItemIcon-root': { color: '#0ea5e9' }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ListAltIcon sx={{ color: isAllSelected ? '#0ea5e9' : 'text.secondary' }} />
            </ListItemIcon>
            <ListItemText primary="All Notifications" primaryTypographyProps={{ fontWeight: isAllSelected ? '600' : '500' }} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/priority"
            selected={isPrioritySelected}
            onClick={() => {
              if (isMobile) setMobileOpen(false);
              loggingMiddleware.logClick('nav-priority-inbox-btn');
            }}
            sx={{
              borderRadius: '8px',
              '&:hover': { background: 'rgba(250, 180, 77, 0.08)' },
              '&.Mui-selected': { 
                background: 'rgba(250, 180, 77, 0.15)',
                color: '#ffb74d',
                '& .MuiListItemIcon-root': { color: '#ffb74d' }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <StarBorderIcon sx={{ color: isPrioritySelected ? '#ffb74d' : 'text.secondary' }} />
            </ListItemIcon>
            <ListItemText primary="Priority Inbox" primaryTypographyProps={{ fontWeight: isPrioritySelected ? '600' : '500' }} />
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
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'rgba(15, 23, 42, 0.8)',
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
          <Typography variant="h6" noWrap component="div" fontWeight="bold" sx={{ letterSpacing: 0.5 }}>
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
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, background: '#0b0f19', borderRight: '1px solid rgba(255,255,255,0.06)' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, background: '#0b0f19', borderRight: '1px solid rgba(255,255,255,0.06)' },
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
          p: { xs: 2, sm: 3 },
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
  );
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <HashRouter>
          <RouteChangeLogger />
          <NavigationLayout />
        </HashRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
}
