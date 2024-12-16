// /components/Products/LazyImage.js
import React from 'react';

const LazyImage = React.memo(({ base64Image, alt }) => {
  // Check if base64Image is valid; fall back to a placeholder
  const imageSrc = base64Image 
    ? `data:image/jpeg;base64,${base64Image}` 
    : '../assets/null-product-image.webp'; // Replace with the path to your placeholder image

  return (
    <img
      src={imageSrc}
      alt={alt}
      loading="lazy" // Lazy loading enabled
      style={{
        height: '200px',
        borderRadius: '8px',
        objectFit: 'cover',
        flexShrink: 0,
        cursor: 'pointer', // Make the image look clickable
      }}
    />
  );
});

export default LazyImage;
