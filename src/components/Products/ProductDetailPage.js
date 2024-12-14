import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById, fetchWishlist, addToWishlist, removeFromWishlist } from '../../api/api';
import { Typography, CardMedia, IconButton, Tooltip, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [wishlist, setWishlist] = useState(new Set());

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetchProductById(id);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    const fetchUserWishlist = async () => {
      try {
        const response = await fetchWishlist();
        const wishlistProducts = response.data.wishlist.map((item) => item._id);
        setWishlist(new Set(wishlistProducts));
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };

    fetchProductDetails();
    fetchUserWishlist();
  }, [id]);

  const handleWishlistToggle = async (productId) => {
    try {
      if (wishlist.has(productId)) {
        await removeFromWishlist(productId);
        setWishlist((prevWishlist) => {
          const newWishlist = new Set(prevWishlist);
          newWishlist.delete(productId);
          return newWishlist;
        });
      } else {
        await addToWishlist(productId);
        setWishlist((prevWishlist) => new Set([...prevWishlist, productId]));
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  if (!product) {
    return <Typography>Loading product details...</Typography>;
  }

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        {product.title}
      </Typography>
      <CardMedia>
        {product.media.map((base64Image, index) => (
          <img
            key={index}
            src={`data:image/jpeg;base64,${base64Image}`}
            alt={`Product ${index}`}
            style={{
              height: '300px',
              objectFit: 'cover',
              marginRight: '10px',
            }}
          />
        ))}
      </CardMedia>
      <Typography variant="body1">{product.description}</Typography>
      <IconButton onClick={() => handleWishlistToggle(product._id)} sx={{ color: wishlist.has(product._id) ? 'red' : 'gray' }}>
        <Tooltip title={wishlist.has(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}>
          {wishlist.has(product._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </Tooltip>
      </IconButton>
    </Box>
  );
};

export default ProductDetailPage;
