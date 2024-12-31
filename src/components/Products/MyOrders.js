// src/components/Products/MyOrders.js
import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem } from "@mui/material";
import { fetchUserOrders } from "../../api/api";
import Header from "../Header";
import Footer from "../Footer";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const userOrders = await fetchUserOrders();
        setOrders(userOrders.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    loadOrders();
  }, []);

  return (
    <div>
    <Header/>
    <Box>
      <Typography variant="h4">My Orders</Typography>
      <List>
        {orders.map((order, index) => (
          <ListItem key={index}>
            <Typography>
              {`Product: ${order.product.title} | Price: ₹${order.product.price} | Status: ${order.paymentStatus}`}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Box>
    <Footer/>
    </div>
  );
};

export default MyOrders;
