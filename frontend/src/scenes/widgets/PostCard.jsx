import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme,InputBase,Avatar  } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCommentUsers, setPost, setPosts } from "../../state/index";
import UserImage from "../../components/UserImage";

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
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const users = useSelector((state)=> state.commentUsers);

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

  const getUser = async (userId) => {
  const response = await fetch(`http://localhost:3001/user/${userId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  dispatch(setCommentUsers({user: data}));
}

const handleClick =()=>{
  setIsComments(!isComments);
  comments.map(({userId, comment})=>(
    getUser(userId)

  ))
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
          Width="100%"
          Height="auto"
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
    {comments &&
      comments.map(({ userId, comment }, i) => {
        const commentedUser = users.find(user => user._id === userId);
        return (
          <Box key={`${name}-${i}`} style={{marginTop:'9px',display:'flex',alignItems:'center'}}>
            <Divider />
            
            <Avatar alt="Remy Sharp"  src={`http://localhost:3001/assets/${commentedUser.picturePath}`} />
            <div style={{display:'flex',alignItems:'center'}}> 
            <Typography variant="body2" sx={{ color: main, ml: "0.5rem" ,textAlign:'center',fontWeight:'bold',color:'primary'}}>
                {commentedUser.firstName}{commentedUser.lastName} :
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
  <IconButton onClick={commentOnPost}> X </IconButton></Box>
  </Box>
)}
    </WidgetWrapper>
  );
};

export default PostCard;
