const express = require("express");
const { getFeedPosts , getUserPosts, likePost,commentOnPost}  = require("../controllers/postController");
const verifyToken  = require("../middlewares/protectMiddleware");


const router = express.Router();

router.get("/",verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);
router.patch("/:id/like", verifyToken, likePost);
router.patch("/comment/:id",verifyToken, commentOnPost);


module.exports = router;