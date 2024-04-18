const Message = require("../models/messageModel");

const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;
    try {
        if (!content || !chatId) {
            return res.status(401).json("chatId or content missing !");
        }
        const message = await Message.create({
            sender: req.user._id,
            content: content,
            chatId: chatId,
        });
        if (message) {
            var fullmessage = await message.populate("sender", '_id firstName lastName picturePath ');
            fullmessage = await fullmessage.populate("chatId",'-updatedAt -createdAt');
            return res.status(201).json(fullmessage);
        }
        else {
            return res.status(401).json("error sending the message");

        }
    } catch (error) {
        return res.status(500).json("internal server error while sending message");

    }
};


const allMessages = async (req, res) => {
    const { chatId } = req.params;
    try {
        const messages = await Message.find({ chatId: chatId }).populate("sender", '_id firstName lastName picturePath ').populate("chatId",'-updatedAt -createdAt');
        if (messages) {
            // var fullmessage = await messages.populate("sender", '-password -refreshToken');
            // fullmessage = await messages.populate("chatId");
            return res.status(201).json(messages);
        }
        else {
            return res.status(401).json("error fetching the message");

        }
    } catch (error) {
        return res.status(500).json("internal server error!!");

    }
}

module.exports = { sendMessage, allMessages }