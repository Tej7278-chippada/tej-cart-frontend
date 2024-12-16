// src/components/SkeletonProductDetail.js
import React from 'react';
import { Box, Skeleton, Grid, Card, CardContent } from '@mui/material';

function SkeletonProductDetail() {
    return (
        <Box sx={{ padding: '1rem' }}>
            <Grid container spacing={2}>
                {/* Media Section Skeleton */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: 300, borderRadius: 3 }}>
                        <Skeleton variant="rectangular" width="100%" height="100%" />
                    </Card>
                </Grid>

                {/* Product Info Skeleton */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 3, padding: '1rem', height: 265 }}>
                        <CardContent>
                            {/* Interaction Buttons Skeleton */}
                            <Grid item xs={12} sx={{ display: 'inline-block', float: 'right', paddingBottom: '1rem' }}>
                                <Box display="flex" justifyContent="flex-end" gap={2}>
                                    <Skeleton variant="circular" width={40} height={40} />
                                </Box>
                            </Grid>
                            <Skeleton variant="text" width="80%" height={42} sx={{ marginBottom: '1rem' }} />
                            <Grid container spacing={2}>
                                {[...Array(6)].map((_, index) => (
                                    <Grid item xs={6} sm={4} key={index}>
                                        <Skeleton variant="text" width="80%" height={24} />
                                        <Skeleton variant="text" width="60%" height={20} />
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>


                {/* Description Skeleton */}
                <Grid item xs={12}>
                    <Card sx={{ borderRadius: 3, padding: '1rem' }}>
                        {/* Interaction Buttons Skeleton */}
                        <Grid item xs={12} sx={{ display: 'inline-block', float: 'right', paddingBottom: '3rem' }}>
                            <Box display="flex" justifyContent="flex-end" gap={2}>
                                <Skeleton variant="circular" width={40} height={40} />
                                <Skeleton variant="circular" width={40} height={40} />
                            </Box>
                        </Grid>
                        <Skeleton variant="text" width="40%" height={28} sx={{ marginBottom: '1rem' }} />
                        <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
                    </Card>
                </Grid>


            </Grid>
        </Box>
    );
}

export default SkeletonProductDetail;
