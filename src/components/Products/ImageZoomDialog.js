import React, { useState } from 'react';
import { Dialog, DialogContent, IconButton, Box } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CloseIcon from '@mui/icons-material/Close';

const ImageZoomDialog = ({ selectedImage, handleCloseImageModal }) => {
    const [zoomLevel, setZoomLevel] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 }); // Offset for panning
    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

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

    return (
        <Dialog
            open={!!selectedImage}
            onClose={handleCloseImageModal}
            maxWidth="md"
            fullWidth
        >
            <DialogContent
                style={{
                    padding: 0,
                    position: 'relative',
                    backgroundColor: '#000',
                    overflow: 'hidden',
                }}
            >


                {/* Image with Zoom and Pan */}
                <img
                    src={`data:image/jpeg;base64,${selectedImage}`}
                    alt="Zoomed Product"
                    style={{
                        transform: `scale(${zoomLevel}) translate(${offset.x}px, ${offset.y}px)`,
                        transition: isDragging ? 'none' : 'transform 0.3s ease',
                        cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
                        maxWidth: '100%',
                        maxHeight: '100vh',
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
                        style={{ color: '#fff', backgroundColor: 'rgba(0, 0, 0, 0.7)', }}
                        aria-label="Zoom In"
                    >
                        <ZoomInIcon />
                    </IconButton>
                    <IconButton
                        onClick={handleZoomOut}
                        style={{ color: '#fff', backgroundColor: 'rgba(0, 0, 0, 0.7)', }}
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
