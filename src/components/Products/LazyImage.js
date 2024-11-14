import React from 'react';

const LazyImage = React.memo(({ base64Image, alt }) => (
  <img
    src={`data:image/jpeg;base64,${base64Image}`}
    alt={alt}
    loading="lazy" // Lazy loading enabled
    style={{
      height: '200px',
      borderRadius: '8px',
      objectFit: 'cover',
      flexShrink: 0,
      cursor: 'pointer' // Make the image look clickable
    }} // marginTop: '10px',
  />
));

export default LazyImage;
