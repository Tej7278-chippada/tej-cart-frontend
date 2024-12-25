// src/components/Admin.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Card, CardContent, CardActions, Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Toolbar, CardMedia, Alert, 
    Tooltip,
    Snackbar,
    Box,
    IconButton} from '@mui/material';
import { addProduct, deleteProduct, fetchProducts, updateProduct } from '../../api/api';
// import ProductCard from "../components/ProductCard";
import { Grid } from "@mui/material";
// import LazyImage from './LazyImage';
// import ProductDetail from './ProductDetail';
// import Layout from '../Layout';
import { Link, useNavigate } from 'react-router-dom';
// import SkeletonCards from './SkeletonCards';
import { useTheme } from '@emotion/react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import SearchBar from './SearchBar';
import AddIcon from '@mui/icons-material/Add';
import SellerLayout from './SellerLayout';
import SearchBar from '../Products/SearchBar';
import ProductDetail from '../Products/ProductDetail';
import SkeletonCards from '../Products/SkeletonCards';
import LazyImage from '../Products/LazyImage';
import { addSellerProduct, deleteSellerProduct, fetchAllProducts, fetchMySellerProducts, updateSellerProduct } from '../../api/sellerApi';
import SellerProductDetails from './SellerProductDetails';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// const LazyImage = React.memo(({ base64Image, alt }) => (
//   <img
//     src={`data:image/jpeg;base64,${base64Image}`}
//     alt={alt}
//     loading="lazy" // enables lazy loading for better performance
//     style={{ width: '100%', marginTop: '10px', objectFit: 'cover' }}
//   />
// ));

