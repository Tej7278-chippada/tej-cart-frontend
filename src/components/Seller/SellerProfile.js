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
// import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import ShoppingCartCheckoutRoundedIcon from '@mui/icons-material/ShoppingCartCheckoutRounded';
import ProductionQuantityLimitsRoundedIcon from '@mui/icons-material/ProductionQuantityLimitsRounded';
import API from '../../api/sellerApi';
import SellerLayout from './SellerLayout';
import { useTheme } from '@emotion/react';
import SkeletonProductDetail from '../Products/SkeletonProductDetail';

const SellerProfile = () => {
  const { id } = useParams(); // Extract sellerId from URL
  const [sellerData, setSellerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchSellerDetails = async () => {
      try {
        const authTokenSeller = localStorage.getItem('authTokenSeller');
        const response = await API.get(`/api/seller/${id}`, {
          headers: { Authorization: `Bearer ${authTokenSeller}` },
        });
        setSellerData(response.data);
      } catch (err) {
        setError('Failed to fetch seller details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSellerDetails();
  }, [id]);

  const handleDeleteAccount = async () => {
    // if (!window.confirm('Are you sure you want to delete your account permanently?')) return;

    try {
      const authTokenSeller = localStorage.getItem('authTokenSeller');
      await API.delete(`/api/seller/${id}`, {
        headers: { Authorization: `Bearer ${authTokenSeller}` },
      });

      // alert('Your account has been deleted successfully.');
      setSuccessMessage('Your account has been deleted successfully.');
      localStorage.clear();
      navigate('/sellerLogin');
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

  const toSellerProducts = () => {
    navigate('/sellerProducts'); //, { replace: true }
  };

  const toSellerOrders = () => {
    navigate('/sellerOrders'); //, { replace: true }
  };

  // if (loading) return <CircularProgress />;
  if (loading || !sellerData) {
    return (
      <SellerLayout>
        {/* <SkeletonCards /> */}
        <SkeletonProductDetail />
      </SellerLayout>
    );
  };
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <SellerLayout>
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
    <div  style={{
          padding: `${isMobile ? "4px" : "8px"}`,
          // position: 'relative',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px', scrollbarWidth: 'thin'
        }}>
         
      <Toolbar style={{marginInline:`${isMobile} ? '-8px' : '-10px'`}} >
        <Typography variant="h5" style={{ flexGrow: 1 }} gutterBottom>
          Seller Profile
        </Typography>
        <Button
          variant="contained"
          onClick={() => toSellerOrders()}
          sx={{
            backgroundColor: '#1976d2', // Primary blue
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              backgroundColor: '#1565c0', // Darker shade on hover
            },
            display: 'flex',
            alignItems: 'center',
            gap: '8px', marginRight: '10px', 
          }}
        >
          <ProductionQuantityLimitsRoundedIcon sx={{ fontSize: '20px' }} />
          <Link  style={{ color: 'white', textDecoration: 'none',  }}>Orders</Link>
          {/* <span style={{ fontSize: '14px', fontWeight: '500' }}>My Products</span> */}
        </Button>
        <Button
          variant="contained"
          onClick={() => toSellerProducts()}
          sx={{
            backgroundColor: '#1976d2', // Primary blue
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              backgroundColor: '#1565c0', // Darker shade on hover
            },
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <ShoppingCartCheckoutRoundedIcon sx={{ fontSize: '20px'  }} />
          <Link  style={{ color: 'white', textDecoration: 'none',  }}>Products</Link>
          {/* <span style={{ fontSize: '14px', fontWeight: '500' }}>My Products</span> */}
        </Button>
      </Toolbar>
      <Box display="flex" flexDirection={isMobile ? "column" : "row"} gap={2} sx={{ bgcolor: '#f5f5f5', borderRadius: '10px', padding: '6px', paddingBottom: '10px', paddingTop: '10px' }} >
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
                  alt={sellerData.username}
                  src={
                    sellerData.profilePic
                      ? `data:image/jpeg;base64,${sellerData.profilePic}`
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
              <Grid item xs={12}>
                <Typography variant="h4" style={{
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  color: '#333'
                }}>
                  {sellerData.sellerTitle}
                </Typography>

              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  Seller Id:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {sellerData.sellerId}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  Seller Id:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {sellerData._id}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  Seller Name:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {sellerData.username}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  Seller Phone:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {sellerData.phone}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  Seller Email:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {sellerData.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  Seller Address:
                </Typography>
                <Typography variant="body2" color="textSecondary">
                {`${sellerData.address.street}, ${sellerData.address.area}, ${sellerData.address.city}, ${sellerData.address.state} - ${sellerData.address.pincode}`}
                </Typography>
              </Grid>
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
        <IconButton
            onClick={handleOpenDeleteDialog}
          onMouseEnter={() => setHoveredId(sellerData._id)} // Set hoveredId to the current button's ID
          onMouseLeave={() => setHoveredId(null)} // Reset hoveredId when mouse leaves
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '8px',
            backgroundColor: hoveredId === sellerData._id ? '#ffe6e6' : 'rgba(255, 255, 255, 0.2)',
            borderRadius: hoveredId === sellerData._id ? '6px' : '50%',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center', color: 'red'
            // transition: 'all 0.2s ease',
          }}
        >
          {hoveredId && (
            <span
              style={{
                fontSize: '14px',
                color: '#ff0000',
                marginRight: '8px',
                whiteSpace: 'nowrap',
                opacity: hoveredId === sellerData._id ? 1 : 0,
                transform: hoveredId === sellerData._id ? 'translateX(0)' : 'translateX(10px)',
                transition: 'opacity 0.3s, transform 0.3s',
              }}
            >
              Delete Seller Account
            </span>
          )}
          <DeleteForeverRoundedIcon />
        </IconButton>
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
            This action cannot be undone. If you proceed, all your account data and products will be removed permanently...
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
    </SellerLayout>
  );
};

export default SellerProfile;
