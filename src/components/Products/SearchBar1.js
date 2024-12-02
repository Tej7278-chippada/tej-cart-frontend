import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  MenuItem,
  Select,
  InputAdornment,
  Grid2,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar1 = ({ onSearch }) => {
  const [searchTerm1, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Order ID");

  const handleSearch = () => {
    onSearch(searchTerm1, filterType);
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <Box sx={{ p: 1, paddingTop: '1rem', width: "100%" }}>
      <Grid2 container spacing={2} alignItems="center">
        {/* Dropdown */}
        <Grid2 item xs={12} sm={4} md={3}>
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            size="small"
            fullWidth
            variant="outlined"
            sx={{
              bgcolor: "background.paper",
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          >
            <MenuItem value="Title">Title</MenuItem>
            <MenuItem value="Price">Price</MenuItem>
            <MenuItem value="Gender">Gender</MenuItem>
            <MenuItem value="Stock Status">Stock Status</MenuItem>
          </Select>
        </Grid2>

        {/* Search Field */}
        <Grid2 item xs={12} sm={8} md={7}>
          <TextField
            value={searchTerm1}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search by ${filterType}`}
            size="small"
            fullWidth
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {/* Search Button */}
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                  {/* Clear Button */}
                  {searchTerm1 && (
                    <IconButton onClick={handleClear}>
                      <CloseIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
            sx={{
              bgcolor: "background.paper",
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />
        </Grid2>
      </Grid2>

      {/* code to place on ProductList */}

      {/* const [searchDialogOpen, setSearchDialogOpen] = useState(false);

      const handleSearch = (searchTerm1, filterType) => {
            const filteredProducts = products.filter((product) => {
            const value =
                filterType === "Title"
                ? product.title
                : filterType === "Price"
                ? product.price
                : filterType === "Gender"
                ? product.gender 
                : filterType === "Stock Status"
                ? product.stockStatus
                : null;

            return value?.toString().toLowerCase().includes(searchTerm1.toLowerCase());
            });

            setSearchResults(filteredProducts);
            setSearchDialogOpen(true);
        };

        const closeSearchDialog = () => {
            setSearchDialogOpen(false);
            setSearchResults([]);
        }; */}



        {/* SearchBar aligned to the right */}
        {/* <Box
          sx={{
            flex: "0 1 auto", marginRight: '1rem',
            width: { xs: "100%", sm: "auto" }, // Full width on small screens
            textAlign: { xs: "center", sm: "right" }, // Center align for small screens
          }}
        >
          <SearchBar1 onSearch={handleSearch} onClose={closeSearchDialog} />
        </Box> */}


      
      {/* <Dialog open={searchDialogOpen} onClose={closeSearchDialog} maxWidth="lg" fullWidth>
        <DialogTitle>Search Results
        <Button style={{ float: 'right', marginTop: '-10px' }} variant="text" onClick={closeSearchDialog}>Close</Button>
        </DialogTitle>
        <DialogContent sx={{scrollbarWidth:'thin'}}>
        <Box
        sx={{
          bgcolor: '#f5f5f5', borderRadius: '8px', margin: '-1rem', paddingInline: '8px', paddingTop: '2rem', paddingBottom: '1rem',
          display: "grid", minHeight: '400px',
          gap: 1,
        }}
      ><Grid container spacing={1}>
          {searchResults.length > 0 ? (
            searchResults.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                
              
              </Grid>
            ))
          ) : (
            <Typography>No results found.</Typography>
          )}
          </Grid>
          </Box>
        </DialogContent>
      </Dialog> */}
    </Box>

    
  );
};

export default SearchBar1;
