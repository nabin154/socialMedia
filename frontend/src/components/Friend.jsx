import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriendRequests, setFriends } from "../state/index";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState } from "react";

const Friend = ({ friendId, name, subtitle, userPicturePath, postId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
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
    if (isFriend == undefined) {
      const response = await fetch(
        `http://localhost:3001/user/friendReq/${_id}/${friendId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      //
      console.log(data);
      dispatch(setFriendRequests({friends: data}))
    }
  };
  const addRemoveFriend = async () => {
    const response = await fetch(
      `http://localhost:3001/user/${_id}/${friendId}`,
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
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
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
        (postId ? (
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
