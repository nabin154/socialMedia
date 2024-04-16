const express = require("express");
const { createChat ,accessChat,allChats } = require("../controllers/chatController");
const verifyToken = require("../middlewares/protectMiddleware")
const router = express.Router();

router.route('/').get(verifyToken , allChats);
router.route('/:chatId').get(verifyToken ,accessChat);
router.route('/createchat').post(verifyToken ,createChat);


module.exports = router;
