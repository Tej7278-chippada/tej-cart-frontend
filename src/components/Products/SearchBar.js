import { useTheme } from "@emotion/react";
import { Box, Card, CardContent, CardMedia, Dialog, DialogContent, DialogTitle, Grid, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { fetchProducts } from "../../api/api";
import ProductDetail from "./ProductDetail";
import SkeletonCards from "./SkeletonCards";

function SearchBar() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const theme = useTheme();
    const searchInputRef = useRef(null);

    // Fetch products data
    useEffect(() => {
        setLoading(true); // Start loading
        // localStorage.setItem('currentPage', currentPage); // Persist current page to localStorage
        fetchProducts()
        .then((response) => {
            setProducts(response.data);
            setLoading(false); // Stop loading
        })
        .catch((error) => {
            console.error("Error fetching products:", error);
            setLoading(false); // Stop loading in case of error
        });
    }, []);

    useEffect(() => {
        if (dialogOpen && searchInputRef.current) {
        searchInputRef.current.focus(); // Explicitly focus the search input when dialog opens
        }
    }, [dialogOpen]);

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

    const openProductDetail = (product) => {
        setSelectedProduct(product);
      };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSearchTerm('');
        setSearchResults([]);
    };
    



    return (
        <div>
      {/* Search Bar TextField */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for products..."
        value={searchTerm}
        onChange={handleSearchChange}
        onClick={() => setDialogOpen(true)}
        InputProps={{
          endAdornment: (
            <IconButton>
              <SearchIcon />
            </IconButton>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px",
            bgcolor: theme.palette.background.paper,
          },
          "& .MuiInputBase-input": {
            padding: "10px 14px",
          },
        }}
      />

      {/* Search Results Dialog */}
      {/* <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Tooltip title={searchTerm} placement="top" arrow>
            <Typography
              variant="h6"
              color="textSecondary"
              style={{
                maxWidth: "230px",
                marginBottom: "0.5rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Search Results for "{searchTerm}"
            </Typography>
          </Tooltip>
          <IconButton
            onClick={handleCloseDialog}
            style={{ position: "absolute", right: 8, top: 16 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {searchResults.length > 0 ? (
              searchResults.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Card
                    style={{
                      cursor: "pointer",
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      borderRadius: "8px",
                    }}
                    onClick={() => {
                      onProductSelect(product);
                      handleCloseDialog();
                    }}
                  >
                    <CardMedia>
                      <img
                        src={`data:image/jpeg;base64,${product.media[0]}`}
                        alt={product.title}
                        style={{
                          height: "200px",
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                    </CardMedia>
                    <CardContent>
                      <Typography
                        variant="h5"
                        style={{
                          fontWeight: "bold",
                          marginBottom: "0.5rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {product.title}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        ₹{product.price}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography color="error" variant="h6">
                No results found for "{searchTerm}".
              </Typography>
            )}
          </Grid>
        </DialogContent>
      </Dialog> */}
      
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
            <Box > {/* sx={{ p: 2 }} */}
          {loading ? (
            // renderSkeletonCards()
            <SkeletonCards/>
            // <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "50vh" }}>
            //   <CircularProgress />
            // </Box>
          ) : (
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
              </Grid>)}
              </Box>
            </DialogContent>
            {selectedProduct && (
            <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
          )}
          </Dialog>
          
    </div>
    );




}
export default SearchBar;