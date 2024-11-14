// src/components/ProductList.js
import React, { useState, useEffect, useRef } from 'react';
// import { fetchProducts, likeProduct } from '../api';
// import ProductDetail from './ProductDetail';
import { Card, CardMedia, CardContent, Typography,
  //  IconButton,
    Tooltip, 
    TextField,
    // useMediaQuery,
    IconButton,
    Box,
    Dialog,
    DialogTitle,
    DialogContent} from '@mui/material';
// import { ThumbUp, Comment } from '@mui/icons-material';
// import CommentPopup from './CommentPopup';
import { fetchProducts,
  //  likeProduct 
  } from '../../api/api';
import { Grid } from "@mui/material";
import ProductDetail from './ProductDetail';
import CommentPopup from './CommentPopup';
import Layout from '../Layout';
// import LazyImage from './LazyImage';
import { useTheme } from '@emotion/react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [commentPopupOpen, setCommentPopupOpen] = useState(false);
  const tokenUsername = localStorage.getItem('tokenUsername'); // Get the username from local storage

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const theme = useTheme();
  // const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const searchInputRef = useRef(null);

  useEffect(() => {
    fetchProducts().then((response) => setProducts(response.data))
    .catch((error) => {
      console.error('Error fetching products:', error);
    });
  }, []);

  useEffect(() => {
    if (dialogOpen && searchInputRef.current) {
      searchInputRef.current.focus(); // Explicitly focus the search input when dialog opens
    }
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
      // setLoading(true);
      // Simulate an API call to fetch search results
      // setTimeout(() => {
        // Mocked search results
        const results = products.filter((product) =>
          product.title.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(results);
        // setLoading(false);
      // }, 1000);
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

  // const convertBufferToBase64 = (buffer) => {
  //   return `data:image/jpeg;base64,${buffer.toString('base64')}`;
  // };

  return (
    <Layout username={tokenUsername}>
    <div>
      {/* <h2>Products Page</h2> */}
      {/* <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {products.map((product) => (
          <Card key={product._id} style={{ width: '250px', position: 'relative', cursor: 'pointer' }}
          onClick={() => openProductDetail(product)}>
            <CardMedia>
              <div style={{ display: 'flex', overflowX: 'scroll' }}>
                {product.media.map((file, index) => (
                  <img
                    key={index}
                    src={file}
                    alt={product.title}
                    style={{ width: '100%', objectFit: 'cover' }}
                  />
                ))}
              </div>
            </CardMedia>
            <CardContent>
              <Typography variant="h6">{product.title}</Typography>
              <Typography>₹{product.price}</Typography>
              <Typography>Stock Status: {product.stockStatus}</Typography>
              <Typography>Delivery Days: {product.deliveryDays}</Typography>
              <Typography>Description: {product.description}</Typography>
              <IconButton onClick={() => handleLike(product._id)}>
                <ThumbUp /> {product.likes}
              </IconButton>
              <IconButton onClick={() => openComments(product)}>
                <Comment /> {product.comments.length}
              </IconButton>
            </CardContent>
          </Card>
        ))}
      </div> */}
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
                            // onClick={() => handleImageClick(base64Image)} // Open image in modal on click
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

          <CommentPopup
            open={commentPopupOpen}
            onClose={() => setCommentPopupOpen(false)}
            product={selectedProduct}
          />
      </Box>


                              {/* Products displaying module */}
      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        // backgroundImage: 'url("../assets/bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // filter: 'blur(5px)',
        backdropFilter: 'blur(10px)'
      }}>
      <div style={{ display: 'flex', marginTop: '-2rem' }}><h2>Products Page</h2></div>
      <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product._id}>
          {/* <ProductCard product={product} /> */}
          
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
                    // onClick={() => handleImageClick(base64Image)} // Open image in modal on click
                  />
                ))}
              </div>
            </CardMedia>
          {/* <CardMedia style={{ margin: '1rem 0',
                borderRadius: '8px',
                overflow: 'hidden',
                height: '180px',
                backgroundColor: '#f5f5f5'
              }}>
                  <div style={{
                  display: 'flex',
                  overflowX: 'auto',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#ccc transparent'
                }}>
                    {product.media && product.media.slice(0, 5).map((base64Image, index) => (
                    <img
                      key={index}
                      src={`data:image/jpeg;base64,${base64Image}`}
                      alt={`Product ${index}`}
                      style={{
                        width: '100%', 
                        objectFit: 'cover',
                        borderRadius: '8px',
                        // margin: '0.2rem'
                      }}
                    />
                  ))}
                  </div>
            </CardMedia>
            <CardMedia style={{ margin: '1rem 0',borderRadius: '8px', overflow: 'hidden', height: '200px', backgroundColor: '#f5f5f5' }}>
              <div style={{ borderRadius: '0px', display: 'flex', overflowX: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#ccc transparent' }}>
                {product.media && product.media.slice(0, 5).map((base64Image, index) => (
                  <LazyImage key={index} base64Image={base64Image} alt={`Product ${index}`} style={{  width: '100%', objectFit: 'cover', borderRadius: '8px', }}/>
                ))}
              </div>
              {product.media && product.media.length > 5 && (
                <Typography variant="body2" color="error" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                  Media exceeds its maximum count
                </Typography>
              )}
            </CardMedia> */}
            <CardContent style={{ padding: '1rem' }}>
              <Tooltip title={product.title} placement="top" arrow>
                <Typography variant="h5" component="div" style={{ fontWeight: 'bold', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {product.title.split(" ").length > 5 ? `${product.title.split(" ").slice(0, 5).join(" ")}...` : product.title}
                </Typography>
              </Tooltip>
              {/* <Typography variant="h5" component="div" style={{display: 'inline-block', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {product.title}
              </Typography> */}
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
              
              {/* <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                Description: {product.description}
              </Typography> */}
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
              {/* <div>
                {product.images && product.images.map((image, index) => (
                  <img src={image} alt={`Product ${index}`} key={index} style={{ width: '100%', marginTop: '10px' }} />
                ))}
              </div> */}
            </CardContent>
            {/* <CardContent>
                <Tooltip title={product.title} placement="bottom" arrow>
                  <Typography variant="h5" component="div" style={{
                    display: 'inline-block',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '80%'
                  }}>
                    {product.title.split(" ").length > 5
                      ? `${product.title.split(" ").slice(0, 5).join(" ")}...`
                      : product.title}
                  </Typography>
                </Tooltip>

                <Typography variant="body2" color="textSecondary" style={{ margin: '0.5rem 0' }}>
                  Price: ₹{product.price}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Stock Status: {product.stockStatus}
                </Typography>
                {product.stockStatus === 'In Stock' && (
                  <Typography variant="body2" color="textSecondary">
                    Stock Count: {product.stockCount}
                  </Typography>
                )}
                <Typography variant="body2" color="textSecondary">
                  Gender: {product.gender}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Delivery Days: {product.deliveryDays}
                </Typography>
                <Tooltip title={product.description} placement="bottom" arrow>
                  <Typography variant="body2" color="textSecondary" style={{
                    marginBottom: '0.5rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxHeight: '4.5rem',
                    lineHeight: '1.5rem'
                  }}>
                    Description: {product.description}
                  </Typography>
                </Tooltip> */}

                {/* <IconButton onClick={() => handleLike(product._id)}>
                  <ThumbUp /> {product.likes}
                </IconButton>
                <IconButton onClick={() => openComments(product)}>
                  <Comment /> {product.comments.length}
                </IconButton> */}
              {/* </CardContent> */}
            
            </Card>
           
        </Grid>
      ))}
      
    </Grid>
      </div>
    </div>
    </Layout>
  );
}

export default ProductList;
