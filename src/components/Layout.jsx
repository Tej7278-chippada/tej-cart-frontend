// Layout.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children, username }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header username={username} />
      <div style={{ flex: 1 }}>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
