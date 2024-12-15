// src/components/ProductDetailID.js
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, Typography, CardMedia, IconButton, Grid, Grid2, Tooltip, Box, useMediaQuery } from '@mui/material';
import { ThumbUp, Comment } from '@mui/icons-material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { addToWishlist, fetchProductById, fetchWishlist, likeProduct, removeFromWishlist } from '../../api/api';
import CommentPopup from './CommentPopup';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ProductDetail from './ProductDetail';
import { useParams } from 'react-router-dom';
import Layout from '../Layout';
import { useTheme } from '@emotion/react';
import SkeletonProductDetail from './SkeletonProductDetail';

function ProductDetailID({ onClose, user }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [commentPopupOpen, setCommentPopupOpen] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    // setLoading(true);
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await fetchProductById(id);
        setProduct({
          ...response.data,
          likedByUser: response.data.likedByUser, // Set the liked status
        });
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (product) {
      // Find the updated product in the product list
      const updatedProduct = products.find((p) => p._id === product._id);
      if (updatedProduct) {
        setSelectedProduct(updatedProduct);
      }

      // Initialize wishlist state based on the product's `isInWishlist` property
      const fetchUserWishlist = async () => {
        try {
          const response = await fetchWishlist();
          const wishlistProducts = response.data.wishlist.map((item) => item._id);
          setWishlist(new Set(wishlistProducts));
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        }
      };

      if (product) {

        fetchUserWishlist();
      }
    }
    fetchProductDetails();
    setLoading(false);
  }, [products, product, id]);

  const handleLike = async (productId) => {
    try {
      const response = await likeProduct(productId);
      const updatedLikes = response.likes;
  
      // Toggle likedByUser and update the likes count
      setProduct((prevProduct) =>
        prevProduct._id === productId
          ? {
              ...prevProduct,
              likes: updatedLikes,
              likedByUser: !prevProduct.likedByUser, // Toggle liked state
            }
          : prevProduct
      );
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Error toggling like.');
    }
  };
  



  const openComments = (product) => {
    // setSelectedProduct(product);
    setCommentPopupOpen(true);
    // setSelectedProduct(product); // Pass the product to ensure it gets updated in the popup
  };

  const onCommentAdded = async () => {
    try {
      // const updatedProducts = await fetchProducts(); // This fetches all products after a comment is added
      // setProducts(updatedProducts.data); // Update the product list in the state
      // setCommentPopupOpen(false); // Close the CommentPopup
    } catch (error) {
      console.error("Error fetching products after comment added:", error);
    } finally {
      // setCommentPopupOpen(false); // Close the comment popup
    }
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
      if (wishlist.has(productId)) {
        await removeFromWishlist(productId);
        setWishlist((prevWishlist) => {
          const newWishlist = new Set(prevWishlist);
          newWishlist.delete(productId);
          return newWishlist;
        });
        // alert('Product removed from wishlist!');
      } else {
        await addToWishlist(productId);
        setWishlist((prevWishlist) => new Set([...prevWishlist, productId]));
        // alert('Product added to wishlist!');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      alert('Product already added on wishlist!');
    }
  };
  // if (!product) {
  //   return <Typography>Loading product details...</Typography>;
  // }
  if (loading || !product) {
    return (
      <Layout>
        {/* <SkeletonCards /> */}
        <SkeletonProductDetail />
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>

        <div style={{
          padding: '8px',
          // position: 'relative',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '8px', scrollbarWidth: 'thin'
        }}>
          {/* Close button */}
          {/* <IconButton
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
        </IconButton> */}

          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            gap={2} sx={{ bgcolor: '#f5f5f5', borderRadius: '10px', padding: '6px', paddingBottom: '10px', paddingTop: '10px' }}
          >
            <Box sx={{
              flex: 2,
              // height: '73vh', // Fixed height relative to viewport
              overflowY: 'auto',
              // bgcolor: 'transparent', // Card background color (customizable)
              borderRadius: 3, // Card border radius (customizable)
              // boxShadow: 3, // Shadow for a modern look
              scrollbarWidth: 'thin'
            }}>
              <Box
                flex={isMobile ? "1" : "0 0 30%"}
                style={{ paddingRight: isMobile ? "0" : "0rem" }}
              >

                {/* Media section */}
                {/* Media section with click to zoom */}
                <CardMedia>
                  <div style={{
                    display: 'flex',
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    scrollbarColor: '#888 transparent',
                    // borderRadius: '8px',
                    gap: '0.2rem', height: '300px',
                  }}>
                    {product.media && product.media.map((base64Image, index) => (
                      <img
                        key={index}
                        src={`data:image/jpeg;base64,${base64Image}`}
                        alt={`Product ${index}`}
                        style={{
                          // height: '200px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          flexShrink: 0,
                          cursor: 'pointer' // Make the image look clickable
                        }}
                        onClick={() => handleImageClick(base64Image)} // Open image in modal on click
                      />
                    ))}
                  </div>
                </CardMedia></Box></Box>

            <Box sx={{
              flex: 3,
              // height: '73vh', // Fixed height relative to viewport
              overflowY: 'auto',
              bgcolor: 'white', // Card background color (customizable)
              borderRadius: 3, // Card border radius (customizable)
              // boxShadow: 3, // Shadow for a modern look
              scrollbarWidth: 'thin', padding: '1rem'
            }}>
              <Box flex={isMobile ? "1" : "0 0 70%"}>

                {/* Product Details */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <IconButton
                      style={{ display: 'inline-block', float: 'right', fontWeight: '500', backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}
                      onClick={() => handleWishlistToggle(product._id)}
                      sx={{
                        color: wishlist.has(product._id) ? 'red' : 'gray',
                      }}
                    >
                      <Tooltip
                        title={wishlist.has(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        arrow
                        placement="right"
                      >
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                            transition: 'transform 0.3s ease',
                          }}
                        >
                          {wishlist.has(product._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </span></Tooltip>
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
                      Product Category:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {product.categories}
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
                      Stock Count:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {product.stockCount}
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

                </Grid>
              </Box></Box>
          </Box>

          <Grid item xs={12} sx={{ paddingTop: '2rem' }}>
            <Grid2 sx={{
              bottom: '1rem',
              right: '1rem', position: 'relative', display: 'inline-block', float: 'right',
            }}>
              <IconButton
                onClick={() => handleLike(product._id)}
                sx={{ color: product.likedByUser ? 'blue' : 'gray' }}
              >
                          {product.likedByUser ? <ThumbUp /> : <ThumbUpOffAltIcon />}
                        {product.likes}
              </IconButton>


              <IconButton onClick={() => openComments(product)}>
                <Comment /> {product.comments?.length || 0}
              </IconButton>
            </Grid2>
            <Typography variant="body1" style={{ paddingLeft: '1rem', fontWeight: 500 }}>
              Product Description:
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

        </div>



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
                // transform: 'scale(1.1)', // Apply zoom effect on hover
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
          onCommentAdded={onCommentAdded}  // Passing the comment added handler
        />
      </Box>
    </Layout> 
  );
}

export default ProductDetailID;
