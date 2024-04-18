import { Box, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../navbar/navbar";
import UserWidget from "../widgets/UserWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import AdvertWidget from "../widgets/Advertisement";
import FriendListWidget from "../widgets/FriendListWidget";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { setMessages, setOnlineUsers } from "../../state";
import OnelineUsersList from "../widgets/OnlineUsersList";
var socket;

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const messages = useSelector((state) => state.messages);

  useEffect(() => {
    socket = io('http://localhost:3001');
    socket.emit("user setup", user);
    socket.on("online users", (users) => {

      const friends = users.filter(([id, friend]) => {
        return friend._id != _id;
      })
      dispatch(setOnlineUsers(friends));
    })

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("message received", (newMessage) => {
      console.log("Message received from server:", newMessage);
      dispatch(setMessages([...messages, newMessage]));
    });

    return () => {
      socket.off('message received');
    };
  });



  return (
    <Box>
      <Navbar />

      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
          <OnelineUsersList />

        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget userId={_id} />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>

    </Box>
  );
};

export default HomePage;
