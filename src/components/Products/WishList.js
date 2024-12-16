import React, { useEffect, useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Tooltip, IconButton, Grid, Box } from '@mui/material';
import { fetchWishlist, removeFromWishlist } from '../../api/api';
import LazyImage from './LazyImage';
import SkeletonCards from './SkeletonCards';
import ProductDetail from './ProductDetail';
import Layout from '../Layout';
import { useNavigate } from 'react-router-dom';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';

const WishList = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      try {
        const response = await fetchWishlist();
        setWishlist(response.data.wishlist.reverse() || []); // Assuming the backend response has `wishlist` array
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        setError('Failed to fetch wishlist.');
        // setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    loadWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((product) => product._id !== productId));
    } catch (error) {
      console.error('Error removing product:', error);
      alert('Failed to remove product from wishlist.');
    }
  };

  const openProductDetail = (product) => {
    // setSelectedProduct(product);
    navigate(`/product/${product._id}`);
  };

  // if (loading) return <p>Loading wishlist...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Layout>
      <Box p={2} sx={{ margin: '0rem' }}>
        <Typography variant="h5" align="left" marginLeft="1rem" marginTop="1rem" gutterBottom>
          Your Wishlist
        </Typography>
        
        <div style={{
          backgroundSize: 'cover', backgroundPosition: 'center', backdropFilter: 'blur(10px)'
        }}>
          <Box sx={{ bgcolor: '#f5f5f5', paddingTop: '1rem', paddingBottom: '1rem', paddingInline: '8px', borderRadius: '10px' }} > {/* sx={{ p: 2 }} */}
            {loading ? (
              <SkeletonCards />
            ) : (
              <Grid container spacing={2}>
                {wishlist.length > 0 ? (
                  wishlist.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product._id}>
                      <Card style={{
                        margin: '0rem 0',  // spacing between up and down cards
                        cursor: 'pointer',
                        backdropFilter: 'none',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '8px',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Default shadow
                        transition: 'transform 0.1s ease, box-shadow 0.1s ease', // Smooth transition for hover
                      }}
                        onClick={() => openProductDetail(product)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.02)'; // Slight zoom on hover
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'; // Enhance shadow
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)'; // Revert zoom
                          e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'; // Revert shadow
                        }} >
                        {/* CardMedia for Images with Scroll */}
                        <CardMedia sx={{ position: 'relative', margin: '0rem 0', borderRadius: '8px', overflow: 'hidden', height: '200px', backgroundColor: '#f5f5f5' }} >
                          <div style={{
                            display: 'flex',
                            overflowX: 'auto',
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#888 transparent',
                            borderRadius: '8px',
                            gap: '0.1rem',
                            // marginBottom: '1rem'
                            height: '210px'
                          }} >
                            {product.media && product.media.slice(0, 5).map((base64Image, index) => (
                              <LazyImage key={index} base64Image={base64Image} alt={`Product ${index}`} style={{
                                height: '200px',
                                borderRadius: '8px',
                                objectFit: 'cover',
                                flexShrink: 0,
                                cursor: 'pointer' // Make the image look clickable
                              }} />
                            ))}
                          </div>
                          <IconButton
                            onClick={(event) => {
                              event.stopPropagation(); // Prevent triggering the parent onClick
                              handleRemove(product._id);
                            }}
                            onMouseEnter={() => setHoveredId(product._id)} // Set hoveredId to the current button's ID
                            onMouseLeave={() => setHoveredId(null)} // Reset hoveredId when mouse leaves
                            style={{
                              position: 'absolute',
                              bottom: '10px',
                              right: '8px',
                              backgroundColor: hoveredId === product._id ? '#ffe6e6' : 'rgba(255, 255, 255, 0.2)',
                              borderRadius: hoveredId === product._id ? '6px' : '50%',
                              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                              display: 'flex',
                              alignItems: 'center', color: 'red'
                              // transition: 'all 0.2s ease',
                            }}
                          >
                            {hoveredId === product._id && (
                              <span
                                style={{
                                  fontSize: '14px',
                                  color: '#ff0000',
                                  marginRight: '8px',
                                  whiteSpace: 'nowrap',
                                  opacity: hoveredId === product._id ? 1 : 0,
                                  transform: hoveredId === product._id ? 'translateX(0)' : 'translateX(10px)',
                                  transition: 'opacity 0.3s, transform 0.3s',
                                }}
                              >
                                Remove from Wishlist
                              </span>
                            )}
                            <HeartBrokenIcon/>
                          </IconButton>
                        </CardMedia>
                        <CardContent style={{ padding: '1rem' }}>
                          <Tooltip title={product.title} placement="top" arrow>
                            <Typography variant="h5" component="div" style={{ fontWeight: 'bold', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {product.title.split(" ").length > 5 ? `${product.title.split(" ").slice(0, 5).join(" ")}...` : product.title}
                            </Typography>
                          </Tooltip>
                          <Typography variant="body1" color="textSecondary" style={{ display: 'inline-block', float: 'right', fontWeight: '500' }}>
                            Price: ₹{product.price}
                          </Typography>
                          <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                            Gender: {product.gender}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            style={{
                              marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis',
                              maxHeight: '4.5rem',  // This keeps the text within three lines based on the line height.
                              lineHeight: '1.5rem'  // Adjust to control exact line spacing.
                            }}>
                            Description: {product.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Typography align="center" padding="1rem" variant="body1">
                    Your wishlist is empty.
                  </Typography>
                )}</Grid>
            )}
          </Box>
        </div>
        {selectedProduct && (
          <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </Box>
    </Layout>
  );
};

export default WishList;
