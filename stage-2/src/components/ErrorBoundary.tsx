import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Logger } from '../utils/logger';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Logger.error('ErrorBoundary caught an unhandled error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack
    });
  }

  private handleReset = () => {
    Logger.clickEvent('error-boundary-reset-btn');
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '80vh',
              textAlign: 'center',
              gap: 3
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 80, color: 'error.main' }} />
            <Typography variant="h4" color="text.primary" fontWeight="bold">
              Something went wrong.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleReset}
              sx={{
                borderRadius: '8px',
                px: 4,
                py: 1.5,
                background: 'linear-gradient(45deg, #0ea5e9, #0d9488)',
                color: '#ffffff',
                fontWeight: 'bold',
                boxShadow: '0 4px 20px rgba(14, 165, 233, 0.3)'
              }}
            >
              Reload Application
            </Button>
          </Box>
        </Container>
      );
    }

    return this.props.children;
  }
}
