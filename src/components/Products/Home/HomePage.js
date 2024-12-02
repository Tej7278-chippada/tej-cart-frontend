// // /components/Products/Home/HomePage.js
// import React, { useEffect, useState } from "react";
// import { Box, Typography, Card, CardMedia, IconButton } from "@mui/material";
// import { useTheme } from "@mui/material/styles";
// import { getOffers } from "../../../api/api";
// // import { getOffers } from "../api"; // Assuming you already have an API function

// const HomePage = () => {
//   const [offers, setOffers] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const theme = useTheme();

//   useEffect(() => {
//     // Fetch offers images from backend
//     const fetchOffers = async () => {
//       try {
//         const response = await getOffers();
//         setOffers(response.data);
//       } catch (error) {
//         console.error("Error fetching offers:", error);
//       }
//     };
//     fetchOffers();
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % offers.length);
//     }, 3000); // Auto-scroll every 3 seconds
//     return () => clearInterval(interval);
//   }, [offers]);

//   const handleDotClick = (index) => {
//     setCurrentIndex(index);
//   };

//   return (
//     <Box sx={{ width: "100%", maxWidth: "1200px", margin: "auto", mt: 2 }}>
//       <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
//         Welcome to TejCart
//       </Typography>
//       {offers.length > 0 && (
//         <Card sx={{ position: "relative", borderRadius: "16px" }}>
//           {/* <CardMedia
//             component="img"
//             height="400"
//             image={`data:image/jpeg;base64,${offers[currentIndex]?.image}`}
//             alt={offers[currentIndex]?.title}
//             sx={{ borderRadius: "16px" }}
//           /> */}
//           <CardMedia
//   component="img"
//   height="400"
//   image={`data:image/jpeg;base64,${offers[currentIndex]?.image}`}
//   alt={offers[currentIndex]?.title}
//   sx={{ borderRadius: "16px", cursor: "pointer" }}
//   onClick={() => window.open(offers[currentIndex]?.url, "_blank")} // Open URL in a new tab
// />
//           {/* Dots Navigation */}
//           <Box
//             sx={{
//               position: "absolute",
//               bottom: "16px",
//               width: "100%",
//               display: "flex",
//               justifyContent: "center",
//               gap: "8px",
//             }}
//           >
//             {offers.map((_, index) => (
//               <IconButton
//                 key={index}
//                 onClick={() => handleDotClick(index)}
//                 sx={{
//                   width: "10px",
//                   height: "10px",
//                   backgroundColor: index === currentIndex ? theme.palette.primary.main : "#ccc",
//                   borderRadius: "50%",
//                   transition: "background-color 0.3s",
//                 }}
//               />
//             ))}
//           </Box>
//         </Card>
//       )}
//     </Box>
//   );
// };

// export default HomePage;
