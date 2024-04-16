const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");


const createChat = async (req, res) => {

    const { friendId } = req.body;
    const userId = req.user._id;
    try {
        if (!friendId) {
            return res.status(404).json("friendId is not sent with the request")
        }
        const chat = await Chat.create({
            chatName: "sender",
            users: [userId, friendId],
        });
        if (chat) {
            await chat.populate("users", "-password -refreshToken");
            res.status(200).json(chat);
        }
        else {
            return res.status(403).json("error while creating the chat");
        }

    }
    catch (error) {
        return res.status(500).json("internal server error");
    }
}

const accessChat = async (req, res) => {

    const { chatId } = req.params;
    try {
        if (!chatId) {
            return res.status(404).json("chatId is not sent with the request")
        }
        const chat = await Chat.findById(chatId);
        if (chat) {
            await chat.populate("users", "-password -refreshToken");
            res.status(200).json(chat);
        }
        else {
            return res.status(403).json("error while creating the chat");
        }

    }
    catch (error) {
        return res.status(500).json("internal server error");
    }
}


module.exports = { createChat,accessChat }