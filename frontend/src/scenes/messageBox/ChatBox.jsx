import React, { useState } from 'react';
import { Box, IconButton, Typography } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import axiosInstance from '../../refreshToken/Token';
import { getSender } from '../../chatlogics/logic';
import { useSelector } from 'react-redux';
import SingleChat from './SingleChat.jsx'; // Assuming you have a component to display individual chat messages

const ChatBox = () => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null); // State to track selected chat
  const user = useSelector((state) => state.user);

  const fetchChats = async () => {
    try {
      const response = await axiosInstance.get("http://localhost:3001/chats");
      if (response.data) {
        setChats(response.data);
      }

    } catch (error) {
      console.error(error);
    }
  }

  const handleClick = () => {
    setShowMessageModal(!showMessageModal);
    fetchChats();
  }

  // Function to handle selecting a chat
  const handleChatSelect = (chat) => {
    setShowMessageModal(false);

    setSelectedChat(chat);
  }

  const renderChats = () => {
    if (!chats || chats.length === 0) {
      return <Typography variant="body1">No chats available</Typography>;
    }

    return (
      <>
        {chats.map((chat, index) => {
          const sender = getSender(chat, user);

          return (
            <Box key={index} display="flex" alignItems="flex-start" gap={2.5} paddingY={1} sx={{ backgroundColor: selectedChat === chat ? "lightblue" : "lightgrey" }}>
              <img
                src={`http://localhost:3001/assets/${sender.picturePath}`}
                alt={`${sender.firstName} ${sender.lastName}`}
                style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "19px" }}
              />
              <Typography variant="body1" sx={{ fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleChatSelect(chat)}>
                {sender.firstName} {sender.lastName}
              </Typography>
            </Box>
          );
        })}
      </>
    );
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <ChatIcon sx={{ fontSize: "25px" }} cursor={"pointer"} />
      </IconButton>
      {showMessageModal && (
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
          <Typography variant="h6" gutterBottom>
            Chats for
          </Typography>
          <div style={{ maxHeight: "400px", overflow: "auto" }}>
            {renderChats()}
          </div>
          <button onClick={() => setShowMessageModal(false)}>Close</button>
        </Box>
      )}
      {/* Render the messages of the selected chat */}
      {selectedChat && <SingleChat selectedChat={selectedChat} setSelectedChat ={setSelectedChat} setShowMessageModal={setShowMessageModal}/>}
    </>
  );
};

export default ChatBox;
