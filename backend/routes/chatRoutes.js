const express = require("express");
const { createChat ,accessChat } = require("../controllers/chatController");
const verifyToken = require("../middlewares/protectMiddleware")
const router = express.Router();

router.route('/').get(verifyToken ,accessChat);
router.route('/createchat').get(verifyToken ,createChat);
router.route('/:chatId').post(verifyToken ,accessChat);


module.exports = router;
