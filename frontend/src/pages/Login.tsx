import React, { useState } from 'react';
import { Typography, TextField, Button, Box, Alert } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const { control, handleSubmit } = useForm();
  const { login } = useAuth();
  const [error, setError] = useState('');

  const onSubmit = (data: any) => {
    // Mock login for now
    if (data.email === 'test@agrolink.com' && data.password === 'password') {
      login('mock-jwt-token', { id: '1', name: 'Test User', email: data.email, role: 'ADMIN' });
    } else {
      setError('Invalid email or password. Use test@agrolink.com / password');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Typography variant="h5" align="center" gutterBottom>
        Login to AgroLink
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Controller
        name="email"
        control={control}
        defaultValue=""
        rules={{ required: 'Email is required' }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            autoComplete="email"
            autoFocus
            error={!!error}
            helperText={error ? error.message : null}
          />
        )}
      />
      <Controller
        name="password"
        control={control}
        defaultValue=""
        rules={{ required: 'Password is required' }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            error={!!error}
            helperText={error ? error.message : null}
          />
        )}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign In
      </Button>
    </Box>
  );
};

export default Login;
