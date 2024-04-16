const express = require("express");
const router = express.Router();
const { sendMessage, allMessages } = require("../controllers/messageController.js");
const verifyToken = require("../middlewares/protectMiddleware.js")

router.route('/:chatId').get(verifyToken, allMessages);
router.route('/sendmessage').post(verifyToken, sendMessage);

module.exports = router;