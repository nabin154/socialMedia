const Message = require("../models/messageModel");

const sendMessage = async (req, res) => {
    const { content, chatId } = req.body;
    try {
        if (!content || !chatId) {
            return res.status(401).json("error sending the message");
        }
        const message = await Message.create({
            sender: req.user._id,
            content: content,
            chatId: chatId,
        });
        if (message) {
            var fullmessage = await message.populate("sender", '-password -refreshToken');
            fullmessage = await fullmessage.populate("chatId");
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
        const messages = await Message.find({ chatId: chatId });
        const fullmessage = await messages.populate("chatId").populate("sender", "-password -refreshToken");
        if (fullmessage) {
            return res.status(201).json(fullmessage);
        }
        else {
            return res.status(401).json("error fetching the message");

        }
    } catch (error) {
        return res.status(500).json("internal server error");

    }
}

module.exports = { sendMessage, allMessages }