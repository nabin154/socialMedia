import  React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Modal, Typography, useTheme } from "@mui/material";
import {
  
  Notifications,
  
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import state from '../state/index';
import { setFriendRequests } from "../state/index";
import FriendRequests from "./FriendRequests";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const NotificationModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
 const dispatch = useDispatch();
 const { palette } = useTheme();
 const token = useSelector((state) => state.token);
 const friends = useSelector((state) => state.user.friendRequest);
const userId = useSelector((state)=> state.user._id);

  const getFriends = async () => {
    const response = await fetch(
      `http://localhost:3001/user/${userId}/friendRequests`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    console.log(data);
    dispatch(setFriendRequests({ friends: data }));
  };

  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-dep
  return (
    <>
      <Box>
        <IconButton onClick={handleOpen}>
          {" "}
          <Notifications sx={{ fontSize: "25px" }} cursor={"pointer"} />
        </IconButton>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Friend Requests :
            </Typography>
            {friends &&
              friends.map((friend) => (
                <FriendRequests
                  name={`${friend.firstName} ${friend.lastName}`}
                  picturePath = {friend.picturePath}
                  occupation={friend.occupation}
                />
              ))}
          </Box>
        </Modal>
      </Box>
    </>
  );
};
export default NotificationModal;