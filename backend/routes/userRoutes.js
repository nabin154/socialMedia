const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/protectMiddleware");
const {getUser, getUserFriends, addRemoveFriend} = require("../controllers/userController");


router.route("/:id").get( getUser);
router.route("/:id/friends").get( getUserFriends);
router.route("/:id/:friendId").patch( addRemoveFriend);


module.exports = router;
