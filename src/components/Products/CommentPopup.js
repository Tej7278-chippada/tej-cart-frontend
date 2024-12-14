// src/components/CommentPopup.js
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, Typography, TextField, Button, IconButton, CircularProgress } from '@mui/material';
import { addComment } from '../../api/api';
import CloseIcon from '@mui/icons-material/Close';

function CommentPopup({ open, onClose, product, onCommentAdded }) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [commentAddedMessage, setCommentAddedMessage] = useState('');
  const [commentFailedMessage, setCommentFailedMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setComments([...product.comments].reverse()  || []); // Set existing comments when component loads
    }
  }, [product]);

  const handleAddComment = async () => {
    if (newComment.trim() && product?._id) {
      setLoading(true);
      try {
        // Adding the comment to the backend
        const newCommentData = { text: newComment, createdAt: new Date().toISOString() };
        await addComment(product._id, newCommentData);

        // Clear the input field
        setNewComment('');
        
        // Show success message
        setCommentAddedMessage('Comment added successfully!');

        // Add new comment at the top of the list
        // const updatedComments = [{ text: newComment }, ...comments];

        // Update the comments state
        // setComments(updatedComments);

        // Add the new comment to the top of the list
        setComments((prevComments) => [newCommentData, ...prevComments]);

        // Update product's comment count
        // Call the parent function to update the product and close the popup
        onCommentAdded(); // This will trigger the parent to update the comment count
        
        // Refresh the comments list
        // await refreshComments();
      } catch (error) {
        console.error('Error adding comment:', error);
        setCommentFailedMessage('Comment can not added!');
      } finally {
        setLoading(false);
      }
    }
  };

  // const refreshComments = async () => {
    // const updatedProduct = await fetchProducts(product._id);
    // setComments(product.comments);
  // };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent style={{ position:'sticky', height:'auto', scrollbarWidth: 'thin'}}>
        {/* Close button */}
        <IconButton
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            color: '#333'
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6">Comments</Typography>
        
        <TextField
          label="Add a comment"
          fullWidth
          multiline
          rows={2} style={{marginTop: '1rem'}}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        {/* Display message after a comment is added */}
        {commentAddedMessage && (
          <Typography variant="body2" color="success.main" style={{ marginTop: '1rem' }}>
            {commentAddedMessage}
          </Typography>
        )}
        {commentFailedMessage && (
          <Typography variant="body2" color="error.main" style={{ marginTop: '1rem' }}>
            {commentFailedMessage}
          </Typography>
        )}
        <Button onClick={handleAddComment} variant="contained" color="primary" style={{ marginTop: '1rem' }} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>

        

        {/* Display list of comments */}
        <div style={{ maxHeight: '300px', overflowY: 'auto', margin: '1rem 0', scrollbarWidth:'thin' }}>
          {comments && comments.length ? (
            comments.map((comment, index) => (
              <Typography key={index} style={{ margin: '6px',  backgroundColor: "#f5f5f5",padding: "1rem", 
                borderRadius: "6px",
                border: "1px solid #ddd",marginTop: '6px',
                lineHeight: '1.5',
                textAlign: 'justify', whiteSpace: "pre-wrap", // Retain line breaks and tabs
                wordWrap: "break-word", // Handle long words gracefully
                 }}>
                {comment.text}
                <Typography><small>{new Date(comment.createdAt).toLocaleString()}</small></Typography>
              </Typography>
            ))
          ) : (
            <Typography>No comments available.</Typography>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentPopup;
