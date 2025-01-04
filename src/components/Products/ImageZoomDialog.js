import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, IconButton, Box, useMediaQuery } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CloseIcon from '@mui/icons-material/Close';
// import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

const ImageZoomDialog = ({ selectedImage, handleCloseImageModal, images }) => {
    const [zoomLevel, setZoomLevel] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 }); // Offset for panning
    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [currentIndex, setCurrentIndex] = useState(0);
    const isMobile = useMediaQuery("(max-width:600px)");

    // Update the index when a new image is passed
    useEffect(() => {
        if (selectedImage && images) {
            const initialIndex = images.indexOf(selectedImage); // Find the index of selectedImage
            if (initialIndex !== -1) setCurrentIndex(initialIndex);
        }
    }, [selectedImage, images]);

    // Zoom Handlers
    const handleZoomIn = () => {
        setZoomLevel((prevZoom) => Math.min(prevZoom + 0.2, 3)); // Cap zoom level at 3
    };

    const handleZoomOut = () => {
        setZoomLevel((prevZoom) => Math.max(prevZoom - 0.2, 1)); // Minimum zoom level is 1
        if (zoomLevel <= 1.2) setOffset({ x: 0, y: 0 }); // Reset position when fully zoomed out
    };

    // Drag Handlers
    const handleMouseDown = (event) => {
        if (zoomLevel > 1) {
            setIsDragging(true);
            setStartPosition({ x: event.clientX - offset.x, y: event.clientY - offset.y });
        }
    };

    const handleMouseMove = (event) => {
        if (isDragging) {
            const newOffset = {
                x: event.clientX - startPosition.x,
                y: event.clientY - startPosition.y,
            };
            setOffset(newOffset);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // For touch devices
    const handleTouchStart = (event) => {
        if (zoomLevel > 1) {
            const touch = event.touches[0];
            setIsDragging(true);
            setStartPosition({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
        }
    };

    const handleTouchMove = (event) => {
        if (isDragging) {
            const touch = event.touches[0];
            const newOffset = {
                x: touch.clientX - startPosition.x,
                y: touch.clientY - startPosition.y,
            };
            setOffset(newOffset);
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    // Handle navigation
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <Dialog
            open={!!selectedImage}
            onClose={handleCloseImageModal}
            maxWidth="md"
            fullWidth fullScreen="true" sx={{ margin: '1rem',
                '& .MuiPaper-root': { // Target the dialog paper
                  borderRadius: '16px', // Apply border radius
                }, }}
        >
            <DialogContent
                style={{
                    padding: 0,
                    position: 'relative',
                    backgroundColor: '#000',
                    overflow: 'hidden',
                    display: 'flex', // Use flexbox for centering
                    justifyContent: 'center', // Horizontal centering
                    alignItems: 'center', // Vertical centering
                }}
            >


                {/* Image with Zoom and Pan */}
                <img
                    src={`data:image/jpeg;base64,${images[currentIndex]}`}
                    alt={`Zoomed ${currentIndex}`}
                    style={{
                        transform: `scale(${zoomLevel}) translate(${offset.x}px, ${offset.y}px)`,
                        transition: isDragging ? 'none' : 'transform 0.3s ease',
                        cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
                        maxWidth: '100%',
                        maxHeight: '95vh',
                        objectFit: 'contain',
                        display: 'block', // Center the image horizontally
                        margin: 'auto',  // Center the image vertically in the dialog
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                />

                {/* Close Button */}
                <IconButton
                    onClick={handleCloseImageModal}
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        color: '#fff', backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    }}
                >
                    <CloseIcon />
                </IconButton>
                {/* Navigation Buttons */}
                {images.length > 1 && (
                    <>
                        {/* Previous Button */}
                        <IconButton
                            onClick={handlePrev}
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: 16,
                                transform: "translateY(-50%)",
                                backgroundColor: "rgba(0,0,0,0.3)",
                                color: "white",
                            }}
                        >
                            <ArrowBackIosRoundedIcon />
                        </IconButton>

                        {/* Next Button */}
                        <IconButton
                            onClick={handleNext}
                            style={{
                                position: "absolute",
                                top: "50%",
                                right: 16,
                                transform: "translateY(-50%)",
                                backgroundColor: "rgba(0,0,0,0.3)",
                                color: "white",
                            }}
                        >
                            <ArrowForwardIosRoundedIcon />
                        </IconButton>
                    </>
                )}

                {/* Zoom Controls */}
                <Box
                    style={{
                        position: 'absolute',
                        bottom: 10,
                        left: 10,
                        display: 'flex',
                        gap: '10px',
                        borderRadius: '6px',
                        padding: '8px',
                    }}
                >
                    <IconButton
                        onClick={handleZoomIn}
                        style={{ color: '#fff', backgroundColor: 'rgba(0, 0, 0, 0.5)', }}
                        aria-label="Zoom In"
                    >
                        <ZoomInIcon />
                    </IconButton>
                    <IconButton
                        onClick={handleZoomOut}
                        style={{ color: '#fff', backgroundColor: 'rgba(0, 0, 0, 0.5)', }}
                        aria-label="Zoom Out"
                    >
                        <ZoomOutIcon />
                    </IconButton>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ImageZoomDialog;
