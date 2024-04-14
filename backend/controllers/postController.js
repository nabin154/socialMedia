const Post = require("../models/postModel");
const User = require("../models/userModel");

const createPost = async (req, res) => {
  const { userId, description, picturePath } = req.body;

  try {
    const post = Post.create({
      userId,
      description,
      picturePath,
      likes: {},
      comments: [],
    });
    const user = await User.findById(userId);
    if (post) {
      const fullpost = await Post.find({
        $or:
          [{ userId: userId }, { userId: { $in: user.friends } }]
      }).sort({ updatedAt: -1 }).populate("userId", "-password").exec();
      res.status(201).json(fullpost);
    }
  } catch (error) {
    res.status(403).json({ message: error.message });
  }
};
const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const post = await Post.find({
      $or:
        [{ userId: userId }, { userId: { $in: user.friends } }]
    }).sort({ updatedAt: -1 }).populate("userId", "-password").exec();

    return res.status(200).json(post);
  } catch (err) {
    res.status(403).json({ error: err.message });
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
    const { id } = req.params;
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
    await updatedPost.populate("userId", "-password");
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};



const commentOnPost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id;
  console.log(userId);
  const { text } = req.body;
  try {
    const user = await User.findById(userId);
    const post = await Post.findById(postId);
    if (post) {
      post.comments.push({ userId: userId, image: user.picturePath, name: `${user.firstName} ${user.lastName}`, comment: text });
      await post.save();
      await post.populate("userId", "-password");
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


const getAllPostComments = async (req, res) => { }
//   try {
// const postId = req.params.id;
// const post = await Post.findById(postId);
// if(post){
//   return res.status(200).json(post.comments);
// }

//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });

//   }
// }

module.exports = { createPost, getFeedPosts, getUserPosts, likePost, commentOnPost, getAllPostComments };
