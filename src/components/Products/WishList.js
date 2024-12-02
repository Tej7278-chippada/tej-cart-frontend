// src/components/WishList.js
import React, { useEffect, useState } from 'react';
// import { fetchWishlist } from '../../api/api';
import { useNavigate } from 'react-router-dom';
// import { fetchWishlist } from '../../api/api';
import axios from 'axios';
import { fetchWishlist } from '../../api/api';
// import { fetchWishlist } from '../api/api';

const WishList = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist().then(setWishlist).catch(console.error);
  }, []);

//   const fetchWishlist = async () => {
//     try {
//       const authToken = localStorage.getItem('authToken'); // Retrieve token from storage
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/wishlist`, {
//         headers: {
//           Authorization: `Bearer ${authToken}`, // Include the token
//         },
//       });
//       setWishlist(response.data); // Assuming response.data is the list of wishlist products
//     } catch (error) {
//       console.error('Error fetching wishlist:', error);
//       alert(error.response?.data?.message || 'Failed to fetch wishlist.');
//     }
//   };
  

  if (loading) {
    return <p>Loading wishlist...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div>
          {wishlist.map((product) => (
            <div key={product._id} onClick={() => navigate(`/product/${product._id}`)}>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <img src={`data:image/jpeg;base64,${product.media[0]}`} alt={product.title} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishList;
