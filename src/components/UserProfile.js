// SellerProfile Component
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Avatar,
  IconButton,
  Alert,
  useMediaQuery,
  Grid,
  Button,
  Toolbar,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ProductionQuantityLimitsRoundedIcon from '@mui/icons-material/ProductionQuantityLimitsRounded';
// import API from '../../api/sellerApi';
// import SellerLayout from './SellerLayout';
import { useTheme } from '@emotion/react';
import API from '../api/sellerApi';
import Layout from './Layout';
import SkeletonProductDetail from './Products/SkeletonProductDetail';
// import SkeletonProductDetail from '../Products/SkeletonProductDetail';

const UserProfile = () => {
  const { id } = useParams(); // Extract sellerId from URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await API.get(`/api/auth/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUserData(response.data);
      } catch (err) {
        setError('Failed to fetch User details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleDeleteAccount = async () => {
    // if (!window.confirm('Are you sure you want to delete your account permanently?')) return;

    try {
      const authToken = localStorage.getItem('authToken');
      await API.delete(`/api/auth/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      // alert('Your account has been deleted successfully.');
      setSuccessMessage('Your account has been deleted successfully.');
      localStorage.clear();
      navigate('/');
    } catch (err) {
      setError('Failed to delete account. Please try again later.');
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  // if (loading) return <CircularProgress />;
  if (loading || !userData) {
    return (
      <Layout>
        {/* <SkeletonCards /> */}
        <SkeletonProductDetail />
      </Layout>
    );
  };
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Layout>
      <Snackbar
        open={!!successMessage}
        autoHideDuration={9000}
        onClose={() => setSuccessMessage('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>
    <Box >
    <div style={{
          padding: '8px',
          // position: 'relative',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px', scrollbarWidth: 'thin'
        }}>
          <Typography variant="h5" style={{ flexGrow: 1 }} gutterBottom>
          User Profile
        </Typography>
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        gap={2} sx={{ bgcolor: '#f5f5f5', borderRadius: '10px', padding: '6px', paddingBottom: '10px', paddingTop: '10px' }}
      >





        
        <Box sx={{
              flex: 1,
              // height: '73vh', // Fixed height relative to viewport
              overflowY: 'auto',
              // bgcolor: 'transparent', // Card background color (customizable)
              borderRadius: 3, // Card border radius (customizable)
              // boxShadow: 3, // Shadow for a modern look
              scrollbarWidth: 'thin'
            }}>
          <Box
            flex={isMobile ? "1" : "0 0 30%"}
            style={{ paddingRight: isMobile ? "0" : "0rem" }}
          >
            {/* <Avatar alt={sellerData.username} src={sellerData.profilePicUrl} sx={{ width: 80, height: 80 }} /> */}
            <Avatar
                  alt={userData.username}
                  src={
                    userData.profilePic
                      ? `data:image/jpeg;base64,${userData.profilePic}`
                      : undefined
                  }
                  sx={{ width: 'fit-content', height: 'auto', borderRadius:'16px' }}
                />
          </Box>
        </Box>


        <Box sx={{
              flex: 3,
              // height: '73vh', // Fixed height relative to viewport
              overflowY: 'auto',
              bgcolor: 'white', // Card background color (customizable)
              borderRadius: 3, // Card border radius (customizable)
              // boxShadow: 3, // Shadow for a modern look
              scrollbarWidth: 'thin', padding: '1rem'
            }}>
          <Box flex={isMobile ? "1" : "0 0 70%"}>

          {/* <Box display="flex" alignItems="center" gap={2}> */}
            {/* <Avatar alt={sellerData.username} src={sellerData.profilePicUrl} sx={{ width: 80, height: 80 }} /> */}

            <Grid container spacing={2}>
              {/* <Grid item xs={12}>
                <Typography variant="h4" style={{
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  color: '#333'
                }}>
                  {sellerData.sellerTitle}
                </Typography>

              </Grid> */}
              {/* <Grid item xs={6} sm={4}>
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  Seller Id:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {sellerData.sellerId}
                </Typography>
              </Grid> */}
              <Grid item xs={6} sm={4}>
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  User Name:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {userData.username}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  User Phone:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {userData.phone}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  User Email:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {userData.email}
                </Typography>
              </Grid>
              {/* <Grid item xs={12} sm={6}>
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  Seller Address:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                {`${sellerData.address.street}, ${sellerData.address.area}, ${sellerData.address.city}, ${sellerData.address.state} - ${sellerData.address.pincode}`}
                </Typography>
              </Grid> */}
              {/* <Box>
                <Typography variant="h5">{sellerData.sellerTitle}</Typography>
                <Typography>Seller Id: {sellerData.sellerId}</Typography>
                <Typography>User name: {sellerData.username}</Typography>
                <Typography>Email: {sellerData.email}</Typography>
                <Typography>Phone: {sellerData.phone}</Typography>
                <Typography>Address: {`${sellerData.address.street}, ${sellerData.address.area}, ${sellerData.address.city}, ${sellerData.address.state} - ${sellerData.address.pincode}`}</Typography>
              </Box> */}
            </Grid>

          </Box>
        </Box>

        



      </Box>
        {/* <Box>
        <Link to="/sellerProducts" style={{ color: 'blue', textDecoration: 'none', marginRight: '15px' }}>My Products</Link>
        </Box>

        <Box marginTop={4}>
          <IconButton color="error" onClick={handleDeleteAccount}>
            <DeleteIcon />
          </IconButton>
          <Typography variant="body2" color="error">
            Delete Account
          </Typography>
        </Box> */}
        <Box style={{
            display: 'flex',
            justifyContent: 'flex-end', // Align to the right
            marginTop: '1rem',
          }}>
        <Toolbar>
        <Button
          variant="contained"
          // onClick={handleDeleteAccount}
          sx={{
            backgroundColor: '#1976d2', // Primary blue
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '24px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              backgroundColor: '#1565c0', // Darker shade on hover
            },
            display: 'flex',
            alignItems: 'center',
            gap: '8px', marginRight: '10px'
          }}
        >
          <ProductionQuantityLimitsRoundedIcon sx={{ fontSize: '20px' }} />
          <Link to="/productList" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Products Page</Link>
          {/* <span style={{ fontSize: '14px', fontWeight: '500' }}>My Products</span> */}
        </Button>
        <Button
          variant="contained"
          onClick={handleOpenDeleteDialog}
          sx={{
            backgroundColor: '#1976d2', // Primary blue
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '24px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              backgroundColor: '#1565c0', // Darker shade on hover
            },
            display: 'flex',
            alignItems: 'center',
            gap: '8px', 
            justifyContent: 'right', // Align to the right
          }}
        >
          <DeleteIcon sx={{ fontSize: '20px' }} />
          <span style={{ fontSize: '14px', fontWeight: '500' }}>Delete Account</span>
        </Button>
        </Toolbar>
        </Box>
    </div>
    </Box>

    {/* Delete Confirmation Dialog */}
    <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title" 
      >
        <DialogTitle id="delete-dialog-title" >
          Are you sure you want to delete your account permanently?
        </DialogTitle>
        <DialogContent style={{padding:'2rem'}}>
          <Typography color='error'>
            This action cannot be undone. If you proceed, all your account's data will be removed permanently...
          </Typography>
        </DialogContent>
        <DialogActions style={{padding:'1rem'}}>
        <Button onClick={handleDeleteAccount} variant='contained' color="error" style={{marginRight:'10px'}}>
            Yes, permanently delete my account
          </Button>
          <Button onClick={handleCloseDeleteDialog} variant='outlined' color="primary">
            Cancel
          </Button>
          
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default UserProfile;
