// /components/WishList.js
import React, { useEffect, useState } from 'react';
import { fetchProducts, fetchWishlist, removeFromWishlist } from '../../api/api';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, CardMedia, Grid2, Tooltip, Typography } from '@mui/material';
import LazyImage from './LazyImage';
import SkeletonCards from './SkeletonCards';
import ProductDetail from './ProductDetail';

const WishList = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true); // Start loading
        // localStorage.setItem('currentPage', currentPage); // Persist current page to localStorage
        fetchProducts()
          .then((response) => {
            setProducts(response.data);
            // setFilteredProducts(response.data); // Initially display all products
            setLoading(false); // Stop loading
          })
          .catch((error) => {
            console.error("Error fetching products:", error);
            setLoading(false); // Stop loading in case of error
          });
      }, []);

    useEffect(() => {
        const loadWishlist = async () => {
            try {
                const response = await fetchWishlist();
                setWishlist(response.data);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
                setError('Failed to fetch wishlist.');
            } finally {
                setLoading(false);
            }
        };
        loadWishlist();
    }, []);

    const openProductDetail = (product) => {
        setSelectedProduct(product);
      };

    const handleRemove = async (productId) => {
        try {
            await removeFromWishlist(productId);
            setWishlist((prev) => prev.filter((item) => item.productId._id !== productId));
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            alert('Failed to remove product from wishlist.');
        }
    };

    if (loading) return <p>Loading wishlist...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            {selectedProduct && (
            <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
          )}
            <h2>Your Wishlist</h2>
            {wishlist.length === 0 ? (
                <p>Your wishlist is empty.</p>
            ) : (
                <div>
                    {/* {wishlist.map((item) => (
                        <div key={item.productId._id} style={{ marginBottom: '20px' }}>
                            <h3>{item.productId.title}</h3>
                            <p>{item.productId.description}</p>
                            <img
                                src={`data:image/jpeg;base64,${item.productId.media[0]}`}
                                alt={item.productId.title}
                                style={{ maxWidth: '200px', display: 'block' }}
                            />
                            <button onClick={() => navigate(`/product/${item.productId._id}`)}>
                                View Product
                            </button>
                            <button onClick={() => handleRemove(item.productId._id)}>
                                Remove from Wishlist
                            </button>
                        </div>
                    ))} */}
                    <Box sx={{bgcolor: '#f5f5f5', paddingTop: '1rem', paddingBottom: '1rem', paddingInline: '8px', borderRadius:'10px'}} > {/* sx={{ p: 2 }} */}
          {loading ? (
            // renderSkeletonCards()
            <SkeletonCards/>
            // <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "50vh" }}>
            //   <CircularProgress />
            // </Box>
          ) : (
          <Grid2 container spacing={2}>
          {wishlist.map((product) => (
            <Grid2 item xs={12} sm={6} md={4} key={product._id}>
              <Card style={{
                  margin: '0rem 0',  // spacing between up and down cards
                  cursor: 'pointer',
                  backdropFilter: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '8px',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Default shadow
                  transition: 'transform 0.1s ease, box-shadow 0.1s ease', // Smooth transition for hover
                }}
                  // onClick={() => openProductDetail(product)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)'; // Slight zoom on hover
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'; // Enhance shadow
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'; // Revert zoom
                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'; // Revert shadow
                  }} >
                {/* CardMedia for Images with Scroll */}
                <CardMedia sx={{ margin: '0rem 0',borderRadius: '8px', overflow: 'hidden', height: '200px', backgroundColor: '#f5f5f5' }}>
                  <div style={{
                    display: 'flex',
                    overflowX: 'auto',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#888 transparent',
                    borderRadius: '8px',
                    gap: '0.1rem',
                    // marginBottom: '1rem'
                    height:'210px'}} onClick={() => openProductDetail(product)}>
                    {product.media && product.media.slice(0, 5).map((base64Image, index) => (
                      <LazyImage key={index} base64Image={base64Image} alt={`Product ${index}`} style={{
                        height: '200px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        flexShrink: 0,
                        cursor: 'pointer' // Make the image look clickable
                      }}/>
                    ))}
                  </div>
                  {product.media && product.media.length > 5 && (
                    <Typography variant="body2" color="error" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                      Media exceeds its maximum count
                    </Typography>
                  )}
                </CardMedia>
                <CardContent style={{ padding: '1rem' }}>
                  {/* <Tooltip title={product.title} placement="top" arrow>
                    <Typography variant="h5" component="div" style={{ fontWeight: 'bold', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.title.split(" ").length > 5 ? `${product.title.split(" ").slice(0, 5).join(" ")}...` : product.title}
                    </Typography>
                  </Tooltip> */}
                  <Typography variant="body1" color="textSecondary" style={{ display: 'inline-block',float: 'right', fontWeight: '500' }}>
                    Price: ₹{product.price}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" style={{  marginBottom: '0.5rem' }}>
                    Gender: {product.gender}
                  </Typography>
                  <Typography variant="body2" color={product.stockStatus === 'In Stock' ? 'green' : 'red'} style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
                    Stock Status: {product.stockStatus}
                  </Typography>
                  {product.stockStatus === 'In Stock' && (
                    <Typography variant="body2" color="textSecondary" style={{ display: 'inline-block',float: 'right',marginBottom: '0.5rem' }}>
                      Stock Count: {product.stockCount}
                    </Typography>
                  )}
                  {/* <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                    Delivery Days: {product.deliveryDays}
                  </Typography> */}
                  {/* <IconButton
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
                      </IconButton> */}
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    style={{ marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',overflow: 'hidden', textOverflow: 'ellipsis',
                      maxHeight: '4.5rem',  // This keeps the text within three lines based on the line height.
                      lineHeight: '1.5rem'  // Adjust to control exact line spacing.
                    }}>
                    Description: {product.description}
                  </Typography>
                </CardContent>
                    {/* <IconButton onClick={() => handleLike(product._id)}>
                      <ThumbUp /> {product.likes}
                    </IconButton>
                    <IconButton onClick={() => openComments(product)}>
                      <Comment /> {product.comments.length}
                    </IconButton> */}
                
              </Card>
              
            </Grid2>
          ))}
          
          </Grid2>
          )}
        </Box>
                </div>
            )}
        </div>
    );
};

export default WishList;
