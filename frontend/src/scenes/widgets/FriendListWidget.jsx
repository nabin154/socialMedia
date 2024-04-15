import { Box, Typography, useTheme } from "@mui/material";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "../../state/index";
import axiosInstance from "../../refreshToken/Token";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const friends = useSelector((state) => state.user.friends);


  const getFriends = async () => {
    try {
      const response = await axiosInstance.get(`http://localhost:3001/user/${userId}/friends`);
      const { data } = response;
      dispatch(setFriends({friends : data})); 
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };
  useEffect(() => {
    getFriends();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends &&
          friends.map((friend,index) => (
            <Friend
              key={index}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              subtitle={friend.occupation}
              userPicturePath={friend.picturePath}
              postId={''}
            />
          ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
