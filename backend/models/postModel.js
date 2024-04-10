const mongoose =require( "mongoose");

const postSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    description: String,
    picturePath: String,
    likes: {
      type: Map,
      of: Boolean,
    },
  
    comments: [
      {userId :{type: String},image :{type: String},name :{type: String}, comment : {type: String}}
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
