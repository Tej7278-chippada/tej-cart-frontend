// Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 1, mt: 'auto', textAlign: 'center' }}>
      <Typography variant="body2" color="textSecondary">
        &copy; TejCart 2024
      </Typography>
    </Box>
  );
};

export default Footer;
