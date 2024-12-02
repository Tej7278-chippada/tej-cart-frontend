// // /components/Products/Home/HomeEditor.js
// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   TextField,
//   Grid,
//   Card,
//   CardMedia,
//   IconButton,
// } from "@mui/material";
// import { Add, Edit, Delete } from "@mui/icons-material";
// import { addOffer, deleteOffer, getOffers, updateOffer } from "../../../api/api";
// // import { getOffers, addOffer, updateOffer, deleteOffer } from "../api"; // Existing API functions

// const HomeEditor = () => {
//   const [offers, setOffers] = useState([]);
//   const [newOffer, setNewOffer] = useState({ title: "", image: "" });

//   useEffect(() => {
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

//   const handleAddOffer = async () => {
//     try {
//       const response = await addOffer(newOffer);
//       setOffers([...offers, response.data]);
//       setNewOffer({ title: "", image: "" });
//     } catch (error) {
//       console.error("Error adding offer:", error);
//     }
//   };

//   const handleUpdateOffer = async (id, updatedOffer) => {
//     try {
//       await updateOffer(id, updatedOffer);
//       setOffers((prev) =>
//         prev.map((offer) => (offer._id === id ? { ...offer, ...updatedOffer } : offer))
//       );
//     } catch (error) {
//       console.error("Error updating offer:", error);
//     }
//   };

//   const handleDeleteOffer = async (id) => {
//     try {
//       await deleteOffer(id);
//       setOffers((prev) => prev.filter((offer) => offer._id !== id));
//     } catch (error) {
//       console.error("Error deleting offer:", error);
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setNewOffer({ ...newOffer, image: reader.result.split(",")[1] });
//     };
//     reader.readAsDataURL(file);
//   };

//   return (
//     <Box sx={{ maxWidth: "1200px", margin: "auto", mt: 2 }}>
//       <Typography variant="h5" sx={{ mb: 2 }}>
//         Manage Offers
//       </Typography>
//       <Grid container spacing={2}>
//         {offers.map((offer) => (
//           <Grid item xs={12} sm={6} md={4} key={offer._id}>
//             <Card>
//               <CardMedia
//                 component="img"
//                 height="200"
//                 image={`data:image/jpeg;base64,${offer.image}`}
//                 alt={offer.title}
//               />
//               <Box sx={{ p: 2 }}>
//                 <Typography variant="subtitle1">{offer.title}</Typography>
//                 <Box display="flex" justifyContent="space-between">
//                   <IconButton onClick={() => handleUpdateOffer(offer._id, { title: "Updated Title" })}>
//                     <Edit />
//                   </IconButton>
//                   <IconButton onClick={() => handleDeleteOffer(offer._id)}>
//                     <Delete />
//                   </IconButton>
//                 </Box>
//               </Box>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       <Box sx={{ mt: 4 }}>
//         <Typography variant="h6">Add New Offer</Typography>
//         <TextField
//           label="Title"
//           value={newOffer.title}
//           onChange={(e) => setNewOffer({ ...newOffer, title: e.target.value })}
//           fullWidth
//           sx={{ mb: 2 }}
//         />
//         <Button variant="outlined" component="label">
//           Upload Image
//           <input type="file" hidden onChange={handleFileChange} />
//         </Button>
//         {newOffer.image && <img src={`data:image/jpeg;base64,${newOffer.image}`} alt="Preview" height="100" />}
//         <Button variant="contained" sx={{ mt: 2 }} onClick={handleAddOffer}>
//           <Add /> Add Offer
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default HomeEditor;
