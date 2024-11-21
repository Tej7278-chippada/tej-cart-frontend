// src/components/ProductList.js
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardMedia, CardContent, Typography, Tooltip, TextField, IconButton, Box, Dialog, DialogTitle, DialogContent, Toolbar, Button} from '@mui/material';
import { addToWishlist, fetchProducts } from '../../api/api';
import { Grid } from "@mui/material";
import ProductDetail from './ProductDetail';
import CommentPopup from './CommentPopup';
import Layout from '../Layout';
import { useTheme } from '@emotion/react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from 'react-router-dom';
import LazyImage from './LazyImage';
import SkeletonCards from './SkeletonCards';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const tokenUsername = localStorage.getItem('tokenUsername'); // Get the username from local storage
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const theme = useTheme();
  const searchInputRef = useRef(null);
  // Calculate pagination
  const [currentPage, setCurrentPage] = useState(parseInt(localStorage.getItem('currentPage')) || 1);
  const [productsPerPage] = useState(12); // Show six products per page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);
  const [hoveredDots, setHoveredDots] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = () =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    const handleScroll = () => {
    setIsScrolling(true);
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 5000);
  };
  const navigate = useNavigate();
  
 

  // Fetch products data
  useEffect(() => {
    setLoading(true); // Start loading
    localStorage.setItem('currentPage', currentPage); // Persist current page to localStorage
    fetchProducts()
      .then((response) => {
        setProducts(response.data);
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false); // Stop loading in case of error
      });
  }, [currentPage]);

  useEffect(() => {
    if (dialogOpen && searchInputRef.current) {
      searchInputRef.current.focus(); // Explicitly focus the search input when dialog opens
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [dialogOpen]);

  // const handleLike = async (productId) => {
  //   await likeProduct(productId);
  //   fetchProducts().then((response) => setProducts(response.data)); // Refresh product list with updated likes
  // };

  // const openComments = (product) => {
  //   setSelectedProduct(product);
  //   setCommentPopupOpen(true);
  // };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim()) {
      const results = products.filter((product) =>
        product.title.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
      setDialogOpen(true);
    } else {
      setSearchResults([]);
      // setDialogOpen(false);
    }
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  }

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  const openProductDetail = (product) => {
    setSelectedProduct(product);
  };

  const renderPagination = () => {
    const paginationItems = [];
    if (currentPage > 1) paginationItems.push(1);
    if (currentPage > 2) paginationItems.push('...');
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      paginationItems.push(i);
    }
    if (currentPage < totalPages - 1) paginationItems.push('...');
    if (currentPage < totalPages) paginationItems.push(totalPages);

    return (
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: theme.spacing(1),
          mt: theme.spacing(2),
          p: theme.spacing(2),
          bgcolor: theme.palette.background.paper,
          borderRadius: '10px',
          boxShadow: theme.shadows[1],
        }}
      >
        <Button
          variant="outlined"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          sx={{
            fontSize: '0.875rem',
            minWidth: '50px',
            textTransform: 'capitalize',
          }}
        >
          First
        </Button>

        {paginationItems.map((item, index) => {
          if (item === '...') {
            return (
              <Tooltip
                key={index}
                title={
                  <Box>
                    <Typography variant="body2">Available Pages:</Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <Button
                          key={i}
                          size="small"
                          onClick={() => setCurrentPage(i + 1)}
                          sx={{
                            fontSize: '0.75rem',
                            minWidth: '40px',
                            textTransform: 'capitalize',
                          }}
                        >
                          {i + 1}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                }
                placement="top"
                arrow
              >
                <Typography
                  variant="body1"
                  sx={{
                    cursor: 'pointer',
                    color: theme.palette.text.secondary,
                    padding: '0 8px',
                    '&:hover': {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  ...
                </Typography>
              </Tooltip>
            );
          }
          return (
            <Button
              key={index}
              variant={item === currentPage ? 'contained' : 'outlined'}
              onClick={() => setCurrentPage(item)}
              sx={{
                fontSize: '0.875rem',
                minWidth: '50px',
                textTransform: 'capitalize',
              }}
            >
              {item}
            </Button>
          );
        })}

        <Button
          variant="outlined"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          sx={{
            fontSize: '0.875rem',
            minWidth: '50px',
            textTransform: 'capitalize',
          }}
        >
          Last
        </Button>
      </Box>
      );
  };


  
  

  return (
    <Layout username={tokenUsername}>
    <div>
        {/* Search Bar module */}
      <Box display="flex" alignItems="center" p={2} sx={{ maxWidth: 600, mx: 'auto' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={handleSearchChange}
          onClick={handleOpenDialog}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              bgcolor: theme.palette.background.paper,
            },
            '& .MuiInputBase-input': {
              padding: '10px 14px',
            },
          }}
        />
          {selectedProduct && (
            <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
          )}

          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} xs={12} sm={6} md={4}  maxWidth="md" fullWidth  >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={handleSearchChange} 
              inputRef={searchInputRef} // Use ref here 
              /* autoFocus  // Auto-focuses when the dialog opens */
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                  bgcolor: theme.palette.background.paper,
                },
                '& .MuiInputBase-input': {
                  padding: '10px 14px',
                }, maxWidth: 600, mx: 'auto', paddingTop: '1rem'
              }}
            />
            <DialogTitle>
              {/* Search Results of ({searchTerm}) */}
              <Tooltip title={searchTerm} placement="top" arrow>
                <Typography variant="h6" component="div" color="textSecondary" style={{ maxWidth:'230px', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Search of  ({searchTerm.split(" ").length > 5 ? `${searchTerm.split(" ").slice(0, 5).join(" ")}...` : searchTerm})
                </Typography>
              </Tooltip>
              <IconButton 
                onClick={handleCloseDialog} //() => setDialogOpen(false)
                style={{ position: 'absolute', right: 8, top: 70 }}>
                <CloseIcon title="Close"/>
              </IconButton>
            </DialogTitle>
            <DialogContent>
            <Grid container spacing={3}>
              {searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Card style={{
                      margin: '1rem 0',
                      cursor: 'pointer',
                      backdropFilter: 'none',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: '8px'
                    }}
                      onClick={() => openProductDetail(product)} >
                    <CardMedia>
                      <div style={{
                        display: 'flex',
                        overflowX: 'auto',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#888 transparent',
                        borderRadius: '8px',
                        gap: '0.1rem',
                        // marginBottom: '1rem'
                        height: '210px'
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
                          />
                        ))}
                      </div>
                    </CardMedia>
                    <CardContent style={{ padding: '1rem' }}>
                      <Tooltip title={product.title} placement="top" arrow>
                        <Typography variant="h5" component="div" style={{ fontWeight: 'bold', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {product.title.split(" ").length > 5 ? `${product.title.split(" ").slice(0, 5).join(" ")}...` : product.title}
                        </Typography>
                      </Tooltip>
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
                      <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                        Delivery Days: {product.deliveryDays}
                      </Typography>
                      <Tooltip title={product.description} placement="bottom" arrow>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          style={{ marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',overflow: 'hidden', textOverflow: 'ellipsis',
                            maxHeight: '4.5rem',  // This keeps the text within three lines based on the line height.
                            lineHeight: '1.5rem'  // Adjust to control exact line spacing.
                          }}>
                          Description: {product.description}
                        </Typography>
                      </Tooltip>
                    </CardContent>
                  </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12} sm={6} md={4} minHeight={440} > {/* minWidth={950} */}
                  <Typography style={{color:'red', fontWeight: 'bold', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Results not found for keyword ({searchTerm}).</Typography>
                </Grid>
              )}
              </Grid>
            </DialogContent>
          </Dialog>

          {/* <CommentPopup
            open={commentPopupOpen}
            onClose={() => setCommentPopupOpen(false)}
            product={selectedProduct}
          /> */}
      </Box>

        {/* Products displaying module */}
      <Toolbar > {/* style={{ display: 'flex', marginTop: '5rem', marginBottom: '-3rem' }} */}
          <Typography variant="h6" style={{ flexGrow: 1, marginRight:'2rem' }}>
          Products Page
          </Typography> 
          <Link to="/admin" style={{ color: 'blue', textDecoration: 'none', marginRight: '15px' }}>Admin Page</Link>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/wishlist')}
            sx={{ marginRight: '15px' }}
          >
            Wishlist
          </Button>
      </Toolbar>
      <div style={{
        marginTop: '-1rem',
        padding: '1rem',
        // backgroundImage: 'url("../assets/bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // filter: 'blur(5px)',
        backdropFilter: 'blur(10px)'
        }}>
        
        {/* <div style={{ display: 'flex', marginTop: '-2rem' }}><h2>Products Page</h2></div> */}
        <Box > {/* sx={{ p: 2 }} */}
          {loading ? (
            // renderSkeletonCards()
            <SkeletonCards/>
            // <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "50vh" }}>
            //   <CircularProgress />
            // </Box>
          ) : (
          <Grid container spacing={2}>
          {currentProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card style={{
                  margin: '0rem 0',  // spacing between up and down cards
                  cursor: 'pointer',
                  backdropFilter: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '8px',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Default shadow
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition for hover
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
                <CardMedia style={{ margin: '0rem 0',borderRadius: '8px', overflow: 'hidden', height: '200px', backgroundColor: '#f5f5f5' }}>
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
                  <Tooltip title={product.title} placement="top" arrow>
                    <Typography variant="h5" component="div" style={{ fontWeight: 'bold', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {product.title.split(" ").length > 5 ? `${product.title.split(" ").slice(0, 5).join(" ")}...` : product.title}
                    </Typography>
                  </Tooltip>
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
                  <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                    Delivery Days: {product.deliveryDays}
                  </Typography>
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
              
            </Grid>
          ))}
          
          </Grid>
          )}
        </Box>

        {/* Pagination */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 4,
            p: 2,
            // bgcolor: theme.palette.background.paper,
            // borderRadius: '10px',
            // boxShadow: theme.shadows[2],
          }}
        >
          {renderPagination()}
        </Box>
        {hoveredDots && (
          <Dialog open={hoveredDots} onClose={() => setHoveredDots(false)}>
            <DialogTitle>All Pages</DialogTitle>
            <DialogContent>
              <Box display="flex" flexWrap="wrap" gap={2}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button key={i} onClick={() => { setCurrentPage(i + 1);
                    setHoveredDots(false); // Close the dialog after selecting a page
                    }}>
                    {i + 1}
                  </Button>
                ))}
              </Box>
            </DialogContent>
          </Dialog>
        )}
      
      </div>

      {/* Add floating buttons */}
      {isScrolling && (
          <Box
            sx={{
              position: 'fixed',
              bottom: '16px',
              right: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              zIndex: 1000,
            }}
          >
            <Tooltip title="Scroll to top" placement="right" arrow>
              <IconButton
                onClick={scrollToTop}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                <ArrowUpwardIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Scroll to bottom" placement="right" arrow>
              <IconButton
                onClick={scrollToBottom}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                <ArrowDownwardIcon />
              </IconButton>
            </Tooltip>
          </Box>
      )}
    </div>
    </Layout>
  );
}

export default ProductList;
