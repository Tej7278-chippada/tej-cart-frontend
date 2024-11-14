// src/components/CommentPopup.js
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, Typography, TextField, Button } from '@mui/material';
import { addComment, fetchProducts } from '../../api/api';

function CommentPopup({ open, onClose, product, onCommentAdded }) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (product) {
      setComments(product.comments); // Set existing comments when component loads
    }
  }, [product]);

  const handleAddComment = async () => {
    if (newComment.trim() && product?._id) {
      await addComment(product._id, { text: newComment });
      setNewComment('');
      await refreshComments(); // Refresh comments after adding
    }
  };

  const refreshComments = async () => {
    const updatedProduct = await fetchProducts(product._id);
    setComments(updatedProduct.comments);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent>
        <Typography variant="h6">Comments</Typography>
        
        
        <TextField
          label="Add a comment"
          fullWidth
          multiline
          rows={2}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={handleAddComment} variant="contained" color="primary" style={{ marginTop: '1rem' }}>
          Submit
        </Button>

        <div style={{ maxHeight: '300px', overflowY: 'auto', margin: '1rem 0' }}>
        {comments.length ? (
            comments.map((comment, index) => (
              <Typography key={index} style={{ marginBottom: '0.5rem' }}>
                {comment.text}<Typography>Testing comment...</Typography>
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
