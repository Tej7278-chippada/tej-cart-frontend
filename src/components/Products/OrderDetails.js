// src/components/ProductDetailID.js
import React, { useEffect, useState } from 'react';
import { Typography, CardMedia, IconButton, Grid, Grid2, Tooltip, Box, useMediaQuery, CircularProgress, Button, Snackbar, Alert, Avatar } from '@mui/material';
import { ThumbUp, Comment } from '@mui/icons-material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { addToWishlist, fetchOrderById, fetchProductById, fetchWishlist, likeProduct, removeFromWishlist } from '../../api/api';
import CommentPopup from './CommentPopup';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../Layout';
import { useTheme } from '@emotion/react';
import SkeletonProductDetail from './SkeletonProductDetail';
import ImageZoomDialog from './ImageZoomDialog';
import ShareIcon from '@mui/icons-material/Share'; // Import the share icon
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import LocalMallRoundedIcon from '@mui/icons-material/LocalMallRounded';

function OrderDetails({ onClose, user }) {
  const [selectedImage, setSelectedImage] = useState(null);
  // const [products, setProducts] = useState([]);
  // const [selectedProduct, setSelectedProduct] = useState(null);
  const [commentPopupOpen, setCommentPopupOpen] = useState(false);
  const [wishlist, setWishlist] = useState(new Set());
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track authentication
  const [likeLoading, setLikeLoading] = useState(false); // For like progress
  const [wishLoading, setWishLoading] = useState(false); // For like progress
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const { productId } = useParams();
  const [ order, setOrder ] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  

  useEffect(() => {
    // setLoading(true);
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const authToken = localStorage.getItem('authToken');
        setIsAuthenticated(!!authToken); // Check if user is authenticated

        const response = await fetchOrderById(id);
        setOrder({
          ...response.data,
          // likedByUser: response.data.likedByUser || false, // Set the liked status
        });
        // if (authToken) {
        //   const wishlistResponse = await fetchWishlist();
        //   const wishlistProducts = wishlistResponse.data.wishlist.map((item) => item._id);
        //   setWishlist(new Set(wishlistProducts));
        // }
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };
    // if (product) {
    //   // Find the updated product in the product list


    //   // Initialize wishlist state based on the product's `isInWishlist` property
    //   const fetchUserWishlist = async () => {
    //     try {
    //       const response = await fetchWishlist();
    //       const wishlistProducts = response.data.wishlist.map((item) => item._id);
    //       setWishlist(new Set(wishlistProducts));
    //     } catch (error) {
    //       console.error('Error fetching wishlist:', error);
    //     }
    //   };

    //   if (product) {

    //     fetchUserWishlist();
    //   }
    // }
    fetchOrderDetails();
    setLoading(false);
  }, [order,id]); // [product, id]

  // const handleLike = async (productId) => {
  //   if (!isAuthenticated || likeLoading) return; // Prevent unauthenticated actions
  //   setLikeLoading(true); // Start the progress indicator
  //   try {
  //     const response = await likeProduct(productId);
  //     const updatedLikes = response.likes;

  //     // Toggle likedByUser and update the likes count
  //     setProduct((prevProduct) =>
  //       prevProduct._id === productId
  //         ? {
  //           ...prevProduct,
  //           likes: updatedLikes,
  //           likedByUser: !prevProduct.likedByUser, // Toggle liked state
  //         }
  //         : prevProduct
  //     );
  //   } catch (error) {
  //     console.error('Error toggling like:', error);
  //     alert('Error toggling like.');
  //   } finally {
  //     setLikeLoading(false); // End the progress indicator
  //   }
  // };
  // const openComments = (product) => {
  //   // setSelectedProduct(product);
  //   setCommentPopupOpen(true);
  //   // setSelectedProduct(product); // Pass the product to ensure it gets updated in the popup
  // };

  // const onCommentAdded = async () => {
  //   try {
  //     // const updatedProducts = await fetchProducts(); // This fetches all products after a comment is added
  //     // setProducts(updatedProducts.data); // Update the product list in the state
  //     // setCommentPopupOpen(false); // Close the CommentPopup
  //   } catch (error) {
  //     console.error("Error fetching products after comment added:", error);
  //   } finally {
  //     // setCommentPopupOpen(false); // Close the comment popup
  //   }
  // };

  // Function to open the zoomed image modal
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  // Function to close the zoomed image modal
  const handleCloseImageModal = () => {
    setSelectedImage(null);
  };

  // const handleWishlistToggle = async (productId) => {
  //   if (!isAuthenticated) return; // Prevent unauthenticated actions
  //   setWishLoading(true); // Start the progress indicator
  //   try {
  //     if (wishlist.has(productId)) {
  //       await removeFromWishlist(productId);
  //       setWishlist((prevWishlist) => {
  //         const newWishlist = new Set(prevWishlist);
  //         newWishlist.delete(productId);
  //         return newWishlist;
  //       });
  //       // alert('Product removed from wishlist!');
  //     } else {
  //       await addToWishlist(productId);
  //       setWishlist((prevWishlist) => new Set([...prevWishlist, productId]));
  //       // alert('Product added to wishlist!');
  //     }
  //   } catch (error) {
  //     console.error('Error toggling wishlist:', error);
  //     alert('Product already added on wishlist!');
  //   } finally {
  //     setWishLoading(false); // End the progress indicator
  //   }
  // };

  // const handleShare = async (productId, productTitle) => {
  //   const shareUrl = `${window.location.origin}/product/${productId}`;
  //   const shareData = {
  //     title: productTitle,
  //     text: `Check out this amazing product: ${productTitle}`,
  //     url: shareUrl,
  //   };

  //   // Check if Web Share API is supported
  //   if (navigator.share) {
  //     try {
  //       await navigator.share(shareData);
  //     } catch (err) {
  //       console.error('Error using Web Share API:', err);
  //     }
  //   } else if (navigator.clipboard && navigator.clipboard.writeText) {
  //     // Fallback: Copy to clipboard if supported
  //     try {
  //       await navigator.clipboard.writeText(shareUrl);
  //       alert(`The link has been copied to your clipboard: ${shareUrl}`);
  //     } catch (err) {
  //       console.error('Error copying text to clipboard:', err);
  //       alert(`Unable to copy the link. Please manually share this URL: ${shareUrl}`);
  //     }
  //   } else {
  //     // Fallback for browsers without clipboard API
  //     const tempInput = document.createElement('textarea');
  //     tempInput.value = shareUrl;
  //     document.body.appendChild(tempInput);
  //     tempInput.select();
  //     try {
  //       document.execCommand('copy');
  //       alert(`The link has been copied to your clipboard: ${shareUrl}`);
  //     } catch (err) {
  //       console.error('Error using execCommand to copy:', err);
  //       alert(`Unable to copy the link. Please manually share this URL: ${shareUrl}`);
  //     }
  //     document.body.removeChild(tempInput);
  //   }
  // };

  // const handleBuyNow = () => {
  //   if (!isAuthenticated || likeLoading) return; // Prevent unauthenticated actions
  //   if (product.stockCount > 0) {
  //     navigate(`/order/${id}`, { state: { product } });
  //   } else {
  //     setSnackbar({ open: true, message: "Product is out of stock.", severity: "warning" });
  //   }
  // };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };


  if (loading || !order) {
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
                    gap: '1rem', 
                    // height: '300px',
                  }}>
                    
                    {order.productPic ? (
                      <Avatar
                        src={`data:image/jpeg;base64,${order.productPic}`} // Render the image
                        alt={order.productTitle}
                        sx={{ width: 210, height: 260, margin: 0, borderRadius: '10px' }}
                      />
                    ) : (
                      <Typography variant="body2" color="grey" align="center" marginLeft="1rem" marginTop="1rem" gutterBottom>
                        No Product Image available
                      </Typography>
                    )}
                    {/* {product.media && product.media.length > 0 ? (
                      product.media.map((base64Image, index) => (
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
                      ))
                    ) : (
                      // Show a placeholder image if no media is available
                      <img
                        src="../assets/null-product-image.webp" // Replace with the path to your placeholder image
                        alt="No media available"
                        style={{
                          // height: '200px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                    )} */}
                    <IconButton
                  onClick={(event) => {
                    event.stopPropagation(); // Prevent triggering the parent onClick
                    navigate(`/product/${order.product}`)
                  }}
                  onMouseEnter={() => setHoveredId(order._id)} // Set hoveredId to the current button's ID
                  onMouseLeave={() => setHoveredId(null)} // Reset hoveredId when mouse leaves
                  style={{
                    position: 'relative', float:'right', 
                    bottom: '6px', marginTop: '1rem',
                    right: '8px',
                    backgroundColor: hoveredId === order._id ? '#ffe6e6' : 'rgba(255, 255, 255, 0.2)',
                    borderRadius: hoveredId === order._id ? '16px' : '16px',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center', color: 'red'
                    // transition: 'all 0.2s ease',
                  }}
                >
                  {hoveredId === order._id && (
                    <span
                      style={{
                        fontSize: '14px', marginLeft:'16px',
                        color: '#ff0000',
                        marginRight: '8px',
                        whiteSpace: 'nowrap',
                        opacity: hoveredId === order._id ? 1 : 0,
                        transform: hoveredId === order._id ? 'translateX(0)' : 'translateX(10px)',
                        transition: 'opacity 0.3s, transform 0.3s',
                      }}
                    >
                      See Product Details
                    </span>
                  )}
                  <LocalMallRoundedIcon />
                </IconButton>
                    
                  </div>
                  
                </CardMedia>
                </Box>
                
                </Box>

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
                    {/* <IconButton
                      style={{
                        // display: 'inline-block',
                        float: 'right',
                        fontWeight: '500',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', marginLeft: '10px'
                      }}
                      onClick={() => handleShare(product._id, product.title)}
                    >
                      <Tooltip title="Share this product" arrow placement="right">
                        <ShareIcon />
                      </Tooltip>
                    </IconButton> */}
                    {/* <IconButton
                      style={{ display: 'inline-block', float: 'right', fontWeight: '500', backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}
                      onClick={() => handleWishlistToggle(product._id)}
                      sx={{
                        color: wishlist.has(product._id) ? 'red' : 'gray',
                      }} disabled={wishLoading} // Disable button while loading
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
                        >{wishLoading ? (
                          <CircularProgress size={24} color="inherit" /> // Show spinner while loading
                        ) : wishlist.has(product._id) ? (
                          <FavoriteIcon />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                        </span></Tooltip>
                    </IconButton> */}
                    <Typography variant="h4" style={{
                      fontWeight: 'bold',
                      marginBottom: '0.5rem',
                      color: '#333'
                    }}>
                      {order.productTitle}
                    </Typography>

                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      Order Status:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                    {order.paymentStatus}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      Order Price:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      ₹{order.orderPrice}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      Ordered on:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(order.createdAt).toLocaleString()}
                    </Typography>
                  </Grid>
                  
                  {/* <Grid item xs={6} sm={4}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      Stock Status:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {product.stockStatus}
                    </Typography>
                  </Grid> */}
                  {/* <Grid item xs={6} sm={4}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      Stock Count:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {product.stockCount}
                    </Typography>
                  </Grid> */}
                  <Grid item xs={12} sm={12}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      Delivery Address Details:
                    </Typography>
                    {/* <Typography variant="body2" color="textSecondary">
                      {product.deliveryDays}
                    </Typography> */}
                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                      Name: {order.userDeliveryAddresses[0]?.name || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                      Phone: {order.userDeliveryAddresses[0]?.phone || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                      Email: {order.userDeliveryAddresses[0]?.email || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                      Address: {`${order.userDeliveryAddresses[0]?.address.street || "N/A"}, ${order.userDeliveryAddresses[0]?.address.area || "N/A"}, ${order.userDeliveryAddresses[0]?.address.city || "N/A"}`},
                      <br/> {`${order.userDeliveryAddresses[0]?.address.state || "N/A"} - ${order.userDeliveryAddresses[0]?.address.pincode || "N/A"}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={4}>
                    <Typography variant="body1" style={{ fontWeight: 500 }}>
                      Seller Title:
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                    {order.sellerTitle}
                    </Typography>
                  </Grid>
                  {/* <Grid item xs={6} sm={4}>
                  <Typography variant="body2" color={product.stockCount > 0 ? "green" : "red"}>
                    {product.stockCount > 0 ? `In Stock (${product.stockCount} available)` : "Out of Stock"}
                  </Typography>
                  </Grid> */}
                  {/* <Grid item xs={6} sm={4}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleBuyNow}
                      disabled={product.stockCount === 0}
                      style={{ marginTop: "1rem" }}
                    >
                      Buy Now
                    </Button>
                  </Grid> */}
                </Grid>
              </Box></Box>
          </Box>

          {/* <Grid item xs={12} sx={{ paddingTop: '2rem' }}>
            <Grid2 sx={{
              bottom: '6px',
              right: '1rem', position: 'relative', display: 'inline-block', float: 'right',
            }}>
              <IconButton
                onClick={() => handleLike(product._id)}
                sx={{ color: product.likedByUser ? 'blue' : 'gray' }} disabled={likeLoading} // Disable button while loading
              >
                {likeLoading ? (
                  <CircularProgress size={24} color="inherit" /> // Show spinner while loading
                ) : product.likedByUser ? (
                  <ThumbUp />
                ) : (
                  <ThumbUpOffAltIcon />
                )}
                {product.likes}
              </IconButton>
              <IconButton onClick={() => openComments(product)}>
                <Comment /> {product.comments?.length || 0}
              </IconButton>
            </Grid2>
            <Typography variant="h6" style={{ paddingLeft: '6px', fontWeight: 500 }}>
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
          </Grid> */}
          {/* <Grid item xs={6} sm={4}>
            <Typography variant="body1" style={{ fontWeight: 500 }}>
              Seller Details:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {product.sellerTitle}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <Typography variant="body1" style={{ fontWeight: 500 }}>
              Seller Id:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {product.sellerId}
            </Typography>
          </Grid> */}

        </div>
        {/* Large Image Dialog with Zoom */}
        {/* <ImageZoomDialog
          selectedImage={selectedImage}
          handleCloseImageModal={handleCloseImageModal}
          images={product.media} // Pass the full media array
        /> */}
        {/* <CommentPopup
          open={commentPopupOpen}
          onClose={() => setCommentPopupOpen(false)}
          product={product} // Pass the current product
          onCommentAdded={onCommentAdded}  // Passing the comment added handler
        /> */}
        <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      </Box>
    </Layout>
  );
}

export default OrderDetails;
