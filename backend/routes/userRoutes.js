const express = require("express");
const router = express.Router();
const {verifyToken} = require("../middlewares/protectMiddleware");


router.route("/:id").get(verifyToken, getUser);
router.route("/:id/friends").get(verifyToken, getUserFriends);
router.route("/:id/:friendId").patch(verifyToken, addRemoveFriend);


module.exports = router;
