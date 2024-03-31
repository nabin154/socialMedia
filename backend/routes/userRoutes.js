const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/protectMiddleware");
const {
  getUser,
  getUserFriends,
  getUserFriendRequests,
  addRemoveFriend,
  addRemoveFriendRequests,
} = require("../controllers/userController");


router.route("/:id").get(verifyToken, getUser);
router.route("/:id/friends").get(verifyToken, getUserFriends);
router.route("/:id/friendRequests").get(verifyToken, getUserFriendRequests);
router.route("/:id/:friendId").patch(verifyToken, addRemoveFriend);
router.route("/friendReq/:id/:friendId").patch(verifyToken, addRemoveFriendRequests);


module.exports = router;
