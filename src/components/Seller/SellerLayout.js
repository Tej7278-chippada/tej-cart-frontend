// SellerLayout.js
import React from 'react';
import SellerHeader from './SellerHeader';
import Footer from '../Footer';
// import Header from './Header';
// import Footer from './Footer';

const SellerLayout = ({ children, usernameSeller }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SellerHeader usernameSeller={usernameSeller} />
      <div style={{ flex: 1 }}>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default SellerLayout;
