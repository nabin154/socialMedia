import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends, setReceivedFriendRequests, setSentFriendRequests } from "../state/index";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState } from "react";
import PeopleIcon from "@mui/icons-material/People";
import axiosInstance from "../refreshToken/Token";


const Friend = ({ friendId, name, subtitle, userPicturePath, postId, isProfile }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const friends = useSelector((state) => state.user.friendRequest.sent);
  const loggedInUserId = useSelector((state) => state.user._id);
  const friendsArr = useSelector((state) => state.user.friends);
  const isFriend = friendsArr.find((friend) => friend._id === friendId);
  const isFriendRequestSent = friends && friends.find((id)=> id === friendId);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;


  const patchFriend = async () => {
    if (isFriend === undefined) {
        try {
            const response = await axiosInstance.patch(
                `http://localhost:3001/user/friendReq/${_id}/${friendId}`);
            const data = response.data;
            const { sent, received } = data;
            dispatch(setReceivedFriendRequests({ friends: received }));
            dispatch(setSentFriendRequests({ friends: sent }));
        } catch (error) {
            console.error('Error patching friend:', error);
        }
    }
};

  const addRemoveFriend = async () => {
    try {
        const response = await axiosInstance.patch(
            `http://localhost:3001/user/${_id}/${friendId}`);
        const data = response.data; 
        dispatch(setFriends({ friends: data }));
    } catch (error) {
        console.error('Error adding/removing friend:', error);
    }
};


  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
           
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {loggedInUserId != friendId &&
        !isProfile &&
        (postId ? (
          isFriend ? (
            <IconButton>
              <PeopleIcon sx={{ color: primaryDark }} />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => patchFriend()}
              sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
            >
              {isFriendRequestSent ? (
                <CheckCircleIcon sx={{ color: primaryDark }} />
              ) : (
                <PersonAddOutlined sx={{ color: primaryDark }} />
              )}
            </IconButton>
          )
        ) : (
          <IconButton
            onClick={() => addRemoveFriend()}
            sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
          >
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          </IconButton>
        ))}
    </FlexBetween>
  );
};

export default Friend;
