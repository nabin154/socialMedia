const Chat = require("../models/chatModel");


const createChat = async (req, res) => {

    const { friendId } = req.body;
    const userId = req.user._id;
    try {
        if (!friendId) {
            return res.status(404).json("friendId is not sent with the request");
        }
        const chats = await Chat.find({
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: friendId } } },
            ],
        });
        if (chats.length > 0) {
            await chats[0].populate("users", "-password -refreshToken -updatedAt -createdAt");
            return res.status(200).json(chats[0]);
        }
        else {


            if (userId.toString() === friendId.toString()) {
                return res.status(403).json("you can't create the chat with yourself");
            }
            const chat = await Chat.create({
                chatName: "sender",
                users: [userId, friendId],
            });
            if (chat) {
                await chat.populate("users", "-password -refreshToken -updatedAt -createdAt");
                return res.status(200).json(chat);
            }
            else {
                return res.status(403).json("error while creating the chat");
            }
        }
    }
    catch (error) {
        return res.status(500).json("internal server error while accessing/creating the chat");
    }
}

const allChats = async (req, res) => {
    try {

        const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } }).populate("users", "-password -refreshToken -updatedAt -createdAt").sort({ updatedAt: -1 });
        if (chats) {

            return res.status(200).json(chats);
        }
        else {
            return res.status(403).json("error while fetching the chat");
        }

    }
    catch (error) {
        return res.status(500).json("internal server error");
    }
}


module.exports = { createChat, allChats }