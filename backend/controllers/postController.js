const Post = require("../models/postModel");
const User = require("../models/userModel");


const createPost = async(req, res)=>{
      const { userId, description, picturePath } = req.body;

  console.log(userId);
    try {
      const post = Post.create({
        userId,
        description,
        picturePath,
        
      });
      if(post)
      {
        const fullpost = await Post.find().populate('userId',"-password");

    res.status(201).json(fullpost);

      }



    } catch (error) {
    res.status(409).json({ message: err.message });
        
    }
}
module.exports = {createPost}