// src/components/MyOrders.js
import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem } from "@mui/material";
import { fetchUserOrders } from "../../api/api";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      const userOrders = await fetchUserOrders();
      setOrders(userOrders.data);
    };
    loadOrders();
  }, []);

  return (
    <Box>
      <Typography variant="h4">My Orders</Typography>
      <List>
        {orders.map((order, index) => (
          <ListItem key={index}>
            <Typography>
              {`Product: ${order.product.title} | Price: ₹${order.product.price} | Status: ${order.status}`}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MyOrders;
