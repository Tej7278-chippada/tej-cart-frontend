// components/Products/Orderpage.js
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, Grid, Snackbar, Alert, Stepper, Step, StepLabel, List, ListItem, ListItemText, Paper, IconButton, Card, Avatar, CardContent, Tooltip, useMediaQuery } from "@mui/material";
import API, { addDeliveryAddresses, fetchProductById, fetchProductStockCount, saveOrder, sendOrderConfirmationEmail } from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../Layout";
import SkeletonProductDetail from "./SkeletonProductDetail";
import PaymentForm from "./PaymentForm";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useTheme } from "@emotion/react";

const OrderPage = ({ user }) => {
  const [activeStep, setActiveStep] = useState(0);
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { id } = useParams(); // Extract product ID from URL
  const [product, setProduct] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addressAddedMessage, setAddressAddedMessage] = useState('');
  const [addressFailedMessage, setAddressFailedMessage] = useState('');
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const navigate = useNavigate();
  const [stockWarningMessage, setStockWarningMessage] = useState('');
  const [stockCountId, setStockCountId] = useState(null); // Track only stock count
  const [isStockFetched, setIsStockFetched] = useState(false); // Track if stock data has been fetched
  const [isAddAddressBoxOpen, setIsAddAddressBoxOpen] = useState(false); // to toggle the Add Address button


  useEffect(() => {
    const fetchUserDetails = async () => {

      try {
        const authToken = localStorage.getItem('authToken');
        const productResponse = await fetchProductById(id);
        setProduct(productResponse.data);
        const userId = localStorage.getItem('userId');
        const response = await API.get(`/api/auth/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUserData(response.data);
        const addresses = response.data.deliveryAddresses || [];
        // Sort addresses by `createdAt` in descending order
        setDeliveryAddresses(addresses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setStockCountId(productResponse.data.stockCount); // Set initial stock count
        setIsStockFetched(true); // Mark stock data as fetched


      } catch (err) {
        setError('Failed to fetch User details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };


    fetchUserDetails();
    const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(countdown);
  }, [user, id]);

  useEffect(() => {
    // Periodically fetch stock count
    const interval = setInterval(async () => {
      try {
        const stockResponse = await fetchProductStockCount(id);
        setStockCountId(stockResponse.data.stockCount);
      } catch (err) {
        console.error("Error fetching product stock count:", err);
      }
    }, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (isStockFetched) {
      if (stockCountId === 0) {
        setStockWarningMessage("Product is Out of stock");
      } else {
        setStockWarningMessage("");
      }
    }
  }, [stockCountId, isStockFetched]);

  useEffect(() => {
    if (timer <= 0) {
      alert("Time expired! Redirecting to product page.");
      navigate(`/product/${id}`);
    }
  }, [timer, id, navigate]);


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

  const handlePaymentComplete = async (paymentStatus) => {
    if (paymentStatus === "success") {
      console.log("Selected Address for Order:", selectedAddress);

      try {
        const userSelectedAddress = {
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          email: selectedAddress.email,
          address: {
            street: selectedAddress.address.street,
            area: selectedAddress.address.area,
            city: selectedAddress.address.city,
            state: selectedAddress.address.state,
            pincode: selectedAddress.address.pincode,
          },
        };
  
        const orderData = {
          productId: product._id,
          productTitle: product.title,
          productPic: product.media[0], // Include the first product image
          orderPrice: product.price,
          deliveryAddress: userSelectedAddress,
          paymentStatus: "Completed",
          sellerTitle: product.sellerTitle,
        };
  
        const response = await saveOrder(orderData);
        setActiveStep(2); // Move to order confirmation step

        if (response.status === 201) {
          try {
            const emailPayload = {
              email: selectedAddress.email,
              product: {
                title: product.title,
                price: product.price,
                media: product.media[0], // Send as Base64 string .toString("base64")
              },
              deliverTo: selectedAddress.name,
              contactTo: selectedAddress.phone,
              deliveryAddress: userSelectedAddress,
              deliveryDate: product.deliveryDays,
              sellerTitle: product.sellerTitle,
            };
  
            await sendOrderConfirmationEmail(emailPayload);
            console.log("Order email sent successfully");
          } catch (emailError) {
            console.error("Failed to send email:", emailError);
            alert("Order placed, but email sending failed.");
          }
        } else {
          console.error("Error saving the order");
          alert("Failed to place the order. Please try again.");
        }
      } catch (err) {
        console.error("Error completing the order:", err);
        alert("Failed to place the order. Please try again.");
      }
    } else {
      alert("Payment failed. Please try again.");
    }
  };
  

  const calculateDeliveryDate = (days) => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);
    const options = { weekday: "long", month: "long", day: "numeric" };
    return deliveryDate.toLocaleDateString(undefined, options);
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedAddress) {
      alert("Please select a delivery address.");
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => (prev > 0 ? prev - 1 : prev));
  };
  
  if (loading || !userData) {
    return (
      <Layout>
        <SkeletonProductDetail />
      </Layout>
    );
  };

  return (
    <Layout>
      <Box p={2}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center">
          <Tooltip title="Back to Product" arrow placement="top">
            <IconButton >
              <ArrowBackRoundedIcon onClick={() => navigate(`/product/${id}`, { replace: true })} />
            </IconButton>
            </Tooltip>
            <Typography variant="h5" sx={{ ml: activeStep > 0 ? 1 : 1, float:'right'}}>
              Order Page
            </Typography>
          </Box>
          <Typography variant="body2" color="error">
            Time remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
          </Typography>
        </Box>
        <Box display="flex" gap={1} flexDirection={isMobile ? "column" : "row"} margin={isMobile ? "-10px" : "0"} marginBottom="1rem" >
          <Box sx={{flex: 3, display: "flex", flexDirection: "column", gap: 1}}>
            {/* Product Details */}
            {product && (
              <Card sx={{
                display: "flex",
                // flexDirection: "column",
                // justifyContent: "space-between",
                alignItems: "stretch",
                borderRadius: "8px",
                height: "100%",
              }}>
                {/* <Box sx={{ display: "flex", alignItems: "center", p: 2 }}> */}
                <Avatar
                  src={`data:image/jpeg;base64,${product.media[0]}`} // Assuming the first image is the primary one
                  alt={product.title}
                  sx={{ width: 80, height: 120, margin: 2, borderRadius: '10px' }}
                />
                <CardContent>
                  <Typography variant="h6">{product.title}</Typography>
                  <Typography style={{ display: 'inline-block', float: 'right', marginBottom: '0.5rem' }}>Price: ₹{product.price}</Typography>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body2" color={stockCountId > 0 ? "green" : "red"}>
                      {stockCountId > 0 ? `In Stock (${stockCountId} available)` : "Out of Stock"}
                    </Typography>
                  </Grid>
                  <Typography variant="body2" mt={2}>Delivery in {product.deliveryDays} days</Typography>
                  {product.deliveryDays && (
                    <Typography color="grey" variant="body2">
                      {`Product will be delivered by ${calculateDeliveryDate(product.deliveryDays)}`}
                    </Typography>
                  )}
                </CardContent>
                {/* </Box> */}
              </Card>
            )}
          </Box>
          <Box sx={{flex: 2, display: "flex", flexDirection: "column", gap: 1}}>
            {selectedAddress && (
              <Paper elevation={2} sx={{
                p: 2,
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                // justifyContent: "space-between",
                height: "100%",
              }}>
                <Typography>
                  <strong>Product will be delivered to:</strong>
                </Typography>
                <Typography>
                  {`${selectedAddress.name}, ${selectedAddress.phone}, ${selectedAddress.email}`}
                </Typography>
                <Typography>
                  {`${selectedAddress.address.street}, ${selectedAddress.address.area}, ${selectedAddress.address.city}, ${selectedAddress.address.state}, ${selectedAddress.address.pincode}`}
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>
        <Card sx={{ borderRadius:'8px', margin: `${ isMobile ? '-10px' : '0'}`}}>
          <Box p={1} mt="1rem" >
            <Stepper activeStep={activeStep} alternativeLabel>
              <Step>
                <StepLabel>Select Delivery Address</StepLabel>
              </Step>
              <Step>
                <StepLabel>Payment</StepLabel>
              </Step>
              <Step>
                <StepLabel>Order Confirmation</StepLabel>
              </Step>
            </Stepper>
            {activeStep === 0 && (
              <Box mb={2}>
                <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <Button
                    variant="contained"
                    onClick={() => setIsAddAddressBoxOpen((prev) => !prev)}
                    sx={{ mt: 2, mb: 2, mr: 1}}
                  >
                    Add New Address
                  </Button>
                </Box>
                {isAddAddressBoxOpen && (
                  <Card sx={{borderRadius:'16px'}}>
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
                      sx={{ mt: 2, mb: 2 , float: "right", minWidth:'150px' }}
                    >
                      Submit
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => setIsAddAddressBoxOpen(false)}
                      sx={{ mt: 2, mb: 2, mr:1, float: "right", minWidth:'80px' }}
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
                  <Typography variant="h6" sx={{ mt: 1, ml: 1 }}>Select Delivery Address</Typography>
                  <Grid container spacing={1}>
                    {deliveryAddresses.length > 0 ? (
                      deliveryAddresses.map((deliveryAddress, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4} >
                          <List sx={{ height: "100%", width:"100%" }}>
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
                      ))
                    ) : (
                      <Typography align="center" padding="1rem" variant="body1" color="error">
                        You Don't have Delivery Addresses. Add new Delivery Address.
                      </Typography>
                    )}
                  </Grid>
                  {stockWarningMessage && <p style={{ color: 'red', float: 'inline-start', marginRight: '10px' }}>{stockWarningMessage}</p>}
                  <Button
                    variant="contained"
                    disabled={!selectedAddress || stockCountId === 0}
                    onClick={handleNext}
                    sx={{ m: 1, mb: 2, mt: 3, float: 'right' }}
                  >
                    Proceed to Payment
                  </Button>
                </Box>
              </Box>
            )}
            {activeStep === 1 && (
              <Box>
                <Box display="flex" alignItems="center" mb={2} mt={2} justifyContent="space-between" >   {/* justifyContent="space-between" */}
                  <Box display="flex" alignItems="center">
                  {activeStep > 0 && (
                    <Tooltip title="Back to Delivery Address" arrow placement="top">
                    <IconButton onClick={handleBack} >
                      <ArrowBackRoundedIcon />
                    </IconButton>
                    </Tooltip>
                  )}
                  <Typography variant="body1" color="grey" sx={{float:'inline-end'}}>
                    Back
                  </Typography>
                  </Box>
                  {stockWarningMessage && <p style={{ color: 'red', float: 'right', marginRight: '10px' }}>{stockWarningMessage}</p>}
                </Box>
                <PaymentForm
                  amount={product.price}
                  stockCountId={stockCountId}
                  name={selectedAddress.name}
                  email={selectedAddress.email}
                  contact={selectedAddress.phone}
                  productDesc={product.title}
                  onPaymentComplete={handlePaymentComplete} // Updated logic
                />
              </Box>
            )}
            {activeStep === 2 && (
              <Box mt="1rem">
                {/* <IconButton onClick={handleBack}>
                  <ArrowBackRoundedIcon />
                </IconButton> */}
                <Typography variant="h5" mb={2}>Your Order placed successfully</Typography>
                {/* <Typography>Product: {product.title}</Typography> */}
                {/* <Typography>Price: ₹{product.price}</Typography> */}
                <Typography variant="body2" color="grey" mb={'10px'}>Check your order status on My Orders</Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/my-orders")} // Redirect to MyOrders.js
                  style={{float:'inline-end', marginBottom:'2rem'}}
                >
                  Go to My Orders
                </Button>
              </Box>
            )}
          </Box>
        </Card>
      </Box>
    </Layout>
  );
};

export default OrderPage;
