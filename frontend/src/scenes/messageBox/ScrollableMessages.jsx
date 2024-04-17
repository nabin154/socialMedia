import { Avatar, Box } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { isSameSender } from '../../chatlogics/logic';

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
        height: 'calc(70vh - 120px)',
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
                  backgroundColor: '#4E65FF',
                  maxWidth: '250px',
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
                gap: '6px',
              }}
            >{!isSameSender(messages, message, index, user) &&
              <Avatar src={`http://localhost:3001/assets/${message.sender.picturePath}`} />
            }
              <Box
                sx={{
                  backgroundColor: '#4b6584',
                  maxWidth: '250px',
                  borderRadius: '10px',
                  padding: '9px',
                  marginTop: '10px',
                  marginLeft: isSameSender(messages, message, index, user)?'45px':'',
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
