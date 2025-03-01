// src/components/orders/MyOrders.js
import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Tooltip, CardMedia, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { fetchSellerOrders } from "../../api/sellerApi";
import SellerHeader from "./SellerHeader";
import SkeletonCards from "../Products/SkeletonCards";
import Footer from "../Footer";
import ProductDetail from "../Products/ProductDetail";

const SellerMyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const sellerOrders = await fetchSellerOrders();
        setOrders(sellerOrders.data.reverse() || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const openProductDetail = (order) => {
    navigate(`/order-details/${order._id}`);
  };

  return (
    <div>
    <SellerHeader/>
    <Box p={'4px'} sx={{ margin: '0rem' }}>
      <Typography variant="h5" align="left" marginLeft="1rem" marginTop="1rem" gutterBottom>
        Orders History
      </Typography>
      <div style={{
          backgroundSize: 'cover', backgroundPosition: 'center', backdropFilter: 'blur(10px)'
        }}>
          <Box sx={{ bgcolor: '#f5f5f5', paddingTop: '1rem', paddingBottom: '1rem', paddingInline: '8px', borderRadius: '10px' }} > {/* sx={{ p: 2 }} */}
            {loading ? (
              <SkeletonCards />
            ) : (
              <Grid container spacing={2}>
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card style={{
                        margin: '0rem 0',  // spacing between up and down cards
                        cursor: 'pointer',
                        backdropFilter: 'none',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '8px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Default shadow
                        transition: 'transform 0.1s ease, box-shadow 0.1s ease', // Smooth transition for hover
                      }}
                        onClick={() => openProductDetail(order)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.02)'; // Slight zoom on hover
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'; // Enhance shadow
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)'; // Revert zoom
                          e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'; // Revert shadow
                        }} >
                          <CardMedia sx={{ position: 'relative', margin: '0rem 0', borderRadius: '8px', overflow: 'hidden', height: '200px', backgroundColor: '#f5f5f5' }} >
                          <div style={{
                            display: 'flex',
                            overflowX: 'auto',
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#888 transparent',
                            borderRadius: '8px',
                            gap: '0.1rem',
                            height: '210px'
                          }} >
                            {order.productPic ? (
                              <Avatar
                                src={`data:image/jpeg;base64,${order.productPic}`} // Render the image
                                alt={order.productTitle}
                                sx={{ width: 140, height: 180, margin: 1, borderRadius: '10px' }}
                              />
                            ) : (
                              <Typography variant="body2" color="grey" align="center" marginLeft="1rem" marginTop="1rem" gutterBottom>
                                No Product Image available
                              </Typography>
                            )}
                          </div>
                          
                        </CardMedia>
                        <CardContent style={{ padding: '1rem' }}>
                          <Tooltip title={order.product.title} placement="top" arrow>
                            <Typography variant="h5" component="div" style={{ fontWeight: 'bold', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {order.product.title.split(" ").length > 5 ? `${order.product.title.split(" ").slice(0, 5).join(" ")}...` : order.product.title}
                            </Typography>
                          </Tooltip>
                          {/* <Typography variant="body1" color="textSecondary" style={{ display: 'inline-block', float: 'right', fontWeight: '500' }}>
                            Price: ₹{order.product.price}
                          </Typography> */}
                          <Typography variant="body1" color="textSecondary" style={{ display: 'inline-block', float: 'right', fontWeight: '500' }}>
                             Order Price: ₹{order.orderPrice}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                            Order Status: {order.paymentStatus}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                            Ordered on: {new Date(order.createdAt).toLocaleString()}
                          </Typography>
                          {/* <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                            Name: {order.userDeliveryAddresses[0]?.name || "N/A"}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                            Phone: {order.userDeliveryAddresses[0]?.phone || "N/A"}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                            Email: {order.userDeliveryAddresses[0]?.email || "N/A"}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                            Delivery Address: {`${order.userDeliveryAddresses[0]?.address.street || "N/A"}, ${order.userDeliveryAddresses[0]?.address.area || "N/A"}, ${order.userDeliveryAddresses[0]?.address.city || "N/A"}`},
                            <br/> {`${order.userDeliveryAddresses[0]?.address.state || "N/A"} - ${order.userDeliveryAddresses[0]?.address.pincode || "N/A"}`}
                          </Typography> */}
                          
                          
                        </CardContent>
                      </Card>

                    </Grid>
                  ))
                ) : (
                  <Typography align="center" padding="1rem" variant="body1">
                    You don't have orders.
                  </Typography>
                )}
              </Grid>
            )}
          </Box>
      </div>
      {selectedProduct && (
          <ProductDetail order={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
    </Box>
    <Footer/>
    </div>
  );
};

export default SellerMyOrders;
