import { useTheme } from "@emotion/react";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import ProductList from "./ProductList";



function Pagination() {
    const theme = useTheme();
    const paginationItems = [];
    const searchInputRef = useRef(null);
  // Calculate pagination
  const [currentPage, setCurrentPage] = useState(parseInt(localStorage.getItem('currentPage')) || 1);
  const [productsPerPage] = useState(2); // Show six products per page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
//   const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(ProductList.length / productsPerPage);
//   const [hoveredDots, setHoveredDots] = useState(false);

//   const handlePageChange = (event, value) => setCurrentPage(value);


    if (currentPage > 1) paginationItems.push(1);
    if (currentPage > 2) paginationItems.push('...');
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      paginationItems.push(i);
    }
    if (currentPage < totalPages - 1) paginationItems.push('...');
    if (currentPage < totalPages) paginationItems.push(totalPages);

    return (
      <Box
  sx={{
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: theme.spacing(1),
    mt: theme.spacing(2),
    p: theme.spacing(2),
    bgcolor: theme.palette.background.paper,
    borderRadius: '10px',
    boxShadow: theme.shadows[1],
  }}
>
  <Button
    variant="outlined"
    onClick={() => setCurrentPage(1)}
    disabled={currentPage === 1}
    sx={{
      fontSize: '0.875rem',
      minWidth: '50px',
      textTransform: 'capitalize',
    }}
  >
    First
  </Button>

  {paginationItems.map((item, index) => {
    if (item === '...') {
      return (
        <Tooltip
          key={index}
          title={
            <Box>
              <Typography variant="body2">Available Pages:</Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i}
                    size="small"
                    onClick={() => setCurrentPage(i + 1)}
                    sx={{
                      fontSize: '0.75rem',
                      minWidth: '40px',
                      textTransform: 'capitalize',
                    }}
                  >
                    {i + 1}
                  </Button>
                ))}
              </Box>
            </Box>
          }
          placement="top"
          arrow
        >
          <Typography
            variant="body1"
            sx={{
              cursor: 'pointer',
              color: theme.palette.text.secondary,
              padding: '0 8px',
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          >
            ...
          </Typography>
        </Tooltip>
      );
    }
    return (
      <Button
        key={index}
        variant={item === currentPage ? 'contained' : 'outlined'}
        onClick={() => setCurrentPage(item)}
        sx={{
          fontSize: '0.875rem',
          minWidth: '50px',
          textTransform: 'capitalize',
        }}
      >
        {item}
      </Button>
    );
  })}

  <Button
    variant="outlined"
    onClick={() => setCurrentPage(totalPages)}
    disabled={currentPage === totalPages}
    sx={{
      fontSize: '0.875rem',
      minWidth: '50px',
      textTransform: 'capitalize',
    }}
  >
    Last
  </Button>
</Box>
    );
  }


  export default Pagination();