// src/components/ProductDetailID.js
import React, { useEffect, useState } from 'react';
import { Typography, CardMedia, IconButton, Grid, Box, useMediaQuery, Snackbar, Alert, Avatar } from '@mui/material';
import { fetchOrderById } from '../../api/api';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../Layout';
import { useTheme } from '@emotion/react';
import SkeletonProductDetail from './SkeletonProductDetail';
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';

function OrderDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [ order, setOrder ] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const authToken = localStorage.getItem('authToken');
        setIsAuthenticated(!!authToken); // Check if user is authenticated

        const response = await fetchOrderById(id);
        setOrder({
          ...response.data,
        });
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
    setLoading(false);
  }, [order,id]); 

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };


  if (loading || !order) {
    return (
      <Layout>
        <SkeletonProductDetail />
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>

        <div style={{
          padding: '8px',
          // position: 'relative',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px', scrollbarWidth: 'thin'
        }}>
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            gap={2} sx={{ bgcolor: '#f5f5f5', borderRadius: '10px', padding: '6px', paddingBottom: '10px', paddingTop: '10px' }}
          >
            <Box sx={{
              flex: 2,
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

                {/* Media section */}
                {/* Media section with click to zoom */}
                <CardMedia>
                  <div style={{
                    display: 'flex',
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    scrollbarColor: '#888 transparent',
                    // borderRadius: '8px',
                    gap: '1rem', 
                    // height: '300px',
                  }}>
                    
                    {order.productPic ? (
                      <Avatar
                        src={`data:image/jpeg;base64,${order.productPic}`} // Render the image
                        alt={order.productTitle}
                        sx={{ width: 210, height: 260, margin: 0, borderRadius: '10px' }}
                      />
                    ) : (
                      <Typography variant="body2" color="grey" align="center" marginLeft="1rem" marginTop="1rem" gutterBottom>
                        No Product Image available
                      </Typography>
                    )}
                    <IconButton
                  onClick={(event) => {
                    event.stopPropagation(); // Prevent triggering the parent onClick
                    navigate(`/product/${order.product}`)
                  }}
                  onMouseEnter={() => setHoveredId(order._id)} // Set hoveredId to the current button's ID
                  onMouseLeave={() => setHoveredId(null)} // Reset hoveredId when mouse leaves
                  style={{
                    position: 'relative', float:'right', 
                    bottom: '6px', marginTop: '1rem',
                    right: '8px',
                    backgroundColor: hoveredId === order._id ? '#ffe6e6' : 'rgba(255, 255, 255, 0.2)',
                    borderRadius: hoveredId === order._id ? '16px' : '16px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center', color: 'red'
                    // transition: 'all 0.2s ease',
                  }}
                >
                  {hoveredId === order._id && (
                    <span
                      style={{
                        fontSize: '14px', marginLeft:'16px',
                        color: '#ff0000',
                        marginRight: '8px',
                        whiteSpace: 'nowrap',
                        opacity: hoveredId === order._id ? 1 : 0,
                        transform: hoveredId === order._id ? 'translateX(0)' : 'translateX(10px)',
                        transition: 'opacity 0.3s, transform 0.3s',
                      }}
                    >
                      See Product Details
                    </span>
                  )}
                  <LocalMallRoundedIcon />
                </IconButton>
                    
                  </div>
                  
                </CardMedia>
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

                {/* Product Details */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h4" style={{
                      fontWeight: 'bold',
                      marginBottom: '0.5rem',
                      color: '#333'
                    }}>
                      {order.productTitle}
                    </Typography>

                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      Order Status:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                    {order.paymentStatus}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      Order Price:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      ₹{order.orderPrice}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      Ordered on:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(order.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      Delivery Address Details:
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                      Name: {order.userDeliveryAddresses[0]?.name || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                      Phone: {order.userDeliveryAddresses[0]?.phone || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                      Email: {order.userDeliveryAddresses[0]?.email || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                      Address: {`${order.userDeliveryAddresses[0]?.address.street || "N/A"}, ${order.userDeliveryAddresses[0]?.address.area || "N/A"}, ${order.userDeliveryAddresses[0]?.address.city || "N/A"}`},
                      <br/> {`${order.userDeliveryAddresses[0]?.address.state || "N/A"} - ${order.userDeliveryAddresses[0]?.address.pincode || "N/A"}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      Seller Title:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                    {order.sellerTitle}
                    </Typography>
                  </Grid>
                </Grid>
              </Box></Box>
          </Box>

        </div>
        <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      </Box>
    </Layout>
  );
}

export default OrderDetails;
