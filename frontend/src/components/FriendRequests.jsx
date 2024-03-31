import React from "react";
import { Box, Button, Typography, useTheme, Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setFriendRequests, setFriends } from "../state";

const FriendRequests = ({ friendId, name, occupation, picturePath }) => {
const dispatch = useDispatch();
const id = useSelector((state)=> state.user._id);
const token = useSelector((state)=> state.token);
const friendrequests =  useSelector((state)=> state.user.friendRequest);
const isAccepted = friendrequests.filter(({_id})=> _id != friendId);
    
  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:3001/user/${id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
    dispatch(setFriendRequests({friends : isAccepted}));

  };
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px",
        borderBottom: "1px solid #ccc",
        backgroundColor: "lightgrey",
        borderRadius: "10px",
      }}
    >
      <Avatar alt={name} src={picturePath} />
      <Typography variant="body1" mr={2}>{name}</Typography>
      <Button sx={{ backgroundColor: "green", color: "white" }} onClick={patchFriend}>Confirm</Button>
      <Button sx={{ backgroundColor: "red", color: "white" }}>Cancel</Button>
    </Box>
  );
};

export default FriendRequests;
