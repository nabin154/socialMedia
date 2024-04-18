import { Box, Typography, useTheme } from "@mui/material";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";


const OnelineUsersList = () => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const onlineUsers = useSelector((state)=>state.onlineUsers);
 
  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Online Users:
      </Typography>
      
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {onlineUsers &&
          onlineUsers.map(([socketid,friend]) => (
            <Friend
              key={friend._id}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              subtitle={friend.occupation}
              userPicturePath={friend.picturePath}
              post={''}
              online={'yes'}
            />
          ))}
      </Box>

    </WidgetWrapper>
  );
};

export default OnelineUsersList;
