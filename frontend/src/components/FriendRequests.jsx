import React from "react";
import { Box, Button, Typography, useTheme, Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {  setFriends, setReceivedFriendRequests } from "../state";

const FriendRequests = ({ friendId, name, occupation, picturePath }) => {
const dispatch = useDispatch();
const id = useSelector((state)=> state.user._id);
const token = useSelector((state)=> state.token);
const friendrequests =  useSelector((state)=> state.user.friendRequest.received);
const isAccepted = friendrequests.filter(({_id})=> _id != friendId);
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const alt = theme.palette.background.alt;
  
  


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
    dispatch(setReceivedFriendRequests({friends : isAccepted}));
    dispatch(setFriends({ friends: data }));

  };
  
  const deleteRequest = async () => {
    const response = await fetch(
      `http://localhost:3001/user/friendReq/${id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
     dispatch(setReceivedFriendRequests({ friends: isAccepted }));

  };
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "14px",
        borderBottom: "1px solid #ccc",
        backgroundColor: { background },
        borderRadius: "10px",
        marginTop: "13px",
      }}
    >
      <Avatar alt={name} src={`http://localhost:3001/assets/${picturePath}`} />
      <Typography variant="body1" mr={2}>
        <span style={{ textTransform: "capitalize", fontWeight: "650" }}>
          {name}
        </span>{" "}
        sent you a friend request.
      </Typography>
      <Button
        sx={{ backgroundColor: "green", color: "white" }}
        onClick={patchFriend}
      >
        Confirm
      </Button>
      <Button
        sx={{ backgroundColor: "red", color: "white" }}
        onClick={deleteRequest}
      >
        decline
      </Button>
    </Box>
  );
};

export default FriendRequests;
