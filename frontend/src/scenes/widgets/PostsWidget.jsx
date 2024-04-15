import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/index";
import PostCard from "./PostCard";
import axiosInstance from "../../refreshToken/Token";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    try {
        const response = await axiosInstance.get("http://localhost:3001/posts");
        dispatch(setPosts({ posts: response.data }));
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
};

const getUserPosts = async () => {
  try {
      const response = await axiosInstance.get(`http://localhost:3001/posts/${userId}/posts`);
      dispatch(setPosts({ posts: response.data }));
  } catch (error) {
      console.error('Error fetching user posts:', error);
  }
};

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); 

  return (
    <>
      {posts &&
        posts.map((post) => (
          <PostCard
            key={post._id}
            postId={post._id}
            postUserId={post.userId._id}
            name={`${post.userId.firstName} ${post.userId.lastName}`}
            description={post.description}
            location={post.userId.location}
            picturePath={post.picturePath}
            userPicturePath={post.userId.picturePath}
            likes={post.likes}
            comments={post.comments}
            isProfile={isProfile}
          />
        ))}
    </>
  );
};

export default PostsWidget;
