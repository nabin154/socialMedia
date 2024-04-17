import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

const SingleChat = ( { selectedChat, setSelectedChat , setShowMessageModal } ) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages,setMessages] = useState([]);
  const handleMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
    //   sendMessage(newMessage);
      setNewMessage('');
    }
  };
  const handleBack =()=>{
    setSelectedChat('');
    setShowMessageModal(true);
  }

  return (
    <Box
    className="modal"
    style={{
      width: "500px",
      borderRadius: "10px",
      padding: "20px",
      color: "white",
      position: "fixed",
      top: "13%",
      right: "20%",
      backgroundColor: "black",
      zIndex: "999",
    }}
  >
    <Button onClick={handleBack}>x</Button>
      {/* {messages?.map((message, index) => (
        <Typography key={index} variant="body1">{message}</Typography>
      ))} */}

    <Box></Box>
      <Box display="flex" alignItems="center" marginTop={2}>
        <TextField
          label="Type your message"
          variant="outlined"
          fullWidth
          value={newMessage}
          onChange={handleMessageChange}
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage} style={{ marginLeft: '10px' }}>
          Send
        </Button>
      </Box>
    </Box>
  )
};

export default SingleChat;
