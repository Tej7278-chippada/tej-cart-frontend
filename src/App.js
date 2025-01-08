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
import SellerRegister from './components/Seller/SellerRegister';
import SellerLogin from './components/Seller/SellerLogin';
import SellerProducts from './components/Seller/SellerProducts';
import SellerPrivateRoute from './components/Seller/SellerPrivateRoute';
import AllProducts from './components/Seller/allProducts';
import SellerProductDetails from './components/Seller/SellerProductDetails';
import SellerProfile from './components/Seller/SellerProfile';
import UserProfile from './components/UserProfile';
import OrderPage from './components/Products/OrderPage';
import MyOrders from './components/Products/MyOrders';
import OrderDetails from './components/Products/OrderDetails';
import SellerOrders from './components/Seller/SellerOrders';
import SellerMyOrders from './components/Seller/sellerMyOrders';
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
        <Route path="/user/:id" element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>} 
        />
        <Route path="/order/:id" element={
          <PrivateRoute>
            <OrderPage />
          </PrivateRoute>} 
        />
        <Route path="/register" element={<Register />} />
        <Route path="/sellerRegister" element={<SellerRegister />} />
        <Route path="/sellerLogin" element={<SellerLogin />} />
        <Route path='/sellerProducts' element={
          <SellerPrivateRoute>
          <SellerProducts/>
          </SellerPrivateRoute>
        } />
        <Route path="/allProducts" element={<AllProducts />} />
        <Route path="/productSeller/:id" element={<SellerProductDetails />} />
        {/* <Route path="/seller-profile-:sellerId" element={
            <SellerPrivateRoute>
              <SellerProfile />
            </SellerPrivateRoute>
          } /> */}
        <Route path="/seller/:id" element={
          <SellerPrivateRoute>
          <SellerProfile />
        </SellerPrivateRoute>} />
        <Route path="/sellerOrders" element={
          <SellerPrivateRoute>
          <SellerMyOrders />
          </SellerPrivateRoute>
        } />
        
        <Route path="/my-orders" element={
          <PrivateRoute>
            <MyOrders/>
            </PrivateRoute>
          } />
        <Route path="/order-details/:id" element={<OrderDetails />} />


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
