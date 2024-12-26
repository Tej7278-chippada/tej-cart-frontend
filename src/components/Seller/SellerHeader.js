// SellerHeader.js
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, TextField, List, ListItem, ListItemText, Box, CircularProgress, Paper, useMediaQuery, IconButton, Menu, MenuItem, Dialog, } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const SellerHeader = ({ usernameSeller }) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if screen size is small
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loggedInSellers, setLoggedInSellers] = useState([]);
  const navigate = useNavigate();
  const [currentUsernameSeller, setCurrentUsernameSeller] = useState(usernameSeller || '');

  // Only show search bar when user is logged in and on chat page
  // const showSearchBar = location.pathname.includes('/productList') && username;



  // Load logged-in users from localStorage
  useEffect(() => {
    const sellers = JSON.parse(localStorage.getItem('loggedInSellers')) || [];
    setLoggedInSellers(sellers);

    // Load the last active user from localStorage if available
    const activeSeller = localStorage.getItem('activeSeller');
    if (activeSeller) {
      const tokens = JSON.parse(localStorage.getItem('authTokensSeller')) || {};
    const activeTokenSeller = tokens[usernameSeller];
    if (activeTokenSeller) {
      localStorage.setItem('authTokenSeller', activeTokenSeller); // Ensure the correct token is set
    }
      setCurrentUsernameSeller(activeSeller);
    }
  }, [usernameSeller]);

  // useEffect(() => {
  //   // Add current user to the list if not already present
  //   if (username && !loggedInUsers.includes(username)) {
  //     const updatedUsers = [...loggedInUsers, username];
  //     setLoggedInUsers(updatedUsers);
  //     localStorage.setItem('loggedInUsers', JSON.stringify(updatedUsers));
  //   }
  // }, [username, loggedInUsers]);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    const tokens = JSON.parse(localStorage.getItem('authTokensSeller')) || {};
    delete tokens[currentUsernameSeller]; // Remove current user's token
    localStorage.setItem('authTokensSeller', JSON.stringify(tokens));
    
    // Remove current user from logged-in users list
    const updatedSellers = loggedInSellers.filter(seller => seller !== currentUsernameSeller);
    localStorage.setItem('loggedInSellers', JSON.stringify(updatedSellers));
    setLoggedInSellers(updatedSellers);
    localStorage.removeItem('authTokenSeller'); // Clear current session token
    setAnchorEl(null);
    setCurrentUsernameSeller('');
    localStorage.removeItem('activeSeller'); // Clear active user on logout
    localStorage.removeItem('tokenSellerUsername'); 
    localStorage.removeItem('sellerId'); 
    localStorage.removeItem('currentPage'); 
    navigate('/sellerLogin');
  };
  
  const handleSwitchProfile = () => {
    setOpenDialog(true);
    setAnchorEl(null);
  };

  const handleSelectUser = (seller) => {
    if (seller === 'Login with another seller account') {
      navigate('/sellerLogin');
    } else {
      const tokens = JSON.parse(localStorage.getItem('authTokensSeller')) || {};
      const authTokenSeller = tokens[seller];
  
      if (!authTokenSeller) {
        console.error(`No auth token found for ${seller}`);
        return;
      }
  
      // Set the selected user's token as the active auth token
      localStorage.setItem('authTokenSeller', authTokenSeller);
      localStorage.setItem('activeUserSeller', seller); // Set active user in localStorage
      setCurrentUsernameSeller(seller); // Update current username state
      navigate('/sellerProducts');
    }
    setOpenDialog(false);
  };

  // After successful login, update loggedInUsers and authTokens in localStorage
  useEffect(() => {
    if (usernameSeller) {
      const sellers = JSON.parse(localStorage.getItem('loggedInSellers')) || [];
      if (!sellers.includes(usernameSeller)) {
        sellers.push(usernameSeller);
        localStorage.setItem('loggedInSellers', JSON.stringify(sellers));
      }

      // Store each user's auth token
      const tokens = JSON.parse(localStorage.getItem('authTokensSeller')) || {};
      tokens[usernameSeller] = localStorage.getItem('authTokenSeller'); // Save current token
      localStorage.setItem('authTokensSeller', JSON.stringify(tokens));
      setCurrentUsernameSeller(usernameSeller); // Set initial username on login
      localStorage.setItem('activeSeller', usernameSeller); // Save active user
    }
  }, [usernameSeller]);

  // Handle search input change
  const handleSearchChange = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value) {
      setLoading(true);
      try {                             // `https://tej-chat-app-8cd7e70052a5.herokuapp.com/api/users/search`
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/seller/searchSeller`, {
          params: { username: value }
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching usernames:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
        <Typography variant={isMobile ? "h6" : "h5"} component="div" sx={{ flexGrow: 1 }}>
          <Link to="/sellerLogin" style={{ color: 'inherit', textDecoration: 'none', display: 'inline-block' }}>
            TejCart
          </Link>
        </Typography>
        {/* <Link to="/admin" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Admin Page</Link> */}
        {/* Search Bar */}
        {location.pathname.includes('/sellerProducts') && currentUsernameSeller && (
            <Box display="flex" alignItems="center" mr={2}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search usernames"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{ endAdornment: <SearchIcon /> }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                    bgcolor: 'transparent', //theme.palette.background.paper
                    // backgroundColor:'white'
                  },
                  '& .MuiInputBase-input': {
                    padding: '10px 14px',
                  },
                  width: isMobile ? 130 : 200
                }}
              />
              
              {searchTerm && (
                <Paper elevation={3} sx={{ position: 'absolute', top: '80%', mt: 1, zIndex: 10, maxWidth: isMobile ? 200 : 250 }}>
                  <List style={{
                    position: 'absolute', background: 'white', width: isMobile ? 200 : 250,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)', borderRadius: '4px'
                  }}>
                    {loading ? (
                      <ListItem>
                        <CircularProgress size={20} />
                      </ListItem>
                    ) : (
                      searchResults.length > 0 ? (
                        searchResults.map((seller) => (
                          <ListItem key={seller.usernameSeller}>
                            <CheckCircleIcon style={{ color: 'green' }} />
                            <ListItemText primary={seller.usernameSeller} />
                          </ListItem>
                        ))
                      ) : (
                        <ListItem>
                          <ListItemText primary="Searched username doesn't match any existing seller username" />
                        </ListItem>
                      )
                    )}
                  </List>
                </Paper>
              )}
            </Box>
          )}
          {/* {location.pathname === '/productList' && username && (
            <Typography variant="body1" 
            // sx={{ display: isMobile ? 'none' : 'block' }}
            >
              {username}
            </Typography>
          )} */}
          {currentUsernameSeller && (
            <>
              <IconButton onClick={handleProfileClick} color="inherit">
                <AccountCircleIcon />
                <Typography variant="body1">{currentUsernameSeller}</Typography>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
                <MenuItem onClick={handleSwitchProfile}>Switch Profile</MenuItem>
              </Menu>
              <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <List style={{ cursor: 'pointer' }}>
                  <ListItem button onClick={() => handleSelectUser('Login with another account')}>
                    <ListItemText primary="Login with another account" />
                  </ListItem>
                  {loggedInSellers.map((seller) => (
                    <ListItem button key={seller} onClick={() => handleSelectUser(seller)}>
                      <ListItemText primary={seller} />
                    </ListItem>
                  ))}
                </List>
              </Dialog>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default SellerHeader;
