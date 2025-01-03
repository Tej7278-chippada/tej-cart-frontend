import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Alert,
  Card,
  CardContent,
  Button,
  Chip,
} from '@mui/material';
import SellerLayout from './SellerLayout';
import { getSellerOrders } from '../../api/sellerApi';

const SellerOrders = () => {
  const { sellerId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getSellerOrders(sellerId);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error.message);
        setError('Failed to fetch orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [sellerId]);

  if (loading) {
    return (
      <SellerLayout>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      </SellerLayout>
    );
  }

  if (error) {
    return (
      <SellerLayout>
        <Box p={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
      <Box p={2}>
        <Typography variant="h4" gutterBottom>
          Orders Placed
        </Typography>
        {orders.length === 0 ? (
          <Alert severity="info">No orders found.</Alert>
        ) : (
          <Grid container spacing={3}>
            {orders.map((order) => (
              <Grid item xs={12} sm={6} md={4} key={order._id}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      User Order ID: {order.orderId._id}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      Order ID: {order._id}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Buyer:</strong> {order.buyerInfo.username} ({order.buyerInfo.email})
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Phone:</strong> {order.buyerInfo.phone}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Address:</strong>{' '}
                      {order.userDeliveryAddresses
                        .map(
                          (addr) =>
                            `${addr.name}, ${addr.phone}, ${addr.address.street}, ${addr.address.city}`
                        )
                        .join(', ')}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Payment Status:</strong>{' '}
                      <Chip
                        label={order.paymentStatus}
                        color={order.paymentStatus === 'Paid' ? 'success' : 'warning'}
                        size="small"
                      />
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      sx={{ mt: 2 }}
                      onClick={() => console.log(`View details for order: ${order._id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </SellerLayout>
  );
};

export default SellerOrders;
