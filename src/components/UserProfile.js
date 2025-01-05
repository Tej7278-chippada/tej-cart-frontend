// SellerProfile Component
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import {
  Box,
  Typography,
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
  List,
  ListItem,
  ListItemText,
  Card,
  TextField,
} from '@mui/material';
// import API from '../../api/sellerApi';
// import SellerLayout from './SellerLayout';
import { useTheme } from '@emotion/react';
import API from '../api/sellerApi';
import Layout from './Layout';
import SkeletonProductDetail from './Products/SkeletonProductDetail';
import { addDeliveryAddresses } from '../api/api';
// import SkeletonProductDetail from '../Products/SkeletonProductDetail';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';

const UserProfile = () => {
  const { id } = useParams(); // Extract sellerId from URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [deliveryAddresses, setDeliveryAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    email: "",
    street: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [addressAddedMessage, setAddressAddedMessage] = useState('');
  const [addressFailedMessage, setAddressFailedMessage] = useState('');
  const [isAddAddressBoxOpen, setIsAddAddressBoxOpen] = useState(false); // to toggle the Add Address button
  const [isDeliveryAddressBoxOpen, setIsDeliveryAddressBoxOpen] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await API.get(`/api/auth/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUserData(response.data);
        const addresses = response.data.deliveryAddresses || [];
        // Sort addresses by `createdAt` in descending order
        setDeliveryAddresses(addresses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
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

  const handleAddAddress = async () => {
    try {
      const addressPayload = {
        name: newAddress.name,
        phone: newAddress.phone,
        email: newAddress.email,
        address: {
          street: newAddress.street,
          area: newAddress.area,
          city: newAddress.city,
          state: newAddress.state,
          pincode: newAddress.pincode,
        },
      };

      const response = await addDeliveryAddresses(addressPayload);
      const updatedAddresses = response.deliveryAddresses;
      // Sort addresses to ensure latest one is on top
      setDeliveryAddresses(updatedAddresses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setNewAddress({   // Clear input fields and close the box
        name: "",
        phone: "",
        email: "",
        street: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
      });
      setAddressAddedMessage('Address added successfully!');
      setIsAddAddressBoxOpen(false);
    } catch (error) {
      setAddressFailedMessage('Failed to add address. Please try again later.');
      console.error('Error adding address:', error);
    }
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
          <Typography variant="h5" style={{ flexGrow: 1, margin: '10px' }} gutterBottom>
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
                  sx={{ width: 'fit-content', height: 'auto', borderRadius: '16px' }}
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
              scrollbarWidth: 'thin', padding: '1rem',
              position: 'relative', // To enable absolute positioning of the button
              // height: 'calc(100vh - 16px)', // Adjust height as needed
            }}>
              <Box flex={isMobile ? "1" : "0 0 70%"} mb={6}>
                <Grid container spacing={2}>

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
                </Grid>
              </Box>
              <Toolbar sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                // bgcolor: 'white', borderRadius:'16px',
                // boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1rem',
              }}>
                <Box style={{ display: 'flex', flexGrow: 1, }}>
                  <Button
                    variant="contained" size="small"
                    onClick={() => setIsDeliveryAddressBoxOpen((prev) => !prev)}
                  >
                    {isDeliveryAddressBoxOpen ? 'Close Delivery Addresses' : 'Show Delivery Addresses'}
                  </Button>
                </Box>
                <Box >
                  <IconButton
                    onClick={handleOpenDeleteDialog}
                    onMouseEnter={() => setHoveredId(userData._id)} // Set hoveredId to the current button's ID
                    onMouseLeave={() => setHoveredId(null)} // Reset hoveredId when mouse leaves
                    style={{

                      backgroundColor: hoveredId === userData._id ? '#ffe6e6' : 'rgba(255, 255, 255, 0.2)',
                      borderRadius: hoveredId === userData._id ? '6px' : '50%',
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
                          opacity: hoveredId === userData._id ? 1 : 0,
                          transform: hoveredId === userData._id ? 'translateX(0)' : 'translateX(10px)',
                          transition: 'opacity 0.3s, transform 0.3s',
                        }}
                      >
                        Delete User Account
                      </span>
                    )}
                    <DeleteForeverRoundedIcon />
                  </IconButton>
                </Box>
              </Toolbar>
            </Box>
          </Box>


          {isDeliveryAddressBoxOpen && (
            <Card sx={{ padding: `${isMobile ? '4px' : '1rem'}`, marginTop: '1rem', marginBottom: '1rem', bgcolor: '#f5f5f5', borderRadius: '8px' }}>
              <Box mb={2}>
                <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <Button
                    variant="contained"
                    onClick={() => setIsAddAddressBoxOpen((prev) => !prev)}
                    sx={{ mt: 0, mb: 1, mr: 1 }}
                  >
                    Add New Address
                  </Button>
                </Box>
                {isAddAddressBoxOpen && (
                  <Card sx={{ borderRadius: '16px', marginBottom: '2rem' }}>
                    <Box my={2} p={2} >
                      <Typography variant="h6" marginInline={1} mb={2}>Add New Delivery Address</Typography>
                      <Grid container spacing={2}>
                        {["name", "phone", "email", "street", "area", "city", "state", "pincode"].map(
                          (field) => (
                            <Grid item xs={12} sm={6} key={field}>
                              <TextField
                                label={field.charAt(0).toUpperCase() + field.slice(1)}
                                fullWidth
                                value={newAddress[field] || ""}
                                onChange={(e) =>
                                  setNewAddress({ ...newAddress, [field]: e.target.value })
                                }
                              />
                            </Grid>
                          )
                        )}
                      </Grid>

                      <Button
                        variant="contained"
                        onClick={handleAddAddress}
                        sx={{ mt: 2, mb: 2, float: "right", minWidth: '150px' }}
                      >
                        Submit
                      </Button>
                      <Button
                        variant="text"
                        onClick={() => setIsAddAddressBoxOpen(false)}
                        sx={{ mt: 2, mb: 2, mr: 1, float: "right", minWidth: '80px' }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Card>
                )}
                {addressAddedMessage && <Snackbar open={true} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={6000} onClose={() => setAddressAddedMessage('')}>
                  <Alert severity="success">{addressAddedMessage}</Alert>
                </Snackbar>}
                {addressFailedMessage && <Snackbar open={true} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={6000} onClose={() => setAddressFailedMessage('')}>
                  <Alert severity="error">{addressFailedMessage}</Alert>
                </Snackbar>}
                <Box>
                  <Typography variant="h6" sx={{ mt: 1, ml: 1 }}>Delivery Addresses</Typography>
                  <Grid container spacing={1}>
                    {deliveryAddresses.map((deliveryAddress, index) => (
                      <Grid item key={index} xs={12} sm={6} md={4} >
                        <List sx={{ height: "100%", width: "100%" }}>
                          <ListItem
                            key={index}
                            button="true"
                            selected={selectedAddress === deliveryAddress}
                            onClick={() => setSelectedAddress(deliveryAddress)}
                            sx={{
                              border: selectedAddress === deliveryAddress ? "2px solid blue" : "1px solid lightgray",
                              borderRadius: 2,
                              mb: 0,
                              flexDirection: "column", // column for desktop, row for mobile to align text on middle
                              height: "100%", // Make the ListItem fill the grid cell height
                            }}
                          >
                            <ListItemText
                              primary={
                                <>{`${deliveryAddress.name}, ${deliveryAddress.phone}, ${deliveryAddress.email}`}
                                  <br />
                                  {`${deliveryAddress.address.street}, ${deliveryAddress.address.area}, ${deliveryAddress.address.city}, ${deliveryAddress.address.state}, ${deliveryAddress.address.pincode}`}
                                </>}
                              secondary={
                                <>

                                  <br />
                                  <Typography sx={{ display: 'inline-block', float: 'right' }}>
                                    Added on: {new Date(deliveryAddress.createdAt).toLocaleString()} {/* toLocaleDateString for displaying date only */}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                        </List>
                      </Grid>
                    ))}
                  </Grid>

                </Box>
              </Box>
            </Card>
          )}
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
        <DialogContent style={{ padding: '2rem' }}>
          <Typography color='error'>
            This action cannot be undone. If you proceed, all your account's data will be removed permanently...
          </Typography>
        </DialogContent>
        <DialogActions style={{ padding: '1rem' }}>
          <Button onClick={handleDeleteAccount} variant='contained' color="error" style={{ marginRight: '10px' }}>
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
