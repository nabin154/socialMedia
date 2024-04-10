import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import SendIcon from '@mui/icons-material/Send';
import { Box, Divider, IconButton, Typography, useTheme,InputBase,Avatar  } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  setPost, setPosts } from "../../state/index";

const PostCard = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
  isProfile,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [commentData, setCommentData] = useState();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const loggedInUser = useSelector((state) => state.user);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const users = useSelector((state)=> state.user.friends);
  let commentUsers = [...users, loggedInUser];
  

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    console.log(postId);
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

const handleClick =()=>{
  setIsComments(!isComments);
  // comments.map(({userId, comment})=>(

  // ))
}

const commentOnPost = async () => {
  const response = await fetch(`http://localhost:3001/posts/comment/${postId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: commentData }), 
  });

  const data = await response.json();
  if (data) {
    dispatch(setPost({ post: data }));
  }
  setCommentData('');
};





  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
        postId={postId}
        isProfile={isProfile}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={handleClick}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      {isComments && (
  <Box mt="0.5rem">
      <Divider />

    {comments &&
      comments.map(({ userId,image,name, comment }, i) => {
        // const commentedUser = commentUsers.find(user => user._id === userId);
        return (
          <Box key={`${name}-${i}`} style={{marginTop:'9px',display:'flex',alignItems:'center'}}>
            <Divider />
            
            <Avatar alt="Remy Sharp"  src={`http://localhost:3001/assets/${image}`} />
            <div style={{display:'flex',alignItems:'center'}}> 
            <Typography variant="body2" sx={{ color: main, ml: "0.5rem" ,textAlign:'center',fontWeight:'bold',color:'primary'}}>
                {name} :
              </Typography>
                        <Typography sx={{ color: main, m: "0.5rem 0", pl: "3rem" }}>
              {comment}
            </Typography>
              </div>
             
           
          </Box>
        );
      })}

      <Box style={{display:'flex'}}>
    <InputBase
      placeholder="Leave a comment..."
      sx={{
        width: "90%",
        backgroundColor: palette.neutral.light,
        borderRadius: "2rem",
        padding: '5px',
        textAlign: 'center',
        marginTop:'5px'
      }}
      value={commentData}
      onChange={(e)=>setCommentData(e.target.value)}

    />
  <IconButton onClick={commentOnPost}> <SendIcon/> </IconButton>
  </Box>
  </Box>
)}
    </WidgetWrapper>
  );
};

export default PostCard;
