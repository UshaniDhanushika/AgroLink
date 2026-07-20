import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import WarningIcon from '@mui/icons-material/Warning';

interface ErrorPageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ 
  title = 'Oops! Something went wrong.', 
  message = 'We encountered an unexpected error. Please try again later.',
  onRetry 
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        p: 3,
      }}
    >
      <WarningIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {message}
      </Typography>
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        {onRetry && (
          <Button variant="contained" color="primary" onClick={onRetry}>
            Retry
          </Button>
        )}
        <Button variant="outlined" onClick={() => navigate('/')}>
          Go to Home
        </Button>
      </Box>
    </Box>
  );
};

export default ErrorPage;
