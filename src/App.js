// src/App.js
import React from 'react';
import './App.css';
import Chat from './components/Chat';
import Login from './components/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import PrivateRoute from './components/PriviteRoute';
import { ThemeProvider, createTheme } from '@mui/material';
import ForgotPassword from './components/ForgotPassword';
import Admin from './components/Products/Admin';
import ProductList from './components/Products/ProductList';
import WishList from './components/Products/WishList';
import ProductDetailID from './components/Products/ProductDetailID';
// import HomeEditor from './components/Products/Home/HomeEditor';
// import HomePage from './components/Products/Home/HomePage';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

function App() {
  // const [user, setUser] = useState(null);
  // const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm')); // Media query for small screens

  return (
    <ThemeProvider theme={theme}>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Dynamic route for chat page  path="/chat-:username"*/} 
        <Route path="/productList" element={ 
            <PrivateRoute>
              <ProductList />
            </PrivateRoute>
        } />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/wishlist" element={
          <PrivateRoute>
          <WishList />
          </PrivateRoute>
          } />
        <Route path="/product/:id" element={<ProductDetailID />} />
        {/* <Route path="/home" element={<HomePage />} /> */}
          {/* <Route path="/home-editor" element={<PrivateRoute><HomeEditor /></PrivateRoute>} /> */}
      </Routes>
    </Router>
    </ThemeProvider>
  
    
    // <div>
    //   {user ? (
    //     <Chat userId={user._id} receiverId="receiver_id_here" />
    //   ) : (
    //     <Login setUser={setUser} />
    //   )}
    // </div>
  );
}

export default App;
