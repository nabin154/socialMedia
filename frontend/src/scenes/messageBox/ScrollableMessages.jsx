import { Avatar, Box } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

const ScrollableMessages = ({ messages }) => {
  const user = useSelector((state) => state.user);
  const chatContainerRef = useRef(null);


  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box
    ref={chatContainerRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: 'calc(70vh - 120px)',
        overflowY: 'auto',
        width: '100%',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch', 
        '&::-webkit-scrollbar': {
          display: 'none', 
        }
      }}
    >
      {messages?.map((message, index) => (
        <Box
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {user._id === message.sender._id ? (
            <Box>
              <Box
                sx={{
                  backgroundColor: 'lightblue',
                  width: '150px',
                  borderRadius: '12px',
                  padding: '7px',
                  marginTop: '10px',
                  marginLeft: '62%',
                }}
              >
                {message.content}
              </Box>
            </Box>
          ) : (
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Avatar src={`http://localhost:3001/assets/${message.sender.picturePath}`} />
              <Box
                sx={{
                  backgroundColor: 'lightgreen',
                  width: '150px',
                  borderRadius: '12px',
                  padding: '7px',
                  marginTop: '10px',
                }}
              >
                {message.content}
              </Box>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default ScrollableMessages;
