// src/components/RenderPagination.js
import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@emotion/react';

const RenderPagination = ({
    currentPage,
    totalPages,
    setCurrentPage
}) => {
    const theme = useTheme();

    const paginationItems = [];
    paginationItems.push(1);
    if (currentPage > 3) paginationItems.push('...');

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        paginationItems.push(i);
    }

    if (currentPage < totalPages - 2) paginationItems.push('...');
    if (totalPages > 1) paginationItems.push(totalPages); // Always show the last page
    const [hoveredDots, setHoveredDots] = useState(false);

    return (
        <div>
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
                    sx={{ fontSize: '0.875rem', minWidth: '50px', textTransform: 'capitalize' }}
                >
                    First
                </Button>

                {paginationItems.map((item, index) => (
                    item === '...'
                        ? (
                            <Tooltip
                                key={index}
                                title={
                                    <Box p={1}>
                                        <Typography variant="body2">Available Pages:</Typography>
                                        <Box display="flex" flexWrap="wrap" gap={2} sx={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                            {Array.from({ length: totalPages }, (_, i) => (
                                                <Button key={i} onClick={() => {
                                                    setCurrentPage(i + 1);
                                                    setHoveredDots(false); // Close the dialog after selecting a page
                                                }}
                                                    variant={i + 1 === currentPage ? 'contained' : 'outlined'}
                                                    sx={{
                                                        fontSize: '0.875rem',
                                                        minWidth: '60px',
                                                        textTransform: 'capitalize',
                                                        backgroundColor:
                                                            i + 1 === currentPage ? theme.palette.primary.light : undefined,
                                                        color: i + 1 === currentPage ? theme.palette.primary.contrastText : undefined,
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
                                onOpen={() => setHoveredDots(true)}
                                onClick={() => setHoveredDots(true)}
                            // onClose={() => setHoveredDots(false)}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{
                                        cursor: 'pointer',
                                        color: theme.palette.text.secondary,
                                        padding: '0 8px',
                                        '&:hover': { color: theme.palette.primary.main },
                                    }}
                                >
                                    ...
                                </Typography>
                            </Tooltip>
                        ) : (
                            <Button
                                key={index}
                                variant={item === currentPage ? 'contained' : 'outlined'}
                                onClick={() => setCurrentPage(item)}
                                sx={{ fontSize: '0.875rem', minWidth: '50px', textTransform: 'capitalize' }}
                            >
                                {item}
                            </Button>
                        )
                ))}

                <Button
                    variant="outlined"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    sx={{ fontSize: '0.875rem', minWidth: '50px', textTransform: 'capitalize' }}
                >
                    Last
                </Button>
            </Box>
            {hoveredDots && (
                <Dialog open={hoveredDots} onClose={() => setHoveredDots(false)} PaperProps={{
                    style: {
                        backgroundColor: theme.palette.background.default,
                        padding: theme.spacing(2),
                        borderRadius: '10px',
                    },
                }}>
                    <DialogTitle>All Pages</DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexWrap="wrap" gap={2} sx={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <Button key={i} onClick={() => {
                                    setCurrentPage(i + 1);
                                    setHoveredDots(false); // Close the dialog after selecting a page
                                }}
                                    variant={i + 1 === currentPage ? 'contained' : 'outlined'}
                                    sx={{
                                        fontSize: '0.875rem',
                                        minWidth: '60px',
                                        textTransform: 'capitalize',
                                        backgroundColor:
                                            i + 1 === currentPage ? theme.palette.primary.light : undefined,
                                        color: i + 1 === currentPage ? theme.palette.primary.contrastText : undefined,
                                    }}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                        </Box>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default RenderPagination;
