import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, List, ListItem, Typography, Card, CardContent} from '@mui/material';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';
// import { useParams } from 'react-router-dom';


const Chat = ({ userId, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const tokenUsername = localStorage.getItem('tokenUsername'); // Get the username from local storage
  const navigate = useNavigate();
  // const { username } = useParams(); // Get the username from the URL
  console.log('Username from URL:', tokenUsername);  // Debugging: should show the extracted username


  // const fetchMessages = async () => {
  //   const { data } = await axios.get(`/api/chat/getMessages/${userId}/${receiverId}`);
  //   setMessages(data);
  // };

  const [loading, setLoading] = useState(true);
  // Function to fetch messages from the backend
  const fetchMessages = async () => {
    try {                             // 'http://localhost:5002/api/messages' 'https://tej-chat-app-8cd7e70052a5.herokuapp.com/api/messages'
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/messages`); // Adjust the URL based on your proxy setup
      setMessages(response.data); // Set the fetched messages in state
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
    } finally {
      setLoading(false); // Set loading to false after the fetch completes
    }
  };

  const sendMessage = async () => {
    await axios.post('/api/chat/sendMessage', { senderId: userId, receiverId, message });
    setMessage('');
    fetchMessages();
  };

  // useEffect to fetch messages when the component mounts
  useEffect(() => {
    fetchMessages();
    const authToken = localStorage.getItem('authToken', 'tokenUsername');
    if (!authToken) {
      navigate('/');
    }
    // Optionally verify the token by making a request to the backend
  }, [navigate]); // Empty dependency array means it runs once when the component mounts
  // console.log('Username from URL:', username);

  return (
    <Layout username={tokenUsername}>
    <div>
      {/* <CardContent> 
      <Typography variant="h5" 
      //gutterBottom
      >
          Welcome to the Chat, {tokenUsername}!
      </Typography> 
      </CardContent> */}
      
      <Box display="flex" flexDirection="row" gap={1.5} p={2}
      sx={{
        // position: 'fixed',
        top: 65,
        left: 0,
        // width: '100%',
        height: '80vh',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5', // Background color for Box (can be customized)
      }}
      >
        {/* Chats Card */}
        <Card sx={{ flex: 1,
          height: '80vh', // Fixed height relative to viewport
          overflowY: 'auto',
          bgcolor: 'white', // Card background color (customizable)
          borderRadius: 3, // Card border radius (customizable)
          boxShadow: 3, // Shadow for a modern look
          }}>
          <CardContent>
            <Typography variant="h6">Chats</Typography>
            
          </CardContent>
        </Card>

        {/* Chat History Card */}
        <Card sx={{ flex: 3,
          height: '80vh', // Fixed height relative to viewport
          overflowY: 'auto',
          bgcolor: 'white', // Card background color (customizable)
          borderRadius: 3, // Card border radius (customizable)
          boxShadow: 3, // Shadow for a modern look
           }}>
          <CardContent>
          <Typography variant="h6">Chat Messages</Typography>
          <div>
       {/* <h1>Chat Messages</h1> */}
        {loading && <p>Loading messages...</p>} 
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <ul>
          {messages.map((message) => (
            <li key={message._id}>{message.text}</li> // Assuming each message has an `_id` and `text` property
          ))}
        </ul>
      </div>
      <Box>
      
        <List>
          {messages.map((msg) => (
            <ListItem key={msg._id}>
              <Typography>{msg.decryptedMessage}</Typography>
            </ListItem>
          ))}
        </List>
        <TextField
          fullWidth
          variant="outlined"
          label="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant="contained" onClick={sendMessage}>Send</Button>
      </Box>
            
          </CardContent>
        </Card>
      </Box>

    </div>
    </Layout>
  );
};

export default Chat;
