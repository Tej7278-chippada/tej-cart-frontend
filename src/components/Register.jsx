import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert, useMediaQuery, ThemeProvider, createTheme, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import Layout from './Layout';
import Cropper from 'react-easy-crop';

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
  const [profilePic, setProfilePic] = useState(null); // State for profile picture
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropDialog, setCropDialog] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);


  const handleCropComplete = async (_, croppedAreaPixels) => {
    if (!profilePic) return; // Ensure profilePic is set before proceeding
    const canvas = document.createElement('canvas');
    const image = new Image();
    // Create an object URL for the image file
    const objectURL = URL.createObjectURL(profilePic);
    image.src = objectURL;
    image.onload = () => {
      const ctx = canvas.getContext('2d');
      const { width, height } = croppedAreaPixels;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        width,
        height,
        0,
        0,
        width,
        height
      );
      canvas.toBlob((blob) => {
        // Check if the blob is a valid object before creating a URL
        if (blob) {
          setCroppedImage(URL.createObjectURL(blob));
        }
      });
    };
  };

  const handleReplaceImage = () => {
    setCroppedImage(null);
    setProfilePic(null);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setCroppedImage(null);

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

    // Email validation
    if (!email.includes('@') || !email.endsWith('.com')) {
      setError('Invalid mail id.');
      setLoading(false);
      return;
    }

    // Phone validation
    if (phone.length < 10 || !/^\d+$/.test(phone)) {
      setError('Invalid mobile number.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('email', email);
      formData.append('phone', phone);
      if (profilePic) formData.append('profilePic', profilePic);

    try {                             // 'http://localhost:5002/api/auth/register' 'https://tej-chat-app-8cd7e70052a5.herokuapp.com/api/auth/register'
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      setSuccess(`Your new account has been created with username ${username} and linked to email ${email}`);
      setUsername('');
      setProfilePic(null);
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
      <Box textAlign="center" paddingTop={4} mb={2} >
      {croppedImage ? (
              <div>
              <img
                src={croppedImage}
                alt="Cropped Profile"
                style={{ width: '180px', height: '180px', borderRadius: '50%', cursor: 'pointer' }}
                onClick={() => setCropDialog(true)}
              />
              <Typography variant="body2">Your Profile Pic</Typography>
              </div>
            ) : (
              <div>
              <img
                src="https://placehold.co/400?text=Add+Photo"
                alt="Dummy Profile"
                style={{ width: '180px', height: '180px', borderRadius: '50%', cursor: 'pointer' }}
                onClick={() => setCropDialog(true)}
              />
              <Typography variant="body2">Add Profile Pic</Typography>
              </div>
            )}
            {/* <Typography variant="body2">Profile Pic</Typography> */}
            </Box>
            <Dialog open={cropDialog} onClose={() => setCropDialog(false)} fullWidth maxWidth="sm">
              <DialogTitle>Crop and Upload Picture</DialogTitle>
              <DialogContent sx={{minHeight:'250px'}}>
                <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePic(e.target.files[0])}
                style={{ marginTop: 10 }}
              />
              {profilePic ? (
                <Cropper
                  image={URL.createObjectURL(profilePic)}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                />
              ) : (
                <Typography variant="body2" textAlign="center">
                  Please select an image to upload.
                </Typography>
              )}

              
              </DialogContent>
              <DialogActions>
              {croppedImage && (
                <Button color="secondary" onClick={handleReplaceImage}>
                  Delete
                </Button>
              )}
              <Button onClick={() => setCropDialog(false)}>Cancel</Button>
              <Button variant="contained"
                onClick={() => {
                  setCropDialog(false);
                }}
                disabled={!croppedImage}
              >
                Save
              </Button>
              </DialogActions>
            </Dialog>
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
