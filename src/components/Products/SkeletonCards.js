import { Card, CardContent, Grid, Skeleton } from "@mui/material";
import React from "react";

const SkeletonCards = () => (
    <Grid container spacing={2}>
      {Array.from({ length: 12 }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card style={{
                      borderRadius: '8px'
                    }}>
            <Skeleton variant="rectangular" height={200} style={{ borderRadius: '8px' }} />
            <CardContent>
              <Skeleton variant="text" height={30} width="60%" />
              <Skeleton variant="text" height={20} width="80%" />
              <Skeleton variant="text" height={20} width="40%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

export default SkeletonCards;