// components/Products/Orderpage.js
import React, { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, Grid, Snackbar, Alert, Stepper, Step, StepLabel, List, ListItem, ListItemText, Paper, IconButton, Card, Avatar, CardContent, Tooltip } from "@mui/material";
import API, { addDeliveryAddresses, fetchProductById, fetchProductStockCount, saveOrder, sendOrderConfirmationEmail } from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../Layout";
import SkeletonProductDetail from "./SkeletonProductDetail";
import PaymentForm from "./PaymentForm";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

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
      setNewAddress({
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
          deliveryAddress: userSelectedAddress,
          paymentStatus: "Completed",
        };
  
        const response = await saveOrder(orderData);
        if (response.status === 201) {
          try {
            const emailPayload = {
              email: selectedAddress.email,
              product: {
                title: product.title,
                price: product.price,
                media: product.media[0],
              },
              deliveryAddress: userSelectedAddress,
              sellerTitle: product.sellerTitle,
            };
  
            await sendOrderConfirmationEmail(emailPayload);
            console.log("Order email sent successfully");
  
            setActiveStep(2); // Move to order confirmation step
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
          
          <IconButton >
          <Tooltip title="Back to product" arrow placement="top">
            <ArrowBackRoundedIcon onClick={() => navigate(`/product/${id}`)} />
            </Tooltip>
            <Typography variant="h5" sx={{ ml: activeStep > 0 ? 1 : 1 }}>
              Order Page
            </Typography>
          </IconButton>
         
          <Typography variant="body2" color="error">
            Time remaining: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60}
          </Typography>
        </Box>
        {/* Product Details */}
        {product && (
          <Card sx={{ display: 'flex', marginBottom: 2 }}>
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
              <Typography>Delivery in {product.deliveryDays} days</Typography>
              {product.deliveryDays && (
                <Typography>
                  Estimated Delivery: {`Product will be delivered by ${calculateDeliveryDate(product.deliveryDays)}`}
                </Typography>
              )}
            </CardContent>
          </Card>
        )}
        {selectedAddress && (
          <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
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
        <Box p={3}>
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
              <Box my={2}>
                <Typography variant="h6">Add New Delivery Address</Typography>
                <Grid container spacing={2}>
                  {["name", "phone", "email", "street", "area", "city", "state", "pincode"].map((field) => (
                    <Grid item xs={12} sm={6} key={field}>
                      <TextField
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        fullWidth
                        value={newAddress[field] || ""}
                        onChange={(e) => setNewAddress({ ...newAddress, [field]: e.target.value })}
                      />
                    </Grid>
                  ))}
                </Grid>
                <Button variant="contained" onClick={handleAddAddress} sx={{ mt: 2, float: 'right' }}>
                  Submit
                </Button>
                {addressAddedMessage && <Snackbar open={true} autoHideDuration={6000} onClose={() => setAddressAddedMessage('')}>
                  <Alert severity="success">{addressAddedMessage}</Alert>
                </Snackbar>}
                {addressFailedMessage && <Snackbar open={true} autoHideDuration={6000} onClose={() => setAddressFailedMessage('')}>
                  <Alert severity="error">{addressFailedMessage}</Alert>
                </Snackbar>}
              </Box>
              <Box>
                <Typography variant="h6" sx={{ mt: 4 }}>Select Delivery Address</Typography>
                <List>
                  {deliveryAddresses.map((deliveryAddress, index) => (
                    <ListItem
                      key={index}
                      button="true"
                      selected={selectedAddress === deliveryAddress}
                      onClick={() => setSelectedAddress(deliveryAddress)}
                      sx={{
                        border: selectedAddress === deliveryAddress ? "2px solid blue" : "1px solid lightgray",
                        borderRadius: 2,
                        mb: 2,
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
                  ))}
                </List>
                {stockWarningMessage && <p style={{ color: 'red', float: 'inline-start', marginRight: '10px' }}>{stockWarningMessage}</p>}
                <Button
                  variant="contained"
                  disabled={!selectedAddress || stockCountId === 0}
                  onClick={handleNext}
                  sx={{ mt: 1, float: 'right' }}
                >
                  Proceed to Payment
                </Button>
              </Box>
            </Box>
          )}
          {activeStep === 1 && (
            <Box>
              <Box display="flex" alignItems="center" mb={2} mt={2}>   {/* justifyContent="space-between" */}
                {activeStep > 0 && (
                  <IconButton onClick={handleBack}>
                    <ArrowBackRoundedIcon />
                  </IconButton>
                )}
                <Typography variant="body1" color="grey">
                  Back
                </Typography>
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
            <Box>
              <IconButton onClick={handleBack}>
                <ArrowBackRoundedIcon />
              </IconButton>
              <Typography variant="h5">Order Confirmation</Typography>
              <Typography>Product: {product.title}</Typography>
              <Typography>Price: ₹{product.price}</Typography>
              <Button
          variant="contained"
          onClick={() => navigate("/my-orders")} // Redirect to MyOrders.js
        >
          Go to My Orders
        </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default OrderPage;
