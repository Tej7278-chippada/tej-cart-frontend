import { Card, CardContent, CardMedia, Grid, Tooltip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import ProductList from "./ProductList";
import ProductDetail from "./ProductDetail";
import { fetchProducts } from "../../api/api";

function ProductCard(product) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts().then((response) => setProducts(response.data));
      }, []);
      if (!product) return null;
    const openProductDetail = (product) => {
        setSelectedProduct(product);
      };

    return (
        // {selectedProduct && (
        //     <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        // )}
        ((product) => (
        <Grid item xs={12} sm={6} md={4} key={product._id}>
            {/* <ProductCard product={product} /> */}
            <Card style={{
                margin: '1rem 0',
                cursor: 'pointer',
                backdropFilter: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '8px'
            }}
                onClick={() => openProductDetail(product)}
            >
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
                    <Typography variant="body1" color="textSecondary" style={{ display: 'inline-block', float: 'right', fontWeight: '500' }}>
                        Price: ₹{product.price}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" style={{ marginBottom: '0.5rem' }}>
                        Gender: {product.gender}
                    </Typography>
                    <Typography variant="body2" color={product.stockStatus === 'In Stock' ? 'green' : 'red'} style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
                        Stock Status: {product.stockStatus}
                    </Typography>
                    {product.stockStatus === 'In Stock' && (
                        <Typography variant="body2" color="textSecondary" style={{ display: 'inline-block', float: 'right', marginBottom: '0.5rem' }}>
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
                            style={{
                                marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis',
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
    // }

    );

}

export default ProductCard;