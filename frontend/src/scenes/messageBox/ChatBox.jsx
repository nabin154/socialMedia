import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from '@mui/icons-material/Close';
import CircleIcon from '@mui/icons-material/Circle';
import axiosInstance from '../../refreshToken/Token';
import { getSender } from '../../chatlogics/logic';
import { useSelector } from 'react-redux';
import SingleChat from './SingleChat.jsx'; 

const ChatBox = ({isNonMobileScreens}) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [fetchAgain , setFetchAgain] = useState(false);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null); 
  const user = useSelector((state) => state.user);
  const mode = useSelector((state)=> state.mode);
  const backgroundColor = (mode ==='light'?"lightgrey" : '#202329');
  const backgroundColorChat = (mode ==='light'?"#95a5a6" : '#222f3e');
  const color = (mode ==='light'?"black" : 'white');


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

  const handleChatSelect = (chat) => {
    setShowMessageModal(false);

    setSelectedChat(chat);
  }

  useEffect(()=>{
fetchChats();
  },[fetchAgain]);

  const renderChats = () => {
    if (!chats || chats.length === 0) {
      return <Typography variant="body1">No chats available</Typography>;
    }

    return (
      <>
        {chats.map((chat, index) => {
          const sender = getSender(chat, user);

          return (
            <Box key={index} onClick={() => handleChatSelect(chat)} display="flex" alignItems="flex-start" justifyContent={'space_evenly'} gap={2} 
          
            sx={{ backgroundColor: backgroundColorChat,color: color, borderRadius:'14px',cursor: 'pointer' ,marginTop:'10px'
            ,padding: (!isNonMobileScreens?'10px':'15px')}}>
              <img
                src={`http://localhost:3001/assets/${sender.picturePath}`}
                alt={`${sender.firstName} ${sender.lastName}`}
                style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "19px" }}
              />
              <Box display={'flex'} flexDirection={'column'} width={'300px'}>
              <Typography variant="body1" sx={{ fontSize: '16px', fontWeight: 'bold' }} >
                {sender.firstName} {sender.lastName}
              </Typography>
              <span style={{color:'lightgreen'}}>ONLINE</span>
              </Box>
              <CircleIcon sx={{ fontSize: "15px" ,color: 'lightgreen'}}/>
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
            width: (!isNonMobileScreens?'350px':'500px'),
            borderRadius: "10px",
            padding: "20px",
            height: '70vh',

            color: color,
            position: "fixed",
            top: "11%",
            right: (!isNonMobileScreens?'9%':'16%'),
            backgroundColor: backgroundColor,
            zIndex: "999",
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ fontSize: "18px" ,}}>
          CHATS
          </Typography>
          <div style={{ maxHeight: "400px", overflow: "auto", padding:'20px 30px' }}>
            {renderChats()}
          </div>
          <IconButton onClick={()=> setShowMessageModal(!showMessageModal)} sx={{position: 'absolute', top:'0',right:'0', color:'red'}}>
        <CloseIcon sx={{ fontSize: "25px" }} cursor={"pointer"} />
      </IconButton>
        </Box>
      )}
      {selectedChat && <SingleChat 
      selectedChat={selectedChat}
       setSelectedChat={setSelectedChat} 
       setShowMessageModal={setShowMessageModal}
       setFetchAgain={setFetchAgain}
       isNonMobileScreens={isNonMobileScreens} />}
    </>
  );
};

export default ChatBox;
