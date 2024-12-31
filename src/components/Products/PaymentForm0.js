import React, { useState } from "react";
import { Button, Typography, Box, Snackbar, Alert } from "@mui/material";
import axios from "axios";

const PaymentForm0 = ({ amount, onPaymentComplete, stockCountId }) => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/payments`, { amount });

      const options = {
        key: "rzp_live_SOG0BZHIb1FCq1",
        amount: data.amount,
        currency: data.currency,
        name: "Tej Pay",
        description: "Product Purchase",
        order_id: data.id,
        handler: async (response) => {
          try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/payments/update`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              status: "success",
            });
            setAlert({ open: true, message: "Payment successful!", severity: "success" });
            onPaymentComplete("success");
          } catch (error) {
            console.error("Failed to update payment details:", error);
            setAlert({ open: true, message: "Payment update failed.", severity: "error" });
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "1234567890",
        },
        theme: { color: "#F37254" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        setAlert({ open: true, message: "Payment failed. Please try again.", severity: "error" });
        onPaymentComplete("failure");
      });
      rzp.open();
    } catch (error) {
      setAlert({ open: true, message: "Failed to initiate payment.", severity: "error" });
    }
    setLoading(false);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h5" mb={2}>Pay ₹{amount}</Typography>
      <Button variant="contained" color="primary" onClick={handlePayment} disabled={loading || stockCountId === 0}>
        {loading ? "Processing..." : "Pay Now"}
      </Button>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PaymentForm0;