function SellerProducts() {
  const [openDialog, setOpenDialog] = useState(false);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    stockStatus: '',
    stockCount: '',
    gender: '',
    deliveryDays: '',
    description: '',
    media: null,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [existingMedia, setExistingMedia] = useState([]);
  const [newMedia, setNewMedia] = useState([]);
  const [mediaError, setMediaError] = useState('');
  const [loading, setLoading] = useState(false); // to show loading state
  const [submitError, setSubmitError] = useState(''); // Error for failed product submission
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' }); // For notifications
  const theme = useTheme();
  const navigate = useNavigate();
  // Calculate pagination
  const [currentPage, setCurrentPage] = useState(parseInt(localStorage.getItem('currentPage')) || 1);
  const [productsPerPage] = useState(12); // Show six products per page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);
  const [hoveredDots, setHoveredDots] = useState(false);

  // const handlePageChange = (event, value) => setCurrentPage(value);

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

  const fetchProductsData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchMySellerProducts();
      setProducts(response.data); // Set products returned by the API
    } catch (error) {
      console.error('Error fetching seller products:', error);
      setNotification({ open: true, message: 'Failed to fetch products.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // fetchProducts().then((response) => setProducts(response.data));
    localStorage.setItem('currentPage', currentPage); // Persist current page to localStorage
    fetchProductsData();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [fetchProductsData, currentPage]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading state
    const data = new FormData();

    // Add only new media files to FormData
    newMedia.forEach((file) => data.append('media', file));
    // Append form data
    Object.keys(formData).forEach(key => {
      if (key !== 'media') data.append(key, formData[key]);
    });

    // Pass existing media IDs to keep them in the database
    if (existingMedia.length > 0) {
      data.append('existingMedia', JSON.stringify(existingMedia.filter(media => !media.remove).map(media => media._id)));
    }
    try {
      if (editingProduct) {
        await updateSellerProduct(editingProduct._id, data);
        showNotification(`${formData.title} details updated successfully.`, 'success');
      } else {
        await addSellerProduct(data);
        showNotification(`New Product "${formData.title}" is added successfully.`, 'success');
      }
      await fetchProductsData(); // Refresh products list
      handleCloseDialog();       // Close dialog
    } catch (error) {
      console.error("Error submitting product:", error);
      showNotification(
        editingProduct
          ? `${formData.title} details can't be updated, please try again later.`
          : `New product can't be added, please try again later.`,
        'error'
      );
    } finally {
      setLoading(false); // Stop loading state
    }
  };
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      price: product.price,
      categories: product.categories,
      gender: product.gender,
      stockStatus: product.stockStatus,
      stockCount: product.stockCount,
      deliveryDays: product.deliveryDays,
      description: product.description,
      media: null, // Reset images to avoid re-uploading
    });
    setExistingMedia(product.media.map((media) => ({ ...media, remove: false })));
    setOpenDialog(true);
  };

  const handleDeleteMedia = (mediaId) => {
    setExistingMedia(existingMedia.map(media => media._id === mediaId ? { ...media, remove: true } : media));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
  
    // Filter files larger than 2MB
    const oversizedFiles = selectedFiles.filter(file => file.size > 2 * 1024 * 1024);
    const totalMediaCount = selectedFiles.length + existingMedia.filter((media) => !media.remove).length;
  
    // Check for conditions and update errors
    if (oversizedFiles.length > 0 && totalMediaCount > 5) {
      setMediaError("Photo size must be less than 2MB && Maximum 5 photos allowed.");
    } else if (oversizedFiles.length > 0 || totalMediaCount > 5) {
      setMediaError(
        `${oversizedFiles.length > 0 ? "Files must be under 2MB each." : ""} ${totalMediaCount > 5 ? "Maximum 5 photos allowed." : ""}`
      );
    } else {
      setMediaError("");
  
      // Append newly selected files at the end of the existing array
      setNewMedia(prevMedia => [...prevMedia, ...selectedFiles]);
    }
  };
  const handleDelete = async (productId) => {
    const product = products.find((p) => p._id === productId); // Find the product to get its title
  
    if (!product) {
      showNotification("Product not found for deletion.", "error");
      return;
    }
  
    try {
      await deleteSellerProduct(productId);
      showNotification(`Product "${product.title}" deleted successfully.`, "success");
      await fetchProductsData(); // Refresh products list
    } catch (error) {
      console.error("Error deleting product:", error);
      showNotification(`Failed to delete "${product.title}". Please try again later.`, "error");
    }
  };

  const showNotification = (message, severity) => {
    setNotification({ open: true, message, severity });
  };

  const handleOpenDialog = () => {
    // Reset form data to empty
    setFormData({
        title: '',
        price: '',
        categories: '',
        gender: '',
        stockStatus: '',
        stockCount: '',
        deliveryDays: '',
        description: '',
        media: null,
    });
    setEditingProduct(null); // Ensure it's not in editing mode
    setExistingMedia([]); // Clear any existing media
    setNewMedia([]); // Clear new media files
    setOpenDialog(true);
};

  const handleCloseDialog = () => {
    setEditingProduct(null);
    setExistingMedia([]);
    setNewMedia([]);
    setOpenDialog(false);
    setMediaError('');
    setSubmitError(''); // Clear submission error when dialog is closed
    setFormData({ title: '', price: '', categories: '', gender: '', stockStatus: '', stockCount: '', deliveryDays: '', description: '', media: null });
  };

  // const refreshProducts = async () => {
  //   // Fetch updated product list
  //   const response = await fetchProducts();
  //   setProducts(response.data);
  // };

  // const resetFormData = () => {
  //   setFormData({
  //     title: '',
  //     price: '',
  //     stockStatus: '',
  //     stockCount: '',
  //     gender: '',
  //     deliveryDays: '',
  //     description: '',
  //     images: null,
  //   });
  // };

  const openProductDetail = (product) => {
    navigate(`/productSeller/${product._id}`);
  };
  const openSellerProfile = () => {
    const sellerId = localStorage.getItem('sellerId'); 
    navigate(`/seller/${sellerId}`, { replace: true });
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
    <SellerLayout >
    <div >
    {/* <div style={{ display: 'flex', marginTop: '2rem' }}><h2>Products Page</h2></div> */}
      {/* <h2>Admin Page</h2> */}
      
        <Toolbar > {/* style={{ display: 'flex', marginTop: '5rem', marginBottom: '-3rem' }} */}
            <Typography variant="h6" style={{ flexGrow: 1 }}>
            Seller Products
            </Typography>
            <SearchBar 
              products={products} 
              onProductSelect={openProductDetail} 
            />
            <Link to="/allProducts" style={{ color: 'blue', textDecoration: 'none', marginRight: '15px', paddingLeft: '1rem' }}>Products Page</Link>
            {/* <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                Add Product
            </Button> */}
            <Button
              variant="contained"
              onClick={() => handleOpenDialog()}
              sx={{
                backgroundColor: '#1976d2', // Primary blue
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '24px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  backgroundColor: '#1565c0', // Darker shade on hover
                },
                display: 'flex',
                alignItems: 'center',
                gap: '8px', marginRight: '10px'
              }}
            >
              <AddIcon sx={{ fontSize: '20px' }} />
              {/* <span style={{ fontSize: '14px', fontWeight: '500' }}>Add Product</span> */}
            </Button>
            <Button
              variant="contained"
              onClick={() => openSellerProfile()}
              sx={{
                backgroundColor: '#1976d2', // Primary blue
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '24px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  backgroundColor: '#1565c0', // Darker shade on hover
                },
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <AccountCircleIcon sx={{ fontSize: '20px' }} />
              {/* <span style={{ fontSize: '14px', fontWeight: '500' }}>Add Product</span> */}
            </Button>
        </Toolbar>
      {/* <Link to="/productList" style={{ color: 'blue', textDecoration: 'none', marginRight: '15px' }}>Products Page</Link> */}


        {selectedProduct && (
        <SellerProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}


      <Dialog  open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
        <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
        <DialogContent style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0rem' }}>
          <Card style={{borderRadius:'1rem'}}>
          {/* Existing media with delete option */}
          {existingMedia.length > 0 && (
          <div style={{marginBottom:'1rem', margin:'1rem'}}>
            <Typography variant="subtitle1">Existing Images</Typography>
            <div style={{ display: 'flex', overflowX: 'scroll', scrollbarWidth: 'none', scrollbarColor: '#888 transparent' }}>
              {existingMedia.map((media) => (
                !media.remove && (
                  <div key={media._id} style={{ position: 'relative', margin: '5px' }}>
                    <img src={`data:image/jpeg;base64,${media.data}`} alt="Product Media" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                    <Button size="small" color="secondary" onClick={() => handleDeleteMedia(media._id)}>Remove</Button>
                  </div>
                )
                
              ))}
              
            </div>
            {/* <img src={media.data} alt="Product Media" style={{ width: '100px', height: '100px', objectFit: 'cover' }} /> */}
          </div>
          )}</Card>
          <Card style={{borderRadius:'1rem', marginBottom:'2rem'}}>
          <div style={{marginBottom:'1rem', margin:'1rem'}}>
            <Typography variant="subtitle1">Add Product Photos</Typography>    
              <input type="file" multiple onChange={handleFileChange} /> 
              {/* onChange={(e) => setFormData({ ...formData, images: e.target.files })} */}
              <Typography variant="body2">Note : Maximum 5 Photos & Each Photo size should less than 2 MB</Typography>    
              {mediaError && <Alert severity="error">{mediaError}</Alert>}
              {newMedia.length > 0 && (
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', overflowX: 'auto'  , scrollbarWidth: 'none', scrollbarColor: '#888 transparent'}}>
                  {newMedia.map((file, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`Preview ${index}`} 
                        style={{
                              height: '200px',
                              borderRadius: '8px',
                              objectFit: 'cover',
                              flexShrink: 0,
                              cursor: 'pointer' // Make the image look clickable
                            }}
                      />
                      <Button 
                        size="small" 
                        color="secondary" 
                        onClick={() => setNewMedia((prev) => prev.filter((_, i) => i !== index))}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
          </div></Card>
          <TextField 
            label="Title" 
            fullWidth 
            value={formData.title} 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
            required 
          />
          <FormControl fullWidth>
              <InputLabel>Categories</InputLabel>
              <Select 
                value={formData.categories} 
                onChange={(e) => setFormData({ ...formData, categories: e.target.value })} 
                required
              >
                <MenuItem value="Clothing">Clothing</MenuItem>
                <MenuItem value="Footwear">Footwear</MenuItem>
                <MenuItem value="Accessories">Accessories</MenuItem>
              </Select>
            </FormControl>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <TextField 
              label="Price (INR)" 
              type="number" 
              fullWidth 
              value={formData.price} 
              onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
              required 
            />
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select 
                value={formData.gender} 
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })} 
                required
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Kids">Kids</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <FormControl fullWidth required>
              <InputLabel>Stock Status</InputLabel>
              <Select 
                value={formData.stockStatus} 
                onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value })} 
                required
              >
                <MenuItem value="In Stock">In Stock</MenuItem>
                <MenuItem value="Out-of-stock">Out-of-stock</MenuItem>
                <MenuItem value="Getting Ready">Getting Ready</MenuItem>
              </Select>
            </FormControl>
            {formData.stockStatus === 'In Stock' && (
              <TextField 
                label="Stock Count" 
                type="number" 
                fullWidth 
                value={formData.stockCount} 
                onChange={(e) => setFormData({ ...formData, stockCount: e.target.value })} required
              />
            )}
          </div>
          <TextField 
            label="Delivery Days" 
            type="number" 
            fullWidth 
            value={formData.deliveryDays} 
            onChange={(e) => setFormData({ ...formData, deliveryDays: e.target.value })} 
            required 
          />
          <TextField 
            label="Description" 
            multiline 
            rows={6} 
            fullWidth 
            value={formData.description} 
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
            required 
          />
          
          
        </DialogContent>
        {submitError && <Alert severity="error" style={{ margin: '1rem' }}>{submitError}</Alert>} 
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading} 
            style={loading ? { cursor: 'wait' } : {}}
          >
          {loading ? 'Processing...' : (editingProduct ? 'Update Product' : 'Add Product')}
          </Button>
        </DialogActions>
        </form>
        
      </Dialog>
      




      {/* Product cards */}
      <div style={{ position: 'relative', overflow: 'hidden',  }}>
        {/* Blurred Background Image */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        // backgroundImage: 'url("../assets/bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // filter: 'blur(10px)',
        zIndex: -1
      }}></div>
      <div style={{ marginTop: '0rem', padding: '1rem', position: 'relative', zIndex: 1 }}>
      {/* {loading && <div style={{ marginTop: '1rem', padding: '1rem', position: 'relative' }}>Loading products...</div>} */}
      <Box sx={{bgcolor: '#f5f5f5', paddingTop: '1rem', paddingBottom: '1rem', paddingInline: '8px', borderRadius:'10px'}}> {/* sx={{ p: 2 }} */}
        {loading ? (
          <SkeletonCards/>
        ) : (
      <Grid container spacing={2}>
      {currentProducts.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product._id}>
          {/* <ProductCard product={product} /> */}
          <Card style={{ margin: '0rem 0', borderRadius: '8px', overflow: 'hidden',  background: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Default shadow boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transition for hover
               }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)'; // Slight zoom on hover
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)'; // Enhance shadow
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'; // Revert zoom
                e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'; // Revert shadow
              }}
          >
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
              <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                Seller : {product.sellerTitle}
              </Typography>
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
            <CardActions style={{ justifyContent: 'space-between', padding: '0.5rem 1rem' }}>
              <Button color="primary" onClick={() => handleEdit(product)}>Edit</Button> {/* variant="contained" */}
              <Button color="secondary" onClick={() => handleDelete(product._id)}>Delete</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
      </Grid>)}
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
      {/* Snackbar for notifications */}
      <Snackbar
        open={notification.open}
        autoHideDuration={9000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>

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
    </div>
    </SellerLayout>
  );
}

export default SellerProducts;
