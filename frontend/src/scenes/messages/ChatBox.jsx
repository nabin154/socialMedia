import React, { useState } from 'react'
import {
  Box,
  Button,
  IconButton,
  Modal,
  Typography,
  useTheme,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

const ChatBox = () => {
    const [showMessageModal , setShowMessageModal] = useState(false);

    
    
  return (
    <>
      <IconButton onClick={() => setShowMessageModal(!showMessageModal)}>
        {" "}
        <ChatIcon sx={{ fontSize: "25px" }} cursor={"pointer"} />
      </IconButton>
      {showMessageModal && (
        <Box
          width={"400px"}
          borderRadius={"10px"}
          padding={3}
          color={"white"}
          zIndex={1}
          sx={{
            position: "absolute",
            right: "18%",
            top: "10%",
            backgroundColor: "black",
          }}
        >
          this is the chat box this is the chat box this is the chat box this is
          the chat box this is the chat box this is the chat box this is the
          chat box this is the chat box
        </Box>
      )}
    </>
  );
}

export default ChatBox
