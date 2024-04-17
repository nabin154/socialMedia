const express = require("express");
const { createChat ,allChats } = require("../controllers/chatController");
const verifyToken = require("../middlewares/protectMiddleware")
const router = express.Router();

router.route('/').get(verifyToken , allChats);
router.route('/createchat').post(verifyToken ,createChat);


module.exports = router;
