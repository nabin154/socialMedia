const Post = require("../models/postModel");
const User = require("../models/userModel");

const createPost = async (req, res) => {
  const { userId, description, picturePath } = req.body;

  console.log(userId);
  try {
    const post = Post.create({
      userId,
      description,
      picturePath,
      likes: {},
      comments: [],
    });
    if (post) {
      const fullpost = await Post.find().populate("userId", "-password");

      res.status(201).json(fullpost);
    }
  } catch (error) {
    res.status(409).json({ message: err.message });
  }
};

const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find().populate("userId", "-password");
    return res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId }).populate("userId", "-password");
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params.id;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
module.exports = { createPost, getFeedPosts, getUserPosts ,likePost};
