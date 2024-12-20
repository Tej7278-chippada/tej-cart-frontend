// components/Seller/SellerRegister.js
import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert, useMediaQuery, ThemeProvider, createTheme, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material';
import axios from 'axios';
import SellerLayout from './SellerLayout';
// import Layout from './Layout';
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

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", 
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", 
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", 
  "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Lakshadweep", "Puducherry"
];

const SellerRegister = () => {
  const [username, setUsername] = useState('');
  const [profilePic, setProfilePic] = useState(null); // State for profile picture
  const [croppedImage, setCroppedImage] = useState(null);
  const [sellerTitle, setSellerTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState({ street: '', area: '', city: '', state: '', pincode: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm')); // Media query for small screens
  const [loading, setLoading] = useState(false);
  const [pincodeValidation, setPincodeValidation] = useState('');
  const [cropDialog, setCropDialog] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  // const [croppedArea, setCroppedArea] = useState(null);


  const handleAddressChange = (field, value) => {
    setAddress((prevAddress) => ({ ...prevAddress, [field]: value }));
  };

  const validatePincode = async (pincode) => {
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      if (response.data[0].Status === 'Success') {
        const place = response.data[0].PostOffice[0].Name;
        const state = response.data[0].PostOffice[0].State;
        const district = response.data[0].PostOffice[0].District;
        setPincodeValidation(`Matched: ${place}`);
        handleAddressChange('state', state);
        handleAddressChange('city', district);
        handleAddressChange('area', place);
      } else {
        setPincodeValidation('Pincode doesn\'t match. Please verify it once.');
      }
    } catch {
      setPincodeValidation('Error validating pincode.');
    }
  };

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
    setPincodeValidation(''); // Reset pincode validation message
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

    if (Object.values(address).some((field) => field.trim() === '')) {
        setError('All address fields (street, area, city, state, pincode) are required.');
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('username', username);
      formData.append('sellerTitle', sellerTitle);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('password', password);
      formData.append('address', JSON.stringify(address));
      if (profilePic) formData.append('profilePic', profilePic);

    try {                             // 'http://localhost:5002/api/auth/register' 'https://tej-chat-app-8cd7e70052a5.herokuapp.com/api/auth/register'
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/seller/sellerRegister`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      setSuccess(`Your new account has been created with username ${username} and linked to email ${email}`);
      setUsername('');
      setProfilePic(null);
      setSellerTitle('');
      setEmail('');
      setPhone('');
      setPassword('');
      setConfirmPassword('');
      setAddress({ street: '', area: '', city: '', state: '', pincode: '' });
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
    <SellerLayout>
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="70vh"
    padding={isMobile ? 2 : 4} // Adjust padding for mobile
    >
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
       Seller Registration
      </Typography>
      <form onSubmit={handleRegister} style={{ maxWidth: '400px', width: '100%' }}>
      <Box textAlign="center" paddingTop={4} mb={2} >
      {croppedImage ? (
              <img
                src={croppedImage}
                alt="Cropped Profile"
                style={{ width: '100px', height: '100px', borderRadius: '50%', cursor: 'pointer' }}
                onClick={() => setCropDialog(true)}
              />
            ) : (
              <img
                src="https://via.placeholder.com/100"
                alt="Dummy Profile"
                style={{ width: '100px', height: '100px', borderRadius: '50%', cursor: 'pointer' }}
                onClick={() => setCropDialog(true)}
              />
            )}
            <Typography variant="body2">Profile Pic</Typography>
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
        <TextField
          label="Seller Title (Format ex: Shop Name)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={sellerTitle}
          onChange={(e) => setSellerTitle(e.target.value)}
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
        <TextField
              label="Street"
              variant="outlined"
              fullWidth
              margin="normal"
              value={address.street}
              onChange={(e) => handleAddressChange('street', e.target.value)}
            />
            <TextField
              label="Area"
              variant="outlined"
              fullWidth
              margin="normal"
              value={address.area}
              onChange={(e) => handleAddressChange('area', e.target.value)}
            />
            <TextField
              label="City"
              variant="outlined"
              fullWidth
              margin="normal"
              value={address.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
            />
            <TextField
              label="Pincode"
              fullWidth
              margin="normal"
              value={address.pincode}
              onChange={(e) => {
                handleAddressChange('pincode', e.target.value);
                validatePincode(e.target.value);
              }}
            />
            {pincodeValidation && <Typography variant="body2">{pincodeValidation}</Typography>}
            <TextField
              select
              label="State"
              fullWidth
              margin="normal"
              value={address.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
            >
              {indianStates.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </TextField>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Register'}
        </Button>
        <Typography variant="body2" align="center" style={{ marginTop: '10px' }}>
          Already have an account?{' '}
          <Button href="/sellerLogin" variant="text">
            Seller Login
          </Button>
        </Typography>
      </form>
    </Box>
    </SellerLayout>
    </ThemeProvider>
  );
};

export default SellerRegister;
