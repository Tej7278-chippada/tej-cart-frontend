import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert, useMediaQuery, ThemeProvider, createTheme, CircularProgress } from '@mui/material';
import axios from 'axios';
import Layout from './Layout';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm')); // Media query for small screens
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate username and password
    const usernameRegex = /^[A-Z][A-Za-z0-9@_-]{5,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*@).{8,}$/;

    if (!usernameRegex.test(username)) {
      setError(
        'Username must start with a capital letter, be at least 6 characters long, contain at least one number, and can include @ _ - and spaces not allowed.'
      );
      setLoading(false);
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters long, contain at least one letter, one number, and include @.'
      );
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Password and confirm password does not match.');
      setLoading(false);
      return;
    }

    try {                             // 'http://localhost:5002/api/auth/register' 'https://tej-chat-app-8cd7e70052a5.herokuapp.com/api/auth/register'
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, { username, password, phone, email });
      setSuccess(`Your new account has been created with username ${username} and linked to email ${email}`);
      setUsername('');
      setEmail('');
      setPhone('');
      setPassword('');
      setConfirmPassword('');
      if (response.status === 201) {
        // window.location.href = '/';
      }
    } catch (error) {
      setError(error.response.data.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
    <Layout>
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="70vh"
    padding={isMobile ? 2 : 4} // Adjust padding for mobile
    >
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleRegister} style={{ maxWidth: '400px', width: '100%' }}>
        <TextField
          label="Username (Format ex: Abc1234)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Phone" fullWidth margin="normal" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Confirm Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Register'}
        </Button>
        <Typography variant="body2" align="center" style={{ marginTop: '10px' }}>
          Already have an account?{' '}
          <Button href="/" variant="text">
            Login
          </Button>
        </Typography>
      </form>
    </Box>
    </Layout>
    </ThemeProvider>
  );
};

export default Register;
