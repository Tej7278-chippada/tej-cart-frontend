// src/components/ProductDetail.js
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, Typography, CardMedia, IconButton, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ThumbUp, Comment } from '@mui/icons-material';
import { addToWishlist, fetchProducts, likeProduct } from '../../api/api';
import CommentPopup from './CommentPopup';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

function ProductDetail({ product, onClose }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [commentPopupOpen, setCommentPopupOpen] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());

  useEffect(() => {
    fetchProducts().then((response) => setProducts(response.data));
  }, []);
  if (!product) return null;
  

  const handleLike = async (productId) => {
    await likeProduct(productId);
    fetchProducts().then((response) => setProducts(response.data)); // Refresh product list with updated likes
  };

  const openComments = (product) => {
    // setSelectedProduct(product);
    setCommentPopupOpen(true);
  };

  // Function to open the zoomed image modal
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Function to close the zoomed image modal
  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };

  const handleWishlistToggle = async (productId) => {
    try {
      await addToWishlist(productId);
      setWishlist((prevWishlist) => {
        const newWishlist = new Set(prevWishlist);
        if (newWishlist.has(productId)) {
          newWishlist.delete(productId);
        } else {
          newWishlist.add(productId);
        }
        return newWishlist;
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  return (
    <Dialog open={!!product} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent style={{
        padding: '2rem',
        position: 'relative',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '8px'
      }}>
        {/* Close button */}
        <IconButton
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            color: '#333'
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Media section */}
        {/* Media section with click to zoom */}
        <CardMedia>
          <div style={{
            display: 'flex',
            overflowX: 'auto',
            scrollbarWidth: 'thin',
            scrollbarColor: '#888 transparent',
            borderRadius: '8px',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            {product.media && product.media.map((base64Image, index) => (
              <img
                key={index}
                src={`data:image/jpeg;base64,${base64Image}`}
                alt={`Product ${index}`}
                style={{
                  height: '200px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                  flexShrink: 0,
                  cursor: 'pointer' // Make the image look clickable
                }}
                onClick={() => handleImageClick(base64Image)} // Open image in modal on click
              />
            ))}
          </div>
        </CardMedia>

        {/* Product Details */}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <IconButton style={{ display: 'inline-block',float: 'right', fontWeight: '500' }}
              onClick={() => handleWishlistToggle(product._id)}
              sx={{
                color: wishlist.has(product._id) ? 'red' : 'gray',
              }}
            >
              {wishlist.has(product._id) ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
            <Typography variant="h4" style={{
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              color: '#333'
            }}>
              {product.title}
            </Typography>
            
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography variant="body1" style={{ fontWeight: 500 }}>
              Price:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ₹{product.price}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography variant="body1" style={{ fontWeight: 500 }}>
              Stock Status:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {product.stockStatus}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography variant="body1" style={{ fontWeight: 500 }}>
              Gender:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {product.gender}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography variant="body1" style={{ fontWeight: 500 }}>
              Delivery Days:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {product.deliveryDays}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" style={{ fontWeight: 500 }}>
              Description:
            </Typography>
            <Typography variant="body2" color="textSecondary" style={{
              marginTop: '0.5rem',
              lineHeight: '1.5',
              textAlign: 'justify', whiteSpace: "pre-wrap", // Retain line breaks and tabs
              wordWrap: "break-word", // Handle long words gracefully
              backgroundColor: "#f5f5f5", 
              padding: "1rem", 
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}>
              {product.description}
            </Typography>
          </Grid>
          <IconButton onClick={() => handleLike(product._id)}>
                  <ThumbUp /> {product.likes}
                </IconButton>
                <IconButton onClick={() => openComments(product)}>
                  <Comment /> {product.comments?.length || 0}
                </IconButton>
        </Grid>
      </DialogContent>

      {/* Large Image Dialog with Zoom */}
      <Dialog open={!!selectedImage} onClose={handleCloseImageModal} maxWidth="lg">
        <DialogContent style={{ padding: 0 }}>
          <img
            src={`data:image/jpeg;base64,${selectedImage}`}
            alt="Zoomed Product"
            style={{
              width: '100%',
              height: 'auto',
              cursor: 'zoom-in', // Zoom-in cursor effect
              transition: 'transform 0.3s ease', // Smooth zoom effect
              transform: 'scale(1.1)', // Apply zoom effect on hover
            }}
            onClick={handleCloseImageModal}
          />
        </DialogContent>
      </Dialog>
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <CommentPopup
        open={commentPopupOpen}
        onClose={() => setCommentPopupOpen(false)}
        product={product} // Pass the current product
        onCommentAdded={() => fetchProducts().then((response) => setProducts(response.data))}
      />
    </Dialog>
  );
}

export default ProductDetail;
