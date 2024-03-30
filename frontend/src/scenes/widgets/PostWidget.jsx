import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../../state/index";
import PostCard from "./PostCard";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await fetch("http://localhost:3001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    console.log(data);
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts.map(
        ({ _id, userId, description, picturePath, likes, comments }) => (
          <PostCard
            key={_id}
            postId={_id}
            postUserId={userId._id}
            name={`${userId.firstName} ${userId.lastName}`}
            description={description}
            location={userId.location}
            picturePath={picturePath}
            userPicturePath={userId.picturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default PostsWidget;
