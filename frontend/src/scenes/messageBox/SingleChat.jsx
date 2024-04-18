import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, TextField, Button, Avatar, IconButton, useMediaQuery } from '@mui/material';
import axiosInstance from '../../refreshToken/Token';
import ScrollableMessages from './ScrollableMessages';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';

import io from 'socket.io-client';
import { setMessages, setShowMessageModal } from '../../state';
var socket;

const SingleChat = ({ selectedChat, setSelectedChat, setFetchAgain }) => {
  const [newMessage, setNewMessage] = useState('');
  // const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.mode);
  const user = useSelector((state) => state.user);
  const messages = useSelector((state) => state.messages);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const backgroundColor = (mode === 'light' ? "lightgrey" : '#202329');
  const color = (mode === 'light' ? "black" : 'white');


  useEffect(() => {
    socket = io("http://localhost:3001");

    return () => {
      socket.disconnect();
    };
  }, []);




  const handleMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    try {
      const response = await axiosInstance.post("http://localhost:3001/messages/sendmessage",
        {
          chatId: selectedChat._id,
          content: newMessage
        });
      if (response.data) {
        const message = response.data;
       dispatch(setMessages([...messages,message]))
        socket.emit("new message", message);
        setFetchAgain(true);
        setNewMessage('');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBack = () => {
    setSelectedChat('');
    dispatch(setShowMessageModal(true));
  }

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get(`http://localhost:3001/messages/${selectedChat._id}`);
      if (response.data) {
        const data = response.data;
        dispatch(setMessages(data));
        socket.emit("joined room", selectedChat._id);
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  const handleClick = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  }


  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);



  return (
    <Box
      className="modal"
      width={isSmallScreen ? '350px' : '500px'}
      style={{
        borderRadius: "10px",
        maxHeight: '75vh',
        overflow: 'auto',
        padding: "20px",
        color: "white",
        position: "fixed",
        top: "11%",
        right: '9%',
        backgroundColor: backgroundColor,
        zIndex: "999",
      }}
    >
      <IconButton onClick={handleBack}>
        <ArrowBackIcon sx={{ fontSize: "25px" }} cursor={"pointer"} color={color} />
      </IconButton>
      <Box style={{ marginBottom: '20px' }}>
        <ScrollableMessages  />

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
