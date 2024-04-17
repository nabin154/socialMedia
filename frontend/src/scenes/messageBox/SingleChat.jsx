import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, TextField, Button, Avatar, IconButton } from '@mui/material';
import axiosInstance from '../../refreshToken/Token';
import ScrollableMessages from './ScrollableMessages';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux';

const SingleChat = ({ selectedChat, setSelectedChat, setShowMessageModal, setFetchAgain,isNonMobileScreens }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const mode = useSelector((state)=> state.mode);
  const backgroundColor = (mode ==='light'?"lightgrey" : '#202329');
  const color = (mode ==='light'?"black" : 'white');



  const handleMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = async() => {
    try {
      const response = await axiosInstance.post("http://localhost:3001/messages/sendmessage",
    {
      chatId: selectedChat._id,
      content:newMessage
    });
    if(response.data) {
      const message = response.data;
      setMessages([...messages, message]);
      setFetchAgain(true);
      setNewMessage(''); 
    }
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleBack = () => {
    setSelectedChat('');
    setShowMessageModal(true);
  }

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get(`http://localhost:3001/messages/${selectedChat._id}`);
      if (response.data) {
        setMessages(response.data);
      }
    }
    catch (error) {
      console.error(error);
    }
  };
  
   const handleClick = (e)=>{
    if(e.key ==='Enter'){
      handleSendMessage();
    }
   }

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);



  return (
    <Box
      className="modal"
      style={{
        width: (!isNonMobileScreens?'350px':'500px'),
        borderRadius: "10px",
        maxHeight: '75vh',
        overflow: 'auto',
        padding: "20px",
        color: "white",
        position: "fixed",
        top: "11%",
        right: (!isNonMobileScreens?'9%':'14%'),
        backgroundColor: backgroundColor,
        zIndex: "999",
      }}
    >
      <IconButton onClick={handleBack}>
        <ArrowBackIcon sx={{ fontSize: "25px" }} cursor={"pointer"} color={color} />
      </IconButton>
      <Box style={{ marginBottom: '20px' }}>
        <ScrollableMessages messages={messages}/>
       
      </Box>
      <Box display="flex" alignItems="center" width={'100%'} marginTop={3}>
        <TextField
          label="Type your message"
          variant="outlined"
          fullWidth
          onKeyDown={handleClick}
          value={newMessage}
          onChange={handleMessageChange}
        />
        <Button 
          variant="contained" 
          color="primary" 
         
          onClick={handleSendMessage} 
          style={{ marginLeft: '10px', minWidth: '80px' }} 
        >
          Send
        </Button>
      </Box>
    </Box>
  )
};

export default SingleChat;
